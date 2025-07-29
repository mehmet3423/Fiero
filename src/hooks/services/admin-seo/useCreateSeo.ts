import { HttpMethod } from "@/constants/enums/HttpMethods";
import { CREATE_SEO } from "@/constants/links";
import useMyMutation from "@/hooks/useMyMutation";
import toast from "react-hot-toast";

interface CreateSeoParams {
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

export const useCreateSeo = () => {
  const { mutateAsync, isPending } = useMyMutation<string>();

  const createSeo = async (params: CreateSeoParams) => {
    try {
      await mutateAsync(
        {
          url: CREATE_SEO,
          method: HttpMethod.POST,
          data: params,
          headers: {
            "Content-Type": "application/json",
          },
        },
        {
          onSuccess: () => {
            toast.success("SEO başarıyla oluşturuldu");
          },
        }
      );
    } catch (error) {
      toast.error("SEO oluşturulurken bir hata oluştu");
    }
  };

  return {
    createSeo,
    isPending,
  };
};
