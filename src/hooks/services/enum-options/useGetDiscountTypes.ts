import { useEnumOptions } from "./useEnumOptions";
import { GET_DISCOUNT_TYPES } from "@/constants/links";

export const useGetDiscountTypes = (enabled: boolean = false) => {
  return useEnumOptions({
    url: GET_DISCOUNT_TYPES,
    queryKey: "discount-types",
    enabled,
  });
};