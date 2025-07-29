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
      const params = new URLSearchParams();

      params.append("Id", productId);
      params.append("Price", product.price.toString());
      params.append("sellableQuantity", product.sellableQuantity.toString());
      params.append("BarcodeNumber", product.barcodeNumber);
      params.append("StockCode", product.stockCode);
      params.append("BaseImageUrl", product.baseImageUrl);
      params.append("Title", product.title);
      params.append("Description", product.description);
      params.append("VideoUrl", product.videoUrl || "");
      params.append("IsAvailable", product.isAvailable.toString());
      params.append("IsOutlet", product.isOutlet.toString());
      params.append("Refundable", product.refundable.toString());
      // Her bir content image URL'i için ayrı bir parametre ekle
      product.contentImageUrls.forEach((url) => {
        params.append("ContentImageUrls", url);
      });

      product.banner?.forEach((url) => {
        params.append("Banner", url);
      });

      await mutateAsync(
        {
          url: `${UPDATE_PRODUCT}?${params.toString()}`,
          method: HttpMethod.PUT,
        },
        {
          onSuccess: () => {
            toast.success("Ürün başarıyla güncellendi");
            // Tüm ürün listelerini invalidate et
            queryClient.invalidateQueries({
              queryKey: [QueryKeys.ALL_PRODUCTS],
            });
            // Genel ürün listesini invalidate et
            queryClient.invalidateQueries({
              queryKey: [QueryKeys.PRODUCT_LIST],
            });
            // Admin ürün listesini invalidate et
            queryClient.invalidateQueries({
              queryKey: [QueryKeys.Products],
            });
            // Güncellenecek ürünün detay bilgilerini invalidate et
            queryClient.invalidateQueries({
              queryKey: [QueryKeys.PRODUCT_DETAIL, productId],
            });

            // Kategori bazlı ürün listelerini de invalidate et - tüm kategori bazlı sorguları temizler
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
      console.error("Update product error:", error);
      toast.error("Ürün güncellenirken bir hata oluştu");
    }
  };

  return {
    updateProduct,
    isPending,
  };
};
