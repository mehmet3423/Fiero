import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import { GET_REFUND_REQUESTED_ORDER_ITEMS } from "@/constants/links";
import {
  RefundRequestedOrderItemsResponse,
} from "@/constants/models/Order";
import { CommandResultWithData } from "@/constants/models/CommandResult";
import useGetData from "@/hooks/useGetData";

interface RefundRequestFilters {
  search?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  pageSize?: number;
  from?: number;
}

export const useGetRefundRequestedOrderItems = (
  page: number,
  pageSize: number,
  filters?: RefundRequestFilters
) => {
  const params = new URLSearchParams();
  params.set("Page", (page - 1).toString());
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
  if (filters?.from !== undefined && filters.from !== null) {
    params.set("From", filters.from.toString());
  }

  const { data, isLoading, error, refetch } = useGetData<
    CommandResultWithData<RefundRequestedOrderItemsResponse>
  >({
    url: `${GET_REFUND_REQUESTED_ORDER_ITEMS}?${params.toString()}`,
    queryKey: [
      QueryKeys.REFUND_REQUESTED_ORDER_ITEMS,
      page.toString(),
      JSON.stringify(filters),
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

