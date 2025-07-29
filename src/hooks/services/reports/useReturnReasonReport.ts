import { useQuery } from "@tanstack/react-query";
import { GET_RETURN_REASON_REPORT } from "@/constants/links";
import { getToken } from "@/helpers/tokenUtils";
import {
  ReturnReasonReportParams,
  ReturnReasonReportResponse,
  getReasonTypeInfo,
  getPercentageColor,
} from "@/constants/models/reports";

const fetchReturnReasonReport = async (
  params?: ReturnReasonReportParams
): Promise<ReturnReasonReportResponse> => {
  const url = new URL(GET_RETURN_REASON_REPORT);

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

export const useReturnReasonReport = (params?: ReturnReasonReportParams) => {
  return useQuery({
    queryKey: ["returnReasonReport", params?.page, params?.pageSize],
    queryFn: () => fetchReturnReasonReport(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

export default useReturnReasonReport;
