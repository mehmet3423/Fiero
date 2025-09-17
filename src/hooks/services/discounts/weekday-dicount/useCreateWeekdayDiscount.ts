import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import { CREATE_WEEKDAY_DISCOUNT } from "@/constants/links";
import { WeekdayDiscount } from "@/constants/models/Discount";
import useMyMutation from "@/hooks/useMyMutation";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useCreateWeekdayDiscount = () => {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMyMutation<WeekdayDiscount>();

  const createWeekdayDiscount = async (
    data: Omit<WeekdayDiscount, "id" | "createdOn" | "createdOnValue">
  ) => {
    try {
      const params = new URLSearchParams(
        Object.entries({
          DayOfWeek: data.dayOfWeek.toString(),
          Name: data.name,
          Description: data.description || "",
          DiscountValue: data.discountValue.toString(),
          DiscountValueType: data.discountValueType.toString(),
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
          url: `${CREATE_WEEKDAY_DISCOUNT}?${params}`,
          method: HttpMethod.POST,
        },
        {
          onSuccess: () => {
            toast.success("Haftanın günü indirimi başarıyla oluşturuldu");
            queryClient.invalidateQueries({ queryKey: [QueryKeys.DISCOUNTS] });
          },
        }
      );
    } catch (error) {
      toast.error("Haftanın günü indirimi oluşturulurken bir hata oluştu");
    }
  };

  return { createWeekdayDiscount, isPending };
};
