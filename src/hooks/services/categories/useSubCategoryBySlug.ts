import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import { GET_SUB_CATEGORY_BY_SLUG } from "@/constants/links";
import { SubCategory } from "@/constants/models/Category";
import useGetData from "@/hooks/useGetData";

interface SubCategoryBySlugResponse {
  data: SubCategory;
}

export const useSubCategoryBySlug = (slug: string, enabled = true) => {
  const params = new URLSearchParams({
    Slug: slug,
  }).toString();

  const { data, isLoading, error, refetch } =
    useGetData<SubCategoryBySlugResponse>({
      url: slug ? `${GET_SUB_CATEGORY_BY_SLUG}?${params}` : undefined,
      queryKey: [QueryKeys.SUB_CATEGORY_BY_SLUG, slug],
      method: HttpMethod.GET,
      enabled: enabled && !!slug,
    });

  return {
    subCategory: data?.data,
    isLoading,
    error,
    refetch,
  };
};
