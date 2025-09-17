import { useEnumOptions } from "./useEnumOptions";
import { GET_PAYMENT_GROUP_TYPES } from "@/constants/links";

export const useGetPaymentGroupTypes = (enabled: boolean = false) => {
  return useEnumOptions({
    url: GET_PAYMENT_GROUP_TYPES,
    queryKey: "payment-group-types",
    enabled,
  });
};