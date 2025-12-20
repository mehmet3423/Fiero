import React, { useState, useEffect, useRef } from "react";
import { ClaimContent } from "@/constants/models/trendyol/GetClaimsResponse";
import { useGetClaimIssueReasons } from "@/hooks/services/admin-trendyol-marketplace/useGetClaimIssueReasons";
import { useCreateClaimIssue } from "@/hooks/services/admin-trendyol-marketplace/useCreateClaimIssue";
import toast from "react-hot-toast";

interface ClaimActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  claim: ClaimContent | null;
  action: "accept" | "reject" | null;
  onConfirm: (claimId: string, action: "accept" | "reject", note?: string) => void;
  isLoading?: boolean;
}

const ClaimActionModal: React.FC<ClaimActionModalProps> = ({
  isOpen,
  onClose,
  claim,
  action,
  onConfirm,
  isLoading = false
}) => {
  const [note, setNote] = useState("");
  const [isModalOpenRef, setIsModalOpenRef] = useState(false);
  const [selectedReasonId, setSelectedReasonId] = useState<number | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { claimIssueReasons, isLoading: reasonsLoading } = useGetClaimIssueReasons();
  const { createClaimIssue, isPending: isCreatingIssue } = useCreateClaimIssue();

  useEffect(() => {
    const modalElement = $("#claimActionModal");

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
    const modalElement = $("#claimActionModal");

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

  const handleConfirm = async () => {
    if (claim && action) {
      if (action === "reject") {
        if (!selectedReasonId) {
          alert("Lütfen bir red sebebi seçiniz.");
          return;
        }

        const waitingClaimItems = claim.items.flatMap(item =>
          item.claimItems.filter(claimItem => claimItem.claimItemStatus.name === "WaitingInAction")
        );

        if (waitingClaimItems.length === 0) {
          alert("Reddedilebilecek iade kalemi bulunamadı.");
          return;
        }

        try {
          const claimItemIds = waitingClaimItems.map(item => item.id).join(',');

          await createClaimIssue(claim.id, {
            claimIssueReasonId: selectedReasonId,
            description: note,
            claimItemIdList: claimItemIds,
            file: uploadedFile || undefined
          });

          onClose();
        } catch (error) {
          console.error("İade red talebi oluşturulurken hata:", error);
        }
      } else {
        onConfirm(claim.id, action, note);
      }
    }
  };

  const handleClose = () => {
    setNote("");
    setSelectedReasonId(null);
    setUploadedFile(null);
    setIsDragOver(false);
    onClose();
  };

  const handleFileSelect = (files: FileList | null) => {
    if (files && files.length > 0) {
      const file = files[0];
      const maxSize = 5 * 1024 * 1024; // 5MB
      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

      if (file.size > maxSize) {
        toast.error("Dosya boyutu 5MB'den büyük olamaz.");
        return;
      }

      if (!allowedTypes.includes(file.type)) {
        toast.error("Sadece PNG, JPG, PDF, DOC ve DOCX dosyaları yüklenebilir.");
        return;
      }

      setUploadedFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const removeFile = () => {
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (!claim || !action) {
    return null;
  }

  const isAccept = action === "accept";
  const title = isAccept ? "İadeyi Kabul Et" : "İadeyi Reddet";
  const buttonClass = isAccept ? "btn-success" : "btn-danger";
  const buttonText = isAccept ? "Kabul Et" : "Reddet";

  return (
    <div
      className="modal fade"
      id="claimActionModal"
      tabIndex={-1}
      role="dialog"
      aria-labelledby="claimActionModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="claimActionModalLabel">
              {action === "reject" ? "Sorun Bildirimi Yapacağınız Ürünleri Seçiniz" : title}
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={handleClose}
              aria-label="Close"
            ></button>
          </div>

          <div className="modal-body">
            {action === "reject" ? (
              <>

                {/* Sorun Sebebi Seçimi */}
                <div className="mb-3">
                  <label className="form-label fw-semibold fs-6 mb-2">SORUN SEBEBİ SEÇİNİZ</label>
                  <div className="position-relative">
                    <select
                      className="form-select fs-5"
                      value={selectedReasonId || ""}
                      onChange={(e) => setSelectedReasonId(Number(e.target.value))}
                      disabled={reasonsLoading}
                      style={{
                        minHeight: '56px',
                        paddingRight: '200px',
                        fontSize: '16px',
                        fontWeight: '500'
                      }}
                    >
                      <option value="">Gönderdiğim ürün kusurlu değil</option>
                      {claimIssueReasons.map((reason) => (
                        <option
                          key={reason.id}
                          value={reason.id}
                          title={reason.name}
                          style={{ fontSize: '16px', fontWeight: '500' }}
                        >
                          {reason.name}
                        </option>
                      ))}
                    </select>
                    <div className="position-absolute top-50 end-0 translate-middle-y me-3">
                      <span className="text-primary fw-bold d-flex align-items-center" style={{ fontSize: '14px', color: '#6f42c1' }}>
                        🔗 <span className="ms-1">Ürün İade Red Sebepleri</span>
                      </span>
                    </div>
                  </div>
                  {selectedReasonId && (
                    <div className="mt-3 p-3 bg-light rounded border">
                      <div className="text-muted fs-6">
                        Bu iade talebini "<strong className="text-dark">{claimIssueReasons.find(r => r.id === selectedReasonId)?.name}</strong>" sebebi ile reddetmek üzeresiniz.
                      </div>
                    </div>
                  )}
                </div>

                {/* Problem Detayı */}
                <div className="mb-3">
                  <label htmlFor="problemDetail" className="form-label fw-semibold fs-6 mb-2">PROBLEM DETAYI</label>
                  <textarea
                    className="form-control fs-6"
                    id="problemDetail"
                    rows={4}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Problem detayını açıklayınız..."
                    maxLength={500}
                    style={{ fontSize: '15px', lineHeight: '1.4' }}
                  />
                  <div className="form-text text-end fw-medium d-flex justify-content-between" style={{ fontSize: '14px' }}>
                    <span className={note.trim().length > 0 && note.trim().length < 5 ? "text-danger" : "text-muted"}>
                      {note.trim().length > 0 && note.trim().length < 5 ? "Minimum 5 karakter gerekli" : ""}
                    </span>
                    <span>{note.length}/500</span>
                  </div>
                </div>

                {/* Dosya Yükleme Alanı */}
                <div className="mb-3">
                  <div
                    className={`border-2 border-dashed rounded p-4 text-center ${isDragOver ? 'border-primary bg-light' : 'border-secondary'}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    style={{ cursor: 'pointer', minHeight: '120px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="mb-2">
                      <i className="bx bx-cloud-upload text-warning" style={{ fontSize: '2rem' }}></i>
                    </div>
                    <div className="fw-bold mb-2 fs-5 text-dark">Görsel ya da Video Seç / Sürükle</div>
                    <div className="text-dark mb-2" style={{ fontSize: '14px', lineHeight: '1.5' }}>
                      5MB'ye kadar png, jpg, doc, docx veya pdf görsel dosyaları,<br />
                      100MB'ye kadar mov, mp4 video dosyalarını yükleyebilirsiniz.
                    </div>
                    <button type="button" className="btn btn-outline-warning fw-medium px-4 py-2">
                      Dosya Seç
                    </button>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    className="d-none"
                    accept=".png,.jpg,.jpeg,.pdf,.doc,.docx,.mov,.mp4"
                    onChange={(e) => handleFileSelect(e.target.files)}
                  />

                  {/* Seçilen Dosya */}
                  {uploadedFile && (
                    <div className="mt-3 p-3 bg-light rounded border d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center">
                        <i className="bx bx-file me-2 text-primary" style={{ fontSize: '20px' }}></i>
                        <div>
                          <div className="fw-medium" style={{ fontSize: '15px' }}>{uploadedFile.name}</div>
                          <div className="text-muted" style={{ fontSize: '13px' }}>({(uploadedFile.size / 1024 / 1024).toFixed(2)} MB)</div>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        onClick={removeFile}
                        title="Dosyayı kaldır"
                      >
                        <i className="bx bx-x"></i>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* Normal İade Kabul İşlemi */}
                <div className="alert alert-info">
                  <i className="bx bx-info-circle me-2"></i>
                  <strong>İade No:</strong> {claim.id} | <strong>Sipariş No:</strong> {claim.orderNumber}
                </div>

                <div className="mb-3">
                  <label htmlFor="actionNote" className="form-label">
                    Kabul Notu (Opsiyonel)
                  </label>
                  <textarea
                    className="form-control"
                    id="actionNote"
                    rows={4}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="İade kabul notu yazabilirsiniz..."
                  />
                </div>

                {/* Ürün Listesi */}
                <div className="mb-3">
                  <h6 className="text-primary mb-2">İade Edilen Ürünler</h6>
                  <div className="table-responsive">
                    <table className="table table-sm">
                      <thead>
                        <tr>
                          <th>Ürün Adı</th>
                          <th>Barkod</th>
                          <th>Miktar</th>
                          <th>Fiyat</th>
                        </tr>
                      </thead>
                      <tbody>
                        {claim.items.map((itemContainer, index) => (
                          <tr key={index}>
                            <td>
                              <strong>{itemContainer.orderLine.productName}</strong>
                              <br />
                              <small className="text-muted">
                                {itemContainer.orderLine.productColor} - {itemContainer.orderLine.productSize}
                              </small>
                            </td>
                            <td>{itemContainer.orderLine.barcode}</td>
                            <td>
                              {itemContainer.claimItems.length} adet
                            </td>
                            <td>
                              {new Intl.NumberFormat("tr-TR", {
                                style: "currency",
                                currency: "TRY",
                              }).format(itemContainer.orderLine.price)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Uyarı Mesajı */}
                <div className="alert alert-warning">
                  <i className="bx bx-info-circle me-2"></i>
                  <strong>Dikkat:</strong> Bu işlem geri alınamaz. İadeyi kabul etmeden önce tüm detayları kontrol ettiğinizden emin olun.
                </div>
              </>
            )}
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleClose}
              disabled={isLoading || isCreatingIssue}
            >
              Vazgeç
            </button>
            <button
              type="button"
              className={`btn ${action === "reject" ? "btn-warning" : buttonClass}`}
              onClick={handleConfirm}
              disabled={
                isLoading ||
                isCreatingIssue ||
                (action === "reject" && (!selectedReasonId || !note.trim() || note.trim().length < 5))
              }
            >
              {(isLoading || isCreatingIssue) ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  İşleniyor...
                </>
              ) : (
                <>
                  {action === "reject" ? "Onayla" : buttonText}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClaimActionModal;
