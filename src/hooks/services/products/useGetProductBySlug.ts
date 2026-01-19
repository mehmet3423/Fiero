import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import { GET_PRODUCT_BY_SLUG } from "@/constants/links";
import { GetProductByIdResponse } from "@/constants/models/Product";
import useGetData from "@/hooks/useGetData";

interface UseGetProductBySlugOptions {
  slug: string;
  enabled?: boolean;
}

export const useGetProductBySlug = (options: UseGetProductBySlugOptions) => {
  const { slug, enabled = true } = options;
  const params = new URLSearchParams({
    Slug: slug,
  }).toString();

  const { data, isLoading, error, refetch } = useGetData<GetProductByIdResponse>({
    url: slug ? `${GET_PRODUCT_BY_SLUG}?${params}` : undefined,
    queryKey: [QueryKeys.GET_PRODUCT_BY_ID, "slug", slug],
    method: HttpMethod.GET,
    enabled: enabled && !!slug,
  });

  return {
    data: data?.data,
    isSuccess: data?.isSucceed,
    message: data?.message,
    isLoading,
    error,
    refetch,
  };
};
