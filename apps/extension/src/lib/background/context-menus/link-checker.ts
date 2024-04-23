export const initializeLinkCheckerContextMenu = () => {
  chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
      id: "linkCheckerContextMenu",
      title: "Verify link",
      contexts: ["link"],
      documentUrlPatterns: ["http://*/*", "https://*/*"]
    })
  })

  chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (!tab?.id) {
      return
    }
    if (info.menuItemId === "linkCheckerContextMenu") {
      chrome.tabs.sendMessage(tab.id, {
        type: "verifyLink",
        linkUrl: info.linkUrl
      })
    }
  })
}
