// Base collection item interfaces
export interface BaseCollectionItem {
    id: string;
    affiliateCollectionId: string;
}

export interface ProductBasedCollectionItem extends BaseCollectionItem {
    productId: string;
    commissionRate: number;
}

export interface CategoryBasedCollectionItem extends BaseCollectionItem {
    mainCategoryId: string;
    subCategoryId: string;
    commissionRate: number;
}

export interface CollectionBasedCollectionItem extends BaseCollectionItem {
    productId: string;
}

export interface CombinationBasedCollectionItem extends BaseCollectionItem {
    productId: string;
}

// Base collection request interface
export interface BaseCollectionRequest {
    id: string;
    name: string;
    description: string;
    startDate: string;
    expirationDate: string;
    salesCountLimit: number;
    totalSalesAmountLimit: number;
    isActive: boolean;
}



// Specific collection request interfaces
export interface UpdateProductBasedCollectionRequest extends BaseCollectionRequest {
    updateCollectionItems: ProductBasedCollectionItem[];
}

export interface UpdateCollectionBasedCollectionRequest extends BaseCollectionRequest {
    collectionCommissionRate: number;
    collectionItems: CollectionBasedCollectionItem[];
}

export interface UpdateCombinationBasedCollectionRequest extends BaseCollectionRequest {
    collectionCommissionRate: number;
    collectionItems: CombinationBasedCollectionItem[];
}

export interface UpdateCategoryBasedCollectionRequest extends BaseCollectionRequest {
    collectionItems: CategoryBasedCollectionItem[];
} 