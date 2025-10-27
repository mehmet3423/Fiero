import { useQuery } from "@tanstack/react-query";
import { GET_PRODUCT_CART_REPORT } from "@/constants/links";
import { getToken, handleLogout } from "@/helpers/tokenUtils";
import toast from "react-hot-toast";
import {
  ProductCartReportParams,
  ProductCartReportResponse,
  getQuantityLevelInfo,
  getCartAge,
  formatCurrency,
} from "@/constants/models/reports";

const fetchProductCartReport = async (
  params?: ProductCartReportParams
): Promise<ProductCartReportResponse> => {
  const url = new URL(GET_PRODUCT_CART_REPORT);

  if (params?.customerNameKeyword) {
    url.searchParams.append("customerNameKeyword", params.customerNameKeyword);
  }

  if (params?.categoryKeyword) {
    url.searchParams.append("categoryKeyword", params.categoryKeyword);
  }

  if (params?.productNameKeyword) {
    url.searchParams.append("productNameKeyword", params.productNameKeyword);
  }

  if (params?.page) {
    url.searchParams.append("page", params.page.toString());
  }

  if (params?.pageSize) {
    url.searchParams.append("pageSize", params.pageSize.toString());
  }

  const token = getToken();

  // Token expiration kontrolü
  if (token) {
    const tokenParts = token.split(".");
    if (tokenParts.length === 3) {
      const payload = JSON.parse(atob(tokenParts[1]));
      const exp = payload.exp * 1000;

      if (Date.now() >= exp) {
        handleLogout();
        throw new Error("Token expired");
      }
    }
  }

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  if (!response.ok) {
    // 401 error handling
    if (response.status === 401 && token) {
      handleLogout();
    }
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

export const useProductCartReport = (params?: ProductCartReportParams) => {
  return useQuery({
    queryKey: [
      "productCartReport",
      params?.customerNameKeyword,
      params?.categoryKeyword,
      params?.productNameKeyword,
      params?.page,
      params?.pageSize,
    ],
    queryFn: () => fetchProductCartReport(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

export default useProductCartReport;
