export interface MainCategoryLookUp {
  id: string;
  name: string;
  displayIndex: number;
  createdOnValue: string;
  modifiedOnValue: string;
  isDeleted: boolean;
  imageUrl?: string;
}

export interface MainCategoryiesLookUpResponse {
  data: {
    items: MainCategoryLookUp[];
  }
}
