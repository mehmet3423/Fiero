import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import { GET_SUB_CATEGORY_LOOKUP_LIST } from "@/constants/links";
import { SubCategoriesLookUp } from "@/constants/models/SubCategoryLookUp";
import useGetData from "@/hooks/useGetData";

export const useSubCategoriesLookUp = (mainCategoryId: string) => {
  const { data, isLoading, error } = useGetData<{
    data: SubCategoriesLookUp[];
  }>({
    url: mainCategoryId
      ? `${GET_SUB_CATEGORY_LOOKUP_LIST}?MainCategoryId=${mainCategoryId}`
      : undefined,
    queryKey: [QueryKeys.SUB_CATEGORY_LIST, mainCategoryId],
    method: HttpMethod.GET,
    enabled: !!mainCategoryId,
    onError(err) {},
  });
  const categories = {
    data: data?.data || [],
  };
  return {
    categories,
    isLoading,
    error,
  };
};
