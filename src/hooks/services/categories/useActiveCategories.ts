import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import { GET_ACTIVE_MAIN_CATEGORY_LIST, GET_SUB_CATEGORY_LIST } from "@/constants/links";
import { CategoryListResponse } from "@/constants/models/Category";
import useGetData from "@/hooks/useGetData";

export const useActiveCategories = () => {
  const queryClient = useQueryClient();

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

  // Prefetch subcategories when categories load
  useEffect(() => {
    if (data?.data?.items && data.data.items.length > 0) {
      data.data.items.forEach(category => {
        queryClient.prefetchQuery({
          queryKey: [QueryKeys.SUB_CATEGORY_LIST, category.id],
          queryFn: async () => {
            const response = await fetch(`${GET_SUB_CATEGORY_LIST}?MainCategoryId=${category.id}`);
            if (!response.ok) {
              throw new Error('Failed to fetch subcategories');
            }
            return response.json();
          },
          staleTime: 300000, // 5 minutes for subcategories
        });
      });
    }
  }, [data?.data?.items, queryClient]);

  return {
    categories: data?.data,
    isLoading,
    error,
  };
};
