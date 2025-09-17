import React, { useEffect, useRef } from "react";
import { ShipmentPackage } from "@/constants/models/trendyol/GetShipmentPackagesRequest";

interface DeleteInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  shipmentPackage: ShipmentPackage | null;
  isLoading: boolean;
}

const DeleteInvoiceModal: React.FC<DeleteInvoiceModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  shipmentPackage,
  isLoading
}) => {
  const isModalOpenRef = useRef(false);

  useEffect(() => {
    const modalElement = $("#deleteInvoiceModal");

    if (isOpen) {
      // Modal'ı göster
      isModalOpenRef.current = true;
      modalElement.modal("show");
    } else {
      // Modal'ı gizle
      isModalOpenRef.current = false;
      modalElement.modal("hide");

      // Backdrop'u temizle
      setTimeout(() => {
        $(".modal-backdrop").remove();
        $("body").removeClass("modal-open");
        $("body").css("padding-right", "");
      }, 150);
    }
  }, [isOpen]);

  // Bootstrap modal event listener'ları ekle
  useEffect(() => {
    const modalElement = $("#deleteInvoiceModal");

    const handleModalHidden = () => {
      // Modal tamamen kapatıldığında React state'ini güncelle
      // Sadece modal React state'inde açık olarak işaretlenmişse onClose'u çağır
      if (isModalOpenRef.current) {
        isModalOpenRef.current = false;

        // Backdrop'u temizle
        $(".modal-backdrop").remove();
        $("body").removeClass("modal-open");
        $("body").css("padding-right", "");

        onClose();
      }
    };

    // Modal kapatılma event'ini dinle
    modalElement.on("hidden.bs.modal", handleModalHidden);

    // Cleanup function
    return () => {
      modalElement.off("hidden.bs.modal", handleModalHidden);
    };
  }, [onClose]);

  if (!shipmentPackage) {
    return null;
  }

  return (
    <div
      className="modal fade"
      id="deleteInvoiceModal"
      tabIndex={-1}
      aria-labelledby="deleteInvoiceModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="deleteInvoiceModalLabel">
              <i className="bx bx-trash me-2 text-danger"></i>
              Faturayı Sil
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            <div className="alert alert-warning">
              <i className="bx bx-exclamation-triangle me-2"></i>
              <strong>Dikkat:</strong> Bu işlem geri alınamaz!
            </div>

            <p className="mb-3" style={{ fontSize: '1.1rem', color: '#2c3e50', fontWeight: '500' }}>
              <strong>Sipariş #{shipmentPackage.orderNumber}</strong> için yüklenen fatura silinecektir.
            </p>

            <div className="alert alert-info">
              <i className="bx bx-info-circle me-2"></i>
              <div>
                <strong>Fatura Silme Kuralları:</strong>
                <ul className="mb-0 mt-2">
                  <li>İlgili siparişe ait faturayı yanlış yüklediğiniz durumda faturayı silebilirsiniz.</li>
                  <li>Faturayı sil işleminden sonra siparişe ait doğru faturayı sisteme tekrar yüklemeniz gerekmektedir.</li>
                </ul>
              </div>
            </div>

            <p className="mb-0" style={{ fontSize: '1.1rem', color: '#2c3e50', fontWeight: '500' }}>
              <strong>Seçtiğiniz fatura silinecektir onaylıyor musunuz?</strong>
            </p>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
              onClick={onClose}
              disabled={isLoading}
            >
              Vazgeç
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={onConfirm}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Siliniyor...
                </>
              ) : (
                <>
                  <i className="bx bx-trash me-2"></i>
                  Faturayı Sil
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteInvoiceModal;
