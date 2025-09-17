import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import { GET_TRENDYOL_CARGO_PROVIDERS } from "@/constants/links";
import { CargoProvidersResponse } from "@/constants/models/trendyol/CargoProvidersResponse";
import useGetData from "@/hooks/useGetData";

export const useGetTrendyolCargoProviders = () => {
  const { data, isLoading, error } = useGetData<CargoProvidersResponse>({
    url: GET_TRENDYOL_CARGO_PROVIDERS,
    queryKey: QueryKeys.TRENDYOL_CARGO_PROVIDERS,
    method: HttpMethod.GET,
    enabled: true,
    onError(err) {
    },
  });

  return {
    cargoProviders: data || [],
    isLoading,
    error,
  };
};