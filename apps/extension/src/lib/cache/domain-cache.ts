import { type DomainAnalysisResult } from "../background/security-headers"

export const getDomainResultFromCache = async (domain: string) => {
  try {
    const domainHits = (await chrome.storage.local.get("domainHits")) as {
      domainHits: {
        [key: string]: {
          score: number
          summary: DomainAnalysisResult
        }
      }
    }

    return domainHits.domainHits[domain] ?? null
  } catch (error) {
    console.error("Error fetching domain result from cache", error)
    return null
  }
}

export const getAllDomainResultsFromCache = async () => {
  try {
    const domainHits = (await chrome.storage.local.get("domainHits")) as {
      domainHits: {
        [key: string]: {
          score: number
          summary: DomainAnalysisResult
        }
      }
    }

    return domainHits.domainHits ?? {}
  } catch (error) {
    console.error("Error fetching all domain results from cache", error)
    return {}
  }
}

export const clearDomainResultsFromCache = async () => {
  try {
    await chrome.storage.local.remove("domainHits")
  } catch (error) {
    console.error("Error clearing domain results from cache", error)
  }
}

export const saveDomainResultToCache = async (
  domain: string,
  result: { score: number; summary: DomainAnalysisResult }
) => {
  try {
    const domainHits = (await chrome.storage.local.get("domainHits")) as {
      domainHits: {
        [key: string]: {
          score: number
          summary: DomainAnalysisResult
        }
      }
    }

    if (!domainHits.domainHits) {
      domainHits.domainHits = {}
    }

    if (!domainHits.domainHits[domain]) {
      domainHits.domainHits[domain] = {} as {
        score: number
        summary: DomainAnalysisResult
      }
    }

    domainHits.domainHits[domain] = result
    await chrome.storage.local.set(domainHits)
  } catch (error) {
    console.error("Error saving domain result to cache", error)
  }
}
