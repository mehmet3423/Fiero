export interface DtoProduct {
  price: number;
  sellableQuantity: number;
  isAvailable: boolean;
  barcodeNumber: string;
  stockCode: string;
  baseImageUrl: string;
  title: string;
  description: string;
  subCategoryId: string;
  contentImageUrls: string[];
  isOutlet: boolean;
  banner?: string[];
  videoUrl?: string;
  refundable: boolean;
  createSEORequest?: {
    Slug?: string;
    Title?: string;
    Description?: string;
    MetaTitle?: string;
    MetaDescription?: string;
    Keywords?: string;
    Canonical?: string;
    RobotsMetaTag?: string;
    Author?: string;
    Publisher?: string;
    Language?: string;
    OgTitle?: string;
    OgDescription?: string;
    OgImageUrl?: string;
    StructuredDataJson?: string;
    IsIndexed?: boolean;
    IsFollowed?: boolean;
    ProductId?: string;
    MainCategoryId?: string;
    SubCategoryId?: string;
  };
  createProductOnlySpecificationRequests?: {
    name: string;
    value: string;
  }[];
  technicalDetails?: {
    name: string;
    value: string;
  }[];
}

export interface UpdateDtoProduct {
  price: number;
  sellableQuantity: number;
  barcodeNumber: string;
  stockCode: string;
  baseImageUrl: string;
  title: string;
  description: string;
  subCategoryId: string;
  contentImageUrls: string[];
  banner?: string[];
  subCategorySpecificationIds?: string[];
  subCategorySpecificationOptions?: string[];
  specificationOptionIds?: string[];
  videoUrl?: string;
  isAvailable: boolean;
  refundable: boolean;
  isOutlet: boolean;
}
