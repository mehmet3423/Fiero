import { useEnumOptions } from "./useEnumOptions";
import { GET_ALL_CANCEL_REASON_TYPES } from "@/constants/links";

export const useGetAllCancelReasonTypes = (enabled: boolean = false) => {
  return useEnumOptions({
    url: GET_ALL_CANCEL_REASON_TYPES,
    queryKey: "all-cancel-reason-types",
    enabled,
  });
};