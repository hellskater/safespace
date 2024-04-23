import {
  getPasswordResultFromCache,
  savePasswordResultToCache
} from "@/lib/cache/password-cache"
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

      if (!password) {
        chrome.tabs.sendMessage(tabId, {
          type: MESSAGE_TYPES.VERIFY_PASSWORD_ERROR
        })
        return
      }

      getPasswordResultFromCache(password).then((cachedResult) => {
        let finalResult: null | PasswordAnalysisResult = null

        console.log("cachedResult", cachedResult)

        if (cachedResult) {
          finalResult = cachedResult

          if (finalResult) {
            match(finalResult.isBreached)
              .with(true, () => {
                chrome.tabs.sendMessage(tabId, {
                  type: MESSAGE_TYPES.VERIFY_PASSWORD_RESULT,
                  payload: {
                    result: `Password has been breached ${finalResult?.breachCount} times!`,
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
          }
        } else {
          fetch(`http://localhost:3000/api/analyze/password?q=${password}`)
            .then((res) => {
              const result = res.json()
              return result
            })
            .then((data: PasswordAnalysisResult) => {
              savePasswordResultToCache(password, data).then(() => {
                finalResult = data

                if (finalResult) {
                  match(finalResult.isBreached)
                    .with(true, () => {
                      chrome.tabs.sendMessage(tabId, {
                        type: MESSAGE_TYPES.VERIFY_PASSWORD_RESULT,
                        payload: {
                          result: `Password has been breached ${finalResult?.breachCount} times!`,
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
                }
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
  })
}
