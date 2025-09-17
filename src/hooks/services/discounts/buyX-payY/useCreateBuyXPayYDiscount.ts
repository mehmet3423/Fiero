import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import { CREATE_BUY_X_PAY_Y_DISCOUNT } from "@/constants/links";
import { BuyYPayXDiscount } from "@/constants/models/Discount";
import useMyMutation from "@/hooks/useMyMutation";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useCreateBuyXPayYDiscount = () => {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMyMutation<BuyYPayXDiscount>();

  const createBuyXPayYDiscount = async (
    data: Omit<BuyYPayXDiscount, "id" | "createdOn" | "createdOnValue">
  ) => {
    try {
      const params = new URLSearchParams(
        Object.entries({
          Name: data.name,
          Description: data.description,
          DiscountValue: data.discountValue.toString(),
          DiscountValueType: data.discountValueType.toString(),
          StartDate: data.startDate,
          EndDate: data.endDate,
          IsActive: data.isActive.toString(),
          BuyXCount: data.buyXCount.toString(),
          PayYCount: data.payYCount.toString(),
          MaxDiscountValue: data.maxDiscountValue.toString(),
          MaxRepeatPerOrder: data.maxFreeProductPerOrder.toString(),
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

      const productIdsParam =
        data.buyXPayYProducts?.map((id) => `ProductIds=${id}`).join("&") || "";

      await mutateAsync(
        {
          url: `${CREATE_BUY_X_PAY_Y_DISCOUNT}?${params}&${productIdsParam}`,
          method: HttpMethod.POST,
        },
        {
          onSuccess: () => {
            toast.success("BuyXPayY indirimi başarıyla oluşturuldu");
            queryClient.invalidateQueries({ queryKey: [QueryKeys.DISCOUNTS] });
          },
        }
      );
    } catch (error) {
      toast.error("BuyXPayY indirimi oluşturulurken bir hata oluştu");
    }
  };

  return { createBuyXPayYDiscount, isPending };
};
