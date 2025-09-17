import { HttpMethod } from "@/constants/enums/HttpMethods";
import { GET_ORDER_SUPPORT_TICKETS } from "@/constants/links";
import { OrderSupportTicketResponse } from "@/constants/models/OrderSupportTicket";
import useGetData from "@/hooks/useGetData";

interface UseGetOrderSupportTicketsProps {
  page?: number;
  pageSize?: number;
  requestType?: number;
  title?: string;
  from?: string;
}

export const useGetOrderSupportTickets = ({
  page = 1,
  pageSize = 10,
  requestType,
  title,
  from,
}: UseGetOrderSupportTicketsProps = {}) => {
  const params = {
    Page: page,
    PageSize: pageSize,
    ...(requestType !== undefined && { RequestType: requestType }),
    ...(title && { Title: title }),
    ...(from !== undefined && { From: from }),
  };

  const { data, isLoading, error, refetch } = useGetData<{
    data: OrderSupportTicketResponse;
  }>({
    url: GET_ORDER_SUPPORT_TICKETS,
    params,
    queryKey: [
      "orderSupportTickets",
      String(page),
      String(pageSize),
      requestType !== undefined ? String(requestType) : undefined,
      title,
      from,
    ],
    method: HttpMethod.GET,
  });

  return {
    tickets: data?.data?.items || [],
    totalCount: data?.data?.count || 0,
    isLoading,
    error,
    refetch,
  };
};
