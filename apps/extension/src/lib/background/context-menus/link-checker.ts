import { match } from "ts-pattern"

import { MESSAGE_TYPES } from "../constants"

export type UrlAnalysisResult =
  | "malicious"
  | "suspicious"
  | "unknown"
  | "benign"

export const initializeLinkCheckerContextMenu = () => {
  chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
      id: "linkCheckerContextMenu",
      title: "Verify link",
      contexts: ["link"],
      documentUrlPatterns: ["http://*/*", "https://*/*"]
    })
  })

  chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    if (!tab?.id) {
      return
    }
    const tabId = tab.id
    if (info.menuItemId === "linkCheckerContextMenu") {
      chrome.tabs.sendMessage(tabId, {
        type: MESSAGE_TYPES.VERIFY_LINK_START
      })

      const url = new URL(info.linkUrl as string)

      fetch(`http://localhost:3000/api/analyze/url?q=${url}`)
        .then((res) => {
          const result = res.json()
          return result
        })
        .then((data: { summary: UrlAnalysisResult }) => {
          match(data.summary)
            .with("malicious", () => {
              chrome.tabs.sendMessage(tabId, {
                type: MESSAGE_TYPES.VERIFY_LINK_RESULT,
                payload: {
                  result: "Link is malicious!",
                  icon: "💀"
                }
              })
            })
            .with("suspicious", () => {
              chrome.tabs.sendMessage(tabId, {
                type: MESSAGE_TYPES.VERIFY_LINK_RESULT,
                payload: {
                  result: "Link looks suspicious!",
                  icon: "🤨"
                }
              })
            })
            .with("unknown", () => {
              chrome.tabs.sendMessage(tabId, {
                type: MESSAGE_TYPES.VERIFY_LINK_RESULT,
                payload: {
                  result: "Unknown link! Probably safe to click.",
                  icon: "🫤"
                }
              })
            })
            .with("benign", () => {
              chrome.tabs.sendMessage(tabId, {
                type: MESSAGE_TYPES.VERIFY_LINK_RESULT,
                payload: {
                  result: "Safe link!",
                  icon: "👍🏼"
                }
              })
            })
        })
        .catch(() => {
          chrome.tabs.sendMessage(tabId, {
            type: MESSAGE_TYPES.VERIFY_LINK_ERROR
          })
        })
    }
  })
}
