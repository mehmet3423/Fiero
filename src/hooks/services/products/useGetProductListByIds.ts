import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import { GET_PRODUCT_LIST_BY_IDS } from "@/constants/links";
import { Product } from "@/constants/models/Product";
import { CommandResultWithData } from "@/constants/models/CommandResult";
import useGetData from "@/hooks/useGetData";

export function useGetProductListByIds(productIds: string[]) {
  // Hook'lar her zaman aynı sırada çağrılmalı - koşullu return yapılamaz
  // enabled prop'u ile kontrol et
  const hasProductIds = productIds && productIds.length > 0;
  
  const { data, isLoading, error } = useGetData<CommandResultWithData<Product | Product[]>>({
    url: GET_PRODUCT_LIST_BY_IDS,
    queryKey: [QueryKeys.PRODUCT_LIST_BY_IDS, productIds?.join(",") || ""],
    method: HttpMethod.POST,
    data: {
      productIds: productIds || [],
    },
    enabled: hasProductIds,
    onError: (err) => {
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

  // Her zaman aynı şekilde return yap (hook sırası değişmemeli)
  return {
    products: hasProductIds ? products : [],
    isLoading: hasProductIds ? isLoading : false,
    error: hasProductIds ? error : null,
  };
}
