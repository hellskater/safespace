import { useEffect } from "react";
import { useUserProfileQuery } from "../api/useProfileQueries";

const useSyncLocalProfileWithRemote = () => {
  const { data: profile } = useUserProfileQuery();

  useEffect(() => {
    if (profile) {
      localStorage.setItem("safespace_user_profile", JSON.stringify(profile));
    }
  }, [profile]);
};

export default useSyncLocalProfileWithRemote;
