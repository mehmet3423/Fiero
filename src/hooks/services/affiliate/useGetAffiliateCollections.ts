import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import { GET_CURRENT_USERS_COLLECTIONS } from "@/constants/links";
import {
  AffiliateCollection,
  AffiliateCollectionListResponse,
} from "@/constants/models/Affiliate";
import useGetData from "@/hooks/useGetData";

interface UseGetAffiliateCollectionsParams {
  page?: number;
  pageSize?: number;
  earningType?: number | null;
  from?: number;
}

interface AffiliateCollectionsResponse {
  data?: AffiliateCollectionListResponse;
  isSucceed?: boolean;
  message?: string;
}

export const useGetAffiliateCollections = (
  params?: UseGetAffiliateCollectionsParams
) => {
  const {
    page = 1,
    pageSize = 10,
    earningType,
    from,
  } = params || {};

  const queryParams = new URLSearchParams();
  queryParams.set("Page", page.toString());
  queryParams.set("PageSize", pageSize.toString());

  if (from !== undefined) {
    queryParams.set("From", from.toString());
  }

  if (earningType !== undefined && earningType !== null) {
    queryParams.set("earningType", earningType.toString());
  }

  const queryKey = [
    QueryKeys.AFFILIATE_COLLECTIONS,
    page.toString(),
    pageSize.toString(),
    earningType !== undefined && earningType !== null
      ? earningType.toString()
      : "all",
    from !== undefined ? from.toString() : "start",
  ];

  const { data, isLoading, error, refetch } =
    useGetData<AffiliateCollectionsResponse>({
      url: `${GET_CURRENT_USERS_COLLECTIONS}?${queryParams.toString()}`,
      queryKey,
      method: HttpMethod.GET,
      onError: () => {},
    });

  const payload = data?.data;

  const count = payload?.count ?? 0;
  const pageValue = payload?.page ?? page;
  const sizeValue = payload?.size ?? pageSize;
  const totalPages =
    payload?.pages ?? (sizeValue > 0 ? Math.ceil(count / sizeValue) : 0);
  const hasPrevious = payload?.hasPrevious ?? pageValue > 1;
  const hasNext = payload?.hasNext ?? pageValue < totalPages;

  return {
    collections: (payload?.items as AffiliateCollection[]) ?? [],
    totalCount: count,
    pagination: {
      page: pageValue,
      size: sizeValue,
      count,
      pages: totalPages,
      hasPrevious,
      hasNext,
    },
    isLoading,
    error,
    refetchCollections: refetch,
  };
};
