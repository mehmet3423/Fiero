import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import { CREATE_PRODUCT_SPECIFICATION } from "@/constants/links";
import { ProductSpecification } from "@/constants/models/ProductSpecification";
import useMyMutation from "@/hooks/useMyMutation";
import { useQueryClient } from "@tanstack/react-query";

export const useAddProductSpecification = () => {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMyMutation<ProductSpecification>();

  const addProductSpecification = async (
    productId: string,
    name: string,
    value: string
  ) => {
    const params = new URLSearchParams({
      ProductId: productId,
      Name: name,
      Value: value,
    }).toString();

    await mutateAsync(
      {
        url: `${CREATE_PRODUCT_SPECIFICATION}?${params}`,
        method: HttpMethod.POST,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: [QueryKeys.PRODUCT_SPECIFICATIONS_LIST],
          });
        },
      }
    );
  };

  return { addProductSpecification, isPending };
};
