import { HttpMethod } from "@/constants/enums/HttpMethods";
import { ADD_PRODUCT } from "@/constants/links";
import { DtoProduct } from "@/constants/models/DtoProduct";
import useMyMutation from "@/hooks/useMyMutation";
import toast from "react-hot-toast";

export const useAddProduct = () => {
  const { mutateAsync, isPending } = useMyMutation<string>();

  const addProduct = async (
    product: DtoProduct & {
      specificationOptionIds?: string[];
    }
  ) => {
    try {
      await mutateAsync(
        {
          url: ADD_PRODUCT,
          method: HttpMethod.POST,
          data: {
            price: product.price,
            sellableQuantity: product.sellableQuantity,
            isAvailable: product.isAvailable,
            barcodeNumber: product.barcodeNumber,
            baseImageUrl: product.baseImageUrl,
            title: product.title,
            isOutlet: product.isOutlet,
            description: product.description,
            subCategoryId: product.subCategoryId,
            contentImageUrls: product.contentImageUrls,
            banner: product.banner || [],
            videoUrl: product.videoUrl || "",
            refundable: product.refundable,
            specificationOptionIds: product.specificationOptionIds || [],
            createSEORequest: {
              Slug: product.title,
              MetaTitle: product.title,
              MetaDescription: product.description,
              RobotsMetaTag: "qwe",
            },
            createProductOnlySpecificationRequests:
              product.createProductOnlySpecificationRequests || [],
          },
        },
        {
          onSuccess: () => {
            toast.success("Ürün başarıyla eklendi");
          },
          onError: () => {
            toast.error("Ürün eklenirken bir hata oluştu");
          },
        }
      );
    } catch (error) {
      console.error("Add product error:", error);
      toast.error("Ürün eklenirken bir hata oluştu");
    }
  };

  return {
    addProduct,
    isPending,
  };
};
