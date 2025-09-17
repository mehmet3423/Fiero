import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import { GET_TRENDYOL_CATEGORY_ATTRIBUTES } from "@/constants/links";
import { CommandResultWithData } from "@/constants/models/CommandResult";
import { CategoryAttributeResponse } from "@/constants/models/trendyol/CategoryAttributeResponse";
import useGetData from "@/hooks/useGetData";

export const useGetTrendyolCategoryAttributes = (categoryId: number) => {
  // Sadece geçerli categoryId olduğunda fetch et
  const shouldFetch = categoryId > 0;

  const { data, isLoading, error } = useGetData<CommandResultWithData<CategoryAttributeResponse>>({
    url: shouldFetch ? GET_TRENDYOL_CATEGORY_ATTRIBUTES(categoryId) : undefined,
    queryKey: [QueryKeys.TRENDYOL_CATEGORY_ATTRIBUTES, categoryId.toString()], // CategoryId ile birlikte unique key
    method: HttpMethod.GET,
    enabled: shouldFetch, // Sadece geçerli categoryId olduğunda API çağrısı yap
    onError(err) {
    },
  });

  return {
    categoryAttributes: shouldFetch ? data : null,
    isLoading: shouldFetch ? isLoading : false,
    error: shouldFetch ? error : null,
  };
};