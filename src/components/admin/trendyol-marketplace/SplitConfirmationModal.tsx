"use client";
import { ShipmentPackage } from "@/constants/models/trendyol/GetShipmentPackagesRequest";
// useState ve useEffect artık kullanılmıyor
import toast from "react-hot-toast";
import { useSplitShipmentPackage } from "@/hooks/services/admin-trendyol-marketplace/useSplitShipmentPackage";
import { useSplitShipmentPackageByQuantity } from "@/hooks/services/admin-trendyol-marketplace/useSplitShipmentPackageByQuantity";
import { useSplitMultiPackageByQuantity } from "@/hooks/services/admin-trendyol-marketplace/useSplitMultiPackageByQuantity";
// useSplitShipmentPackageMultiGroup kullanılmıyor
import { SplitShipmentPackageRequest } from "@/constants/models/trendyol/SplitShipmentPackageRequest";
import { SplitShipmentPackageByQuantityRequest } from "@/constants/models/trendyol/SplitShipmentPackageByQuantityRequest";
import { SplitMultiPackageByQuantityRequest } from "@/constants/models/trendyol/SplitMultiPackageByQuantityRequest";

interface SplitConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
  shipmentPackage?: ShipmentPackage | null;
  selectedQuantities?: { [lineId: number]: number };
}

