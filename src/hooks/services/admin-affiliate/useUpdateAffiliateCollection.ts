// src/hooks/services/admin-affiliate/useUpdateAffiliateCollection.ts
import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import {
  UPDATE_CATEGORY_BASED_COLLECTION,
  UPDATE_COLLECTION_BASED_COLLECTION,
  UPDATE_COMBINATION_BASED_COLLECTION,
  UPDATE_PRODUCT_BASED_COLLECTION,
} from "@/constants/links";
import {
  UpdateCategoryBasedCollectionRequest,
  UpdateCollectionBasedCollectionRequest,
  UpdateCombinationBasedCollectionRequest,
  UpdateProductBasedCollectionRequest,
} from "@/constants/models/affiliate/UpdateCollectionRequests";
import useMyMutation from "@/hooks/useMyMutation";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useUpdateProductBasedCollection = () => {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMyMutation<string>();

  const updateProductBasedCollection = async (
    body: UpdateProductBasedCollectionRequest
  ) => {
    await mutateAsync(
      {
        url: UPDATE_PRODUCT_BASED_COLLECTION,
        data: body,
        method: HttpMethod.PUT,
      },
      {
        onSuccess: () => {
          toast.success("Koleksiyon başarıyla güncellendi");
          queryClient.invalidateQueries({ queryKey: [QueryKeys.AFFILIATE_COLLECTION_BY_AFFILIATE_USER_ID] });
        },
        onError: (error) => {
          toast.error("Koleksiyon güncellenirken bir hata oluştu");
        }
      }
    );
  };

  return {
    updateProductBasedCollection,
    isPending,
  };
};

// Diğer koleksiyon tipleri için de aynı yapıyı kullan:
export const useUpdateCollectionBasedCollection = () => {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMyMutation<string>();

  const updateCollectionBasedCollection = async (
    body: UpdateCollectionBasedCollectionRequest
  ) => {
    try {
      await mutateAsync(
        {
          url: UPDATE_COLLECTION_BASED_COLLECTION,
          data: body,
          method: HttpMethod.PUT,
        },
        {
          onSuccess: () => {
            toast.success("Koleksiyon başarıyla güncellendi");
            queryClient.invalidateQueries({ queryKey: [QueryKeys.AFFILIATE_COLLECTION_BY_AFFILIATE_USER_ID] });
          },
        }
      );
    } catch (error) {
      toast.error("Koleksiyon güncellenirken bir hata oluştu");
    }
  };

  return {
    updateCollectionBasedCollection,
    isPending,
  };
};

export const useUpdateCombinationBasedCollection = () => {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMyMutation<string>();

  const updateCombinationBasedCollection = async (
    body: UpdateCombinationBasedCollectionRequest
  ) => {
    try {
      await mutateAsync(
        {
          url: UPDATE_COMBINATION_BASED_COLLECTION,
          data: body,
          method: HttpMethod.PUT,
        },
        {
          onSuccess: () => {
            toast.success("Koleksiyon başarıyla güncellendi");
            queryClient.invalidateQueries({ queryKey: [QueryKeys.AFFILIATE_COLLECTION_BY_AFFILIATE_USER_ID] });
          },
        }
      );
    } catch (error) {
      toast.error("Koleksiyon güncellenirken bir hata oluştu");
    }
  };

  return {
    updateCombinationBasedCollection,
    isPending,
  };
};

export const useUpdateCategoryBasedCollection = () => {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMyMutation<string>();

  const updateCategoryBasedCollection = async (
    body: UpdateCategoryBasedCollectionRequest
  ) => {
    await mutateAsync(
      {
        url: UPDATE_CATEGORY_BASED_COLLECTION,
        data: body,
        method: HttpMethod.PUT,
      },
      {
        onSuccess: () => {
          toast.success("Koleksiyon başarıyla güncellendi");
          queryClient.invalidateQueries({ queryKey: [QueryKeys.AFFILIATE_COLLECTION_BY_AFFILIATE_USER_ID] });
        },
        onError: (error) => {
          toast.error("Koleksiyon güncellenirken bir hata oluştu");
        }
      }
    );

  };

  return {
    updateCategoryBasedCollection,
    isPending,
  };
};