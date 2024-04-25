import Cookies from "js-cookie";

export const getAuthCookie = () => {
  return Cookies.get("pangea_auth");
};
