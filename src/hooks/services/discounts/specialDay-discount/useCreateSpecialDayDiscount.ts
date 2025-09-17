import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import { CREATE_SPECIAL_DAY_DISCOUNT } from "@/constants/links";
import { SpecialDayDiscount } from "@/constants/models/Discount";
import useMyMutation from "@/hooks/useMyMutation";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useCreateSpecialDayDiscount = () => {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMyMutation<SpecialDayDiscount>();

  const createSpecialDayDiscount = async (
    data: Omit<SpecialDayDiscount, "id" | "createdOn" | "createdOnValue">
  ) => {
    try {
      const params = new URLSearchParams(
        Object.entries({
          Day: data.day.toString(),
          Month: data.month.toString(),
          Name: data.name,
          Description: data.description || "",
          DiscountValue: data.discountValue.toString(),
          DiscountValueType: data.discountValueType.toString(),
          MaxDiscountValue: data.maxDiscountValue?.toString() || "0",
          StartDate: data.startDate,
          EndDate: data.endDate,
          IsActive: data.isActive.toString(),
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

      await mutateAsync(
        {
          url: `${CREATE_SPECIAL_DAY_DISCOUNT}?${params}`,
          method: HttpMethod.POST,
        },
        {
          onSuccess: () => {
            toast.success("Özel gün indirimi başarıyla oluşturuldu");
            queryClient.invalidateQueries({ queryKey: [QueryKeys.DISCOUNTS] });
          },
        }
      );
    } catch (error) {
      toast.error("Özel gün indirimi oluşturulurken bir hata oluştu");
    }
  };

  return { createSpecialDayDiscount, isPending };
};
