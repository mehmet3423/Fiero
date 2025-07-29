import { HttpMethod } from '@/constants/enums/HttpMethods';
import { CREATE_SITEMAP_ITEM } from '@/constants/links';
import useMyMutation from '@/hooks/useMyMutation';

export interface CreateSitemapItemRequest {
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

export const useCreateSitemapItem = () => {
  return useMyMutation<CommandResult<SitemapItem>>();
}; 