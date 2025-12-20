export interface GetClaimsResponse {
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
  content: ClaimContent[];
}

export interface ClaimContent {
  id: string;
  orderNumber: string;
  orderDate: number;
  customerFirstName: string;
  customerLastName: string;
  claimDate: number;
  cargoTrackingNumber: string;
  cargoTrackingLink: string;
  cargoSenderNumber: string;
  cargoProviderName: string;
  orderShipmentPackageId: number;
  orderOutboundPackageId?: number;
  rejectedPackageInfo?: PackageInfo;
  replacementOutboundPackageInfo?: PackageInfo;
  items: ClaimItemContainer[];
  lastModifiedDate: number;
}

export interface PackageInfo {
  cargoTrackingNumber: string;
  cargoSenderNumber: string;
  cargoProviderName: string;
  cargoTrackingLink: string;
  packageId: number;
  items: string[];
}

export interface ClaimItemContainer {
  orderLine: OrderLine;
  claimItems: ClaimItem[];
}

export interface OrderLine {
  id: number;
  productName: string;
  barcode: string;
  merchantSku: string;
  productColor: string;
  productSize: string;
  price: number;
  vatBaseAmount: number;
  salesCampaignId: number;
  productCategory: string;
}

export interface ClaimItem {
  id: string;
  orderLineItemId: number;
  customerClaimItemReason: ClaimReason;
  trendyolClaimItemReason: ClaimReason;
  claimItemStatus: ClaimItemStatus;
  note: string;
  customerNote: string;
  resolved: boolean;
  autoAccepted?: boolean;
  acceptedBySeller?: boolean;
}

export interface ClaimReason {
  id: string;
  name: string;
  externalReasonId: number;
  code: string;
}

export interface ClaimItemStatus {
  name: string;
}
