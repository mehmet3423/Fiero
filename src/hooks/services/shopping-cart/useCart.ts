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
export const useGetCart = () => {
  const { data, isLoading, error, refetch } = useGetData<CartResponseModel>({
    url: CART,
    queryKey: QueryKeys.CART,
    method: HttpMethod.GET,
  });

  return {
    cart: data,
    isLoading,
    error,
    refetchCart: refetch,
  };
};

// Sepete ürün eklemek için hook
export const useAddToCart = () => {
  const { mutateAsync, isPending } = useMyMutation<string>();
  const { refetchCart } = useGetCart();

  const addItem = async (
    ItemId: string,
    quantity: number,
    specifiedProductId?: string
  ) => {
    try {
      // productId kontrolü
      if (!ItemId) {
        throw new Error("ItemId gerekli");
      }

      const params = new URLSearchParams({
        ItemId: ItemId.toString(),
        Quantity: quantity.toString(),
      });

      // Bundle discount ID varsa ekle
      if (specifiedProductId) {
        params.append("SpecifiedProductId", specifiedProductId);
      }

      await mutateAsync(
        {
          url: `${CART_ADD_ITEM}?${params.toString()}`,
          method: HttpMethod.POST,
        },
        {
          onSuccess: () => {
            toast.success("Ürün sepete eklendi");
            refetchCart();
          },
        }
      );
    } catch (error) {
      console.error("Add item error:", error);
    }
  };

  return { addItem, isLoading: isPending };
};

// Ürün miktarını güncellemek için hook
export const useUpdateCartQuantity = () => {
  const { mutateAsync, isPending } = useMyMutation<string>();
  const { refetchCart } = useGetCart();

  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      const params = new URLSearchParams({
        itemId: itemId.toString(),
        Quantity: quantity.toString(),
      }).toString();

      await mutateAsync(
        {
          url: `${CART_UPDATE_QUANTITY}?${params}`,
          method: HttpMethod.PUT,
        },
        {
          onSuccess: () => {
            toast.success("Ürün miktarı güncellendi");
            refetchCart();
          },
        }
      );
    } catch (error) {
      console.error("Update quantity error:", error);
    }
  };

  return { updateQuantity, isLoading: isPending };
};

// Sepetten ürün silmek için hook
export const useRemoveFromCart = () => {
  const { mutateAsync, isPending } = useMyMutation<string>();
  const { refetchCart } = useGetCart();

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
      console.error("Remove item error:", error);
    }
  };

  return { removeItem, isLoading: isPending };
};

// Sepeti temizlemek için hook
export const useClearCart = () => {
  const { mutateAsync, isPending } = useMyMutation<string>();
  const { refetchCart } = useGetCart();

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
      console.error("Clear cart error:", error);
    }
  };

  return { clearCart, isLoading: isPending };
};
