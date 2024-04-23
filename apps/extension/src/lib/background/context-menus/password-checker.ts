import { match } from "ts-pattern"

import { MESSAGE_TYPES } from "../constants"

export type PasswordAnalysisResult = {
  isBreached: boolean
  breachCount: number
}

export const initializePasswordCheckerContextMenu = () => {
  chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
      id: "passwordCheckerContextMenu",
      title: "Verify password",
      contexts: ["editable"],
      documentUrlPatterns: ["http://*/*", "https://*/*"]
    })
  })

  chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    if (!tab?.id) {
      return
    }
    const tabId = tab.id
    if (info.menuItemId === "passwordCheckerContextMenu") {
      chrome.tabs.sendMessage(tabId, {
        type: MESSAGE_TYPES.VERIFY_PASSWORD_START
      })

      const password = info.selectionText

      fetch(`http://localhost:3000/api/analyze/password?q=${password}`)
        .then((res) => {
          const result = res.json()
          return result
        })
        .then((data: PasswordAnalysisResult) => {
          match(data.isBreached)
            .with(true, () => {
              chrome.tabs.sendMessage(tabId, {
                type: MESSAGE_TYPES.VERIFY_PASSWORD_RESULT,
                payload: {
                  result: `Password has been breached ${data.breachCount} times!`,
                  icon: "💀"
                }
              })
            })
            .with(false, () => {
              chrome.tabs.sendMessage(tabId, {
                type: MESSAGE_TYPES.VERIFY_PASSWORD_RESULT,
                payload: {
                  result: "Password is safe!",
                  icon: "🔒"
                }
              })
            })
        })
        .catch(() => {
          chrome.tabs.sendMessage(tabId, {
            type: MESSAGE_TYPES.VERIFY_PASSWORD_ERROR
          })
        })
    }
  })
}
