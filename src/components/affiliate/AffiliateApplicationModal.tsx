import GeneralModal from "@/components/shared/GeneralModal";
import { AffiliateApplicationRequest } from "@/constants/models/Affiliate";
import { AffiliateCommissionTransferCard } from "@/constants/models/affiliate/AffiliateUser";
import { useGetUserPaymentCards } from "@/hooks/services/cards/useGetUserPaymentCards";
import { useCreateUserPaymentCard } from "@/hooks/services/cards/useCreateUserPaymentCard";
import { useApplyForAffiliate } from "@/hooks/services/affiliate/useApplyForAffiliate";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

interface AffiliateApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AffiliateApplicationModal: React.FC<AffiliateApplicationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { userPaymentCards, isLoading: cardsLoading } =
    useGetUserPaymentCards();
  const { createUserPaymentCard, isPending: isAddingCard } =
    useCreateUserPaymentCard();
  const { applyForAffiliate, isPending: isApplying } = useApplyForAffiliate();

  const [selectedCardId, setSelectedCardId] = useState<string>("");
  const [showAddIban, setShowAddIban] = useState(false);
  const [newIban, setNewIban] = useState("");

  useEffect(() => {
    if (isOpen) {
      $("#affiliateApplicationModal").modal("show");
    } else {
      $("#affiliateApplicationModal").modal("hide");
      // Backdrop'u da temizle
      $(".modal-backdrop").remove();
      $("body").removeClass("modal-open").css("padding-right", "");
    }
  }, [isOpen]);

  // IBAN formatını kontrol etme fonksiyonu
  const validateIban = (numbers: string) => {
    // 24 haneli rakam kontrolü
    const cleanNumbers = numbers.replace(/\s/g, "");
    return cleanNumbers.length === 24 && /^\d{24}$/.test(cleanNumbers);
  };

  // IBAN formatlama fonksiyonu
  const formatIban = (value: string) => {
    // Sadece rakamları al
    const numbers = value.replace(/[^0-9]/g, "");
    const parts = [];

    for (let i = 0; i < numbers.length; i += 4) {
      parts.push(numbers.substring(i, i + 4));
    }

    return parts.join(" ");
  };

  const handleIbanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Sadece rakam girişine izin ver, 24 haneli sınır
    const numbers = e.target.value.replace(/[^0-9]/g, "").slice(0, 24);
    const formattedNumbers = formatIban(numbers);
    setNewIban(formattedNumbers);
  };

  // Full IBAN oluşturma (TR + 24 haneli rakam)
  const getFullIban = (numbers: string) => {
    const cleanNumbers = numbers.replace(/\s/g, "");
    return `TR${cleanNumbers}`;
  };

  const handleSubmitApplication = async () => {
    if (!selectedCardId && !showAddIban) {
      toast.error("Lütfen bir IBAN seçin veya yeni IBAN ekleyin");
      return;
    }

    try {
      const applicationData: AffiliateApplicationRequest = {
        iban: "",
      };

      if (showAddIban) {
        if (!newIban || !validateIban(newIban)) {
          toast.error("Lütfen 24 haneli geçerli bir IBAN numarası girin");
          return;
        }

        // AffiliateApplicationRequest içindeki createCommissionTransferCard ile IBAN gönder
        applicationData.iban = getFullIban(newIban);
      }

      await applyForAffiliate(applicationData);

      // Başvuru başarılı olduktan sonra modal state'ini temizle
      setSelectedCardId("");
      setShowAddIban(false);
      setNewIban("");

      closeModal();
    } catch (error: any) {
      console.error("Error submitting affiliate application:", error);

      const message =
        error?.response?.data?.message || "Beklenmeyen bir hata oluştu.";

      toast.error(message);
    }
  };

  const closeModal = () => {
    $("#affiliateApplicationModal").modal("hide");
    // Backdrop'u temizle ve body'yi resetle
    setTimeout(() => {
      $(".modal-backdrop").remove();
      $("body").removeClass("modal-open").css("padding-right", "");
    }, 150); // Modal animasyonunun bitmesini bekle
    onClose();
  };

  if (cardsLoading) {
    return (
      <GeneralModal
        id="affiliateApplicationModal"
        title="Affiliate Onayı Al"
        showFooter={false}
        onClose={closeModal}
      >
        <div className="text-center py-4">
          <div className="spinner-border" role="status">
            <span className="sr-only">Yükleniyor...</span>
          </div>
        </div>
      </GeneralModal>
    );
  }

  return (
    <GeneralModal
      id="affiliateApplicationModal"
      title="Affiliate Onayı Al"
      showFooter={true}
      approveButtonText={
        isApplying || isAddingCard
          ? "Gönderiliyor..."
          : showAddIban
          ? "IBAN Ekle"
          : "Başvuru Gönder"
      }
      isLoading={isApplying || isAddingCard}
      onApprove={handleSubmitApplication}
      onClose={closeModal}
    >
      <div className="affiliate-application-content">
        <p className="mb-4">
          Affiliate programımıza katılmak için komisyon ödemelerinizin
          yapılacağı IBAN'ı seçin veya yeni bir IBAN ekleyin.
        </p>

        {userPaymentCards && userPaymentCards.length > 0 && !showAddIban && (
          <div className="mb-4">
            <h5>Kayıtlı IBAN'larınız</h5>
            <div className="row">
              {userPaymentCards.map((card) => (
                <div key={card.id} className="col-lg-12 mb-3">
                  <div
                    className={`card card-dashboard ${
                      selectedCardId === card.id ? "selected-card" : ""
                    }`}
                    style={{ cursor: "pointer" }}
                    onClick={() => setSelectedCardId(card.id!)}
                  >
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h3 className="card-title mb-1">{card.cardAlias}</h3>
                          <h3 className="card-title mb-1">IBAN Numarası</h3>
                          <p className="mb-0 text-muted iban-display">
                            {(card as any).iban || "IBAN bilgisi mevcut değil"}
                          </p>
                        </div>
                        <div className="action-icons">
                          <input
                            type="radio"
                            name="selectedCard"
                            checked={selectedCardId === card.id}
                            onChange={() => setSelectedCardId(card.id!)}
                            style={{ transform: "scale(1.2)" }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!showAddIban && (
          <div className="text-center mb-4">
            <button
              type="button"
              className="btn btn-outline-dark"
              onClick={() => setShowAddIban(true)}
            >
              Yeni IBAN Ekle
            </button>
          </div>
        )}

        {showAddIban && (
          <div className="add-iban-section">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5>Yeni IBAN Ekle</h5>
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary"
                onClick={() => {
                  setShowAddIban(false);
                  setNewIban("");
                }}
              >
                İptal
              </button>
            </div>

            <div className="mb-3">
              <label className="form-label">IBAN Numarası</label>
              <div className="input-group">
                <span className="input-group-text">TR</span>
                <input
                  type="text"
                  className="form-control shadow-none"
                  placeholder="0000 0000 0000 0000 0000 0000"
                  value={newIban}
                  onChange={handleIbanChange}
                  maxLength={29} // 24 digits + 5 spaces
                  inputMode="numeric"
                  pattern="[0-9\s]*"
                />
              </div>
              <small className="form-text text-muted">
                24 haneli IBAN numaranızı giriniz (TR otomatik eklenir)
              </small>
              {newIban && !validateIban(newIban) && newIban.length > 4 && (
                <small className="form-text text-danger">
                  Geçersiz IBAN formatı (24 haneli rakam gerekli)
                </small>
              )}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .affiliate-application-content {
          max-height: 70vh;
          overflow-x: hidden;
          overflow-y: auto;
        }

        .card-dashboard {
          border: 1px solid #dee2e6;
          border-radius: 0.375rem;
          transition: all 0.2s ease;
        }

        .card-dashboard:hover {
          border-color: #040404;
        }

        .selected-card {
          border-color: #040404 !important;
          background-color: #f8f9ff !important;
        }

        .card-title {
          font-size: 1.1rem;
          font-weight: 600;
          color: #333;
        }

        .action-icons {
          display: flex;
          align-items: center;
        }

        .text-dark {
          font-weight: 500;
        }

        .add-iban-section {
          background-color: #f8f9fa;
          padding: 1.5rem;
          border-radius: 0.375rem;
        }

        .iban-display {
          font-family: "Courier New", monospace;
          font-size: 0.95rem;
          letter-spacing: 0.5px;
        }

        .input-group {
          display: flex;
          align-items: stretch;
        }
        .input-group-text {
          background-color: #f8f9fa;
          border: 1px solid #ebebeb;
          font-weight: 600;
          color: #333;
          border-right: 0;
          border-radius: 0.375rem 0 0 0.375rem;
          display: flex;
          align-items: center;
          height: 40px;
          min-width: 48px;
          padding: 0 12px;
        }
        .input-group .form-control {
          border-left: 0;
          border-radius: 0 0.375rem 0.375rem 0;
          height: 40px;
          box-sizing: border-box;
        }
        .input-group .form-control:focus {
          border-color: #040404;
          box-shadow: none;
        }
        .input-group .form-control:focus + .input-group-text,
        .input-group .input-group-text:has(+ .form-control:focus) {
          border-color: #040404;
        }
      `}</style>
    </GeneralModal>
  );
};

export default AffiliateApplicationModal;
