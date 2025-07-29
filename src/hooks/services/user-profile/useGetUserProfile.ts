import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import { GET_USER_PROFILE } from "@/constants/links";
import { UserProfile } from "@/constants/models/UserProfile";
import { getToken } from "@/helpers/tokenUtils";
import useGetData from "@/hooks/useGetData";
import { useEffect, useState } from "react";

export const useGetUserProfile = () => {
  const [userProfile, setUserProfile] = useState<UserProfile>();
  const token = getToken();

  const {
    data,
    isFetchingData: userProfileLoading,
    error,
    refetch,
  } = useGetData<UserProfile>({
    url: token ? `${GET_USER_PROFILE}` : undefined,
    method: HttpMethod.GET,
    queryKey: QueryKeys.GET_USER_PROFILE,
    onSuccess: (data) => {
      setUserProfile(data);
    },
    onError: (err) => {
      console.error("Error fetching user profile:", err);
    },
  });

  // Refetch when token changes
  useEffect(() => {
    if (token) {
      refetch();
    }
  }, [token, refetch]);

  return { userProfile, userProfileLoading, error, setUserProfile, refetch };
};
