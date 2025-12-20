import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import { GET_CUSTOMERS_LIST } from "@/constants/links";
import {
  CustomerListResponse,
  CustomerListRequest,
} from "@/constants/models/customers/customer";
import useGetData from "@/hooks/useGetData";

export const useGetCustomersList = (options: CustomerListRequest = {}) => {
  const requestBody = {
    page: options.page ?? 1,
    pageSize: options.pageSize ?? 20,
    from: options.from ?? 0,
  };

  const { data, isLoading, error, refetch } =
    useGetData<CustomerListResponse>({
      url: GET_CUSTOMERS_LIST,
      method: HttpMethod.GET,
      data: requestBody,
      queryKey: [
        QueryKeys.CUSTOMERS_LIST,
        options.page?.toString(),
        options.pageSize?.toString(),
      ],
      enabled: true,
    });

  return { data, isLoading, error, refetch };
};
