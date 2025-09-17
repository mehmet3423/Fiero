import { CommandResultWithData } from "./CommandResult";
import { UserPaymentCard } from "./PaymentCard";


// BaseResponseV2 interface matching backend C# BaseResponseV2 class
export interface BaseResponseV2 {
  status: string;
  statusCode: number;
  errorCode?: string | null;
  errorMessage?: string | null;
  errorGroup?: string | null;
  conversationId: string;
  systemTime: number;
  locale: string;
}

// Updated PaymentRequest to match new backend structure
export interface PaymentRequest {
  orderId: string;
  paymentCard: PaymentCardRequest;
  installment: number;
  locale: number;
  currency: number;
}

// New PaymentCardRequest interface matching backend PaymentCardRequest
export interface PaymentCardRequest {
  cardHolderName?: string;
  cardNumber?: string;
  expireYear?: string;
  expireMonth?: string;
  cvc?: string;
  registerCard?: number; // 0 or 1
  cardAlias?: string;
  cardUserKey?: string;
  cardToken?: string;
}

// Updated to match backend CreateNonThreedsPaymentAuthResponse
export interface CreateNonThreedsPaymentAuthResponseData extends BaseResponseV2 {
  price: number;
  paidPrice: number;
  installment?: number | null;
  currency: string;
  paymentId: string;
  signature: string;
  paymentStatus?: number | null;
  fraudStatus?: number | null;
  merchantCommissionRate: number;
  merchantCommissionRateAmount: number;
  iyziCommissionRateAmount: number;
  iyziCommissionFee: number;
  cardType: string;
  cardAssociation: string;
  cardFamily: string;
  cardToken: string;
  cardUserKey: string;
  binNumber: string;
  lastFourDigits: string;
  basketId: string;
  itemTransactions: PaymentItemResponse[];
  connectorName: string;
  authCode: string;
  hostReference: string;
  phase: string;
  mdStatus?: number | null;
}

// NotifyFrontend için
export interface NotifyFrontendRequest {
  transactionId: string;
  status: string;
  message: string;
  paymentId?: string | null;
}

// PaymentThreeDSecureInitialize için - Updated to match new backend structure
export interface PaymentThreeDSecureInitializeRequest {
  orderId: string;        // Backend'de Guid olarak parse edilecek
  paymentCard: PaymentCardRequest;  // Updated to use PaymentCardRequest
  installment: number;    // Backend'de InstallmentType enum olarak parse edilecek
  locale: number;         // Backend'de LocaleType enum olarak parse edilecek
  currency: number;       // Backend'de CurrencyType enum olarak parse edilecek
}

// Updated to match backend CreateThreedsPaymentInitializeResponse
export interface CreateThreedsPaymentInitializeResponseData extends BaseResponseV2 {
  ConversationId: string;
  threeDSHtmlContent?: string; // JSON property name: "threeDSHtmlContent"
  paymentId: string;           // JSON property name: "paymentId"
  signature: string;           // JSON property name: "signature"
}

export type PaymentThreeDSecureInitializeResponse = CommandResultWithData<CreateThreedsPaymentInitializeResponseData>;

// CompleteThreeDSecurePayment için - Updated to match backend CompleteThreedsPaymentResponse
export interface CompleteThreeDSecurePaymentRequest {
  paymentId: string;          // Required
  conversationData?: string;  // Optional
  conversationId: string;     // Required - Backend model güncellemesi ile zorunlu oldu
  orderId: string;            // ECommerce API requirement - Guid string olarak gönderilecek
  locale: number;             // LocaleType enum değeri (0 = Turkish)
}

export interface CompleteThreedsPaymentResponseData extends BaseResponseV2 {
  price: number;
  paidPrice: number;
  installment?: number | null;
  currency: string;
  paymentId: string;
  signature?: string;
  paymentStatus: number;
  fraudStatus?: number | null;
  merchantCommissionRate: number;
  merchantCommissionRateAmount: number;
  iyziCommissionRateAmount: number;
  iyziCommissionFee: number;
  cardType: string;
  cardAssociation: string;
  cardFamily: string;
  cardToken: string;
  cardUserKey: string;
  binNumber: string;
  lastFourDigits: string;
  basketId: string;
  itemTransactions: PaymentItemResponse[];
  connectorName: string;
  authCode: string;
  hostReference: string;
  phase: string;
  mdStatus?: number | null;
}

