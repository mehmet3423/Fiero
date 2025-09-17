import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import { GET_COUNTRIES } from "@/constants/links";
import { Country } from "@/constants/models/Address";
import useGetData from "@/hooks/useGetData";

export interface CountryResponse {
  $id: string;
  $values: Country[];
}

export const useGetCountries = () => {
  const { data, isLoading, error, refetch } = useGetData<CountryResponse>({
    url: GET_COUNTRIES,
    queryKey: [QueryKeys.COUNTRIES],
    method: HttpMethod.GET,
    onError: (error) => {
      return {
        $id: "0",
        $values: [],
      };
    },
  });

  const countries = error ? [] : data?.$values || [];

  return {
    countries,
    isLoading,
    error,
    refetchAddresses: refetch,
  };
};
