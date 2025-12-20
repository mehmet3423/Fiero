import { Address } from "./Address";
import { PaginationModel } from "./Pagination";

export interface CreateOrderRequest {
  email: string;
  recipientName: string;
  recipientSurname: string;
  recipientPhoneNumber: string;
  recipientIdentityNumber: string;
  shippingAddressId: string;
  billingAddressId: string;
  billingType: number;
  corporateCompanyName?: string;
  corporateTaxNumber?: string;
  corporateTaxOffice?: string;
  cargoPrice: number;
  couponCode?: string;
  paymentCardId: string;
  isGiftWrap?: boolean;
  giftWrapPrice?: number;
}

export interface OrderItem {
  id?: string;
  orderItemNumber?: string;
  quantity?: number;
  price?: number;
  orderItemPrice?: number; // API'den gelen alan
  orderItemDiscountedPrice?: number; // API'den gelen alan
  discountedPrice?: number;
  cargoStatus?: number;
  cancelReasonType?: number | null;
  isRefundApproved?: boolean;
  refundDescription?: string | null;
  productId?: string;
  productTitle?: string; // API'den gelen alan - doğrudan OrderItem içinde
  productDescription?: string; // API'den gelen alan
  baseImageUrl?: string; // API'den gelen alan - doğrudan OrderItem içinde
  product: {
    id?: string;
    title?: string;
    productTitle?: string; // API'den gelen alan
    baseImageUrl?: string;
  } | null;
  name?: string;
  itemType?: string;
  type?: string;
  category1?: string;
  category2?: string;
  unitIndex?: number;
  providerItemId?: string;
  paymentTransactionId?: string;
  title?: string;
  displayTitle?: string;
  displayDescription?: string;
  description?: string;
  displayImageUrl?: string;
  totalPrice?: number;
  totalDiscountedPrice?: number;
  discountedTotal?: number;
  freeQuantity?: number;
  giftAmount?: number;
  isFreeProduct?: boolean;
  isBundle?: boolean;
  bundleDiscount?: any;
  bundleProducts?: any[];
  isBuyXPayY?: boolean;
  buyXCount?: number;
  payYCount?: number;
  isrepeatable?: boolean;
  discountedUnitPrice?: number;
  orderItemTotalPrice?: number;
  data?: any;
  createdOnValue?: string;
  modifiedOnValue?: string | null;
  isDeleted?: boolean;
  isRefundAllowed?: boolean; // İade edilebilir mi?
}

export interface OrderBundleProduct {
  orderBundleId?: string;
  productId?: string;
  product?: {
    id?: string;
    title?: string;
    productTitle?: string;
    baseImageUrl?: string;
  } | null;
  baseImageUrl?: string | null;
  title?: string | null;
  productTitle?: string | null;
  price?: number;
}

export interface OrderFreeProductDiscountProduct {
  orderFreeProductId?: string;
  name?: string | null;
  giftAmount?: number;
  price?: number;
  productId?: string;
  productTitle?: string;
  productDescription?: string;
  baseImageUrl?: string;
}

export interface OrderFreeProduct {
  freeProductDiscountId?: string;
  discountName?: string | null;
  orderFreeProductDiscountProducts?: OrderFreeProductDiscountProduct[];
}

export interface OrderBundle {
  id?: string;
  bundleDiscountId?: string;
  discountName?: string | null;
  bundleDiscount?: {
    id?: string;
    name?: string;
    bundlePrice?: number;
    bundleDiscountProducts?: OrderBundleProduct[];
  } | null;
  bundleProducts?: OrderBundleProduct[];
  quantity?: number;
  totalPrice?: number;
  price?: number;
  orderItemPrice?: number;
  orderItemDiscountedPrice?: number;
  orderItemNumber?: string;
  orderFreeProducts?: OrderFreeProduct[];
}

export interface Order {
  id: string;
  orderNumber: string;
  recipientFirstName: string;
  recipientLastName: string;
  recipientPhoneNumber: string;
  recipientIdentityNumber?: string;
  cargoNumber: string | null;
  cargoStatus: number;
  cargoTrackingNumber?: string | null; // Kargo takip numarası
  cargoCompany?: string | null; // Kargo şirketi
  orderStatus?: number; // Sipariş durumu
  customerId?: string;
  paymentId?: string; // Payment detayları için
  address: Address;
  billingAddress?: Address; // API'den gelen alan
  shippingAddress?: Address; // API'den gelen alan
  displayItems?: OrderItem[];
  orderItems: OrderItem[];
  orderProducts?: OrderItem[]; // API'den gelen alan
  orderBundles?: OrderBundle[];
  orderFreeProducts?: OrderFreeProduct[];
  orderBuyXPayYs?: any[];
  cargoPrice?: number; // Kargo ücreti
  couponCode?: string; // Kullanılan kupon kodu
  couponDiscountAmount?: number; // Kupon indirim tutarı
  totalAmount?: number; // Toplam tutar
  totalPrice?: number; // API'den gelen toplam fiyat
  cargoIntegrationCode?: string; // Kargo entegrasyon kodu
  cargoLabelUrls?: CargoLabelUrl[]; // Kargo etiket URL'leri
  createdOnValue: string;
  modifiedOnValue: string | null;
  isDeleted: boolean;
  refundDescription?: string | null; // Sipariş seviyesinde iade açıklaması
  isRefundApproved?: boolean; // Sipariş seviyesinde iade onay durumu
  billingType?: number; // Fatura tipi (0: Bireysel, 1: Kurumsal)
  cancelReasonType?: number | null; // İptal nedeni tipi
  rejectReason?: string | null; // İade red nedeni
  corporateCompanyName?: string | null; // Kurumsal şirket adı
  corporateTaxNumber?: string | null; // Vergi numarası
  corporateTaxOffice?: string | null; // Vergi dairesi
  email?: string; // Müşteri e-posta adresi
}

export interface CargoLabelUrl {
  labelUrl: string;
}

export interface OrderResponse extends PaginationModel {
  items: Order[];
}

export interface UpdateOrderRequest {
  orderId: string;
  recipientName?: string;
  recipientSurname?: string;
  recipientPhoneNumber?: string;
  recipientIdentityNumber?: string;
  billingAddressId: string;
  shippingAddressId: string;
  cargoStatus: number;
}

export interface GetOrdersBySellerIdRequest {
  sellerId: string;
  page: number;
  pageSize: number;
  from?: number;
}

// Refund Request Models
export interface RefundRequestedOrderItem extends OrderItem {
  note?: string;
  cancelReasonType?: number;
  rejectReason?: string | null;
  paymentTransactionId?: string;
}

export interface RefundRequestedOrder extends Order {
  email: string;
  isGiftWrap: boolean;
  giftWrapMessage?: string | null;
  giftWrapPrice: number;
  realCargoPrice: number;
  desi: number;
  distanceKm: number;
  affiliateCollectionId?: string | null;
  orderProducts: RefundRequestedOrderItem[];
  orderBundles: any[];
  orderBuyXPayYs: any[];
  orderFreeProducts: any[];
}

export interface RefundRequestedOrderItemsResponse extends PaginationModel {
  items: RefundRequestedOrder[];
}
