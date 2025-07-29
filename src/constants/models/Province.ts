export interface District {
  id: string;
  provinceId: string;
  name: string;
  population: number;
  area: number;
}

export interface Province {
  id: string;
  name: string;
}

export interface ProvinceListResponse {
  $id: string;
  items: Province[];
}
