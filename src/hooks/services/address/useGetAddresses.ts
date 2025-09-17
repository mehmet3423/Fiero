import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import { GET_USER_ADDRESS_LIST } from "@/constants/links";
import { AddressListResponse } from "@/constants/models/Address";
import useGetData from "@/hooks/useGetData";

export const useGetAddresses = () => {
  const { data, isLoading, error, refetch } = useGetData<{ data: AddressListResponse }>({
    url: GET_USER_ADDRESS_LIST,
    queryKey: [QueryKeys.USER_ADDRESS_LIST],
    method: HttpMethod.GET,
    onError: (error) => {
    },
  });

  // Veri yoksa veya hata varsa boş dizi döndür
  const addresses = error ? [] : data?.data?.items || [];

  return {
    addresses,
    isLoading,
    error,
    refetchAddresses: refetch,
  };
};
