import { useEnumOptions } from "./useEnumOptions";
import { GET_RATING_SORT_TYPES } from "@/constants/links";

export const useGetRatingSortTypes = (enabled: boolean = false) => {
  return useEnumOptions({
    url: GET_RATING_SORT_TYPES,
    queryKey: "rating-sort-types",
    enabled,
  });
};