import { HttpMethod } from "@/constants/enums/HttpMethods";
import { CREATE_ORDER_GUEST } from "@/constants/links";
import { GuestAddressFormData } from "@/constants/models/Address";
import useMyMutation from "../../useMyMutation";

export interface CreateOrderGuestRequest {
  createCartRequest: {
    items: { itemId: string; quantity: number }[];
  };
  recipientName: string;
  recipientSurname: string;
  recipientPhoneNumber: string;
  recipientIdentityNumber?: string;
  email: string;
  createShippingAddress: GuestAddressFormData;
  createBillingAddress: GuestAddressFormData;
  billingType: number; // 0 = Individual, 1 = Corporate
  corporateCompanyName?: string;
  corporateTaxNumber?: string;
  corporateTaxOffice?: string;
  cargoPrice: number;
  couponCode?: string;
  isGiftWrap?: boolean;
  giftWrapMessage?: string;
}

export interface CreateOrderGuestResponse {
  success: boolean;
  data: {
    id: string;
    orderNumber: string;
    paymentUrl?: string;
  };
  message?: string;
}

export const useCreateOrderGuest = () => {
  const { mutateAsync, isPending } = useMyMutation<CreateOrderGuestResponse>();

  const createGuestOrder = async (
    orderData: CreateOrderGuestRequest
  ): Promise<{
    orderId: string;
    orderNumber: string;
    paymentUrl?: string;
  } | null> => {
    try {
      const response = await mutateAsync({
        url: CREATE_ORDER_GUEST,
        method: HttpMethod.POST,
        data: orderData,
        showErrorToast: true,
      });

      const backendData = response?.data?.data;
      if (!backendData) return null;

      return {
        orderId: backendData.id,
        orderNumber: backendData.orderNumber,
        paymentUrl: backendData.paymentUrl,
      };
    } catch (error) {
      console.error("Guest order creation error:", error);
      return null;
    }
  };

  return {
    createGuestOrder,
    isCreatingOrder: isPending,
  };
};
