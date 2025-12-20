import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import { GET_SEO_BY_SLUG } from "@/constants/links";
import useGetData from "@/hooks/useGetData";

interface SeoData {
  id: string;
  title: string;
  description: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  canonical: string;
  robotsMetaTag: string;
  author: string;
  publisher: string;
  language: string;
  ogTitle: string;
  ogDescription: string;
  ogImageUrl: string;
  structuredDataJson: string;
  isIndexed: boolean;
  isFollowed: boolean;
  productId?: string;
  mainCategoryId?: string;
  subCategoryId?: string;
}

export const useGetSeoBySlug = (slug: string, enabled = true) => {
  const params = new URLSearchParams({
    Slug: slug,
  }).toString();

  const { data, isLoading, error, refetch } = useGetData<SeoData>({
    url: `${GET_SEO_BY_SLUG}?${params}`,
    queryKey: [QueryKeys.SEO, "slug", slug],
    method: HttpMethod.GET,
    enabled: enabled && !!slug,
  });

  return {
    seoData: data,
    isLoading,
    error,
    refetch,
  };
};
