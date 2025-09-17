import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import { GET_MAIN_CATEGORY_LOOKUP_LIST } from "@/constants/links";
import { MainCategoryiesLookUpResponse } from "@/constants/models/MainCategoryLookUp";
import useGetData from "@/hooks/useGetData";

export const useMainCategoriesLookUp = () => {
  const { data, isLoading, error } = useGetData<{
    data: MainCategoryiesLookUpResponse;
  }>({
    url: GET_MAIN_CATEGORY_LOOKUP_LIST,
    queryKey: QueryKeys.MAIN_CATEGORY_LIST,
    method: HttpMethod.GET,
    onError(err) {},
  });

  // data null veya undefined ise boş dizi dön
  const categories = {
    data: data?.data || [],
  };

  return {
    categories,
    isLoading,
    error,
  };
};
