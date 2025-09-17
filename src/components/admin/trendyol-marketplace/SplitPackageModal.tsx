"use client";
import { ShipmentPackage } from "@/constants/models/trendyol/GetShipmentPackagesRequest";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
// Split işlemleri artık SplitConfirmationModal'da yapılıyor

interface SplitPackageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSplit?: (quantities: { [lineId: number]: number }) => void; // Optional since we handle split directly
  shipmentPackage: ShipmentPackage | null;
  isLoading?: boolean;
}

const SplitPackageModal: React.FC<SplitPackageModalProps> = ({
  isOpen,
  onClose,
  onSplit,
  shipmentPackage,
  isLoading = false
}) => {
  const [quantities, setQuantities] = useState<{ [id: number]: number }>({});
// Split hooks artık SplitConfirmationModal'da kullanılıyor

  // Initialize quantities when modal opens
  useEffect(() => {
    if (isOpen && shipmentPackage?.lines) {
      const initialQuantities: { [id: number]: number } = {};

      // Tüm ürünler için başlangıçta 0 adet seç (kullanıcı hangi ürünleri seçeceğini belirler)
      shipmentPackage.lines.forEach(line => {
        initialQuantities[line.id] = 0;
      });
      setQuantities(initialQuantities);
    }
  }, [isOpen, shipmentPackage]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setQuantities({});
    }
  }, [isOpen]);

  const handleQuantityChange = (id: number, newQuantity: number) => {
    setQuantities(prev => ({
      ...prev,
      [id]: newQuantity
    }));
  };

  // Paket içeriği analizi ve hangi API'yi kullanacağını belirleme
  const analyzeSplitStrategy = () => {
    if (!shipmentPackage?.lines) return null;

    const packageLines = shipmentPackage.lines;
    const isSingleProduct = packageLines.length === 1;
    const selectedQuantities = Object.values(quantities);
    const totalSelected = selectedQuantities.reduce((sum, qty) => sum + qty, 0);
    const selectedProductCount = Object.values(quantities).filter(qty => qty > 0).length;

    // Tek Ürün mü?
    if (isSingleProduct) {
      const singleLine = packageLines[0];
      const selectedQty = quantities[singleLine.id] || 0;

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
      const selectedLines = packageLines.filter(line => quantities[line.id] > 0);

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
                quantities: quantities[line.id] || 1
              }))
            }]
          }
        };
      }
    }
  };

  const handleSplitClick = () => {
    if (!shipmentPackage?.lines) return;

    const packageLines = shipmentPackage.lines;
    const selectedQuantities = Object.values(quantities);
    const totalSelected = selectedQuantities.reduce((sum, qty) => sum + qty, 0);

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

    // Validation başarılıysa confirmation modal'ına geç
    // onSplit callback'i ile quantities'i parent'a gönder
    onSplit && onSplit(quantities);
  };

  if (!isOpen || !shipmentPackage) {
    return null;
  }

  const packageLines = shipmentPackage.lines || [];
  if (packageLines.length === 0) {
    return null;
  }

  // Loading state'i sadece prop'tan al
  const isModalLoading = isLoading;

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
            <div className="content-grid">
              {/* Sol sütun - Ürün Bilgileri */}
              <div className="product-section">
                <h4 className="section-title">Bilgiler</h4>

                {/* Çoklu ürün için uyarı - Her ürün 1'er adet ise özel mesaj */}
                {packageLines.length > 1 && packageLines.every(line => (line.quantity || 1) === 1) && (
                  <div className="splitting-guidance">
                    <div className="guidance-icon">ℹ️</div>
                    <div className="guidance-text">
                      <strong>Çoklu Ürün Paketi:</strong><br />
                      Sadece bir ürün seçebilirsiniz.
                    </div>
                  </div>
                )}

                {/* Diğer çoklu ürün durumları için uyarı */}
                {packageLines.length > 1 && !packageLines.every(line => (line.quantity || 1) === 1) && (
                  <div className="splitting-guidance">
                    <div className="guidance-icon">ℹ️</div>
                    <div className="guidance-text">
                      <strong>Çoklu Ürün Paketi:</strong><br />
                      Yeni pakete alınacak ürünleri seçin. Tüm ürünleri seçemezsiniz.
                    </div>
                  </div>
                )}

                {/* Tek ürün için uyarı */}
                {packageLines.length === 1 && (packageLines[0]?.quantity || 1) > 1 && (
                  <div className="splitting-guidance">
                    <div className="guidance-icon">ℹ️</div>
                    <div className="guidance-text">
                      <strong>Tek Ürün Paketi:</strong><br />
                      Yeni pakete alınacak adet sayısını seçin. Tüm adedi seçemezsiniz.
                    </div>
                  </div>
                )}

                {/* Paketteki tüm ürünler listelenir */}
                {packageLines.map((line) => {
                  const lineQuantity = line.quantity || 1;
                  const selectedQty = quantities[line.id] || 0; // 0'dan başlar

                  return (
                    <div key={line.id} className="product-item">
                      <div className="product-info">
                        <div className="product-image">
                          <img
                            src="/assets/admin/img/marketplace/default.webp"
                            alt="Ürün Resmi"
                            className="product-img"
                          />
                          <div className="quantity-badge">{lineQuantity}</div>
                        </div>
                        <div className="product-details">
                          <h5 className="product-name">
                            {line.productName || "Ürün Adı"}
                          </h5>
                          <div className="product-attributes">
                            <span><strong>Stok Kodu:</strong> {line.merchantSku || '-'}</span>
                            <span><strong>Renk:</strong> {line.productColor || 'Beyaz'}</span>
                            <span><strong>Barkod:</strong> {line.barcode || '-'}</span>
                            <span><strong>Beden:</strong> {line.productSize || 'M'}</span>
                          </div>
                        </div>
                        {/* Her ürünün sağında adet seçimi */}
                        <div className="product-quantity-selector">
                          <label>Adet Seçiniz</label>
                          <div className="quantity-input-container">
                            <select
                              value={selectedQty}
                              onChange={(e) => {
                                const newQty = parseInt(e.target.value) || 0;

                                // Çoklu ürün ve her ürün 1'er adet ise, sadece bir ürün seçilebilir
                                const packageLines = shipmentPackage?.lines || [];
                                const allSingleQuantity = packageLines.every(line => (line.quantity || 1) === 1);
                                const isMultiProduct = packageLines.length > 1;

                                if (isMultiProduct && allSingleQuantity && newQty > 0) {
                                  // Bu ürünü seçiyorsak, diğer tüm seçimleri temizle
                                  const newQuantities: { [id: number]: number } = {};
                                  packageLines.forEach(l => {
                                    newQuantities[l.id] = l.id === line.id ? newQty : 0;
                                  });
                                  setQuantities(newQuantities);
                                } else {
                                  // Normal durum - maksimum adet kontrolü yap
                                  const currentTotal = Object.values(quantities).reduce((sum, qty) => sum + qty, 0) - (quantities[line.id] || 0);
                                  const maxAllowedForThisProduct = lineQuantity;

                                  // Eğer bu ürünün maksimum adedini seçmeye çalışıyorsa ve diğer ürünler de seçiliyse
                                  if (newQty === maxAllowedForThisProduct && currentTotal > 0) {
                                    // Kullanıcıya uyarı ver
                                    toast.error("Tüm ürünlerin maksimum adedini seçemezsiniz. En az bir ürün orijinal pakette kalmalıdır.");
                                    return;
                                  }

                                  handleQuantityChange(line.id, newQty);
                                }
                              }}
                              className="quantity-dropdown"
                              disabled={isModalLoading}
                            >
                              <option value={0}>Adet Seç</option>
                              {Array.from({ length: lineQuantity }, (_, i) => {
                                const optionQty = i + 1;
                                const currentTotal = Object.values(quantities).reduce((sum, qty) => sum + qty, 0) - (quantities[line.id] || 0);
                                const isMaxQuantity = optionQty === lineQuantity;
                                const wouldExcludeAllProducts = currentTotal + optionQty === packageLines.reduce((sum, l) => sum + (l.quantity || 1), 0);

                                // Maksimum adet seçeneğini devre dışı bırak eğer tüm ürünleri hariç tutacaksa
                                const isDisabled = isMaxQuantity && wouldExcludeAllProducts;

                                return (
                                  <option
                                    key={optionQty}
                                    value={optionQty}
                                    disabled={isDisabled}
                                  >
                                    {optionQty} Adet{isDisabled ? ' (Seçilemez)' : ''}
                                  </option>
                                );
                              })}
                            </select>
                            {selectedQty > 0 && (
                              <button
                                type="button"
                                className="clear-quantity-btn"
                                onClick={() => handleQuantityChange(line.id, 0)}
                                disabled={isModalLoading}
                                title="Seçimi kaldır"
                              >
                                ×
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="modal-footer">
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
              onClick={handleSplitClick}
              disabled={isModalLoading}
            >
              Devam Et
            </button>
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
          border-radius: 8px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
          width: 100%;
          max-width: 800px;
          max-height: 90vh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .modal-header {
          padding: 20px;
          border-bottom: 1px solid #E5E7EB;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .modal-title {
          margin: 0;
          font-size: 20px;
          font-weight: 600;
          color: #111827;
        }

        .close-button {
          background: none;
          border: none;
          padding: 8px;
          cursor: pointer;
          border-radius: 4px;
          transition: background-color 0.2s;
        }

        .close-button:hover {
          background-color: #F3F4F6;
        }

        .modal-body {
          padding: 20px;
          overflow-y: auto;
          flex: 1;
          min-height: 0;
        }

        .content-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
        }

        .splitting-guidance {
          background: linear-gradient(135deg, #FEF3C7, #FDE68A);
          border: 1px solid #F59E0B;
          border-radius: 8px;
          padding: 12px;
          margin-bottom: 20px;
          display: flex;
          align-items: flex-start;
          gap: 10px;
        }

        .guidance-icon {
          font-size: 18px;
          flex-shrink: 0;
        }

        .guidance-text {
          font-size: 13px;
          color: #92400E;
          line-height: 1.4;
        }

        .section-title {
          margin: 0 0 20px 0;
          font-size: 16px;
          font-weight: 600;
          color: #374151;
        }

        .product-item {
          margin-bottom: 20px;
          padding: 15px;
          border: 1px solid #E5E7EB;
          border-radius: 6px;
          background: #F9FAFB;
        }

        .product-info {
          display: flex;
          gap: 15px;
          align-items: flex-start;
        }

        .product-image {
          position: relative;
          width: 60px;
          height: 60px;
          flex-shrink: 0;
        }

        .product-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 4px;
        }

        .quantity-badge {
          position: absolute;
          top: -5px;
          right: -5px;
          background: #3B82F6;
          color: white;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 600;
        }

        .product-details {
          flex: 1;
        }

        .product-name {
          margin: 0 0 10px 0;
          font-size: 14px;
          font-weight: 600;
          color: #111827;
          line-height: 1.3;
        }

        .product-attributes {
          display: flex;
          flex-direction: column;
          gap: 4px;
          font-size: 12px;
          color: #6B7280;
        }

        .product-quantity-selector {
          display: flex;
          flex-direction: column;
          gap: 8px;
          align-items: flex-end;
          min-width: 120px;
          flex-shrink: 0;
        }

        .product-quantity-selector label {
          font-size: 14px;
          font-weight: 500;
          color: #374151;
          text-align: center;
        }

        .quantity-input-container {
          display: flex;
          align-items: center;
          gap: 8px;
          min-width: 120px;
        }

        .quantity-dropdown {
          flex: 1;
          padding: 8px 12px;
          border: 1px solid #D1D5DB;
          border-radius: 6px;
          font-size: 14px;
          background-color: white;
          color: #374151;
          cursor: pointer;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .quantity-dropdown:focus {
          outline: none;
          border-color: #3B82F6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .clear-quantity-btn {
          background: none;
          border: none;
          color: #6B7280;
          font-size: 18px;
          font-weight: bold;
          cursor: pointer;
          padding: 4px 8px;
          border-radius: 4px;
          transition: all 0.2s;
          min-width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .clear-quantity-btn:hover {
          background-color: #F3F4F6;
          color: #374151;
        }

        .clear-quantity-btn:active {
          background-color: #E5E7EB;
        }

        .clear-quantity-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .modal-footer {
          padding: 20px;
          border-top: 1px solid #E5E7EB;
          display: flex;
          gap: 12px;
          justify-content: flex-end;
          flex-shrink: 0;
          background: white;
        }

        .btn-secondary, .btn-primary {
          padding: 10px 20px;
          border-radius: 4px;
          font-size: 14px;
          font-weight: 500;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-secondary {
          background: white;
          color: #6B7280;
          border: 1px solid #D1D5DB;
        }

        .btn-secondary:hover {
          background: #F9FAFB;
        }

        .btn-primary {
          background: #FF6B35;
          color: white;
        }

        .btn-primary:hover {
          background: #E55A2B;
        }

        .btn-primary:disabled, .btn-secondary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .modal-container {
            margin: 10px;
            max-height: 95vh;
          }

          .modal-footer {
            flex-direction: column;
          }

          .btn-secondary, .btn-primary {
            width: 100%;
          }

          .product-info {
            flex-direction: column;
            align-items: center;
            text-align: center;
          }

          .product-quantity-selector {
            align-items: center;
            margin-top: 15px;
          }
        }
      `}</style>
    </>
  );
};

export default SplitPackageModal;