import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import { GET_ALL_MAIN_CATEGORIES } from "@/constants/links";
import useGetData from "@/hooks/useGetData";

export interface SubCategoryListItemResponse {
  id: string;
  createdOnValue?: string;
  modifiedOnValue?: string;
  isDeleted: boolean;
  name: string;
  displayIndex: number;
  mainCategoryId: string;
}

export interface MainCategoryResponse {
  id: string;
  name: string;
  displayIndex: number;
  createdOnValue: string;
  modifiedOnValue?: string;
  subCategories: SubCategoryListItemResponse[];
}

export const useMainCategoriesWithSubCategories = () => {
  const { data, isLoading, error } = useGetData<MainCategoryResponse[]>({
    url: GET_ALL_MAIN_CATEGORIES,
    queryKey: QueryKeys.MAIN_CATEGORIES_WITH_SUBS,
    method: HttpMethod.GET,
    onError(err) {
      console.error("Ana kategoriler yüklenirken hata oluştu:", err);
    },
  });

  return {
    data: data || [],
    isLoading,
    error,
  };
};
