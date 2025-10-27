export interface DeleteInvoiceLinkRequest {
  serviceSourceId: number; // shipmentPackageId
  channelId: number; // her zaman 1 olarak gönderilmelidir.
  customerId: number; // sipariş paketleri çekme servisinden kontrol edilmelidir.
}