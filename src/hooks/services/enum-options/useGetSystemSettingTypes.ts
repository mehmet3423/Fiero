import { useEnumOptions } from "./useEnumOptions";
import { GET_SYSTEM_SETTING_TYPES } from "@/constants/links";

export const useGetSystemSettingTypes = (enabled: boolean = false) => {
  return useEnumOptions({
    url: GET_SYSTEM_SETTING_TYPES,
    queryKey: "system-setting-types",
    enabled,
  });
};