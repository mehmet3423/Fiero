import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import { GET_TRENDYOL_SUPPLIER_ADDRESSES } from "@/constants/links";
import { CommandResultWithData } from "@/constants/models/CommandResult";
import { SupplierAddressesResponse } from "@/constants/models/trendyol/SupplierAddressesResponse";
import useGetData from "@/hooks/useGetData";

export const useGetTrendyolSupplierAddresses = () => {
  const { data, isLoading, error } = useGetData<CommandResultWithData<SupplierAddressesResponse>>({
    url: GET_TRENDYOL_SUPPLIER_ADDRESSES,
    queryKey: QueryKeys.TRENDYOL_SUPPLIER_ADDRESSES,
    method: HttpMethod.GET,
    enabled: true, // Bu her zaman çalışabilir
    onError(err) {
    },
  });

  return {
    supplierAddresses: data || [],
    isLoading,
    error,
  };
};