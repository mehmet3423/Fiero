import { DiscountType } from "../enums/DiscountType";
import { DiscountValueType } from "../enums/DiscountValueType";
import { SubCategory } from "./Category";
import { NotificationSettings } from "./Notification";
import { BaseEntity } from "./Product";

// Temel indirim modeli
export interface Discount {
  id: string;
  name: string;
  description?: string;
  discountValue: number;
  discountValueType: DiscountValueType;
  startDate: string;
  endDate: string;
  isActive: boolean;
  isWithinActiveDateRange?: boolean;
  maxDiscountValue?: number;
  createdOn: number;
  createdOnValue: string;
  type: DiscountType;
  notificationSettings?: NotificationSettings;
  bundleDiscount?: BundleDiscount;
  cartDiscount?: CartDiscount;
  productDiscount?: ProductDiscount;
  subCategoryDiscount?: SubCategoryDiscount;
  birthdayDiscount?: BirthdayDiscount;
  specialDayDiscount?: SpecialDayDiscount;
  weekdayDiscount?: WeekdayDiscount;
  timeOfDayDiscount?: TimeOfDayDiscount;
  shippingDiscount?: ShippingDiscount;
  couponDiscount?: CouponDiscount;
  buyYPayXDiscount?: BuyYPayXDiscount;
  freeProductDiscount?: FreeProductDiscount;
}

// Alt kategori indirimi
export interface SubCategoryDiscount extends Discount {
  subCategoryId: string;
  subCategory: SubCategory;
}

// Bundle indirimi
export interface BundleDiscount extends Discount {
  bundleDiscountId?: string;
  productIds?: string[];
  bundlePrice?: number;
}

// Sepet indirimi
export interface CartDiscount extends Discount {
  minimumCartAmount: number;
  maximumCartAmount: number;
  minimumCartProductCount: number;
  maximumCartProductCount: number;
}

export interface ProductDiscount extends Discount {
  productId: string;
  productName: string;
}

export interface FreeProductDiscount extends Discount {
  minimumQuantity: number;
  freeProductIds: string[];
  freeProductDiscountProducts: FreeProductDiscountProduct[];
  maxFreeProductPrice?: number;
  isRepeatable: boolean;

  buyXPayYProducts: string[];
  productIds: string[];

  maxFreeProductsPerOrder?: number;
}

export interface FreeProductDiscountProduct extends BaseEntity {
  productId: string;
  product: ProductResponse;
  freeProductDiscountId: string;
}

export interface ProductResponse {
  id: string;
  externalId: number;
  title: string;
  description: string;
  price: number;
  currencyType: string;
  isAvailable: boolean;
  isOutlet: boolean;
  barcodeNumber: string;
  sellableQuantity: number;
  baseImageUrl: string;
  contentImageUrls: string[];
  banner: string[];
  videoUrl?: string;
  refundable: boolean;
  subCategoryId: string;
  subCategoryName?: string;
  sellerId?: string;
  sellerName?: string;
  createdOnValue: string;
  updatedOnValue?: string;

}

export interface DiscountListParams {
  discountType: DiscountType;
  page?: number;
  pageSize?: number;
  name?: string;
  isActive?: boolean;
  productId?: string;
  subCategoryId?: string;
}

// API'den gelen liste yanıtı
export interface DiscountListResponse {
  data: {
    items: Discount[];
    count: number;
    pages: number;
    size: number;
  }
}

export interface CartDiscountListResponse {
  items: CartDiscount[];
}

// Doğum günü indirimi
export interface BirthdayDiscount extends Discount {
  validDaysBefore: number;
  validDaysAfter: number;
}

export interface CouponDiscount extends Discount {
  couponCode: string;
  maxUsageCount: number;
}

// Özel gün indirimi
export interface SpecialDayDiscount extends Discount {
  day: number;
  month: number;
}

// Haftanın belirli günleri indirimi
export interface WeekdayDiscount extends Discount {
  dayOfWeek: number;
}

// Belirli saat aralığındaki indirimler
export interface TimeOfDayDiscount extends Discount {
  startTime: string;
  endTime: string;
}

export interface BirthdayDiscountListResponse {
  items: BirthdayDiscount[];
}

export interface SpecialDayDiscountListResponse {
  items: SpecialDayDiscount[];
}

export interface WeekdayDiscountListResponse {
  items: WeekdayDiscount[];
}

export interface TimeOfDayDiscountListResponse {
  items: TimeOfDayDiscount[];
}

export interface ShippingDiscount extends Discount {
  minimumCargoAmount: number;
}

export interface BuyYPayXDiscount extends Discount {
  buyXCount: number;
  payYCount: number;
  maxDiscountValue: number;
  buyXPayYProducts?: string[];
  isRepeatable: boolean;
  maxFreeProductPerOrder: number;
}

// Kargo indirimi - API'den dönen format
export interface CargoDiscount extends Discount {
  cargoDiscount?: {
    minimumCargoAmount: number;
  };
}

export interface GiftProductDiscount extends Discount {
  minimumQuantity: number;
  productIds?: string[];
  maxFreeProductPrice?: number;
  isRepeatable?: boolean;
  maxFreeProductsPerOrder?: number;
}
