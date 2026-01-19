import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import { GET_PRODUCT_RATINGS } from "@/constants/links";
import useGetData from "@/hooks/useGetData";

export interface ProductRatingsResponse {
  data: {
    id: string;
    key: number;
    value: string;
    description: string | null;
    createdOnValue: string;
    modifiedOnValue: string | null;
  };
  isSucceed: boolean;
  message: string;
}

export const useGetProductRatings = () => {
  const { data, isLoading, error, refetch } = useGetData<ProductRatingsResponse>({
    queryKey: QueryKeys.PRODUCT_RATINGS,
    url: GET_PRODUCT_RATINGS,
    method: HttpMethod.GET,
    enabled: true,
  });

  // value === "0" ise rating gösterimi kapalı
  const isRatingEnabled = data?.data?.value !== "0";

  return {
    isRatingEnabled,
    value: data?.data?.value || null,
    isLoading,
    error,
    refetch,
  };
};
