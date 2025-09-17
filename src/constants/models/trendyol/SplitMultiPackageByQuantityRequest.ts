export interface SplitMultiPackageByQuantityRequest {
  splitPackages: SplitMultiPackageGroup[];
}

export interface SplitMultiPackageGroup {
  packageDetails: SplitMultiPackageDetail[];
}

export interface SplitMultiPackageDetail {
  orderLineId: number;
  quantities: number;
}