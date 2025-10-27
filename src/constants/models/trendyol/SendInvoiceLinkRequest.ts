export interface SendInvoiceLinkRequest {
  invoiceLink: string;
  shipmentPackageId: number;
  invoiceDateTime?: number;
  invoiceNumber?: string;
}