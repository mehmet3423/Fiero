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
          baseImageUrlEn: product.baseImageUrlEn,
          title: product.title,
          titleEn: product.titleEn,
          isOutlet: product.isOutlet,
          description: product.description,
          descriptionEn: product.descriptionEn,
          subCategoryId: product.subCategoryId,
          contentImageUrls: product.contentImageUrls,
          contentImageUrlsEn: product.contentImageUrlsEn,
          banner: product.banner || [],
          bannerEn: product.bannerEn,
          videoUrl: product.videoUrl || "",
          videoUrlEn: product.videoUrlEn,
          refundable: product.refundable,
          specificationOptionIds: product.specificationOptionIds || [],
          createSEORequest: {
            slug: product.title,
            metaTitle: product.title,
            metaDescription: product.description,
            robotsMetaTag: "qwe",
          },
          createProductOnlySpecificationRequests:
            product.createProductOnlySpecificationRequests || [],
          productInfos: product.productInfos || [],
        },
      },
      {
        onSuccess: () => {
          toast.success("Ürün başarıyla eklendi");
        },
        // onError kaldırıldı - useMyMutation zaten backend mesajını gösteriyor
      }
    );
  };

  return {
    addProduct,
    isPending,
  };
};
