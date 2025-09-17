import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import { UPDATE_PRODUCT } from "@/constants/links";
import type { UpdateDtoProduct } from "@/constants/models/DtoProduct";
import useMyMutation from "@/hooks/useMyMutation";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMyMutation<string>();

  const updateProduct = async (
    productId: string,
    product: UpdateDtoProduct
  ) => {
    try {
      // Body olarak gönderilecek veri
      const body = {
        Id: productId,
        Price: product.price,
        SellableQuantity: product.sellableQuantity,
        BarcodeNumber: product.barcodeNumber,
        StockCode: product.stockCode,
        BaseImageUrl: product.baseImageUrl,
        Title: product.title,
        Description: product.description,
        VideoUrl: product.videoUrl || "",
        IsAvailable: product.isAvailable,
        IsOutlet: product.isOutlet,
        Refundable: product.refundable,
        ContentImageUrls: product.contentImageUrls,
        Banner: product.banner,
      };

      await mutateAsync(
        {
          url: UPDATE_PRODUCT,
          method: HttpMethod.PUT,
          data: JSON.stringify(body),
          headers: {
            "Content-Type": "application/json",
          },
        },
        {
          onSuccess: () => {
            toast.success("Ürün başarıyla güncellendi");
            // ...invalidate işlemleri...
            queryClient.invalidateQueries({
              queryKey: [QueryKeys.ALL_PRODUCTS],
            });
            queryClient.invalidateQueries({
              queryKey: [QueryKeys.PRODUCT_LIST],
            });
            queryClient.invalidateQueries({
              queryKey: [QueryKeys.Products],
            });
            queryClient.invalidateQueries({
              queryKey: [QueryKeys.PRODUCT_DETAIL, productId],
            });
            queryClient.invalidateQueries({
              predicate: (query) => {
                const queryKey = query.queryKey;
                return (
                  Array.isArray(queryKey) &&
                  queryKey[0] === QueryKeys.PRODUCT_LIST &&
                  queryKey.length > 1
                );
              },
            });
          },
          onError: () => {
            toast.error("Ürün güncellenirken bir hata oluştu");
          },
        }
      );
    } catch (error) {
      toast.error("Ürün güncellenirken bir hata oluştu");
    }
  };

  return {
    updateProduct,
    isPending,
  };
};
