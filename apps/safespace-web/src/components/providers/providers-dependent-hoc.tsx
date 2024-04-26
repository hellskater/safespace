"use client";

import useCheckSessionTimeout from "@/lib/hooks/auth/useCheckSessionTimeout";
import useSyncLocalProfileWithRemote from "@/lib/hooks/auth/useSyncLocalProfileWithRemote";
import { type ReactNode } from "react";

const ProvidersDependentHoc = ({ children }: { children: ReactNode }) => {
  useSyncLocalProfileWithRemote();
  useCheckSessionTimeout();
  return <>{children}</>;
};

export default ProvidersDependentHoc;
