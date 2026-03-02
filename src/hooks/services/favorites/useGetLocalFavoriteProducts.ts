import { GET_PRODUCT_BY_ID } from "@/constants/links";
import { Product } from "@/constants/models/Product";
import { useEffect, useState } from "react";

export const useGetLocalFavoriteProducts = (
  favoriteIds: string[],
  isLoaded: boolean
) => {
  const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFavoriteProducts = async () => {
      if (isLoaded) {
        setIsLoading(true);
        setFavoriteProducts([]);

        if (favoriteIds.length > 0) {
          try {
            const results = await Promise.allSettled(
              favoriteIds.map(async (id) => {
                const response = await fetch(`${GET_PRODUCT_BY_ID}?id=${id}`);
                if (!response.ok) {
                  throw new Error(`HTTP ${response.status}`);
                }
                const data = await response.json();
                return data.data || data;
              })
            );
            const products = results
              .filter((r): r is PromiseFulfilledResult<Product> => r.status === "fulfilled")
              .map((r) => r.value);
            setFavoriteProducts(products);
          } catch (error) {
            console.error("Favori ürünler getirilirken hata oluştu:", error);
          }
        }
        setIsLoading(false);
      }
    };

    fetchFavoriteProducts();
  }, [favoriteIds, isLoaded]);

  return {
    favoriteProducts,
    isLoading: isLoading || !isLoaded,
  };
};
