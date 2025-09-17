export interface SplitShipmentPackageByQuantityRequest {
  quantitySplit: SplitQuantityGroup[];
}

export interface SplitQuantityGroup {
  orderLineId: number;
  quantities: number[];
}