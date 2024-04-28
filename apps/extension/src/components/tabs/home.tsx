import type { UrlAnalysisResult } from "@/lib/background/context-menus/link-checker"
import type { DomainAnalysisResult } from "@/lib/background/security-headers"
import {
  clearDomainResultsFromCache,
  getAllDomainResultsFromCache
} from "@/lib/cache/domain-cache"
import {
  clearUrlResultsFromCache,
  getAllUrlsFromCache
} from "@/lib/cache/link-cache"
import { getAllPasswordResultsFromCache } from "@/lib/cache/password-cache"
import { Button } from "@ui/components/ui/button"
import { cn } from "@ui/lib/utils"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

type AllCache = {
  domainCache: {
    [key: string]: {
      score?: number
      summary?: DomainAnalysisResult // "benign" | "malicious" | "suspicious" | "unknown"
    }
  } | null
  urlCache: {
    [key: string]: {
      score?: number
      summary?: UrlAnalysisResult // "benign" | "malicious" | "suspicious" | "unknown"
    }
  } | null
  passwordCache: {
    [key: string]: {
      breachCount?: number
      isBreached?: boolean
    }
  } | null
}

const TabsHome = () => {
  const [cache, setCache] = useState<AllCache>({} as AllCache)

  useEffect(() => {
    const fetchCache = async () => {
      const domainCache = await getAllDomainResultsFromCache()
      const urlCache = await getAllUrlsFromCache()
      const passwordCache = await getAllPasswordResultsFromCache()
      setCache({
        domainCache: Object.keys(domainCache).length > 0 ? domainCache : null,
        urlCache: Object.keys(urlCache).length > 0 ? urlCache : null,
        passwordCache:
          Object.keys(passwordCache).length > 0 ? passwordCache : null
      })
    }

    fetchCache()
  }, [])

  return (
    <div className="">
      <h1 className="text-2xl font-semibold">Cache</h1>
      <DomainCache
        setDomainCache={(domainCache: AllCache["domainCache"] | null) =>
          setCache({ ...cache, domainCache })
        }
        domainCache={cache.domainCache}
      />
      <UrlCache
        setUrlCache={(urlCache: AllCache["urlCache"] | null) =>
          setCache({ ...cache, urlCache })
        }
        urlCache={cache.urlCache}
      />
      <PasswordCache
        setPasswordCache={(passwordCache: AllCache["passwordCache"] | null) =>
          setCache({ ...cache, passwordCache })
        }
        passwordCache={cache.passwordCache}
      />
    </div>
  )
}

export default TabsHome

// MARK: - DomainCache

type DomainCacheProps = {
  domainCache: AllCache["domainCache"]
  setDomainCache: (domainCache: AllCache["domainCache"] | null) => void
}

const DomainCache = ({ domainCache, setDomainCache }: DomainCacheProps) => {
  const domainTextColor = (summary: DomainAnalysisResult) => {
    switch (summary) {
      case "benign":
        return "text-green-500"
      case "malicious":
        return "text-red-500"
      case "suspicious":
        return "text-orange-500"
      case "unknown":
        return "text-yellow-500"
      default:
        return "text-gray-500"
    }
  }

  return (
    <div className="mt-5 relative">
      <h2 className="text-lg font-semibold">Domain Cache</h2>

      {domainCache ? (
        <div className="mt-4">
          <div className="space-y-2">
            {Object.entries(domainCache).map(([domain, { summary }]) => (
              <p
                key={domain}
                className={cn(
                  domainTextColor(summary as DomainAnalysisResult),
                  ""
                )}>
                {domain}
              </p>
            ))}
          </div>

          <Button
            className="mt-5"
            onClick={async () => {
              await clearDomainResultsFromCache()
              setDomainCache(null)
              toast.success("Domain cache cleared successfully")
            }}
            variant="destructive">
            Clear Cache
          </Button>
        </div>
      ) : (
        <p className="text-center mt-5 text-orange-500">No domains found</p>
      )}
    </div>
  )
}

// MARK: - UrlCache.tsx
type UrlCacheProps = {
  urlCache: AllCache["urlCache"]
  setUrlCache: (urlCache: AllCache["urlCache"] | null) => void
}

const UrlCache = ({ urlCache, setUrlCache }: UrlCacheProps) => {
  const urlTextColor = (summary: UrlAnalysisResult) => {
    switch (summary) {
      case "benign":
        return "text-green-500"
      case "malicious":
        return "text-red-500"
      case "suspicious":
        return "text-orange-500"
      case "unknown":
        return "text-yellow-500"
      default:
        return "text-gray-500"
    }
  }

  return (
    <div className="mt-10">
      <h2 className="text-lg font-semibold">URL Cache</h2>

      {urlCache ? (
        <div className="mt-4">
          <div className="space-y-2">
            {Object.entries(urlCache).map(([url, { summary }]) => (
              <p
                key={url}
                className={cn(urlTextColor(summary as UrlAnalysisResult), "")}>
                {url}
              </p>
            ))}
          </div>

          <Button
            className="mt-5"
            onClick={async () => {
              await clearUrlResultsFromCache()
              setUrlCache(null)
              toast.success("URL cache cleared successfully")
            }}
            variant="destructive">
            Clear Cache
          </Button>
        </div>
      ) : (
        <p className="text-center mt-5 text-orange-500">No URLs found</p>
      )}
    </div>
  )
}

// MARK: - PasswordCache
type PasswordCacheProps = {
  passwordCache: AllCache["passwordCache"]
  setPasswordCache: (passwordCache: AllCache["passwordCache"] | null) => void
}

const PasswordCache = ({
  passwordCache,
  setPasswordCache
}: PasswordCacheProps) => {
  const passwordTextColor = (isBreached: boolean) => {
    switch (isBreached) {
      case true:
        return "text-red-500"
      case false:
        return "text-green-500"
      default:
        return "text-gray-500"
    }
  }

  const maskPassword = (password: string) => {
    // only show the first 3 characters of the password
    return password.slice(0, 3) + "*".repeat(password.length - 3)
  }

  return (
    <div className="mt-10">
      <h2 className="text-lg font-semibold">Password Cache</h2>

      {passwordCache ? (
        <div className="mt-4">
          <div className="space-y-2">
            {Object.entries(passwordCache).map(
              ([password, { isBreached, breachCount }]) => (
                <p
                  key={password}
                  className={cn(passwordTextColor(isBreached as boolean), "")}>
                  {maskPassword(password)} -{" "}
                  <span className="text-blue-500">
                    {isBreached
                      ? `Breached ${breachCount} times`
                      : "Not breached"}
                  </span>
                </p>
              )
            )}
          </div>

          <Button
            className="mt-5"
            onClick={async () => {
              await clearUrlResultsFromCache()
              setPasswordCache(null)
              toast.success("Password cache cleared successfully")
            }}
            variant="destructive">
            Clear Cache
          </Button>
        </div>
      ) : (
        <p className="text-center mt-5 text-orange-500">No passwords found</p>
      )}
    </div>
  )
}
