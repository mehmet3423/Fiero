import { useEnumOptions } from "./useEnumOptions";
import { GET_REGISTER_CARD_TYPES } from "@/constants/links";

export const useGetRegisterCardTypes = (enabled: boolean = false) => {
  return useEnumOptions({
    url: GET_REGISTER_CARD_TYPES,
    queryKey: "register-card-types",
    enabled,
  });
};