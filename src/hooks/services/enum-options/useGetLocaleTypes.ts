import { useEnumOptions } from "./useEnumOptions";
import { GET_LOCALE_TYPES } from "@/constants/links";

export const useGetLocaleTypes = (enabled: boolean = false) => {
  return useEnumOptions({
    url: GET_LOCALE_TYPES,
    queryKey: "locale-types",
    enabled,
  });
};