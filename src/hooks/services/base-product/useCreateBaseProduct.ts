import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import { CREATE_BASE_PRODUCT } from "@/constants/links";
import {
  BaseProductDetailResponse,
  CreateBaseProductRequest,
} from "@/constants/models/Product";
import useMyMutation from "@/hooks/useMyMutation";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useCreateBaseProduct = () => {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMyMutation<BaseProductDetailResponse>();

  const createBaseProduct = async (payload: CreateBaseProductRequest) => {
    await mutateAsync(
      {
        url: CREATE_BASE_PRODUCT,
        method: HttpMethod.POST,
        data: payload,
      },
      {
        onSuccess: () => {
          toast.success("Base product başarıyla oluşturuldu");
          queryClient.invalidateQueries({
            queryKey: [QueryKeys.BASE_PRODUCTS],
          });
          queryClient.invalidateQueries({
            queryKey: [QueryKeys.BASIC_PRODUCT_LIST],
          });
        },
        // onError kaldırıldı - useMyMutation zaten backend mesajını gösteriyor
      }
    );
  };

  return {
    createBaseProduct,
    isPending,
  };
};
