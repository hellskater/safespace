"use client";

import { useAuth } from "@pangeacyber/react-auth";
import { Button } from "@ui/components/ui/button";
import Link from "next/link";
import React from "react";
import { LogOut, LogIn } from "lucide-react";

const Header = () => {
  const { authenticated, login, logout, user, refresh } = useAuth();

  const handleLogout = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    logout();
  };

  console.log(user);

  return (
    <header className="safe-paddings absolute inset-x-0 top-0 z-50 p-5">
      {/* {authenticated ? (
        <Button onClick={handleLogout}>Logout</Button>
      ) : (
        <Button onClick={login}>Login</Button>
      )} */}
      <div className="flex max-w-full items-center justify-between p-4">
        <Link className="bg-stone-700 px-6 py-2" href="/">
          <span className="sr-only">SafeSpace Logo</span>
          <span className="text-white font-mono">SafeSpace</span>
        </Link>

        <div>
          {authenticated ? (
            <Button className="flex items-center gap-2" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
              <p>Logout</p>
            </Button>
          ) : (
            <Button className="flex items-center gap-2" onClick={login}>
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
