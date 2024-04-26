"use client";

import { AuthProvider } from "@pangeacyber/react-auth";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "sonner";
import Cookies from "js-cookie";
import ReactQueryProvider from "./react-query-provider";
import ProvidersDependentHoc from "./providers-dependent-hoc";
import { env } from "@/utils/env";
import { generateSymmetricKey } from "@/utils/encryption";
import { signup } from "@/lib/hooks/api/useProfileQueries";
import { QueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { QUERY_KEYS } from "@/lib/hooks/api/query-utils";

const PangeaAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            staleTime: 1000 * 60 * 30, // 30 minutes
          },
        },
      }),
  );

  const handleLogin = async () => {
    try {
      const initiatingLogin = Cookies.get("initiatingLogin");

      if (!initiatingLogin) {
        return;
      }

      toast.loading("Logging in...", {
        id: "login",
      });

      const newKey = generateSymmetricKey();

      await signup({
        encryptionKey: newKey,
      });

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.PROFILE.GET_USER_PROFILE],
      });

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.PROFILE.GET_MY_KEY],
      });

      toast.success("Login successful", {
        id: "login",
      });
      router.push("/app");
    } catch (error) {
      toast.error("Login failed", {
        id: "login",
      });
    }
    Cookies.remove("initiatingLogin");
  };

  return (
    // <AuthProvider
    //   config={{
    //     domain: env.NEXT_PUBLIC_PANGEA_DOMAIN as string,
    //     clientToken: env.NEXT_PUBLIC_PANGEA_CLIENT_TOKEN as string,
    //     useJwt: false,
    //   }}
    //   cookieOptions={{
    //     useCookie: true,
    //     cookieName: "pangea_auth",
    //   }}
    //   loginUrl={env.NEXT_PUBLIC_PANGEA_LOGIN_URL as string}
    //   useStrictStateCheck={false}
    //   onLogin={handleLogin}
    // >
    <ReactQueryProvider queryClient={queryClient}>
      <ProvidersDependentHoc>
        <>
          {children}
          <Toaster />
        </>
      </ProvidersDependentHoc>
    </ReactQueryProvider>
    // </AuthProvider>
  );
};

export default PangeaAuthProvider;
