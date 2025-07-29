import { HttpMethod } from '@/constants/enums/HttpMethods';
import { QueryKeys } from '@/constants/enums/QueryKeys';
import { GET_ALL_SITEMAP_ITEMS } from '@/constants/links';
import useGetData from '@/hooks/useGetData';

export interface SitemapItem {
  id: string;
  url: string;
  changeFrequency: string;
  priority: number;
  isManual: boolean;
  createdOnValue: string;
  modifiedOnValue?: string;
}

export interface CommandResult<T> {
  isSucceed: boolean;
  data: T;
  message?: string;
}

export const useGetAllSitemapItems = (enabled: boolean = true) => {
  const { data, isLoading, error, refetch } = useGetData<CommandResult<SitemapItem[]>>({
    url: GET_ALL_SITEMAP_ITEMS,
    method: HttpMethod.GET,
    queryKey: [QueryKeys.SITEMAP_ITEM, 'all'],
    enabled,
  });

  return {
    items: data?.data || [],
    isSucceed: data?.isSucceed,
    isLoading,
    error,
    refetch,
  };
}; 