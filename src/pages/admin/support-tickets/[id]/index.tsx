import { useGetGeneralSupportTicketById } from "@/hooks/services/support/useGetGeneralSupportTicketById";
import { getAllGeneralRequestTypes } from "@/helpers/enum/generalRequestType";
import {
  SupportTicketStatusLabels,
  SupportTicketStatusColors,
} from "@/constants/enums/support-ticket/GeneralSupportTicket/SupportTicketStatus";
import { useUpdateGeneralSupportTicket } from "@/hooks/services/support/useUpdateGeneralSupportTicket";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "react-hot-toast";
import BackButton from "@/components/shared/BackButton";
function GeneralSupportTicketDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { ticket, isLoading, error, refetch } = useGetGeneralSupportTicketById(
    id as string
  );

  const updateMutation = useUpdateGeneralSupportTicket();

  // State for edit mode
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({
    requestType: 0,
    supportTicketStatus: 0,
    title: "",
    description: "",
    imageUrl: "",
  });

  // Helper function to format date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Geçersiz Tarih";
      }

      const months = [
        "Oca",
        "Şub",
        "Mar",
        "Nis",
        "May",
        "Haz",
        "Tem",
        "Ağu",
        "Eyl",
        "Eki",
        "Kas",
        "Ara",
      ];

      const day = date.getDate().toString().padStart(2, "0");
      const month = months[date.getMonth()];
      const year = date.getFullYear();
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");

      return `${day} ${month} ${year} - ${hours}:${minutes}`;
    } catch (error) {
      return "Geçersiz Tarih";
    }
  };

  const handleEditClick = () => {
    if (ticket) {
      setEditFormData({
        requestType: ticket.requestType,
        supportTicketStatus: ticket.supportTicketStatus || 0,
        title: ticket.title,
        description: ticket.description || "",
        imageUrl: ticket.imageUrl || "",
      });
      setIsEditing(true);
    }
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticket) return;

    try {
      await updateMutation.updateGeneralSupportTicket({
        id: ticket.id,
        supportTicketStatus: editFormData.supportTicketStatus,
        title: editFormData.title,
        description: editFormData.description,
        imageUrl: editFormData.imageUrl,
      });
      toast.success("Destek talebi başarıyla güncellendi");
      setIsEditing(false);
      refetch();
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Güncelleme işlemi başarısız oldu");
    }
  };

  if (isLoading) {
    return (
      <div className="content-wrapper">
        <div className="container-fluid flex-grow-1 container-p-y">
          <div className="card shadow-sm">
            <div className="d-flex justify-content-center align-items-center p-5">
              <div
                className="spinner-border text-primary"
                role="status"
                style={{ width: "3rem", height: "3rem" }}
              >
                <span className="visually-hidden">Yükleniyor...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="content-wrapper">
        <div className="container-fluid flex-grow-1 container-p-y">
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="alert alert-danger">
                Destek talebi bilgileri yüklenirken bir hata oluştu. Lütfen daha
                sonra tekrar deneyin.
              </div>
              <Link
                href="/admin/support-tickets"
                className="btn btn-outline-secondary"
              >
                <i className="bx bx-arrow-back me-2"></i> Destek Taleplerine Dön
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const requestTypeLabel =
    getAllGeneralRequestTypes().find(
      (type) => type.value === ticket.requestType
    )?.title || "Bilinmiyor";

  return (
    <div className="content-wrapper" style={{ fontSize: "0.85rem" }}>
      <div className="container-fluid flex-grow-1 container-p-y">
        {/* Header */}
        <div className="mb-4">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
            <div>
              <h5 className="mb-2 mb-md-0" style={{ fontSize: "0.95rem" }}>
                <i className="bx bx-support me-2"></i>
                Genel Destek Talebi Detayları
              </h5>
            </div>
            <BackButton href="/admin/support-tickets" label="Geri Dön" />
          </div>
        </div>

        {/* Main Content */}
        <div className="row g-4">
          {/* Left Column - Details */}
          <div className="col-lg-8">
            <div className="card shadow-sm h-100 border-0">
              <div className="card-header bg-white border-bottom d-flex justify-content-between align-items-center py-3">
                <h6
                  className="m-3 mb-0 mt-0 fw-semibold text-dark small"
                  style={{ fontSize: "0.8rem" }}
                >
                  <i className="bx bx-info-circle me-2 text-primary"></i>
                  Talep Detayları
                </h6>
                {!isEditing && (
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-primary rounded-pill px-3 m-3 mb-0 mt-0"
                    onClick={handleEditClick}
                  >
                    <i className="bx bx-edit me-1"></i>
                    Düzenle
                  </button>
                )}
              </div>
              <div className="card-body p-4">
                {isEditing ? (
                  <form onSubmit={handleUpdateSubmit}>
                    <div className="mb-4">
                      <label className="form-label fw-semibold text-dark small">
                        Başlık *
                      </label>
                      <input
                        type="text"
                        className="form-control border-2"
                        value={editFormData.title}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            title: e.target.value,
                          })
                        }
                        required
                      />
                    </div>

                    <div className="row g-3 mb-4">
                      <div className="col-md-6">
                        <label className="form-label fw-semibold text-dark small">
                          Talep Türü
                        </label>
                        <select
                          className="form-select border-2"
                          value={editFormData.requestType}
                          disabled
                        >
                          {getAllGeneralRequestTypes().map((type) => (
                            <option key={type.value} value={type.value}>
                              {type.title}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-semibold text-dark small">
                          Durum *
                        </label>
                        <select
                          className="form-select border-2"
                          value={editFormData.supportTicketStatus}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              supportTicketStatus: Number(e.target.value),
                            })
                          }
                          required
                        >
                          {Object.entries(SupportTicketStatusLabels).map(
                            ([key, value]) => (
                              <option key={key} value={key}>
                                {value}
                              </option>
                            )
                          )}
                        </select>
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="form-label fw-semibold text-dark small">
                        Açıklama
                      </label>
                      <textarea
                        className="form-control border-2"
                        rows={6}
                        value={editFormData.description}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            description: e.target.value,
                          })
                        }
                        placeholder="Destek talebi açıklaması..."
                      />
                    </div>

                    <div className="mb-4">
                      <label className="form-label fw-semibold text-dark small">
                        Resim URL
                      </label>
                      <input
                        type="text"
                        className="form-control border-2"
                        value={editFormData.imageUrl}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            imageUrl: e.target.value,
                          })
                        }
                        placeholder="Resim URL'si..."
                      />
                      {editFormData.imageUrl && (
                        <div className="mt-2">
                          <img
                            src={editFormData.imageUrl}
                            alt="Destek talebi resmi"
                            className="img-fluid rounded"
                            style={{ maxHeight: "300px", objectFit: "contain" }}
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display =
                                "none";
                            }}
                          />
                        </div>
                      )}
                    </div>

                    <div className="d-flex gap-3">
                      <button
                        type="submit"
                        className="btn btn-primary btn-sm px-3"
                        disabled={updateMutation.isPending}
                      >
                        {updateMutation.isPending ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" />
                            Kaydediliyor...
                          </>
                        ) : (
                          <>
                            <i className="bx bx-save me-2"></i>
                            Kaydet
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-secondary btn-sm px-3"
                        onClick={() => setIsEditing(false)}
                      >
                        İptal
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="mb-4">
                      <h6 className="text-muted mb-2 fw-semibold small">
                        Başlık
                      </h6>
                      <h6
                        className="mb-0 text-dark fw-bold"
                        style={{ fontSize: "0.9rem" }}
                      >
                        {ticket.title}
                      </h6>
                    </div>

                    <div className="mb-4">
                      <h6 className="text-muted mb-2 fw-semibold small">
                        Açıklama
                      </h6>
                      {ticket.description ? (
                        <div className="bg-light p-3 rounded-3">
                          <p
                            className="mb-0 lh-lg"
                            style={{ whiteSpace: "pre-wrap" }}
                          >
                            {ticket.description}
                          </p>
                        </div>
                      ) : (
                        <div className="bg-light p-3 rounded-3">
                          <p className="text-muted mb-0">
                            Açıklama bulunmamaktadır.
                          </p>
                        </div>
                      )}
                    </div>

                    {ticket.imageUrl && (
                      <div className="mb-4">
                        <h6 className="text-muted mb-2 fw-semibold small">
                          Resim
                        </h6>
                        <div className="bg-light p-3 rounded-3">
                          <img
                            src={ticket.imageUrl}
                            alt="Destek talebi resmi"
                            className="img-fluid rounded"
                            style={{ maxHeight: "400px", objectFit: "contain" }}
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display =
                                "none";
                              const parent = (e.target as HTMLImageElement)
                                .parentElement;
                              if (parent) {
                                parent.innerHTML =
                                  '<p class="text-muted mb-0">Resim yüklenemedi.</p>';
                              }
                            }}
                          />
                        </div>
                      </div>
                    )}

                    <div className="row g-3 mb-4">
                      <div className="col-md-6">
                        <h6 className="text-muted mb-2 fw-semibold">
                          Talep Türü
                        </h6>
                        <span
                          className="badge bg-info px-2 py-1"
                          style={{ fontSize: "0.75rem" }}
                        >
                          {requestTypeLabel}
                        </span>
                      </div>

                      <div className="col-md-6">
                        <h6 className="text-muted mb-2 fw-semibold">Durum</h6>
                        <span
                          className={`badge bg-${
                            SupportTicketStatusColors[
                              ticket.supportTicketStatus as keyof typeof SupportTicketStatusColors
                            ] || "secondary"
                          } px-2 py-1`}
                          style={{ fontSize: "0.75rem" }}
                        >
                          {SupportTicketStatusLabels[
                            ticket.supportTicketStatus as keyof typeof SupportTicketStatusLabels
                          ] || "Bilinmiyor"}
                        </span>
                      </div>
                    </div>

                    {(ticket.email || ticket.phoneNumber) && (
                      <div className="row g-3">
                        {ticket.email && (
                          <div className="col-md-6">
                            <h6 className="text-muted mb-2 fw-semibold">
                              <i className="bx bx-envelope me-1"></i>Email
                            </h6>
                            <p className="mb-0">
                              <a
                                href={`mailto:${ticket.email}`}
                                className="text-decoration-none"
                              >
                                {ticket.email}
                              </a>
                            </p>
                          </div>
                        )}
                        {ticket.phoneNumber && (
                          <div className="col-md-6">
                            <h6 className="text-muted mb-2 fw-semibold">
                              <i className="bx bx-phone me-1"></i>Telefon
                            </h6>
                            <p className="mb-0">
                              <a
                                href={`tel:${ticket.phoneNumber}`}
                                className="text-decoration-none"
                              >
                                {ticket.phoneNumber}
                              </a>
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Meta Info */}
          <div className="col-lg-4">
            <div className="card shadow-sm mb-4 border-0">
              <div className="card-header bg-white border-bottom py-3">
                <h6
                  className="mb-0 fw-semibold text-dark m-3 mb-0 mt-0 small"
                  style={{ fontSize: "0.8rem" }}
                >
                  <i className="bx bx-user me-2 text-primary"></i>
                  Müşteri Bilgileri
                </h6>
              </div>
              <div className="card-body p-4">
                <div className="mb-3">
                  <h6 className="text-muted small mb-2 fw-semibold">
                    Müşteri ID
                  </h6>
                  <p className="mb-0">
                    <code className="bg-light p-2 rounded d-block">
                      {ticket.customerId}
                    </code>
                  </p>
                </div>
              </div>
            </div>

            <div className="card shadow-sm mb-4 border-0">
              <div className="card-header bg-white border-bottom py-3">
                <h6
                  className="mb-0 fw-semibold text-dark m-3 mb-0 mt-0 small"
                  style={{ fontSize: "0.8rem" }}
                >
                  <i className="bx bx-time me-2 text-primary"></i>
                  Tarihler
                </h6>
              </div>
              <div className="card-body p-4">
                <div className="mb-3">
                  <h6 className="text-muted small mb-2 fw-semibold">
                    Oluşturulma Tarihi
                  </h6>
                  <p className="mb-0 fw-semibold">
                    {formatDate(ticket.createdOnValue)}
                  </p>
                </div>
              </div>
            </div>

            <div className="card shadow-sm border-0">
              <div className="card-header bg-white border-bottom py-3">
                <h6
                  className="mb-0 fw-semibold text-dark m-3 mb-0 mt-0 small"
                  style={{ fontSize: "0.8rem" }}
                >
                  <i className="bx bx-info-circle me-2 text-primary"></i>
                  Sistem Bilgileri
                </h6>
              </div>
              <div className="card-body p-4">
                <div className="mb-3">
                  <h6 className="text-muted small mb-2 fw-semibold">
                    Talep ID
                  </h6>
                  <p className="mb-0">
                    <code className="bg-light p-2 rounded d-block">
                      #{ticket.id}
                    </code>
                  </p>
                </div>
                <div>
                  <h6 className="text-muted small mb-2 fw-semibold">Durum</h6>
                  <p className="mb-0">
                    {ticket.isDeleted ? (
                      <span
                        className="badge bg-danger px-2 py-1"
                        style={{ fontSize: "0.75rem" }}
                      >
                        Silinmiş
                      </span>
                    ) : (
                      <span
                        className="badge bg-success px-2 py-1"
                        style={{ fontSize: "0.75rem" }}
                      >
                        Aktif
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GeneralSupportTicketDetail;
