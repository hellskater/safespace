function isRedirect(status: number) {
  return status >= 300 && status < 400
}

export const SECURITY_HEADERS = [
  "Content-Security-Policy",
  "Permissions-Policy",
  "Referrer-Policy",
  "Strict-Transport-Security",
  "X-Content-Type-Options",
  "X-Frame-Options"
]

function calculateSecurityHeadersScore(
  headers: chrome.webRequest.HttpHeader[]
) {
  let score = 10 // Start with a maximum possible score
  const headerDetails = {} as Record<
    string,
    {
      implemented: boolean
      score: number
      category: string
      actionableFeedback: string[]
      positiveFeedback: string[]
      negativeFeedback: string[]
    }
  >

  // Initialize all headers with default details
  SECURITY_HEADERS.forEach((header) => {
    headerDetails[header.toLowerCase()] = {
      implemented: false,
      score: 0,
      category: "",
      actionableFeedback: [],
      positiveFeedback: [],
      negativeFeedback: []
    }
  })

  headers.forEach((header) => {
    const headerName = header.name.toLowerCase()
    if (headerDetails.hasOwnProperty(headerName)) {
      const targetHeader = headerDetails[headerName]
      if (targetHeader) {
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
              targetHeader.actionableFeedback.push(
                "Consider removing 'unsafe-inline', 'unsafe-eval', or '*' from the CSP."
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
              targetHeader.actionableFeedback.push(
                "Consider restricting the Permissions-Policy to only the necessary features."
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
      targetHeader.actionableFeedback.push(
        `Consider implementing the ${header} header.`
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
  let category
  if (score >= 4) {
    category = "Robust"
  } else if (score >= 2) {
    category = "Medium"
  } else {
    category = "Low"
  }

  return { headers: headerDetails, overallScore: score, category }
}

function calculateFinalScore(securityHeaders: chrome.webRequest.HttpHeader[]) {
  const securityHeadersReport = calculateSecurityHeadersScore(securityHeaders)
  const securityHeadersScore = securityHeadersReport.overallScore

  // Calculate the average of the scores
  const totalScore = securityHeadersScore / 1

  // Normalize to a score out of 5 (already in that scale, so just rounding for precision)
  const normalizedScore = Math.round(totalScore * 10) / 10 // Rounds to one decimal place

  // Determine the category based on the final score
  let category
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
    securityHeadersReport
  }
}

export const logHeaders = () => {
  chrome.webRequest.onHeadersReceived.addListener(
    function (details) {
      if (!details.responseHeaders || isRedirect(details.statusCode)) {
        return
      }
      if (details.type === "main_frame") {
        const securityHeaders = details.responseHeaders.filter((header) =>
          SECURITY_HEADERS.map((header) => header.toLowerCase()).includes(
            header.name.toLowerCase()
          )
        )

        const finalReport = calculateFinalScore(securityHeaders)

        console.log("Security report:", finalReport)
      }
    },
    { urls: ["<all_urls>"], types: ["main_frame"] },
    ["responseHeaders", "extraHeaders"]
  )
}
