import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import { UPDATE_COUPON_DISCOUNT } from "@/constants/links";
import { CouponDiscount } from "@/constants/models/Discount";
import useMyMutation from "@/hooks/useMyMutation";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useUpdateCouponDiscount = () => {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMyMutation<CouponDiscount>();

  const updateDiscount = async (data: CouponDiscount) => {
    const requestBody = {
      id: data.id,
      name: data.name,
      description: data.description,
      discountValue: data.discountValue,
      discountValueType: data.discountValueType,
      maxDiscountValue: data.maxDiscountValue,
      isActive: data.isActive,
      startDate: data.startDate,
      endDate: data.endDate,
      couponCode: data.couponCode || data.couponDiscount?.couponCode || "",
      maxUsageCount:
        data.maxUsageCount || data.couponDiscount?.maxUsageCount || 0,
    };

    await mutateAsync(
      {
        url: UPDATE_COUPON_DISCOUNT,
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
