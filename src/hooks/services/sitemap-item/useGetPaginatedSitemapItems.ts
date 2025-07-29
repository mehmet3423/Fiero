import useMyMutation from "@/hooks/useMyMutation";
import { HttpMethod } from '@/constants/enums/HttpMethods';
import { GET_PAGINATED_SITEMAP_ITEMS } from '@/constants/links';

// Types for request and response
export interface SitemapItemPaginatedRequest {
  page: number;
  pageSize: number;
  from?: number;
}

export interface SitemapItem {
  id: string;
  url: string;
  changeFrequency: string;
  priority: number;
  isManual: boolean;
  createdOnValue: string;
  modifiedOnValue?: string;
}

export interface SitemapItemPaginatedResponse {
  items: SitemapItem[];
  from: number;
  index: number;
  size: number;
  count: number;
  pages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

export const useGetPaginatedSitemapItems = () => {
  const { mutate, data, error, isPending } = useMyMutation<SitemapItemPaginatedResponse>();

  // Accepts params and optional options (e.g., onSuccess)
  const fetchPaginatedSitemapItems = (params: SitemapItemPaginatedRequest, options?: any) => {
    mutate({
      url: GET_PAGINATED_SITEMAP_ITEMS,
      method: HttpMethod.POST,
      data: params,
    }, options);
  };

  return {
    items: data?.data?.items || [],
    from: data?.data?.from,
    index: data?.data?.index,
    size: data?.data?.size,
    count: data?.data?.count,
    pages: data?.data?.pages,
    hasPrevious: data?.data?.hasPrevious,
    hasNext: data?.data?.hasNext,
    isLoading: isPending,
    error,
    fetchPaginatedSitemapItems,
  };
}; 