import { HttpMethod } from "@/constants/enums/HttpMethods"; // HTTP metodu
import { QueryKeys } from "@/constants/enums/QueryKeys"; // Query keys
import { GET_COMMENT_LIST } from "@/constants/links"; // API endpoint
import {
  CommentListApiResponse,
  CommentListRequest,
} from "@/constants/models/Review"; // Yorum tipi
import useGetData from "@/hooks/useGetData"; // useGetData hook'u

export const useGetCommentList = (params?: CommentListRequest) => {
  const queryParams = new URLSearchParams();

  // Swagger API'ye göre parametreler
  if (params?.productId) {
    queryParams.append("ProductId", params.productId);
  }
  if (params?.customerId) {
    queryParams.append("CustomerId", params.customerId);
  }
  if (params?.CommentStatusFilter !== undefined) {
    queryParams.append(
      "CommentStatusFilter",
      params.CommentStatusFilter.toString()
    );
  }
  if (params?.TargetRatings && params.TargetRatings.length > 0) {
    params.TargetRatings.forEach((rating) => {
      queryParams.append("TargetRatings", rating.toString());
    });
  }
  if (params?.isDeleted !== undefined) {
    queryParams.append("IsDeleted", params.isDeleted.toString());
  }
  if (params?.search) {
    queryParams.append("Search", params.search);
  }
  if (params?.page !== undefined) {
    queryParams.append("Page", params.page.toString());
  }
  if (params?.pageSize !== undefined) {
    queryParams.append("PageSize", params.pageSize.toString());
  }
  if (params?.from !== undefined) {
    queryParams.append("From", params.from.toString());
  }

  const { data, isLoading, error, refetch } =
    useGetData<CommentListApiResponse>({
      url: `${GET_COMMENT_LIST}?${queryParams.toString()}`,
      queryKey: [
        QueryKeys.COMMENT_LIST,
        params?.productId,
        params?.customerId,
        params?.CommentStatusFilter?.toString(),
        params?.TargetRatings?.join(","),
        params?.isDeleted?.toString(),
        params?.search,
        params?.page?.toString(),
        params?.pageSize?.toString(),
        params?.from?.toString(),
      ],
      method: HttpMethod.GET,
      enabled: true,
    });

  return {
    data: data?.data?.items || [],
    pagination: {
      count: data?.data?.count || 0,
      from: data?.data?.from || 0,
      hasNext: data?.data?.hasNext || false,
      hasPrevious: data?.data?.hasPrevious || false,
      index: data?.data?.index || 1,
      pages: data?.pages || 0,
      size: data?.size || 20,
    },
    isLoading,
    error,
    refetch,
  };
};
