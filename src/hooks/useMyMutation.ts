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
          }
          : {},
        data: options.data,
      });
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data.message;
      if (!errorMessage) return;
      toast.error(error.response?.data.detail);

    },
  });

  return mutation;
}
