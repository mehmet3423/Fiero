import GeneralModal from "@/components/shared/GeneralModal";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import {
  RefundRequestedOrder,
  RefundRequestedOrderItem,
} from "@/constants/models/Order";
import { useGetRefundRejectReasons } from "@/hooks/services/enum-options/useGetRefundRejectReasons";
import { useProcessRefundItems } from "@/hooks/services/payment/useProcessRefundItems";
import { useProcessRefundItemsByOrder } from "@/hooks/services/payment/useProcessRefundItemsByOrder";
import { formatCurrency } from "@/utils/currencyFormatter";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

interface ModalRefundItem extends RefundRequestedOrderItem {
  modalItemId: string;
  displayTitle: string;
  calculatedQuantity: number;
  calculatedTotal: number;
  isBundleItem: boolean;
  bundleProductNames: string[];
}

const buildModalItemId = (
  item: any,
  index: number,
  fallbackPrefix: string
): string => {
  const candidate =
    item?.orderItemNumber ||
    item?.id ||
    item?.paymentTransactionId ||
    item?.productId;

  const base =
    (typeof candidate === "number" || typeof candidate === "string") &&
      candidate !== ""
      ? String(candidate)
      : `${fallbackPrefix}-${index}`;

  return `${base}-${index}`;
};

const ensureArray = <T,>(value: T[] | null | undefined): T[] =>
  Array.isArray(value) ? value : [];

const pickNumber = (
  ...values: Array<number | string | null | undefined>
): number => {
  for (const value of values) {
    if (value === null || value === undefined || value === "") continue;
    const parsed = Number(value);
    if (Number.isFinite(parsed) && !Number.isNaN(parsed)) {
      return parsed;
    }
  }
  return 0;
};

const multiply = (a: number, b: number) =>
  Number.isFinite(a) && Number.isFinite(b) ? a * b : NaN;

const getBundleProductsFromItem = (item: any): any[] => {
  if (!item) {
    return [];
  }
  if (Array.isArray(item.bundleProducts) && item.bundleProducts.length > 0) {
    return item.bundleProducts;
  }
  if (
    item.bundleDiscount &&
    Array.isArray(item.bundleDiscount.bundleDiscountProducts) &&
    item.bundleDiscount.bundleDiscountProducts.length > 0
  ) {
    return item.bundleDiscount.bundleDiscountProducts;
  }
  if (
    Array.isArray(item.bundleDiscountProducts) &&
    item.bundleDiscountProducts.length > 0
  ) {
    return item.bundleDiscountProducts;
  }
  return [];
};

const isBundleItem = (item: any): boolean => {
  if (!item) return false;
  const rawType = item.itemType || item.type;
  return (
    rawType === "BUNDLE" ||
    Boolean(item.isBundle) ||
    getBundleProductsFromItem(item).length > 0
  );
};

const getBundleProductNames = (products: any[]): string[] =>
  products
    .map(
      (product) =>
        product?.product?.title ||
        product?.product?.productTitle ||
        product?.title ||
        product?.productTitle ||
        ""
    )
    .filter((name: string) => !!name);

type RefundScope = "order" | "items";
type RefundDecision = "approve" | "reject";

