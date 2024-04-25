import axios from "axios";
import Cookies from "js-cookie";

const axiosClient = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

axiosClient.defaults.baseURL = "/api";

axiosClient.interceptors.request.use(
  function (config) {
    const token = Cookies.get("pangea_auth");
    if (!token) {
      return config;
    }
    const formattedToken = token.split(",")[0];
    if (formattedToken) {
      config.headers["x-auth-token"] = `Bearer ${formattedToken}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);

// if I receive a 401 or 403 response, I want to redirect the user to the / page using window.location.href
axiosClient.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (
      (error.response.status === 401 || error.response.status === 403) &&
      window.location.pathname !== "/"
    ) {
      localStorage.setItem("sessionTimeout", window.location.pathname);
      window.location.href = "/";
    }
    return Promise.reject(error);
  },
);

export default axiosClient;
