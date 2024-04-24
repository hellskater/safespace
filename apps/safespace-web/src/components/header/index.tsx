"use client";

import { useAuth } from "@pangeacyber/react-auth";
import { Button } from "@ui/components/ui/button";
import React from "react";

const Header = () => {
  const { authenticated, login, logout, user, refresh } = useAuth();

  const handleLogout = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    logout();
  };

  console.log(user);

  return (
    <header className="px-4 py-2">
      {authenticated ? (
        <Button onClick={handleLogout}>Logout</Button>
      ) : (
        <Button onClick={login}>Login</Button>
      )}
    </header>
  );
};

export default Header;
