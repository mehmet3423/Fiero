import React, { useState, useEffect } from "react";
import { ClaimContent } from "@/constants/models/trendyol/GetClaimsResponse";
import { formatCurrency } from "@/utils/currencyFormatter";

interface ClaimDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  claim: ClaimContent | null;
}

const ClaimDetailModal: React.FC<ClaimDetailModalProps> = ({
  isOpen,
  onClose,
  claim,
}) => {
  const [isModalOpenRef, setIsModalOpenRef] = useState(false);

  useEffect(() => {
    const modalElement = $("#claimDetailModal");

    if (isOpen) {
      setIsModalOpenRef(true);
      modalElement.modal("show");
    } else {
      setIsModalOpenRef(false);
      modalElement.modal("hide");

      setTimeout(() => {
        $(".modal-backdrop").remove();
        $("body").removeClass("modal-open");
        $("body").css("padding-right", "");
      }, 150);
    }
  }, [isOpen]);

  useEffect(() => {
    const modalElement = $("#claimDetailModal");

    const handleModalHidden = () => {
      if (isModalOpenRef) {
        setIsModalOpenRef(false);
        $(".modal-backdrop").remove();
        $("body").removeClass("modal-open");
        $("body").css("padding-right", "");
        onClose();
      }
    };

    modalElement.on("hidden.bs.modal", handleModalHidden);

    return () => {
      modalElement.off("hidden.bs.modal", handleModalHidden);
    };
  }, [onClose, isModalOpenRef]);

  const formatDate = (timestamp: number) => {
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) {
        return "Geçersiz Tarih";
      }

      const months = [
        "Ocak",
        "Şubat",
        "Mart",
        "Nisan",
        "Mayıs",
        "Haziran",
        "Temmuz",
        "Ağustos",
        "Eylül",
        "Ekim",
        "Kasım",
        "Aralık",
      ];

      const day = date.getDate().toString().padStart(2, "0");
      const month = months[date.getMonth()];
      const year = date.getFullYear();
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");

      return `${day} ${month} ${year} ${hours}:${minutes}`;
    } catch (error) {
      return "Geçersiz Tarih";
    }
  };

  const getClaimStatusBadgeClass = (status: string) => {
    switch (status) {
      case "Created":
        return "bg-info"; // Mavi - Yeni oluşturulan
      case "Shipped":
        return "bg-warning"; // Turuncu - Kargoya verilen (Taşıma Durumunda gibi)
      case "WaitingInAction":
        return "bg-primary"; // Mavi - Aksiyon bekleyen
      case "Accepted":
        return "bg-success"; // Yeşil - Kabul edilen
      case "Rejected":
        return "bg-danger"; // Kırmızı - Reddedilen
      case "InAnalysis":
        return "bg-dark"; // Koyu - Analiz
      case "Unresolved":
        return "bg-danger"; // Kırmızı - İhtilaflı
      case "Suspended":
        return "bg-secondary"; // Gri - Askıda
      default:
        return "bg-secondary";
    }
  };

  const getClaimStatusText = (status: string) => {
    switch (status) {
      case "Created":
        return "Talep Oluşturulan";
      case "Shipped":
        return "Kargoya Verilen";
      case "WaitingInAction":
        return "Aksiyon Bekleyen";
      case "Accepted":
        return "Onaylanan";
      case "Rejected":
        return "Reddedilen";
      case "InAnalysis":
        return "Analiz";
      case "Unresolved":
        return "İhtilaflı";
      case "Suspended":
        return "Askıda İadeler";
      default:
        return status;
    }
  };

  if (!claim) {
    return null;
  }

  return (
    <div
      className="modal fade"
      id="claimDetailModal"
      tabIndex={-1}
      role="dialog"
      aria-labelledby="claimDetailModalLabel"
      aria-hidden="true"
    >
      <div
        className="modal-dialog modal-xl modal-dialog-scrollable"
        role="document"
        style={{ maxWidth: "1200px" }}
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="claimDetailModalLabel">
              İade Detayı
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>

          <div className="modal-body">
            {claim.items.map((item, itemIndex) => (
              <div
                key={itemIndex}
                className="mb-3"
                style={{
                  border: "1px solid #e0e0e0",
                  borderRadius: "8px",
                  padding: "16px",
                  backgroundColor: "#fff",
                }}
              >
                <div className="d-flex">
                  {/* Sol - Ürün resmi */}
                  <div className="me-3" style={{ flexShrink: 0 }}>
                    <div className="position-relative">
                      <img
                        src="/assets/admin/img/marketplace/default.webp"
                        alt="Ürün Resmi"
                        style={{
                          width: "80px",
                          height: "80px",
                          objectFit: "cover",
                          borderRadius: "6px",
                          border: "1px solid #ddd",
                        }}
                      />
                      {/* Trendyol logo küçük */}
                      <div
                        className="position-absolute"
                        style={{
                          bottom: "-5px",
                          left: "-5px",
                          backgroundColor: "#fff",
                          borderRadius: "3px",
                          padding: "1px 3px",
                          border: "1px solid #ddd",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "8px",
                            color: "#ff6600",
                            fontWeight: "bold",
                            fontFamily: "Arial",
                          }}
                        >
                          trendyol
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Orta - Ürün bilgileri */}
                  <div className="flex-grow-1">
                    {/* Ürün adı */}
                    <h6
                      className="fw-bold mb-2"
                      style={{
                        fontSize: "0.95rem",
                        color: "#333",
                        wordWrap: "break-word",
                        overflowWrap: "break-word",
                        whiteSpace: "normal",
                        lineHeight: "1.3",
                      }}
                    >
                      {item.orderLine.productName}
                    </h6>

                    {/* Ürün özellikleri - 2 sütun */}
                    <div className="row mb-3" style={{ fontSize: "0.8rem" }}>
                      <div className="col-6">
                        <div className="text-muted">
                          <strong>Stok Kodu:</strong>{" "}
                          <span style={{ color: "#666" }}>
                            {item.orderLine.merchantSku || "-"}
                          </span>
                        </div>
                        <div className="text-muted">
                          <strong>Barkod:</strong>{" "}
                          <span style={{ color: "#666" }}>
                            {item.orderLine.barcode || "-"}
                          </span>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="text-muted">
                          <strong>Renk:</strong>{" "}
                          <span style={{ color: "#666" }}>
                            {item.orderLine.productColor || "-"}
                          </span>
                        </div>
                        <div className="text-muted">
                          <strong>Beden:</strong>{" "}
                          <span style={{ color: "#666" }}>
                            {item.orderLine.productSize || "-"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Alt bilgiler */}
                    <div style={{ fontSize: "0.8rem" }}>
                      <div className="mb-1">
                        <strong style={{ color: "#333" }}>
                          İhtilaf Tarihi:
                        </strong>
                        <div
                          style={{
                            wordWrap: "break-word",
                            whiteSpace: "normal",
                            color: "#333",
                          }}
                        >
                          {formatDate(claim.claimDate)}
                        </div>
                      </div>
                      <div className="mb-1">
                        <strong style={{ color: "#333" }}>Sebep:</strong>
                        <div
                          style={{
                            wordWrap: "break-word",
                            whiteSpace: "normal",
                            lineHeight: "1.3",
                            color: "#333",
                          }}
                        >
                          {item.claimItems?.[0]?.customerClaimItemReason
                            ?.name || "Müşteriden gelen ürün adedi eksik"}
                        </div>
                      </div>
                      <div className="mb-1">
                        <strong style={{ color: "#333" }}>
                          Satıcı Açıklaması:
                        </strong>
                        <div
                          style={{
                            wordWrap: "break-word",
                            whiteSpace: "normal",
                            lineHeight: "1.3",
                            color: "#333",
                          }}
                        >
                          {item.claimItems?.[0]?.note || "sahte ürün"}
                        </div>
                      </div>
                      <div>
                        <strong style={{ color: "#333" }}>
                          Trendyol Açıklaması:
                        </strong>
                        <div
                          style={{
                            wordWrap: "break-word",
                            whiteSpace: "normal",
                            lineHeight: "1.3",
                            color: "#333",
                          }}
                        >
                          -
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sağ - Fiyat ve durum */}
                  <div
                    className="ms-3"
                    style={{
                      flexShrink: 0,
                      textAlign: "right",
                      minWidth: "200px",
                    }}
                  >
                    {/* Fiyat */}
                    <div className="mb-3">
                      <div
                        className="text-muted"
                        style={{ fontSize: "0.8rem" }}
                      >
                        Fiyat:
                      </div>
                      <div
                        className="fw-bold"
                        style={{ fontSize: "1.1rem", color: "#28a745" }}
                      >
                        {formatCurrency(item.orderLine?.price || 0)}
                      </div>
                    </div>

                    {/* Durum */}
                    <div className="mb-3">
                      <div
                        className="text-muted"
                        style={{ fontSize: "0.8rem" }}
                      >
                        Durum:
                      </div>
                      <span
                        className="badge bg-danger"
                        style={{ fontSize: "0.75rem", padding: "4px 8px" }}
                      >
                        İHTİLAFLI
                      </span>
                    </div>

                    {/* Müşteri notu */}
                    <div>
                      <div
                        className="text-muted mb-1"
                        style={{ fontSize: "0.8rem" }}
                      >
                        Müşteri Notu:
                      </div>
                      <div
                        style={{
                          fontSize: "0.75rem",
                          color: "#888",
                          lineHeight: "1.4",
                          fontStyle: "italic",
                          textAlign: "right",
                          wordWrap: "break-word",
                          overflowWrap: "break-word",
                          whiteSpace: "normal",
                          maxWidth: "100%",
                        }}
                      >
                        {item.claimItems?.[0]?.customerNote ||
                          "Talep oluşturulmadan gönderilen ve firma tarafından onaylanan iade"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClaimDetailModal;
