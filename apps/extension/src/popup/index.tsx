import { SecurityReport } from "@/lib/background/security-headers"
import { cn } from "@repo/ui/lib/utils"
import { useEffect, useState } from "react"
import { match } from "ts-pattern"

import { DEFAULT_LAYOUT_STYLES } from "../lib/constants"

import "@repo/ui/globals.css"
import "../styles/index.css"

const demoData = {
  domainReport: {
    category: "Medium",
    score: 4
  },
  finalCategory: "Medium",
  finalScore: 2.5,
  securityHeadersReport: {
    category: "Low",
    headers: {
      "content-security-policy": {
        actionableFeedback: [
          "Consider implementing the content-security-policy header."
        ],
        category: "Low",
        implemented: false,
        negativeFeedback: [
          "Missing Security Header: content-security-policy is not implemented."
        ],
        positiveFeedback: [],
        score: -1
      },
      "permissions-policy": {
        actionableFeedback: [
          "Consider implementing the permissions-policy header."
        ],
        category: "Low",
        implemented: false,
        negativeFeedback: [
          "Missing Security Header: permissions-policy is not implemented."
        ],
        positiveFeedback: [],
        score: -1
      },
      "referrer-policy": {
        actionableFeedback: [
          "Consider implementing the referrer-policy header."
        ],
        category: "Low",
        implemented: false,
        negativeFeedback: [
          "Missing Security Header: referrer-policy is not implemented."
        ],
        positiveFeedback: [],
        score: -1
      },
      "strict-transport-security": {
        actionableFeedback: [
          "Consider implementing the strict-transport-security header."
        ],
        category: "Low",
        implemented: false,
        negativeFeedback: [
          "Missing Security Header: strict-transport-security is not implemented."
        ],
        positiveFeedback: [],
        score: -1
      },
      "x-content-type-options": {
        actionableFeedback: [
          "Consider implementing the x-content-type-options header."
        ],
        category: "Low",
        implemented: false,
        negativeFeedback: [
          "Missing Security Header: x-content-type-options is not implemented."
        ],
        positiveFeedback: [],
        score: -1
      },
      "x-frame-options": {
        actionableFeedback: [
          "Consider implementing the x-frame-options header."
        ],
        category: "Low",
        implemented: false,
        negativeFeedback: [
          "Missing Security Header: x-frame-options is not implemented."
        ],
        positiveFeedback: [],
        score: -1
      }
    },
    overallScore: 1
  }
}

function IndexPopup() {
  const [data, setData] = useState<SecurityReport | null>(null)

  useEffect(() => {
    chrome.storage.local.get("report", (result) => {
      setData(result.report as SecurityReport)
    })
  }, [])

  const themeColor = match(data?.finalCategory)
    .with("Robust", () => "bg-red-500")
    .with("Medium", () => "bg-yellow-500/70")
    .with("Low", () => "bg-green-500")
    .otherwise(() => "bg-gray-500")

  console.log(data)

  return (
    <div className={cn(DEFAULT_LAYOUT_STYLES)}>
      <div className={cn(themeColor, "h-60")}></div>
    </div>
  )
}

export default IndexPopup
