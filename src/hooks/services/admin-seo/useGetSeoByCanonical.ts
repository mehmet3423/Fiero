import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import { GET_SEO_BY_CANONICAL } from "@/constants/links";
import { CommandResultWithData } from "@/constants/models/CommandResult";
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
  // Backend logic: canonical her zaman "/" ile başlamalı
  let canonicalPath = canonical?.trim() || "";
  if (canonicalPath && !canonicalPath.startsWith("/")) {
    canonicalPath = "/" + canonicalPath;
  }

  // Use encodeURIComponent to properly encode the canonical path
  // This prevents URLSearchParams from double-encoding the slash
  const encodedCanonical = encodeURIComponent(canonicalPath);

  const { data, isLoading, error, refetch } = useGetData<
    CommandResultWithData<SeoData>
  >({
    url: `${GET_SEO_BY_CANONICAL}?canonical=${encodedCanonical}`,
    queryKey: [QueryKeys.SEO, "canonical", canonicalPath],
    method: HttpMethod.GET,
    enabled: enabled && !!canonicalPath,
    onError: (err) => {
    },
  });

  const seoData = data?.data || null;

  return {
    seoData,
    isLoading,
    error,
    refetch,
  };
};
