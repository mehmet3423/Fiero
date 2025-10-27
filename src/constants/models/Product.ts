import { Discount, SubCategoryDiscount } from "./Discount";
import { PaginationModel } from "./Pagination";
import { CommandResultWithData } from "./CommandResult";

// Yeni API response wrapper
export interface ApiResponse<T> {
  data: T;
  isSucceed: boolean;
  message: string;
}

export interface ProductListResponse extends PaginationModel {
  $id?: string;
  items: Product[];
}
// Base entity interface
export interface BaseEntity {
  id: string;
  createdOnValue?: string;
  modifiedOnValue?: string;
  isDeleted: boolean;
}

// SEO response interface
export interface SEOResponse extends BaseEntity {
  slug?: string;
  title: string;
  description: string;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string;
  canonical?: string;
  robotsMetaTag?: string;
  author?: string;
  publisher?: string;
  language: string;
  htmlContent?: string;
  h1Count: number;
  h2Count: number;
  h3Count: number;
  h4Count: number;
  h5Count: number;
  h6Count: number;
  imageCount: number;
  linkCount: number;
  ogTitle?: string;
  ogDescription?: string;
  ogImageUrl?: string;
  structuredDataJson?: string;
  isIndexed: boolean;
  isFollowed: boolean;
  productId?: string;
  mainCategoryId?: string;
  subCategoryId?: string;
  qualityScore: number;
}

// Base product response interface
export interface BaseProductResponse extends BaseEntity {
  name: string;
}

// Address interface
export interface AddressDTO extends BaseEntity {
  firstName: string;
  lastName: string;
  title: string;
  country: string;
  city: string;
  district: string;
  neighbourhood: string;
  street: string;
  postalCode?: string;
  fullAddress: string;
  applicationUserId: string;
}

// Application user interface
export interface ApplicationUserDTO {
  id: string;
  username: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  email: string;
  phoneNumber: string;
  birthDate?: string;
  gender: string;
  emailConfirmed: boolean;
  userGroupIds: string[];
  roleIds: string[];
  roles: string[];
  addresses?: AddressDTO[];
  userPaymentCard?: any[];
}

// Seller interface
export interface SellerDTO extends BaseEntity {
  companyName: string;
  companyAddress?: AddressDTO;
  applicationUser: ApplicationUserDTO;
  products: any[];
}

// SubCategory specification interfaces
export interface SubCategorySpecificationDTO extends BaseEntity {
  name: string;
  specificationOptions: SpecificationOptionDTO[];
}

export interface SpecificationOptionDTO extends BaseEntity {
  value: string;
}

// Product only specification interface
export interface ProductOnlySpecificationDTO extends BaseEntity {
  name: string;
  value: string;
}

// Comment interface
export interface CommentDTO extends BaseEntity {
  title: string;
  content: string;
  rating: number;
  imageUrl?: string;
  customerId: string;
  customerName: string;
  productId: string;
}

// Technical detail interface
export interface TechnicalDetailDTO extends BaseEntity {
  title: string;
  description: string;
}

// BuyXPayY discount interface
export interface BuyXPayYDiscountBasicResponse extends BaseEntity {
  buyXCount: number;
  payYCount: number;
}

// Free product discount interface
export interface FreeProductDiscountBasicResponse extends BaseEntity {
  minimumQuantity: number;
}

// New ProductWithDiscountDTO interface matching backend
export interface ProductWithDiscountDTO extends BaseEntity {
  baseProductId?: string;
  baseProduct?: BaseProductResponse;
  externalId: number;
  title: string;
  description: string;
  sellableQuantity: number;
  barcodeNumber: string;
  price: number;
  discountedPrice: number;
  ratingCount: number;
  averageRating: number;
  isAvailable: boolean;
  isOutlet: boolean;
  refundable: boolean;
  baseImageUrl: string;
  contentImageUrls: string[];
  banner: string[];
  videoUrl?: string;
  currencyType: string;
  seoId: string;
  seo: SEOResponse;
  subCategoryId: string;
  sellerId?: string;
  seller?: SellerDTO;
  subCategorySpecifications?: SubCategorySpecificationDTO[];
  productOnlySpecifications: ProductOnlySpecificationDTO[];
  comments: CommentDTO[];
  technicalDetails: TechnicalDetailDTO[];
  discountResponse?: Discount;
  buyXPayYDiscountResponse?: BuyXPayYDiscountBasicResponse;
  freeProductDiscountResponse?: FreeProductDiscountBasicResponse;
}

// API response type for GetProductById
export interface GetProductByIdResponse
  extends CommandResultWithData<ProductWithDiscountDTO> {}

export interface ProductListResponse
  extends CommandResultWithData<PaginationListResponse<Product>> {
  $id?: string;
}

// useGetData'da kullanılacak wrapped response tipi
export type WrappedProductListResponse = ApiResponse<ProductListResponse>;

