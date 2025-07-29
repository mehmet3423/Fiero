import { useQuery } from "@tanstack/react-query";
import { GET_PRODUCT_RETURN_REPORT } from "@/constants/links";
import { getToken } from "@/helpers/tokenUtils";
import {
  CancelReasonType,
  ProductReturnReportParams,
  ProductReturnReportResponse,
  getCancelReasonTypeDisplayName,
  getCancelReasonTypeColor,
  getCancelReasonTypeIcon,
} from "@/constants/models/reports";

const fetchProductReturnReport = async (
  params?: ProductReturnReportParams
): Promise<ProductReturnReportResponse> => {
  const url = new URL(GET_PRODUCT_RETURN_REPORT);

  if (
    params?.cancelReasonType !== undefined &&
    params.cancelReasonType !== CancelReasonType.ALL
  ) {
    url.searchParams.append(
      "cancelReasonType",
      params.cancelReasonType.toString()
    );
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

export const useProductReturnReport = (params?: ProductReturnReportParams) => {
  return useQuery({
    queryKey: [
      "productReturnReport",
      params?.cancelReasonType,
      params?.categoryKeyword,
    ],
    queryFn: () => fetchProductReturnReport(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

export default useProductReturnReport;
