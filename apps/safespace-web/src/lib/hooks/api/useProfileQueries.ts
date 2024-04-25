import axiosClient from "@/lib/axiosInstance";
import { QUERY_KEYS, URLS } from "./query-utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAuthCookie } from "@/utils/cookies";
import { UserType } from "@/db/dto/user.dto";
import toast from "react-hot-toast";
import { MyKeyType } from "@/types/key";

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
  return useQuery({
    queryKey: [QUERY_KEYS.PROFILE.GET_USER_PROFILE],
    queryFn: getUserProfile,
    enabled: !!token,
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
