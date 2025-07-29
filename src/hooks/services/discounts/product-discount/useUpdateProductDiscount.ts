import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import { UPDATE_PRODUCT_DISCOUNT } from "@/constants/links";
import { ProductDiscount } from "@/constants/models/Discount";
import useMyMutation from "@/hooks/useMyMutation";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useUpdateProductDiscount = () => {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMyMutation<ProductDiscount>();

  const updateDiscount = async (data: ProductDiscount) => {
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
      productId: data.productId,
    };

    await mutateAsync(
      {
        url: UPDATE_PRODUCT_DISCOUNT,
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
