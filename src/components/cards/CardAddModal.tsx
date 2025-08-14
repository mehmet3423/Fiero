import GeneralModal from "@/components/shared/GeneralModal";
import { UserPaymentCard } from "@/constants/models/PaymentCard";
import useCheckBin from "@/hooks/services/payment/useCheckBin";
import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import { useLanguage } from "@/context/LanguageContext";

interface CardAddModalProps {
  id: string;
  newCard: UserPaymentCard;
  setNewCard: (card: UserPaymentCard) => void;
  isAddingCard: boolean;
  handleAddCard: (e: React.FormEvent) => void;
  onClose?: () => void;
  title?: string;
  approveButtonText?: string;
}

const CardAddModal: React.FC<CardAddModalProps> = ({
  id,
  newCard,
  setNewCard,
  isAddingCard,
  handleAddCard,
  onClose,
  title,
  approveButtonText,
}) => {
  const { checkBin, isPending: isBinChecking } = useCheckBin();
  const [cardInfo, setCardInfo] = useState<any>(null);
  const lastCheckedBinRef = useRef<string>("");
  const { t } = useLanguage();
  const defaultTitle = title || t("myCards.addCardButton");
  const defaultApproveButtonText = approveButtonText || t("modalProps.approveButtonText");

  // BIN kontrolü için effect
  useEffect(() => {
    const checkCardBin = async () => {
      const cleanCardNumber = newCard.cardNumber.replace(/\s/g, "");

      if (cleanCardNumber.length >= 6) {
        const binNumber = cleanCardNumber.substring(0, 6);

        // Aynı BIN'i tekrar kontrol etmeyelim
        if (binNumber === lastCheckedBinRef.current) {
          return;
        }

        console.log("BIN kontrolü yapılıyor:", binNumber); // Debug için

        try {
          const binInfo = await checkBin({
            binNumber,
            conversationId: `card_${Date.now()}`,
          });

          setCardInfo(binInfo);
          lastCheckedBinRef.current = binNumber;

          // Başarısız durumda toast göster
          if (!binInfo.data?.success) {
            toast.error(
              (t("myCards.binCheckFailed"))
            );
          } else {
            console.log("BIN kontrolü başarılı:", binInfo.data); // Debug için
          }
        } catch (error) {
          console.error("BIN kontrolü başarısız:", error);
          setCardInfo(null);
          lastCheckedBinRef.current = binNumber;
          toast.error(t("myCards.binCheckError"));
        }
      } else {
        // 6 haneden az ise bilgileri temizle
        setCardInfo(null);
        lastCheckedBinRef.current = "";
      }
    };

    const timeoutId = setTimeout(() => {
      checkCardBin();
    }, 800); // 800ms debounce

    return () => clearTimeout(timeoutId);
  }, [newCard.cardNumber]);

  // Modal açıldığında state'leri temizle
  useEffect(() => {
    setCardInfo(null);
    lastCheckedBinRef.current = "";
  }, [id]);

  // Kart numarasını formatlama fonksiyonu
  const formatCardNumber = (value: string) => {
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

    // Kart numarası değiştiğinde önceki BIN bilgisini temizle
    const cleanCardNumber = formattedValue.replace(/\s/g, "");
    const currentBin = cleanCardNumber.substring(0, 6);

    if (currentBin !== lastCheckedBinRef.current) {
      setCardInfo(null);
    }
  };

  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setNewCard({ ...newCard, cvc: value });
  };

  return (
    <GeneralModal
      id={id}
      title={defaultTitle}
      showFooter={true}
      approveButtonText={defaultApproveButtonText}
      isLoading={isAddingCard}
      formId="addCardForm"
      onClose={onClose}
      approveButtonStyle={{
        backgroundColor: '#000000',
        borderColor: '#000000',
        color: '#ffffff'
      }}
    >
      <form id="addCardForm" onSubmit={handleAddCard}>
        <div className="mb-3">
          <label className="form-label">{t("myCards.cardHolderNameLabel")}</label>
          <input
            type="text"
            className="form-control mb-3 shadow-none"
            placeholder="Kart üzerindeki isim"
            value={newCard.cardHolderName}
            onChange={(e) =>
              setNewCard({ ...newCard, cardHolderName: e.target.value })
            }
          />
        </div>
        <div className="mb-3">
          <label className="form-label">{t("myCards.cardNumberLabel")}</label>
          <input
            type="text"
            className="form-control mb-3 shadow-none"
            placeholder="XXXX XXXX XXXX XXXX"
            value={newCard.cardNumber}
            onChange={handleCardNumberChange}
            maxLength={19}
            inputMode="numeric"
            pattern="[0-9\s]*"
          />

          {/* Kart bilgisi gösterimi */}
          {isBinChecking && (
            <div className="mt-2">
              <small className="text-info">
                <i className="fas fa-spinner fa-spin"></i>{t("myCards.cardControl")}
              </small>
            </div>
          )}
          {cardInfo && cardInfo.data && cardInfo.data.success && (
            <div className="mt-2">
              <small className="text-success">
                <i className="fas fa-check-circle"></i>{" "}
                {cardInfo.data.cardAssociation} {cardInfo.data.cardType} -{" "}
                {cardInfo.data.bankName}
              </small>
            </div>
          )}
        </div>
        <div className="row mb-3">
          <div className="col-md-8">
            <label className="form-label">{t("myCards.expireDateLabel")}</label>
            <div className="row">
              <div className="col-6">
                <select
                  className="form-control mb-3 shadow-none me-2"
                  value={newCard.expireMonth}
                  onChange={(e) =>
                    setNewCard({ ...newCard, expireMonth: e.target.value })
                  }
                >
                  <option value="">{t("myCards.expireMonthPlaceholder")}</option>
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
              <div className="col-6">
                <select
                  className="form-control mb-3 shadow-none"
                  value={newCard.expireYear}
                  onChange={(e) =>
                    setNewCard({ ...newCard, expireYear: e.target.value })
                  }
                >
                  <option value="">{t("myCards.expireYearPlaceholder")}</option>
                  {Array.from({ length: 10 }, (_, i) => {
                    const year = (new Date().getFullYear() + i).toString();
                    return (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <label className="form-label">CVV/CVC</label>
            <input
              type="text"
              className="form-control mb-3 shadow-none"
              placeholder="XXX"
              value={newCard.cvc}
              onChange={handleCvcChange}
              maxLength={3}
              inputMode="numeric"
              pattern="[0-9]*"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">{t("myCards.cardAliasLabel")}</label>
            <input
              type="text"
              className="form-control mb-3 shadow-none"
              placeholder={t("myCards.cardAliasPlaceholder")}
              value={newCard.cardAlias}
              onChange={(e) =>
                setNewCard({ ...newCard, cardAlias: e.target.value })
              }
            />
          </div>
        </div>
      </form>
    </GeneralModal>
  );
};

export default CardAddModal;
