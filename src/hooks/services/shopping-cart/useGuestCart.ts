import { HttpMethod } from "@/constants/enums/HttpMethods";
import { GUEST_CART } from "@/constants/links";
import { CartResponseModel } from "@/constants/models/Cart";
import useMyMutation from "../../useMyMutation";

// Guest sepet verilerini çekmek için hook
export const useGuestCart = () => {
  const { mutateAsync, isPending } = useMyMutation<CartResponseModel>();

  const fetchGuestCart = async (
    items: { itemId: string; quantity: number }[],
    couponCode?: string,
    isGiftWrap?: boolean,
    giftWrapMessage?: string
  ): Promise<CartResponseModel["data"] | null> => {
    try {
      // Items kontrolü
      if (!items || !Array.isArray(items) || items.length === 0) {
        return null;
      }

      // Query parametrelerini oluştur
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

      const url = params.toString()
        ? `${GUEST_CART}?${params.toString()}`
        : GUEST_CART;

      // Request body oluştur
      const requestBody = {
        items: items,
      };

      const response = await mutateAsync({
        url,
        method: HttpMethod.POST,
        data: requestBody,
        showErrorToast: false, // Guest cart hataları sessizce handle edilecek
      });

      // mutateAsync returns AxiosResponse<CartResponseModel>
      // So response.data is CartResponseModel, which has { data: {...} }
      return response?.data?.data || null;
    } catch (error) {
      console.error("Guest cart fetch error:", error);
      return null;
    }
  };

  return { fetchGuestCart, isLoading: isPending };
};
