import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import { CREATE_TIME_OF_DAY_DISCOUNT } from "@/constants/links";
import { TimeOfDayDiscount } from "@/constants/models/Discount";
import useMyMutation from "@/hooks/useMyMutation";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useCreateTimeOfDayDiscount = () => {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMyMutation<TimeOfDayDiscount>();

  const createTimeOfDayDiscount = async (
    data: Omit<TimeOfDayDiscount, "id" | "createdOn" | "createdOnValue"> & {
      startTime: string;
      endTime: string;
    }
  ) => {
    try {
      // StartTime ve EndTime object'lerini ticks ile gönderiyoruz
      const params = new URLSearchParams();

      // StartTime ve EndTime string formatında gönder (HH:mm:ss)
      params.append("StartTime", data.startTime);
      params.append("EndTime", data.endTime);

      // Diğer parametreler
      params.append("Name", data.name);
      params.append("Description", data.description || "");
      params.append("DiscountValue", data.discountValue.toString());
      params.append("DiscountValueType", data.discountValueType.toString());
      params.append(
        "MaxDiscountValue",
        data.maxDiscountValue?.toString() || "0"
      );
      params.append("StartDate", data.startDate);
      params.append("EndDate", data.endDate);
      params.append("IsActive", data.isActive.toString());

      // Notification Settings
      params.append(
        "IsEmailNotificationEnabled",
        data.notificationSettings?.isEmailNotificationEnabled?.toString() ||
          "false"
      );
      params.append(
        "EmailNotificationSubject",
        data.notificationSettings?.emailNotificationSubject || ""
      );
      params.append(
        "EmailNotificationTextBody",
        data.notificationSettings?.emailNotificationTextBody || ""
      );
      params.append(
        "EmailNotificationHtmlBody",
        data.notificationSettings?.emailNotificationHtmlBody || ""
      );
      params.append(
        "IsSMSNotificationEnabled",
        data.notificationSettings?.isSMSNotificationEnabled?.toString() ||
          "false"
      );
      params.append(
        "SMSNotificationSubject",
        data.notificationSettings?.smsNotificationSubject || ""
      );
      params.append(
        "SMSNotificationTextBody",
        data.notificationSettings?.smsNotificationTextBody || ""
      );
      params.append(
        "SMSNotificationHtmlBody",
        data.notificationSettings?.smsNotificationHtmlBody || ""
      );

      await mutateAsync(
        {
          url: `${CREATE_TIME_OF_DAY_DISCOUNT}?${params.toString()}`,
          method: HttpMethod.POST,
        },
        {
          onSuccess: () => {
            toast.success("Saat aralığı indirimi başarıyla oluşturuldu");
            queryClient.invalidateQueries({ queryKey: [QueryKeys.DISCOUNTS] });
          },
        }
      );
    } catch (error) {
      toast.error("Saat aralığı indirimi oluşturulurken bir hata oluştu");
    }
  };

  return { createTimeOfDayDiscount, isPending };
};
