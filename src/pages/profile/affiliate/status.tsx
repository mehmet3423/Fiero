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
    <>
      <div className="affiliate-status-content">
        {/* Statistics Cards */}
        {affiliateUser.status === AffiliateStatus.Approved && (
          <div className="row mb-4">
            <div className="col-3">
              <div className="card h-100 text-center shadow-sm border-0 rounded-4 transition-all">
                <div className="card-body py-3 px-2">
                  <div className="card-icon mb-2">
                    <i className="bx bx-money text-success" style={{ fontSize: "2.5rem" }}></i>
                  </div>
                  <h6 className="card-title text-uppercase text-muted mb-1 fw-bold" style={{ fontSize: "0.7rem", letterSpacing: "0.5px" }}>
                    TOPLAM KAZANÇ
                  </h6>
                  <h4 className="text-success mb-0 fw-bold" style={{ fontSize: "1.5rem" }}>
                    {affiliateUser.totalEarnings?.toFixed(2) || "0.00"} ₺
                  </h4>
                </div>
              </div>
            </div>

            <div className="col-3">
              <div className="card h-100 text-center shadow-sm border-0 rounded-4 transition-all">
                <div className="card-body py-3 px-2">
                  <div className="card-icon mb-2">
                    <i className="bx bx-transfer text-info" style={{ fontSize: "2.5rem" }}></i>
                  </div>
                  <h6 className="card-title text-uppercase text-muted mb-1 fw-bold" style={{ fontSize: "0.7rem", letterSpacing: "0.5px" }}>
                    AKTARILABİLİR
                  </h6>
                  <h4 className="text-info mb-0 fw-bold" style={{ fontSize: "1.5rem" }}>
                    {affiliateUser.transferableEarnings?.toFixed(2) || "0.00"} ₺
                  </h4>
                </div>
              </div>
            </div>

            <div className="col-3">
              <div className="card h-100 text-center shadow-sm border-0 rounded-4 transition-all">
                <div className="card-body py-3 px-2">
                  <div className="card-icon mb-2">
                    <i className="bx bx-time-five text-warning" style={{ fontSize: "2.5rem" }}></i>
                  </div>
                  <h6 className="card-title text-uppercase text-muted mb-1 fw-bold" style={{ fontSize: "0.7rem", letterSpacing: "0.5px" }}>
                    ONAY BEKLEYEN
                  </h6>
                  <h4 className="text-warning mb-0 fw-bold" style={{ fontSize: "1.5rem" }}>
                    {affiliateUser.pendingApprovalEarnings?.toFixed(2) || "0.00"} ₺
                  </h4>
                </div>
              </div>
            </div>

            <div className="col-3">
              <div className="card h-100 text-center shadow-sm border-0 rounded-4 transition-all">
                <div className="card-body py-3 px-2">
                  <div className="card-icon mb-2">
                    <i className="bx bx-check-circle text-primary" style={{ fontSize: "2.5rem" }}></i>
                  </div>
                  <h6 className="card-title text-uppercase text-muted mb-1 fw-bold" style={{ fontSize: "0.7rem", letterSpacing: "0.5px" }}>
                    TRANSFER EDİLEN
                  </h6>
                  <h4 className="text-primary mb-0 fw-bold" style={{ fontSize: "1.5rem" }}>
                    {affiliateUser.transferredEarnings?.toFixed(2) || "0.00"} ₺
                  </h4>
                </div>
              </div>
            </div>
          </div>
        )}

        {affiliateUser.appliedAt && (
          <div className="card shadow-sm border-0 rounded-4 mb-4">
            <div className="card-body p-4">
              <div className="row g-3">
                <div className="col-md-6">
                  <div className="d-flex align-items-center">
                    <i className="bx bx-calendar text-muted me-2"></i>
                    <div>
                      <small className="text-muted d-block">Başvuru Tarihi</small>
                      <span className="fw-semibold">
                        {new Date(affiliateUser.appliedAt).toLocaleDateString(
                          "tr-TR",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </span>
                    </div>
                  </div>
                </div>
                {affiliateUser.status === AffiliateStatus.Approved &&
                  affiliateUser.affiliateSince && (
                    <div className="col-md-6">
                      <div className="d-flex align-items-center">
                        <i className="bx bx-check-circle text-success me-2"></i>
                        <div>
                          <small className="text-muted d-block">
                            Affiliate Olma Tarihi
                          </small>
                          <span className="fw-semibold">
                            {new Date(
                              affiliateUser.affiliateSince
                            ).toLocaleDateString("tr-TR", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
              </div>
            </div>
          </div>
        )}

        <div className="card shadow-sm border-0 rounded-4 mb-4">
          <div className="card-body p-4" style={{
            borderLeft: `4px solid ${getStatusColor(affiliateUser.status)}`,
          }}>
            <div className="d-flex justify-content-between align-items-start">
              <div className="flex-grow-1">
                <h5 className="card-title mb-2">Başvuru Durumu</h5>
                <div className="text-muted">
                  {affiliateUser.status === AffiliateStatus.InProgress && (
                    <div>
                      <i className="bx bx-info-circle me-2 text-warning"></i>
                      <span>Affiliate başvurunuz inceleniyor.</span>
                      <br />
                      <small className="text-muted mt-2 d-block">
                        <strong>Not:</strong> Başvurunuz değerlendirilene
                        kadar yeni başvuru yapamazsınız.
                      </small>
                    </div>
                  )}
                  {affiliateUser.status === AffiliateStatus.Approved && (
                    <div>
                      <i className="bx bx-check-circle me-2 text-success"></i>
                      <span>Affiliate hesabınız onaylandı.</span>
                    </div>
                  )}
                  {affiliateUser.status === AffiliateStatus.Rejected && (
                    <div>
                      <i className="bx bx-x-circle me-2 text-danger"></i>
                      <span>Affiliate başvurunuz reddedildi. Daha fazla bilgi için
                      destek ekibimizle iletişime geçebilirsiniz.</span>
                    </div>
                  )}
                  {affiliateUser.status === AffiliateStatus.Cancelled && (
                    <div>
                      <i className="bx bx-pause-circle me-2 text-danger"></i>
                      <span>Affiliate hesabınız iptal edildi. Destek ekibimizle
                      iletişime geçin.</span>
                    </div>
                  )}
                  {affiliateUser.status === AffiliateStatus.Suspended && (
                    <div>
                      <i className="bx bx-lock-alt me-2 text-warning"></i>
                      <span>Affiliate hesabınız askıya alındı. Destek ekibimizle
                      iletişime geçin.</span>
                    </div>
                  )}
                </div>
              </div>
              <span
                className="badge fs-6 px-3 py-2 ms-3"
                style={{
                  backgroundColor: getStatusColor(affiliateUser.status),
                  color: "white",
                }}
              >
                {getStatusText(affiliateUser.status)}
              </span>
            </div>
          </div>
        </div>

        {(affiliateUser.status === AffiliateStatus.Approved ||
          affiliateUser.status === AffiliateStatus.InProgress) && (
          <div className="row g-3 justify-content-center">
            <div className="col-sm-6 col-md-4">
              <button
                className="btn btn-dark rounded-pill w-100 py-2"
                onClick={handleEditUserStatus}
                title="IBAN Bilgilerini Güncelle"
              >
                <i className="bx bx-edit me-2"></i>
                IBAN Güncelle
              </button>
            </div>
            <div className="col-sm-6 col-md-4">
              <button
                className="btn btn-outline-danger rounded-pill w-100 py-2"
                onClick={handleCancelAccount}
                title="Affiliate Hesabını Kapat"
              >
                <i className="bx bx-trash me-2"></i>
                Hesabı Kapat
              </button>
            </div>
          </div>
        )}
      </div>

      {/* IBAN Güncelleme Modal */}
      <GeneralModal
        id="editUserStatusModal"
        title="IBAN Bilgilerini Güncelle"
        size="md"
        onClose={() => setIsEditingUserStatus(false)}
        onApprove={handleSaveUserStatus}
        approveButtonText="IBAN Güncelle"
        approveButtonClassName="btn-dark"
        isLoading={isUpdatingStatus}
        showFooter={true}
      >
        <div className="mb-4">
          <label className="form-label fw-semibold">
            IBAN <span className="text-danger">*</span>
          </label>
          <div className="input-group">
            <span className="input-group-text bg-light border-end-0">TR</span>
            <input
              type="text"
              className="form-control border-start-0"
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
          <small className="form-text text-muted mt-1">
            24 haneli IBAN numaranızı giriniz (TR otomatik eklenir)
          </small>
          {editUserForm.iban &&
            editUserForm.iban.startsWith("TR") &&
            !validateIban(editUserForm.iban.slice(2)) &&
            editUserForm.iban.length > 6 && (
              <small className="form-text text-danger mt-1">
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
        .affiliate-status-content {
          padding: 1.5rem 0;
        }

        /* Card hover effects */
        .card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1) !important;
        }

        /* Statistics card titles */
        .card h6.card-title {
          font-size: 0.7rem;
          color: #8c9196;
          letter-spacing: 1px;
        }

        .card h4 {
          font-size: 1.6rem;
          line-height: 1.2;
        }

        /* Button hover effects */
        .btn:hover {
          transform: translateY(-2px);
        }

        /* IBAN Input - remove focus shadow */
        .input-group .form-control:focus {
          box-shadow: none;
          outline: none;
        }

        .form-control:focus {
          box-shadow: none;
          outline: none;
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .affiliate-status-content {
            padding: 0.75rem 0;
          }

          .card h4 {
            font-size: 1.25rem;
          }

          .card h6.card-title {
            font-size: 0.6rem;
          }
        }

        @media (max-width: 576px) {
          .row .col-3 {
            flex: 0 0 50%;
            max-width: 50%;
            margin-bottom: 1rem;
          }

          .card h4 {
            font-size: 1.1rem;
          }

          .card h6.card-title {
            font-size: 0.55rem;
          }
        }
      `}</style>
    </>
  );
}
