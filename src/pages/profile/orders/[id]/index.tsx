import { OrderItem } from "@/constants/models/Order";
import { useGetOrderById } from "@/hooks/services/order/useGetOrderById";
import {
  getOrderStatusClass,
  getOrderStatusText,
} from "@/utils/orderStatus";
import useGetPaymentDetail from "@/hooks/services/payment/useGetPaymentDetail";
import { useInitiateOrderRefundRequest } from "@/hooks/services/order/useInitiateOrderRefundRequest";
import { useGetUserCancelReasonTypes } from "@/hooks/services/enum-options/useGetUserCancelReasonTypes";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import { useQueryClient } from "@tanstack/react-query";
import { withProfileLayout } from "@/pages/profile/_layout";
import GeneralModal from "@/components/shared/GeneralModal";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import toast from "react-hot-toast";

function OrderDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const { t } = useLanguage(); // Initialize useLanguage
  const { order, isLoading, error, refetchOrder } = useGetOrderById({
    orderId: id as string,
  });
  const { getPaymentDetail, isPending: isPaymentLoading } =
    useGetPaymentDetail();
  const [paymentDetail, setPaymentDetail] = useState<any>(null);
  const queryClient = useQueryClient();
  const { data: cancelReasonTypes = [] } = useGetUserCancelReasonTypes(true);
  const { initiateOrderRefund, isPending: isRefundSubmitting } =
    useInitiateOrderRefundRequest();
  const [refundReasonType, setRefundReasonType] = useState<number | "">("");
  const [refundDescription, setRefundDescription] = useState("");

  // Payment detaylarını yükle
  useEffect(() => {
    const loadPaymentDetail = async () => {
      if (order?.paymentId) {
        try {
          const detail = await getPaymentDetail({
            paymentId: order.paymentId,
            conversationId: `payment_${Date.now()}`,
          });
          setPaymentDetail(detail.data);
        } catch (error) {
          console.error(t("ordersId.paymentError"), error);
        }
      }
    };

    loadPaymentDetail();
  }, [order?.paymentId, getPaymentDetail]);

  const formatCurrency = (amount: number): string => {
    if (isNaN(amount) || amount === null || amount === undefined) {
      amount = 0;
    }
    return new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "200px" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">{t("ordersId.loading")}</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {t("ordersId.error").replace("{message}", error.message)}
      </div>
    );
  }

  // Toplam: API'deki totalPrice veya orderProducts/orderItems üzerinden hesapla
  const totalAmount =
    order?.totalPrice ??
    (order?.orderProducts?.length
      ? order.orderProducts.reduce(
          (sum: number, item: OrderItem) =>
            sum +
            (typeof item.orderItemDiscountedPrice === "number"
              ? item.orderItemDiscountedPrice
              : item.orderItemPrice ?? 0) *
              (typeof item.quantity === "number" ? item.quantity : 0),
          0
        )
      : order?.orderItems?.reduce(
          (sum: number, item: OrderItem) => {
            const price =
              typeof item.orderItemDiscountedPrice === "number"
                ? item.orderItemDiscountedPrice
                : typeof item.price === "number"
                  ? item.price
                  : 0;
            const quantity = typeof item.quantity === "number" ? item.quantity : 0;
            return sum + price * quantity;
          },
          0
        ));

  const statusCode = order?.orderStatus ?? order?.cargoStatus ?? 0;
  const phone =
    order?.recipientPhoneNumber ?? order?.shippingAddress?.phoneNumber;
  const phoneDisplay =
    !phone || String(phone).includes("undefined") ? "—" : phone;
  const productList =
    order?.orderProducts?.length
      ? order.orderProducts
      : order?.orderItems ?? [];

  const recipientName = [order?.recipientFirstName, order?.recipientLastName]
    .filter(Boolean)
    .join(" ");

  const hasRefundableProduct = productList.some(
    (item: OrderItem) => item.isRefundAllowed === true
  );
  const nonRefundableCount = productList.filter(
    (item: OrderItem) => item.isRefundAllowed !== true
  ).length;

  const openRefundModal = () => {
    setRefundReasonType("");
    setRefundDescription("");
    const el = document.getElementById("orderRefundModal");
    if (el) {
      const bootstrap = (window as any).bootstrap;
      const modal = bootstrap?.Modal.getOrCreateInstance(el);
      modal?.show();
    }
  };

  const closeRefundModal = () => {
    const el = document.getElementById("orderRefundModal");
    if (el) {
      const bootstrap = (window as any).bootstrap;
      bootstrap?.Modal.getInstance(el)?.hide();
    }
  };

  const handleRefundSubmit = async () => {
    if (!order?.id) return;
    const reason = refundReasonType === "" ? null : Number(refundReasonType);
    if (reason === null || reason === undefined || Number.isNaN(reason)) {
      toast.error(t("ordersId.refundReason") + " seçiniz.");
      return;
    }
    try {
      await initiateOrderRefund({
        orderId: order.id,
        reasonType: reason,
        description: refundDescription.trim() || "",
      });
      closeRefundModal();
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.USER_REFUND_REQUESTS],
      });
    } catch {
      // toast handled in hook
    }
  };

  return (
    <div className="col-lg-12">
      <div className="my-account-content account-order order-detail-page">
        {/* ——— Masaüstü: tablo ——— */}
        <div className="d-none d-lg-block">
          <div className="wrap-account-order mb-4">
            <table>
              <thead>
                <tr>
                  <th className="fw-6">{t("orders.order")}</th>
                  <th className="fw-6">{t("orders.date")}</th>
                  <th className="fw-6">{t("orders.status")}</th>
                  <th className="fw-6">{t("orders.total")}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>#{order?.orderNumber}</td>
                  <td>
                    {order?.createdOnValue
                      ? new Date(order.createdOnValue).toLocaleDateString("tr-TR")
                      : "—"}
                  </td>
                  <td>
                    <span
                      className={`badge ${getOrderStatusClass(statusCode)} text-white`}
                    >
                      {getOrderStatusText(statusCode, t)}
                    </span>
                  </td>
                  <td>{formatCurrency(totalAmount ?? 0)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="wrap-account-order mb-4">
            <table>
              <thead>
                <tr>
                  <th className="fw-6" colSpan={2}>
                    {t("ordersId.deliveryInfo")}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="text-muted" style={{ width: "140px" }}>
                    {t("ordersId.recipient")}
                  </td>
                  <td>{recipientName || "—"}</td>
                </tr>
                <tr>
                  <td className="text-muted">{t("ordersId.phone")}</td>
                  <td>{phoneDisplay}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {order?.paymentId && (
            <div className="wrap-account-order mb-4">
              <table>
                <thead>
                  <tr>
                    <th className="fw-6" colSpan={2}>
                      {t("ordersId.paymentInfo")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {isPaymentLoading ? (
                    <tr>
                      <td colSpan={2}>{t("ordersId.paymentLoading")}</td>
                    </tr>
                  ) : paymentDetail ? (
                    <>
                      <tr>
                        <td className="text-muted" style={{ width: "140px" }}>
                          {t("ordersId.paymentId")}
                        </td>
                        <td>{order.paymentId}</td>
                      </tr>
                      <tr>
                        <td className="text-muted">
                          {t("ordersId.paymentStatus")}
                        </td>
                        <td>{t("ordersId.paymentSuccess")}</td>
                      </tr>
                    </>
                  ) : (
                    <tr>
                      <td colSpan={2}>{t("ordersId.paymentNotFound")}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          <div className="wrap-account-order mb-4">
            <table>
              <thead>
                <tr>
                  <th className="fw-6">{t("ordersId.orderedProducts")}</th>
                  <th className="fw-6">{t("ordersId.quantity")}</th>
                  <th className="fw-6">{t("orders.total")}</th>
                  <th className="fw-6">{t("ordersId.refundStatus")}</th>
                </tr>
              </thead>
              <tbody>
                {productList.length === 0 ? (
                  <tr>
                    <td colSpan={4}>—</td>
                  </tr>
                ) : (
                  productList.map((item: OrderItem, index: number) => {
                    const imageUrl =
                      item.baseImageUrl ?? item.product?.baseImageUrl;
                    const title =
                      item.productTitle ??
                      item.product?.title ??
                      item.product?.productTitle ??
                      "";
                    const qty =
                      typeof item.quantity === "number" ? item.quantity : 0;
                    const unitPrice =
                      typeof item.orderItemDiscountedPrice === "number"
                        ? item.orderItemDiscountedPrice
                        : typeof item.orderItemPrice === "number"
                          ? item.orderItemPrice
                          : typeof item.price === "number"
                            ? item.price
                            : 0;
                    const lineTotal = unitPrice * qty;
                    const key = item.id ?? item.productId ?? `item-${index}`;
                    const isRefundAllowed = item.isRefundAllowed === true;
                    return (
                      <tr key={key}>
                        <td>
                          <div className="d-flex align-items-center gap-3">
                            {imageUrl && (
                              <div
                                className="flex-shrink-0 rounded overflow-hidden border"
                                style={{
                                  width: 64,
                                  height: 64,
                                  borderColor: "var(--line)",
                                }}
                              >
                                <Image
                                  src={imageUrl}
                                  alt={title}
                                  width={64}
                                  height={64}
                                  className="object-fit-cover"
                                  style={{ width: 64, height: 64 }}
                                />
                              </div>
                            )}
                            <span>{title || "—"}</span>
                          </div>
                        </td>
                        <td>{qty}</td>
                        <td>{formatCurrency(lineTotal)}</td>
                        <td>
                          <span
                            className={`badge ${
                              isRefundAllowed ? "bg-success" : "bg-secondary"
                            } text-white`}
                          >
                            {isRefundAllowed
                              ? t("ordersId.refundable")
                              : t("ordersId.nonRefundable")}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ——— Mobil: kart düzeni (kesilme yok, dokunmatik dostu) ——— */}
        <div className="d-block d-lg-none">
          <div
            className="order-detail-mobile-section mb-4 rounded border p-3"
            style={{ borderColor: "var(--line)", backgroundColor: "var(--bg-11, #f9f9f9)" }}
          >
            <div className="d-flex flex-column gap-3">
              <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                <span className="text-muted small">{t("orders.order")}</span>
                <span className="fw-semibold text-break">#{order?.orderNumber}</span>
              </div>
              <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                <span className="text-muted small">{t("orders.date")}</span>
                <span className="text-break">
                  {order?.createdOnValue
                    ? new Date(order.createdOnValue).toLocaleDateString("tr-TR")
                    : "—"}
                </span>
              </div>
              <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                <span className="text-muted small">{t("orders.status")}</span>
                <span
                  className={`badge ${getOrderStatusClass(statusCode)} text-white`}
                >
                  {getOrderStatusText(statusCode, t)}
                </span>
              </div>
              <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 pt-2 border-top" style={{ borderColor: "var(--line)" }}>
                <span className="text-muted small">{t("orders.total")}</span>
                <span className="fw-semibold">{formatCurrency(totalAmount ?? 0)}</span>
              </div>
            </div>
          </div>

          <div
            className="order-detail-mobile-section mb-4 rounded border p-3"
            style={{ borderColor: "var(--line)", backgroundColor: "var(--bg-11, #f9f9f9)" }}
          >
            <h6 className="fw-6 mb-3">{t("ordersId.deliveryInfo")}</h6>
            <div className="d-flex flex-column gap-2">
              <div>
                <span className="text-muted small d-block">{t("ordersId.recipient")}</span>
                <span className="text-break">{recipientName || "—"}</span>
              </div>
              <div>
                <span className="text-muted small d-block">{t("ordersId.phone")}</span>
                <span>{phoneDisplay}</span>
              </div>
            </div>
          </div>

          {order?.paymentId && (
            <div
              className="order-detail-mobile-section mb-4 rounded border p-3"
              style={{ borderColor: "var(--line)", backgroundColor: "var(--bg-11, #f9f9f9)" }}
            >
              <h6 className="fw-6 mb-3">{t("ordersId.paymentInfo")}</h6>
              {isPaymentLoading ? (
                <p className="mb-0">{t("ordersId.paymentLoading")}</p>
              ) : paymentDetail ? (
                <div className="d-flex flex-column gap-2">
                  <div>
                    <span className="text-muted small d-block">{t("ordersId.paymentId")}</span>
                    <span className="text-break">{order.paymentId}</span>
                  </div>
                  <div>
                    <span className="text-muted small d-block">{t("ordersId.paymentStatus")}</span>
                    <span>{t("ordersId.paymentSuccess")}</span>
                  </div>
                </div>
              ) : (
                <p className="mb-0">{t("ordersId.paymentNotFound")}</p>
              )}
            </div>
          )}

          <div
            className="order-detail-mobile-section mb-4 rounded border p-3"
            style={{ borderColor: "var(--line)", backgroundColor: "var(--bg-11, #f9f9f9)" }}
          >
            <h6 className="fw-6 mb-3">{t("ordersId.orderedProducts")}</h6>
            {productList.length === 0 ? (
              <p className="mb-0 text-muted">—</p>
            ) : (
              <div className="d-flex flex-column gap-3">
                {productList.map((item: OrderItem, index: number) => {
                  const imageUrl =
                    item.baseImageUrl ?? item.product?.baseImageUrl;
                  const title =
                    item.productTitle ??
                    item.product?.title ??
                    item.product?.productTitle ??
                    "";
                  const qty =
                    typeof item.quantity === "number" ? item.quantity : 0;
                  const unitPrice =
                    typeof item.orderItemDiscountedPrice === "number"
                      ? item.orderItemDiscountedPrice
                      : typeof item.orderItemPrice === "number"
                        ? item.orderItemPrice
                        : typeof item.price === "number"
                          ? item.price
                          : 0;
                  const lineTotal = unitPrice * qty;
                  const key = item.id ?? item.productId ?? `item-${index}`;
                  const isRefundAllowed = item.isRefundAllowed === true;
                  return (
                    <div
                      key={key}
                      className="d-flex align-items-center gap-3 p-2 rounded border"
                      style={{ borderColor: "var(--line)" }}
                    >
                      {imageUrl && (
                        <div
                          className="flex-shrink-0 rounded overflow-hidden border"
                          style={{
                            width: 56,
                            height: 56,
                            borderColor: "var(--line)",
                          }}
                        >
                          <Image
                            src={imageUrl}
                            alt={title}
                            width={56}
                            height={56}
                            className="object-fit-cover"
                            style={{ width: 56, height: 56 }}
                          />
                        </div>
                      )}
                      <div className="flex-grow-1 min-w-0">
                        <div className="text-break">{title || "—"}</div>
                        <div className="small text-muted">
                          {t("ordersId.quantity")}: {qty} · {formatCurrency(lineTotal)}
                        </div>
                        <span
                          className={`badge mt-1 ${
                            isRefundAllowed ? "bg-success" : "bg-secondary"
                          } text-white`}
                          style={{ fontSize: "0.7rem" }}
                        >
                          {isRefundAllowed
                            ? t("ordersId.refundable")
                            : t("ordersId.nonRefundable")}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* İade talebi — en az bir iade edilebilir ürün varsa */}
        {hasRefundableProduct && (
          <div className="mt-4">
            {nonRefundableCount > 0 && (
              <div
                className="alert alert-warning mb-3"
                role="alert"
              >
                {t("ordersId.refundWarningNonRefundable").replace(
                  "{count}",
                  String(nonRefundableCount)
                )}
              </div>
            )}
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary me-2 mb-2"
              style={{
                padding: "8px 14px",
                fontSize: "14px",
                fontWeight: 500,
                borderRadius: "4px",
              }}
              onClick={openRefundModal}
            >
              {t("ordersId.requestRefund")}
            </button>
          </div>
        )}

        {/* Siparişlere dön — mobilde tam genişlik */}
        <div className="mt-4">
          <Link
            href="/profile/orders"
            className="btn btn-sm w-100 w-lg-auto d-inline-flex justify-content-center align-items-center"
            style={{
              padding: "10px 16px",
              fontSize: "14px",
              fontWeight: 500,
              borderRadius: "4px",
              color: "#fff",
              backgroundColor: "#000",
              border: "none",
            }}
          >
            {t("ordersId.backToOrders")}
          </Link>
        </div>
      </div>

      {/* İade talebi modal */}
      <GeneralModal
        id="orderRefundModal"
        title={t("ordersId.requestRefund")}
        size="md"
        showFooter={true}
        onClose={closeRefundModal}
        onApprove={handleRefundSubmit}
        approveButtonText={t("ordersId.refundSubmit")}
        approveButtonClassName="btn-primary"
        isLoading={isRefundSubmitting}
      >
        {nonRefundableCount > 0 && (
          <div className="alert alert-warning mb-3" role="alert">
            {t("ordersId.refundWarningNonRefundable").replace(
              "{count}",
              String(nonRefundableCount)
            )}
          </div>
        )}
        <div className="mb-3">
          <label className="form-label fw-semibold">
            {t("ordersId.refundReason")}
          </label>
          <select
            className="form-select"
            value={refundReasonType}
            onChange={(e) =>
              setRefundReasonType(
                e.target.value === "" ? "" : Number(e.target.value)
              )
            }
            disabled={isRefundSubmitting}
          >
            <option value="">Seçiniz</option>
            {cancelReasonTypes.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.displayName}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label fw-semibold">
            {t("ordersId.refundDescription")}
          </label>
          <textarea
            className="form-control"
            rows={3}
            value={refundDescription}
            onChange={(e) => setRefundDescription(e.target.value)}
            disabled={isRefundSubmitting}
            placeholder={t("ordersId.refundDescription")}
          />
        </div>
      </GeneralModal>
    </div>
  );
}

export default withProfileLayout(OrderDetailPage);