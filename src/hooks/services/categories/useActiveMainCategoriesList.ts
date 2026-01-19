import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import { GET_ACTIVE_MAIN_CATEGORY_LIST } from "@/constants/links";
import { CategoryListResponse } from "@/constants/models/Category";
import useGetData from "@/hooks/useGetData";

interface UseActiveMainCategoriesListOptions {
  name?: string;
  page?: number;
  pageSize?: number;
  from?: number;
}

export const useActiveMainCategoriesList = (
  options?: UseActiveMainCategoriesListOptions
) => {
  const { data, isLoading, error } = useGetData<{ data: CategoryListResponse }>(
    {
      url: GET_ACTIVE_MAIN_CATEGORY_LIST,
      queryKey: [
        QueryKeys.ACTIVE_MAIN_CATEGORY_LIST,
        options?.name,
        options?.page,
        options?.pageSize,
        options?.from,
      ],
      method: HttpMethod.GET,
      params: {
        ...(options?.name && { Name: options.name }),
        ...(options?.page !== undefined && { Page: options.page }),
        ...(options?.pageSize !== undefined && { PageSize: options.pageSize }),
        ...(options?.from !== undefined && { From: options.from }),
      },
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
