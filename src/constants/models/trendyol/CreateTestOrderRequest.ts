export interface CreateTestOrderRequest {
  customer: CustomerRequest;
  invoiceAddress: InvoiceAddressRequest;
  lines: LineRequest[];
  seller: SellerRequest;
  shippingAddress: ShippingAddressRequest;
  commercial: boolean;
  microRegion?: string;
}

export interface CustomerRequest {
  customerFirstName: string;
  customerLastName: string;
}

export interface InvoiceAddressRequest {
  addressText: string;
  city: string;
  company: string;
  district: string;
  latitude: string;
  longitude: string;
  neighborhood: string;
  phone: string;
  postalCode: string;
  email: string;
  invoiceFirstName: string;
  invoiceLastName: string;
  invoiceTaxNumber: string;
  invoiceTaxOffice: string;
}

export interface ShippingAddressRequest {
  addressText: string;
  city: string;
  company: string;
  district: string;
  latitude: string;
  longitude: string;
  neighborhood: string;
  phone: string;
  postalCode: string;
  email: string;
  shippingFirstName: string;
  shippingLastName: string;
}

export interface LineRequest {
  barcode: string;
  quantity: number;
  discountPercentage: number;
}

export interface SellerRequest {
  sellerId: number;
}

export interface CreateTestOrderResponse {
  orderNumber: string;
}