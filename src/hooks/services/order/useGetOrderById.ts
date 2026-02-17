import { HttpMethod } from "@/constants/enums/HttpMethods";
import { GET_ORDER_BY_ID } from "@/constants/links";
import { Order } from "@/constants/models/Order";
import useGetData from "@/hooks/useGetData";
import { QueryKeys } from "@/constants/enums/QueryKeys";

interface UseGetOrderByIdProps {
  orderId: string;
}

/** API bazen paginated { data: { items: Order[] } } döndürüyor */
interface OrderByIdResponse {
  data?: { items?: Order[] } | Order;
}

export const useGetOrderById = ({ orderId }: UseGetOrderByIdProps) => {
  const queryParams = new URLSearchParams();
  queryParams.append("id", orderId);

  const { data, isLoading, error, refetch } = useGetData<OrderByIdResponse>({
    url: `${GET_ORDER_BY_ID}?${queryParams}`,
    queryKey: [QueryKeys.ORDER_DETAIL, orderId],
    method: HttpMethod.GET,
    enabled: !!orderId,
  });

  const raw = data?.data;
  const order: Order | undefined = Array.isArray((raw as { items?: Order[] })?.items)
    ? (raw as { items: Order[] }).items?.[0]
    : (raw as Order);

  return {
    order,
    isLoading,
    error,
    refetchOrder: refetch,
  };
};
