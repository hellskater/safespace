import {
  getDomainResultFromCache,
  saveDomainResultToCache
} from "../cache/domain-cache"

function isRedirect(status: number) {
  return status >= 300 && status < 400
}

export const ICON_RELATIVE_PATH = "../../assets/"

export const SECURITY_HEADERS = [
  "Content-Security-Policy",
  "Permissions-Policy",
  "Referrer-Policy",
  "Strict-Transport-Security",
  "X-Content-Type-Options",
  "X-Frame-Options"
]

export type SecurityReport = {
  finalScore: number
  finalCategory: "Robust" | "Medium" | "Low"
  securityHeadersReport: {
    headers: Record<
      string,
      {
        implemented: boolean
        score: number
        value: string
        category: "Robust" | "Medium" | "Low"
        positiveFeedback: string[]
        negativeFeedback: string[]
      }
    >
    overallScore: number
    category: "Robust" | "Medium" | "Low"
  }
  domainReport: {
    name: string
    score: number
    category: "Robust" | "Medium" | "Low"
  }
}

function calculateSecurityHeadersScore(
  headers: chrome.webRequest.HttpHeader[]
) {
  let score = 10 // Start with a maximum possible score
  const headerDetails = {} as Record<
    string,
    {
      implemented: boolean
      score: number
      value: string
      category: "Robust" | "Medium" | "Low"
      positiveFeedback: string[]
      negativeFeedback: string[]
    }
  >

  // Initialize all headers with default details
  SECURITY_HEADERS.forEach((header) => {
    headerDetails[header.toLowerCase()] = {
      implemented: false,
      score: 0,
      value: "",
      category: "" as "Robust" | "Medium" | "Low",
      positiveFeedback: [],
      negativeFeedback: []
    }
  })

  headers.forEach((header) => {
    const headerName = header.name.toLowerCase()
    if (headerDetails.hasOwnProperty(headerName)) {
      const targetHeader = headerDetails[headerName]
      if (targetHeader) {
        targetHeader.value = header.value || ""
        targetHeader.implemented = true // Mark this header as observed
        let headerScore = 0

        switch (headerName) {
          case "content-security-policy":
            if (header.value?.includes("default-src 'self';")) {
              headerScore += 3
              targetHeader.positiveFeedback.push(
                "Good CSP: Only allows self as source."
              )
            }
            if (
              header.value?.includes("unsafe-inline") ||
              header.value?.includes("unsafe-eval") ||
              header.value?.includes("*")
            ) {
              headerScore -= 2
              targetHeader.negativeFeedback.push(
                "Insecure CSP: Includes 'unsafe-inline', 'unsafe-eval', or '*'."
              )
            }
            break
          case "permissions-policy":
            if (
              header.value?.includes("geolocation=()") &&
              header.value?.includes("microphone=()")
            ) {
              headerScore += 2
              targetHeader.positiveFeedback.push(
                "Restrictive Permissions-Policy: Disables geolocation and microphone."
              )
            }
            if (header.value?.includes("*")) {
              headerScore -= 2
              targetHeader.negativeFeedback.push(
                "Overly permissive Permissions-Policy: Allows all features."
              )
            }
            break
          case "referrer-policy":
            if (
              header.value?.includes("no-referrer") ||
              header.value?.includes("strict-origin-when-cross-origin")
            ) {
              headerScore += 2
              targetHeader.positiveFeedback.push(
                "Secure Referrer-Policy: Limits referrer information."
              )
            }
            break
          case "strict-transport-security":
            if (header.value?.includes("max-age=31536000")) {
              headerScore += 2
              targetHeader.positiveFeedback.push(
                "Strong HSTS: Long duration enforced."
              )
            }
            break
          case "x-content-type-options":
            if (header.value?.toLowerCase() === "nosniff") {
              headerScore += 2
              targetHeader.positiveFeedback.push(
                "X-Content-Type-Options set to nosniff: Prevents MIME type sniffing."
              )
            }
            break
          case "x-frame-options":
            if (
              header.value?.toLowerCase() === "deny" ||
              header.value?.toLowerCase() === "sameorigin"
            ) {
              headerScore += 2
              targetHeader.positiveFeedback.push(
                "Secure X-Frame-Options: Protects against clickjacking."
              )
            }
            break
          default:
            break
        }

        targetHeader.score = headerScore
        score += headerScore // Add the header score to the total score
      }
    }
  })

  // Deduct points for each important security header not observed and not any negative feedback
  Object.keys(headerDetails).forEach((header) => {
    const targetHeader = headerDetails[header]
    if (targetHeader && !targetHeader.implemented) {
      score -= 1
      targetHeader.score = -1
      targetHeader.negativeFeedback.push(
        `Missing Security Header: ${header} is not implemented.`
      )
    }

    if (targetHeader) {
      // Assign the category depending on the final score of the header
      if (targetHeader.score > 0) {
        targetHeader.category = "Robust"
      } else if (targetHeader.score === 0) {
        targetHeader.category = "Medium"
      } else {
        targetHeader.category = "Low"
      }
    }
  })

  // Normalize and constrain the score to a 1-5 range
  score = Math.max(1, Math.min(Math.floor((score / 18) * 5), 5))

  // Determine the security level category
  let category: "Robust" | "Medium" | "Low"
  if (score >= 4) {
    category = "Robust"
  } else if (score >= 2) {
    category = "Medium"
  } else {
    category = "Low"
  }

  return { headers: headerDetails, overallScore: score, category }
}

