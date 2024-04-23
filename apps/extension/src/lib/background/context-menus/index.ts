import { initializeLinkCheckerContextMenu } from "./link-checker"
import { initializePasswordCheckerContextMenu } from "./password-checker"

export const initializeAllContextMenus = () => {
  initializeLinkCheckerContextMenu()
  initializePasswordCheckerContextMenu()
}
