export interface ClaimAuditResponse {
  claimId: string;
  claimItemId: string;
  previousStatus: string;
  newStatus: string;
  userInfoDocument: AuditUserInfo;
  date: number;
}

export interface AuditUserInfo {
  executorId: string;
  executorApp: string;
  executorUser: string;
}
