import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import { GET_SYSTEM_SETTING_TYPES } from "@/constants/links";
import { SystemSettingTypesResponse } from "@/constants/models/settings";
import useGetData from "@/hooks/useGetData";

export const useGetSystemSettingTypes = () => {
  const { data, isLoading, error, refetch } =
    useGetData<SystemSettingTypesResponse>({
      queryKey: QueryKeys.SYSTEM_SETTING_TYPES,
      url: GET_SYSTEM_SETTING_TYPES,
      method: HttpMethod.GET,
      enabled: true,
    });

  return {
    settingTypes: data?.data || [],
    isLoading,
    error,
    refetch,
  };
};
