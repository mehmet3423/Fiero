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
interface OrderFilters {
  search?: string;
  startDate?: string;
  endDate?: string;
  cargoStatus?: number;
  minPrice?: number;
  maxPrice?: number;
  from?: number;
}

export const useGetAllOrders = (
  page: number,
  pageSize: number,
  filters?: OrderFilters
) => {
  const params = new URLSearchParams();
  params.set("Page", (page - 1).toString()); // 0'dan başlaması için page-1
  params.set("PageSize", pageSize.toString());

  // Filtreleme parametrelerini ekle
  if (filters?.search) {
    params.set("Search", filters.search);
  }
  if (filters?.startDate) {
    params.set("StartDate", filters.startDate);
  }
  if (filters?.endDate) {
    params.set("EndDate", filters.endDate);
  }
  if (filters?.cargoStatus !== undefined && filters.cargoStatus !== null) {
    params.set("CargoStatus", filters.cargoStatus.toString());
  }
  if (filters?.minPrice !== undefined && filters.minPrice !== null) {
    params.set("MinPrice", filters.minPrice.toString());
  }
  if (filters?.maxPrice !== undefined && filters.maxPrice !== null) {
    params.set("MaxPrice", filters.maxPrice.toString());
  }
  if (filters?.from !== undefined && filters.from !== null) {
    params.set("From", filters.from.toString());
  }

  const { data, isLoading, error } = useGetData<{ data: OrderResponse }>({
    url: `${GET_ALL_ORDERS}?${params.toString()}`,
    queryKey: [QueryKeys.ALL_ORDERS, page.toString(), JSON.stringify(filters)],
    method: HttpMethod.GET,
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
