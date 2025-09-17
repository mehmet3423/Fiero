import { useEnumOptions } from "./useEnumOptions";
import { GET_TRENDYOL_OPERATION_TYPES } from "@/constants/links";

export const useGetTrendyolOperationTypes = (enabled: boolean = false) => {
  return useEnumOptions({
    url: GET_TRENDYOL_OPERATION_TYPES,
    queryKey: "trendyol-operation-types",
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes as in original
  });
};