import { useQuery } from "@tanstack/react-query";
import { GET_MEDIA_MISSING_PRODUCTS_REPORT } from "@/constants/links";
import { getToken } from "@/helpers/tokenUtils";
import {
  MediaMissingProductsReportParams,
  MediaMissingProductsReportResponse,
} from "@/constants/models/reports";

const fetchMediaMissingProductsReport = async (
  params?: MediaMissingProductsReportParams
): Promise<MediaMissingProductsReportResponse> => {
  const url = new URL(GET_MEDIA_MISSING_PRODUCTS_REPORT);

  // Boolean parametreler her zaman gönderilmeli (default false)
  url.searchParams.append(
    "withoutContentImage",
    (params?.withoutContentImage ?? false).toString()
  );
  url.searchParams.append(
    "withoutBanner",
    (params?.withoutBanner ?? false).toString()
  );
  url.searchParams.append(
    "withoutVideo",
    (params?.withoutVideo ?? false).toString()
  );

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

export const useMediaMissingProductsReport = (
  params?: MediaMissingProductsReportParams
) => {
  return useQuery({
    queryKey: [
      "mediaMissingProductsReport",
      params?.withoutContentImage,
      params?.withoutBanner,
      params?.withoutVideo,
      params?.categoryKeyword,
      params?.productNameKeyword,
      params?.page,
      params?.pageSize,
      params?.from,
    ],
    queryFn: () => fetchMediaMissingProductsReport(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

export default useMediaMissingProductsReport;
