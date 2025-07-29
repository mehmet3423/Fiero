import { useQuery } from "@tanstack/react-query";
import { GET_STOCK_REPORT } from "@/constants/links";
import { getToken } from "@/helpers/tokenUtils";
import {
  StockReportParams,
  StockReportResponse,
} from "@/constants/models/reports";

const fetchStockReport = async (
  params?: StockReportParams
): Promise<StockReportResponse> => {
  const url = new URL(GET_STOCK_REPORT);

  if (params?.page) {
    url.searchParams.append("Page", params.page.toString());
  }

  if (params?.pageSize) {
    url.searchParams.append("PageSize", params.pageSize.toString());
  }

  if (params?.from) {
    url.searchParams.append("From", params.from.toString());
  }

  if (params?.categoryKeyword) {
    url.searchParams.append("categoryKeyword", params.categoryKeyword);
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

export const useStockReport = (params?: StockReportParams) => {
  return useQuery({
    queryKey: [
      "stockReport",
      params?.categoryKeyword,
      params?.page,
      params?.pageSize,
    ],
    queryFn: () => fetchStockReport(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

export default useStockReport;
