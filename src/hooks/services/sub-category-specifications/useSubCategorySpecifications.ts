import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import { GET_SUB_CATEGORY_SPECIFICATION_LIST } from "@/constants/links";
import { SubCategorySpecificationListResponse } from "@/constants/models/SubCategorySpecification";
import useGetData from "@/hooks/useGetData";

export const useSubCategorySpecifications = (subCategoryId: string | null) => {
  const { data, isLoading, error, refetch } =
    useGetData<SubCategorySpecificationListResponse>({
      url:
        subCategoryId !== null
          ? `${GET_SUB_CATEGORY_SPECIFICATION_LIST}?SubCategoryId=${subCategoryId}&_=${Date.now()}`
          : undefined,
      queryKey: [
        QueryKeys.SUB_CATEGORY_SPECIFICATIONS_LIST,
        subCategoryId?.toString(),
      ],
      method: HttpMethod.GET,
      onError: () => {
        return {
          $id: "0",
          items: [],
        };
      },
    });

  return {
    subCategorySpecifications: data?.items,
    isLoading,
    error,
    refetchSubCategorySpecifications: refetch,
  };
};
