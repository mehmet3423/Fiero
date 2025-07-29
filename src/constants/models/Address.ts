export interface Address {
  id: string;
  $id: string;
  firstName: string;
  lastName: string;
  title: string;
  city: string;
  district: string;
  country: string;
  fullAddress: string;
  neighbourhood: string;
  street: string;
  postalCode: string;
}

export interface AddressListResponse {
  items: Address[];
}

export interface Country {
  id: string;
  commonName: string;
}

export interface Province {
  id: string;
  name: string;
}

export interface District {
  id: string;
  name: string;
}
