import { QueryKeys } from "@/constants/enums/QueryKeys";
import { DELETE_CUSTOMER } from "@/constants/links";
import useMyMutation from "@/hooks/useMyMutation";
import { useQueryClient } from "@tanstack/react-query";
import { HttpMethod } from "@/constants/enums/HttpMethods";
import toast from "react-hot-toast";

interface DeleteCustomerResponse {
  isSucceed: boolean;
  message: string;
}

export const useDeleteCustomer = () => {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMyMutation<DeleteCustomerResponse>();

  const deleteCustomer = async (customerId: string) => {
    try {
      await mutateAsync(
        {
          url: `${DELETE_CUSTOMER}?customerId=${customerId}`,
          method: HttpMethod.DELETE,
        },
        {
          onSuccess: () => {
            toast.success("Müşteri başarıyla silindi");
            queryClient.invalidateQueries({
              queryKey: [QueryKeys.CUSTOMERS_LIST],
            });
          },
          onError: () => {
            toast.error("Müşteri silinirken bir hata oluştu");
          },
        }
      );
    } catch (error) {
      toast.error("Müşteri silinirken bir hata oluştu");
    }
  };

  return { deleteCustomer, isPending };
};
