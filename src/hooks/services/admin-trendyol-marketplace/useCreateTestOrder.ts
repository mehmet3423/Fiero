import { HttpMethod } from "@/constants/enums/HttpMethods";
import { CREATE_TEST_ORDER } from "@/constants/links";
import { CommandResultWithData } from "@/constants/models/CommandResult";
import { CreateTestOrderRequest, CreateTestOrderResponse } from "@/constants/models/trendyol/CreateTestOrderRequest";
import useMyMutation from "@/hooks/useMyMutation";
import toast from "react-hot-toast";

export const useCreateTestOrder = () => {
  const { mutateAsync, isPending } = useMyMutation<CommandResultWithData<CreateTestOrderResponse>>();

  const createTestOrder = async (request: CreateTestOrderRequest) => {
    try {
      const response = await mutateAsync({
        url: CREATE_TEST_ORDER,
        method: HttpMethod.POST,
        data: request,
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.data.isSucceed) {
        toast.success(response.data.message || "Test siparişi başarıyla oluşturuldu");
        return response.data;
      } else {
        toast.error(response.data.message || "Test siparişi oluşturulurken bir hata oluştu");
        throw new Error(response.data.message);
      }
    } catch (error) {
      toast.error("Test siparişi oluşturulurken bir hata oluştu");
      throw error;
    }
  };

  return {
    createTestOrder,
    isPending,
  };
};