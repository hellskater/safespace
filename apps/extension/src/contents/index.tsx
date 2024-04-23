import { MESSAGE_TYPES } from "@/lib/background/constants"
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
      if (message.type === MESSAGE_TYPES.VERIFY_LINK_START) {
        toast.loading("Verifying link...", {
          id: MESSAGE_TYPES.VERIFY_LINK_START
        })
      } else if (message.type === MESSAGE_TYPES.VERIFY_LINK_RESULT) {
        toast.success(message.payload.result, {
          id: MESSAGE_TYPES.VERIFY_LINK_START,
          icon: message.payload.icon
        })
      } else if (message.type === MESSAGE_TYPES.VERIFY_LINK_ERROR) {
        toast.error("Failed to verify link!", {
          id: MESSAGE_TYPES.VERIFY_LINK_START
        })
      } else if (message.type === MESSAGE_TYPES.VERIFY_PASSWORD_START) {
        toast.loading("Verifying password...", {
          id: MESSAGE_TYPES.VERIFY_PASSWORD_START
        })
      } else if (message.type === MESSAGE_TYPES.VERIFY_PASSWORD_RESULT) {
        toast.success(message.payload.result, {
          id: MESSAGE_TYPES.VERIFY_PASSWORD_START,
          icon: message.payload.icon
        })
      } else if (message.type === MESSAGE_TYPES.VERIFY_PASSWORD_ERROR) {
        toast.error("Failed to verify password!", {
          id: MESSAGE_TYPES.VERIFY_PASSWORD_START
        })
      }
    })
  }, [])

  const baseToastStyles = "rounded-xl px-5 py-3 shadow-lg bg-white text-black"

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
