import { OrderItem } from "@/constants/models/Order";
import { useGetOrderById } from "@/hooks/services/order/useGetOrderById";
import useGetPaymentDetail from "@/hooks/services/payment/useGetPaymentDetail";
import { withProfileLayout } from "@/pages/profile/_layout";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext"; // Import useLanguage

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

  const getStatusText = (status: number) => {
    switch (status) {
      case 0:
        return t("ordersId.status.pending");
      case 1:
        return t("ordersId.status.processing");
      case 2:
        return t("ordersId.status.shipped");
      case 3:
        return t("ordersId.status.delivered");
      case 4:
        return t("ordersId.status.cancelled");
      default:
        return t("ordersId.status.unknown");
    }
  };

  const getStatusClass = (status: number) => {
    switch (status) {
      case 0:
        return "bg-warning";
      case 1:
        return "bg-info";
      case 2:
        return "bg-primary";
      case 3:
        return "bg-success";
      case 4:
        return "bg-danger";
      default:
        return "bg-secondary";
    }
  };

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
    return <div>{t("ordersId.loading")}</div>;
  }

  if (error) {
    return <div>{t("ordersId.error").replace("{message}", error.message)}</div>;
  }

  const totalAmount = order?.orderItems?.reduce(
    (sum: number, item: OrderItem) => {
      const price = typeof item.price === "number" ? item.price : 0;
      const quantity = typeof item.quantity === "number" ? item.quantity : 0;
      return sum + price * quantity;
    },
    0
  );

  return (
    <div className="row">
      {/* Order Header */}
      <div className="col-lg-12">
        <div className="order-header">
          <div className="order-header-content">
            <h3>{t("ordersId.orderNumber").replace("{number}", order?.orderNumber || "")}</h3>
            <div>
              <span className={`status-badge ${getStatusClass(order?.orderStatus || 0)}`}>
                {getStatusText(order?.orderStatus || 0)}
              </span>
              <p>{totalAmount ? formatCurrency(totalAmount) : formatCurrency(0)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Information */}
      {order?.paymentId && (
        <div className="col-lg-12">
          <div className="payment-info">
            <h5>{t("ordersId.paymentInfo")}</h5>
            {isPaymentLoading ? (
              <p>{t("ordersId.paymentLoading")}</p>
            ) : paymentDetail ? (
              <div>
                <p>{t("ordersId.paymentId")}: {order.paymentId}</p>
                <p>{t("ordersId.paymentStatus")}: {t("ordersId.paymentSuccess")}</p>
              </div>
            ) : (
              <p>{t("ordersId.paymentNotFound")}</p>
            )}
          </div>
        </div>
      )}

      {/* Delivery Information */}
      <div className="col-lg-12">
        <div className="delivery-info">
          <h5>{t("ordersId.deliveryInfo")}</h5>
          <div>
            <p>{t("ordersId.recipient")}: {order?.recipientFirstName} {order?.recipientLastName}</p>
            <p>{t("ordersId.phone")}: {order?.recipientPhoneNumber}</p>
          </div>
        </div>
      </div>

      {/* Ordered Products */}
      <div className="col-lg-12">
        <div className="ordered-products">
          <h5>{t("ordersId.orderedProducts")}</h5>
          {order?.orderItems?.map((item) => (
            <div key={item.id} className="product-item">
              {item.product?.baseImageUrl && (
                <Image
                  src={item.product.baseImageUrl}
                  alt={item.product.title || ""}
                  width={80}
                  height={80}
                />
              )}
              <div>
                <h6>{item.product?.title}</h6>
                <p>{t("ordersId.quantity")}: {item.quantity}</p>
              </div>
              <p>{formatCurrency(item.price * item.quantity)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Back Button */}
      <div className="col-lg-12">
        <div className="back-button">
          <Link href="/profile/orders">{t("ordersId.backToOrders")}</Link>
        </div>
      </div>
    </div>
  );
}

export default withProfileLayout(OrderDetailPage);