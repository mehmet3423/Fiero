import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import { GET_PRODUCT_LIST_BY_IDS } from "@/constants/links";
import { Product } from "@/constants/models/Product";
import { CommandResultWithData } from "@/constants/models/CommandResult";
import useGetData from "@/hooks/useGetData";

export function useGetProductListByIds(productIds: string[]) {
  console.log("useGetProductListByIds called with:", productIds);

  // Her id için useGetData hookunu çağır - hook'lar her zaman aynı sırada çağrılmalı
  const { data, isLoading, error } = useGetData<
    CommandResultWithData<Product | Product[]>
  >({
    url: GET_PRODUCT_LIST_BY_IDS,
    queryKey: [QueryKeys.PRODUCT_LIST_BY_IDS, productIds.join(",")],
    method: HttpMethod.POST,
    data: {
      productIds,
    },
    enabled: productIds && productIds.length > 0, // enabled ile kontrol et, erken return yapma
    onError: (err) => {
      console.log("useGetProductListByIds error:", err);
      // Product ID'ler bulunamadığında sessizce devam et, hata mesajı gösterme
    },
  });

  // API response'u array veya tek obje olarak dönebiliyor
  // Her iki durumu da handle et
  let products: Product[] = [];

  if (data?.data) {
    if (Array.isArray(data.data)) {
      // Response zaten array
      products = data.data;
    } else {
      // Response tek obje, array'e çevir
      products = [data.data];
    }
  }

  // Product ID'ler boşsa boş array döndür ama hook'ları çağırmaya devam et
  if (!productIds || productIds.length === 0) {
    return {
      products: [],
      isLoading: false,
      error: null,
    };
  }

  return {
    products,
    isLoading,
    error,
  };
}
