import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import { GET_CLAIM_AUDITS } from "@/constants/links";
import { ClaimAuditResponse } from "@/constants/models/trendyol/ClaimAuditResponse";
import { CommandResultWithData } from "@/constants/models/CommandResult";
import useGetData from "@/hooks/useGetData";

export const useGetClaimAudits = (claimItemId: string) => {
  const { data, isLoading, error } = useGetData<CommandResultWithData<ClaimAuditResponse[]>>({
    url: GET_CLAIM_AUDITS(claimItemId),
    queryKey: [QueryKeys.TRENDYOL_CLAIM_AUDITS, claimItemId],
    method: HttpMethod.GET,
    enabled: !!claimItemId,
    onError(err) {
      console.error("Error fetching claim audits:", err);
    },
  });

  return {
    claimAudits: data?.data || [],
    isLoading,
    error,
  };
};
