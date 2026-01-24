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
  errors?: Record<string, string[]>; // Validation errors from backend
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
        const errorData = error.response?.data;
        let errorMessage = "";
        
        // Check for validation errors object (ASP.NET Core validation format)
        if (errorData?.errors && typeof errorData.errors === "object") {
          const errorMessages: string[] = [];
          Object.values(errorData.errors).forEach((fieldErrors) => {
            if (Array.isArray(fieldErrors)) {
              errorMessages.push(...fieldErrors);
            } else if (typeof fieldErrors === "string") {
              errorMessages.push(fieldErrors);
            }
          });
          // Tüm hataları birleştir ve göster
          if (errorMessages.length > 0) {
            // Eğer tek hata varsa direkt göster, birden fazla varsa birleştir
            if (errorMessages.length === 1) {
              toast.error(errorMessages[0]);
            } else {
              // Birden fazla hata varsa her birini ayrı toast olarak göster
              errorMessages.forEach((msg) => {
                toast.error(msg, { duration: 4000 });
              });
            }
            return; // Validation hataları gösterildi, return et
          }
        }
        
        // Fallback to detail or message
        if (!errorMessage) {
          errorMessage = errorData?.detail || errorData?.message;
        }
        
        if (errorMessage) {
          toast.error(errorMessage);
        }
      }
    },
  });

  return mutation;
}
