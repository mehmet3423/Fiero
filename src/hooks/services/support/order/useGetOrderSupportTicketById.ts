import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import { GET_ORDER_SUPPORT_TICKET_BY_ID } from "@/constants/links";
import { OrderSupportTicket } from "@/constants/models/OrderSupportTicket";
import useGetData from "@/hooks/useGetData";

interface OrderSupportTicketByIdResponse {
  data: OrderSupportTicket;
}

export const useGetOrderSupportTicketById = (id: string) => {
  const { data, isLoading, error, refetch } =
    useGetData<OrderSupportTicketByIdResponse>({
      url: `${GET_ORDER_SUPPORT_TICKET_BY_ID}?id=${id}`,
      queryKey: [QueryKeys.ORDER_SUPPORT_TICKET_BY_ID, id],
      method: HttpMethod.GET,
      enabled: !!id, // Sadece id varsa fetch et
    });

  return {
    ticket: data?.data,
    isLoading,
    error,
    refetch,
  };
};
