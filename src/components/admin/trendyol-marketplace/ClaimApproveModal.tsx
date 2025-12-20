import React, { useState, useEffect } from "react";
import { ClaimContent } from "@/constants/models/trendyol/GetClaimsResponse";
import { useApproveClaimLineItems } from "@/hooks/services/admin-trendyol-marketplace/useApproveClaimLineItems";
import toast from "react-hot-toast";

interface ClaimApproveModalProps {
  isOpen: boolean;
  onClose: () => void;
  claim: ClaimContent | null;
  onSuccess?: () => void;
}

const ClaimApproveModal: React.FC<ClaimApproveModalProps> = ({
  isOpen,
  onClose,
  claim,
  onSuccess
}) => {
  const [selectedItems, setSelectedItems] = useState<{ [key: string]: number }>({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const { approveClaimLineItems, isPending } = useApproveClaimLineItems();

  useEffect(() => {
    if (isOpen && !showConfirmModal) {
      // Initialize selected items - none selected initially for all products
      if (claim) {
        const initialSelection: { [key: string]: number } = {};
        claim.items.forEach(itemContainer => {
          initialSelection[itemContainer.orderLine.id.toString()] = 0;
          itemContainer.claimItems.forEach(claimItem => {
            initialSelection[claimItem.id] = 0;
          });
        });
        setSelectedItems(initialSelection);
      }
    }
  }, [isOpen, claim, showConfirmModal]);

  const handleQuantityChange = (claimItemId: string, quantity: number) => {
    setSelectedItems(prev => ({
      ...prev,
      [claimItemId]: quantity
    }));
  };

  const handleProductQuantityChange = (orderLineId: string, quantity: number, claimItems: any[]) => {
    setSelectedItems(prev => {
      const newState = { ...prev };
      // Update by orderLine.id for display
      newState[orderLineId] = quantity;
      // Update all claim items for this product
      claimItems.forEach(claimItem => {
        newState[claimItem.id] = quantity;
      });
      return newState;
    });
  };

  // Check if any product is selected
  const hasSelectedProducts = claim?.items.some(itemContainer => {
    const selectedQty = selectedItems[itemContainer.orderLine.id.toString()] || 0;
    return selectedQty > 0;
  }) || false;

  const handleApproveClick = () => {
    // Show confirmation modal
    setShowConfirmModal(true);
  };

  const handleConfirmApprove = async () => {
    if (!claim) return;

    try {
      // Get selected claim line item IDs (only 0 or 1 per product)
      const claimLineItemIds: string[] = [];

      claim.items.forEach(itemContainer => {
        const selectedQty = selectedItems[itemContainer.orderLine.id.toString()] || 0;

        // Add claim items based on selected quantity
        if (selectedQty > 0 && itemContainer.claimItems.length > 0) {
          const itemsToAdd = Math.min(selectedQty, itemContainer.claimItems.length);
          for (let i = 0; i < itemsToAdd; i++) {
            claimLineItemIds.push(itemContainer.claimItems[i].id);
          }
        }
      });

      await approveClaimLineItems(claim.id, {
        claimLineItemIdList: claimLineItemIds,
        params: {}
      });

      // Clean up confirmation modal
      setShowConfirmModal(false);

      // Close both modals after successful approval
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Error approving claim:", error);
      toast.error("İade onayı sırasında bir hata oluştu!");
    }
  };

  const handleClose = () => {
    setSelectedItems({});
    setShowConfirmModal(false);
    onClose();
  };

  const handleCancelConfirm = () => {
    setShowConfirmModal(false);
  };

  if (!claim) {
    return null;
  }

  return (
    <>
      {/* Main Modal */}
      {isOpen && !showConfirmModal && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}
          tabIndex={-1}
          role="dialog"
          aria-labelledby="claimApproveModalLabel"
          aria-hidden="false"
        >
          <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="claimApproveModalLabel">
                  <i className="bx bx-check me-2"></i>
                  Onaylamak istediğiniz ürünleri seçiniz
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleClose}
                  aria-label="Close"
                ></button>
              </div>

              <div className="modal-body">
                {/* Product Selection Table */}
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th style={{ width: "60%" }}>Bilgiler</th>
                        <th style={{ width: "40%" }}>Adet</th>
                      </tr>
                    </thead>
                    <tbody>
                      {claim.items.map((itemContainer, itemIndex) => {
                        return (
                          <tr key={itemIndex}>
                            {/* Product Information */}
                            <td>
                              <div className="d-flex align-items-center">
                                {/* Product Image */}
                                <div
                                  className="position-relative me-3"
                                  style={{
                                    width: "80px",
                                    height: "80px",
                                    flexShrink: 0,
                                  }}
                                >
                                  <img
                                    src="/assets/admin/img/marketplace/default.webp"
                                    alt="Ürün Resmi"
                                    className="img-fluid rounded"
                                    style={{
                                      width: "100%",
                                      height: "100%",
                                      objectFit: "cover",
                                    }}
                                  />
                                  {/* Quantity Badge - Show claimItems count */}
                                  <div
                                    className="bg-primary rounded-circle d-flex align-items-center justify-content-center position-absolute"
                                    style={{
                                      width: "24px",
                                      height: "24px",
                                      fontSize: "0.7rem",
                                      fontWeight: "bold",
                                      color: "white",
                                      top: "-8px",
                                      right: "-8px",
                                      border: "2px solid white",
                                    }}
                                  >
                                    {itemContainer.claimItems?.length || 0}
                                  </div>
                                </div>

                                {/* Product Details */}
                                <div className="flex-grow-1">
                                  <div className="d-flex align-items-center mb-2">
                                    <h6 className="mb-0 me-2 fw-bold">
                                      {itemContainer.orderLine.productName}
                                    </h6>
                                    <button
                                      className="btn btn-sm btn-link p-0"
                                      onClick={() => navigator.clipboard.writeText(itemContainer.orderLine.productName)}
                                      title="Ürün adını kopyala"
                                      style={{ fontSize: "0.6rem" }}
                                    >
                                      <i className="bx bx-copy text-muted"></i>
                                    </button>
                                  </div>

                                  <div style={{ fontSize: "0.8rem", color: "#666" }}>
                                    <div className="mb-1">
                                      <span className="fw-medium">Stok Kodu:</span> {itemContainer.orderLine.merchantSku || "-"}
                                    </div>
                                    <div className="mb-1">
                                      <span className="fw-medium">Renk:</span> {itemContainer.orderLine.productColor || "-"}
                                    </div>
                                    <div className="mb-1">
                                      <span className="fw-medium">Barkod:</span> {itemContainer.orderLine.barcode || "-"}
                                    </div>
                                    <div className="mb-1">
                                      <span className="fw-medium">Beden:</span> {itemContainer.orderLine.productSize || "-"}
                                    </div>
                                    <div className="mb-1">
                                      <span className="fw-medium">Birim Fiyat:</span> {new Intl.NumberFormat("tr-TR", {
                                        style: "currency",
                                        currency: "TRY",
                                      }).format(itemContainer.orderLine.price || 0)}
                                    </div>
                                    <div className="mb-1">
                                      <span className="fw-medium">Toplam Fiyat:</span> {new Intl.NumberFormat("tr-TR", {
                                        style: "currency",
                                        currency: "TRY",
                                      }).format((itemContainer.orderLine.price || 0) * (itemContainer.claimItems?.length || 0))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* Quantity Selection */}
                            <td>
                              <div className="d-flex flex-column gap-2">
                                {/* Quantity Selection */}
                                <div>
                                  <label className="form-label small text-muted">Adet Seçiniz</label>
                                  {selectedItems[itemContainer.orderLine.id.toString()] > 0 ? (
                                    <div className="d-flex align-items-center gap-2">
                                      <select
                                        className="form-select form-select-sm"
                                        value={selectedItems[itemContainer.orderLine.id.toString()]}
                                        onChange={(e) => {
                                          const quantity = parseInt(e.target.value);
                                          handleProductQuantityChange(
                                            itemContainer.orderLine.id.toString(),
                                            quantity,
                                            itemContainer.claimItems
                                          );
                                        }}
                                        style={{
                                          borderColor: "#28a745",
                                          backgroundColor: "#f8fff8",
                                          flex: 1
                                        }}
                                        disabled={false}
                                      >
                                        {Array.from({ length: itemContainer.claimItems?.length || 1 }, (_, i) => (
                                          <option key={i + 1} value={i + 1}>{i + 1} Adet</option>
                                        ))}
                                      </select>
                                      {/* Remove button - only show for multiple products */}
                                      {claim.items.length > 1 && (
                                        <button
                                          type="button"
                                          className="btn btn-sm btn-outline-danger"
                                          onClick={() => {
                                            handleProductQuantityChange(
                                              itemContainer.orderLine.id.toString(),
                                              0,
                                              itemContainer.claimItems
                                            );
                                          }}
                                          style={{
                                            width: "32px",
                                            height: "32px",
                                            padding: "0",
                                            borderRadius: "4px"
                                          }}
                                          title="Seçimi kaldır"
                                        >
                                          <i className="bx bx-x" style={{ fontSize: "1.2rem" }}></i>
                                        </button>
                                      )}
                                    </div>
                                  ) : (
                                    <select
                                      className="form-select form-select-sm"
                                      value=""
                                      onChange={(e) => {
                                        const quantity = parseInt(e.target.value);
                                        if (quantity > 0) {
                                          handleProductQuantityChange(
                                            itemContainer.orderLine.id.toString(),
                                            quantity,
                                            itemContainer.claimItems
                                          );
                                        }
                                      }}
                                      style={{
                                        borderColor: "#6c757d",
                                        color: "#6c757d"
                                      }}
                                    >
                                      <option value="" disabled>Adet Seçiniz</option>
                                      {Array.from({ length: itemContainer.claimItems?.length || 1 }, (_, i) => (
                                        <option key={i + 1} value={i + 1}>{i + 1} Adet</option>
                                      ))}
                                    </select>
                                  )}
                                </div>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleClose}
                  disabled={isPending}
                >
                  İptal
                </button>
                <div className="d-flex flex-column align-items-end">
                  <button
                    type="button"
                    className="btn btn-warning"
                    onClick={handleApproveClick}
                    disabled={isPending || !hasSelectedProducts}
                    style={{
                      backgroundColor: hasSelectedProducts ? "#ff6600" : "#6c757d",
                      borderColor: hasSelectedProducts ? "#ff6600" : "#6c757d",
                      opacity: hasSelectedProducts ? 1 : 0.6
                    }}
                  >
                    Onayla
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.8)", zIndex: 1070 }}
          tabIndex={-1}
          role="dialog"
          onClick={(e) => {
            // Prevent backdrop click from closing modal
            if (e.target === e.currentTarget) {
              e.stopPropagation();
            }
          }}
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" style={{ color: "#333", fontWeight: "600" }}>
                  <i className="bx bx-check me-2"></i>
                  Onaylamak istediğiniz ürünleri seçiniz
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCancelConfirm}
                  aria-label="Close"
                ></button>
              </div>

              <div className="modal-body text-center">
                {/* Warning Icon */}
                <div className="mb-4">
                  <div
                    className="d-inline-flex align-items-center justify-content-center"
                    style={{
                      width: "80px",
                      height: "80px",
                      backgroundColor: "#fff3cd",
                      border: "4px solid #ff6600",
                      borderRadius: "50%",
                      position: "relative"
                    }}
                  >
                    <i
                      className="bx bx-error"
                      style={{
                        fontSize: "2.5rem",
                        color: "#ff6600"
                      }}
                    ></i>
                    {/* Dashed lines around the icon */}
                    <div
                      style={{
                        position: "absolute",
                        top: "-10px",
                        left: "-10px",
                        right: "-10px",
                        bottom: "-10px",
                        border: "2px dashed #ff6600",
                        borderRadius: "50%",
                        opacity: 0.7
                      }}
                    ></div>
                  </div>
                </div>

                {/* Confirmation Text */}
                <div className="mb-4">
                  <p className="mb-2" style={{ color: "#333", fontSize: "1rem", fontWeight: "500" }}>
                    Seçtiğiniz <strong style={{ color: "#000" }}>1 adet siparişte</strong> <strong style={{ color: "#000" }}>{claim.items.reduce((total, item) => total + (item.claimItems?.length || 0), 0)} adet ürünün</strong> iadesini onaylamak üzeresiniz, bu adımdan sonra ilgili siparişler onaylanacaktır.
                  </p>
                  <p className="mb-0" style={{ color: "#333", fontSize: "1rem", fontWeight: "500" }}>
                    Doğru siparişleri seçtiğinizden emin olun. İşlemi onaylıyor musunuz?
                  </p>
                </div>
              </div>

              <div className="modal-footer justify-content-center">
                <button
                  type="button"
                  className="btn btn-outline-secondary me-3"
                  onClick={handleCancelConfirm}
                  disabled={isPending}
                >
                  Vazgeç
                </button>
                <button
                  type="button"
                  className="btn btn-warning"
                  onClick={handleConfirmApprove}
                  disabled={isPending}
                  style={{ backgroundColor: "#ff6600", borderColor: "#ff6600" }}
                >
                  {isPending ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Onaylanıyor...
                    </>
                  ) : (
                    <>
                      <i className="bx bx-check me-1"></i>
                      Onayla
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ClaimApproveModal;