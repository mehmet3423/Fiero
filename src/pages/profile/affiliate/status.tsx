import { useState, useEffect } from "react";
import {
  AffiliateStatus,
  UpdateAffiliateStatusByUserRequest,
} from "@/constants/models/Affiliate";
import { useUpdateAffiliateStatusByUser } from "@/hooks/services/affiliate/useUpdateAffiliateStatusByUser";
import GeneralModal from "@/components/shared/GeneralModal";
import ConfirmModal from "@/components/shared/ConfirmModal";
import toast from "react-hot-toast";

interface AffiliateStatusPageProps {
  affiliateUser: any;
  refetchAffiliateUser: () => Promise<any>;
}

export default function AffiliateStatusPage({
  affiliateUser,
  refetchAffiliateUser,
}: AffiliateStatusPageProps) {
  // Edit User Status State
  const [isEditingUserStatus, setIsEditingUserStatus] = useState(false);
  const [editUserForm, setEditUserForm] = useState({
    iban: "",
  });

  // Local state for updated IBAN to persist changes
  const [currentIban, setCurrentIban] = useState(affiliateUser?.iban || "");

  const { updateStatusByUser, isPending: isUpdatingStatus } =
    useUpdateAffiliateStatusByUser();

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

  // Full IBAN oluşturma (TR + 24 haneli rakam)
  const getFullIban = (numbers: string) => {
    const cleanNumbers = numbers.replace(/\s/g, "");
    return `TR${cleanNumbers}`;
  };

  const handleIbanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Sadece rakam girişine izin ver, 24 haneli sınır
    const numbers = e.target.value.replace(/[^0-9]/g, "").slice(0, 24);
    const formattedNumbers = formatIban(numbers);
    setEditUserForm((prev) => ({
      ...prev,
      iban: getFullIban(formattedNumbers),
    }));
  };

  // affiliateUser prop'u değiştiğinde currentIban'ı güncelle
  useEffect(() => {
    if (affiliateUser?.iban) {
      setCurrentIban(affiliateUser.iban);
    }
  }, [affiliateUser?.iban]);

  // Modal açıldığında form'u güncel veriyle doldur
  useEffect(() => {
    if (isEditingUserStatus) {
      // Mevcut IBAN'dan sadece rakamları al ve formatla
      if (currentIban && currentIban.startsWith("TR")) {
        const numbers = currentIban.slice(2); // TR'yi çıkar
        const formattedNumbers = formatIban(numbers);
        setEditUserForm({
          iban: currentIban, // Tam IBAN'ı sakla
        });
      } else {
        setEditUserForm({
          iban: currentIban,
        });
      }
    }
  }, [isEditingUserStatus, currentIban]);

  const getStatusText = (status: AffiliateStatus) => {
    switch (status) {
      case AffiliateStatus.InProgress:
        return "Devam Ediyor";
      case AffiliateStatus.Approved:
        return "Onaylandı";
      case AffiliateStatus.Rejected:
        return "Reddedildi";
      case AffiliateStatus.Cancelled:
        return "İptal Edildi";
      case AffiliateStatus.Suspended:
        return "Askıya Alındı";
      default:
        return "Bilinmiyor";
    }
  };

  const getStatusColor = (status: AffiliateStatus) => {
    switch (status) {
      case AffiliateStatus.InProgress:
        return "#ffc107";
      case AffiliateStatus.Approved:
        return "#28a745";
      case AffiliateStatus.Rejected:
        return "#dc3545";
      case AffiliateStatus.Cancelled:
        return "#dc3545";
      case AffiliateStatus.Suspended:
        return "#ffc107";
      default:
        return "#6c757d";
    }
  };

  const handleEditUserStatus = () => {
    // Mevcut IBAN'dan sadece rakamları al ve formatla
    if (currentIban && currentIban.startsWith("TR")) {
      setEditUserForm({
        iban: currentIban, // Tam IBAN'ı sakla
      });
    } else {
      setEditUserForm({
        iban: currentIban,
      });
    }
    setIsEditingUserStatus(true);
    $("#editUserStatusModal").modal("show");
  };

  const handleCancelAccount = () => {
    $("#cancelConfirmModal").modal("show");
  };

  const handleSaveUserStatus = async () => {
    if (!affiliateUser) return;

    // IBAN validation
    if (!editUserForm.iban.trim()) {
      toast.error("IBAN alanı boş bırakılamaz");
      return;
    }

    if (!editUserForm.iban.startsWith("TR")) {
      toast.error("IBAN TR ile başlamalıdır");
      return;
    }

    if (editUserForm.iban.length !== 26) {
      toast.error("IBAN 26 karakter olmalıdır");
      return;
    }

    // 24 haneli rakam kontrolü için yeni validation
    const ibanNumbers = editUserForm.iban.slice(2);
    if (!validateIban(ibanNumbers)) {
      toast.error("Lütfen 24 haneli geçerli bir IBAN numarası girin");
      return;
    }

    try {
      const statusData: UpdateAffiliateStatusByUserRequest = {
        id: affiliateUser.id || "",
        iban: editUserForm.iban,
      };

      await updateStatusByUser(statusData);

      // Local state'i güncelle
      setCurrentIban(editUserForm.iban);

      $("#editUserStatusModal").modal("hide");
      setIsEditingUserStatus(false);
    } catch (error) {
      console.error("Error updating user status:", error);
      toast.error("IBAN güncellenirken bir hata oluştu!");
    }
  };

  const handleConfirmCancel = async () => {
    if (!affiliateUser) return;

    try {
      const statusData: UpdateAffiliateStatusByUserRequest = {
        id: affiliateUser.id || "",
        iban: currentIban, // Güncel IBAN'ı kullan
        status: AffiliateStatus.Cancelled,
      };

      await updateStatusByUser(statusData);
      $("#cancelConfirmModal").modal("hide");

      // Başarılı iptal sonrası affiliate verilerini yeniden yükle
      await refetchAffiliateUser();

      toast.success("Affiliate hesabınız başarıyla iptal edildi!");
    } catch (error) {
      console.error("Error cancelling affiliate account:", error);
      toast.error("Hesap iptal edilirken bir hata oluştu!");
    }
  };

  return (
    <div className="affiliate-status-content">
      <div className="card">
        <div className="card-body p-5">
          <div className="text-center mb-4">
            <div className="affiliate-icon mb-4">
              <i className="bx bx-user-check"></i>
            </div>
            <h3
              style={{
                fontSize: "2rem",
                color: "#566a7f",
                marginBottom: "1.5rem",
                fontWeight: "600",
              }}
            >
              Affiliate Durumunuz
            </h3>
          </div>

          <div className="row justify-content-center">
            <div className="col-md-8">
              {affiliateUser.status === AffiliateStatus.Approved && (
                <div className="earnings-overview p-4">
                  <h5 className="mb-3 text-success">
                    <i className="bx bx-money me-2"></i>
                    Kazanç Bilgileri
                  </h5>
                  <div className="row">
                    <div className="col-md-3 text-center">
                      <div className="earning-item">
                        <h4 className="mb-1 text-success">
                          {affiliateUser.totalEarnings?.toFixed(2) || "0.00"}₺
                        </h4>
                        <small className="text-muted">Toplam Kazanç</small>
                      </div>
                    </div>
                    <div className="col-md-3 text-center">
                      <div className="earning-item">
                        <h4 className="mb-1 text-primary">
                          {affiliateUser.transferableEarnings?.toFixed(2) ||
                            "0.00"}
                          ₺
                        </h4>
                        <small className="text-muted">
                          Transfer Edilebilir
                        </small>
                      </div>
                    </div>
                    <div className="col-md-3 text-center">
                      <div className="earning-item">
                        <h4 className="mb-1 text-warning">
                          {affiliateUser.pendingApprovalEarnings?.toFixed(2) ||
                            "0.00"}
                          ₺
                        </h4>
                        <small className="text-muted">Onay Bekleyen</small>
                      </div>
                    </div>
                    <div className="col-md-3 text-center">
                      <div className="earning-item">
                        <h4 className="mb-1 text-info">
                          {affiliateUser.transferredEarnings?.toFixed(2) ||
                            "0.00"}
                          ₺
                        </h4>
                        <small className="text-muted">Transfer Edilmiş</small>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {affiliateUser.appliedAt && (
                <div
                  className="info-card p-3 mb-4"
                  style={{
                    backgroundColor: "#f8f9fa",
                    borderRadius: "0.5rem",
                    border: "1px solid #dee2e6",
                  }}
                >
                  <div className="row">
                    <div className="col-md-6">
                      <small className="text-muted">Başvuru Tarihi</small>
                      <p className="mb-0 fw-bold">
                        {new Date(affiliateUser.appliedAt).toLocaleDateString(
                          "tr-TR",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </p>
                    </div>
                    {affiliateUser.status === AffiliateStatus.Approved &&
                      affiliateUser.affiliateSince && (
                        <div className="col-md-6">
                          <small className="text-muted">
                            Affiliate Olma Tarihi
                          </small>
                          <p className="mb-0 fw-bold">
                            {new Date(
                              affiliateUser.affiliateSince
                            ).toLocaleDateString("tr-TR", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                      )}
                  </div>
                </div>
              )}

              <div
                className="status-card p-4 mb-4"
                style={{
                  backgroundColor: "#f8f9fa",
                  borderRadius: "0.5rem",
                  border: `2px solid ${getStatusColor(affiliateUser.status)}`,
                }}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="mb-1">Başvuru Durumu</h5>
                    <p className="mb-0 text-muted">
                      {affiliateUser.status === AffiliateStatus.InProgress && (
                        <div>
                          <i className="bx bx-info-circle me-2"></i>
                          Affiliate başvurunuz inceleniyor.
                          <br />
                          <small className="text-muted mt-2 d-block">
                            <strong>Not:</strong> Başvurunuz değerlendirilene
                            kadar yeni başvuru yapamazsınız.
                          </small>
                        </div>
                      )}
                      {affiliateUser.status === AffiliateStatus.Approved && (
                        <div>
                          <i className="bx bx-check-circle me-2"></i>
                          Affiliate hesabınız onaylandı.
                          <br />
                        </div>
                      )}

                      {affiliateUser.status === AffiliateStatus.Rejected && (
                        <div>
                          <i className="bx bx-x-circle me-2"></i>
                          Affiliate başvurunuz reddedildi. Daha fazla bilgi için
                          destek ekibimizle iletişime geçebilirsiniz.
                          <br />
                        </div>
                      )}

                      {affiliateUser.status === AffiliateStatus.Cancelled && (
                        <div>
                          <i className="bx bx-pause-circle me-2"></i>
                          Affiliate hesabınız iptal edildi. Destek ekibimizle
                          iletişime geçin.
                        </div>
                      )}

                      {affiliateUser.status === AffiliateStatus.Suspended && (
                        <div>
                          <i className="bx bx-lock-alt me-2"></i>
                          Affiliate hesabınız askıya alındı. Destek ekibimizle
                          iletişime geçin.
                        </div>
                      )}
                    </p>
                  </div>
                  <div className="d-flex align-items-center gap-3">
                    <span
                      className="badge px-3 py-2"
                      style={{
                        backgroundColor: getStatusColor(affiliateUser.status),
                        color: "white",
                        fontSize: "1rem",
                      }}
                    >
                      {getStatusText(affiliateUser.status)}
                    </span>
                  </div>
                </div>
              </div>
              {(affiliateUser.status === AffiliateStatus.Approved ||
                affiliateUser.status === AffiliateStatus.InProgress) && (
                <div className="d-flex justify-content-center gap-3 my-3">
                  <button
                    className="btn btn-sm btn-light w-100 col-md-5"
                    onClick={handleEditUserStatus}
                    title="Bilgileri Düzenle"
                  >
                    <i className="bx bx-edit me-2"></i>
                    IBAN Güncelle
                  </button>
                  <button
                    className="btn btn-sm btn-danger w-100 col-md-5 ml-3"
                    onClick={handleCancelAccount}
                    title="Hesabı İptal Et"
                  >
                    <i className="bx bx-trash me-2"></i>
                    Hesabını Kapat
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* IBAN Güncelleme Modal */}
      <GeneralModal
        id="editUserStatusModal"
        title="IBAN Bilgilerini Güncelle"
        size="md"
        onClose={() => setIsEditingUserStatus(false)}
        onApprove={handleSaveUserStatus}
        approveButtonText="IBAN Güncelle"
        isLoading={isUpdatingStatus}
        showFooter={true}
      >
        <div className="form-group mb-3">
          <label className="form-label">
            IBAN <span className="text-danger">*</span>
          </label>
          <div className="input-group">
            <span className="input-group-text">TR</span>
            <input
              type="text"
              className="form-control"
              placeholder="0000 0000 0000 0000 0000 0000"
              value={
                editUserForm.iban.startsWith("TR")
                  ? formatIban(editUserForm.iban.slice(2))
                  : editUserForm.iban
              }
              onChange={handleIbanChange}
              maxLength={29} // 24 digits + 5 spaces
              inputMode="numeric"
              pattern="[0-9\s]*"
            />
          </div>
          <small className="form-text text-muted">
            24 haneli IBAN numaranızı giriniz (TR otomatik eklenir)
          </small>
          {editUserForm.iban &&
            editUserForm.iban.startsWith("TR") &&
            !validateIban(editUserForm.iban.slice(2)) &&
            editUserForm.iban.length > 6 && (
              <small className="form-text text-danger">
                Geçersiz IBAN formatı (24 haneli rakam gerekli)
              </small>
            )}
        </div>
      </GeneralModal>

      {/* İptal Onay Modal */}
      <GeneralModal
        id="cancelConfirmModal"
        title="Affiliate Hesabı İptali"
        showFooter={false}
      >
        <ConfirmModal
          onConfirm={handleConfirmCancel}
          isLoading={isUpdatingStatus}
          title="Affiliate Hesabınızı İptal Etmek İstediğinizden Emin misiniz?"
          message="Bu işlem GERİ ALINAMAZ! Tüm kazançlarınız, bağlantılarınız ve verileriniz kalıcı olarak silinecektir. Yeniden affiliate olmak için baştan başvuru yapmanız gerekecektir."
          confirmButtonText={
            isUpdatingStatus ? "İptal Ediliyor..." : "Evet, Hesabımı İptal Et"
          }
          cancelButtonText="Hayır, Vazgeç"
        />
      </GeneralModal>

      <style jsx>{`
        .affiliate-icon {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: #e7e7ff;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
        }

        .affiliate-icon i {
          font-size: 4rem;
          color: #040404;
        }

        .card {
          border-radius: 0.75rem;
          border: 1px solid #eee;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
        }

        @media (max-width: 768px) {
          .affiliate-icon {
            width: 100px;
            height: 100px;
          }

          .affiliate-icon i {
            font-size: 3rem;
          }
        }

        /* IBAN Input Styles */
        .input-group-text {
          background-color: #f8f9fa;
          border: 1px solid #ebebeb;
          font-weight: 600;
          max-height: 40px;
          color: #333;
        }

        .input-group .form-control {
          border-left: 0;
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
    </div>
  );
}
