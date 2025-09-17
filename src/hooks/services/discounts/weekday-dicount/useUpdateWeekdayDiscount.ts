import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import { UPDATE_WEEKDAY_DISCOUNT } from "@/constants/links";
import { WeekdayDiscount } from "@/constants/models/Discount";
import useMyMutation from "@/hooks/useMyMutation";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useUpdateWeekdayDiscount = () => {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMyMutation<WeekdayDiscount>();

  const updateDiscount = async (data: WeekdayDiscount) => {
    const requestBody = {
      id: data.id,
      name: data.name,
      description: data.description,
      discountValue: data.discountValue,
      discountValueType: data.discountValueType,
      maxDiscountValue: data.maxDiscountValue,
      startDate: data.startDate,
      endDate: data.endDate,
      isActive: data.isActive,
      dayOfWeek: data.dayOfWeek,
    };

    await mutateAsync(
      {
        url: UPDATE_WEEKDAY_DISCOUNT,
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
