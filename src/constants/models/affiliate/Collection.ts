export interface Product {
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

export interface ProductBasedAffiliateItem {
    id: string;
    affiliateCollectionId: string;
    productId: string;
    commissionRate: number;
    createdOnValue: string;
    updatedOnValue: string | null;
    product: Product;
}

export interface CombinationBasedAffiliateItem {
    id: string;
    affiliateCollectionId: string;
    productId: string;
    createdOnValue: string;
    updatedOnValue: string | null;
    product: Product;
}

export interface Category {
    id: string;
    name: string;
    createdOnValue: string;
    updatedOnValue: string | null;
}

export interface CategoryBasedAffiliateItem {
    id: string;
    affiliateCollectionId: string;
    mainCategoryId: string | null;
    subCategoryId: string | null;
    commissionRate: number;
    createdOnValue: string;
    updatedOnValue: string | null;
    mainCategory: Category | null;
    subCategory: Category | null;
}

export interface CollectionBasedAffiliateItem {
    id: string;
    affiliateCollectionId: string;
    productId: string;
    createdOnValue: string;
    updatedOnValue: string | null;
    product: Product;
}

export interface AffiliateUser {
    applicationUserId: string;
    iban: string;
    totalSales: number;
    transferredEarnings: number;
    pendingEarnings: number;
    appliedAt: string;
    status: number;
    affiliateSince: string;
    createdOnValue: string;
    updatedOnValue: string;
}

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
    salesCountLimit: number;
    totalSalesAmountLimit: number;
    collectionCommissionRate: number | null;
    createdOnValue: string;
    updatedOnValue: string;
    affiliateUserApplicationUserId: string;
    affiliateUserIban: string;
    affiliateUserTotalSales: number;
    affiliateUserTransferredEarnings: number;
    affiliateUserTransferableEarnings: number;
    affiliateUserPendingApprovalEarnings: number;
    affiliateUserAppliedAt: string;
    affiliateUserStatus: number;
    affiliateUserAffiliateSince: string;
    affiliateUserCreatedOnValue: string;
    affiliateUserUpdatedOnValue: string;
    affiliateCommissions: any[];
    productBasedAffiliateItems: ProductBasedAffiliateItem[];
    collectionBasedAffiliateItems: CollectionBasedAffiliateItem[];
    combinationBasedAffiliateItems: CombinationBasedAffiliateItem[];
    categoryBasedAffiliateItems: CategoryBasedAffiliateItem[];
}
