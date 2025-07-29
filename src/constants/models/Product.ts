import { Discount, SubCategoryDiscount } from "./Discount";
import { PaginationModel } from "./Pagination";

export interface ProductListResponse extends PaginationModel {
  $id: string;
  items: Product[];
}

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
  discountDTO: Discount;
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
  seoId: string;   // Added for SEO support
}
