import { useQuery } from "@tanstack/react-query";
import { GET_PASSIVE_PRODUCTS_REPORT } from "@/constants/links";
import { getToken } from "@/helpers/tokenUtils";
import {
  PassiveProductsReportParams,
  PassiveProductsReportResponse,
} from "@/constants/models/reports";

const fetchPassiveProductsReport = async (
  params?: PassiveProductsReportParams
): Promise<PassiveProductsReportResponse> => {
  const url = new URL(GET_PASSIVE_PRODUCTS_REPORT);

  if (params?.categoryKeyword) {
    url.searchParams.append("categoryKeyword", params.categoryKeyword);
  }

  if (params?.barcodeNumberKeyword) {
    url.searchParams.append(
      "barcodeNumberKeyword",
      params.barcodeNumberKeyword
    );
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

export const usePassiveProductsReport = (
  params?: PassiveProductsReportParams
) => {
  return useQuery({
    queryKey: [
      "passiveProductsReport",
      params?.categoryKeyword,
      params?.barcodeNumberKeyword,
      params?.page,
      params?.pageSize,
      params?.from,
    ],
    queryFn: () => fetchPassiveProductsReport(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

export default usePassiveProductsReport;