const SplitConfirmationModal: React.FC<SplitConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
  shipmentPackage,
  selectedQuantities = {}
}) => {
  const { splitShipmentPackage, isPending: isSplittingShipment } = useSplitShipmentPackage();
  const { splitShipmentPackageByQuantity, isPending: isSplittingByQuantity } = useSplitShipmentPackageByQuantity();
  const { splitMultiPackageByQuantity, isPending: isSplittingMultiPackage } = useSplitMultiPackageByQuantity();
  // splitShipmentPackageMultiGroup kullanılmıyor

  // Paket içeriği analizi ve hangi API'yi kullanacağını belirleme
  const analyzeSplitStrategy = () => {
    if (!shipmentPackage?.lines) return null;

    const packageLines = shipmentPackage.lines;
    const isSingleProduct = packageLines.length === 1;
    const selectedQuantitiesValues = Object.values(selectedQuantities);
    const totalSelected = selectedQuantitiesValues.reduce((sum, qty) => sum + qty, 0);
    const selectedProductCount = Object.values(selectedQuantities).filter(qty => qty > 0).length;

    // Tek Ürün mü?
    if (isSingleProduct) {
      const singleLine = packageLines[0];
      const selectedQty = selectedQuantities[singleLine.id] || 0;

      // Miktar > 1 mi?
      if (singleLine.quantity > 1 && selectedQty > 0 && selectedQty < singleLine.quantity) {
        return {
          strategy: 'quantity-split',
          api: 'splitShipmentPackageByQuantity',
          data: {
            quantitySplit: [{
              orderLineId: singleLine.id,
              quantities: [selectedQty, singleLine.quantity - selectedQty]
            }]
          }
        };
      } else {
        return null; // Bölme yapılamaz
      }
    } else {
      // Çoklu Ürün
      const selectedLines = packageLines.filter(line => selectedQuantities[line.id] > 0);

      // Hiç ürün seçilmemişse
      if (selectedLines.length === 0) {
        return null;
      }

      // Tüm ürünler seçilmişse
      if (selectedLines.length === packageLines.length) {
        return null;
      }

      // Az ürün seçildi mi?
      if (selectedProductCount <= Math.ceil(packageLines.length / 2)) {
        // splitShipmentPackage kullan
        return {
          strategy: 'simple-split',
          api: 'splitShipmentPackage',
          data: {
            orderLineIds: selectedLines.map(line => line.id)
          }
        };
      } else {
        // Çok ürün var -> splitMultiPackageByQuantity kullan
        return {
          strategy: 'multi-package-split',
          api: 'splitMultiPackageByQuantity',
          data: {
            splitPackages: [{
              packageDetails: selectedLines.map(line => ({
                orderLineId: line.id,
                quantities: selectedQuantities[line.id] || 1
              }))
            }]
          }
        };
      }
    }
  };

  const handleConfirmSplit = async () => {
    if (!shipmentPackage?.lines || !shipmentPackage.id) return;

    const selectedQuantitiesValues = Object.values(selectedQuantities);
    const totalSelected = selectedQuantitiesValues.reduce((sum, qty) => sum + qty, 0);

    // En az bir ürün seçilmiş olmalı
    if (totalSelected === 0) {
      toast.error("Bölme işlemi için en az bir ürün seçmelisiniz");
      return;
    }

    // Analiz et ve strateji belirle
    const splitStrategy = analyzeSplitStrategy();

    if (!splitStrategy) {
      toast.error("Paket bölünemez. Lütfen farklı ürünler veya miktarlar seçin.");
      return;
    }

    try {
      // Strateji'ye göre uygun API'yi çağır
      switch (splitStrategy.api) {
        case 'splitShipmentPackageByQuantity':
          await splitShipmentPackageByQuantity(shipmentPackage.id, splitStrategy.data as SplitShipmentPackageByQuantityRequest);
          break;

        case 'splitShipmentPackage':
          await splitShipmentPackage(shipmentPackage.id, splitStrategy.data as SplitShipmentPackageRequest);
          break;

        case 'splitMultiPackageByQuantity':
          await splitMultiPackageByQuantity(shipmentPackage.id, splitStrategy.data as SplitMultiPackageByQuantityRequest);
          break;

        default:
          throw new Error(`Desteklenmeyen API: ${splitStrategy.api}`);
      }

      // Başarılı ise modal'ı kapat ve callback'i çağır
      onConfirm();
      onClose();
    } catch (error: any) {
      // Backend'den gelen hata mesajı zaten hook'larda toast olarak gösteriliyor
      // Eğer ek bir işlem gerekirse burada yapılabilir
    }
  };

  if (!isOpen || !shipmentPackage) return null;

  const packageLines = shipmentPackage.lines || [];
  if (packageLines.length === 0) return null;

  // Loading state'i hook'tan al
  const isModalLoading = isLoading || isSplittingShipment || isSplittingByQuantity || isSplittingMultiPackage;

  return (
    <>
      {/* Modal overlay */}
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-container" onClick={(e) => e.stopPropagation()}>
          {/* Modal Header */}
          <div className="modal-header">
            <h3 className="modal-title">Paketi Böl</h3>
            <button
              type="button"
              className="close-button"
              onClick={onClose}
              disabled={isModalLoading}
              aria-label="Kapat"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="#6B7280" />
              </svg>
            </button>
          </div>

          {/* Modal Body */}
          <div className="modal-body">
            <div className="confirmation-content">
              <p className="main-message">
                Paketinizi bölmek üzeresiniz! Bu aşamadan sonra seçtiğiniz ürünler için yeni Trendyol kargo barkodu oluşacaktır.
              </p>

              <div className="bullet-points">
                <div className="bullet-item">
                  <div className="bullet-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="10" stroke="#6B7280" strokeWidth="2" />
                      <path d="M12 6V12L16 14" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <span>
                    Bu işlemle oluşacak yeni paketler için mevcut kargo anlaşmanıza göre tarafınıza ek ücret yansıtılacaktır.
                  </span>
                </div>

                <div className="bullet-item">
                  <div className="bullet-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="10" stroke="#6B7280" strokeWidth="2" />
                      <path d="M12 6V12L16 14" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <span>
                    Yeni oluşturulan her bir paket için yeniden sipariş faturası yüklemeniz gerekmektedir.
                  </span>
                </div>
              </div>

              <div className="confirmation-question">
                Bu işlem geri alınamayacaktır. İlerlemek istediğinize emin misiniz?
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="modal-footer">
            <div className="footer-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={onClose}
                disabled={isModalLoading}
              >
                Vazgeç
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={handleConfirmSplit}
                disabled={isModalLoading}
              >
                {isModalLoading ? (
                  <>
                    <div className="spinner"></div>
                    <span>Bölünüyor...</span>
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" fill="currentColor" />
                    </svg>
                    <span>Paketi Böl</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1050;
          padding: 20px;
        }

        .modal-container {
          background: white;
          border-radius: 16px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          width: 100%;
          max-width: 600px;
          max-height: 90vh;
          overflow: hidden;
          animation: modalSlideIn 0.3s ease-out;
        }

        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .modal-header {
          padding: 24px 32px 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #E5E7EB;
          padding-bottom: 20px;
        }

        .modal-title {
          margin: 0;
          font-size: 24px;
          font-weight: 700;
          color: #111827;
          line-height: 1.2;
        }

        .close-button {
          background: none;
          border: none;
          padding: 8px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .close-button:hover {
          background-color: #F3F4F6;
          transform: scale(1.05);
        }

        .close-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .modal-body {
          padding: 32px;
        }

        .confirmation-content {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .main-message {
          margin: 0;
          font-size: 16px;
          line-height: 1.6;
          color: #374151;
          font-weight: 500;
        }

        .bullet-points {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .bullet-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          font-size: 14px;
          line-height: 1.5;
          color: #6B7280;
        }

        .bullet-icon {
          flex-shrink: 0;
          margin-top: 2px;
        }

        .confirmation-question {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
          color: #111827;
          line-height: 1.5;
          padding: 20px;
          background-color: #F9FAFB;
          border-radius: 12px;
          border-left: 4px solid #FF6B35;
        }

        .modal-footer {
          padding: 0 32px 32px;
        }

        .footer-actions {
          display: flex;
          gap: 16px;
          justify-content: flex-end;
        }

        .btn-secondary, .btn-primary {
          padding: 12px 24px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 8px;
          min-width: 120px;
          justify-content: center;
        }

        .btn-secondary {
          background-color: white;
          color: #6B7280;
          border: 2px solid #E5E7EB;
        }

        .btn-secondary:hover {
          background-color: #F9FAFB;
          border-color: #D1D5DB;
          transform: translateY(-1px);
        }

        .btn-primary {
          background: linear-gradient(135deg, #FF6B35, #FF8A65);
          color: white;
          box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
        }

        .btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(255, 107, 53, 0.4);
        }

        .btn-primary:disabled, .btn-secondary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .modal-container {
            margin: 20px;
            max-height: 95vh;
          }

          .modal-header {
            padding: 20px 20px 0;
            padding-bottom: 16px;
          }

          .modal-body {
            padding: 20px;
          }

          .modal-footer {
            padding: 0 20px 20px;
          }

          .modal-title {
            font-size: 20px;
          }

          .footer-actions {
            flex-direction: column;
          }

          .btn-secondary, .btn-primary {
            width: 100%;
          }
        }

        @media (max-width: 480px) {
          .modal-overlay {
            padding: 10px;
          }

          .modal-container {
            margin: 10px;
          }

          .modal-header {
            padding: 16px 16px 0;
            padding-bottom: 16px;
          }

          .modal-body {
            padding: 16px;
          }

          .modal-footer {
            padding: 0 16px 16px;
          }

          .main-message {
            font-size: 15px;
          }

          .confirmation-question {
            font-size: 15px;
            padding: 16px;
          }
        }
      `}</style>
    </>
  );
};

export default SplitConfirmationModal;