export interface Product {
  $id: string;
  id: string;
  title: string;
  baseProductId: string;
  baseProduct: any | null;
  sellableQuantity: number;
  averageRating: number;
  ratingCount: number;
  isOutlet: boolean;
  refundable: boolean;
  imageUrl: string;
  banner: string[];
  videoUrl: string;
  effectedDiscountId: string;
  subCategoryId: string;
  subCategory: any | null;
  subcategorySpecifications: any | null;
  subCategorySpecificationIds: string[];
  subCategorySpecificationOptions: string[];
  comments: Comment[];
  description: string;
  stockCode: string;
  price: number;
  discountedPrice: number;
  baseImageUrl: string;
  contentImageUrls: string[];
  isAvailable: boolean;
  barcodeNumber: string;
  seo: any | null;
  seoId: string;
  sellerId: string;
  seller: any | null;
  orderItems: OrderItem[];
  technicalDetails: TechnicalDetail[];
  productDiscounts: Discount[];
  subCategoryDiscounts: SubCategoryDiscount[];
  discountResponse?: Discount;
  buyXPayYDiscountResponse?: BuyXPayYDiscountBasicResponse;
  freeProductDiscountResponse?: FreeProductDiscountBasicResponse;
  productInfos?: {
    id?: string;
    title: string;
    description: string;
    icon: string;
  }[];
}

// public required int ExternalId { get; set; } // This will be provided from the external API
//         public required string Title { get; set; }
//         public required string Description { get; set; }
//         public decimal sellableQuantity { get; set; } // Min should be more than Stock quantity
//         public required string BarcodeNumber { get; set; }
//         public decimal Price { get; set; } // Can this be lower than stock price?
//         public bool IsAvailable { get; set; }
//         public required string BaseImageUrl { get; set; }
//         public List<string> ContentImageUrls { get; set; } = [];
//         public List<string> Banner { get; set; } = [];
//         public string? VideoUrl { get; set; }

//         public Guid SEOId { get; set; }
//         public virtual SEO SEO { get; set; }

//         public Guid SubCategoryId { get; set; }
//         public SubCategory SubCategory { get; set; }

//         public required Guid SellerId { get; set; }
//         public Seller? Seller { get; set; }

//         public ICollection<Guid> SubCategorySpecificationIds { get; set; } = [];
//         public ICollection<string> SubCategorySpecificationOptions { get; set; } = [];
//         public ICollection<ProductOnlySpecification> ProductOnlySpecifications { get; set; } = [];
//         public ICollection<Comment> Comments { get; set; } = [];
//         public ICollection<TechnicalDetail> TechnicalDetails { get; set; } = [];
//         public ICollection<OrderItem> OrderItems { get; set; } = [];
//         public ICollection<CartProduct> CartProducts { get; set; } = [];
//         public ICollection<ProductDiscount> ProductDiscounts { get; set; } = [];

export interface OrderItem {
  // Örneğin: productId: string; quantity: number; ...
}

export interface TechnicalDetail {
  $id: string;
  key: string;
  value: string;
}

export interface ProductOnlySpecification {
  $id: string;
  name: string;
  value: string;
  productId: string;
  id: string;
  createdOn: number;
  createdOnValue: string;
  modifiedOn: number | null;
  modifiedOnValue: string | null;
  createdBy: string;
  modifiedBy: string | null;
  isDeleted: boolean;
}

export interface ProductDetailResponse {
  reviews: any;
  id: string;
  title: string;
  description: string;
  effectedDiscountId: string;
  price: number;
  discountedPrice: number;
  baseImageUrl: string;
  category: string;
  barcodeNumber: string;
  sellableQuantity: number;
  isAvailable: boolean;
  productOnlySpecifications: ProductOnlySpecification[];
  banner: string[];
  contentImageUrls: string[];
  productDiscounts: Discount[];
  subCategoryDiscounts: SubCategoryDiscount[];
  videoUrl: string;
  seo: any | null; // Added for SEO support
  seoId: string; // Added for SEO support

  productInfos?: {
    id?: string;
    title: string;
    description: string;
    icon: string;
  }[];
}

// ProductInfo interface for ProductBasicDTO
export interface ProductInfoDTO {
  title: string;
  description: string;
  icon?: string;
}

// ProductBasicDTO interface for outlet products
export interface ProductBasicDTO extends BaseEntity {
  baseProductId?: string;
  baseProduct?: BaseProductResponse;
  title: string;
  barcodeNumber: string;
  sellableQuantity: number;
  price: number;
  discountedPrice: number;
  isAvailable: boolean;
  isOutlet: boolean;
  refundable: boolean;
  averageRating: number;
  ratingCount: number;
  baseImageUrl: string;
  productInfos: ProductInfoDTO[];
  contentImageUrls: string[];
  currencyType: string;
  discountResponse?: Discount;
  buyXPayYDiscountResponse?: BuyXPayYDiscountBasicResponse;
  freeProductDiscountResponse?: FreeProductDiscountBasicResponse;
}

// PaginationListResponseBase interface
export interface PaginationListResponseBase {
  from: number;
  index: number;
  size: number;
  count: number;
  pages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

// PaginationListResponse interface
export interface PaginationListResponse<T> extends PaginationListResponseBase {
  items: T[];
}

// API response type for GetAllOutletProducts
export interface GetAllOutletProductsResponse
  extends CommandResultWithData<PaginationListResponse<ProductBasicDTO>> {}
