import { useRouter } from "next/router";
import { useEffect, useState } from "react";

/**
 * 3D Secure ödeme sonrası ödeme sağlayıcısının yönlendirdiği callback sayfası.
 * Popup içinde açıldığında parent window'a postMessage ile sonucu iletir.
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
      // Doğrudan açıldıysa (popup değil) payment sayfasına yönlendir
      setMessage("Yönlendiriliyorsunuz...");
      const oid = params.orderId || params.OrderId || "";
      const onum = params.orderNumber || params.OrderNumber || "";
      const redirectUrl = oid || onum
        ? `/payment?orderId=${oid}&orderNumber=${onum}`
        : "/payment";
      setTimeout(() => {
        router.replace(redirectUrl);
      }, 2000);
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
