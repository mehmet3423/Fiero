import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import { GET_SEO_BY_ID } from "@/constants/links";
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

export const useGetSeoById = (id: string, enabled = true) => {
  const params = new URLSearchParams({
    Id: id,
  }).toString();

  const { data, isLoading, error, refetch } = useGetData<SeoData>({
    url: `${GET_SEO_BY_ID}?${params}`,
    queryKey: [QueryKeys.SEO, id],
    method: HttpMethod.GET,
    enabled: enabled && !!id,
  });

  return {
    seoData: data,
    isLoading,
    error,
    refetch,
  };
};
