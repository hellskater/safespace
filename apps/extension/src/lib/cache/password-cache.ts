import { PasswordAnalysisResult } from "../background/context-menus/password-checker"

export const getPasswordResultFromCache = async (password: string) => {
  try {
    const passwordHits = (await chrome.storage.local.get("passwordHits")) as {
      passwordHits: {
        [key: string]: PasswordAnalysisResult
      }
    }

    return passwordHits.passwordHits[password] ?? null
  } catch (error) {
    console.error("Error fetching password result from cache", error)
    return null
  }
}

export const savePasswordResultToCache = async (
  password: string,
  result: PasswordAnalysisResult
) => {
  try {
    const passwordHits = (await chrome.storage.local.get("passwordHits")) as {
      passwordHits: {
        [key: string]: PasswordAnalysisResult
      }
    }

    if (!passwordHits.passwordHits) {
      passwordHits.passwordHits = {}
    }

    if (!passwordHits.passwordHits[password]) {
      passwordHits.passwordHits[password] = {} as PasswordAnalysisResult
    }

    passwordHits.passwordHits[password] = result
    await chrome.storage.local.set(passwordHits)
  } catch (error) {
    console.error("Error saving password result to cache", error)
  }
}
