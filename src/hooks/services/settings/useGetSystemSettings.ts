import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import { GET_SYSTEM_SETTINGS } from "@/constants/links";
import { SettingsApiResponse } from "@/constants/models/settings";
import useGetData from "@/hooks/useGetData";

export const useGetSystemSettings = () => {
  const { data, isLoading, error, refetch } = useGetData<{
    data: SettingsApiResponse;
  }>({
    queryKey: QueryKeys.SYSTEM_SETTINGS,
    url: GET_SYSTEM_SETTINGS,
    method: HttpMethod.GET,
    enabled: true,
  });

  return {
    settings: data?.data || [],
    isLoading,
    error,
    refetch,
  };
};
