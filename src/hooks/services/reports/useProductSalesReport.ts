import { useQuery } from "@tanstack/react-query";
import { GET_PRODUCT_SALES_REPORT } from "@/constants/links";
import { getToken } from "@/helpers/tokenUtils";
import {
  ProductSalesReportParams,
  ProductSalesReportResponse,
} from "@/constants/models/reports";

const fetchProductSalesReport = async (
  params?: ProductSalesReportParams
): Promise<ProductSalesReportResponse> => {
  const url = new URL(GET_PRODUCT_SALES_REPORT);

  if (params?.page) {
    url.searchParams.append("page", params.page.toString());
  }

  if (params?.pageSize) {
    url.searchParams.append("pageSize", params.pageSize.toString());
  }

  if (params?.from) {
    url.searchParams.append("from", params.from.toString());
  }

  if (params?.startDate) {
    url.searchParams.append("startDate", params.startDate);
  }

  if (params?.endDate) {
    url.searchParams.append("endDate", params.endDate);
  }

  if (params?.categoryKeyword) {
    url.searchParams.append("categoryKeyword", params.categoryKeyword);
  }

  if (params?.customerNameKeyword) {
    url.searchParams.append("customerNameKeyword", params.customerNameKeyword);
  }

  if (params?.isRegisteredCustomer !== undefined) {
    url.searchParams.append(
      "isRegisteredCustomer",
      params.isRegisteredCustomer.toString()
    );
  }

  if (params?.ascending !== undefined) {
    url.searchParams.append("ascending", params.ascending.toString());
  }

  const token = getToken();
  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

export const useProductSalesReport = (params?: ProductSalesReportParams) => {
  return useQuery({
    queryKey: [
      "productSalesReport",
      params?.page,
      params?.pageSize,
      params?.from,
      params?.startDate,
      params?.endDate,
      params?.categoryKeyword,
      params?.customerNameKeyword,
      params?.isRegisteredCustomer,
      params?.ascending,
    ],
    queryFn: () => fetchProductSalesReport(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

export default useProductSalesReport;
