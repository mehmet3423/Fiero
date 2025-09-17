export interface CompanyAddress {
  country: number;
  state: number;
  city: number;
  fullAddress: number;
}

export interface Register {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  gender: number;
  birthDate: string;
  IsSMSNotificationEnabled?: boolean;
  IsEmailNotificationEnabled?: boolean;
  isSeller?: boolean;
  companyName?: string;
  companyAddress?: CompanyAddress;
}
