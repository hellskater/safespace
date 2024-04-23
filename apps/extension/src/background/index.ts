import { onInstalled } from "@/lib/background/on-installed"
import { logHeaders } from "@/lib/background/security-headers"

logHeaders()

onInstalled()
