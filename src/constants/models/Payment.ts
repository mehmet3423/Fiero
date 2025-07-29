export interface PaymentRequest {
  orderId: string;
  affliateCollectionId: string;
  paymentCardId: string;
  installment: number;
  locale: number;
  currency: number;
  cvc: string;
}

export interface PaymentResponse {
  success: boolean;
  message: string;
}

// NotifyFrontend için
export interface NotifyFrontendRequest {
  transactionId: string;
  status: string;
  message: string;
  paymentId: string;
}

// RetrieveCards için
export interface RetrieveCardsRequest {
  cardsaskey: string;
  locale: number;
  conversationId: string;
}

// GetPaymentDetail için
export interface GetPaymentDetailRequest {
  paymentId: string;
  locale: number;
  conversationId: string;
}

// GetInstallmentInfo için
export interface GetInstallmentInfoRequest {
  price: string;
  userPaymentCardId: string;
  conversationId: string;
}

export interface InstallmentOption {
  installmentNumber: number;
  installmentPrice: number;
  totalPrice: number;
  installmentRate: number;
}

export interface InstallmentPrice {
  installmentPrice: number;
  totalPrice: number;
  installmentNumber: number;
}

export interface InstallmentDetail {
  binNumber: string;
  commercial: number;
  price: number;
  cardType: string;
  cardAssociation: string;
  bankCode: number;
  bankName: string;
  cardFamilyName: string;
  force3ds: number;
  forceCvc: number;
  installmentPrices: InstallmentPrice[];
}

export interface GetInstallmentInfoResponse {
  installmentDetails: InstallmentDetail[];
  success: boolean;
  message: string;
  status: string;
  statusCode: number;
  conversationId: string;
  locale: string;
  systemTime: number;
}

// CheckBin için
export interface CheckBinRequest {
  binNumber: string;
  locale: number;
  conversationId: string;
}

export interface CheckBinResponse {
  cardType: string;
  cardAssociation: string;
  cardFamily: string;
  bankName: string;
  bankCode: string;
  success: boolean;
  message: string;
  conversationId?: string;
}

// ProcessRefundItems için
export interface RefundItem {
  orderItemId: string;
  isApproved: boolean;
  rejectionReason: string;
}

export interface ProcessRefundItemsRequest {
  items: RefundItem[];
}

// ProcessRefundItemsByOrder için
export interface ProcessRefundItemsByOrderRequest {
  orderId: string;
  isApproved: boolean;
  rejectionReason: string;
}
