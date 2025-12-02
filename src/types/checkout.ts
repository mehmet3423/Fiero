import { GuestAddressFormData } from "@/constants/models/Address";

export interface CheckoutData {
  // Kimlik Bilgileri
  tcIdentityNumber: string;
  email: string;

  // Adres Bilgileri (authenticated kullanıcılar için)
  shippingAddressId?: string;
  billingAddressId?: string;
  isBillingSameAsDelivery: boolean;

  // Guest kullanıcılar için adres bilgileri
  guestShippingAddress?: GuestAddressFormData;
  guestBillingAddress?: GuestAddressFormData;
  isGuest: boolean;

  // Fatura Bilgileri
  billingType: number; // 0: Bireysel, 1: Kurumsal
  isCorporateBilling: boolean;
  corporateCompanyName?: string;
  corporateTaxNumber?: string;
  corporateTaxOffice?: string;

  // Timestamp (validasyon için)
  timestamp: number;
}
