export interface CargoTrackingInfo {
  customerPrivateCode: string;
  invoiceNumber: string;
  sender: string;
  receiver: string;
  cargoLinkNumber: string;
  cargoTrackingNumber: string;
  originBranch: string;
  originBranchPhone: string;
  destinationBranch: string;
  destinationBranchPhone: string;
  departureDate: string;
  departureTime: string;
  quantity: number;
  kgDesi: number;
  paymentType: string;
  amount: number;
  reference: string;
  deliveredTo: string;
  deliveryDate: string;
  deliveryTime: string;
  arrivalCode: string;
  typeCode: string;
  statusCode: string;
  undeliveredReasonCode: string;
  status: string;
  worldwide: string;
  cargoCode: string;
  statusEnglish: string;
  collectionAmount: string;
  collectionType: string;
  valourDate: string;
  paymentAmount: string;
  paymentDate: string;
  collectionCancelled: string;
  returnReason: string;
  transferReason: string;
  transferCode: string;
  transferDescription: string;
  operationDate: string;
}

/**
 * API'den dönen response tipi - array of CargoTrackingInfo
 */
export type CargoTrackingResponse = CargoTrackingInfo[];
