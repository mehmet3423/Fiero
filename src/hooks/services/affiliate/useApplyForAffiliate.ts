import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import { APPLY_FOR_AFFILIATE } from "@/constants/links";
import { AffiliateApplicationRequest } from "@/constants/models/Affiliate";
import useMyMutation from "@/hooks/useMyMutation";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useApplyForAffiliate = () => {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMyMutation<string>();


  const applyForAffiliate = async (
    applicationData: AffiliateApplicationRequest
  ) => {
    try {
      await mutateAsync(
        {
          url: APPLY_FOR_AFFILIATE,
          data: applicationData,
          method: HttpMethod.POST,
        },
        {
          onSuccess: () => {
            toast.success(
              "Affiliate başvurunuz başarıyla gönderildi! Başvurunuz inceleniyor."
            );
            queryClient.invalidateQueries({
              queryKey: [QueryKeys.MY_AFFILIATE_USER],
            });
            queryClient.invalidateQueries({
              queryKey: [QueryKeys.USER_PAYMENT_CARD_LIST],
            });
          },
          onError: (error: any) => {
          },
        }
      );
    } catch (error) {
      throw error;
    }
  };

  return {
    applyForAffiliate,
    isPending,
  };
};
