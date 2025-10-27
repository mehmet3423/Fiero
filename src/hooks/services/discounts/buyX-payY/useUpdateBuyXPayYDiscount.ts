import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import { UPDATE_BUY_X_PAY_Y_DISCOUNT } from "@/constants/links";
import { BuyYPayXDiscount } from "@/constants/models/Discount";
import useMyMutation from "@/hooks/useMyMutation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

export const useUpdateBuyXPayYDiscount = () => {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMyMutation<BuyYPayXDiscount>();

  const updateDiscount = async (data: BuyYPayXDiscount) => {
    const requestBody = {
      id: data.id,
      buyXCount: data.buyXCount,
      payYCount: data.payYCount,
      maxDiscountValue: data.maxDiscountValue,
      name: data.name,
      description: data.description,
      discountValue: data.discountValue,
      discountValueType: data.discountValueType,
      startDate: data.startDate,
      endDate: data.endDate,
      isActive: data.isActive,
      isRepeatable: data.isRepeatable,
      maxRepeatPerOrder: data.maxFreeProductPerOrder,
      productIds: data.buyXPayYProducts,
    };

    await mutateAsync(
      {
        url: UPDATE_BUY_X_PAY_Y_DISCOUNT,
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
