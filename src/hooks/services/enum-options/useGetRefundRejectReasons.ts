import { useEnumOptions } from "./useEnumOptions";
import { GET_REFUND_REJECT_REASONS } from "@/constants/links";

export const useGetRefundRejectReasons = (enabled: boolean = false) => {
  return useEnumOptions({
    url: GET_REFUND_REJECT_REASONS,
    queryKey: "refund-reject-reasons",
    enabled,
  });
};