export interface PaymentItemResponse {
  itemId: string;
  paymentTransactionId: string;
  transactionStatus?: number | null;
  price: number;
  paidPrice: number;
  merchantCommissionRate: number;
  merchantCommissionRateAmount: number;
  iyziCommissionRateAmount: number;
  iyziCommissionFee: number;
  blockageRate: number;
  blockageRateAmountMerchant: number;
  blockageRateAmountSubMerchant: number;
  blockageResolvedDate?: string | null;
  subMerchantKey: string;
  subMerchantPrice: number;
  subMerchantPayoutRate: number;
  subMerchantPayoutAmount: number;
  merchantPayoutAmount: number;
  convertedPayout?: ConvertedPayoutResponse;
  withholdingTax?: string;
}

export interface ConvertedPayoutResponse {
  paidPrice: number;
  iyziCommissionRateAmount: number;
  iyziCommissionFee: number;
  blockageRateAmountMerchant: number;
  blockageRateAmountSubMerchant: number;
  subMerchantPayoutAmount: number;
  merchantPayoutAmount: number;
  iyziConversionRate: number;
  iyziConversionRateAmount: number;
  currency: string;
  iyziConversationRateAmount?: number | null;
}

// RetrieveCards için - Updated to match backend RetrieveCardsResponse
export interface RetrieveCardsRequest {
  cardsaskey: string;
  locale: number;
  conversationId: string;
}

export interface CardDetailResponse {
  cardUserKey: string;
  cardToken: string;
  cardAlias: string;
  binNumber: string;
  lastFourDigits: string;
  cardType: string;
  cardAssociation: string;
  cardFamily: string;
  cardBankName: string;
  cardBankCode?: number | null;
  email: string;
  externalId: string;
}

export interface RetrieveCardsResponseData extends BaseResponseV2 {
  cardUserKey: string;
  cardDetails: CardDetailResponse[];
}

export type RetrieveCardsResponse = CommandResultWithData<RetrieveCardsResponseData>;

// GetPaymentDetail için - Updated to match backend PaymentDetailResponse
export interface GetPaymentDetailRequest {
  paymentId: string;
  locale: number;
  conversationId: string;
}

export interface PaymentDetailResponseData extends BaseResponseV2 {
  price: number;
  paidPrice: number;
  installment?: number | null;
  currency: string;
  paymentId: string;
  signature: string;
  paymentStatus: string;
  fraudStatus?: number | null;
  merchantCommissionRate: number;
  merchantCommissionRateAmount: number;
  iyziCommissionRateAmount: number;
  iyziCommissionFee: number;
  cardType: string;
  cardAssociation: string;
  cardFamily: string;
  cardToken: string;
  cardUserKey: string;
  binNumber: string;
  lastFourDigits: string;
  basketId: string;
  itemTransactions: PaymentItemResponse[];
  connectorName: string;
  authCode: string;
  hostReference: string;
  phase: string;
  mdStatus?: number | null;
}

// GetInstallmentInfo için - Updated to match backend InstallmentInfoResponse
export interface GetInstallmentInfoRequest {
  price: string;
  userPaymentCardId: string;
  conversationId: string;
}

export interface InstallmentPriceResponse {
  price: number;
  totalPrice: number;
  installmentNumber?: number | null;
  installmentPrice: number;
}

// InstallmentOption interface for frontend usage
export interface InstallmentOption {
  installmentNumber: number;
  installmentPrice: number;
  totalPrice: number;
  installmentRate?: number;
}

export interface InstallmentDetailResponse {
  binNumber: string;
  commercial: number;
  price: number;
  cardType: string;
  cardAssociation: string;
  cardFamilyName: string;
  force3ds?: number | null;
  bankCode?: number | null;
  bankName: string;
  forceCvc?: number | null;
  installmentPrices: InstallmentPriceResponse[];
}

export interface InstallmentInfoResponseData extends BaseResponseV2 {
  installmentDetails: InstallmentDetailResponse[];
}

// CheckBin için - Updated to match backend BinNumberQueryResponse
export interface CheckBinRequest {
  binNumber: string;
  locale: number;
  conversationId: string;
}

export interface BinNumberQueryResponseData extends BaseResponseV2 {
  binNumber: string;
  cardType: string;
  cardAssociation: string;
  cardFamily: string;
  bankName: string;
  bankCode: number;
  commercial: number;
}

// ProcessRefundItems için
export interface RefundItem {
  orderItemId: string;
  isApproved: boolean;
  rejectReason: number | null;
  description: string; // Kullanıcının girdiği açıklama metni
}

export interface ProcessRefundItemsRequest {
  items: RefundItem[];
}

// ProcessRefundItemsByOrder için
export interface ProcessRefundItemsByOrderRequest {
  orderId: string;
  isApproved: boolean;
  rejectReason: number | null;
  description: string; // Kullanıcının girdiği açıklama metni
}
