import { useQuery } from "@tanstack/react-query";
import { GET_MOST_COMMENTED_PRODUCTS_REPORT } from "@/constants/links";
import { getToken, handleLogout } from "@/helpers/tokenUtils";
import toast from "react-hot-toast";
import {
  MostCommentedProductsReportParams,
  MostCommentedProductsReportResponse,
} from "@/constants/models/reports";

const fetchMostCommentedProductsReport = async (
  params?: MostCommentedProductsReportParams
): Promise<MostCommentedProductsReportResponse> => {
  const url = new URL(GET_MOST_COMMENTED_PRODUCTS_REPORT);

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

  // Token expiration kontrolü
  if (token) {
    const tokenParts = token.split(".");
    if (tokenParts.length === 3) {
      const payload = JSON.parse(atob(tokenParts[1]));
      const exp = payload.exp * 1000;

      if (Date.now() >= exp) {
        handleLogout();
        toast.error("Oturum süreniz doldu. Lütfen tekrar giriş yapın.");
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
      toast.error("Oturum süreniz doldu. Lütfen tekrar giriş yapın.");
      handleLogout();
    }
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

export const useMostCommentedProductsReport = (
  params?: MostCommentedProductsReportParams
) => {
  return useQuery({
    queryKey: [
      "mostCommentedProductsReport",
      params?.ascending,
      params?.categoryKeyword,
      params?.productNameKeyword,
      params?.page,
      params?.pageSize,
      params?.from,
    ],
    queryFn: () => fetchMostCommentedProductsReport(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

export default useMostCommentedProductsReport;
