export interface GetClaimsRequest {
  claimIds?: string;
  claimItemStatus?: string;
  startDate?: number;
  endDate?: number;
  orderNumber?: string;
  size?: number;
  page?: number;
}
