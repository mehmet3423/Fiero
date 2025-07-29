import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import { GET_SUB_CATEGORY_LIST } from "@/constants/links";
import useGetData from "@/hooks/useGetData";

export interface SubCategoryDTO {
  id: string;
  name: string;
  mainCategoryId: string;
}

export const useSubCategories = (mainCategoryId: string) => {
  const { data, isLoading, error } = useGetData<SubCategoryDTO[]>({
    url: mainCategoryId ? `${GET_SUB_CATEGORY_LIST}?MainCategoryId=${mainCategoryId}` : undefined,
    queryKey: [QueryKeys.SUB_CATEGORY_LIST, mainCategoryId],
    method: HttpMethod.GET,
    enabled: !!mainCategoryId,
    onError(err) {
      console.log(err);
    },
  });
  return {
    data,
    isLoading,
    error,
  };
};
