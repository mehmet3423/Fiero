import { useQuery } from "@tanstack/react-query";
import { GET_UNSOLD_PRODUCTS_REPORT } from "@/constants/links";
import { getToken } from "@/helpers/tokenUtils";
import {
  UnsoldProductsReportParams,
  UnsoldProductsReportResponse,
} from "@/constants/models/reports";

const fetchUnsoldProductsReport = async (
  params?: UnsoldProductsReportParams
): Promise<UnsoldProductsReportResponse> => {
  const url = new URL(GET_UNSOLD_PRODUCTS_REPORT);

  if (params?.productNameKeyword) {
    url.searchParams.append("productNameKeyword", params.productNameKeyword);
  }

  if (params?.categoryKeyword) {
    url.searchParams.append("categoryKeyword", params.categoryKeyword);
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

export const useUnsoldProductsReport = (
  params?: UnsoldProductsReportParams
) => {
  return useQuery({
    queryKey: [
      "unsoldProductsReport",
      params?.productNameKeyword,
      params?.categoryKeyword,
      params?.startDate,
      params?.endDate,
      params?.page,
      params?.pageSize,
    ],
    queryFn: () => fetchUnsoldProductsReport(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

export default useUnsoldProductsReport;
