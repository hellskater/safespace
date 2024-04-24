import {
  getUrlResultFromCache,
  saveUrlResultToCache
} from "@/lib/cache/link-cache"
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

      if (!url) {
        chrome.tabs.sendMessage(tabId, {
          type: MESSAGE_TYPES.VERIFY_LINK_ERROR
        })
        return
      }

      getUrlResultFromCache(url.toString()).then((cachedResult) => {
        let finalResult: null | {
          summary: UrlAnalysisResult
          score: number
        } = null

        if (cachedResult) {
          finalResult = cachedResult

          if (finalResult) {
            performFinalAction(finalResult, tabId)
          }
        } else {
          fetch(`http://localhost:3000/api/analyze/url?q=${url}`)
            .then((res) => {
              const result = res.json()
              return result
            })
            .then((data: { summary: UrlAnalysisResult; score: number }) => {
              saveUrlResultToCache(url.toString(), data).then(() => {
                finalResult = data

                if (finalResult) {
                  performFinalAction(finalResult, tabId)
                }
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
  })
}

function performFinalAction(
  finalResult: { summary: UrlAnalysisResult; score: number },
  tabId: number
) {
  match(finalResult.summary)
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
}
