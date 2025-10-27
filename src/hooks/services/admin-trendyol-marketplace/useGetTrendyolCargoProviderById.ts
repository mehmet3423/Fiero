import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import { GET_TRENDYOL_CARGO_PROVIDER_BY_ID } from "@/constants/links";
import { CommandResultWithData } from "@/constants/models/CommandResult";
import { CargoProviderItem } from "@/constants/models/trendyol/CargoProvidersResponse";
import useGetData from "@/hooks/useGetData";

export const useGetTrendyolCargoProviderById = (id: number) => {
  const { data, isLoading, error } = useGetData<CommandResultWithData<CargoProviderItem>>({
    url: GET_TRENDYOL_CARGO_PROVIDER_BY_ID(id),
    queryKey: QueryKeys.TRENDYOL_CARGO_PROVIDER_BY_ID,
    method: HttpMethod.GET,
    onError(err) {
    },
  });

  return {
    cargoProvider: data,
    isLoading,
    error,
  };
};