import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import { CREATE_PRODUCT_DISCOUNT } from "@/constants/links";
import { ProductDiscount } from "@/constants/models/Discount";
import useMyMutation from "@/hooks/useMyMutation";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useCreateProductDiscount = () => {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMyMutation<ProductDiscount>();

  const createProductDiscount = async (
    data: Omit<ProductDiscount, "id" | "createdOn" | "createdOnValue">
  ) => {
    try {
      const params = new URLSearchParams(
        Object.entries({
          ProductId: data.productId || "",
          Name: data.name,
          Description: data.description,
          DiscountValue: data.discountValue.toString(),
          DiscountValueType: data.discountValueType.toString(),
          MaxDiscountValue: data.maxDiscountValue?.toString() || "0",
          StartDate: data.startDate,
          EndDate: data.endDate,
          IsActive: data.isActive.toString(),
          Type: data.type.toString(),
        } as Record<string, string>)
      ).toString();

      await mutateAsync(
        {
          url: `${CREATE_PRODUCT_DISCOUNT}?${params}`,
          method: HttpMethod.POST,
        },
        {
          onSuccess: () => {
            toast.success("Ürün indirimi başarıyla oluşturuldu");
            queryClient.invalidateQueries({
              queryKey: [QueryKeys.PRODUCT_DISCOUNTS],
            });
          },
        }
      );
    } catch (error) {
      toast.error("Ürün indirimi oluşturulurken bir hata oluştu");
    }
  };

  return { createProductDiscount, isPending };
};
