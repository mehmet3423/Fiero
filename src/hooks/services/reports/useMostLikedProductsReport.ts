import { useQuery } from "@tanstack/react-query";
import { GET_MOST_LIKED_PRODUCTS_REPORT } from "@/constants/links";
import { getToken } from "@/helpers/tokenUtils";
import {
  MostLikedProductsReportParams,
  MostLikedProductsReportResponse,
} from "@/constants/models/reports";

const fetchMostLikedProductsReport = async (
  params?: MostLikedProductsReportParams
): Promise<MostLikedProductsReportResponse> => {
  const url = new URL(GET_MOST_LIKED_PRODUCTS_REPORT);

  // Boolean parametresi her zaman gönderilmeli (default false)
  url.searchParams.append("ascending", (params?.ascending ?? false).toString());

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

  if (params?.from) {
    url.searchParams.append("from", params.from.toString());
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

export const useMostLikedProductsReport = (
  params?: MostLikedProductsReportParams
) => {
  return useQuery({
    queryKey: [
      "mostLikedProductsReport",
      params?.ascending,
      params?.categoryKeyword,
      params?.productNameKeyword,
      params?.page,
      params?.pageSize,
      params?.from,
    ],
    queryFn: () => fetchMostLikedProductsReport(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

export default useMostLikedProductsReport;
