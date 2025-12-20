export interface CreateClaimRequest {
  claimItems: CreateClaimItem[];
  customerId: number;
  excludeListing: boolean;
  forcePackageCreation: boolean;
  orderNumber: string;
  shipmentCompanyId: number;
}

export interface CreateClaimItem {
  barcode: string;
  customerNote: string;
  quantity: number;
  reasonId: number;
}
