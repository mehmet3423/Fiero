import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import { GET_ACTIVE_MAIN_CATEGORY_LIST } from "@/constants/links";
import { CategoryListResponse } from "@/constants/models/Category";
import useGetData from "@/hooks/useGetData";

export const useActiveCategories = () => {
  // Paginationlu endpoint kullanarak tüm kategorileri alıyoruz (seo bilgisi için)
  // API maksimum 100 sayfa boyutu kabul ediyor
  const { data, isLoading, error } = useGetData<{ data: CategoryListResponse }>(
    {
      url: GET_ACTIVE_MAIN_CATEGORY_LIST,
      queryKey: QueryKeys.ACTIVE_MAIN_CATEGORY_LIST,
      method: HttpMethod.GET,
      params: {
        Page: 0,
        PageSize: 100, // API maksimum 100 kabul ediyor
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
