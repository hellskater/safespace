import { Outlet } from "react-router-dom"

import Sidebar from "./sidebar"

const TabLayout = () => {
  return (
    <div className="font-poppins text-lg flex justify-between max-w-4xl mx-auto">
      <aside className="border-r w-[10%] p-5 h-screen">
        <Sidebar />
      </aside>
      <main className="w-full h-screen p-5 overflow-y-auto stylized-scroll">
        <Outlet />
      </main>
    </div>
  )
}

export default TabLayout
