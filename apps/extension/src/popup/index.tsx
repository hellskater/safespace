import {
  ICON_RELATIVE_PATH,
  SecurityReport
} from "@/lib/background/security-headers"
import { cn } from "@repo/ui/lib/utils"
import { useEffect, useState } from "react"
import { match } from "ts-pattern"

import { DEFAULT_LAYOUT_STYLES } from "../lib/constants"

import "@repo/ui/globals.css"
import "../styles/index.css"

import CustomTooltip from "@ui/components/custom/custom-tooltip"
import {
  AlertTriangle,
  ExternalLink,
  FileBarChart,
  InfoIcon,
  RefreshCcw,
  ShieldCheck,
  ShieldQuestion,
  Skull
} from "lucide-react"

const domainInfoTooltipContent = (
  <div className="text-sm max-w-80">
    <p>
      The domain intelligence category is calculated based on the domain's
      reputation.
    </p>
    <p className="mt-4">
      <span className="font-semibold text-green-500">Benign:</span> The domain
      has a good reputation.
    </p>
    <p className="mt-1">
      <span className="font-semibold text-red-500">Suspicious:</span> The domain
      has a bad reputation.
    </p>
    <p className="mt-1">
      <span className="font-semibold text-gray-500">Unknown:</span> The domain
      reputation cannot be determined, and is considererd neutral.
    </p>
  </div>
)

const securityHeadersTooltipContent = (
  <div className="text-sm max-w-80">
    <p>
      The security headers category is calculated based on the presence and
      implementation status of the security headers.
    </p>
    <p className="mt-4">
      <span className="font-semibold text-green-500">Robust:</span> All security
      headers are implemented and configured securely.
    </p>
    <p className="mt-1">
      <span className="font-semibold text-yellow-500">Medium:</span> Some
      security headers are missing or not configured securely.
    </p>
    <p className="mt-1">
      <span className="font-semibold text-red-500">Low:</span> Most security
      headers are missing or not configured securely.
    </p>
  </div>
)

const demoData = {
  domainReport: {
    category: "Medium",
    name: "sriniously.xyz",
    score: 4
  },
  finalCategory: "Medium",
  finalScore: 2.5,
  securityHeadersReport: {
    category: "Low",
    headers: {
      "content-security-policy": {
        category: "Low",
        implemented: false,
        negativeFeedback: [
          "Missing Security Header: content-security-policy is not implemented."
        ],
        positiveFeedback: [],
        score: -1,
        value: ""
      },
      "permissions-policy": {
        category: "Low",
        implemented: false,
        negativeFeedback: [
          "Missing Security Header: permissions-policy is not implemented."
        ],
        positiveFeedback: [],
        score: -1,
        value: ""
      },
      "referrer-policy": {
        category: "Low",
        implemented: false,
        negativeFeedback: [
          "Missing Security Header: referrer-policy is not implemented."
        ],
        positiveFeedback: [],
        score: -1,
        value: ""
      },
      "strict-transport-security": {
        category: "Low",
        implemented: false,
        negativeFeedback: [
          "Missing Security Header: strict-transport-security is not implemented."
        ],
        positiveFeedback: [],
        score: -1,
        value: ""
      },
      "x-content-type-options": {
        category: "Low",
        implemented: false,
        negativeFeedback: [
          "Missing Security Header: x-content-type-options is not implemented."
        ],
        positiveFeedback: [],
        score: -1,
        value: ""
      },
      "x-frame-options": {
        category: "Low",
        implemented: false,
        negativeFeedback: [
          "Missing Security Header: x-frame-options is not implemented."
        ],
        positiveFeedback: [],
        score: -1,
        value: ""
      }
    },
    overallScore: 1
  }
}

