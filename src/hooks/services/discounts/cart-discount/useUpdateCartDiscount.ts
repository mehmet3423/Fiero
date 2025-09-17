import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import { UPDATE_CART_DISCOUNT } from "@/constants/links";
import { CartDiscount } from "@/constants/models/Discount";
import useMyMutation from "@/hooks/useMyMutation";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useUpdateCartDiscount = () => {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMyMutation<CartDiscount>();

  const updateDiscount = async (data: CartDiscount) => {
    await mutateAsync(
      {
        url: `${UPDATE_CART_DISCOUNT}`,
        method: HttpMethod.PUT,
        data,
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
