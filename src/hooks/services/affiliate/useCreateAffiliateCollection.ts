import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import {
  CREATE_AFFILIATE_COLLECTION,
  CREATE_COMBINATION_BASED_COLLECTION,
  CREATE_CATEGORY_BASED_COLLECTION,
  CREATE_PRODUCT_BASED_COLLECTION,
  CREATE_COLLECTION_BASED_COLLECTION,
} from "@/constants/links";
import { CreateCollectionRequest } from "@/constants/models/Affiliate";
import { AffiliateCollectionType } from "@/constants/enums/affiliate/AffiliateApplicationStatus";
import useMyMutation from "@/hooks/useMyMutation";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useCreateAffiliateCollection = () => {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMyMutation<string>();

  const getEndpointByType = (type: AffiliateCollectionType): string => {
    switch (type) {
      case AffiliateCollectionType.Product:
        return CREATE_PRODUCT_BASED_COLLECTION;
      case AffiliateCollectionType.Collection:
        return CREATE_COLLECTION_BASED_COLLECTION;
      case AffiliateCollectionType.Combination:
        return CREATE_COMBINATION_BASED_COLLECTION;
      case AffiliateCollectionType.Category:
        return CREATE_CATEGORY_BASED_COLLECTION;
      default:
        return CREATE_AFFILIATE_COLLECTION;
    }
  };

  const createCollection = async (
    collectionData: CreateCollectionRequest,
    collectionType: AffiliateCollectionType = AffiliateCollectionType.Product
  ) => {
    try {
      const endpoint = getEndpointByType(collectionType);

      await mutateAsync(
        {
          url: endpoint,
          data: collectionData,
          method: HttpMethod.POST,
        },
        {
          onSuccess: () => {
            toast.success("Koleksiyon başarıyla oluşturuldu!");
            queryClient.invalidateQueries({
              queryKey: [QueryKeys.AFFILIATE_COLLECTIONS],
            });
          },
          onError: (error: any) => {
            toast.error(
              "Koleksiyon oluşturulurken bir hata oluştu. Lütfen tekrar deneyin."
            );
          },
        }
      );
    } catch (error) {
      throw error;
    }
  };

  return {
    createCollection,
    isPending,
  };
};
