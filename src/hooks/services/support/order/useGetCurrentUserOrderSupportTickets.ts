import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import { GET_CURRENT_USER_ORDER_SUPPORT_TICKETS } from "@/constants/links";
import { OrderSupportTicketResponse } from "@/constants/models/OrderSupportTicket";
import useGetData from "@/hooks/useGetData";

interface UseGetCurrentUserOrderSupportTicketsProps {
  page?: number;
  pageSize?: number;
  from?: string;
}

export const useGetCurrentUserOrderSupportTickets = ({
  page = 0,
  pageSize = 10,
  from,
}: UseGetCurrentUserOrderSupportTicketsProps = {}) => {
  const params = {
    Page: page,
    PageSize: pageSize,
    ...(from && { From: from }),
  };

  const { data, isLoading, error, refetch } =
    useGetData<OrderSupportTicketResponse>({
      url: GET_CURRENT_USER_ORDER_SUPPORT_TICKETS,
      params,
      queryKey: [
        QueryKeys.CURRENT_USER_ORDER_SUPPORT_TICKETS,
        String(page),
        String(pageSize),
        from,
      ],
      method: HttpMethod.GET,
    });

  return {
    tickets: data?.items || data?.data?.items || [],
    totalCount: data?.count || 0,
    totalPages: data?.pages || 0,
    hasNext: data?.hasNext || false,
    hasPrevious: data?.hasPrevious || false,
    isLoading,
    error,
    refetch,
  };
};

