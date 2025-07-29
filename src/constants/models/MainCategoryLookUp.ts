export interface MainCategoryLookUp {
  id: string;
  name: string;
  displayIndex: number;
  createdOnValue: string;
  modifiedOnValue: string;
  isDeleted: boolean;
}

export interface MainCategoryiesLookUpResponse {
  items: MainCategoryLookUp[];
}
