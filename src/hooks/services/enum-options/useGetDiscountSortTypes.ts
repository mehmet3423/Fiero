import { useEnumOptions } from "./useEnumOptions";
import { GET_DISCOUNT_SORT_TYPES } from "@/constants/links";

export const useGetDiscountSortTypes = (enabled: boolean = false) => {
  return useEnumOptions({
    url: GET_DISCOUNT_SORT_TYPES,
    queryKey: "discount-sort-types",
    enabled,
  });
};