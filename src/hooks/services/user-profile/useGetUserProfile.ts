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
  } = useGetData<any>({
    url: token ? `${GET_USER_PROFILE}` : undefined,
    method: HttpMethod.GET,
    queryKey: QueryKeys.GET_USER_PROFILE,
    onSuccess: (data) => {
      // Handle different response formats
      if (data?.data) {
        setUserProfile(data.data);
      } else if (data?.user) {
        setUserProfile(data.user);
      } else if (data) {
        setUserProfile(data);
      }
    },
    onError: (err) => {
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
