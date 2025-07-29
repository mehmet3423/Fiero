import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import { UserRole } from "@/constants/enums/UserRole";
import { GET_CUSTOMER_ORDERS, GET_SELLER_ORDERS } from "@/constants/links";
import { Order } from "@/constants/models/Order";
import { useAuth } from "@/hooks/context/useAuth";
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

export const useGetUserOrders = (page: number = 1, pageSize: number = 10) => {
  const { userProfile, userRole } = useAuth();

  const isSeller = userRole === UserRole.SELLER;

  // API isteği için parametreleri oluştur
  const params = new URLSearchParams();

  // CustomerID veya SellerID'yi sorgu parametresi olarak ekle
  if (userProfile?.id) {
    if (isSeller) {
      params.append("SellerId", userProfile.id);
    } else {
      params.append("CustomerId", userProfile.id);
    }
  }

  // Pagination parametrelerini ekle (API 0-based index kullanıyor)
  params.append("Page", (page - 1).toString());
  params.append("PageSize", pageSize.toString());

  let apiUrl = undefined;
  if (userProfile?.id && userRole) {
    apiUrl = `${
      isSeller ? GET_SELLER_ORDERS : GET_CUSTOMER_ORDERS
    }?${params.toString()}`;
  }

  const { data, isLoading, error } = useGetData<OrderResponse>({
    url: apiUrl,
    queryKey: [
      QueryKeys.USER_ORDER_LIST,
      page.toString(),
      pageSize.toString(),
      isSeller ? "seller" : "customer",
    ],
    method: HttpMethod.GET,
    enabled: !!userProfile?.id,
    onError: (err) => {
      console.error("Error fetching orders:", err);
    },
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
