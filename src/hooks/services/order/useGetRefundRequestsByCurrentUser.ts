import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import { GET_REFUND_REQUESTED_ORDERS_BY_CURRENT_USER } from "@/constants/links";
import {
  RefundRequestedOrderItemsResponse,
} from "@/constants/models/Order";
import { CommandResultWithData } from "@/constants/models/CommandResult";
import useGetData from "@/hooks/useGetData";

export interface CurrentUserRefundFilters {
  search?: string;
  startDate?: string;
  endDate?: string;
  isRefundApproved?: boolean;
  from?: number;
}

export const useGetRefundRequestsByCurrentUser = (
  page: number = 1,
  pageSize: number = 10,
  filters?: CurrentUserRefundFilters
) => {
  const params = new URLSearchParams();
  params.set("Page", Math.max(page - 1, 0).toString());
  params.set("PageSize", pageSize.toString());

  if (filters?.search) {
    params.set("Search", filters.search);
  }

  if (filters?.startDate) {
    params.set("StartDate", filters.startDate);
  }

  if (filters?.endDate) {
    params.set("EndDate", filters.endDate);
  }

  if (typeof filters?.isRefundApproved === "boolean") {
    params.set("IsRefundApproved", String(filters.isRefundApproved));
  }

  if (filters?.from !== undefined && filters.from !== null) {
    params.set("From", filters.from.toString());
  }

  const { data, isLoading, error, refetch } = useGetData<
    CommandResultWithData<RefundRequestedOrderItemsResponse>
  >({
    url: `${GET_REFUND_REQUESTED_ORDERS_BY_CURRENT_USER}?${params.toString()}`,
    queryKey: [
      QueryKeys.USER_REFUND_REQUESTS,
      page.toString(),
      pageSize.toString(),
      JSON.stringify(filters ?? {}),
    ],
    method: HttpMethod.GET,
  });

  return {
    refundRequests: data?.data?.items || [],
    totalPages: data?.data?.pages || 0,
    totalCount: data?.data?.count || 0,
    isLoading,
    error,
    hasNext: data?.data?.hasNext || false,
    hasPrevious: data?.data?.hasPrevious || false,
    refetchRefundRequests: refetch,
  };
};


