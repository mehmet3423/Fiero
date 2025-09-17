import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import { UPDATE_SUBCATEGORY_DISCOUNT } from "@/constants/links";
import { SubCategoryDiscount } from "@/constants/models/Discount";
import useMyMutation from "@/hooks/useMyMutation";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useUpdateSubcategoryDiscount = () => {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMyMutation<SubCategoryDiscount>();

  const updateDiscount = async (data: SubCategoryDiscount) => {
    const requestBody = {
      id: data.id,
      name: data.name,
      description: data.description,
      discountValue: data.discountValue,
      discountValueType: data.discountValueType,
      maxDiscountValue: data.maxDiscountValue,
      startDate: data.startDate,
      endDate: data.endDate,
      isActive: data.isActive,
      subCategoryId: data.subCategoryId,
    };

    await mutateAsync(
      {
        url: UPDATE_SUBCATEGORY_DISCOUNT,
        method: HttpMethod.PUT,
        data: requestBody,
      },
      {
        onSuccess: () => {
          toast.success("İndirim başarıyla güncellendi");
          queryClient.invalidateQueries({
            queryKey: [QueryKeys.DISCOUNT_DETAIL],
          });
          queryClient.invalidateQueries({
            queryKey: [QueryKeys.DISCOUNTS],
          });
        },
      }
    );
  };

  return { updateDiscount, isPending };
};
