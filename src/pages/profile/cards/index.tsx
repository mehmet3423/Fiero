import GeneralModal from "@/components/shared/GeneralModal";
import { UserPaymentCard as UserPaymentCardType } from "@/constants/models/PaymentCard";
import { useCreateUserPaymentCard } from "@/hooks/services/cards/useCreateUserPaymentCard";
import { useGetUserPaymentCards } from "@/hooks/services/cards/useGetUserPaymentCards";
import { useState } from "react";
import toast from "react-hot-toast";
import { withProfileLayout } from "../_layout";
import { useDeleteUserPaymentCards } from "@/hooks/services/cards/useDeleteUserPaymentCards";
import { useUpdateUserPaymentCards } from "@/hooks/services/cards/useUpdateUserPaymentCards";
import CardAddModal from "@/components/cards/CardAddModal";

function Cards() {
  const { userPaymentCards, isLoading, error } = useGetUserPaymentCards();
  const { createUserPaymentCard, isPending: isAddingCard } =
    useCreateUserPaymentCard();
  const { deleteUserPaymentCard, isPending: isDeletingCard } =
    useDeleteUserPaymentCards();
  const { updateUserPaymentCard, isPending: isUpdatingCard } =
    useUpdateUserPaymentCards();

  const [newCard, setNewCard] = useState<UserPaymentCardType>({
    cardHolderName: "",
    cardNumber: "",
    expireMonth: "",
    expireYear: "",
    cvc: "",
    registerCard: true,
    paymentCardId: "",
    isDeleted: false,
    maskedCardNumber: "",
    cardAlias: "",
  });
  const [updateCard, setUpdateCard] = useState<UserPaymentCardType>({
    cardHolderName: "",
    cardNumber: "",
    expireMonth: "",
    expireYear: "",
    cvc: "",
    registerCard: true,
    paymentCardId: "",
    isDeleted: false,
    maskedCardNumber: "",
    cardAlias: "",
  });
  const [deletingCardId, setDeletingCardId] = useState<string | null>(null);

  // Kart numarasını formatlama fonksiyonu
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

  // Kart numarası değişikliğini işleme fonksiyonu
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatCardNumber(e.target.value);
    setNewCard({ ...newCard, cardNumber: formattedValue });
  };

  // CVV/CVC için sadece numara girişi
  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setNewCard({ ...newCard, cvc: value });
  };

  const handleUpdateCard = async (e: React.FormEvent, id: string) => {
    e.preventDefault();
    if (
      !updateCard.cardHolderName ||
      !updateCard.cardNumber ||
      !updateCard.expireMonth ||
      !updateCard.expireYear ||
      !updateCard.cvc
    ) {
      toast.error("Lütfen tüm alanları doldurun");
      return;
    }

    // Kart numarasındaki boşlukları kaldırarak gönderme
    const cardToSend = {
      ...updateCard,
      cardNumber: updateCard.cardNumber.replace(/\s/g, ""),
    };

    await updateUserPaymentCard(cardToSend);
  };

  const handleDeleteCardClick = (id: string) => {
    setDeletingCardId(id);
    $("#deleteCardModal").modal("show");
  };

  const handleConfirmDeleteCard = async () => {
    if (deletingCardId) {
      await deleteUserPaymentCard(deletingCardId);
      setDeletingCardId(null);
      $("#deleteCardModal").modal("hide");
    }
  };

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

    if (userPaymentCards.length === 5) {
      toast.error("En fazla 5 kredi kartı ekleyebilirsiniz");
      return;
    }

    try {
      // Kart numarasındaki boşlukları kaldırarak ve registerCard'ı integer olarak gönderme
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
        maskedCardNumber: "",
        cardAlias: "",
      });
    } catch (error) {
      console.error("Error adding card:", error);
    }
  };

  const openAddCardModal = (e: React.MouseEvent) => {
    e.preventDefault();
    $("#addCardModal").modal("show");
  };

  // updateCard için kart numarası formatlama
  const handleUpdateCardNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const formattedValue = formatCardNumber(e.target.value);
    setUpdateCard({ ...updateCard, cardNumber: formattedValue });
  };

  // updateCard için cvc
  const handleUpdateCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setUpdateCard({ ...updateCard, cvc: value });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="row">
      <div className="col-lg-12">
        <div
          style={{
            border: "1px solid #eee",
            borderRadius: "8px",
            padding: "24px",
            backgroundColor: "#fff",
            marginBottom: "20px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          <h3
            style={{
              marginBottom: "24px",
              fontSize: "20px",
              fontWeight: "600",
              color: "#333",
              borderBottom: "1px solid #eee",
              paddingBottom: "12px",
            }}
          >
            Kayıtlı Kartlarım
          </h3>

          <div className="d-flex justify-content-between align-items-center mb-4">
            <p style={{ margin: 0, fontSize: "14px", color: "#555" }}>
              Kayıtlı kredi kartlarınız aşağıda listelenmiştir.
            </p>
            <button
              className="btn"
              onClick={openAddCardModal}
              style={{
                padding: "12px 24px",
                border: "1px solid #000",
                borderRadius: "4px",
                backgroundColor: "#000",
                color: "#fff",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "500",
                transition: "all 0.3s ease",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = "#333";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "#000";
              }}
            >
              Kart Ekle
            </button>
          </div>

          <div className="row">
            {userPaymentCards &&
            Array.isArray(userPaymentCards) &&
            userPaymentCards.length > 0 ? (
              userPaymentCards.map((card: UserPaymentCardType) => (
                <div className="col-md-6 mb-4" key={card.id}>
                  <div
                    style={{
                      border: "1px solid #ddd",
                      borderRadius: "8px",
                      padding: "16px",
                      backgroundColor: "#f8f9fa",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "12px",
                      }}
                    >
                      <h5
                        style={{
                          margin: 0,
                          fontSize: "16px",
                          fontWeight: "600",
                          color: "#333",
                        }}
                      >
                        {card.cardAlias}
                      </h5>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <i
                          onClick={() => handleDeleteCardClick(card.id || "")}
                          className="icon-close"
                          style={{
                            color: "#dc3545",
                            cursor: "pointer",
                            fontSize: "18px",
                          }}
                          title="Sil"
                        ></i>
                        <i
                          onClick={() => {
                            setUpdateCard({
                              cardHolderName: "",
                              cardNumber: "",
                              expireMonth: "",
                              expireYear: "",
                              cvc: "",
                              registerCard: true,
                              paymentCardId: "",
                              isDeleted: false,
                              maskedCardNumber: "",
                              cardAlias: "",
                            });
                            setTimeout(() => {
                              setUpdateCard(card);
                            }, 0);
                            $("#updateCardModal").modal("show");
                          }}
                          className="icon-edit"
                          style={{
                            color: "#007bff",
                            cursor: "pointer",
                            fontSize: "18px",
                          }}
                          title="Güncelle"
                        ></i>
                      </div>
                    </div>
                    <p style={{ margin: 0, fontSize: "14px", color: "#555" }}>
                      <strong>Kart Numarası:</strong> {card.maskedCardNumber}
                      <br />
                      <strong>Son Kullanma Tarihi:</strong>{" "}
                      {card.expireMonth}/{card.expireYear}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12">
                <div
                  style={{
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    padding: "16px",
                    backgroundColor: "#f8f9fa",
                    textAlign: "center",
                  }}
                >
                  <p style={{ margin: 0, fontSize: "14px", color: "#555" }}>
                    Henüz kayıtlı bir kredi kartınız bulunmamaktadır.
                    <br />
                    <a
                      href="#"
                      onClick={openAddCardModal}
                      style={{
                        color: "#007bff",
                        textDecoration: "underline",
                        cursor: "pointer",
                      }}
                    >
                      Kart Ekle
                    </a>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <CardAddModal
        id="addCardModal"
        newCard={newCard}
        setNewCard={setNewCard}
        isAddingCard={isAddingCard}
        handleAddCard={handleAddCard}
        onClose={() => {}}
      />
      <GeneralModal
        id="updateCardModal"
        title="Kredi Kartı Güncelle"
        showFooter={true}
        approveButtonText="Kaydet"
        isLoading={isUpdatingCard}
        formId="updateCardForm"
        onClose={() => {}}
      >
        <form
          id="updateCardForm"
          onSubmit={(e) => handleUpdateCard(e, updateCard.id || "")}
        >
          <div className="mb-3">
            <label className="form-label">Kart Üzerindeki İsim</label>
            <input
              type="text"
              className="form-control"
              placeholder="Kart üzerindeki isim"
              value={updateCard.cardHolderName}
              onChange={(e) =>
                setUpdateCard({ ...updateCard, cardHolderName: e.target.value })
              }
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Kart Numarası</label>
            <input
              type="text"
              className="form-control"
              placeholder="XXXX XXXX XXXX XXXX"
              value={updateCard.cardNumber}
              onChange={handleUpdateCardNumberChange}
              maxLength={19}
              inputMode="numeric"
              pattern="[0-9\s]*"
            />
          </div>
          <div className="row mb-3">
            <div className="col-md-8">
              <label className="form-label">Son Kullanma Tarihi</label>
              <div className="row">
                <div className="col-6">
                  <select
                    className="form-control me-2"
                    value={updateCard.expireMonth}
                    onChange={(e) =>
                      setUpdateCard({
                        ...updateCard,
                        expireMonth: e.target.value,
                      })
                    }
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
                <div className="col-6">
                  <select
                    className="form-control"
                    value={updateCard.expireYear}
                    onChange={(e) =>
                      setUpdateCard({
                        ...updateCard,
                        expireYear: e.target.value,
                      })
                    }
                  >
                    <option value="">Yıl</option>
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
                className="form-control"
                placeholder="XXX"
                value={updateCard.cvc}
                onChange={handleUpdateCvcChange}
                maxLength={3}
                inputMode="numeric"
                pattern="[0-9]*"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Kart Takma Adı</label>
              <input
                type="text"
                className="form-control"
                placeholder="Kart takma adı"
                value={updateCard.cardAlias}
                onChange={(e) =>
                  setUpdateCard({ ...updateCard, cardAlias: e.target.value })
                }
              />
            </div>
          </div>
        </form>
      </GeneralModal>
      <GeneralModal
        id="deleteCardModal"
        title="Kartı Sil"
        size="sm"
        onClose={() => setDeletingCardId(null)}
        onApprove={handleConfirmDeleteCard}
        approveButtonText="Evet, Sil"
        isLoading={isDeletingCard}
        showFooter={true}
      >
        <div className="text-center">
          <i
            className="icon-exclamation"
            style={{ fontSize: "3rem", color: "#dc3545" }}
          ></i>
          <h4 className="mt-3">Emin misiniz?</h4>
          <p className="text-muted">
            Bu kartı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
          </p>
        </div>
      </GeneralModal>
    </div>
  );
}

export default withProfileLayout(Cards);
