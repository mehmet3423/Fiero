// Temel kullanıcı bilgilerini içeren arayüz
interface UserBase {
  id: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  email: string;
  userGroupIds?: any | null;
  roleIds?: any | null;
  roles?: any | null;
  addresses?: Address[] | null;
  userPaymentCard?: any[];
  createdOnValue?: string;
  modifiedOnValue?: string | null;
  isDeleted?: boolean;
  isSMSNotificationEnabled?: boolean;
  isEmailNotificationEnabled?: boolean;
  claims?: {
    id: string;
    values: any[];
  };
  logins?: {
    id: string;
    values: any[];
  };
  tokens?: {
    id: string;
    values: any[];
  };
  userRoles?: {
    id: string;
    values: any[];
  };
  userGroups?: {
    id: string;
    values: any[];
  };
}

export interface ApplicationUser {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  fullName: string;
  emailConfirmed: boolean;
  email: string;
  phoneNumber: string;
  userGroupIds: any | null;
  roleIds: any | null;
  roles: any | null;
  addresses: Address[];
  userPaymentCard: any[];
  isSMSNotificationEnabled?: boolean;
  isEmailNotificationEnabled?: boolean;
  claims?: {
    id: string;
    values: any[];
  };
  logins?: {
    id: string;
    values: any[];
  };
  tokens?: {
    id: string;
    values: any[];
  };
  userRoles?: {
    id: string;
    values: any[];
  };
  userGroups?: {
    id: string;
    values: any[];
  };
}

export interface Customer {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
}

export interface Seller {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
}

export interface Address {
  id: string;
  title: string;
  country: string;
  city: string;
  district?: string;
  neighbourhood?: string;
  street?: string;
  postalCode?: string;
  fullAddress: string;
  applicationUserId: string;
  createdOnValue: string;
  modifiedOnValue: string | null;
  isDeleted: boolean;
}

// Admin profili
export interface AdminProfile extends UserBase {
  applicationUser?: ApplicationUser;
}

// Müşteri profili
export interface CustomerProfile extends UserBase {
  gender: number;
  phoneNumber: string;
  birthDate?: string;
  cart: {
    customerId: string;
    cartProducts: any[];
    id: string;
    createdOnValue: string;
    modifiedOnValue: string;
    isDeleted: boolean;
  };
  orders: any[];
  favorites: any[];
  addresses: Address[] | null;
  applicationUser: ApplicationUser;
}

// Satıcı profili
export interface SellerProfile extends UserBase {
  gender?: number;
  companyName: string | null;
  companyAddress: {
    title: string;
    country: string;
    city: string;
    district: string;
    neighbourhood: string;
    street: string;
    postalCode: string;
    fullAddress: string;
    applicationUserId: string;
    id: string;
    createdOnValue: string;
    modifiedOnValue: string | null;
    isDeleted: boolean;
  };
  applicationUser: ApplicationUser;
  products: any[];
}

// Tüm profil tiplerini kapsayan birleşim türü
export type UserProfile = AdminProfile | CustomerProfile | SellerProfile;
