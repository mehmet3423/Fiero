import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import { GET_CUSTOMERS_LIST } from "@/constants/links";
import {
  CustomerListResponse,
  CustomerListRequest,
} from "@/constants/models/customers/customer";
import useGetData from "@/hooks/useGetData";

export const useGetCustomersList = (options: CustomerListRequest = {}) => {
  // Query parametreleri oluştur
  const queryParams = new URLSearchParams();

  queryParams.append(
    "Page",
    (options.page !== undefined ? options.page : 1).toString()
  );
  queryParams.append(
    "PageSize",
    (options.pageSize !== undefined ? options.pageSize : 20).toString()
  );
  queryParams.append(
    "From",
    (options.from !== undefined ? options.from : 0).toString()
  );

  if (options.search) {
    queryParams.append("Search", options.search);
  }

  if (options.registerDate) {
    queryParams.append(
      "RegisterDate",
      new Date(options.registerDate + "T00:00:00.000Z").toISOString()
    );
  }

  if (options.registerDateTo) {
    queryParams.append(
      "RegisterDateTo",
      new Date(options.registerDateTo + "T23:59:59.999Z").toISOString()
    );
  }

  const finalUrl = `${GET_CUSTOMERS_LIST}?${queryParams.toString()}`;

  const { data, isLoading, error, refetch } = useGetData<CustomerListResponse>({
    url: finalUrl,
    queryKey: [
      QueryKeys.CUSTOMERS_LIST,
      options.search,
      options.registerDate,
      options.registerDateTo,
      options.page?.toString(),
      options.pageSize?.toString(),
      options.from?.toString(),
    ],
    method: HttpMethod.GET,
    enabled: true,
  });

  return {
    data,
    isLoading,
    error,
    refetch,
  };
};
