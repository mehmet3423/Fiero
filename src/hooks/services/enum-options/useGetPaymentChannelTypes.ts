import { useEnumOptions } from "./useEnumOptions";
import { GET_PAYMENT_CHANNEL_TYPES } from "@/constants/links";

export const useGetPaymentChannelTypes = (enabled: boolean = false) => {
  return useEnumOptions({
    url: GET_PAYMENT_CHANNEL_TYPES,
    queryKey: "payment-channel-types",
    enabled,
  });
};