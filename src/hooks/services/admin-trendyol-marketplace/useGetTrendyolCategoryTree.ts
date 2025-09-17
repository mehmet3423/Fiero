import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import { GET_TRENDYOL_CATEGORIES } from "@/constants/links";
import { CommandResultWithData } from "@/constants/models/CommandResult";
import { CategoryTreeResponse } from "@/constants/models/trendyol/CategoryTreeResponse";
import useGetData from "@/hooks/useGetData";

export const useGetTrendyolCategoryTree = () => {
  const { data, isLoading, error } = useGetData<CommandResultWithData<CategoryTreeResponse>>({
    url: GET_TRENDYOL_CATEGORIES,
    queryKey: QueryKeys.TRENDYOL_CATEGORIES,
    method: HttpMethod.GET,
    onError(err) {
    },
  });

  return {
    categoryTree: data || [],
    isLoading,
    error,
  };
};