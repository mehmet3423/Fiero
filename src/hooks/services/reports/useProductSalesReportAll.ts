import { useQuery } from "@tanstack/react-query";
import { GET_PRODUCT_SALES_REPORT_ALL } from "@/constants/links";
import { getToken } from "@/helpers/tokenUtils";
import { ProductSalesItem } from "@/constants/models/reports";

export interface ProductSalesReportAllParams {
  startDate?: string;
  endDate?: string;
  categoryKeyword?: string;
  customerNameKeyword?: string;
  isRegisteredCustomer?: boolean;
  ascending?: boolean;
}

export interface ProductSalesReportAllResponse {
  data?: {
    items: ProductSalesItem[];
  };
  items?: ProductSalesItem[];
  isSucceed: boolean;
  message: string;
}

const fetchProductSalesReportAll = async (
  params?: ProductSalesReportAllParams
): Promise<ProductSalesReportAllResponse> => {
  const url = new URL(GET_PRODUCT_SALES_REPORT_ALL);

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

  const responseData = await response.json();

  // "Veri bulunamadı" durumunu handle et
  if (!response.ok) {
    if (
      responseData?.message?.includes("bulunamadı") ||
      responseData?.message?.includes("not found")
    ) {
      return {
        items: [],
        isSucceed: false,
        message: responseData.message || "Veri bulunamadı",
      };
    }
    throw new Error(
      `HTTP error! status: ${response.status}, message: ${
        responseData?.message || "Unknown error"
      }`
    );
  }

  return responseData;
};

export const useProductSalesReportAll = (
  params?: ProductSalesReportAllParams
) => {
  return useQuery({
    queryKey: [
      "productSalesReportAll",
      params?.startDate,
      params?.endDate,
      params?.categoryKeyword,
      params?.customerNameKeyword,
      params?.isRegisteredCustomer,
      params?.ascending,
    ],
    queryFn: () => fetchProductSalesReportAll(params),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};
