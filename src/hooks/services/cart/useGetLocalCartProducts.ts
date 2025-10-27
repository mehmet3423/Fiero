import { GET_PRODUCT_BY_ID } from "@/constants/links";
import { Product } from "@/constants/models/Product";
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
    (Product & { quantity: number })[]
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
                  const json = await response.json();
                  // API bazı yerlerde veriyi wrapper içinde (data) döndürüyor
                  const product: any = json?.data ?? json;

                  // Sayısal alanları güvenli hale getir (NaN engelle)
                  const price = Number(
                    product?.price !== undefined && product?.price !== null
                      ? product.price
                      : 0
                  );
                  const discountedPrice = Number(
                    product?.discountedPrice !== undefined &&
                      product?.discountedPrice !== null
                      ? product.discountedPrice
                      : price
                  );

                  // Görsel alanı için fallback (imageUrl -> baseImageUrl)
                  const baseImageUrl =
                    product?.baseImageUrl || product?.imageUrl || "";

                  return {
                    ...product,
                    price,
                    discountedPrice,
                    baseImageUrl,
                    quantity: item.quantity,
                  };
                })
              );
              setCartProducts(products);
              prevItemIdsRef.current = cartItems.map((item) => item.id);
            } catch (error) {
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