interface RefundActionModalProps {
  refundRequest: RefundRequestedOrder | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const MODAL_ID = "adminRefundActionModal";

export default function RefundActionModal({
  refundRequest,
  isOpen,
  onClose,
  onSuccess,
}: RefundActionModalProps) {
  const queryClient = useQueryClient();
  const [decision, setDecision] = useState<RefundDecision>("approve");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [rejectReasonId, setRejectReasonId] = useState<number | null>(null);
  const [description, setDescription] = useState("");

  const displayItems = useMemo<RefundRequestedOrderItem[]>(() => {
    return ensureArray(
      (refundRequest?.displayItems as RefundRequestedOrderItem[]) || []
    );
  }, [refundRequest?.displayItems]);

  const refundRequestedDisplayItems = useMemo(
    () =>
      displayItems.filter(
        (item) =>
          item.cancelReasonType !== null && item.cancelReasonType !== undefined
      ),
    [displayItems]
  );

  // Modal modunu otomatik belirle: sipariş iptali mi ürün iptali mi?
  const refundScope = useMemo<RefundScope>(() => {
    if (!refundRequest) return "order";

    console.log("🔍 [RefundActionModal] refundRequest:", refundRequest);
    console.log("🔍 [RefundActionModal] displayItems:", displayItems);
    console.log(
      "🔍 [RefundActionModal] displayItems length:",
      displayItems.length
    );

    displayItems.forEach((item: any, index: number) => {
      console.log(`🔍 [RefundActionModal] displayItems[${index}]:`, {
        orderItemNumber: item.orderItemNumber,
        productId: item.productId,
        name: item.name,
        rejectReason: item.rejectReason,
        cancelReasonType: item.cancelReasonType,
        paymentTransactionId: item.paymentTransactionId,
      });
    });

    const hasItemRefundRequests = refundRequestedDisplayItems.length > 0;

    console.log(
      "🔍 [RefundActionModal] hasItemRefundRequests (by cancelReasonType):",
      hasItemRefundRequests
    );
    console.log(
      "🔍 [RefundActionModal] displayItems with cancelReasonType !== null:",
      refundRequestedDisplayItems
    );

    const scope = hasItemRefundRequests ? "items" : "order";
    console.log("🔍 [RefundActionModal] Determined scope:", scope);

    return scope;
  }, [refundRequest, displayItems, refundRequestedDisplayItems]);

  // Modalda gösterilecek ürünleri hazırla
  const orderItems = useMemo<ModalRefundItem[]>(() => {
    if (!refundRequest) return [];

    if (refundScope === "items" && refundRequestedDisplayItems.length > 0) {
      return refundRequestedDisplayItems.map((item, index) => {
        const modalItemId = buildModalItemId(item, index, "display-item");
        const quantity = Math.max(
          1,
          pickNumber(
            item.quantity,
            item.totalQuantity,
            item.paidQuantity,
            item.bundleQuantity,
            item.itemQuantity
          )
        );
        const bundleProducts = getBundleProductsFromItem(item);
        const bundleNames = getBundleProductNames(bundleProducts);
        const bundleFlag = isBundleItem(item);
        const totalAmount = pickNumber(
          item.totalDiscountedPrice,
          item.discountedTotal,
          item.totalPrice,
          multiply(
            pickNumber(
              item.orderItemDiscountedPrice,
              item.discountedUnitPrice,
              item.discountedPrice,
              item.orderItemPrice,
              item.price
            ),
            quantity
          ),
          item.orderItemTotalPrice
        );

        return {
          ...item,
          modalItemId,
          displayTitle:
            item.productTitle ||
            item.title ||
            item.displayTitle ||
            item.name ||
            (bundleFlag ? "Bundle Ürünü" : "Ürün"),
          calculatedQuantity: quantity,
          calculatedTotal: totalAmount || 0,
          isBundleItem: bundleFlag,
          bundleProductNames: bundleNames,
        };
      });
    }

    const fallbackItems = ensureArray(refundRequest.orderProducts).map(
      (item, index) => {
        const modalItemId = buildModalItemId(item, index, "order-product");
        const bundleProducts = getBundleProductsFromItem(item);
        const bundleNames = getBundleProductNames(bundleProducts);
        const bundleFlag = isBundleItem(item);
        const quantity = Math.max(
          1,
          pickNumber(item.quantity, item.totalQuantity, item.paidQuantity, 1)
        );
        const totalAmount = pickNumber(
          item.totalDiscountedPrice,
          item.discountedTotal,
          item.totalPrice,
          multiply(
            pickNumber(
              item.orderItemDiscountedPrice,
              item.discountedUnitPrice,
              item.discountedPrice,
              item.orderItemPrice,
              item.price
            ),
            quantity
          ),
          item.orderItemTotalPrice
        );

        return {
          ...item,
          modalItemId,
          displayTitle:
            item.productTitle ||
            item.title ||
            item.displayTitle ||
            item.name ||
            (bundleFlag ? "Bundle Ürünü" : "Ürün"),
          calculatedQuantity: quantity,
          calculatedTotal: totalAmount || 0,
          isBundleItem: bundleFlag,
          bundleProductNames: bundleNames,
        };
      }
    );

    return fallbackItems;
  }, [refundRequest, refundScope, refundRequestedDisplayItems]);

  const { data: rejectReasons, isLoading: isLoadingRejectReasons } =
    useGetRefundRejectReasons(isOpen);

  const { processRefundItems, isPending: isProcessingItems } =
    useProcessRefundItems();
  const { processRefundItemsByOrder, isPending: isProcessingOrder } =
    useProcessRefundItemsByOrder();

  const isSubmitting = isProcessingItems || isProcessingOrder;

  const resetState = () => {
    setDecision("approve");
    setSelectedItems([]);
    setRejectReasonId(null);
    setDescription("");
  };

  const cleanupBackdrops = () => {
    const backdrops = document.querySelectorAll(".modal-backdrop");
    backdrops.forEach((backdrop) => backdrop.remove());
    document.body.classList.remove("modal-open");
    document.body.style.overflow = "";
    document.body.style.paddingRight = "";
  };

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const modalElement = document.getElementById(MODAL_ID);
    if (!modalElement) {
      return;
    }

    const bootstrap = (window as any).bootstrap;
    if (!bootstrap || !bootstrap.Modal) {
      return;
    }

    let modalInstance = bootstrap.Modal.getInstance(modalElement);
    if (!modalInstance) {
      modalInstance = new bootstrap.Modal(modalElement);
    }

    modalInstance.show();

    const handleHidden = () => {
      cleanupBackdrops();
      resetState();
      onClose();
    };

    modalElement.addEventListener("hidden.bs.modal", handleHidden);

    return () => {
      modalElement.removeEventListener("hidden.bs.modal", handleHidden);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      resetState();
    }
  }, [isOpen, refundRequest?.id]);

  const handleClose = () => {
    const modalElement = document.getElementById(MODAL_ID);
    if (!modalElement) {
      onClose();
      return;
    }

    const bootstrap = (window as any).bootstrap;
    const modalInstance = bootstrap?.Modal.getInstance(modalElement);

    if (modalInstance) {
      modalInstance.hide();
    } else {
      cleanupBackdrops();
      resetState();
      onClose();
    }
  };

  const toggleItemSelection = (itemId: string, checked: boolean) => {
    setSelectedItems((prev) => {
      if (checked) {
        return Array.from(new Set([...prev, itemId]));
      }
      return prev.filter((id) => id !== itemId);
    });
  };

  const handleSubmit = async () => {
    if (!refundRequest) {
      return;
    }

    const trimmedDescription = description.trim();
    const isApproved = decision === "approve";

    if (decision === "reject") {
      if (rejectReasonId === null || rejectReasonId === undefined) {
        toast.error("Lütfen bir reddetme nedeni seçiniz.");
        return;
      }

      if (!trimmedDescription) {
        toast.error("Lütfen reddetme gerekçesini açıklayınız.");
        return;
      }
    }

    if (refundScope === "items" && selectedItems.length === 0) {
      toast.error("Lütfen işlem yapmak istediğiniz ürünleri seçiniz.");
      return;
    }

    try {
      let result = null;

      const processOrderLevel = () =>
        processRefundItemsByOrder({
          orderId: refundRequest.id,
          isApproved,
          rejectReason: isApproved ? null : rejectReasonId,
          description: trimmedDescription,
        });

      if (refundScope === "order") {
        result = await processOrderLevel();
      } else {
        const selectedModalItems = selectedItems
          .map((itemId) =>
            orderItems.find((orderItem) => orderItem.modalItemId === itemId)
          )
          .filter((item): item is ModalRefundItem => Boolean(item));

        const hasBundleSelection = selectedModalItems.some(
          (item) => item.isBundleItem
        );

        if (hasBundleSelection) {
          result = await processOrderLevel();
        } else {
          const payloadItems = selectedModalItems
            .map((item) => ({
              paymentTransactionId:
                item.paymentTransactionId ||
                (item as Record<string, any>)?.paymentTransactionId ||
                "",
              isApproved,
              rejectReason: isApproved ? null : rejectReasonId,
              description: trimmedDescription,
            }))
            .filter((payload) => !!payload.paymentTransactionId);

          if (payloadItems.length === 0) {
            toast.error("İşlem yapılacak ürünlerin ödeme bilgisi bulunamadı.");
            return;
          }

          result = await processRefundItems({
            items: payloadItems,
          });
        }
      }

      if (result) {
        await queryClient.invalidateQueries({
          queryKey: [QueryKeys.REFUND_REQUESTED_ORDER_ITEMS],
        });
        onSuccess?.();
        handleClose();
      }
    } catch (error) {
      console.error("Refund action error:", error);
    }
  };

  const allItemsSelected =
    selectedItems.length > 0 &&
    selectedItems.length === orderItems.length &&
    orderItems.length > 0;

  const toggleSelectAll = () => {
    if (allItemsSelected) {
      setSelectedItems([]);
    } else {
      setSelectedItems(
        orderItems
          .map((item) => item.modalItemId)
          .filter((id): id is string => !!id)
      );
    }
  };

  return (
    <GeneralModal
      id={MODAL_ID}
      title="İade Talebini İşle"
      showFooter={false}
      size="lg"
    >
      {!refundRequest ? (
        <div className="text-center text-muted py-5">
          İşlem yapılacak iade talebi bulunamadı.
        </div>
      ) : (
        <div>
          <div className="mb-3">
            <label className="form-label fw-semibold text-muted">Karar</label>
            <div className="d-flex flex-wrap gap-2">
              <button
                type="button"
                className={`btn btn-sm ${decision === "approve" ? "btn-success" : "btn-outline-success"
                  }`}
                onClick={() => setDecision("approve")}
                disabled={isSubmitting}
              >
                Onayla
              </button>
              <button
                type="button"
                className={`btn btn-sm ${decision === "reject" ? "btn-danger" : "btn-outline-danger"
                  }`}
                onClick={() => setDecision("reject")}
                disabled={isSubmitting}
              >
                Reddet
              </button>
            </div>
          </div>

          {refundScope === "items" && (
            <div className="mb-4">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="mb-0">Ürünler</h6>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary"
                  onClick={toggleSelectAll}
                  disabled={isSubmitting || orderItems.length === 0}
                >
                  {allItemsSelected ? "Seçimi Kaldır" : "Tümünü Seç"}
                </button>
              </div>

              {orderItems.length === 0 ? (
                <div className="alert alert-warning mb-0">
                  Bu iade talebi için ürün bulunamadı.
                  <br />
                  <small className="text-muted">
                    Debug: refundScope={refundScope}, orderItems count=
                    {orderItems.length}
                  </small>
                </div>
              ) : (
                <div className="table-responsive border rounded">
                  <table className="table table-sm mb-0 align-middle">
                    <thead className="table-light">
                      <tr>
                        <th style={{ width: "40px" }}>
                          <input
                            type="checkbox"
                            className="form-check-input"
                            checked={allItemsSelected}
                            onChange={toggleSelectAll}
                            disabled={isSubmitting}
                          />
                        </th>
                        <th>Ürün</th>
                        <th style={{ width: "80px" }} className="text-center">
                          Adet
                        </th>
                        <th style={{ width: "120px" }} className="text-end">
                          Toplam
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderItems.map((item) => (
                        <tr key={item.modalItemId}>
                          <td>
                            <input
                              type="checkbox"
                              className="form-check-input"
                              checked={selectedItems.includes(item.modalItemId)}
                              onChange={(e) =>
                                toggleItemSelection(
                                  item.modalItemId,
                                  e.target.checked
                                )
                              }
                              disabled={isSubmitting || !item.modalItemId}
                            />
                          </td>
                          <td>
                            <div className="fw-semibold d-flex align-items-center gap-2 flex-wrap">
                              {item.displayTitle || item.productTitle || "Ürün"}
                              {item.isBundleItem && (
                                <span className="badge bg-primary text-white">
                                  Bundle
                                </span>
                              )}
                            </div>
                            {item.bundleProductNames?.length > 0 && (
                              <small className="text-muted d-block">
                                {item.bundleProductNames.slice(0, 3).join(", ")}
                                {item.bundleProductNames.length > 3 &&
                                  ` +${item.bundleProductNames.length - 3
                                  } ürün`}
                              </small>
                            )}
                            <small className="text-muted">
                              SKU: {item.orderItemNumber || "-"}
                            </small>
                          </td>
                          <td className="text-center">
                            {item.calculatedQuantity || item.quantity || 0}
                          </td>
                          <td className="text-end">
                            {formatCurrency(item.calculatedTotal || 0)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {decision === "reject" && (
            <div className="mb-3">
              <label className="form-label fw-semibold text-muted">
                Reddetme Nedeni
              </label>
              <select
                className="form-select"
                value={rejectReasonId ?? ""}
                onChange={(event) => {
                  const value = event.target.value;
                  setRejectReasonId(value ? Number(value) : null);
                }}
                disabled={isLoadingRejectReasons || isSubmitting}
              >
                <option value="">Seçiniz</option>
                {rejectReasons?.map((reason) => (
                  <option key={reason.value} value={reason.value}>
                    {reason.displayName}
                  </option>
                ))}
              </select>
              {isLoadingRejectReasons && (
                <small className="text-muted d-block mt-1">
                  Reddetme nedenleri yükleniyor...
                </small>
              )}
            </div>
          )}

          <div className="mb-3">
            <label className="form-label fw-semibold text-muted">
              Açıklama {decision === "reject" ? "(zorunlu)" : "(isteğe bağlı)"}
            </label>
            <textarea
              className="form-control"
              rows={4}
              placeholder={
                decision === "reject"
                  ? "Talebin neden reddedildiğini açıklayınız."
                  : "Talebi onaylarken not eklemek isterseniz yazabilirsiniz."
              }
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <div className="alert alert-info py-2 px-3">
            <div className="small">
              <strong>Sipariş Numarası:</strong>{" "}
              <span className="text-primary">#{refundRequest.orderNumber}</span>
            </div>
            <div className="small">
              <strong>Talep Sahibi:</strong> {refundRequest.email}
            </div>
          </div>

          <div className="d-flex justify-content-end gap-2 mt-4">
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              İptal
            </button>
            <button
              type="button"
              className={`btn btn-sm ${decision === "approve" ? "btn-success" : "btn-danger"
                }`}
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting && (
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
              )}
              {decision === "approve" ? "Talebi Onayla" : "Talebi Reddet"}
            </button>
          </div>
        </div>
      )}
    </GeneralModal>
  );
}
