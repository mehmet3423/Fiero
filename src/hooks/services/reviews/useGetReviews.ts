import { HttpMethod } from "@/constants/enums/HttpMethods"; // HTTP metodu
import { QueryKeys } from "@/constants/enums/QueryKeys"; // Query keys
import { GET_REVIEWS } from "@/constants/links"; // API endpoint
import { DtoReview } from "@/constants/models/Review"; // Yorum tipi
import { CommandResultWithData } from "@/constants/models/CommandResult";
import useGetData from "@/hooks/useGetData"; // useGetData hook'u
import { useEffect, useState } from "react";

export interface ReviewsResponse {
  items: DtoReview[];
  count: number;
  totalCount: number;
}

interface UseGetReviewsParams {
  productId?: string;
  targetRatings?: number[];
  isDeleted?: boolean;
  search?: string;
  page?: number;
  pageSize?: number;
  from?: number;
}

export const useGetReviews = (params: UseGetReviewsParams = {}) => {
  const [reviews, setReviews] = useState<DtoReview[]>([]); // Yorumları tutacak state
  const [isLoading, setIsLoading] = useState<boolean>(true); // Yükleniyor durumu
  const [error, setError] = useState<string | null>(null); // Hata durumu

  // URL parametrelerini oluştur
  const queryParams = new URLSearchParams();

  if (params.productId) {
    queryParams.append("ProductId", params.productId);
  }
  if (params.targetRatings && params.targetRatings.length > 0) {
    // Her rating için ayrı ayrı gönder (tam eşleşme için)
    params.targetRatings.forEach((rating) => {
      queryParams.append("TargetRatings", rating.toString());
    });
  }
  if (params.isDeleted !== undefined) {
    queryParams.append("IsDeleted", params.isDeleted.toString());
  }
  if (params.search) {
    queryParams.append("Search", params.search);
  }
  if (params.page !== undefined) {
    queryParams.append("Page", params.page.toString());
  }
  if (params.pageSize !== undefined) {
    queryParams.append("PageSize", params.pageSize.toString());
  }
  if (params.from !== undefined) {
    queryParams.append("From", params.from.toString());
  }

  const queryString = queryParams.toString();
  const url = queryString ? `${GET_REVIEWS}?${queryString}` : GET_REVIEWS;

  // useGetData hook'unu kullanarak veri çekme
  const {
    data,
    isLoading: dataLoading,
    error: dataError,
  } = useGetData<CommandResultWithData<ReviewsResponse>>({
    url,
    queryKey: [
      QueryKeys.REVIEWS,
      params.productId,
      params.targetRatings?.join(","),
      params.isDeleted?.toString(),
      params.search,
      params.page?.toString(),
      params.pageSize?.toString(),
      params.from?.toString(),
    ],
    method: HttpMethod.GET,
    enabled: !!params.productId,
    onError: (err) => {
      // Yorum listesi alınamadığında toast error mesajı gösterilmez
    },
  });

  // Data değiştiğinde reviews state'ini güncelle
  useEffect(() => {
    if (data?.isSucceed && data?.data?.items) {
      let filteredReviews = data.data.items.map((review: DtoReview) => ({
        ...review,
        writerName: review.customerName || "Anonim",
      }));

      // Eğer targetRatings varsa, tam eşleşme için ek filtreleme yap
      if (params.targetRatings && params.targetRatings.length > 0) {
        filteredReviews = filteredReviews.filter((review: DtoReview) =>
          params.targetRatings!.includes(review.rating)
        );
      }

      setReviews(filteredReviews);
    } else if (data && !data.isSucceed && data.message) {
      // Yorum listesi alınamadığında toast error mesajı gösterilmez
      // toast.error(data.message);
    }
  }, [data, params.targetRatings]);

  // useGetData hook'unun yükleniyor ve hata durumlarını kullanarak yükleniyor ve hata durumlarını güncelle
  useEffect(() => {
    if (dataLoading) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [dataLoading]);

  useEffect(() => {
    if (dataError) {
      setError(dataError.message);
    }
  }, [dataError]);

  return {
    reviews,
    isLoading,
    error,
    totalCount: data?.data?.totalCount || 0,
    count: data?.data?.count || 0,
  };
};
