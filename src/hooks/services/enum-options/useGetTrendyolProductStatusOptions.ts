import { useEnumOptions } from "./useEnumOptions";
import { GET_TRENDYOL_PRODUCT_STATUS_OPTIONS } from "@/constants/links";

export const useGetTrendyolProductStatusOptions = (enabled: boolean = true) => {
  return useEnumOptions({
    url: GET_TRENDYOL_PRODUCT_STATUS_OPTIONS,
    queryKey: "trendyol-product-status-options",
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes as in original
  });
};
