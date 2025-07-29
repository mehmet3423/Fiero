import { HttpMethod } from "@/constants/enums/HttpMethods";
import { GET_COUPON_DISCOUNT } from "@/constants/links";
import useMyMutation from "@/hooks/useMyMutation";
import toast from "react-hot-toast";

export const useGetCouponDiscount = () => {
    const { mutateAsync, isPending } = useMyMutation<any>();

    const getCouponDiscount = async (
        couponCode: string,
        onSuccess?: (data: any) => void,
        onError?: (error: any) => void
    ) => {
        await mutateAsync(
            {
                url: `${GET_COUPON_DISCOUNT}?couponCode=${couponCode}`,
                method: HttpMethod.GET,
            },
            {
                onSuccess: (data) => {
                    if (data) {
                        /*toast.success("Kupon kodu başarıyla uygulandı");*/
                        onSuccess?.(data);
                    } else {
                        toast.error("Geçersiz kupon kodu");
                        onError?.(new Error("Geçersiz kupon kodu"));
                    }
                },
                onError: (error) => {
                    toast.error("Kupon kodu kontrol edilirken bir hata oluştu");
                    onError?.(error);
                },
            }
        );
    };

    return { getCouponDiscount, isPending };
}; 