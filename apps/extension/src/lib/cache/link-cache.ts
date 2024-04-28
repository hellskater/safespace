import { type UrlAnalysisResult } from "../background/context-menus/link-checker"

export const getUrlResultFromCache = async (url: string) => {
  try {
    const urlHits = (await chrome.storage.local.get("urlHits")) as {
      urlHits: {
        [key: string]: {
          summary: UrlAnalysisResult
          score: number
        }
      }
    }

    return urlHits.urlHits[url] ?? null
  } catch (error) {
    console.error("Error fetching url result from cache", error)
    return null
  }
}

export const getAllUrlsFromCache = async () => {
  try {
    const urlHits = (await chrome.storage.local.get("urlHits")) as {
      urlHits: {
        [key: string]: {
          summary: UrlAnalysisResult
          score: number
        }
      }
    }

    return urlHits.urlHits ?? {}
  } catch (error) {
    console.error("Error fetching all url results from cache", error)
    return {}
  }
}

export const clearUrlResultsFromCache = async () => {
  try {
    await chrome.storage.local.remove("urlHits")
  } catch (error) {
    console.error("Error clearing url results from cache", error)
  }
}

export const saveUrlResultToCache = async (
  url: string,
  result: {
    summary: UrlAnalysisResult
    score: number
  }
) => {
  try {
    const urlHits = (await chrome.storage.local.get("urlHits")) as {
      urlHits: {
        [key: string]: {
          summary: UrlAnalysisResult
          score: number
        }
      }
    }

    if (!urlHits.urlHits) {
      urlHits.urlHits = {}
    }

    if (!urlHits.urlHits[url]) {
      urlHits.urlHits[url] = {} as {
        summary: UrlAnalysisResult
        score: number
      }
    }

    urlHits.urlHits[url] = result
    await chrome.storage.local.set(urlHits)
  } catch (error) {
    console.error("Error saving url result to cache", error)
  }
}
