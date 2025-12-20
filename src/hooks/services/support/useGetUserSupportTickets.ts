import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import { GET_SUPPORT_TICKETS_BY_CUSTOMER_ID } from "@/constants/links";
import { SupportTicketResponse } from "@/constants/models/SupportTicket";
import useGetData from "@/hooks/useGetData";

interface UseGetUserSupportTicketsProps {
  customerId?: string;
  page?: number;
  pageSize?: number;
  from?: string;
}

export const useGetUserSupportTickets = ({
  customerId,
  page = 0,
  pageSize = 10,
  from,
}: UseGetUserSupportTicketsProps) => {
  const params = {
    CustomerId: customerId,
    Page: page,
    PageSize: pageSize,
    ...(from && { From: from }),
  };

  const { data, isLoading, error, refetch } = useGetData<SupportTicketResponse>(
    {
      url: customerId ? GET_SUPPORT_TICKETS_BY_CUSTOMER_ID : undefined,
      params,
      queryKey: [
        QueryKeys.USER_SUPPORT_TICKETS,
        customerId,
        String(page),
        String(pageSize),
        from,
      ],
      method: HttpMethod.GET,
      enabled: !!customerId,
    }
  );

  return {
    // Some endpoints may return items at root or under data.items
    tickets: data?.items || data?.data?.items || [],
    totalCount: data?.count || 0,
    totalPages: data?.pages || 0,
    hasNext: data?.hasNext || false,
    hasPrevious: data?.hasPrevious || false,
    isLoading,
    error,
    refetch,
  };
};
