import { useEnumOptions } from "./useEnumOptions";
import { GET_ADMIN_CANCEL_REASON_TYPES } from "@/constants/links";

export const useGetAdminCancelReasonTypes = (enabled: boolean = false) => {
  return useEnumOptions({
    url: GET_ADMIN_CANCEL_REASON_TYPES,
    queryKey: "admin-cancel-reason-types",
    enabled,
  });
};