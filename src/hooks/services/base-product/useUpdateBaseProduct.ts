import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import { UPDATE_BASE_PRODUCT } from "@/constants/links";
import {
  BaseProductDetailResponse,
  UpdateBaseProductRequest,
} from "@/constants/models/Product";
import useMyMutation from "@/hooks/useMyMutation";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useUpdateBaseProduct = () => {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } =
    useMyMutation<BaseProductDetailResponse>();

  const updateBaseProduct = async (payload: UpdateBaseProductRequest) => {
    try {
      await mutateAsync(
        {
          url: UPDATE_BASE_PRODUCT,
          method: HttpMethod.PUT,
          data: payload,
        },
        {
          onSuccess: () => {
            toast.success("Base product başarıyla güncellendi");
            queryClient.invalidateQueries({
              queryKey: [QueryKeys.BASE_PRODUCT_BY_ID, payload.id],
            });
            queryClient.invalidateQueries({
              queryKey: [QueryKeys.BASE_PRODUCTS],
            });
            queryClient.invalidateQueries({
              queryKey: [QueryKeys.BASE_PRODUCT_VARIANTS, payload.id],
            });
            queryClient.invalidateQueries({
              queryKey: [QueryKeys.BASIC_PRODUCT_LIST],
            });
          },
          onError: () => {
            toast.error("Base product güncellenirken bir hata oluştu");
          },
        }
      );
    } catch (error) {
      throw error;
    }
  };

  return {
    updateBaseProduct,
    isPending,
  };
};

