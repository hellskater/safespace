export const URLS = {
  getMe: "/me",
  putMe: "/me",
  getMyKey: "/me/key",
  signup: "/signup",
} as const;

export const QUERY_KEYS = {
  // profile
  PROFILE: {
    GET_USER_PROFILE: "getUserProfile",
    GET_MY_KEY: "getMyKey",
  },
} as const;
