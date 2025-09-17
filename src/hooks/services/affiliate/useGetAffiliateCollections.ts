import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import { GET_CURRENT_USERS_COLLECTIONS } from "@/constants/links";
import { AffiliateCollection } from "@/constants/models/Affiliate";
import useGetData from "@/hooks/useGetData";

interface UseGetAffiliateCollectionsParams {
  page?: number;
  pageSize?: number;
  noPagination?: boolean;
}

export const useGetAffiliateCollections = (
  params?: UseGetAffiliateCollectionsParams
) => {
  const { page = 1, pageSize = 10, noPagination = false } = params || {};

  const queryParams = new URLSearchParams();

  if (!noPagination) {
    queryParams.set("Page", page.toString());
    queryParams.set("PageSize", pageSize.toString());
  }

  const url = `${GET_CURRENT_USERS_COLLECTIONS}${
    queryParams.toString() ? "?" + queryParams.toString() : ""
  }`;

  const { data, isLoading, error, refetch } = useGetData<AffiliateCollection[]>(
    {
      url,
      queryKey: [QueryKeys.AFFILIATE_COLLECTIONS],
      method: HttpMethod.GET,
      onError: (err: any) => {
      },
    }
  );

  return {
    collections: data || [],
    pagination: {
      page: page,
      size: pageSize,
      count: data?.length ?? 0,
      pages: Math.ceil((data?.length ?? 0) / pageSize),
      hasPrevious: page > 1,
      hasNext: page < Math.ceil((data?.length ?? 0) / pageSize),
    },
    isLoading,
    error,
    refetchCollections: refetch,
  };
};
