import React, { useEffect, useRef } from 'react';

interface ShipmentAddress {
  firstName: string;
  lastName: string;
  city: string;
  district: string;
  neighborhoodId: number;
  fullAddress: string;
  countryCode: string;
  postalCode: string;
  latitude: string;
  longitude: string;
}

interface InvoiceAddress {
  company: string;
  taxNumber?: string;
  city: string;
  district: string;
  fullAddress: string;
}

interface ShipmentPackage {
  id: number;
  orderNumber: string;
  grossAmount: number;
  totalDiscount: number;
  totalTyDiscount: number;
  totalPrice: number;
  status: string;
  lastModifiedDate: number;
  orderDate: number;
  agreedDeliveryDate?: number;
  commercial: boolean;
  shipmentAddress: ShipmentAddress;
  invoiceAddress: InvoiceAddress;
  lines: any[];
  cargoTrackingNumber?: string;
  cargoTrackingLink?: string;
  cargoProviderName?: string;
}

interface InvoiceInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  shipmentPackage: ShipmentPackage | null;
}

const InvoiceInfoModal: React.FC<InvoiceInfoModalProps> = ({
  isOpen,
  onClose,
  shipmentPackage
}) => {
  const isModalOpenRef = useRef(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // TODO: Add toast notification
  };

  useEffect(() => {
    const modalElement = $("#faturaBilgileriModal");

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
    const modalElement = $("#faturaBilgileriModal");

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
      id="faturaBilgileriModal"
      tabIndex={-1}
      aria-labelledby="faturaBilgileriModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="faturaBilgileriModalLabel">
              Fatura Bilgileri
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
            {/* Warning Banner */}
            <div className="alert alert-danger d-flex align-items-center mb-4" role="alert" style={{ border: '1px solid #dc3545', backgroundColor: '#f8d7da' }}>
              <i className="bx bx-error-circle me-2 text-danger"></i>
              <div>
                <strong>Dikkat Teslimat ve Fatura Adresi Farklı!</strong>
              </div>
            </div>

            {/* Teslimat Adresi */}
            <div className="mb-4">
              <h6 className="fw-bold mb-3 text-dark">Teslimat Adresi</h6>
              <div className="mb-3">
                <div className="d-flex align-items-center">
                  <span className="fw-bold me-2 text-dark" style={{ minWidth: '80px', fontSize: '14px' }}>Ad-Soyad:</span>
                  <span className="me-2 text-dark" style={{ fontSize: '14px' }}>
                    {shipmentPackage.shipmentAddress.firstName} {shipmentPackage.shipmentAddress.lastName}
                  </span>
                  <button
                    className="btn btn-sm btn-link p-0"
                    onClick={() => copyToClipboard(`${shipmentPackage.shipmentAddress.firstName} ${shipmentPackage.shipmentAddress.lastName}`)}
                    title="Kopyala"
                  >
                    <i className="bx bx-copy text-secondary" style={{ fontSize: '14px' }}></i>
                  </button>
                </div>
              </div>
              <div className="mb-3">
                <div className="d-flex align-items-center">
                  <span className="fw-bold me-2 text-dark" style={{ minWidth: '80px', fontSize: '14px' }}>Adres:</span>
                  <span className="me-2 text-dark" style={{ fontSize: '14px' }}>
                    {shipmentPackage.shipmentAddress.fullAddress} {shipmentPackage.shipmentAddress.district}/{shipmentPackage.shipmentAddress.city}
                  </span>
                  <button
                    className="btn btn-sm btn-link p-0"
                    onClick={() => copyToClipboard(`${shipmentPackage.shipmentAddress.fullAddress} ${shipmentPackage.shipmentAddress.district}/${shipmentPackage.shipmentAddress.city}`)}
                    title="Kopyala"
                  >
                    <i className="bx bx-copy text-secondary" style={{ fontSize: '14px' }}></i>
                  </button>
                </div>
              </div>
            </div>

            {/* Fatura Adresi */}
            <div className="mb-4">
              <h6 className="fw-bold mb-3 text-dark">Fatura Adresi</h6>
              <div className="mb-3">
                <div className="d-flex align-items-center">
                  <span className="fw-bold me-2 text-dark" style={{ minWidth: '80px', fontSize: '14px' }}>Ad-Soyad:</span>
                  <span className="me-2 text-dark" style={{ fontSize: '14px' }}>
                    {shipmentPackage.shipmentAddress.firstName} {shipmentPackage.shipmentAddress.lastName}
                  </span>
                  <button
                    className="btn btn-sm btn-link p-0"
                    onClick={() => copyToClipboard(`${shipmentPackage.shipmentAddress.firstName} ${shipmentPackage.shipmentAddress.lastName}`)}
                    title="Kopyala"
                  >
                    <i className="bx bx-copy text-secondary" style={{ fontSize: '14px' }}></i> 
                  </button>
                </div>
              </div>
              <div className="mb-3">
                <div className="d-flex align-items-center">
                  <span className="fw-bold me-2 text-dark" style={{ minWidth: '80px', fontSize: '14px' }}>Adres:</span>
                  <span className="me-2 text-dark" style={{ fontSize: '14px' }}>
                    {shipmentPackage.invoiceAddress.fullAddress} {shipmentPackage.invoiceAddress.district}/{shipmentPackage.invoiceAddress.city}
                  </span>
                  <button
                    className="btn btn-sm btn-link p-0"
                    onClick={() => copyToClipboard(`${shipmentPackage.invoiceAddress.fullAddress} ${shipmentPackage.invoiceAddress.district}/${shipmentPackage.invoiceAddress.city}`)}
                    title="Kopyala"
                  >
                    <i className="bx bx-copy text-secondary" style={{ fontSize: '14px' }}></i>
                  </button>
                </div>
              </div>
              <div className="mb-3">
                <div className="d-flex align-items-center">
                  <span className="fw-bold me-2 text-dark" style={{ minWidth: '80px', fontSize: '14px' }}>E-Fatura Mükellefi:</span>
                  <span className="me-2 text-dark" style={{ fontSize: '14px' }}>Hayır</span>
                </div>
              </div>
            </div>

            <div className="mb-3">
              <div className="d-flex align-items-center mb-2">
                <i className="bx bx-info-circle text-primary me-2"></i>
                <span className="fw-bold me-2 text-dark" style={{ fontSize: '14px' }}>E-Posta Adresi:</span>
                <span className="me-2 text-dark" style={{ fontSize: '14px' }}>pftest+de4nyzlm@trendyolmail.com</span>
                <button
                  className="btn btn-sm btn-link p-0"
                  onClick={() => copyToClipboard("pftest+de4nyzlm@trendyolmail.com")}
                  title="Kopyala"
                >
                  <i className="bx bx-copy text-secondary" style={{ fontSize: '14px' }}></i>
                </button>
              </div>
              <div className="d-flex align-items-center">
                <span className="fw-bold me-2 text-dark" style={{ minWidth: '100px', fontSize: '14px' }}>Telefon Numarası:</span>
                <span className="me-2 text-dark" style={{ fontSize: '14px' }}>5000000000</span>
                <button
                  className="btn btn-sm btn-link p-0"
                  onClick={() => copyToClipboard("5000000000")}
                  title="Kopyala"
                >
                  <i className="bx bx-copy text-secondary" style={{ fontSize: '14px' }}></i>
                </button>
              </div>
            </div>

            {/* Info Box */}
            <div className="alert alert-info d-flex align-items-start" role="alert" style={{ backgroundColor: '#d1ecf1', border: '1px solid #bee5eb' }}>
              <i className="bx bx-info-circle me-2 mt-1 text-info"></i>
              <div style={{ fontSize: '14px' }}>
                Faturanızı <strong>"Fatura İşlemleri"</strong> altındaki <strong>"Fatura Yükle"</strong> alanınna pdf, jpeg, jpg, png dosya türlerinde yükleyerek otomatik olarak müşteriye gönderebilir ya da yukarıdaki e-posta adresini kopyalayıp iletebilirsiniz. Entegratörle çalışıyorsanız <span className="text-decoration-underline">entegrasyon bilgilerinizi buradan faturalayabilirsiniz.</span>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-outline-secondary" data-bs-dismiss="modal">
              Vazgeç
            </button>
            <button type="button" className="btn btn-warning text-white">
              Yazdır
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceInfoModal;