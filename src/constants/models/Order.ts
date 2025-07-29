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
}

export interface OrderItem {
  id: string;
  orderItemNumber: string;
  quantity: number;
  price: number;
  discountedPrice: number;
  cargoStatus: number;
  productId?: string;
  product: {
    title?: string;
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
  orderItems: OrderItem[];
  createdOnValue: string;
  modifiedOnValue: string | null;
  isDeleted: boolean;
}

export interface OrderResponse extends PaginationModel {
  items: Order[];
}

export interface UpdateOrderRequest {
  id: string;
  recipientFirstName?: string;
  recipientLastName?: string;
  recipientPhoneNumber?: string;
  recipientIdentityNumber?: string;
}

export interface GetOrdersBySellerIdRequest {
  sellerId: string;
  page: number;
  pageSize: number;
  from?: number;
}
