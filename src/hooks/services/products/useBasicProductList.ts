import { HttpMethod } from '@/constants/enums/HttpMethods';
import { QueryKeys } from '@/constants/enums/QueryKeys';
import { GET_BASIC_PRODUCT_LIST } from '@/constants/links';
import useGetData from '@/hooks/useGetData';

export interface ProductResponse {
  id: string;
  externalId: number;
  title: string;
  description: string;
  price: number;
  currencyType: number;
  isAvailable: boolean;
  isOutlet: boolean;
  barcodeNumber: string;
  sellableQuantity: number;
  baseImageUrl: string;
  contentImageUrls: string[];
  banner: string[];
  videoUrl?: string;
  refundable: boolean;
  subCategoryId: string;
  subCategoryName?: string;
  sellerId?: string;
  sellerName?: string;
  createdOnValue: string;
  updatedOnValue?: string;
}

export const useBasicProductList = () => {
  const { data, isLoading, error, isFetchingData } = useGetData<ProductResponse[]>({
    url: GET_BASIC_PRODUCT_LIST,
    method: HttpMethod.GET,
    queryKey: [QueryKeys.BASIC_PRODUCT_LIST],
    onError: () => {
      console.error('Ürün listesi çekilirken hata oluştu');
    },
  });

  return {
    products: data || [],
    loading: isLoading || isFetchingData,
    error,
  };
};
