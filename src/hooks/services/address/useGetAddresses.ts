import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import { GET_USER_ADDRESS_LIST } from "@/constants/links";
import { AddressListResponse } from "@/constants/models/Address";
import { getToken } from "@/helpers/tokenUtils";
import useGetData from "@/hooks/useGetData";

export const useGetAddresses = () => {
  const token = getToken();

  const { data, isLoading, error, refetch } = useGetData<{ data: AddressListResponse }>({
    url: token ? GET_USER_ADDRESS_LIST : undefined,
    queryKey: [QueryKeys.USER_ADDRESS_LIST],
    method: HttpMethod.GET,
    onError: (error) => {
    },
  });

  // Veri yoksa veya hata varsa boş dizi döndür
  const addresses =
    !token || error ? [] : data?.data?.items || [];

  return {
    addresses,
    isLoading: token ? isLoading : false,
    error,
    refetchAddresses: refetch,
  };
};
