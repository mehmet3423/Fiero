import { Address } from "./Address";
import { PaginationModel } from "./Pagination";

export interface CreateOrderRequest {
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
}

export interface OrderItem {
  id: string;
  orderItemNumber: string;
  quantity: number;
  price: number;
  orderItemPrice?: number; // API'den gelen alan
  orderItemDiscountedPrice?: number; // API'den gelen alan
  discountedPrice: number;
  cargoStatus: number;
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
  createdOnValue: string;
  modifiedOnValue: string | null;
  isDeleted: boolean;
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
  orderStatus?: number; // Sipariş durumu
  customerId?: string;
  paymentId?: string; // Payment detayları için
  address: Address;
  billingAddress?: Address; // API'den gelen alan
  shippingAddress?: Address; // API'den gelen alan
  orderItems: OrderItem[];
  orderProducts?: OrderItem[]; // API'den gelen alan
  cargoPrice?: number; // Kargo ücreti
  couponCode?: string; // Kullanılan kupon kodu
  couponDiscountAmount?: number; // Kupon indirim tutarı
  totalAmount?: number; // Toplam tutar
  totalPrice?: number; // API'den gelen toplam fiyat
  createdOnValue: string;
  modifiedOnValue: string | null;
  isDeleted: boolean;
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
