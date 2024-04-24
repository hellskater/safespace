import { UrlAnalysisResult } from "../background/context-menus/link-checker"

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
