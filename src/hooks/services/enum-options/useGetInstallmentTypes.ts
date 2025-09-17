import { useEnumOptions } from "./useEnumOptions";
import { GET_INSTALLMENT_TYPES } from "@/constants/links";

export const useGetInstallmentTypes = (enabled: boolean = false) => {
  return useEnumOptions({
    url: GET_INSTALLMENT_TYPES,
    queryKey: "installment-types",
    enabled,
  });
};