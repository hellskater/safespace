import type { UrlAnalysisResult } from "@/lib/background/context-menus/link-checker"
import type { DomainAnalysisResult } from "@/lib/background/security-headers"
import { getAllDomainResultsFromCache } from "@/lib/cache/domain-cache"
import { getAllUrlsFromCache } from "@/lib/cache/link-cache"
import { getAllPasswordResultsFromCache } from "@/lib/cache/password-cache"
import { cn } from "@ui/lib/utils"
import { useEffect, useState } from "react"

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

  console.log(cache)

  useEffect(() => {
    const fetchCache = async () => {
      const domainCache = await getAllDomainResultsFromCache()
      const urlCache = await getAllUrlsFromCache()
      const passwordCache = await getAllPasswordResultsFromCache()
      setCache({ domainCache, urlCache, passwordCache })
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
    <div className="mt-5">
      <h2 className="text-lg font-semibold">Domain Cache</h2>

      {domainCache ? (
        <div className="space-y-2 mt-4">
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
  return (
    <div className="mt-5">
      <h2 className="text-lg font-semibold">URL Cache</h2>
      <pre>{JSON.stringify(urlCache, null, 2)}</pre>
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
  return (
    <div className="mt-5">
      <h2 className="text-lg font-semibold">Password Cache</h2>
      <pre>{JSON.stringify(passwordCache, null, 2)}</pre>
    </div>
  )
}
