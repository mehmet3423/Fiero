import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import { getToken, handleLogout } from "@/helpers/tokenUtils";
import {
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";

interface GetDataOptions<T> {
  url?: string;
  queryKey: QueryKeys | (QueryKeys | string | undefined)[];
  method: HttpMethod;
  enabled?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (err: any) => void;
  onSettled?: () => void;
  headers?: object;
  params?: string | object;
  data?: any;
}

export default function useGetData<T>(
  options: GetDataOptions<T>
): UseQueryResult<T> & { isFetchingData: boolean } {
  const queryClient = useQueryClient();
  const token = getToken();

  const getData = async (): Promise<T> => {

    try {
      let headers = {};
      if (token) {
        const tokenParts = token.split(".");
        if (tokenParts.length === 3) {
          const payload = JSON.parse(atob(tokenParts[1]));
          const exp = payload.exp * 1000;

          if (Date.now() >= exp) {
            handleLogout();
            toast.error("Oturum süreniz doldu. Lütfen tekrar giriş yapın.");
            return Promise.reject("Token expired");
          }
        }
        headers = { Authorization: `Bearer ${token}` };
      }

      if (options.headers) {
        headers = { ...headers, ...options.headers };
      }

      const response = await axios({
        url: options.url,
        method: options.method,
        params: options.params,
        headers,
        data: options.data,
      });

      options.onSuccess?.(response.data);
      return response.data;
    } catch (err) {
      const error = err as AxiosError;

      if (error.response?.status === 401 && token) {
        toast.error("Oturum süreniz doldu. Lütfen tekrar giriş yapın.");
        handleLogout();
      }

      options.onError?.(err);
      throw err;
    } finally {
      options.onSettled?.();
    }
  };

  const queryEnabled = Boolean(options.url) && options.enabled;

  const queryResult = useQuery({
    queryKey: Array.isArray(options.queryKey)
      ? options.queryKey
      : [options.queryKey, options.params, options.data],
    queryFn: getData,
    enabled: queryEnabled,
    retry: 0,
    staleTime: 30000,
    refetchOnWindowFocus: false,
  });

  const isFetchingData = queryEnabled ? queryResult.isLoading : false;

  return { ...queryResult, isFetchingData };
}

