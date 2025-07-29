import { HttpMethod } from "@/constants/enums/HttpMethods";
import { UPDATE_SEO } from "@/constants/links";
import useMyMutation from "@/hooks/useMyMutation";
import toast from "react-hot-toast";

interface UpdateSeoParams {
  id: string;
  title?: string;
  description?: string;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string;
  canonical?: string;
  robotsMetaTag?: string;
  author?: string;
  publisher?: string;
  language?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImageUrl?: string;
  structuredDataJson?: string;
  isIndexed?: boolean;
  isFollowed?: boolean;
  productId?: string;
  mainCategoryId?: string;
  subCategoryId?: string;
}

export const useUpdateSeo = () => {
  const { mutateAsync, isPending } = useMyMutation<string>();

  const updateSeo = async (params: UpdateSeoParams) => {
    try {
      await mutateAsync(
        {
          url: UPDATE_SEO,
          method: HttpMethod.PUT,
          data: params,
          headers: {
            "Content-Type": "application/json",
          },
        },
        {
          onSuccess: () => {
            toast.success("SEO başarıyla güncellendi");
          },
        }
      );
    } catch (error) {
      toast.error("SEO güncellenirken bir hata oluştu");
    }
  };

  return {
    updateSeo,
    isPending,
  };
};
