import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import { GET_MAIN_CATEGORY_LIST } from "@/constants/links";
import { CategoryListResponse } from "@/constants/models/Category";
import useGetData from "@/hooks/useGetData";

export const useCategories = () => {
  const { data, isLoading, error } = useGetData<{ data: CategoryListResponse }>(
    {
      url: GET_MAIN_CATEGORY_LIST,
      queryKey: QueryKeys.MAIN_CATEGORY_LIST,
      method: HttpMethod.GET,
      onError(err) {
      },
    }
  );

  return {
    categories: data?.data,
    isLoading,
    error,
  };
};
