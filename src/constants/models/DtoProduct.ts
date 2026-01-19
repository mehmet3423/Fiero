export interface DtoProduct {
  price: number;
  sellableQuantity: number;
  isAvailable: boolean;
  barcodeNumber: string;
  stockCode: string;
  baseImageUrl: string;
  baseImageUrlEn?: string | null;
  title: string;
  titleEn?: string | null;
  description: string;
  descriptionEn?: string | null;
  subCategoryId: string;
  contentImageUrls: string[];
  contentImageUrlsEn?: string[] | null;
  isOutlet: boolean;
  banner?: string[];
  bannerEn?: string[] | null;
  videoUrl?: string;
  videoUrlEn?: string | null;
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
  productInfos?: {
    title: string;
    titleEn?: string | null;
    description: string;
    descriptionEn?: string | null;
    icon?: string;
  }[];
}

export interface UpdateDtoProduct {
  price: number;
  sellableQuantity: number;
  barcodeNumber: string;
  stockCode: string;
  baseImageUrl: string;
  baseImageUrlEn?: string | null;
  title: string;
  titleEn?: string | null;
  description: string;
  descriptionEn?: string | null;
  subCategoryId: string;
  contentImageUrls: string[];
  contentImageUrlsEn?: string[] | null;
  banner?: string[];
  bannerEn?: string[] | null;
  subCategorySpecificationIds?: string[];
  subCategorySpecificationOptions?: string[];
  specificationOptionIds?: string[];
  videoUrl?: string;
  videoUrlEn?: string | null;
  isAvailable: boolean;
  refundable: boolean;
  isOutlet: boolean;
  currencyType?: number;
  likeCount?: number;
  saleCount?: number;
  taxRate?: number;
  productInfos?: {
    title: string;
    titleEn?: string | null;
    description: string;
    descriptionEn?: string | null;
    icon?: string;
  }[];
  updateProductInfos?: {
    id: string;
    title: string;
    titleEn?: string | null;
    description: string;
    descriptionEn?: string | null;
    icon: string;
  }[];
  createProductInfos?: {
    title: string;
    titleEn?: string | null;
    description: string;
    descriptionEn?: string | null;
    icon: string;
  }[];
}
