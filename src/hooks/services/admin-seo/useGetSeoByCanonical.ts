import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import { GET_SEO_BY_CANONICAL } from "@/constants/links";
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

export const useGetSeoByCanonical = (canonical: string, enabled = true) => {
  const params = new URLSearchParams({
    canonical,
  }).toString();

  const { data, isLoading, error, refetch } = useGetData<SeoData>({
    url: `${GET_SEO_BY_CANONICAL}?${params}`,
    queryKey: [QueryKeys.SEO, "canonical", canonical],
    method: HttpMethod.GET,
    enabled: enabled && !!canonical,
  });

  return {
    seoData: data,
    isLoading,
    error,
    refetch,
  };
}; 