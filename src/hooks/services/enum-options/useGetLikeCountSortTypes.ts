import { useEnumOptions } from "./useEnumOptions";
import { GET_LIKE_COUNT_SORT_TYPES } from "@/constants/links";

export const useGetLikeCountSortTypes = (enabled: boolean = false) => {
  return useEnumOptions({
    url: GET_LIKE_COUNT_SORT_TYPES,
    queryKey: "like-count-sort-types",
    enabled,
  });
};