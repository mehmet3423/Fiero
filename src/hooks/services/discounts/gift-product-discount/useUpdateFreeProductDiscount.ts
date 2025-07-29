import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import { UPDATE_FREE_PRODUCT_DISCOUNT } from "@/constants/links";
import { FreeProductDiscount } from "@/constants/models/Discount";
import useMyMutation from "@/hooks/useMyMutation";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useUpdateFreeProductDiscount = () => {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMyMutation<FreeProductDiscount>();

  const updateDiscount = async (data: FreeProductDiscount) => {
    const requestBody = {
      id: data.id,
      minimumQuantity: data.minimumQuantity,
      maxFreeProductsPerOrder: data.maxFreeProductsPerOrder,
      maxFreeProductPrice: data.maxFreeProductPrice,
      isRepeatable: data.isRepeatable,
      name: data.name,
      description: data.description,
      discountValue: data.discountValue,
      discountValueType: data.discountValueType,
      maxDiscountValue: data.maxDiscountValue,
      startDate: data.startDate,
      endDate: data.endDate,
      isActive: data.isActive,
      productIds: data.productIds,
    };

    await mutateAsync(
      {
        url: UPDATE_FREE_PRODUCT_DISCOUNT,
        method: HttpMethod.PUT,
        data: requestBody,
      },
      {
        onSuccess: () => {
          toast.success("İndirim başarıyla güncellendi");
          queryClient.invalidateQueries({
            queryKey: [QueryKeys.DISCOUNT_DETAIL],
          });
        },
      }
    );
  };

  return { updateDiscount, isPending };
};
