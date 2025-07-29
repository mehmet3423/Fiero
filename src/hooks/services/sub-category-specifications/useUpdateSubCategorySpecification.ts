import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import { UPDATE_SUB_CATEGORY_SPECIFICATION } from "@/constants/links";
import { SubCategorySpecification } from "@/constants/models/SubCategorySpecification";
import useMyMutation from "@/hooks/useMyMutation";
import { useQueryClient } from "@tanstack/react-query";

export const useUpdateSubCategorySpecification = () => {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMyMutation<SubCategorySpecification>();

  const updateSubCategorySpecification = async (
    subCategorySpecificationId: string,
    subCategorySpecification: SubCategorySpecification,
    subCategoryId: string
  ) => {
    // Sadece güncellenmiş seçenekleri gönder
    const updatedOptions = subCategorySpecification.specificationOptions
      .filter((option) => option.value.trim() !== "") // Boş değerleri filtrele
      .map((option) => ({
        id: option.id,
        value: option.value.trim(),
      }));

    await mutateAsync(
      {
        url: `${UPDATE_SUB_CATEGORY_SPECIFICATION}`,
        method: HttpMethod.PUT,
        data: {
          id: subCategorySpecification.id,
          name: subCategorySpecification.name,
          UpdateSubCategorySpecificationOptionDTOs: updatedOptions,
          newOptions: subCategorySpecification.newOptions,
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: [
              QueryKeys.SUB_CATEGORY_SPECIFICATIONS_LIST,
              subCategoryId,
            ],
          });
        },
      }
    );
  };

  return { updateSubCategorySpecification, isPending };
};
