import { OrderItem } from "@/constants/models/Order";
import { useGetOrderById } from "@/hooks/services/order/useGetOrderById";
import {
  getOrderStatusClass,
  getOrderStatusText,
} from "@/utils/orderStatus";
import useGetPaymentDetail from "@/hooks/services/payment/useGetPaymentDetail";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { NO_IMAGE_PATH, PLACEHOLDER_IMAGE_DATA_URI } from "@/utils/resolveImageUrl";

function GuestOrderDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const { t } = useLanguage();
  const { order, isLoading, error } = useGetOrderById({
    orderId: id as string,
  });
  const { getPaymentDetail, isPending: isPaymentLoading } =
    useGetPaymentDetail();
  const [paymentDetail, setPaymentDetail] = useState<any>(null);

  useEffect(() => {
    const loadPaymentDetail = async () => {
      if (order?.paymentId) {
        try {
          const detail = await getPaymentDetail({
            paymentId: order.paymentId,
            conversationId: `payment_${Date.now()}`,
          });
          setPaymentDetail(detail?.data);
        } catch {
          // Guest için ödeme detayı opsiyonel - sessizce geç
        }
      }
    };

    loadPaymentDetail();
  }, [order?.paymentId]);

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
      <main>
        <div className="tf-page-title">
          <div className="container-full">
            <div className="heading text-center">{t("guestOrder.successTitle")}</div>
          </div>
        </div>
        <section className="flat-spacing-11">
          <div className="container">
            <div className="d-flex justify-content-center align-items-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">{t("ordersId.loading")}</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (error || !order) {
    return (
      <main>
        <div className="tf-page-title">
          <div className="container-full">
            <div className="heading text-center">{t("guestOrder.successTitle")}</div>
          </div>
        </div>
        <section className="flat-spacing-11">
          <div className="container">
            <div className="alert alert-danger" role="alert">
              {error
                ? t("ordersId.error").replace("{message}", (error as Error).message)
                : t("ordersId.paymentNotFound")}
            </div>
            <Link href="/" className="btn btn-outline-primary-2 mt-3">
              {t("guestOrder.backToHome")}
            </Link>
          </div>
        </section>
      </main>
    );
  }

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

  return (
    <main>
      <div className="tf-page-title">
        <div className="container-full">
          <div className="heading text-center">{t("guestOrder.successTitle")}</div>
        </div>
      </div>

      <section className="flat-spacing-11">
        <div className="container">
          {/* Başarı mesajı */}
          <div className="alert alert-success mb-4" role="alert">
            <strong>{t("guestOrder.successTitle")}</strong>
            <br />
            {t("guestOrder.successMessage")}{" "}
            <strong>#{order?.orderNumber}</strong>
          </div>

          <div className="my-account-content account-order order-detail-page">
            {/* Masaüstü: tablo */}
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
                    </tr>
                  </thead>
                  <tbody>
                    {productList.length === 0 ? (
                      <tr>
                        <td colSpan={3}>—</td>
                      </tr>
                    ) : (
                      productList.map((item: OrderItem, index: number) => {
                        const imageUrl =
                          item.baseImageUrl ?? item.product?.baseImageUrl ?? NO_IMAGE_PATH;
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
                        return (
                          <tr key={key}>
                            <td>
                              <div className="d-flex align-items-center gap-3">
                                <div
                                  className="flex-shrink-0 rounded overflow-hidden border"
                                  style={{
                                    width: 64,
                                    height: 64,
                                    borderColor: "var(--line)",
                                  }}
                                >
                                  <img
                                    src={imageUrl}
                                    alt={title}
                                    width={64}
                                    height={64}
                                    style={{
                                      width: 64,
                                      height: 64,
                                      objectFit: "cover",
                                    }}
                                    onError={(e) => {
                                      e.currentTarget.src =
                                        PLACEHOLDER_IMAGE_DATA_URI;
                                    }}
                                  />
                                </div>
                                <span>{title || "—"}</span>
                              </div>
                            </td>
                            <td>{qty}</td>
                            <td>{formatCurrency(lineTotal)}</td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobil: kart düzeni */}
            <div className="d-block d-lg-none">
              <div
                className="order-detail-mobile-section mb-4 rounded border p-3"
                style={{
                  borderColor: "var(--line)",
                  backgroundColor: "var(--bg-11, #f9f9f9)",
                }}
              >
                <div className="d-flex flex-column gap-3">
                  <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                    <span className="text-muted small">{t("orders.order")}</span>
                    <span className="fw-semibold text-break">
                      #{order?.orderNumber}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                    <span className="text-muted small">{t("orders.date")}</span>
                    <span className="text-break">
                      {order?.createdOnValue
                        ? new Date(order.createdOnValue).toLocaleDateString(
                            "tr-TR"
                          )
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
                  <div
                    className="d-flex justify-content-between align-items-center flex-wrap gap-2 pt-2 border-top"
                    style={{ borderColor: "var(--line)" }}
                  >
                    <span className="text-muted small">{t("orders.total")}</span>
                    <span className="fw-semibold">
                      {formatCurrency(totalAmount ?? 0)}
                    </span>
                  </div>
                </div>
              </div>

              <div
                className="order-detail-mobile-section mb-4 rounded border p-3"
                style={{
                  borderColor: "var(--line)",
                  backgroundColor: "var(--bg-11, #f9f9f9)",
                }}
              >
                <h6 className="fw-6 mb-3">{t("ordersId.deliveryInfo")}</h6>
                <div className="d-flex flex-column gap-2">
                  <div>
                    <span className="text-muted small d-block">
                      {t("ordersId.recipient")}
                    </span>
                    <span className="text-break">{recipientName || "—"}</span>
                  </div>
                  <div>
                    <span className="text-muted small d-block">
                      {t("ordersId.phone")}
                    </span>
                    <span>{phoneDisplay}</span>
                  </div>
                </div>
              </div>

              {order?.paymentId && (
                <div
                  className="order-detail-mobile-section mb-4 rounded border p-3"
                  style={{
                    borderColor: "var(--line)",
                    backgroundColor: "var(--bg-11, #f9f9f9)",
                  }}
                >
                  <h6 className="fw-6 mb-3">{t("ordersId.paymentInfo")}</h6>
                  {isPaymentLoading ? (
                    <p className="mb-0">{t("ordersId.paymentLoading")}</p>
                  ) : paymentDetail ? (
                    <div className="d-flex flex-column gap-2">
                      <div>
                        <span className="text-muted small d-block">
                          {t("ordersId.paymentId")}
                        </span>
                        <span className="text-break">{order.paymentId}</span>
                      </div>
                      <div>
                        <span className="text-muted small d-block">
                          {t("ordersId.paymentStatus")}
                        </span>
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
                style={{
                  borderColor: "var(--line)",
                  backgroundColor: "var(--bg-11, #f9f9f9)",
                }}
              >
                <h6 className="fw-6 mb-3">{t("ordersId.orderedProducts")}</h6>
                {productList.length === 0 ? (
                  <p className="mb-0 text-muted">—</p>
                ) : (
                  <div className="d-flex flex-column gap-3">
                    {productList.map((item: OrderItem, index: number) => {
                      const imageUrl =
                        item.baseImageUrl ??
                        item.product?.baseImageUrl ??
                        NO_IMAGE_PATH;
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
                      return (
                        <div
                          key={key}
                          className="d-flex align-items-center gap-3 p-2 rounded border"
                          style={{ borderColor: "var(--line)" }}
                        >
                          <div
                            className="flex-shrink-0 rounded overflow-hidden border"
                            style={{
                              width: 56,
                              height: 56,
                              borderColor: "var(--line)",
                            }}
                          >
                            <img
                              src={imageUrl}
                              alt={title}
                              width={56}
                              height={56}
                              style={{
                                width: 56,
                                height: 56,
                                objectFit: "cover",
                              }}
                              onError={(e) => {
                                e.currentTarget.src =
                                  PLACEHOLDER_IMAGE_DATA_URI;
                              }}
                            />
                          </div>
                          <div className="flex-grow-1 min-w-0">
                            <div className="text-break">{title || "—"}</div>
                            <div className="small text-muted">
                              {t("ordersId.quantity")}: {qty} ·{" "}
                              {formatCurrency(lineTotal)}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Alt butonlar */}
            <div className="mt-4 d-flex flex-wrap gap-2">
              <Link
                href="/products"
                className="btn btn-primary"
                style={{
                  padding: "10px 16px",
                  fontSize: "14px",
                  fontWeight: 500,
                  borderRadius: "4px",
                }}
              >
                {t("guestOrder.continueShopping")}
              </Link>
              <Link
                href="/"
                className="btn btn-outline-secondary"
                style={{
                  padding: "10px 16px",
                  fontSize: "14px",
                  fontWeight: 500,
                  borderRadius: "4px",
                }}
              >
                {t("guestOrder.backToHome")}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default GuestOrderDetailPage;
