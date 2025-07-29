import { HttpMethod } from "@/constants/enums/HttpMethods";
import { GET_SELLER_ORDERS } from "@/constants/links";
import { GetOrdersBySellerIdRequest, OrderResponse } from "@/constants/models/Order";
import useGetData from "@/hooks/useGetData";

export const useGetSellerOrders = ({ 
  sellerId,
  page = 1, 
  pageSize = 10,
  from
}: GetOrdersBySellerIdRequest) => {
  const queryParams = new URLSearchParams();
  queryParams.append("sellerId", sellerId);
  queryParams.append("page", page.toString());
  queryParams.append("pageSize", pageSize.toString());
  if (from) queryParams.append("from", from.toString());

  const { data, isLoading, error, refetch } = useGetData<OrderResponse>({
    url: `${GET_SELLER_ORDERS}?${queryParams}`,
    queryKey: ["sellerOrders", sellerId, page.toString(), pageSize.toString(), from?.toString()],
    method: HttpMethod.GET,
    enabled: !!sellerId
  });

  return {
    orders: data?.items || [],
    totalCount: data?.count || 0,
    isLoading,
    error,
    refetchOrders: refetch
  };
}; 