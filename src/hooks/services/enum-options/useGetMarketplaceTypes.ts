import { useEnumOptions } from "./useEnumOptions";
import { GET_MARKETPLACE_TYPES } from "@/constants/links";

export const useGetMarketplaceTypes = (enabled: boolean = false) => {
  return useEnumOptions({
    url: GET_MARKETPLACE_TYPES,
    queryKey: "marketplace-types",
    enabled,
  });
};