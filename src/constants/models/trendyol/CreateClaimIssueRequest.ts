export interface CreateClaimIssueRequest {
  claimIssueReasonId: number;
  description: string;
  claimItemIdList: string;
  file?: File;
}
