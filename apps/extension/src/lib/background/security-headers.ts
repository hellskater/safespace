export const logHeaders = () => {
  chrome.webRequest.onHeadersReceived.addListener(
    function (details) {
      if (details.type === "main_frame") {
        console.log("Received headers:", details)
      }
    },
    { urls: ["<all_urls>"] },
    ["responseHeaders"]
  )
}
