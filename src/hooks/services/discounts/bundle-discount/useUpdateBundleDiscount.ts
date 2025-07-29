import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import { UPDATE_BUNDLE_DISCOUNT } from "@/constants/links";
import { BundleDiscount } from "@/constants/models/Discount";
import useMyMutation from "@/hooks/useMyMutation";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useUpdateBundleDiscount = () => {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMyMutation<BundleDiscount>();

  const updateDiscount = async (data: BundleDiscount) => {
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
      productIds: data.productIds || [],
      bundlePrice: data.bundlePrice || 0,
    };

    await mutateAsync(
      {
        url: UPDATE_BUNDLE_DISCOUNT,
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
