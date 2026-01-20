import GeneralModal from "@/components/shared/GeneralModal";
import PageLoadingAnimation from "@/components/shared/PageLoadingAnimation";
import CheckoutProgress from "@/components/shared/CheckoutProgress";
import {
  InstallmentOption,
  PaymentCardRequest,
} from "@/constants/models/Payment";
import useMakePayment from "@/hooks/services/payment/useMakePayment";
import useGetInstallmentInfo from "@/hooks/services/payment/useGetInstallmentInfo";
import usePaymentThreeDSecureInitialize from "@/hooks/services/payment/usePaymentThreeDSecureInitialize";
import useGuestPaymentThreeDSecureInitialize from "@/hooks/services/payment/useGuestPaymentThreeDSecureInitialize";
import useCompleteThreeDSecurePayment from "@/hooks/services/payment/useCompleteThreeDSecurePayment";
import signalRService from "@/services/SignalRService";
import { useGetOrderById } from "@/hooks/services/order/useGetOrderById";
import { useCreateOrder } from "@/hooks/services/order/useCreateOrder";
import { useCreateOrderGuest } from "@/hooks/services/order/useCreateOrderGuest";
import { useGetAddresses } from "@/hooks/services/address/useGetAddresses";
import { CheckoutData } from "@/types/checkout";
import { useCart } from "@/hooks/context/useCart";
import { useAuth } from "@/hooks/context/useAuth";
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";
import { useRouter } from "next/router";
import { useRef, useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import styles from "@/styles/components/Payment.module.css";

function PaymentPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const { orderId, orderNumber } = router.query;
  const { userRole } = useAuth();

  const { makePayment, isPending: isPaymentPending } = useMakePayment();
  const { createOrder, isPending: isOrderPending } = useCreateOrder();
  const { createGuestOrder, isCreatingOrder: isCreatingGuestOrder } =
    useCreateOrderGuest();
  const { addresses, isLoading: addressesLoading } = useGetAddresses();

  // Guest user detection
  const isGuest = userRole === null;

  // Cleanup function for guest addresses and cart
  const cleanupGuestData = () => {
    if (isGuest) {
      try {
        localStorage.removeItem("guestCheckoutAddresses");
        localStorage.removeItem("nors_cart");
        localStorage.removeItem("checkoutData");
      } catch (error) {
        console.error("Error cleaning up guest data:", error);
      }
    }
  };

  // 3D Secure hooks - use guest hook for guest users, regular hook for authenticated users
  const { initializeThreeDSecure, isPending: isInitializingThreeDS } =
    usePaymentThreeDSecureInitialize();
  const { initializeGuestThreeDSecure, isPending: isInitializingGuestThreeDS } =
    useGuestPaymentThreeDSecureInitialize();
  const { completeThreeDSecurePayment, isPending: isCompletingThreeDS } =
    useCompleteThreeDSecurePayment();

  // Select the appropriate hook based on user type
  const initializeThreeDSecurePayment = isGuest
    ? initializeGuestThreeDSecure
    : initializeThreeDSecure;
  const isInitializingPayment = isGuest
    ? isInitializingGuestThreeDS
    : isInitializingThreeDS;

  // Cart verilerini al
  const {
    cartProducts,
    initialLoading: cartLoading,
    cargoPrice,
    cargoDiscountedPrice,
    totalDiscountlessPrice,
    totalDiscountedPrice,
    totalPrice,
    refetchCart,
    couponCode,
    isGiftWrap,
    giftWrapMessage,
  } = useCart();

  // Checkout data and order creation states
  const [orderCreated, setOrderCreated] = useState(false);
  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null);
  const [localOrderId, setLocalOrderId] = useState<string | null>(null);
  const [localOrderNumber, setLocalOrderNumber] = useState<string | null>(null);

  // State for tracking 3D Secure flow
  const [currentPaymentId, setCurrentPaymentId] = useState<string | null>(null);
  const [currentConversationData, setCurrentConversationData] = useState<
    string | null
  >(null);
  const [currentConversationId, setCurrentConversationId] = useState<
    string | null
  >(null);

  // Refs for immediate access (no closure issues)
  const paymentIdRef = useRef<string | null>(null);
  const conversationDataRef = useRef<string | null>(null);

  // 3D Secure popup state
  const [threeDSPopup, setThreeDSPopup] = useState<Window | null>(null);

  // Popup automatic close helper function
  const closePopupSafely = (popup: Window | null, reason: string = "") => {
    if (!popup) return;

    try {
      if (!popup.closed) {
        popup.close();
      }
    } catch (e) {
      // Fallback attempts
      try {
        popup.location.href = "about:blank";
        popup.close();
      } catch (e2) {
        // Silent fail
      }
    }
    setThreeDSPopup(null);
  };

  // Initialize SignalR connection on component mount
  useEffect(() => {
    const initializeSignalR = async () => {
      const success = await signalRService.startConnection();
      if (success) {
        // Setup payment result callback
        signalRService.onPaymentResult((result) => {
          handlePaymentResult(result);
        });

        // NotifyFrontend callback'i de dinle (backend callback'ten gelir)
        signalRService.onNotifyFrontend((result) => {
          handlePaymentResult(result);
        });
      }
    };

    // Message listener for payment popup callbacks
    const handlePopupMessage = (event: MessageEvent) => {
      // Security check - only allow messages from same origin
      if (event.origin !== window.location.origin) {
        return;
      }

      if (event.data && event.data.type === "PAYMENT_CALLBACK_SUCCESS") {
        // Popup'ı güvenli şekilde kapat
        closePopupSafely(threeDSPopup, "Payment callback received");

        // Toast mesajı göster
        if (event.data.status === "success") {
          toast.success(event.data.message || "Ödeme başarıyla tamamlandı!");
        }
      }
    };

    // Message listener'ı ekle
    window.addEventListener("message", handlePopupMessage);

    initializeSignalR();

    // Cleanup on unmount
    return () => {
      signalRService.removePaymentResultCallback();
      closePopupSafely(threeDSPopup, "Component unmounting");
      window.removeEventListener("message", handlePopupMessage);

      // Close SignalR connection if no pending payment
      const pending = localStorage.getItem("pendingPayment");
      if (!pending) {
        signalRService.stopConnection();
      }
    };
  }, [threeDSPopup]);

  useEffect(() => {
    const checkPaymentStatus = async () => {
      // Başarılı ödeme kontrolü - sadece bu durumda yönlendir
      const paymentSuccess = localStorage.getItem("paymentSuccess");
      if (paymentSuccess) {
        try {
          const successData = JSON.parse(paymentSuccess);
          localStorage.removeItem("paymentSuccess");

          // Sepeti refetch et
          await refetchCart();

          // Guest data cleanup
          cleanupGuestData();

          toast.success("Ödeme başarıyla tamamlandı!");
          router.push("/profile/orders", undefined, { shallow: true });
          return;
        } catch (err) {
          // Silent fail
        }
      }

      // Pending payment kontrolü - sadece çok eski pending payment'ları temizle
      const pending = localStorage.getItem("pendingPayment");
      if (!pending) return;

      try {
        const data = JSON.parse(pending);
        const { orderNumber, timestamp } = data;

        const now = Date.now();
        const elapsed = now - timestamp;

        // SignalR bağlantısı yoksa yeniden bağlan
        if (orderNumber && !signalRService.isConnected()) {
          const connected = await signalRService.startConnection();
          if (connected) {
            await signalRService.registerTransactionId(orderNumber);
          }
        } else if (orderNumber) {
          await signalRService.registerTransactionId(orderNumber);
        }

        // 10 dakika geçtiyse ve SignalR'dan dönüş gelmediyse, eski pending payment'i temizle
        if (elapsed > 10 * 60 * 1000) {
          localStorage.removeItem("pendingPayment");
          signalRService.stopConnection();
        }
      } catch (err) {
        // Silent fail
      }
    };

    checkPaymentStatus();
  }, []);

  // Load and validate checkout data from localStorage
  useEffect(() => {
    const loadCheckoutData = () => {
      // Eğer URL'de orderId varsa, order zaten oluşturulmuş demektir
      if (orderId && orderNumber) {
        setOrderCreated(true);
        setLocalOrderId(orderId as string);
        setLocalOrderNumber(orderNumber as string);
        return;
      }

      // localStorage'dan checkout bilgilerini oku
      const savedCheckoutData = localStorage.getItem("checkoutData");

      if (!savedCheckoutData) {
        toast.error("Sipariş bilgileri bulunamadı");
        router.push("/checkout");
        return;
      }

      try {
        const parsedData: CheckoutData = JSON.parse(savedCheckoutData);

        // Timestamp kontrolü (5 dakika geçerliliği)
        const now = Date.now();
        if (now - parsedData.timestamp > 5 * 60 * 1000) {
          toast.error("Sipariş bilgileri geçerliliğini yitirdi");
          localStorage.removeItem("checkoutData");
          router.push("/checkout");
          return;
        }

        setCheckoutData(parsedData);
      } catch (error) {
        console.error("Checkout data parse error:", error);
        toast.error("Sipariş bilgileri okunamadı");
        localStorage.removeItem("checkoutData");
        router.push("/checkout");
      }
    };

    loadCheckoutData();
  }, [orderId, orderNumber, router]);

  type PaymentResult = {
    status: string;
    message?: string;
    paymentId?: string;
    conversationData?: string;
    conversationId?: string;
    mdStatus?: string;
    transactionId?: string;
  };

  // Handle payment result from SignalR
  const handlePaymentResult = async (result: PaymentResult) => {
    // Clear pending payment from localStorage
    localStorage.removeItem("pendingPayment");

    if (result.status === "success" || result.status === "SUCCESS") {
      // paymentId kontrolü - Eğer paymentId yoksa bu gerçek bir callback değil
      if (!result.paymentId) {
        return; // Erken çık - gerçek callback bekle
      }

      // SMS verification successful - closing 3DS popup
      closePopupSafely(threeDSPopup, "SMS verification completed");

      try {
        const currentOrderId = localOrderId || (orderId as string);
        const currentOrderNumber = localOrderNumber || (orderNumber as string);

        const completeData = {
          paymentId: result.paymentId,
          conversationData: result.conversationData || "",
          conversationId: result.conversationId || currentOrderNumber,
          orderId: currentOrderId,
          locale: 0, // Turkish
        };

        const completeResponse = await completeThreeDSecurePayment(
          completeData
        );

        // paymentId varlığı başarılı ödeme göstergesi
        if (completeResponse?.data?.paymentId) {
          // Ödeme başarılı - popup'ı kapat
          closePopupSafely(threeDSPopup, "Payment completed successfully");

          toast.success("Ödeme başarıyla tamamlandı!");

          // Başarılı ödeme bilgisini sakla
          localStorage.setItem(
            "paymentSuccess",
            JSON.stringify({
              status: "success",
              message: "Ödeme başarıyla tamamlandı",
              paymentId: completeResponse.data.paymentId,
              price: completeResponse.data.price,
              paidPrice: completeResponse.data.paidPrice,
              currency: completeResponse.data.currency,
              orderNumber: currentOrderNumber,
              timestamp: Date.now(),
            })
          );

          // Checkout data'yı temizle
          localStorage.removeItem("checkoutData");

          // Guest data cleanup
          cleanupGuestData();

          // SignalR cleanup
          signalRService.removePaymentResultCallback();
          signalRService.stopConnection();

          // Sepeti refetch et
          await refetchCart();

          // Guest kullanıcılar için sipariş detay sayfasına, authenticated kullanıcılar için orders sayfasına yönlendir
          setTimeout(() => {
            if (isGuest) {
              router.push(`/guest-order/${currentOrderId}`, undefined, {
                shallow: true,
              });
            } else {
              router.push("/profile/orders", undefined, { shallow: true });
            }
          }, 1500);
        } else {
          throw new Error(
            "Payment completion failed - PaymentId not found in response"
          );
        }
      } catch (error: any) {
        // Backend'den gelen hata mesajını göster
        const errorMessage =
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.message ||
          "Ödeme tamamlanırken hata oluştu";

        toast.error(
          `Hata: ${errorMessage}. Lütfen siparişlerinizi kontrol edin.`
        );

        // Hata durumunda da orders sayfasına yönlendir (ödeme başarılı olmuş olabilir)
        setTimeout(() => {
          router.push("/profile/orders", undefined, { shallow: true });
        }, 3000);
      }

      // Clean up SignalR
      signalRService.removePaymentResultCallback();
      signalRService.stopConnection();
    } else {
      // Sadece gerçek hata durumunda toast göster
      if (
        result.status === "failure" ||
        result.status === "FAILURE" ||
        result.status === "error"
      ) {
        toast.error(result.message || "Ödeme işlemi başarısız oldu!");
        closePopupSafely(threeDSPopup, "Payment failed");
        signalRService.removePaymentResultCallback();
        signalRService.stopConnection();
        setTimeout(
          () => router.push("/shopping-cart", undefined, { shallow: true }),
          2000
        );
      }
    }
  };

  const handleThreeDSRedirectViaPopup = (htmlContent: string) => {
    try {
      // Auto-submit script ekle eğer yoksa
      let enhancedHtml = htmlContent;
      if (!htmlContent.includes("document.forms[0].submit()")) {
        const autoSubmitScript = `
          <script>
            document.addEventListener('DOMContentLoaded', function() {
              if (document.forms && document.forms.length > 0) {
                document.forms[0].submit();
              }
            });
          </script>
        `;
        enhancedHtml = htmlContent.replace(
          "</body>",
          autoSubmitScript + "</body>"
        );
      }

      // Blob URL kullanarak güvenli popup açma
      const blob = new Blob([enhancedHtml], {
        type: "text/html;charset=utf-8",
      });
      const blobUrl = URL.createObjectURL(blob);

      // Önce boş popup aç, sonra içeriği yükle
      const popup = window.open(
        "",
        "threeDSecurePopup",
        "width=450,height=650,scrollbars=yes,resizable=yes"
      );

      if (popup) {
        // Kısa bir delay ile içeriği yükle
        setTimeout(() => {
          popup.location.href = blobUrl;
        }, 100);
      }

      if (!popup) {
        toast.error("Popup penceresi açılamadı. Tarayıcı engelliyor olabilir.");
        URL.revokeObjectURL(blobUrl);
        return;
      }

      setThreeDSPopup(popup);

      // Popup kapanma durumunu izle
      const checkClosed = setInterval(() => {
        try {
          if (popup.closed) {
            clearInterval(checkClosed);
            setThreeDSPopup(null);
            URL.revokeObjectURL(blobUrl);
          }
        } catch (e) {
          clearInterval(checkClosed);
          setThreeDSPopup(null);
          URL.revokeObjectURL(blobUrl);
        }
      }, 1000);

      // 10 dakika sonra interval'i temizle
      const cleanupTimeout = setTimeout(() => {
        clearInterval(checkClosed);
        if (popup && !popup.closed) {
          popup.close();
        }
        setThreeDSPopup(null);
        URL.revokeObjectURL(blobUrl);
      }, 600000);

      // Cleanup fonksiyonunu window'a ekle (gerekirse dışarıdan çağırabilmek için)
      (window as any).__threeDSCleanup = () => {
        clearInterval(checkClosed);
        clearTimeout(cleanupTimeout);
        if (popup && !popup.closed) {
          popup.close();
        }
        setThreeDSPopup(null);
        URL.revokeObjectURL(blobUrl);
      };
    } catch (error) {
      toast.error("3D Secure sayfası açılırken hata oluştu.");
    }
  };

  // Handle 3D Secure popup close
  const handleThreeDSClose = () => {
    if (threeDSPopup && !threeDSPopup.closed) {
      threeDSPopup.close();
    }
    setThreeDSPopup(null);
  };

  // Order bilgilerini al
  const { order, isLoading: orderLoading } = useGetOrderById({
    orderId: typeof orderId === "string" ? orderId : "",
  });

  // Card input form state
  const [cardForm, setCardForm] = useState<PaymentCardRequest>({
    cardHolderName: "",
    cardNumber: "",
    expireMonth: "",
    expireYear: "",
    cvc: "",
    registerCard: 0, // Default to not register card
    cardAlias: "",
  });

  // Card flip state
  const [isCardFlipped, setIsCardFlipped] = useState(false);

  // Taksit seçenekleri için state'ler
  const [installmentOptions, setInstallmentOptions] = useState<
    InstallmentOption[]
  >([]);
  const [selectedInstallment, setSelectedInstallment] = useState<number>(1);
  const { getInstallmentInfo, isPending: isInstallmentLoading } =
    useGetInstallmentInfo();

  // Card form input handlers
  const handleCardInputChange = (
    field: keyof PaymentCardRequest,
    value: string | number
  ) => {
    setCardForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Card flip functionality
  const toggleCardFlip = () => {
    setIsCardFlipped(!isCardFlipped);
  };

  // Format card number for display
  const formatCardNumberDisplay = (cardNumber: string) => {
    if (!cardNumber) return "•••• •••• •••• ••••";
    const cleaned = cardNumber.replace(/\s/g, "");
    const groups = cleaned.match(/.{1,4}/g) || [];
    const formatted = groups.join(" ");
    // Pad with dots to maintain consistent length
    const remaining = 19 - formatted.length;
    return formatted + "•".repeat(Math.max(0, remaining));
  };

  // Format expiry date for display
  const formatExpiryDisplay = (month: string, year: string) => {
    if (!month || !year) return "MM/YY";
    return `${month}/${year.slice(-2)}`;
  };

  const formatCardNumber = (value: string) => {
    // Sadece rakamları al, diğer tüm karakterleri kaldır
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");

    // Her 4 hanede bir boşluk ekle
    const parts = [];
    for (let i = 0; i < v.length; i += 4) {
      parts.push(v.substring(i, i + 4));
    }

    return parts.join(" ");
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const formattedValue = formatCardNumber(rawValue);
    handleCardInputChange("cardNumber", formattedValue);
  };

  const handlePayment = async () => {
    // Validate card form
    if (
      !cardForm.cardHolderName ||
      !cardForm.cardNumber ||
      !cardForm.expireMonth ||
      !cardForm.expireYear ||
      !cardForm.cvc
    ) {
      toast.error("Lütfen tüm kart bilgilerini doldurun");
      return;
    }

    if (!cardForm.cvc || cardForm.cvc.length < 3) {
      toast.error("Lütfen geçerli bir CVC/CVV girin");
      return;
    }

    if (!selectedInstallment) {
      toast.error("Lütfen bir taksit seçeneği seçin");
      return;
    }

    // CheckoutData kontrolü
    if (!checkoutData) {
      toast.error("Sipariş bilgileri bulunamadı");
      router.push("/checkout");
      return;
    }

    try {
      let currentOrderId = localOrderId || (orderId as string);
      let currentOrderNumber = localOrderNumber || (orderNumber as string);

      // Eğer order henüz oluşturulmadıysa, şimdi oluştur
      if (!orderCreated) {
        // Sepet kontrolü
        if (!cartProducts || cartProducts.length === 0) {
          toast.error("Sepetiniz boş");
          router.push("/checkout");
          return;
        }

        let orderResponse;

        if (checkoutData.isGuest) {
          // Guest kullanıcı için guest order oluştur
          if (!checkoutData.guestShippingAddress) {
            toast.error("Teslimat adresi bulunamadı");
            router.push("/checkout");
            return;
          }

          const guestOrderData = {
            createCartRequest: {
              items: cartProducts.map((item) => ({
                itemId: item.id,
                quantity: item.quantity,
              })),
            },
            recipientName: checkoutData.guestShippingAddress.firstName,
            recipientSurname: checkoutData.guestShippingAddress.lastName,
            recipientPhoneNumber: checkoutData.guestShippingAddress.phoneNumber,
            recipientIdentityNumber: checkoutData.tcIdentityNumber,
            email: checkoutData.email,
            createShippingAddress: checkoutData.guestShippingAddress,
            createBillingAddress:
              checkoutData.guestBillingAddress ||
              checkoutData.guestShippingAddress,
            billingType: checkoutData.billingType,
            corporateCompanyName: checkoutData.corporateCompanyName,
            corporateTaxNumber: checkoutData.corporateTaxNumber,
            corporateTaxOffice: checkoutData.corporateTaxOffice,
            cargoPrice: Number(cargoDiscountedPrice || cargoPrice || 0),
            couponCode: couponCode || "",
            isGiftWrap: isGiftWrap === true ? true : undefined,
            giftWrapMessage: giftWrapMessage || undefined,
          };

          orderResponse = await createGuestOrder(guestOrderData);

          // Guest order başarılı olduysa sepet ve adresleri temizle
          if (orderResponse) {
            cleanupGuestData();
          }
        } else {
          // Authenticated kullanıcı için normal order oluştur
          // Adresler yüklenmediyse bekle
          if (addressesLoading) {
            toast.error("Adres bilgileri yükleniyor, lütfen bekleyin");
            return;
          }

          // Seçili adresten alıcı bilgilerini çek
          const selectedAddress = addresses.find(
            (addr) => addr.id === checkoutData.shippingAddressId
          );

          if (!selectedAddress) {
            toast.error("Teslimat adresi bulunamadı");
            router.push("/checkout");
            return;
          }

          // Adres ID kontrolü
          if (
            !checkoutData.shippingAddressId ||
            !checkoutData.billingAddressId
          ) {
            toast.error("Adres bilgileri eksik");
            router.push("/checkout");
            return;
          }

          const orderData = {
            email: checkoutData.email,
            recipientName: selectedAddress.firstName || "",
            recipientSurname: selectedAddress.lastName || "",
            recipientPhoneNumber: selectedAddress.phoneNumber?.startsWith("+90")
              ? selectedAddress.phoneNumber
              : `+90${selectedAddress.phoneNumber?.replace(/^0/, "")}`,
            recipientIdentityNumber: checkoutData.tcIdentityNumber,
            shippingAddressId: checkoutData.shippingAddressId,
            billingAddressId: checkoutData.billingAddressId,
            billingType: checkoutData.billingType,
            corporateCompanyName: checkoutData.corporateCompanyName || "",
            corporateTaxNumber: checkoutData.corporateTaxNumber || "",
            corporateTaxOffice: checkoutData.corporateTaxOffice || "",
            cargoPrice: Number(cargoDiscountedPrice || cargoPrice || 0),
            couponCode: couponCode || "",
            paymentCardId: "",
            orderItems: cartProducts.map((item) => ({
              productId: item.id,
              quantity: item.quantity,
              price: item.price,
              discountedPrice: item.discountedPrice,
            })),
            totalAmount: totalPrice,
          };

          orderResponse = await createOrder(orderData);
        }

        if (!orderResponse?.orderId) {
          throw new Error("Order ID bulunamadı");
        }

        // Order bilgilerini kaydet
        currentOrderId = orderResponse.orderId;
        currentOrderNumber = orderResponse.orderNumber;
        setLocalOrderId(currentOrderId);
        setLocalOrderNumber(currentOrderNumber);
        setOrderCreated(true);

        // URL'i güncelle
        router.replace(
          `/payment?orderId=${currentOrderId}&orderNumber=${currentOrderNumber}`,
          undefined,
          { shallow: true }
        );
      }

      // Yeni 3D Secure akışı - PaymentThreeDSecureInitialize kullan
      const threeDSecureData = {
        orderId: currentOrderId,
        paymentCard: {
          ...cardForm,
          cardNumber: cardForm.cardNumber?.replace(/\s/g, ""), // Remove spaces
        },
        installment: selectedInstallment,
        locale: 0, // Turkish
        currency: 0, // TRY
      };

      const threeDSecureResponse = await initializeThreeDSecurePayment(
        threeDSecureData
      );

      if (threeDSecureResponse?.data) {
        const paymentId = threeDSecureResponse.data.paymentId;
        const threeDSHtmlContent = threeDSecureResponse.data.threeDSHtmlContent;

        // Backend expects orderNumber as conversationId
        const finalConversationId = currentOrderNumber;

        // Save payment ID and conversation data for completion
        setCurrentPaymentId(paymentId);
        setCurrentConversationData(finalConversationId);
        setCurrentConversationId(finalConversationId);

        // Also save to refs for immediate access (no closure issues)
        paymentIdRef.current = paymentId;
        conversationDataRef.current = finalConversationId;

        // Register transaction ID with SignalR
        await signalRService.registerTransactionId(finalConversationId);

        if (threeDSHtmlContent) {
          // Payment bilgilerini localStorage'a kaydet (SignalR callback için)
          localStorage.setItem(
            "pendingPayment",
            JSON.stringify({
              paymentId: paymentId,
              orderId: currentOrderId,
              orderNumber: currentOrderNumber,
              conversationId: finalConversationId,
              timestamp: Date.now(),
            })
          );

          // 3D Secure popup açma
          handleThreeDSRedirectViaPopup(threeDSHtmlContent);
        } else {
          // Eğer 3D secure gerekmiyorsa direkt completion endpointini çağır
          if (!signalRService.isConnected()) {
            const connected = await signalRService.startConnection();
            if (!connected) {
              toast.error("Bağlantı kurulamadı");
              return;
            }
          }

          await handlePaymentResult({ status: "success" });
        }
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Ödeme işlemi sırasında bir hata oluştu");
    }
  };

  if (cartLoading || (!isGuest && addressesLoading)) {
    return <PageLoadingAnimation />;
  }

  // CheckoutData yoksa checkout'a yönlendir (useEffect halledecek ama loading göster)
  if (!checkoutData && !orderId) {
    return <PageLoadingAnimation />;
  }

  if (!cartProducts || cartProducts.length === 0) {
    router.push("/shopping-cart");
    return null;
  }

  return (
    <main>
      {/* Page Title */}
      <div className="tf-page-title">
        <div className="container-full">
          <div className="heading text-center">
            {t("paymentPage.pageTitle") || "Ödeme"}
          </div>
        </div>
      </div>

      {/* Checkout Progress Steps */}
      {/* <CheckoutProgress currentStep="payment" /> */}

      {/* Page Cart Section */}
      <section className="flat-spacing-11 mt-4">
        <div className="container">
          <div className="tf-page-cart-wrap layout-2">
            <div className="tf-page-cart-item">
              <h5 className="fw-5 mb_20">{t("paymentPage.paymentCardInfo")}</h5>

              {/* Credit Card Display with Flip Button */}
              <div className={styles.creditCardWithButton}>
                <div className={styles.creditCardContainer}>
                  <div
                    className={`${styles.creditCard} ${
                      isCardFlipped ? styles.flipped : ""
                    }`}
                    onClick={toggleCardFlip}
                  >
                    {/* Card Front */}
                    <div
                      className={`${styles.cardSide} ${styles.cardFront}`}
                    >
                      <div className={styles.cardHeader}>
                        <div className={styles.cardType}>CREDIT CARD</div>
                        <div className={styles.cardChip}></div>
                      </div>
                      <div
                        className={`${styles.cardNumber} ${
                          !cardForm.cardNumber ? styles.placeholder : ""
                        }`}
                      >
                        {formatCardNumberDisplay(cardForm.cardNumber || "")}
                      </div>
                      <div className={styles.cardFooter}>
                        <div className={styles.cardHolder}>
                          <div className={styles.cardHolderLabel}>
                            CARD HOLDER
                          </div>
                          <div className={styles.cardHolderName}>
                            {(
                              cardForm.cardHolderName || "FULL NAME"
                            ).toUpperCase()}
                          </div>
                        </div>
                        <div className={styles.cardExpiry}>
                          <div className={styles.cardExpiryLabel}>
                            EXPIRES
                          </div>
                          <div className={styles.cardExpiryDate}>
                            {formatExpiryDisplay(
                              cardForm.expireMonth || "",
                              cardForm.expireYear || ""
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Card Back */}
                    <div
                      className={`${styles.cardSide} ${styles.cardBack}`}
                    >
                      <div className={styles.cardBackContent}>
                        <div className={styles.cardMagneticStripe}></div>
                        <div className={styles.cardCvcSection}>
                          <div className={styles.cardCvcLabel}>CVC</div>
                          <div
                            className={`${styles.cardCvcValue} ${
                              !cardForm.cvc ? styles.placeholder : ""
                            }`}
                          >
                            {cardForm.cvc || "•••"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Flip Button - Positioned at top right of card */}
                  <button
                    type="button"
                    className={styles.cardFlipButtonIcon}
                    onClick={toggleCardFlip}
                    title={
                      isCardFlipped ? "Kartın Önünü Gör" : "Kartı Çevir"
                    }
                  >
                    <i
                      className={`fas ${
                        isCardFlipped ? "fa-eye" : "fa-sync-alt"
                      }`}
                    ></i>
                  </button>
                </div>
              </div>

              {/* Card Input Form */}
              <div className={styles.cardInputs}>
                <div className={`${styles.cardInputRow} ${styles.small}`}>
                  <div className={styles.cardInputGroup}>
                    <label>Ad Soyad *</label>
                    <input
                      type="text"
                      placeholder="Ad Soyad"
                      value={cardForm.cardHolderName || ""}
                      onChange={(e) =>
                        handleCardInputChange(
                          "cardHolderName",
                          e.target.value
                        )
                      }
                      required
                    />
                  </div>

                  <div className={styles.cardInputGroup}>
                    <label>Kart Numarası *</label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      value={cardForm.cardNumber || ""}
                      onChange={handleCardNumberChange}
                      maxLength={19}
                      required
                    />
                  </div>
                </div>

                <div
                  className={`${styles.cardInputRow} ${styles.small} ${styles.dateRow}`}
                >
                  <div className={styles.cardInputGroup}>
                    <label>Ay *</label>
                    <select
                      value={cardForm.expireMonth || ""}
                      onChange={(e) =>
                        handleCardInputChange("expireMonth", e.target.value)
                      }
                      required
                      size={1}
                      className={styles.scrollableSelect}
                    >
                      <option value="">Ay</option>
                      {Array.from({ length: 12 }, (_, i) => {
                        const month = (i + 1).toString().padStart(2, "0");
                        return (
                          <option key={month} value={month}>
                            {month}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  <div className={styles.cardInputGroup}>
                    <label>Yıl *</label>
                    <select
                      value={cardForm.expireYear || ""}
                      onChange={(e) =>
                        handleCardInputChange("expireYear", e.target.value)
                      }
                      required
                      size={1}
                      className={styles.scrollableSelect}
                    >
                      <option value="">Yıl</option>
                      {Array.from({ length: 10 }, (_, i) => {
                        const year = (2025 + i).toString();
                        return (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>

                <div className={styles.cardInputGroup}>
                  <label>CVC / CVV *</label>
                  <input
                    type="text"
                    placeholder="123"
                    value={cardForm.cvc || ""}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, ""); // Sadece rakamlar
                      if (value.length <= 3) {
                        handleCardInputChange("cvc", value);
                      }
                    }}
                    maxLength={3}
                    required
                  />
                  <small className="text-muted">
                    <i className="fas fa-info-circle me-1"></i>
                    Kartın arkasındaki 3 haneli güvenlik kodu
                  </small>
                </div>
              </div>

              {/* Taksit Seçenekleri - Kart numarası girildiyse ve seçenekler varsa göster */}
              {cardForm.cardNumber &&
                cardForm.cardNumber.length >= 6 &&
                installmentOptions.length > 0 && (
                  <div className="row mt-4">
                    <div className="col-md-8">
                      <div className={styles.installmentSection}>
                        <div className={styles.installmentHeaderSection}>
                          <h6 className={styles.installmentSectionTitle}>
                            <i className="bx bx-credit-card me-2"></i>
                            Taksit Seçeneği *
                          </h6>
                          <small className="text-muted">
                            Girilen kart için uygun taksit seçenekleri
                          </small>
                        </div>

                        {isInstallmentLoading ? (
                          <div className={styles.installmentLoading}>
                            <div className={styles.loadingSpinner}>
                              <i className="fas fa-spinner fa-spin"></i>
                            </div>
                            <span>Taksit seçenekleri yükleniyor...</span>
                          </div>
                        ) : (
                          <div className={styles.installmentOptions}>
                            {installmentOptions.map((option) => (
                              <div
                                key={option.installmentNumber}
                                className={`${styles.installmentOption} ${
                                  selectedInstallment ===
                                  option.installmentNumber
                                    ? styles.selected
                                    : ""
                                }`}
                                onClick={() =>
                                  setSelectedInstallment(
                                    option.installmentNumber
                                  )
                                }
                              >
                                <div className={styles.installmentRadio}>
                                  <input
                                    type="radio"
                                    name="installment"
                                    value={option.installmentNumber}
                                    checked={
                                      selectedInstallment ===
                                      option.installmentNumber
                                    }
                                    onChange={() =>
                                      setSelectedInstallment(
                                        option.installmentNumber
                                      )
                                    }
                                  />
                                  <div className={styles.radioCustom}></div>
                                </div>

                                <div className={styles.installmentContent}>
                                  <div className={styles.installmentInfo}>
                                    <span
                                      className={styles.installmentTitle}
                                    >
                                      {option.installmentNumber === 1
                                        ? "Tek Çekim"
                                        : `${option.installmentNumber} Taksit`}
                                    </span>

                                    {option.installmentNumber > 1 && (
                                      <span
                                        className={
                                          styles.installmentSubtitle
                                        }
                                      >
                                        Aylık{" "}
                                        {option.installmentPrice.toFixed(2)}{" "}
                                        ₺
                                      </span>
                                    )}
                                  </div>

                                  <div className={styles.installmentPrice}>
                                    <span className={styles.totalPrice}>
                                      {option.totalPrice.toFixed(2)} ₺
                                    </span>

                                    {option.installmentRate &&
                                      option.installmentRate > 0 && (
                                        <span
                                          className={styles.commissionBadge}
                                        >
                                          %{option.installmentRate} Komisyon
                                        </span>
                                      )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
            </div>

            <div className="tf-page-cart-footer">
              <div className="tf-cart-footer-inner">
                <h5 className="fw-5 mb_20">{t("paymentPage.paymentSummary")}</h5>

                {cartLoading ? (
                  <div className="text-center py-4">
                    <div
                      className="spinner-border text-primary"
                      role="status"
                    >
                      <span className="visually-hidden">Yükleniyor...</span>
                    </div>
                  </div>
                ) : cartProducts && cartProducts.length > 0 ? (
                  <div className={styles.paymentSummary}>
                      {/* Sipariş Bilgileri */}
                      <div className="summary-header mb-3">
                        <h6 className={styles.summaryTitle}>{t("paymentPage.orderSummary")}</h6>
                        <div className="order-info">
                          <small className="text-muted">
                            {(localOrderNumber || orderNumber) &&
                              `Sipariş No: ${
                                localOrderNumber || orderNumber
                              } | `}
                            {new Date().toLocaleDateString("tr-TR")}
                          </small>
                        </div>
                      </div>

                      {/* Checkout Sayfası Stili ile Ürün Tablosu */}
                      <table className="table table-summary">
                        <thead>
                          <tr>
                            <th>Ürün</th>
                            <th>Toplam</th>
                          </tr>
                        </thead>
                        <tbody>
                          {cartProducts.map((item) => (
                            <tr key={item.id}>
                              <td>
                                <Link href={`/products/${item.id}`}>
                                  {item.title} x {item.quantity}
                                </Link>
                              </td>
                              <td>
                                {item.productDiscounts?.length > 0 &&
                                item.productDiscounts[0]?.isActive ? (
                                  <>
                                    <span
                                      style={{
                                        textDecoration: "line-through",
                                        color: "#888",
                                        marginRight: "8px",
                                      }}
                                    >
                                      {(item.price * item.quantity).toFixed(2)}₺
                                    </span>{" "}
                                    <span>
                                      {(
                                        item.discountedPrice * item.quantity
                                      ).toFixed(2)}
                                      ₺
                                    </span>
                                  </>
                                ) : (
                                  <span>
                                    {(item.price * item.quantity).toFixed(2)}₺
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}

                          {/* Ara Toplam */}
                          <tr className="summary-subtotal">
                            <td>Ara Toplam:</td>
                            <td>{totalDiscountlessPrice.toFixed(2)}₺</td>
                          </tr>

                          {/* Ürün İndirimleri - Manuel hesaplama */}
                          {(() => {
                            // Ürünlerin normal fiyat toplamı
                            const normalTotal = cartProducts.reduce(
                              (total, item) => {
                                return (
                                  total +
                                  Number(item.price || 0) *
                                    Number(item.quantity)
                                );
                              },
                              0
                            );

                            // Ürünlerin indirimli fiyat toplamı
                            const discountedTotal = cartProducts.reduce(
                              (total, item) => {
                                const price =
                                  item.discountedPrice || item.price || 0;
                                return (
                                  total + Number(price) * Number(item.quantity)
                                );
                              },
                              0
                            );

                            const productDiscountAmount =
                              normalTotal - discountedTotal;

                            if (productDiscountAmount > 0) {
                              return (
                                <tr className={styles.summaryDiscount}>
                                  <td>Ürün İndirimleri:</td>
                                  <td>
                                    <small
                                      style={{
                                        color: "green",
                                        fontSize: "1.4rem",
                                      }}
                                    >
                                      -{productDiscountAmount.toFixed(2)} ₺
                                    </small>
                                  </td>
                                </tr>
                              );
                            }
                            return null;
                          })()}

                          {/* Kargo - Backend'den gelen değerler kullanılıyor */}
                          <tr>
                            <td>Kargo:</td>
                            <td>
                              {cargoDiscountedPrice !== null &&
                              cargoPrice !== cargoDiscountedPrice ? (
                                <div>
                                  <del
                                    style={{
                                      color: "#999",
                                      fontSize: "1.3rem",
                                      display: "block",
                                      lineHeight: "1",
                                    }}
                                  >
                                    {cargoPrice.toFixed(2)} ₺
                                  </del>
                                  <span
                                    style={{
                                      fontSize: "1.5rem",
                                      display: "block",
                                      lineHeight: "1.2",
                                    }}
                                  >
                                    {cargoDiscountedPrice.toFixed(2)} ₺
                                  </span>
                                </div>
                              ) : (cargoDiscountedPrice || cargoPrice) === 0 ? (
                                "Ücretsiz Kargo"
                              ) : (
                                <span style={{ fontSize: "1.5rem" }}>
                                  {(cargoDiscountedPrice || cargoPrice).toFixed(
                                    2
                                  )}{" "}
                                  ₺
                                </span>
                              )}
                            </td>
                          </tr>

                          {/* Seçilen Taksit Tutarı - Eğer taksit seçildiyse */}
                          {selectedInstallment > 1 &&
                            installmentOptions.length > 0 && (
                              <tr className={styles.summaryInstallment}>
                                <td>
                                  <strong>{selectedInstallment} Taksit:</strong>
                                  <br />
                                  <small className="text-muted">
                                    Aylık{" "}
                                    {(() => {
                                      const selectedOption =
                                        installmentOptions.find(
                                          (option) =>
                                            option.installmentNumber ===
                                            selectedInstallment
                                        );
                                      return selectedOption
                                        ? selectedOption.installmentPrice.toFixed(
                                            2
                                          )
                                        : "0.00";
                                    })()}{" "}
                                    ₺
                                  </small>
                                </td>
                                <td>
                                  <span
                                    style={{
                                      fontSize: "1.6rem",
                                      fontWeight: "600",
                                    }}
                                  >
                                    {(() => {
                                      const selectedOption =
                                        installmentOptions.find(
                                          (option) =>
                                            option.installmentNumber ===
                                            selectedInstallment
                                        );
                                      return selectedOption
                                        ? selectedOption.totalPrice.toFixed(2)
                                        : "0.00";
                                    })()}{" "}
                                    ₺
                                  </span>
                                </td>
                              </tr>
                            )}

                          {/* Genel Toplam (Taksit + Kargo) */}
                          <tr className={styles.summaryTotal}>
                            <td>Toplam:</td>
                            <td>
                              <span
                                style={{
                                  fontSize: "1.8rem",
                                  fontWeight: "700",
                                  color: "#28a745",
                                }}
                              >
                                {(() => {
                                  // Eğer taksit seçiliyse ve installmentPrice varsa onu göster, yoksa totalPrice
                                  if (
                                    selectedInstallment &&
                                    installmentOptions.length > 0
                                  ) {
                                    const selectedOption =
                                      installmentOptions.find(
                                        (option) =>
                                          option.installmentNumber ===
                                          selectedInstallment
                                      );
                                    if (
                                      selectedOption &&
                                      typeof selectedOption.totalPrice ===
                                        "number"
                                    ) {
                                      // installmentPrice varsa onu göster, yoksa totalPrice
                                      if (
                                        typeof selectedOption.installmentPrice ===
                                          "number" &&
                                        !isNaN(selectedOption.installmentPrice)
                                      ) {
                                        return (
                                          selectedOption.totalPrice.toFixed(2) +
                                          " ₺"
                                        );
                                      } else {
                                        return totalPrice.toFixed(2) + " ₺";
                                      }
                                    }
                                  }
                                  return totalPrice.toFixed(2) + " ₺";
                                })()}
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>

                      {/* Ödeme Butonu */}
                      <button
                        type="button"
                        className="btn btn-outline-primary-2 btn-order btn-block mt-3"
                        onClick={handlePayment}
                        disabled={
                          isPaymentPending ||
                          isInitializingPayment ||
                          isCompletingThreeDS ||
                          !cardForm.cardHolderName ||
                          !cardForm.cardNumber ||
                          !cardForm.expireMonth ||
                          !cardForm.expireYear ||
                          !cardForm.cvc ||
                          !selectedInstallment
                        }
                      >
                        {isPaymentPending || isInitializingPayment ? (
                          <span className="btn-text">
                            Ödeme Başlatılıyor...
                          </span>
                        ) : isCompletingThreeDS ? (
                          <span className="btn-text">
                            Ödeme Tamamlanıyor...
                          </span>
                        ) : (
                          <>
                            <span className="btn-text">Ödemeyi Tamamla</span>
                            <span className="btn-hover-text">Ödeme Yap</span>
                          </>
                        )}
                      </button>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-muted">
                        Sipariş bilgileri yüklenemedi
                      </p>
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default PaymentPage;
