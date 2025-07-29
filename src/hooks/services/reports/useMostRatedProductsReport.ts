import { useQuery } from "@tanstack/react-query";
import { GET_MOST_RATED_PRODUCTS_REPORT } from "@/constants/links";
import { getToken } from "@/helpers/tokenUtils";
import {
  MostRatedProductsReportParams,
  MostRatedProductsReportResponse,
} from "@/constants/models/reports";

const fetchMostRatedProductsReport = async (
  params?: MostRatedProductsReportParams
): Promise<MostRatedProductsReportResponse> => {
  const url = new URL(GET_MOST_RATED_PRODUCTS_REPORT);

  // Boolean parametresi her zaman gönderilmeli (default false)
  url.searchParams.append("ascending", (params?.ascending ?? false).toString());

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

export const useMostRatedProductsReport = (
  params?: MostRatedProductsReportParams
) => {
  return useQuery({
    queryKey: [
      "mostRatedProductsReport",
      params?.ascending,
      params?.page,
      params?.pageSize,
      params?.from,
    ],
    queryFn: () => fetchMostRatedProductsReport(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

export default useMostRatedProductsReport;
