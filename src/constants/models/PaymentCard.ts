import { PaginationModel } from "./Pagination";

export interface UserPaymentCardListResponse extends PaginationModel {
  data: UserPaymentCard[];
}

export interface UserPaymentCard {
  $id?: string;
  id?: string;
  cardHolderName: string;
  cardNumber: string;
  expireMonth: string;
  expireYear: string;
  maskedCardNumber: string;
  cvc: string;
  registerCard: boolean;
  paymentCardId: string;
  isDeleted: boolean;
  cardAlias?: string;
}
