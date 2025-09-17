import { useEnumOptions } from "./useEnumOptions";
import { GET_CARGO_STATUSES } from "@/constants/links";

export const useGetCargoStatuses = (enabled: boolean = false) => {
  return useEnumOptions({
    url: GET_CARGO_STATUSES,
    queryKey: "cargo-statuses",
    enabled,
  });
};