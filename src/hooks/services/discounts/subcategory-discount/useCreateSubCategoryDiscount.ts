import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import { CREATE_SUBCATEGORY_DISCOUNT } from "@/constants/links";
import { SubCategoryDiscount } from "@/constants/models/Discount";
import useMyMutation from "@/hooks/useMyMutation";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useCreateSubCategoryDiscount = () => {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMyMutation<SubCategoryDiscount>();

  const createSubCategoryDiscount = async (
    data: Omit<SubCategoryDiscount, "id" | "createdOn" | "createdOnValue">
  ) => {
    try {
      const params = new URLSearchParams(
        Object.entries({
          SubCategoryId: data.subCategoryId || "",
          Name: data.name,
          Description: data.description,
          DiscountValue: data.discountValue.toString(),
          DiscountValueType: data.discountValueType.toString(),
          MaxDiscountValue: data.maxDiscountValue?.toString() || "0",
          StartDate: data.startDate,
          EndDate: data.endDate,
          IsActive: data.isActive.toString(),
          Type: data.type.toString(),
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
          url: `${CREATE_SUBCATEGORY_DISCOUNT}?${params}`,
          method: HttpMethod.POST,
        },
        {
          onSuccess: () => {
            toast.success("Alt kategori indirimi başarıyla oluşturuldu");
            queryClient.invalidateQueries({ queryKey: [QueryKeys.DISCOUNTS] });
          },
        }
      );
    } catch (error) {
      toast.error("Alt kategori indirimi oluşturulurken bir hata oluştu");
    }
  };

  return { createSubCategoryDiscount, isPending };
};
