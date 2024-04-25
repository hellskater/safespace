import { getAuthCookie } from "@/utils/cookies";
import { useAuth } from "@pangeacyber/react-auth";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";

const useCheckSessionTimeout = () => {
  const { logout } = useAuth();

  const pathname = usePathname();

  useEffect(() => {
    const isSessionExpired = localStorage.getItem("sessionTimeout");

    const cookie = getAuthCookie();

    // if cookie is not there then obviously the user is not logged in
    if (isSessionExpired && cookie) {
      localStorage.removeItem("sessionTimeout");
      localStorage.removeItem("safespace_user_profile");
      logout();
      toast.error("Your session has expired. Please login again", {
        id: "session-expired",
      });
    }
  }, [pathname]);
};

export default useCheckSessionTimeout;
