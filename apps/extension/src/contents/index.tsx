import { cn } from "@ui/lib/utils"
// @ts-ignore
import cssText from "data-text:@repo/ui/globals.css"
import type { PlasmoCSConfig } from "plasmo"
import { useEffect } from "react"
import toast, { Toaster } from "react-hot-toast"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"]
}

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

export const ContentIndex = () => {
  useEffect(() => {
    chrome.runtime?.onMessage.addListener((message) => {
      if (message.type === "verifyLink") {
        console.log("Link to verify:", message.linkUrl)
        toast.success("Link verification started")
      }
    })
  }, [])

  const baseToastStyles = "rounded-xl px-6 py-4 shadow-lg bg-white text-black"

  return (
    <>
      <Toaster
        toastOptions={{
          className: baseToastStyles,
          success: {
            className: cn(baseToastStyles, "flex items-center gap-3"),
            icon: "✅"
          },
          error: {
            className: cn(baseToastStyles, "flex items-center gap-3"),
            icon: "❌"
          },
          loading: {
            className: cn(baseToastStyles, "flex items-center gap-3"),
            icon: "⏳"
          }
        }}
      />
    </>
  )
}

export default ContentIndex
