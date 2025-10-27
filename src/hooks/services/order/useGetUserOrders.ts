import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import { GET_ORDER_LIST_FROM_TOKEN } from "@/constants/links";
import { Order } from "@/constants/models/Order";
import { CommandResultWithData } from "@/constants/models/CommandResult";
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

export const useGetOrdersFromToken = (page: number = 1, pageSize: number = 10) => {
  // API isteği için parametreleri oluştur
  const params = new URLSearchParams();

  // Pagination parametrelerini ekle (API 0-based index kullanıyor)
  params.append("Page", (page - 1).toString());
  params.append("PageSize", pageSize.toString());

  // Token-based order list endpoint'i kullanılıyor
  const apiUrl = `${GET_ORDER_LIST_FROM_TOKEN}?${params.toString()}`;

  const { data, isLoading, error } = useGetData<CommandResultWithData<OrderResponse>>({
    url: apiUrl,
    queryKey: [
      QueryKeys.USER_ORDER_LIST,
      page.toString(),
      pageSize.toString(),
      "token-based", // Token-based endpoint olduğu için güncellendi
    ],
    method: HttpMethod.GET,
    enabled: true, // Her zaman aktif
    onError: (err) => {
    },
  });

  return {
    orders: data?.data?.items || [],
    totalPages: data?.data?.pages || 0,
    totalCount: data?.data?.count || 0,
    isLoading,
    error,
    hasNext: data?.data?.hasNext || false,
    hasPrevious: data?.data?.hasPrevious || false,
  };
};
