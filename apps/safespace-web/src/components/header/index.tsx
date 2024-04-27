/* eslint-disable @next/next/no-img-element */
"use client";

import { useAuth } from "@pangeacyber/react-auth";
import { Button } from "@ui/components/ui/button";
import Link from "next/link";
import React from "react";
import { LogOut, LogIn } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { cn } from "@ui/lib/utils";
import { useUserProfileQuery } from "@/lib/hooks/api/useProfileQueries";

const Header = () => {
  const { authenticated, login, logout } = useAuth();

  const { data: userProfile } = useUserProfileQuery();

  const router = useRouter();
  const pathname = usePathname();

  const shouldShowBorder = pathname !== "/";

  const handleLogout = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    localStorage.removeItem("sessionTimeout");
    localStorage.removeItem("safespace_user_profile");
    logout();
    router.push("/");
    toast.success("Logout successful", {
      id: "logout",
    });
  };

  return (
    <header
      className={cn(
        "safe-paddings absolute inset-x-0 top-0 z-50 p-5",
        shouldShowBorder && "pb-2 border-b",
      )}
    >
      <div className="flex max-w-full items-center justify-between p-4">
        <Link className="bg-stone-700 px-6 py-2" href="/">
          <span className="sr-only">SafeSpace Logo</span>
          <span className="text-white font-mono">SafeSpace</span>
        </Link>

        <div>
          {authenticated ? (
            <section className="flex items-center gap-5">
              <Button
                className="flex items-center gap-2"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4" />
                <p>Logout</p>
              </Button>
              <Link href="/app">
                <img
                  src={userProfile?.imageUrl ?? "/images/robot.png"}
                  onError={(e) => {
                    e.currentTarget.src = "/images/robot.png";
                  }}
                  alt="user profile"
                  className="h-10 w-10 rounded-full object-cover"
                />
              </Link>
            </section>
          ) : (
            <Button
              className="flex items-center gap-2"
              onClick={() => {
                Cookies.set("initiatingLogin", "true");
                login();
              }}
            >
              <LogIn className="w-4 h-4" />
              <p>Login</p>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
