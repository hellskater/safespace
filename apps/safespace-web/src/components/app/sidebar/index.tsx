"use client";

import { cn } from "@ui/lib/utils";
import { Home, Settings } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

const items = [
  { title: "home", Icon: Home, path: "/app" },
  { title: "settings", Icon: Settings, path: "/app/settings" },
];
const Sidebar = () => {
  const pathname = usePathname();

  const router = useRouter();

  return (
    <div className="space-y-5 ml-auto w-fit pr-5">
      {items.map((item) => {
        const isActive = pathname === item.path;
        return (
          <div
            key={item.title}
            onClick={() => router.push(item.path)}
            title={item.title}
          >
            <item.Icon
              className={cn(
                "h-6 w-6 box-content text-gray-600 p-2 rounded-lg hover:bg-yellow-100 hover:text-yellow-600 cursor-pointer transition-colors duration-200 ease-in-out",
                isActive && "text-yellow-600 bg-yellow-100",
              )}
            />
          </div>
        );
      })}
    </div>
  );
};

export default Sidebar;
