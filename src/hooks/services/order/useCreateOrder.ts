import { HttpMethod } from "@/constants/enums/HttpMethods";
import { CREATE_ORDER } from "@/constants/links";
import { CreateOrderRequest, Order } from "@/constants/models/Order";
import useMyMutation from "@/hooks/useMyMutation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
  discountedPrice: number;
}

interface CreateOrderWithItemsRequest extends CreateOrderRequest {
  orderItems: OrderItem[];
  totalAmount: number;
}

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMyMutation<{ data: Order }>();

  const createOrder = async (orderRequest: CreateOrderWithItemsRequest) => {
    const params = new URLSearchParams({
      RecipientName: orderRequest.recipientName,
      RecipientSurname: orderRequest.recipientSurname,
      RecipientPhoneNumber: orderRequest.recipientPhoneNumber,
      RecipientIdentityNumber: orderRequest.recipientIdentityNumber,
      ShippingAddressId: orderRequest.shippingAddressId,
      BillingAddressId: orderRequest.billingAddressId,
      BillingType: orderRequest.billingType.toString(),
      CorporateCompanyName: orderRequest.corporateCompanyName || "",
      CorporateTaxNumber: orderRequest.corporateTaxNumber || "",
      CorporateTaxOffice: orderRequest.corporateTaxOffice || "",
      CargoPrice: orderRequest.cargoPrice.toString(),
      CouponCode: orderRequest.couponCode || "",
      PaymentCardId: orderRequest.paymentCardId,
      // OrderItems: orderRequest.orderItems.map(item =>
      //   `${item.productId}:${item.quantity}:${item.price}:${item.discountedPrice}`
      // ).join(','),
      // TotalAmount: orderRequest.totalAmount.toString(),
    });

    const response = await mutateAsync(
      {
        url: `${CREATE_ORDER}?${params}`,
        method: HttpMethod.POST,
      },
      {
        onSuccess: () => {
          // toast.success("Siparişiniz başarıyla oluşturuldu");
        },
      }
    );
    // API'den dönen response: { data: { ...order }, ... }
    return response.data?.data;
  };

  return { createOrder, isPending };
};
