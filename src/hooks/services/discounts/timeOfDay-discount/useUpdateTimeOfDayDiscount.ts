import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import { UPDATE_TIME_OF_DAY_DISCOUNT } from "@/constants/links";
import { TimeOfDayDiscount } from "@/constants/models/Discount";
import useMyMutation from "@/hooks/useMyMutation";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useUpdateTimeOfDayDiscount = () => {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMyMutation<TimeOfDayDiscount>();

  const updateDiscount = async (data: TimeOfDayDiscount) => {
    // Time formatını düzelt: HH:mm -> HH:mm:ss
    const formatTime = (time: string): string => {
      if (!time) return "00:00:00";
      // Eğer zaten HH:mm:ss formatındaysa olduğu gibi döndür
      if (time.split(":").length === 3) return time;
      // Eğer HH:mm formatındaysa :ss ekle
      if (time.split(":").length === 2) return `${time}:00`;
      return "00:00:00";
    };

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
      startTime: formatTime(data.startTime),
      endTime: formatTime(data.endTime),
    };

    await mutateAsync(
      {
        url: UPDATE_TIME_OF_DAY_DISCOUNT,
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
