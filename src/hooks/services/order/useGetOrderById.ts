import { HttpMethod } from "@/constants/enums/HttpMethods";
import { GET_ORDER_BY_ID } from "@/constants/links";
import { Order } from "@/constants/models/Order";
import useGetData from "@/hooks/useGetData";
import { QueryKeys } from "@/constants/enums/QueryKeys";

interface UseGetOrderByIdProps {
  orderId: string;
}

export const useGetOrderById = ({ orderId }: UseGetOrderByIdProps) => {
  const queryParams = new URLSearchParams();
  queryParams.append("id", orderId);

  const { data, isLoading, error, refetch } = useGetData<{ data: Order }>({
    url: `${GET_ORDER_BY_ID}?${queryParams}`,
    queryKey: [QueryKeys.ORDER_DETAIL, orderId],
    method: HttpMethod.GET,
    enabled: !!orderId, // orderId varsa çalışsın
  });

  return {
    order: data?.data,
    isLoading,
    error,
    refetchOrder: refetch,
  };
};
