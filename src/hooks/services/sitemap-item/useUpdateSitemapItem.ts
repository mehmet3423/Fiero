import { HttpMethod } from '@/constants/enums/HttpMethods';
import { UPDATE_SITEMAP_ITEM } from '@/constants/links';
import useMyMutation from '@/hooks/useMyMutation';

export interface UpdateSitemapItemRequest {
  id: string;
  url: string;
  baseUrl: string;
  changeFrequency: string;
  priority: number;
}

export interface CommandResult<T> {
  isSucceed: boolean;
  data: T;
  message?: string;
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

export const useUpdateSitemapItem = () => {
  const { mutate, data, error, isPending, isSuccess } = useMyMutation<CommandResult<SitemapItem>>();

  const updateSitemapItem = (request: UpdateSitemapItemRequest) => {
    mutate({
      url: UPDATE_SITEMAP_ITEM,
      method: HttpMethod.PUT,
      data: request,
    });
  };

  return {
    updateSitemapItem,
    data: data?.data?.data,
    isSucceed: data?.data?.isSucceed,
    isLoading: isPending,
    isSuccess,
    error,
  };
}; 