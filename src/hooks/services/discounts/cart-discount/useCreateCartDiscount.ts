import { DiscountType } from "@/constants/enums/DiscountType";
import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import { CREATE_CART_DISCOUNT } from "@/constants/links";
import { CartDiscount } from "@/constants/models/Discount";
import useMyMutation from "@/hooks/useMyMutation";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useCreateCartDiscount = () => {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMyMutation<CartDiscount>();

  const createCartDiscount = async (
    data: Omit<CartDiscount, "id" | "createdOn" | "createdOnValue">
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
          MinimumCartAmount: data.minimumCartAmount.toString(),
          MaximumCartAmount: data.maximumCartAmount.toString(),
          MinimumCartProductCount: data.minimumCartProductCount.toString(),
          MaximumCartProductCount: data.maximumCartProductCount.toString(),
          Type: DiscountType.Cart.toString(),
          // Notification Settings
          IsEmailNotificationEnabled:
            data.notificationSettings?.isEmailNotificationEnabled?.toString() ||
            "false",
          EmailNotificationSubject:
            data.notificationSettings?.emailNotificationSubject || "",
          EmailNotificationTextBody:
            data.notificationSettings?.emailNotificationTextBody || "",
          EmailNotificationHtmlBody:
            data.notificationSettings?.emailNotificationHtmlBody || "",
          IsSMSNotificationEnabled:
            data.notificationSettings?.isSMSNotificationEnabled?.toString() ||
            "false",
          SMSNotificationSubject:
            data.notificationSettings?.smsNotificationSubject || "",
          SMSNotificationTextBody:
            data.notificationSettings?.smsNotificationTextBody || "",
          SMSNotificationHtmlBody:
            data.notificationSettings?.smsNotificationHtmlBody || "",
        } as Record<string, string>)
      ).toString();

      const response = await mutateAsync({
        url: `${CREATE_CART_DISCOUNT}?${params}`,
        method: HttpMethod.POST,
      });

      // Ensure all required fields are included in the response
      const completeResponse: CartDiscount = {
        ...response.data,
        minimumCartAmount: data.minimumCartAmount,
        createdOn: Date.now(),
        createdOnValue: new Date().toISOString(),
        type: DiscountType.Cart,
      };

      toast.success("Sepet indirimi başarıyla oluşturuldu");
      queryClient.invalidateQueries({ queryKey: [QueryKeys.DISCOUNTS] });
      return completeResponse;
    } catch (error) {
      toast.error("Sepet indirimi oluşturulurken bir hata oluştu");
      throw error;
    }
  };

  return { createCartDiscount, isPending };
};
