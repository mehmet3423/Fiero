import { HttpMethod } from "@/constants/enums/HttpMethods";
import { getToken } from "@/helpers/tokenUtils";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import axios, { AxiosError, AxiosResponse } from "axios";
import toast from "react-hot-toast";

interface MutationOptions {
  url: string;
  method: HttpMethod;
  data?: any;
  headers?: object;
  showErrorToast?: boolean; // Add option to disable automatic error toast
}

interface ErrorModel {
  error: string;
  message: string;
  statusCode: number;
  detail: string;
}

export default function useMyMutation<T>() {
  const token = getToken();
  const mutation: UseMutationResult<
    AxiosResponse<T>,
    AxiosError<ErrorModel>,
    MutationOptions
  > = useMutation({
    mutationFn: (options: MutationOptions) => {
      return axios({
        url: options.url,
        method: options.method,
        headers: token
          ? {
            Authorization: `Bearer ${token}`,
            ...options.headers,
          }
          : { ...options.headers },
        data: options.data,
      });
    },
    onError: (error, variables) => {
      // Only show automatic error toast if not disabled
      if (variables.showErrorToast !== false) {
        const errorMessage = error.response?.data.message || error.response?.data.detail;
        if (errorMessage) {
          toast.error(errorMessage);
        }
      }
    },
  });

  return mutation;
}
