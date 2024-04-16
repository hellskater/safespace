function isRedirect(status: number) {
  return status >= 300 && status < 400
}

export const logHeaders = () => {
  chrome.webRequest.onHeadersReceived.addListener(
    function (details) {
      if (!details.responseHeaders || isRedirect(details.statusCode)) {
        return
      }
      if (details.type === "main_frame") {
        console.log("Received headers:", details)
      }
    },
    { urls: ["<all_urls>"], types: ["main_frame"] },
    ["responseHeaders", "extraHeaders"]
  )
}
