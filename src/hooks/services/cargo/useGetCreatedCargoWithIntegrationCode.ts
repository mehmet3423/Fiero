import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import { GET_CREATED_CARGO_WITH_INTEGRATION_CODE } from "@/constants/links";
import { CargoTrackingResponse } from "@/constants/models/cargo/cargo";
import useGetData from "@/hooks/useGetData";

export const useGetCreatedCargoWithIntegrationCode = (
  integrationCodes: string[],
  enabled: boolean = true
) => {
  const params = new URLSearchParams();

  integrationCodes.forEach((code) => {
    if (code && code.trim()) {
      params.append("IntegrationCodes", code.trim());
    }
  });

  const shouldFetch =
    enabled &&
    integrationCodes.length > 0 &&
    integrationCodes.some((code) => code && code.trim());

  const { data, isLoading, error, refetch } = useGetData<CargoTrackingResponse>(
    {
      url: shouldFetch
        ? `${GET_CREATED_CARGO_WITH_INTEGRATION_CODE}?${params.toString()}`
        : undefined,
      queryKey: [QueryKeys.CARGO_TRACKING, ...integrationCodes.filter(Boolean)],
      method: HttpMethod.POST,
      enabled: shouldFetch,
      onError: (error) => {
      },
    }
  );

  return {
    cargoInfo: data || [],

    firstCargo: data?.[0] || null,

    isLoading,

    error,

    refetch,

    hasData: data && data.length > 0,

    cargoCount: data?.length || 0,
  };
};