function IndexPopup() {
  const [data, setData] = useState<SecurityReport | null>(null)

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const currentTab = tabs[0]
      const url = new URL(currentTab?.url as string)
      const domain = url.hostname

      chrome.storage.local.get(domain, (result) => {
        setData(result[domain].report as SecurityReport)
      })
    })
  }, [])

  const reloadCurrentTab = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const currentTab = tabs[0]
      chrome.tabs.reload(currentTab?.id as number)

      // close the popup
      window.close()
    })
  }

  const themeColor = match(data?.finalCategory)
    .with("Robust", () => "bg-green-500")
    .with("Medium", () => "bg-yellow-500")
    .with("Low", () => "bg-red-500")
    .otherwise(() => "bg-gray-500")

  const ThemeIcon = match(data?.finalCategory)
    .with("Robust", () => ShieldCheck)
    .with("Medium", () => AlertTriangle)
    .with("Low", () => Skull)
    .otherwise(() => ShieldQuestion)

  const iconAnimation = match(data?.finalCategory)
    .with("Medium", () => "animate-bounce")
    .with("Low", () => "animate-ping")
    .otherwise(() => "")

  const securityHeadersInfo = data?.securityHeadersReport.headers

  console.log(data)

  return (
    <div className={cn(DEFAULT_LAYOUT_STYLES)}>
      <section
        className={cn(
          themeColor,
          "h-60 flex gap-5 flex-col justify-center items-center relative"
        )}>
        <p className="absolute top-5 left-5 px-4 py-1 text-xs rounded-full font-semibold text-white border">
          Security Level
        </p>

        <ThemeIcon className={cn(iconAnimation, "w-14 h-14 text-white")} />
        <h2 className="text-4xl font-bold text-white tracking-wider">
          {data?.finalCategory.toUpperCase() ?? "UNKNOWN"}
        </h2>
        {!data?.finalCategory && (
          <RefreshCcw
            onClick={reloadCurrentTab}
            className="w-6 h-6 text-white cursor-pointer"
          />
        )}
      </section>

      {data ? (
        <>
          <section className="p-5 flex justify-between w-full">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base text-blue-600 font-semibold tracking-wide">
                  Domain Intelligence
                </h3>
                <CustomTooltip content={domainInfoTooltipContent}>
                  <InfoIcon className="w-4 h-4 text-slate-500" />
                </CustomTooltip>
              </div>

              <div className="flex items-center gap-2 mt-3">
                <p className="text-slate-600 text-sm">Score:</p>
                <p
                  className={cn(
                    match(data?.domainReport.category)
                      .with("Robust", () => "text-green-500")
                      .with("Medium", () => "text-yellow-500")
                      .with("Low", () => "text-red-500")
                      .otherwise(() => "text-gray-500"),
                    "font-semibold text-base"
                  )}>
                  {match(data?.domainReport.category)
                    .with("Robust", () => "BENIGN")
                    .with("Medium", () => "UNKNOWN")
                    .with("Low", () => "SUSPICIOUS")
                    .otherwise(() => "UNKNOWN")}
                </p>
              </div>
            </div>
            <div
              onClick={() => {
                chrome.tabs.create({ url: "./tabs/report.html" })
              }}
              className="text-sm text-white flex items-center gap-1 bg-purple-600 hover:bg-purple-700 transition-all duration-300 h-fit px-2 py-1 cursor-pointer rounded-xl">
              <FileBarChart className="w-4 h-4" />
              <p>Complete Report</p>
              <ExternalLink className="w-4 h-4 ml-2" />
            </div>
          </section>

          <section className="p-5 pt-0">
            <div className="flex items-center gap-2">
              <h3 className="text-base text-blue-600 font-semibold tracking-wide">
                Security Headers
              </h3>
              <CustomTooltip content={securityHeadersTooltipContent}>
                <InfoIcon className="w-4 h-4 text-slate-500" />
              </CustomTooltip>
            </div>

            <div className="flex items-center gap-2 mt-3">
              <p className="text-slate-600 text-sm">Score:</p>
              <p
                className={cn(
                  match(data?.securityHeadersReport.category)
                    .with("Robust", () => "text-green-500")
                    .with("Medium", () => "text-yellow-500")
                    .with("Low", () => "text-red-500")
                    .otherwise(() => "text-gray-500"),
                  "font-semibold text-base"
                )}>
                {data?.securityHeadersReport.category.toUpperCase()}
              </p>
            </div>

            <div className="mt-5 flex items-center gap-3 flex-wrap">
              {securityHeadersInfo &&
                Object.entries(securityHeadersInfo).map(([header, report]) => (
                  <SecurityHeaderCard
                    key={header}
                    header={header}
                    report={report}
                  />
                ))}
            </div>
          </section>
        </>
      ) : (
        <section className="p-5 flex flex-col items-center justify-center">
          <h2 className="text-center text-sm text-slate-600 mt-5 -mb-5">
            Unable to fetch security headers. Please try again later or reload
            the page.
          </h2>
          <img
            className="w-60 h-60 object-contain"
            src={ICON_RELATIVE_PATH + "robot.png"}
            alt=""
          />
        </section>
      )}
    </div>
  )
}

export default IndexPopup

type SecurityHeaderCardProps = {
  header: string
  report: SecurityReport["securityHeadersReport"]["headers"][string]
}

const SecurityHeaderCard = ({ header, report }: SecurityHeaderCardProps) => {
  const capitalizeFirstLetterOfEachWord = (str: string) => {
    // content-security-policy => Content Security Policy
    return str
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  const backgroundColor = (() => {
    let color = "bg-gray-400"

    if (report.implemented) {
      color = match(report.category)
        .with("Robust", () => "bg-green-500")
        .with("Medium", () => "bg-yellow-500")
        .with("Low", () => "bg-red-300")
        .otherwise(() => "bg-gray-400")
    } else {
      color = "bg-red-500"
    }

    return color
  })()

  const tooltipContent = (
    <div className="text-sm max-w-80">
      {!report.implemented && (
        <p className="font-semibold text-red-500">Header not implemented</p>
      )}

      {report.positiveFeedback.length > 0 && (
        <p>
          <span className="font-semibold text-green-500">
            Positive Feedback:
          </span>{" "}
          {report.positiveFeedback.join(", ")}
        </p>
      )}

      {report.implemented && report.negativeFeedback.length > 0 && (
        <p
          className={cn(
            report.positiveFeedback.length > 0 || report.implemented
              ? "mt-1"
              : "mt-4"
          )}>
          <span className="font-semibold text-red-500">Negative Feedback:</span>{" "}
          {report.negativeFeedback.join(", ")}
        </p>
      )}

      {report.positiveFeedback.length === 0 &&
        report.negativeFeedback.length === 0 && (
          <p className="mt-1">
            No feedback available for this header. Please refer to the{" "}
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers"
              target="_blank"
              rel="noreferrer"
              className="text-blue-500 underline">
              MDN Web Docs
            </a>{" "}
            for more information.
          </p>
        )}
    </div>
  )

  return (
    <CustomTooltip content={tooltipContent}>
      <div
        className={cn(
          backgroundColor,
          "py-1 px-2 text-white font-semibold rounded-lg"
        )}>
        <p>{capitalizeFirstLetterOfEachWord(header)}</p>
      </div>
    </CustomTooltip>
  )
}
