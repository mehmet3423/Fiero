import { useEnumOptions } from "./useEnumOptions";
import { GET_DISCOUNT_VALUE_TYPES } from "@/constants/links";

export const useGetDiscountValueTypes = (enabled: boolean = false) => {
  return useEnumOptions({
    url: GET_DISCOUNT_VALUE_TYPES,
    queryKey: "discount-value-types",
    enabled,
  });
};