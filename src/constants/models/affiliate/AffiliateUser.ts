export interface AffiliateCommissionTransferCard {
  id: string;
  iban: string;
  applicationUserId: string;
  createdOnValue: string;
  updatedOnValue: string | null;
}

export interface AffiliateApplicationUser {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  createdOnValue: string;
  updatedOnValue: string | null;
}

export interface AffiliateUserDetail {
  id: string;
  applicationUserId: string;
  commissionTransferCardId: string;
  salesCommission: number;
  totalSales: number;
  totalEarnings: number;
  transferredEarnings: number;
  pendingEarnings: number;
  appliedAt: string;
  status: number;
  affiliateSince: string;
  createdOnValue: string;
  updatedOnValue: string | null;
  commissionTransferCard: AffiliateCommissionTransferCard;
  applicationUser: AffiliateApplicationUser;
  affiliateCollections: any[];
  affiliateCommissions: any[];
}

export interface AffiliateUserListResponse {
  items: AffiliateUserDetail[];
  totalCount: number;
}
