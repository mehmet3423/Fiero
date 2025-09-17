export interface SplitShipmentPackageMultiGroupRequest {
  splitGroups: SplitShipmentGroup[];
}

export interface SplitShipmentGroup {
  orderLineIds: number[];
}