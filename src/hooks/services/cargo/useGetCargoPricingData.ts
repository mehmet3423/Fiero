import { HttpMethod } from "@/constants/enums/HttpMethods";
import { GET_CARGO_PRICING_DATA } from "@/constants/links";
import {
  GetCargoPricingDataRequest,
  GetCargoPricingDataResponse,
} from "@/constants/models/cargo/CargoPricing";
import useMyMutation from "@/hooks/useMyMutation";

/**
 * GetCargoPricingData API endpoint'i için hook
 * Kargo fiyat bilgilerini almak için kullanılır
 */
export const useGetCargoPricingData = () => {
  const mutation = useMyMutation<GetCargoPricingDataResponse>();

  const getCargoPricingData = async (
    pricingRequest: GetCargoPricingDataRequest
  ) => {
    return mutation.mutateAsync({
      url: GET_CARGO_PRICING_DATA,
      method: HttpMethod.POST,
      data: pricingRequest,
    });
  };

  return {
    getCargoPricingData,
    isPending: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
    data: mutation.data,
    reset: mutation.reset,
  };
};

/**
 * GetCargoPricingData hook'u için tip güvenli wrapper
 * Daha kolay kullanım için
 */
export const useGetCargoPricing = () => {
  const { getCargoPricingData, isPending, error, isSuccess, data, reset } =
    useGetCargoPricingData();

  const fetchCargoPricing = (pricingRequest: GetCargoPricingDataRequest) => {
    return getCargoPricingData(pricingRequest);
  };

  return {
    fetchCargoPricing,
    isLoading: isPending,
    error,
    isSuccess,
    pricingData: data,
    reset,
  };
};
