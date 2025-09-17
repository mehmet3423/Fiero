import { useEnumOptions } from "./useEnumOptions";
import { GET_MARKETPLACE_INVOICE_STATUSES } from "@/constants/links";

export const useGetMarketplaceInvoiceStatuses = (enabled: boolean = false) => {
  return useEnumOptions({
    url: GET_MARKETPLACE_INVOICE_STATUSES,
    queryKey: "marketplace-invoice-statuses",
    enabled,
  });
};