import { useEnumOptions } from "./useEnumOptions";
import { GET_PAYMENT_SOURCE_TYPES } from "@/constants/links";

export const useGetPaymentSourceTypes = (enabled: boolean = false) => {
  return useEnumOptions({
    url: GET_PAYMENT_SOURCE_TYPES,
    queryKey: "payment-source-types",
    enabled,
  });
};