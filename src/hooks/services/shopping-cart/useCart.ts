import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import {
  CART,
  CART_ADD_ITEM,
  CART_CLEAR,
  CART_REMOVE_ITEM,
  CART_UPDATE_QUANTITY,
} from "@/constants/links";
import { CartResponseModel } from "@/constants/models/Cart";
import toast from "react-hot-toast";
import useGetData from "../../useGetData";
import useMyMutation from "../../useMyMutation";

// Sepet verilerini çekmek için hook
export const useGetCart = (
  isGiftWrap?: boolean,
  giftWrapMessage?: string,
  couponCode?: string
) => {
  const params = new URLSearchParams();
  if (isGiftWrap === true) {
    params.append("isGiftWrap", "true");
  }
  if (giftWrapMessage) {
    params.append("giftWrapMessage", giftWrapMessage);
  }
  if (couponCode) {
    params.append("couponCode", couponCode);
  }

  const url = params.toString() ? `${CART}?${params.toString()}` : CART;

  const { data, isLoading, error, refetch } = useGetData<CartResponseModel>({
    url,
    queryKey: [
      QueryKeys.CART,
      isGiftWrap === true ? "true" : "false",
      giftWrapMessage || "",
      couponCode || "",
    ],
    method: HttpMethod.GET,
  });

  return {
    cart: data?.data,
    isLoading,
    error,
    refetchCart: refetch,
  };
};

// Sepete ürün eklemek için hook
export const useAddToCart = (
  isGiftWrap?: boolean,
  giftWrapMessage?: string,
  couponCode?: string
) => {
  const { mutateAsync, isPending } = useMyMutation<string>();
  const { refetchCart } = useGetCart(isGiftWrap, giftWrapMessage, couponCode);

  const addItem = async (itemId: string, quantity: number) => {
    try {
      // itemId kontrolü
      if (!itemId) {
        throw new Error("itemId gerekli");
      }

      // Request body oluştur
      const requestBody: {
        itemId: string;
        quantity: number;
      } = {
        itemId: itemId,
        quantity: quantity,
      };

      await mutateAsync(
        {
          url: CART_ADD_ITEM,
          method: HttpMethod.POST,
          data: requestBody,
        },
        {
          onSuccess: () => {
            toast.success("Ürün sepete eklendi");
            refetchCart();
          },
        }
      );
    } catch (error) {
    }
  };

  return { addItem, isLoading: isPending };
};

// Ürün miktarını güncellemek için hook
export const useUpdateCartQuantity = (
  isGiftWrap?: boolean,
  giftWrapMessage?: string,
  couponCode?: string
) => {
  const { mutateAsync, isPending } = useMyMutation<string>();
  const { refetchCart } = useGetCart(isGiftWrap, giftWrapMessage, couponCode);

  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      // Request body oluştur
      const requestBody: {
        itemId: string;
        quantity: number;
      } = {
        itemId: itemId,
        quantity: quantity,
      };

      await mutateAsync(
        {
          url: CART_UPDATE_QUANTITY,
          method: HttpMethod.PUT,
          data: requestBody,
        },
        {
          onSuccess: () => {
            toast.success("Ürün miktarı güncellendi");
            refetchCart();
          },
        }
      );
    } catch (error) {
    }
  };

  return { updateQuantity, isLoading: isPending };
};

// Sepetten ürün silmek için hook
export const useRemoveFromCart = (
  isGiftWrap?: boolean,
  giftWrapMessage?: string,
  couponCode?: string
) => {
  const { mutateAsync, isPending } = useMyMutation<string>();
  const { refetchCart } = useGetCart(isGiftWrap, giftWrapMessage, couponCode);

  const removeItem = async (productId: string) => {
    try {
      const params = new URLSearchParams({
        ProductId: productId.toString(),
      }).toString();

      await mutateAsync(
        {
          url: `${CART_REMOVE_ITEM}?${params}`,
          method: HttpMethod.DELETE,
        },
        {
          onSuccess: () => {
            toast.success("Ürün sepetten kaldırıldı");
            refetchCart();
          },
        }
      );
    } catch (error) {
    }
  };

  return { removeItem, isLoading: isPending };
};

// Sepeti temizlemek için hook
export const useClearCart = (
  isGiftWrap?: boolean,
  giftWrapMessage?: string,
  couponCode?: string
) => {
  const { mutateAsync, isPending } = useMyMutation<string>();
  const { refetchCart } = useGetCart(isGiftWrap, giftWrapMessage, couponCode);

  const clearCart = async () => {
    try {
      await mutateAsync(
        {
          url: CART_CLEAR,
          method: HttpMethod.DELETE,
        },
        {
          onSuccess: () => {
            toast.success("Sepet temizlendi");
            refetchCart();
          },
        }
      );
    } catch (error) {
    }
  };

  return { clearCart, isLoading: isPending };
};
