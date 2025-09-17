import { HttpMethod } from "@/constants/enums/HttpMethods";
import { SET_CARGO } from "@/constants/links";
import {
  SetCargoRequest,
  SetCargoResponse,
} from "@/constants/models/cargo/SetCargo";
import useMyMutation from "@/hooks/useMyMutation";

/**
 * SetCargo API endpoint'i için hook
 * Kargo oluşturma işlemi için kullanılır
 */
export const useSetCargo = () => {
  const mutation = useMyMutation<SetCargoResponse>();

  const setCargo = async (cargoData: SetCargoRequest) => {
    return mutation.mutateAsync({
      url: SET_CARGO,
      method: HttpMethod.POST,
      data: cargoData,
    });
  };

  return {
    setCargo,
    isPending: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
    data: mutation.data,
    reset: mutation.reset,
  };
};

/**
 * SetCargo hook'u için tip güvenli wrapper
 * Daha kolay kullanım için
 */
export const useCreateCargo = () => {
  const { setCargo, isPending, error, isSuccess, data, reset } = useSetCargo();

  const createCargo = (cargoData: SetCargoRequest) => {
    return setCargo(cargoData);
  };

  return {
    createCargo,
    isLoading: isPending,
    error,
    isSuccess,
    cargoData: data,
    reset,
  };
};
