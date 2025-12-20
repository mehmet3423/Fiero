import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import { GET_CLAIM_ISSUE_REASONS } from "@/constants/links";
import { ClaimIssueReasonResponse } from "@/constants/models/trendyol/ClaimIssueReasonResponse";
import { CommandResultWithData } from "@/constants/models/CommandResult";
import useGetData from "@/hooks/useGetData";

export const useGetClaimIssueReasons = () => {
  const { data, isLoading, error } = useGetData<CommandResultWithData<ClaimIssueReasonResponse[]>>({
    url: GET_CLAIM_ISSUE_REASONS,
    queryKey: QueryKeys.TRENDYOL_CLAIM_ISSUE_REASONS,
    method: HttpMethod.GET,
    enabled: true,
    onError(err) {
      console.error("Error fetching claim issue reasons:", err);
    },
  });

  return {
    claimIssueReasons: data?.data || [],
    isLoading,
    error,
  };
};
