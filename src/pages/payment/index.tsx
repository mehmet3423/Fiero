import CardAddModal from "@/components/cards/CardAddModal";
import GeneralModal from "@/components/shared/GeneralModal";
import PageLoadingAnimation from "@/components/shared/PageLoadingAnimation";
import { UserPaymentCard } from "@/constants/models/PaymentCard";
import { InstallmentOption } from "@/constants/models/Payment";
import { useCreateUserPaymentCard } from "@/hooks/services/cards/useCreateUserPaymentCard";
import { useGetUserPaymentCards } from "@/hooks/services/cards/useGetUserPaymentCards";
import useRetrieveCards from "@/hooks/services/payment/useRetrieveCards";
import useMakePayment from "@/hooks/services/payment/useMakePayment";
import useGetInstallmentInfo from "@/hooks/services/payment/useGetInstallmentInfo";
import { useGetOrderById } from "@/hooks/services/order/useGetOrderById";
import {
  PaymentLocale,
  PaymentCurrency,
} from "@/constants/enums/PaymentConstants";
import Link from "next/link";
import { useRouter } from "next/router";
import { useRef, useState, useEffect } from "react";
import { toast } from "react-hot-toast";

function PaymentPage() {
  const router = useRouter();
  const { orderId, orderNumber } = router.query;

  const { makePayment, isPending: isPaymentPending } = useMakePayment();

  // Order bilgilerini al
  const { order, isLoading: orderLoading } = useGetOrderById({
    orderId: typeof orderId === "string" ? orderId : "",
  });

  const { userPaymentCards, isLoading: cardsLoading } =
    useGetUserPaymentCards();

  const { createUserPaymentCard, isPending: isAddingCard } =
    useCreateUserPaymentCard();

  // CVC için ayrı state ekleyelim
  const [cvcValue, setCvcValue] = useState("");

  // Taksit seçenekleri için state'ler
  const [installmentOptions, setInstallmentOptions] = useState<
    InstallmentOption[]
  >([]);
  const [selectedInstallment, setSelectedInstallment] = useState<number>(1);
  const { getInstallmentInfo, isPending: isInstallmentLoading } =
    useGetInstallmentInfo();

  // Seçili kart için state
  const [selectedCardId, setSelectedCardId] = useState<string>("");

  const [newCard, setNewCard] = useState<UserPaymentCard>({
    cardHolderName: "",
    cardNumber: "",
    expireMonth: "",
    expireYear: "",
    cvc: "",
    registerCard: true,
    paymentCardId: "",
    isDeleted: false,
    cardAlias: "",
    maskedCardNumber: "",
  });

  // Kart değiştiğinde CVC'yi temizle
  useEffect(() => {
    setCvcValue("");
  }, [selectedCardId]);

  // Taksit seçeneklerini getir
  useEffect(() => {
    const loadInstallmentOptions = async () => {
      if (selectedCardId && orderNumber && order) {
        const selectedCard = userPaymentCards?.find(
          (card) => card.id === selectedCardId
        );
        if (selectedCard) {
          try {
            // Order'dan toplam tutarı al
            const totalAmount =
              order.orderItems?.reduce((total, item) => {
                const price = item.discountedPrice || item.price;
                return total + price * item.quantity;
              }, 0) || 0;

            // Price kontrolü - null veya 0 ise 1 yap
            const finalPrice = totalAmount > 0 ? totalAmount : 1;

            const response = await getInstallmentInfo({
              price: finalPrice.toString(),
              userPaymentCardId: selectedCard.id || "",
              conversationId:
                typeof orderNumber === "string" ? orderNumber : "",
            });
            console.log("GetInstallmentInfo Response:", response.data);
            console.log(
              "installmentDetails:",
              response.data.installmentDetails
            );
            if (
              response.data.installmentDetails &&
              response.data.installmentDetails.length > 0
            ) {
              console.log(
                "First installmentDetail:",
                response.data.installmentDetails[0]
              );
              console.log(
                "installmentPrices:",
                response.data.installmentDetails[0].installmentPrices
              );
            }
            if (
              response.data.status === "success" &&
              response.data.installmentDetails &&
              response.data.installmentDetails.length > 0
            ) {
              const installmentPrices =
                response.data.installmentDetails[0].installmentPrices;
              console.log("Installment Prices:", installmentPrices);
              // InstallmentPrice'ı InstallmentOption'a dönüştür
              const options = installmentPrices.map((price) => ({
                installmentNumber: price.installmentNumber,
                installmentPrice: price.installmentPrice,
                totalPrice: price.totalPrice,
                installmentRate: 0, // API'den gelmiyor, varsayılan 0
              }));
              console.log("Mapped Options:", options);
              setInstallmentOptions(options);
            } else {
              console.log("No installment details found in response");
            }
          } catch (error) {
            console.error("Taksit seçenekleri yüklenemedi:", error);
            toast.error("Taksit seçenekleri alınırken bir hata oluştu");
          }
        }
      } else {
        setInstallmentOptions([]);
        setSelectedInstallment(1);
      }
    };

    loadInstallmentOptions();
  }, [selectedCardId, orderNumber, userPaymentCards, order]);

  const handleAddCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !newCard.cardHolderName ||
      !newCard.cardNumber ||
      !newCard.expireMonth ||
      !newCard.expireYear ||
      !newCard.cvc
    ) {
      toast.error("Lütfen tüm alanları doldurun");
      return;
    }

    try {
      const cardToSend = {
        ...newCard,
        cardNumber: newCard.cardNumber.replace(/\s/g, ""),
        registerCard: newCard.registerCard ? 1 : 0,
      };
      await createUserPaymentCard(cardToSend as any);
      $("#addCardModal").modal("hide");
      setNewCard({
        cardHolderName: "",
        cardNumber: "",
        expireMonth: "",
        expireYear: "",
        cvc: "",
        registerCard: true,
        paymentCardId: "",
        isDeleted: false,
        cardAlias: "",
        maskedCardNumber: "",
      });
      toast.success("Kart başarıyla eklendi");
    } catch (error) {
      console.error("Error adding card:", error);
      toast.error("Kart eklenirken bir hata oluştu");
    }
  };

  const formatCardNumber = (value: string) => {
    // Sadece rakamları al, diğer tüm karakterleri kaldır
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(" ");
    } else {
      return v;
    }
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatCardNumber(e.target.value);
    setNewCard({ ...newCard, cardNumber: formattedValue });
  };

  const handleCardSelect = async (card: UserPaymentCard) => {
    setSelectedCardId(card.id || "");
    setSelectedInstallment(1);
    setInstallmentOptions([]);

    if (!card.id) {
      console.error("Card ID is missing");
      return;
    }

    try {
      // Order'dan toplam tutarı al
      const totalAmount =
        order?.orderItems?.reduce((total, item) => {
          const price = item.discountedPrice || item.price;
          return total + price * item.quantity;
        }, 0) || 0;

      // Price kontrolü - null veya 0 ise 1 yap
      const finalPrice = totalAmount > 0 ? totalAmount : 1;

      const response = await getInstallmentInfo({
        price: finalPrice.toString(),
        userPaymentCardId: card.id || "",
        conversationId: typeof orderNumber === "string" ? orderNumber : "",
      });

      console.log(
        "GetInstallmentInfo Response (handleCardSelect):",
        response.data
      );
      console.log(
        "installmentDetails (handleCardSelect):",
        response.data.installmentDetails
      );
      if (
        response.data.installmentDetails &&
        response.data.installmentDetails.length > 0
      ) {
        console.log(
          "First installmentDetail (handleCardSelect):",
          response.data.installmentDetails[0]
        );
        console.log(
          "installmentPrices (handleCardSelect):",
          response.data.installmentDetails[0].installmentPrices
        );
      }
      if (
        response.data.status === "success" &&
        response.data.installmentDetails &&
        response.data.installmentDetails.length > 0
      ) {
        const installmentPrices =
          response.data.installmentDetails[0].installmentPrices;
        console.log(
          "Installment Prices (handleCardSelect):",
          installmentPrices
        );
        // InstallmentPrice'ı InstallmentOption'a dönüştür
        const options = installmentPrices.map((price) => ({
          installmentNumber: price.installmentNumber,
          installmentPrice: price.installmentPrice,
          totalPrice: price.totalPrice,
          installmentRate: 0, // API'den gelmiyor, varsayılan 0
        }));
        console.log("Mapped Options (handleCardSelect):", options);
        setInstallmentOptions(options);
      } else {
        console.log(
          "No installment details found in response (handleCardSelect)"
        );
      }
    } catch (error) {
      console.error("Error during card selection:", error);
      setInstallmentOptions([]);
      toast.error("Taksit seçenekleri alınırken bir hata oluştu");
    }
  };

  const handlePayment = async () => {
    if (!selectedCardId) {
      toast.error("Lütfen bir ödeme kartı seçin");
      return;
    }

    if (!cvcValue || cvcValue.length < 3) {
      toast.error("Lütfen geçerli bir CVC/CVV girin");
      return;
    }

    if (!selectedInstallment) {
      toast.error("Lütfen bir taksit seçeneği seçin");
      return;
    }

    if (!orderId) {
      toast.error("Sipariş bilgisi bulunamadı");
      return;
    }

    try {
      const paymentData = {
        orderId: orderId as string,
        affliateCollectionId: "",
        paymentCardId: selectedCardId,
        installment: selectedInstallment,
        locale: PaymentLocale.TURKISH, // 0
        currency: PaymentCurrency.TRY, // 0
        cvc: cvcValue,
      };

      await makePayment(paymentData);
      toast.success("Ödeme başarıyla tamamlandı");
      router.push("/profile/orders");
    } catch (error) {
      console.error("Error during payment:", error);
      toast.error("Ödeme işlemi sırasında bir hata oluştu");
    }
  };

  if (cardsLoading) {
    return <PageLoadingAnimation />;
  }

  if (!orderId || !orderNumber) {
    router.push("/shopping-cart");
    return null;
  }

  return (
    <main className="main">
      <div
        className="page-header text-center"
        style={{ backgroundImage: "url('assets/images/page-header-bg.jpg')" }}
      >
        <div className="container">
          <h1 className="page-title">
            Ödeme<span>Sayfası</span>
          </h1>
        </div>
      </div>
      <nav aria-label="breadcrumb" className="breadcrumb-nav">
        <div className="container">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link href="/">Anasayfa</Link>
            </li>
            <li className="breadcrumb-item">
              <Link href="/shopping-cart">Sepetim</Link>
            </li>
            <li className="breadcrumb-item">
              <Link href="/checkout">Sipariş</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Ödeme
            </li>
          </ol>
        </div>
      </nav>

      <div className="page-content">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <div className="card card-dashboard">
                <div className="card-body">
                  <h3 className="card-title">Ödeme Kartı Seçimi</h3>

                  {userPaymentCards && userPaymentCards.length > 0 && (
                    <div className="row">
                      {userPaymentCards.map((card) => (
                        <div key={card.id} className="col-md-6 mb-3">
                          <div
                            className={`card address-card ${
                              selectedCardId === card.id
                                ? "selected"
                                : "unselected"
                            }`}
                            onClick={() => handleCardSelect(card)}
                            style={{
                              cursor: "pointer",
                            }}
                          >
                            <div className="card-body">
                              <h5 className="card-title">
                                {card.cardHolderName}
                              </h5>
                              <p className="card-text">
                                {card.maskedCardNumber}
                                <br />
                                Son Kullanma: {card.expireMonth}/
                                {card.expireYear}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* CVC Input - Kart seçildiyse göster */}
                  {selectedCardId && (
                    <div className="row mt-3">
                      <div className="col-md-6">
                        <label>CVC / CVV *</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="CVC"
                          value={cvcValue}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, ""); // Sadece rakamlar
                            if (value.length <= 4) {
                              // CVV max 4 haneli
                              setCvcValue(value);
                            }
                          }}
                          maxLength={3}
                          required
                          style={{
                            fontSize: "16px",
                            padding: "12px 16px",
                          }}
                        />
                        <small className="text-muted">
                          Kartınızın arkasında yer alan 3 haneli güvenlik kodu
                        </small>
                      </div>
                    </div>
                  )}

                  {/* Taksit Seçenekleri - Kart seçildiyse ve seçenekler varsa göster */}
                  {selectedCardId && installmentOptions.length > 0 && (
                    <div className="row mt-4">
                      <div className="col-md-8">
                        <div className="installment-section">
                          <div className="installment-header-section">
                            <h6 className="installment-section-title">
                              <i className="bx bx-credit-card me-2"></i>
                              Taksit Seçeneği *
                            </h6>
                            <small className="text-muted">
                              Seçili kartınız için uygun taksit seçenekleri
                            </small>
                          </div>

                          {isInstallmentLoading ? (
                            <div className="installment-loading">
                              <div className="loading-spinner">
                                <i className="fas fa-spinner fa-spin"></i>
                              </div>
                              <span>Taksit seçenekleri yükleniyor...</span>
                            </div>
                          ) : (
                            <div className="installment-options">
                              {installmentOptions.map((option) => (
                                <div
                                  key={option.installmentNumber}
                                  className={`installment-option ${
                                    selectedInstallment ===
                                    option.installmentNumber
                                      ? "selected"
                                      : ""
                                  }`}
                                  onClick={() =>
                                    setSelectedInstallment(
                                      option.installmentNumber
                                    )
                                  }
                                >
                                  <div className="installment-radio">
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
                                    <div className="radio-custom"></div>
                                  </div>

                                  <div className="installment-content">
                                    <div className="installment-info">
                                      <span className="installment-title">
                                        {option.installmentNumber === 1
                                          ? "Tek Çekim"
                                          : `${option.installmentNumber} Taksit`}
                                      </span>

                                      {option.installmentNumber > 1 && (
                                        <span className="installment-subtitle">
                                          Aylık{" "}
                                          {option.installmentPrice.toFixed(2)} ₺
                                        </span>
                                      )}
                                    </div>

                                    <div className="installment-price">
                                      <span className="total-price">
                                        {option.totalPrice.toFixed(2)} ₺
                                      </span>

                                      {option.installmentRate > 0 && (
                                        <span className="commission-badge">
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

                  <div className="text-center py-4">
                    <p>Farklı bir kartla devam et.</p>
                    <button
                      type="button"
                      className="btn btn-outline-primary-2"
                      onClick={() => $("#addCardModal").modal("show")}
                    >
                      <span>Kart Ekle</span>
                      <i className="icon-long-arrow-right"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="card card-dashboard">
                <div className="card-body">
                  <h3 className="card-title">Ödeme Özeti</h3>

                  {orderLoading ? (
                    <div className="text-center py-4">
                      <div
                        className="spinner-border text-primary"
                        role="status"
                      >
                        <span className="visually-hidden">Yükleniyor...</span>
                      </div>
                    </div>
                  ) : order ? (
                    <div className="payment-summary">
                      {/* Sipariş Bilgileri */}
                      <div className="summary-section">
                        <h6 className="summary-title">Sipariş Bilgileri</h6>
                        <div className="summary-item">
                          <span className="label">Sipariş ID:</span>
                          <span className="value">{order.id}</span>
                        </div>
                        <div className="summary-item">
                          <span className="label">Sipariş No:</span>
                          <span className="value">{order.orderNumber}</span>
                        </div>
                        <div className="summary-item">
                          <span className="label">Tarih:</span>
                          <span className="value">
                            {new Date(order.createdOnValue).toLocaleDateString(
                              "tr-TR"
                            )}
                          </span>
                        </div>
                      </div>

                      {/* Ürün Listesi */}
                      <div className="summary-section">
                        <h6 className="summary-title">Ürünler</h6>
                        {order.orderItems?.map((item, index) => (
                          <div key={index} className="product-item">
                            <div className="product-info">
                              <span className="product-name">
                                {item.product?.title || `Ürün ${index + 1}`}
                              </span>
                              <span className="product-quantity">
                                {item.quantity} adet
                              </span>
                            </div>
                            <div className="product-price">
                              {item.discountedPrice ? (
                                <>
                                  <span className="original-price">
                                    {(item.price * item.quantity).toFixed(2)} ₺
                                  </span>
                                  <span className="discounted-price">
                                    {(
                                      item.discountedPrice * item.quantity
                                    ).toFixed(2)}{" "}
                                    ₺
                                  </span>
                                </>
                              ) : (
                                <span className="price">
                                  {(item.price * item.quantity).toFixed(2)} ₺
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Toplam Bilgileri */}
                      <div className="summary-section">
                        <div className="total-breakdown">
                          <div className="total-item">
                            <span>Ara Toplam:</span>
                            <span>
                              {order.orderItems
                                ?.reduce((total, item) => {
                                  return total + item.price * item.quantity;
                                }, 0)
                                .toFixed(2)}{" "}
                              ₺
                            </span>
                          </div>
                          <div className="total-item">
                            <span>İndirim:</span>
                            <span className="discount">
                              -
                              {order.orderItems
                                ?.reduce((total, item) => {
                                  const discount =
                                    (item.price -
                                      (item.discountedPrice || item.price)) *
                                    item.quantity;
                                  return total + discount;
                                }, 0)
                                .toFixed(2)}{" "}
                              ₺
                            </span>
                          </div>
                          <div className="total-item total">
                            <span>Toplam:</span>
                            <span className="total-price">
                              {order.orderItems
                                ?.reduce((total, item) => {
                                  const price =
                                    item.discountedPrice || item.price;
                                  return total + price * item.quantity;
                                }, 0)
                                .toFixed(2)}{" "}
                              ₺
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Ödeme Butonu */}
                      <div className="payment-action">
                        <button
                          type="button"
                          className="btn btn-primary btn-block"
                          onClick={handlePayment}
                          disabled={
                            isPaymentPending ||
                            !selectedCardId ||
                            !cvcValue ||
                            !selectedInstallment
                          }
                        >
                          {isPaymentPending ? (
                            <span>Ödeme İşleniyor...</span>
                          ) : (
                            <span>Ödemeyi Tamamla</span>
                          )}
                        </button>
                      </div>
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
        </div>
      </div>

      {/* Add Payment Card Modal */}
      <CardAddModal
        id="addCardModal"
        newCard={newCard}
        setNewCard={setNewCard}
        isAddingCard={isAddingCard}
        handleAddCard={handleAddCard}
        onClose={() => {}}
      />

      {/* stiller */}
      <style jsx>{`
        .address-card {
          transition: all 0.3s;
          border: 2px solid transparent;
          background: #f9f9f9;
          opacity: 0.8;
          transform: scale(1);
        }

        .address-card:hover {
          border: 2px dashed rgba(21, 40, 75, 0.5);
          opacity: 1;
          transform: scale(1.02);
        }

        .selected {
          border: 2px solid rgb(0, 0, 0) !important;
          background: rgba(87, 95, 111, 0.1);
          opacity: 1;
          transform: scale(1.05);
        }

        .unselected {
          opacity: 0.8;
        }

        .installment-section {
          background: #f8f9fa;
          border-radius: 12px;
          padding: 20px;
          border: 1px solid #e9ecef;
        }

        .installment-header-section {
          margin-bottom: 20px;
        }

        .installment-section-title {
          font-weight: 600;
          color: #333;
          margin-bottom: 5px;
          display: flex;
          align-items: center;
        }

        .installment-loading {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 20px;
          background: #fff;
          border-radius: 8px;
          border: 1px solid #e9ecef;
        }

        .loading-spinner {
          color: #007bff;
          font-size: 18px;
        }

        .installment-options {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .installment-option {
          border: 2px solid #e0e0e0;
          border-radius: 12px;
          padding: 20px;
          cursor: pointer;
          transition: all 0.3s ease;
          background: #fff;
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .installment-option:hover {
          border-color: #007bff;
          box-shadow: 0 4px 12px rgba(0, 123, 255, 0.15);
          transform: translateY(-2px);
        }

        .installment-option.selected {
          border-color: #007bff;
          background: linear-gradient(135deg, #f8f9ff 0%, #e3f2fd 100%);
          box-shadow: 0 4px 12px rgba(0, 123, 255, 0.2);
        }

        .installment-radio {
          position: relative;
          display: flex;
          align-items: center;
        }

        .installment-radio input[type="radio"] {
          position: absolute;
          opacity: 0;
          cursor: pointer;
        }

        .radio-custom {
          width: 20px;
          height: 20px;
          border: 2px solid #ddd;
          border-radius: 50%;
          background: #fff;
          transition: all 0.3s ease;
        }

        .installment-option.selected .radio-custom {
          border-color: #007bff;
          background: #007bff;
          position: relative;
        }

        .installment-option.selected .radio-custom::after {
          content: "";
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 8px;
          height: 8px;
          background: #fff;
          border-radius: 50%;
        }

        .installment-content {
          flex: 1;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .installment-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .installment-title {
          font-weight: 600;
          font-size: 16px;
          color: #333;
        }

        .installment-subtitle {
          font-size: 13px;
          color: #666;
          font-weight: 500;
        }

        .installment-price {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 4px;
        }

        .total-price {
          font-size: 18px;
          font-weight: 700;
          color: #28a745;
        }

        .commission-badge {
          font-size: 11px;
          color: #dc3545;
          font-weight: 600;
          background: #ffe6e6;
          padding: 2px 6px;
          border-radius: 4px;
        }

        .payment-summary {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .summary-section {
          border-bottom: 1px solid #eee;
          padding-bottom: 15px;
        }

        .summary-section:last-child {
          border-bottom: none;
        }

        .summary-title {
          font-weight: 600;
          color: #333;
          margin-bottom: 10px;
          font-size: 14px;
        }

        .summary-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 5px;
          font-size: 13px;
        }

        .summary-item .label {
          color: #666;
        }

        .summary-item .value {
          font-weight: 500;
          color: #333;
        }

        .product-item {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 8px;
          padding: 8px 0;
          border-bottom: 1px solid #f5f5f5;
        }

        .product-item:last-child {
          border-bottom: none;
        }

        .product-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
          flex: 1;
        }

        .product-name {
          font-size: 13px;
          color: #333;
          font-weight: 500;
        }

        .product-quantity {
          font-size: 11px;
          color: #666;
        }

        .product-price {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 2px;
        }

        .original-price {
          font-size: 11px;
          color: #999;
          text-decoration: line-through;
        }

        .discounted-price {
          font-size: 13px;
          color: #28a745;
          font-weight: 600;
        }

        .price {
          font-size: 13px;
          color: #333;
          font-weight: 600;
        }

        .total-breakdown {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .total-item {
          display: flex;
          justify-content: space-between;
          font-size: 13px;
        }

        .total-item.total {
          font-size: 16px;
          font-weight: 700;
          color: #333;
          border-top: 2px solid #eee;
          padding-top: 10px;
          margin-top: 5px;
        }

        .total-price {
          color: #28a745;
        }

        .discount {
          color: #dc3545;
        }

        .payment-action {
          margin-top: 20px;
        }
      `}</style>
    </main>
  );
}

export default PaymentPage;
