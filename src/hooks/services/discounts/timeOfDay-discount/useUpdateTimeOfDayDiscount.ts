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
    const requestBody = {
      id: data.id,
      name: data.name,
      description: data.description,
      discountValue: data.discountValue,
      discountValueType: data.discountValueType,
      startDate: data.startDate,
      endDate: data.endDate,
      isActive: data.isActive,
      startTime: data.startTime,
      endTime: data.endTime,
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
        },
      }
    );
  };

  return { updateDiscount, isPending };
};
