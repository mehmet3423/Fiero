import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import { GET_ALL_ORDERS } from "@/constants/links";
import { Order } from "@/constants/models/Order";
import useGetData from "@/hooks/useGetData";

interface OrderResponse {
  items: Order[];
  from: number;
  index: number;
  size: number;
  count: number;
  pages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}
export const useGetAllOrders = (page: number, pageSize: number) => {
  const params = new URLSearchParams();
  params.set("Page", page.toString());
  params.set("PageSize", pageSize.toString());

  const { data, isLoading, error } = useGetData<OrderResponse>({
    url: `${GET_ALL_ORDERS}?${params.toString()}`,
    queryKey: [QueryKeys.ALL_ORDERS, page.toString()],
    method: HttpMethod.GET,
  });

  return {
    orders: data?.items || [],
    totalPages: data?.pages || 0,
    totalCount: data?.count || 0,
    isLoading,
    error,
    hasNext: data?.hasNext || false,
    hasPrevious: data?.hasPrevious || false,
  };
};
