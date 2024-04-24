"use client";

import { AppState, AuthProvider } from "@pangeacyber/react-auth";
import { useRouter } from "next/navigation";

const PangeaAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  const handleLogin = (appData: AppState) => {
    router.push(appData.returnPath);
  };
  return (
    <AuthProvider
      config={{
        domain: process.env.NEXT_PUBLIC_PANGEA_DOMAIN as string,
        clientToken: process.env.NEXT_PUBLIC_PANGEA_CLIENT_TOKEN as string,
        useJwt: false,
      }}
      cookieOptions={{
        useCookie: true,
        cookieName: "pangea_auth",
      }}
      loginUrl={process.env.NEXT_PUBLIC_PANGEA_LOGIN_URL as string}
      useStrictStateCheck={false}
      onLogin={handleLogin}
    >
      <>{children}</>
    </AuthProvider>
  );
};

export default PangeaAuthProvider;
