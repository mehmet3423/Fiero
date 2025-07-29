import { useQuery } from "@tanstack/react-query";
import { GET_FAVORITE_PRODUCTS_REPORT } from "@/constants/links";
import { getToken } from "@/helpers/tokenUtils";
import {
  FavoriteProductsReportParams,
  FavoriteProductsReportResponse,
} from "@/constants/models/reports";

const fetchFavoriteProductsReport = async (
  params?: FavoriteProductsReportParams
): Promise<FavoriteProductsReportResponse> => {
  const url = new URL(GET_FAVORITE_PRODUCTS_REPORT);

  if (params?.productNameKeyword) {
    url.searchParams.append("productNameKeyword", params.productNameKeyword);
  }

  if (params?.categoryKeyword) {
    url.searchParams.append("categoryKeyword", params.categoryKeyword);
  }

  if (params?.customerNameKeyword) {
    url.searchParams.append("customerNameKeyword", params.customerNameKeyword);
  }

  if (params?.startDate) {
    url.searchParams.append("startDate", params.startDate);
  }

  if (params?.endDate) {
    url.searchParams.append("endDate", params.endDate);
  }

  if (params?.page) {
    url.searchParams.append("page", params.page.toString());
  }

  if (params?.pageSize) {
    url.searchParams.append("pageSize", params.pageSize.toString());
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

export const useFavoriteProductsReport = (
  params?: FavoriteProductsReportParams
) => {
  return useQuery({
    queryKey: [
      "favoriteProductsReport",
      params?.productNameKeyword,
      params?.categoryKeyword,
      params?.customerNameKeyword,
      params?.startDate,
      params?.endDate,
      params?.page,
      params?.pageSize,
    ],
    queryFn: () => fetchFavoriteProductsReport(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

export default useFavoriteProductsReport;
