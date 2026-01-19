import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import { GET_MAIN_CATEGORY_BY_SLUG } from "@/constants/links";
import { Category } from "@/constants/models/Category";
import useGetData from "@/hooks/useGetData";

interface MainCategoryBySlugResponse {
  data: Category;
}

export const useMainCategoryBySlug = (slug: string, enabled = true) => {
  const params = new URLSearchParams({
    Slug: slug,
  }).toString();

  const { data, isLoading, error, refetch } =
    useGetData<MainCategoryBySlugResponse>({
      url: slug ? `${GET_MAIN_CATEGORY_BY_SLUG}?${params}` : undefined,
      queryKey: [QueryKeys.MAIN_CATEGORY_BY_SLUG, slug],
      method: HttpMethod.GET,
      enabled: enabled && !!slug,
    });

  return {
    category: data?.data,
    isLoading,
    error,
    refetch,
  };
};
