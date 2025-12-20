import { GET_PRODUCT_BY_ID } from "@/constants/links";
import {
  ProductDetailResponse,
  ProductDetailApiResponse,
} from "@/constants/models/Product";
import { useEffect, useRef, useState } from "react";

interface CartItem {
  id: string;
  quantity: number;
}

export const useGetLocalCartProducts = (
  cartItems: CartItem[],
  isLoaded: boolean
) => {
  const [cartProducts, setCartProducts] = useState<
    (ProductDetailResponse & { quantity: number })[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const prevItemIdsRef = useRef<string[]>([]);

  useEffect(() => {
    const fetchCartProducts = async () => {
      if (isLoaded) {
        const currentItemIds = cartItems
          .map((item) => item.id)
          .sort()
          .join(",");
        const prevItemIds = prevItemIdsRef.current.sort().join(",");

        // Sadece ürün listesi değiştiğinde çalış
        if (currentItemIds !== prevItemIds) {
          setIsLoading(true);
          setCartProducts([]);

          if (cartItems.length > 0) {
            try {
              const products = await Promise.all(
                cartItems.map(async (item) => {
                  const response = await fetch(
                    `${GET_PRODUCT_BY_ID}?id=${item.id}`
                  );
                  const apiResponse: ProductDetailApiResponse =
                    await response.json();

                  if (apiResponse.isSucceed && apiResponse.data) {
                    return { ...apiResponse.data, quantity: item.quantity };
                  } else {
                    console.error(
                      `Failed to fetch product ${item.id}:`,
                      apiResponse.message
                    );
                    return null;
                  }
                })
              );

              // Filter out null products
              const validProducts = products.filter(
                (
                  product
                ): product is ProductDetailResponse & { quantity: number } =>
                  product !== null
              );
              setCartProducts(validProducts);
              prevItemIdsRef.current = cartItems.map((item) => item.id);
            } catch (error) {
              console.error("Sepet ürünleri getirilirken hata oluştu:", error);
            }
          } else {
            prevItemIdsRef.current = [];
          }
          setIsLoading(false);
        } else {
          // Sadece miktarları güncelle
          setCartProducts((prev) =>
            prev.map((product) => {
              const cartItem = cartItems.find((item) => item.id === product.id);
              return cartItem
                ? { ...product, quantity: cartItem.quantity }
                : product;
            })
          );
          setIsLoading(false);
        }
      }
    };

    fetchCartProducts();
  }, [cartItems, isLoaded]);

  return {
    cartProducts,
    isLoading: isLoading || !isLoaded,
  };
};
