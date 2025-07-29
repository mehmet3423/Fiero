import { HttpMethod } from "@/constants/enums/HttpMethods"; // HTTP metodu
import { QueryKeys } from "@/constants/enums/QueryKeys"; // Query keys
import { GET_REVIEWS } from "@/constants/links"; // API endpoint
import { DtoReview } from "@/constants/models/Review"; // Yorum tipi
import useGetData from "@/hooks/useGetData"; // useGetData hook'u
import { useEffect, useState } from "react";

export interface ReviewsResponse {
  items: DtoReview[];
  count: number;
  totalCount: number;
}

export const useGetReviews = (productId: string) => {
  const [reviews, setReviews] = useState<DtoReview[]>([]); // Yorumları tutacak state
  const [isLoading, setIsLoading] = useState<boolean>(true); // Yükleniyor durumu
  const [error, setError] = useState<string | null>(null); // Hata durumu

  // useGetData hook'unu kullanarak veri çekme
  const {
    data,
    isLoading: dataLoading,
    error: dataError,
  } = useGetData<ReviewsResponse>({
    url: productId ? `${GET_REVIEWS}?ProductId=${productId}` : undefined,
    queryKey: [QueryKeys.REVIEWS, productId],
    method: HttpMethod.GET,
    enabled: !!productId,
  });

  // Data değiştiğinde reviews state'ini güncelle
  useEffect(() => {
    if (data?.items) {
      setReviews(
        data.items.map((review: DtoReview) => ({
          ...review,
          writerName: review.customerName || "Anonim",
        }))
      );
    }
  }, [data]);

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
  };
};
