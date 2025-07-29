import { HttpMethod } from '@/constants/enums/HttpMethods';
import { DELETE_SITEMAP_ITEM } from '@/constants/links';
import useMyMutation from '@/hooks/useMyMutation';

export interface CommandResult<T> {
  isSucceed: boolean;
  data: T;
  message?: string;
}

export const useDeleteSitemapItem = () => {
  const { mutate, data, error, isPending, isSuccess } = useMyMutation<CommandResult<any>>();

  // Accepts id and optional options (e.g., onSuccess)
  const deleteSitemapItem = (id: string, options?: any) => {
    mutate({
      url: `${DELETE_SITEMAP_ITEM}/${id}`,
      method: HttpMethod.DELETE,
    }, options);
  };

  return {
    deleteSitemapItem,
    data: data?.data?.data,
    isSucceed: data?.data?.isSucceed,
    isLoading: isPending,
    isSuccess,
    error,
  };
}; 