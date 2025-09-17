"use client";
import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { ShipmentPackage } from "@/constants/models/trendyol/GetShipmentPackagesRequest";
import { UnSuppliedReasonResponse } from "@/constants/models/trendyol/UnSuppliedReasonResponse";
import { NotifyUnsuppliedItemsRequest } from "@/constants/models/trendyol/NotifyUnsuppliedItemsRequest";
import { useGetUnsuppliedReasons } from "@/hooks/services/admin-trendyol-marketplace/useGetUnsuppliedReasons";
import { useNotifyUnsuppliedItems } from "@/hooks/services/admin-trendyol-marketplace/useNotifyUnsuppliedItems";

// Error Boundary component for this modal
class UnsuppliedModalErrorBoundary extends React.Component<
  { children: React.ReactNode; onError: () => void },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; onError: () => void }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    toast.error("Beklenmeyen bir hata oluştu. Modal kapatılıyor.");
    this.props.onError();
  }

  render() {
    if (this.state.hasError) {
      return null; // Don't render anything if there's an error
    }

    return this.props.children;
  }
}

interface UnsuppliedItemsModalProps {
  isOpen: boolean;
  onClose: () => void;
  shipmentPackage: ShipmentPackage | null;
  onSuccess?: () => void;
}

const UnsuppliedItemsModalContent: React.FC<UnsuppliedItemsModalProps> = ({
  isOpen,
  onClose,
  shipmentPackage,
  onSuccess,
}) => {
  const [selectedReason, setSelectedReason] = useState<number | null>(null);
  const [selectedQuantities, setSelectedQuantities] = useState<{ [lineId: number]: number }>({});
  const [unsuppliedReasons, setUnsuppliedReasons] = useState<UnSuppliedReasonResponse[]>([]);
  const [isInfoExpanded, setIsInfoExpanded] = useState<boolean>(false); // Changed to false to start collapsed

  const { getUnsuppliedReasons, isPending: isLoadingReasons } = useGetUnsuppliedReasons();
  const { notifyUnsuppliedItems, isPending: isSubmitting } = useNotifyUnsuppliedItems();

  // Load unsupplied reasons when modal opens
  useEffect(() => {
    if (isOpen) {
      loadReasons();
      initializeQuantities();
    }
  }, [isOpen, shipmentPackage]);

  const loadReasons = async () => {
    try {
      const reasons = await getUnsuppliedReasons();
      setUnsuppliedReasons(reasons as UnSuppliedReasonResponse[]);
    } catch (error) {
      toast.error("Tedarik edememe nedenleri yüklenirken hata oluştu. Lütfen tekrar deneyin.");
    }
  };

  const initializeQuantities = () => {
    if (shipmentPackage?.lines) {
      const initialQuantities: { [lineId: number]: number } = {};
      shipmentPackage.lines.forEach(line => {
        initialQuantities[line.id] = 0;
      });
      setSelectedQuantities(initialQuantities);
    }
  };

  const handleQuantityChange = (lineId: number, quantity: number) => {
    setSelectedQuantities(prev => ({
      ...prev,
      [lineId]: quantity
    }));
  };

  const handleSubmit = async () => {
    if (!selectedReason || !shipmentPackage) {
      toast.error("Lütfen iptal nedeni seçiniz.");
      return;
    }

    // Only include lines with quantity > 0
    const linesToCancel = Object.entries(selectedQuantities)
      .filter(([_, quantity]) => quantity > 0)
      .map(([lineId, quantity]) => ({
        lineId: parseInt(lineId),
        quantity: quantity
      }));

    if (linesToCancel.length === 0) {
      toast.error("Lütfen en az bir ürün için adet seçiniz.");
      return;
    }

    const request: NotifyUnsuppliedItemsRequest = {
      lines: linesToCancel,
      reasonId: selectedReason
    };

    const result = await notifyUnsuppliedItems(shipmentPackage.id, request);
    
    if (result.isSucceed) {
      toast.success("İptal işlemi başarıyla tamamlandı.");
      onSuccess?.();
      onClose();
      resetModal();
    } else {
      
      const errorMessage = result.message || "";
      
      // Handle specific error messages
      if (errorMessage.includes("Günlük tedarik edememe limitini aştınız")) {
        toast.error("Günlük tedarik edememe limitini aştınız. Lütfen yarın tekrar deneyin.");
      } else if (errorMessage.includes("limit")) {
        toast.error("Tedarik edememe limiti aşıldı. Lütfen daha sonra tekrar deneyin.");
      } else if (errorMessage) {
        toast.error(`Hata: ${errorMessage}`);
      } else {
        toast.error("İptal işlemi sırasında bir hata oluştu. Lütfen tekrar deneyin.");
      }
      
      // Close modal, reset state and refresh list even on error
      onSuccess?.();
      onClose();
      resetModal();
    }
  };

  const resetModal = () => {
    setSelectedReason(null);
    setSelectedQuantities({});
    setIsInfoExpanded(false);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  if (!isOpen) return null;

  const selectedReasonData = unsuppliedReasons.find(r => r.reasonId === selectedReason);
  const hasSelectedItems = Object.values(selectedQuantities).some(qty => qty > 0);

  return (
    <>
      <style jsx>{`
        .show {
          display: block !important;
        }
        .hover-bg-light:hover {
          background-color: #f8f9fa !important;
        }
      `}</style>
      <div className="modal fade show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">İptal Et</h5>
              <button
                type="button"
                className="btn-close"
                onClick={handleClose}
                aria-label="Close"
              ></button>
            </div>

            <div className="modal-body p-4">
              {/* Important Information Alert */}
              <div className="border border-danger rounded p-3 mb-4" style={{ backgroundColor: '#f8d7da' }}>
                <div
                  className="d-flex align-items-center justify-content-between mb-2"
                  style={{
                    cursor: 'pointer',
                    padding: '8px',
                    borderRadius: '4px',
                    transition: 'background-color 0.2s'
                  }}
                  onClick={() => setIsInfoExpanded(!isInfoExpanded)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setIsInfoExpanded(!isInfoExpanded);
                    }
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e8c7d0'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <div className="d-flex align-items-center">
                    <i className="fa fa-info-circle text-danger me-2" style={{ fontSize: '18px' }}></i>
                    <span className="text-danger fw-bold">Sipariş İptali Hakkında Önemli Bilgiler</span>
                  </div>
                  <button
                    className="btn btn-link p-0 text-dark border-0"
                    type="button"
                    onClick={() => setIsInfoExpanded(!isInfoExpanded)}
                    aria-expanded={isInfoExpanded}
                    style={{
                      textDecoration: 'none',
                      padding: '8px',
                      borderRadius: '4px',
                      transition: 'background-color 0.2s'
                    }}
                    title={isInfoExpanded ? "Bilgileri gizle" : "Bilgileri göster"}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e8c7d0'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      style={{
                        transition: 'transform 0.2s',
                        transform: isInfoExpanded ? 'rotate(180deg)' : 'rotate(0deg)'
                      }}
                    >
                      <path d="M7 10l5 5 5-5z" />
                    </svg>
                  </button>
                </div>
                {isInfoExpanded && (
                  <div className="mt-2">
                    <ul className="mb-3 small text-dark" style={{ paddingLeft: '20px' }}>
                      <li className="mb-2">Seçtiğiniz tedarik edememe nedenleri Trendyol tarafından yalnızca istatistiki amaçlar için saklanmaktadır. Bu nedenlere göre değişen bir yaptırım ya da muafiyet uygulaması bulunmamaktadır. Sözleşmenizde belirtilen tedarik edememe uygulamaları geçerli olacaktır.</li>
                      <li className="mb-2">T.C. Ticaret Bakanlığı Tüketicinin Korunması ve Piyasa Gözetimi Genel Müdürlüğü kararı doğrultusunda tedarik edememe sebebiyle yapılacak iptaller, yalnızca önelemeyecek mücbir bir durumun olması halinde haklı bir iptal olarak kabul edilecektir. Bu durumlar dışında iptal edilen siparişler için tarafınıza sipariş başına idari para cezası yaptırımları uygulanabilir.</li>
                    </ul>
                    <div className="mt-2">
                      <a
                        href="https://tymp.mncdn.com/prod/documents/engagement/duyurular/indirimli_satis_rakamlari_tedarik_edememe.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-danger text-decoration-none small fw-bold"
                      >
                        Detaylı bilgi için tıklayınız.
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Reason Selection */}
              <div className="mb-4">
                <label className="form-label fw-bold">İPTAL NEDENİ SEÇİNİZ</label>
                <div className="position-relative">
                  <div
                    className="form-control d-flex align-items-center justify-content-between"
                    style={{
                      cursor: 'pointer',
                      backgroundColor: selectedReason ? '#f8f9fa' : '#fff',
                      border: selectedReason ? '1px solid #28a745' : '1px solid #ced4da'
                    }}
                    onClick={() => document.getElementById('reasonDropdown')?.classList.toggle('show')}
                  >
                    <span className={selectedReason ? 'text-dark' : 'text-muted'}>
                      {selectedReason
                        ? unsuppliedReasons.find(r => r.reasonId === selectedReason)?.name
                        : 'İptal Nedeni Seçiniz'
                      }
                    </span>
                    <div className="d-flex align-items-center">
                      {selectedReason && (
                        <button
                          type="button"
                          className="btn btn-link btn-sm p-0 me-2 text-danger"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedReason(null);
                          }}
                          title="Seçimi temizle"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                          </svg>
                        </button>
                      )}
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M7 10l5 5 5-5z" />
                      </svg>
                    </div>
                  </div>

                  {/* Custom Dropdown */}
                  <div
                    id="reasonDropdown"
                    className="position-absolute w-100 bg-white border rounded mt-1 shadow-sm"
                    style={{
                      display: 'none',
                      zIndex: 1000,
                      maxHeight: '200px',
                      overflowY: 'auto'
                    }}
                  >
                    {unsuppliedReasons.map(reason => (
                      <div
                        key={reason.reasonId}
                        className="px-3 py-2 cursor-pointer hover-bg-light"
                        style={{
                          cursor: 'pointer',
                          borderBottom: '1px solid #f0f0f0',
                          color: '#333'
                        }}
                        onClick={() => {
                          setSelectedReason(reason.reasonId);
                          document.getElementById('reasonDropdown')?.classList.remove('show');
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fff'}
                      >
                        {reason.name}
                      </div>
                    ))}
                  </div>
                </div>

                {selectedReasonData && (
                  <small className="text-muted mt-1 d-block">{selectedReasonData.description}</small>
                )}
              </div>

              {/* Products Table */}
              <div className="mb-4">
                <div className="table-responsive">
                  <table className="table table-bordered">
                    <thead className="table-light">
                      <tr>
                        <th style={{ width: '65%' }}>Bilgiler</th>
                        <th style={{ width: '35%' }}>Adet</th>
                      </tr>
                    </thead>
                    <tbody>
                      {shipmentPackage?.lines.map((line, index) => (
                        <tr key={line.id}>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="bg-light rounded p-2 me-3 d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px' }}>
                                <img
                                  src="/assets/admin/img/marketplace/default.webp"
                                  alt="Product"
                                  className="img-fluid"
                                  style={{ maxHeight: '100%', maxWidth: '100%' }}
                                />
                              </div>
                              <div>
                                <div className="d-flex align-items-center mb-1">
                                  <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-2" style={{ width: '24px', height: '24px', fontSize: '12px' }}>
                                    {line.quantity}
                                  </div>
                                  <h6 className="mb-0">{line.productName}</h6>
                                  <button
                                    className="btn btn-link btn-sm p-0 ms-2"
                                    onClick={() => navigator.clipboard.writeText(line.productName)}
                                    title="Kopyala"
                                  >
                                    <i className="fa fa-copy text-muted"></i>
                                  </button>
                                </div>
                                <small className="text-muted d-block">Stok Kodu: {line.sku}</small>
                                <small className="text-muted d-block">Renk: {line.productColor}</small>
                                <small className="text-muted d-block">Barkod: {line.barcode}</small>
                                <small className="text-muted d-block">Beden: {line.productSize}</small>
                              </div>
                            </div>
                          </td>
                          <td>
                            <select
                              className="form-select"
                              value={selectedQuantities[line.id] || ""}
                              onChange={(e) => handleQuantityChange(line.id, parseInt(e.target.value) || 0)}
                            >
                              <option value="">Adet Seçiniz</option>
                              {Array.from({ length: line.quantity }, (_, i) => i + 1).map(qty => (
                                <option key={qty} value={qty}>
                                  {qty}
                                </option>
                              ))}
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Vazgeç
              </button>
              <button
                type="button"
                className="btn btn-warning"
                onClick={handleSubmit}
                disabled={!selectedReason || !hasSelectedItems || isSubmitting}
              >
                {isSubmitting ? "İptal Ediliyor..." : "İptal Et"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// Wrapper component with error boundary
const UnsuppliedItemsModal: React.FC<UnsuppliedItemsModalProps> = (props) => {
  return (
    <UnsuppliedModalErrorBoundary onError={props.onClose}>
      <UnsuppliedItemsModalContent {...props} />
    </UnsuppliedModalErrorBoundary>
  );
};

export default UnsuppliedItemsModal;