import TabsHome from "@/components/tabs/home"
import TabLayout from "@/components/tabs/layout"

import "@repo/ui/globals.css"
import "../styles/index.css"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { Toaster } from "react-hot-toast"
import { Route, MemoryRouter as Router, Routes } from "react-router-dom"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 30 // 30 minutes
    }
  }
})

const TabsIndex = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route element={<TabLayout />}>
            <Route path="/" element={<TabsHome />} />
          </Route>
        </Routes>
      </Router>
      <ReactQueryDevtools />
      <Toaster position="bottom-center" />
    </QueryClientProvider>
  )
}

export default TabsIndex
