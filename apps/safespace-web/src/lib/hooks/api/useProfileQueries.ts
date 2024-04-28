import axiosClient from "@/lib/axiosInstance";
import { QUERY_KEYS, URLS } from "./query-utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAuthCookie } from "@/utils/cookies";
import { type UserType } from "@/db/dto/user.dto";
import { type MyKeyType } from "@/types/key";
import { toast } from "sonner";

// ------------------------------ GET me ------------------------------

export const getUserProfile = async () => {
  try {
    const resp: {
      data: UserType;
    } = await axiosClient.get(URLS.getMe);

    return resp.data;
  } catch (error) {
    console.error("getUserProfile error: ", error);
  }
};

export const useUserProfileQuery = () => {
  const token = getAuthCookie();
  const userProfile = JSON.parse(
    typeof localStorage !== "undefined"
      ? localStorage.getItem("safespace_user_profile") || "{}"
      : "{}",
  );
  return useQuery({
    queryKey: [QUERY_KEYS.PROFILE.GET_USER_PROFILE],
    queryFn: getUserProfile,
    enabled: !!token,
    placeholderData: userProfile,
  });
};

// ------------------------------ GET my key ------------------------------

export const getKeyDetails = async () => {
  try {
    const resp: {
      data: MyKeyType;
    } = await axiosClient.get(URLS.getMyKey);

    return resp.data;
  } catch (error) {
    console.error("getKeyDetails error: ", error);
  }
};

export const useGetUserKeyDetails = () => {
  const token = getAuthCookie();
  return useQuery({
    queryKey: [QUERY_KEYS.PROFILE.GET_MY_KEY],
    queryFn: getKeyDetails,
    enabled: !!token,
  });
};

// ------------------------------ POST signup ------------------------------

export type SignupPayloadType = {
  encryptionKey: string;
};

export const signup = async (payload: SignupPayloadType) => {
  try {
    const resp: {
      data: UserType;
    } = await axiosClient.post(URLS.signup, payload);
    return resp.data;
  } catch (error) {
    console.error("signup error: ", error);
  }
};

export const useSignupMutation = () => {
  return useMutation({
    mutationFn: signup,
  });
};

// ------------------------------ PATCH /me ------------------------------

export type UserProfileUpdatePayloadType = {
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
  encryptionKey?: string;
};

export const updateUserProfile = async (
  payload: UserProfileUpdatePayloadType,
) => {
  const resp: {
    data: UserType;
  } = await axiosClient.patch(URLS.getMe, payload);

  return resp.data;
};

export const useUpdateUserProfileMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateUserProfile,
    onError: (error, payload) => {
      console.error("useUpdateUserProfileMutation error: ", error);

      if (payload.encryptionKey) {
        toast.error("Failed to rotate encryption key");
      } else {
        toast.error("Failed to update profile");
      }
    },
    onSuccess: (_, payload) => {
      if (payload.encryptionKey) {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.PROFILE.GET_MY_KEY],
        });
        toast.success("Encryption key rotated successfully");
      } else {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.PROFILE.GET_USER_PROFILE],
        });
        toast.success("Profile updated successfully");
      }
    },
  });
};

// ------------------------------ POST rotate key ------------------------------

export type RotateKeyPayloadType = {
  newKey: string;
  notesData?: {
    id: number;
    title: string;
    content: string;
  }[];
  oldKeyId: string;
};

export const rotateKey = async (payload: RotateKeyPayloadType) => {
  const resp: {
    data: UserType;
  } = await axiosClient.post(URLS.rotateKey, payload);

  return resp.data;
};

export const useRotateKeyMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: rotateKey,
    onError: (error) => {
      console.error("useRotateKeyMutation error: ", error);

      toast.error("Failed to rotate encryption key");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.PROFILE.GET_MY_KEY],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.NOTES.GET_ALL_NOTES],
      });
      toast.success("Encryption key rotated successfully");
    },
  });
};
