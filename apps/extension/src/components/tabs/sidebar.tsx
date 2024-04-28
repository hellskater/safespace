import { cn } from "@ui/lib/utils"
import { BarChart4 } from "lucide-react"
import { useLocation, useNavigate } from "react-router-dom"

const items = [
  { title: "home", Icon: BarChart4, path: "/" }
  //   { title: "settings", Icon: Settings, path: "/settings" }
]

const Sidebar = () => {
  const location = useLocation()
  const { pathname } = location
  const navigate = useNavigate()

  return (
    <div className="space-y-5 ml-auto w-fit pr-5">
      {items.map((item) => {
        const isActive = pathname === item.path
        return (
          <div
            key={item.title}
            onClick={() => navigate(item.path)}
            title={item.title}>
            <item.Icon
              className={cn(
                "h-6 w-6 box-content text-gray-600 p-2 rounded-lg hover:bg-yellow-100 hover:text-yellow-600 cursor-pointer transition-colors duration-200 ease-in-out",
                isActive && "text-yellow-600 bg-yellow-100"
              )}
            />
          </div>
        )
      })}
    </div>
  )
}

export default Sidebar
