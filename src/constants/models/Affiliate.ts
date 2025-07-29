import { AffiliateStatus } from "../enums/AffiliateStatus";

export { AffiliateStatus };

// User & Application Models
export interface AffiliateUser {
  $id?: string;
  id?: string;
  status: AffiliateStatus;
  totalEarnings?: number;
  salesCommission?: number;
  pendingEarnings?: number;
  transferableEarnings?: number;
  pendingApprovalEarnings?: number;
  transferredEarnings?: number;
  totalSales?: number;
  appliedAt?: string;
  affiliateSince?: string;
  createdOnValue?: string;
  iban?: string;
}

export interface AffiliateApplicationRequest {
  iban: string;
}

export interface AffiliateStatusResponse {
  status: AffiliateStatus;
  message?: string;
}

// Collection Models
export interface AffiliateCollection {
  id: string;
  affiliateUserId: string;
  name: string;
  url: string;
  description: string;
  earningType: number;
  isActive: boolean;
  salesCount: number;
  totalEarnedCommission: number;
  startDate: string;
  expirationDate: string;
  salesCountLimit: number | null;
  totalSalesAmountLimit: number | null;
  collectionCommissionRate: number | null;
  createdOnValue: string;
  updatedOnValue: string;
  affiliateUserApplicationUserId: string;
  affiliateUserIban: string | null;
  affiliateUserTotalSales: number;
  affiliateUserTransferredEarnings: number;
  affiliateUserTransferableEarnings: number;
  affiliateUserPendingApprovalEarnings: number;
  affiliateUserPendingEarnings: number;
  affiliateUserAppliedAt: string;
  affiliateUserStatus: number;
  affiliateUserAffiliateSince: string;
  affiliateUserCreatedOnValue: string;
  affiliateUserUpdatedOnValue: string;
  affiliateCommissions: any[];
  productBasedAffiliateItems: ProductBasedAffiliateItem[];
  categoryBasedAffiliateItems: CategoryBasedAffiliateItem[];
  combinationBasedAffiliateItems: CombinationBasedAffiliateItem[];
  collectionBasedAffiliateItems: CollectionBasedAffiliateItem[];
}

// Collection Item Types
export interface ProductBasedAffiliateItem {
  id: string;
  affiliateCollectionId: string;
  productId: string;
  commissionRate: number;
  createdOnValue: string;
  updatedOnValue: string | null;
  product: ProductDetails;
}

export interface CategoryBasedAffiliateItem {
  id: string;
  affiliateCollectionId: string;
  mainCategoryId: string | null;
  subCategoryId: string | null;
  commissionRate: number;
  createdOnValue: string;
  updatedOnValue: string | null;
  mainCategory: CategoryDetails | null;
  subCategory: CategoryDetails | null;
}

export interface CombinationBasedAffiliateItem {
  id: string;
  affiliateCollectionId: string;
  productId: string;
  createdOnValue: string;
  updatedOnValue: string | null;
  product: ProductDetails;
}

export interface CollectionBasedAffiliateItem {
  id: string;
  affiliateCollectionId: string;
  productId: string;
  createdOnValue: string;
  updatedOnValue: string | null;
  product: ProductDetails;
}

// Shared Detail Types
export interface ProductDetails {
  id: string;
  externalId: number;
  title: string;
  description: string;
  price: number;
  currencyType: number;
  isAvailable: boolean;
  barcodeNumber: string;
  sellableQuantity: number;
  baseImageUrl: string;
  contentImageUrls: string[];
  banner: string[];
  videoUrl: string | null;
  subCategoryId: string;
  subCategoryName: string | null;
  sellerId: string | null;
  sellerName: string | null;
  createdOnValue: string;
  updatedOnValue: string | null;
}

export interface CategoryDetails {
  id: string;
  name: string;
  createdOnValue: string;
  updatedOnValue: string | null;
}

// Collection Creation & Update
export interface CreateCollectionRequest {
  name: string;
  description: string;
  affiliateUserId: string;
  url: string;
  startDate: string;
  expirationDate: string;
  collectionItems: CollectionItem[];
}

export interface CollectionItem {
  productId?: string;
  mainCategoryId?: string;
  subCategoryId?: string;
}

export interface UpdateAffiliateCollectionRequest {
  id: string;
  name: string;
  description: string;
}

export interface UpdateAffiliateStatusByUserRequest {
  id: string;
  status?: AffiliateStatus;
  iban: string;
}

// Legacy Models (kept for backward compatibility)
export interface CreateAffiliateCollectionRequest {
  name: string;
  description: string;
  affiliateUserId: string;
  createCollectionProducts: {
    productId: string;
  }[];
  url: string;
}

export interface AffiliateCollectionProduct {
  id?: string;
  productId: string;
  product: {
    id: string;
    name: string;
    price: number;
    imageUrl?: string;
  };
}

export interface AffiliateCollectionListResponse {
  items: AffiliateCollection[];
  page: number;
  size: number;
  count: number;
  pages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}
