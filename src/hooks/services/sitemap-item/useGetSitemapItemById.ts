import { HttpMethod } from '@/constants/enums/HttpMethods';
import { QueryKeys } from '@/constants/enums/QueryKeys';
import { GET_BY_ID_SITEMAP_ITEM } from '@/constants/links';
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

export const useGetSitemapItemById = (id: string, enabled: boolean = true) => {
  const { data, isLoading, error, refetch } = useGetData<CommandResult<SitemapItem>>({
    url: `${GET_BY_ID_SITEMAP_ITEM}/${id}`,
    method: HttpMethod.GET,
    queryKey: [QueryKeys.SITEMAP_ITEM, 'byId', id],
    enabled: !!id && enabled,
  });

  return {
    item: data?.data,
    isSucceed: data?.isSucceed,
    isLoading,
    error,
    refetch,
  };
}; 