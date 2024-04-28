export const URLS = {
  getMe: "/me",
  putMe: "/me",
  getMyKey: "/me/key",
  rotateKey: "/me/key/rotate",
  signup: "/signup",

  // notes
  getAllNotes: "/notes",
  createNote: "/notes",
  updateNote: (noteId: number) => `/notes/${noteId}` as const,
  deleteNote: (noteId: number) => `/notes/${noteId}` as const,
} as const;

export const QUERY_KEYS = {
  // profile
  PROFILE: {
    GET_USER_PROFILE: "getUserProfile",
    GET_MY_KEY: "getMyKey",
  },

  // notes
  NOTES: {
    GET_ALL_NOTES: "getAllNotes",
  },
} as const;
