import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import { GET_SUB_CATEGORY_LIST } from "@/constants/links";
import { SubCategory } from "@/constants/models/Category";
import { PaginationModel } from "@/constants/models/Pagination";
import useGetData from "@/hooks/useGetData";

export interface SubCategoryResponse {
  data: {
    items: SubCategory[];
    count: number;
    from: number;
    hasNext: boolean;
    hasPrevious: boolean;
    index: number;
    pages: number;
    size: number;
  };
  isSucceed: boolean;
  message: string;
}

export const useSubCategories = (mainCategoryId: string) => {
  const { data, isLoading, error } = useGetData<SubCategoryResponse>({
    url: mainCategoryId
      ? `${GET_SUB_CATEGORY_LIST}?MainCategoryId=${mainCategoryId}`
      : undefined,
    queryKey: [QueryKeys.SUB_CATEGORY_LIST, mainCategoryId],
    method: HttpMethod.GET,
    enabled: !!mainCategoryId,
    staleTime: 300000, // 5 minutes instead of 30 seconds
    cacheTime: 600000, // 10 minutes
    onError(err) {},
  });
  return {
    data: data?.data?.items || [],
    pagination: data?.data,
    isLoading,
    error,
  };
};
