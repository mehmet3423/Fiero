export interface UpdateShipmentPackageStatusRequest {
  /**
   * Güncellenecek yeni statü (sadece Picking veya Invoiced olabilir).
   */
  status: string; // "Picking" veya "Invoiced"

  /**
   * Paket içindeki satır detayları.
   */
  lines?: UpdateShipmentLineItem[];

  /**
   * Ek parametreler (fatura numarası gibi).
   */
  params?: Record<string, string>;
}

/**
 * Paket içerisindeki satır güncellemesini temsil eder.
 */
export interface UpdateShipmentLineItem {
  /**
   * Sipariş satır ID'si.
   */
  lineId: number;

  /**
   * Satırdaki ürün adedi.
   */
  quantity: number;
}