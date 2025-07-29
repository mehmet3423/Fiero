import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import { GET_SUPPORT_TICKETS } from "@/constants/links";
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
      url: customerId ? GET_SUPPORT_TICKETS : undefined,
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
    tickets: data?.items || [],
    totalCount: data?.count || 0,
    totalPages: data?.pages || 0,
    hasNext: data?.hasNext || false,
    hasPrevious: data?.hasPrevious || false,
    isLoading,
    error,
    refetch,
  };
};
