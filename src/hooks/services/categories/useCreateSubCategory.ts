import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import { CREATE_SUB_CATEGORY } from "@/constants/links";
import useMyMutation from "@/hooks/useMyMutation";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useCreateSubCategory = () => {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMyMutation<string>();

  const createSubCategory = async (
    name: string,
    mainCategoryId: string,
    imageUrl?: string
  ) => {
    try {
      await mutateAsync(
        {
          url: `${CREATE_SUB_CATEGORY}`,
          data: {
            mainCategoryId: mainCategoryId,
            name: name,
            imageUrl: imageUrl || "",
            createSEORequest: {
              slug: "string",
              metaTitle: "string",
              metaDescription: "string",
              robotsMetaTag: "string",
            },
            createSubCategorySpecificationDTO: [],
          },
          method: HttpMethod.POST,
        },
        {
          onSuccess: () => {
            toast.success("Alt kategori başarıyla oluşturuldu");
            queryClient.invalidateQueries({
              queryKey: [QueryKeys.MAIN_CATEGORY_LIST],
            });
          },
        }
      );
    } catch (error) {
      toast.error("Alt kategori oluşturulurken bir hata oluştu");
    }
  };

  return {
    createSubCategory,
    isPending,
  };
};