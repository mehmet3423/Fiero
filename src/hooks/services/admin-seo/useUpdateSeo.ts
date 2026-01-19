import { HttpMethod } from "@/constants/enums/HttpMethods";
import { UPDATE_SEO } from "@/constants/links";
import useMyMutation from "@/hooks/useMyMutation";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

interface UpdateSeoParams {
  id: string;
  title?: string;
  description?: string;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string;
  titleEn?: string;
  descriptionEn?: string;
  metaTitleEn?: string;
  metaDescriptionEn?: string;
  keywordsEn?: string;
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
          showErrorToast: false, // Disable automatic toast, we'll handle it manually
        },
        {
          onSuccess: () => {
            toast.success("SEO başarıyla güncellendi");
          },
        }
      );
    } catch (error) {
      // Extract error message from backend response
      const axiosError = error as AxiosError<any>;
      let errorMessage = "SEO güncellenirken bir hata oluştu.";
      
      if (axiosError?.response?.data) {
        if (Array.isArray(axiosError.response.data)) {
          errorMessage = axiosError.response.data.join(" | ");
        } else if (
          typeof axiosError.response.data === "object" &&
          axiosError.response.data.message
        ) {
          errorMessage = axiosError.response.data.message;
        } else if (
          typeof axiosError.response.data === "object" &&
          axiosError.response.data.detail
        ) {
          errorMessage = axiosError.response.data.detail;
        } else if (typeof axiosError.response.data === "string") {
          errorMessage = axiosError.response.data;
        }
      } else if (axiosError?.message) {
        errorMessage = axiosError.message;
      }
      
      // Re-throw error with message so the component can handle it
      const errorWithMessage = new Error(errorMessage);
      (errorWithMessage as any).response = axiosError?.response;
      throw errorWithMessage;
    }
  };

  return {
    updateSeo,
    isPending,
  };
};
