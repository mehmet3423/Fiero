import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import { UPDATE_CUSTOMER } from "@/constants/links";
import { UpdateCustomerRequest } from "@/constants/models/customers/customer";
import useMyMutation from "@/hooks/useMyMutation";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMyMutation<any>();

  const updateCustomer = async (data: UpdateCustomerRequest) => {
    const requestBody = {
      id: data.id,
      firstName: data.firstName || "",
      lastName: data.lastName || "",
      email: data.email || "",
      phoneNumber: data.phoneNumber || "",
      birthDate: data.birthDate || "",
      isEmailNotificationEnabled: data.isEmailNotificationEnabled ?? false,
      isSMSNotificationEnabled: data.isSMSNotificationEnabled ?? false,
      gender: data.gender || 0,
    };

    try {
      await mutateAsync(
        {
          url: UPDATE_CUSTOMER,
          method: HttpMethod.PUT,
          data: requestBody,
        },
        {
          onSuccess: () => {
            toast.success("Müşteri bilgileri başarıyla güncellendi");
            queryClient.invalidateQueries({
              queryKey: [QueryKeys.CUSTOMERS_LIST],
            });
          },
          onError: () => {
            toast.error("Müşteri güncellenirken bir hata oluştu");
          },
        }
      );
    } catch (error) {
      toast.error("Müşteri güncellenirken bir hata oluştu");
    }
  };

  return { updateCustomer, isPending };
};