const calculateDomainScore = (domainType: DomainAnalysisResult) => {
  let score = 5
  let category: "Robust" | "Medium" | "Low" = "Robust"
  if (domainType === "malicious") {
    score = -1
    category = "Low"
  } else if (domainType === "unknown") {
    score = 4
    category = "Medium"
  }

  return { score, category }
}

export type DomainAnalysisResult =
  | "benign"
  | "malicious"
  | "suspicious"
  | "unknown"

function calculateFinalScore(
  securityHeaders: chrome.webRequest.HttpHeader[],
  domainData: {
    name: string
    type: DomainAnalysisResult
  }
): SecurityReport {
  const securityHeadersReport = calculateSecurityHeadersScore(securityHeaders)
  const securityHeadersScore = securityHeadersReport.overallScore

  const domainReport = calculateDomainScore(domainData.type)
  const domainScore = domainReport.score

  // Calculate the average of the scores
  const totalScore = (securityHeadersScore + domainScore) / 2

  // Normalize to a score out of 5 (already in that scale, so just rounding for precision)
  const normalizedScore = Math.round(totalScore * 10) / 10 // Rounds to one decimal place

  // Determine the category based on the final score
  let category: "Robust" | "Medium" | "Low"
  if (normalizedScore >= 4) {
    category = "Robust"
  } else if (normalizedScore >= 2) {
    category = "Medium"
  } else {
    category = "Low"
  }

  return {
    finalScore: normalizedScore,
    finalCategory: category,
    securityHeadersReport,
    domainReport: {
      name: domainData.name,
      score: domainScore,
      category: domainReport.category
    }
  }
}

export const logHeaders = () => {
  chrome.webRequest.onHeadersReceived.addListener(
    function (details) {
      if (!details.responseHeaders || isRedirect(details.statusCode)) {
        return
      }
      const url = new URL(details.url)
      const domain = url.hostname
      if (details.type === "main_frame") {
        const securityHeaders = details.responseHeaders.filter((header) =>
          SECURITY_HEADERS.map((header) => header.toLowerCase()).includes(
            header.name.toLowerCase()
          )
        )

        getDomainResultFromCache(domain).then((cachedResult) => {
          let finalReport = null
          if (cachedResult) {
            finalReport = calculateFinalScore(securityHeaders, {
              name: domain,
              type: cachedResult.summary
            })

            if (finalReport) {
              performFinalAction(finalReport, domain, details)
            }
          } else {
            fetch(`http://localhost:3000/api/analyze/domain?q=${domain}`)
              .then((res) => res.json())
              .then(
                (data: { summary: DomainAnalysisResult; score: number }) => {
                  saveDomainResultToCache(domain, data).then(() => {
                    finalReport = calculateFinalScore(securityHeaders, {
                      name: domain,
                      type: data.summary
                    })

                    if (finalReport) {
                      performFinalAction(finalReport, domain, details)
                    }
                  })
                }
              )
          }
        })
      }
    },
    { urls: ["<all_urls>"], types: ["main_frame"] },
    ["responseHeaders", "extraHeaders"]
  )
}
function performFinalAction(
  finalReport: SecurityReport,
  domain: string,
  details: chrome.webRequest.WebResponseHeadersDetails
) {
  chrome.storage.local.set({
    [domain]: { report: finalReport }
  })

  if (finalReport.finalCategory) {
    const currentTabId = details.tabId
    const imageFileName = `${finalReport.finalCategory.toLowerCase()}`
    chrome.action.setIcon({
      path: {
        16: `${ICON_RELATIVE_PATH}${imageFileName}16.png`,
        32: `${ICON_RELATIVE_PATH}${imageFileName}32.png`,
        48: `${ICON_RELATIVE_PATH}${imageFileName}48.png`,
        128: `${ICON_RELATIVE_PATH}${imageFileName}128.png`
      },
      tabId: currentTabId
    })
  }
}
