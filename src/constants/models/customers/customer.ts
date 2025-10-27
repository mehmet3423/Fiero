// Customer models for admin panel

export interface CustomerListItem {
  id: string;
  customerId?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  birthDate?: string;
  isEmailNotificationEnabled: boolean;
  isSMSNotificationEnabled: boolean;
  gender?: number;
  registerDate?: string;
  isActive?: boolean;
  isDeleted?: boolean;
  modifiedOnValue?: string | null;
  createdOnValue?: string;
  applicationUser?: any;
  cart?: any;
  cartProducts?: any[];
  addresses?: any;
  favorites?: any[];
  orders?: any[];
}

export interface CustomerListResponse {
  data: {
    items: CustomerListItem[];
    count: number;
    from: number;
    hasNext: boolean;
    hasPrevious: boolean;
    index: number;
    pages: number;
    size: number;
  };
  isSucceed: boolean;
  message: string;
}

export interface CustomerListRequest {
  search?: string;
  registerDate?: string;
  registerDateTo?: string;
  page?: number;
  pageSize?: number;
  from?: number;
}

export interface CustomerListRequestBody {
  search?: string;
  registerDate?: string; // ISO string format
  registerDateTo?: string; // ISO string format
  page: number;
  pageSize: number;
  from: number;
}

export interface UpdateCustomerRequest {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  birthDate: string;
  isEmailNotificationEnabled: boolean;
  isSMSNotificationEnabled: boolean;
  gender: number; // 0 = Erkek, 1 = Kadın
}

export interface Customer extends CustomerListItem {
  // Additional fields that might be needed for detailed view
  fullName?: string;
  addresses?: any[];
  orders?: any[];
  createdOnValue?: string;
  modifiedOnValue?: string;
  isDeleted?: boolean;
}
