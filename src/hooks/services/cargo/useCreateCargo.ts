import { HttpMethod } from "@/constants/enums/HttpMethods";
import { CREATE_CARGO } from "@/constants/links";
import {
  CreateCargoRequest,
  CreateCargoResponse,
} from "@/constants/models/cargo/CreateCargo";
import useMyMutation from "@/hooks/useMyMutation";

/**
 * CreateCargo API endpoint'i için hook
 * Sipariş kargo oluşturma işlemi için kullanılır
 */
export const useCreateCargo = () => {
  const mutation = useMyMutation<CreateCargoResponse>();

  const createCargo = async (cargoData: CreateCargoRequest) => {
    return mutation.mutateAsync({
      url: CREATE_CARGO,
      method: HttpMethod.POST,
      data: cargoData,
    });
  };

  return {
    createCargo,
    isPending: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
    data: mutation.data,
    reset: mutation.reset,
  };
};

/**
 * CreateCargo hook'u için tip güvenli wrapper
 * Daha kolay kullanım için
 */
export const useCreateOrderCargo = () => {
  const { createCargo, isPending, error, isSuccess, data, reset } =
    useCreateCargo();

  const createOrderCargo = (cargoData: CreateCargoRequest) => {
    return createCargo(cargoData);
  };

  return {
    createOrderCargo,
    isLoading: isPending,
    error,
    isSuccess,
    cargoData: data,
    reset,
  };
};
