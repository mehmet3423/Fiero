import { DiscountType } from "@/constants/enums/DiscountType";
import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import { CREATE_COUPON_DISCOUNT } from "@/constants/links";
import { CouponDiscount } from "@/constants/models/Discount";
import useMyMutation from "@/hooks/useMyMutation";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useCreateCouponDiscount = () => {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMyMutation<CouponDiscount>();

  const createCouponDiscount = async (
    data: Omit<CouponDiscount, "id" | "createdOn" | "createdOnValue">
  ) => {
    try {
      const params = new URLSearchParams(
        Object.entries({
          Name: data.name,
          Description: data.description,
          DiscountValue: data.discountValue.toString(),
          DiscountValueType: data.discountValueType.toString(),
          MaxDiscountValue: data.maxDiscountValue?.toString() || "0",
          StartDate: data.startDate,
          EndDate: data.endDate,
          IsActive: data.isActive.toString(),
          CouponCode: data.couponCode,
          MaxUsageCount: data.maxUsageCount?.toString() || "0",
          Type: DiscountType.Coupon.toString(),
        } as Record<string, string>)
      ).toString();

      const response = await mutateAsync({
        url: `${CREATE_COUPON_DISCOUNT}?${params}`,
        method: HttpMethod.POST,
      });

      // Ensure all required fields are included in the response
      const completeResponse: CouponDiscount = {
        ...response.data,
        createdOn: Date.now(),
        createdOnValue: new Date().toISOString(),
        type: DiscountType.Coupon,
      };

      toast.success("Sepet indirimi başarıyla oluşturuldu");
      queryClient.invalidateQueries({ queryKey: [QueryKeys.DISCOUNTS] });
      return completeResponse;
    } catch (error) {
      toast.error("Sepet indirimi oluşturulurken bir hata oluştu");
      throw error;
    }
  };

  return { createCouponDiscount, isPending };
};
