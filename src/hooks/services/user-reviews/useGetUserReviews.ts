import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import { GET_USER_REVIEWS } from "@/constants/links";
import { UserReviewsResponse } from "@/constants/models/Review";
import useGetData from "@/hooks/useGetData";

export const useGetUserReviews = (customerId: string) => {
  const { data, isLoading, error, refetch } = useGetData<UserReviewsResponse>({
    url: `${GET_USER_REVIEWS}?CustomerId=${customerId}`,
    queryKey: [QueryKeys.USER_REVIEWS],
    method: HttpMethod.GET,
    onError: () => {
      return {
        $id: "0",
        items: {
          $id: "1",
          $values: [],
        },
      };
    },
  });

  return {
    reviews: data?.data?.items,
    isLoading,
    error,
    refetchReviews: refetch,
  };
};
