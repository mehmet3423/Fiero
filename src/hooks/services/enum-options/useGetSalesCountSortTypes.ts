import { useEnumOptions } from "./useEnumOptions";
import { GET_SALES_COUNT_SORT_TYPES } from "@/constants/links";

export const useGetSalesCountSortTypes = (enabled: boolean = false) => {
  return useEnumOptions({
    url: GET_SALES_COUNT_SORT_TYPES,
    queryKey: "sales-count-sort-types",
    enabled,
  });
};