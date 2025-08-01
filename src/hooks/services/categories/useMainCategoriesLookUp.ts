import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import { GET_MAIN_CATEGORY_LOOKUP_LIST } from "@/constants/links";
import {
  MainCategoryLookUp,
  MainCategoryiesLookUpResponse,
} from "@/constants/models/MainCategoryLookUp";
import useGetData from "@/hooks/useGetData";

export const useMainCategoriesLookUp = (enabled: boolean = true) => {
  const {
    data: raw,
    isLoading,
    error,
  } = useGetData<MainCategoryiesLookUpResponse | MainCategoryLookUp[]>({
    url: GET_MAIN_CATEGORY_LOOKUP_LIST,
    queryKey: QueryKeys.MAIN_CATEGORY_LOOKUP,
    method: HttpMethod.GET,
    enabled,
    onError(err) {
      console.log(err);
    },
  });

  const data: MainCategoryiesLookUpResponse | undefined = raw
    ? Array.isArray(raw)
      ? { items: raw }
      : (raw as MainCategoryiesLookUpResponse)
    : undefined;

  return {
    categories: data,
    isLoading,
    error,
  };
};
