import { useEnumOptions } from "./useEnumOptions";
import { GET_USER_CANCEL_REASON_TYPES } from "@/constants/links";

export const useGetUserCancelReasonTypes = (enabled: boolean = false) => {
  return useEnumOptions({
    url: GET_USER_CANCEL_REASON_TYPES,
    queryKey: "user-cancel-reason-types",
    enabled,
  });
};