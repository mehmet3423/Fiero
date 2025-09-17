import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import { CREATE_FREE_PRODUCT_DISCOUNT } from "@/constants/links";
import { GiftProductDiscount } from "@/constants/models/Discount";
import useMyMutation from "@/hooks/useMyMutation";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useCreateFreeProductDiscount = () => {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMyMutation<GiftProductDiscount>();

  const createFreeProductDiscount = async (
    data: Omit<GiftProductDiscount, "id" | "createdOn" | "createdOnValue">
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
          MinimumQuantity: data.minimumQuantity.toString(),
          MaxFreeProductPrice: data.maxFreeProductPrice?.toString(),
          IsRepetable: data.isRepeatable?.toString() || "false",
          MaxFreeProductsPerOrder: data.maxFreeProductsPerOrder?.toString(),
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
        data.productIds?.map((id) => `ProductIds=${id}`).join("&") || "";

      await mutateAsync(
        {
          url: `${CREATE_FREE_PRODUCT_DISCOUNT}?${params}&${productIdsParam}`,
          method: HttpMethod.POST,
        },
        {
          onSuccess: () => {
            toast.success("Hediye ürün indirimi başarıyla oluşturuldu");
            queryClient.invalidateQueries({ queryKey: [QueryKeys.DISCOUNTS] });
          },
        }
      );
    } catch (error) {
      toast.error("Hediye ürün indirimi oluşturulurken bir hata oluştu");
    }
  };

  return { createFreeProductDiscount, isPending };
};
