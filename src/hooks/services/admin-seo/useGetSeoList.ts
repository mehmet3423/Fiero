import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import { GET_SEO_LIST } from "@/constants/links";
import { CommandResultWithData } from "@/constants/models/CommandResult";
import { PaginationModel } from "@/constants/models/Pagination";
import useGetData from "@/hooks/useGetData";
import toast from "react-hot-toast";

interface SeoListItem {
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

interface SeoListResponse extends PaginationModel {
  $id: string;
  items: SeoListItem[];
}

interface SeoListParams {
  page?: number;
  pageSize?: number;
  from?: number;
  productId?: string;
  mainCategoryId?: string;
  subCategoryId?: string;
}

export const useGetSeoList = (params: SeoListParams = {}, enabled = true) => {
  const queryParams = new URLSearchParams();

  // Add pagination params
  if (params.page) queryParams.append("Page", params.page.toString());
  if (params.pageSize)
    queryParams.append("PageSize", params.pageSize.toString());
  if (params.from) queryParams.append("From", params.from.toString());

  // Add filter params
  if (params.productId) queryParams.append("ProductId", params.productId);
  if (params.mainCategoryId)
    queryParams.append("MainCategoryId", params.mainCategoryId);
  if (params.subCategoryId)
    queryParams.append("SubCategoryId", params.subCategoryId);

  const { data, isLoading, error, refetch } = useGetData<CommandResultWithData<SeoListResponse>>({
    url: `${GET_SEO_LIST}?${queryParams.toString()}`,
    queryKey: [QueryKeys.SEO, "list", JSON.stringify(params)],
    method: HttpMethod.GET,
    enabled,
    onError: (err) => {
      toast.error("SEO listesi alınırken bir hata oluştu");
    },
  });

  // Check if the response is successful according to CommandResult structure
  const seoListData = data?.isSucceed && data?.data ? data.data : null;

  // Show error toast if the response indicates failure
  if (data && !data.isSucceed && data.message) {
    toast.error(data.message);
  }

  return {
    seoList: seoListData?.items || [],
    totalCount: seoListData?.count || 0,
    pageCount: seoListData?.pages || 0,
    currentPage: seoListData?.index ? seoListData.index + 1 : 1, // API 0-based, UI 1-based
    isLoading,
    error,
    refetch,
  };
};
