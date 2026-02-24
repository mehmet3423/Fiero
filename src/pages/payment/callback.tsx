import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { COMPLETE_THREE_D_SECURE_PAYMENT } from "@/constants/links";
import { getToken } from "@/helpers/tokenUtils";
import axios from "axios";

/**
 * 3D Secure ödeme sonrası ödeme sağlayıcısının yönlendirdiği callback sayfası.
 * Popup içinde açıldığında parent window'a postMessage ile sonucu iletir.
 * Mobil redirect flow'da (popup yok) API çağrısı yapıp sonuç sayfasına yönlendirir.
 */
export default function PaymentCallbackPage() {
  const router = useRouter();
  const [message, setMessage] = useState<string>("İşleniyor...");

  useEffect(() => {
    if (!router.isReady) return;

    const params = router.query as Record<string, string>;
    const status = params.status || params.Status || "";
    const paymentId = params.paymentId || params.PaymentId || params.payment_id || "";
    const conversationData = params.conversationData || params.ConversationData || "";
    const mdStatus = params.mdStatus || params.MdStatus || "";

    const isSuccess = status?.toLowerCase() === "success" || mdStatus === "1";

    // Popup içindeyse parent'a bildir
    if (typeof window !== "undefined" && window.opener) {
      try {
        const pendingPayment = localStorage.getItem("pendingPayment");
        let conversationId = params.conversationId || params.ConversationId || "";
        let orderId = params.orderId || params.OrderId || "";
        let orderNumber = params.orderNumber || params.OrderNumber || "";

        let resolvedPaymentId = paymentId;
        if (pendingPayment) {
          try {
            const pending = JSON.parse(pendingPayment);
            conversationId = conversationId || pending.conversationId || pending.orderNumber;
            orderId = orderId || pending.orderId;
            orderNumber = orderNumber || pending.orderNumber;
            resolvedPaymentId = resolvedPaymentId || pending.paymentId;
          } catch {
            // ignore
          }
        }

        const payload = {
          type: "PAYMENT_CALLBACK_SUCCESS",
          status: isSuccess ? "success" : "failure",
          message: isSuccess ? "Ödeme başarıyla tamamlandı!" : "Ödeme tamamlanamadı.",
          paymentId: resolvedPaymentId || undefined,
          conversationData: conversationData || undefined,
          conversationId: conversationId || undefined,
          mdStatus: mdStatus || undefined,
          orderId: orderId || undefined,
          orderNumber: orderNumber || undefined,
        };

        window.opener.postMessage(payload, window.location.origin);
        setMessage(isSuccess ? "Ödeme başarılı. Pencere kapatılıyor..." : "Ödeme tamamlanamadı.");
      } catch (err) {
        console.error("Payment callback postMessage error:", err);
        setMessage("Bir hata oluştu.");
      }

      // Popup'ı kısa süre sonra kapat
      setTimeout(() => {
        window.close();
      }, 1500);
    } else {
      // Mobil redirect flow: popup yok
      if (!isSuccess) {
        setMessage("Ödeme tamamlanamadı. Yönlendiriliyorsunuz...");
        localStorage.removeItem("pendingPayment");
        setTimeout(() => router.replace("/shopping-cart"), 2000);
        return;
      }

      // API çağrısı yapıp sonuç sayfasına yönlendir
      const completeRedirectFlow = async () => {
        const pendingPayment = localStorage.getItem("pendingPayment");
        let orderId = params.orderId || params.OrderId || "";
        let orderNumber = params.orderNumber || params.OrderNumber || "";
        let resolvedPaymentId = paymentId;
        let conversationId = params.conversationId || params.ConversationId || "";
        let isGuest = false;

        if (pendingPayment) {
          try {
            const pending = JSON.parse(pendingPayment);
            orderId = orderId || pending.orderId;
            orderNumber = orderNumber || pending.orderNumber;
            resolvedPaymentId = resolvedPaymentId || pending.paymentId;
            conversationId = conversationId || pending.conversationId || pending.orderNumber;
            isGuest = pending.isGuest === true;
          } catch {
            // ignore
          }
        }

        if (!resolvedPaymentId || !orderId) {
          setMessage("Ödeme bilgisi bulunamadı. Yönlendiriliyorsunuz...");
          setTimeout(() => router.replace("/payment"), 2000);
          return;
        }

        try {
          const token = getToken();
          const response = await axios.post(COMPLETE_THREE_D_SECURE_PAYMENT, {
            paymentId: resolvedPaymentId,
            conversationData: conversationData || "",
            conversationId: conversationId || orderNumber,
            orderId,
            locale: 0,
          }, {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
            timeout: 30000,
          });

          const resData = response?.data;
          const success = resData?.isSucceed !== false;

          if (success) {
            localStorage.removeItem("pendingPayment");
            localStorage.removeItem("checkoutData");
            localStorage.setItem(
              "paymentSuccess",
              JSON.stringify({
                status: "success",
                message: "Ödeme başarıyla tamamlandı",
                paymentId: resolvedPaymentId,
                orderNumber,
                orderId,
                isGuest,
                timestamp: Date.now(),
              })
            );
            if (isGuest) {
              localStorage.removeItem("guestCheckoutAddresses");
              localStorage.removeItem("nors_cart");
            }
            setMessage("Ödeme başarılı! Yönlendiriliyorsunuz...");
            setTimeout(() => {
              router.replace(isGuest ? `/guest-order/${orderId}` : "/profile/orders");
            }, 1500);
          } else {
            setMessage("Ödeme tamamlanamadı. Yönlendiriliyorsunuz...");
            localStorage.removeItem("pendingPayment");
            setTimeout(() => router.replace("/shopping-cart"), 2000);
          }
        } catch (err) {
          console.error("Payment callback complete error:", err);
          setMessage("Bir hata oluştu. Siparişlerinizi kontrol edin.");
          setTimeout(() => {
            router.replace(isGuest ? `/guest-order/${orderId}` : "/profile/orders");
          }, 3000);
        }
      };

      completeRedirectFlow();
    }
  }, [router.isReady, router.query]);

  return (
    <main className="d-flex align-items-center justify-content-center min-vh-100">
      <div className="text-center p-5">
        <div className="spinner-border text-primary mb-3" role="status">
          <span className="visually-hidden">Yükleniyor</span>
        </div>
        <p className="mb-0">{message}</p>
      </div>
    </main>
  );
}
