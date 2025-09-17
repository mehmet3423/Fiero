import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import { GET_SUB_CATEGORY_LIST } from "@/constants/links";
import { SubCategoriesLookUp } from "@/constants/models/SubCategoryLookUp";
import { PaginationModel } from "@/constants/models/Pagination";
import useGetData from "@/hooks/useGetData";

export interface SubCategoryResponse {
  data: SubCategoriesLookUp[];
  pagination: PaginationModel;
}

export const useSubCategories = (mainCategoryId: string) => {
  const { data, isLoading, error } = useGetData<SubCategoryResponse>({
    url: mainCategoryId
      ? `${GET_SUB_CATEGORY_LIST}?MainCategoryId=${mainCategoryId}`
      : undefined,
    queryKey: [QueryKeys.SUB_CATEGORY_LIST, mainCategoryId],
    method: HttpMethod.GET,
    enabled: !!mainCategoryId,
    onError(err) {},
  });
  return {
    data: data?.data || [],
    pagination: data?.pagination,
    isLoading,
    error,
  };
};
