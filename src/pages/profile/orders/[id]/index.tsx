import { OrderItem } from "@/constants/models/Order";
import { useGetOrderById } from "@/hooks/services/order/useGetOrderById";
import useGetPaymentDetail from "@/hooks/services/payment/useGetPaymentDetail";
import { withProfileLayout } from "@/pages/profile/_layout";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

function OrderDetailPage() {
  const router = useRouter();
  const { id } = router.query;
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
          console.error("Payment detayları yüklenemedi:", error);
        }
      }
    };

    loadPaymentDetail();
  }, [order?.paymentId, getPaymentDetail]);
  // const order = {
  //     orderNumber: "ORD-2024-001",
  //     createdOnValue: new Date().toISOString(),
  //     orderStatus: 2, // Shipped
  //     recipientFirstName: "Ahmet",
  //     recipientLastName: "Yılmaz",
  //     recipientPhoneNumber: "0555 123 4567",
  //     orderItems: {
  //         $values: [
  //             {
  //                 id: "1",
  //                 quantity: 2,
  //                 price: 149.99,
  //                 product: {
  //                     title: "Klasik Beyaz T-Shirt",
  //                     baseImageUrl: "/assets/images/products/product-1.jpg",
  //                 },
  //             },
  //             {
  //                 id: "2",
  //                 quantity: 1,
  //                 price: 299.99,
  //                 product: {
  //                     title: "Spor Ayakkabı",
  //                     baseImageUrl: "/assets/images/products/product-2.jpg",
  //                 },
  //             },
  //         ],
  //     },
  // };

  const getStatusText = (status: number) => {
    switch (status) {
      case 0:
        return "Beklemede";
      case 1:
        return "İşleniyor";
      case 2:
        return "Kargoda";
      case 3:
        return "Teslim Edildi";
      case 4:
        return "İptal Edildi";
      default:
        return "Bilinmiyor";
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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const totalAmount = order?.orderItems?.reduce(
    (sum: number, item: OrderItem) => {
      // Check if price and quantity are valid numbers
      const price = typeof item.price === "number" ? item.price : 0;
      const quantity = typeof item.quantity === "number" ? item.quantity : 0;
      return sum + price * quantity;
    },
    0
  );

  const formatCurrency = (amount: number): string => {
    // Handle NaN or invalid values
    if (isNaN(amount) || amount === null || amount === undefined) {
      amount = 0;
    }
    return new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
    }).format(amount);
  };

  return (
    <div className="row">
      {/* Order Header */}
      <div className="col-lg-12">
        <div
          style={{
            border: "1px solid #eee",
            borderRadius: "8px",
            padding: "24px",
            backgroundColor: "#fff",
            marginBottom: "20px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "24px",
              borderBottom: "1px solid #eee",
              paddingBottom: "12px",
            }}
          >
            <h3
              style={{
                fontSize: "20px",
                fontWeight: "600",
                color: "#333",
              }}
            >
              Sipariş #{order?.orderNumber}
            </h3>
            <div style={{ textAlign: "right" }}>
              <span
                style={{
                  display: "inline-block",
                  padding: "8px 16px",
                  borderRadius: "4px",
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#fff",
                  backgroundColor: getStatusClass(order?.orderStatus || 0),
                }}
              >
                {getStatusText(order?.orderStatus || 0)}
              </span>
              <p
                style={{
                  fontSize: "18px",
                  fontWeight: "600",
                  color: "#333",
                  marginTop: "12px",
                }}
              >
                {totalAmount !== undefined && !isNaN(totalAmount)
                  ? formatCurrency(totalAmount)
                  : formatCurrency(0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Information */}
      {order?.paymentId && (
        <div className="col-lg-12">
          <div
            style={{
              border: "1px solid #eee",
              borderRadius: "8px",
              padding: "24px",
              backgroundColor: "#fff",
              marginBottom: "20px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            <h5
              style={{
                fontSize: "18px",
                fontWeight: "600",
                color: "#333",
                marginBottom: "20px",
                borderBottom: "1px solid #eee",
                paddingBottom: "12px",
              }}
            >
              Ödeme Bilgileri
            </h5>
            {isPaymentLoading ? (
              <p style={{ fontSize: "14px", color: "#666" }}>
                Ödeme detayları yükleniyor...
              </p>
            ) : paymentDetail ? (
              <div style={{ display: "flex", gap: "16px" }}>
                <div>
                  <p
                    style={{
                      fontSize: "14px",
                      color: "#666",
                      marginBottom: "4px",
                    }}
                  >
                    Payment ID
                  </p>
                  <p style={{ fontSize: "14px", fontWeight: "500" }}>
                    {order.paymentId}
                  </p>
                </div>
                <div>
                  <p
                    style={{
                      fontSize: "14px",
                      color: "#666",
                      marginBottom: "4px",
                    }}
                  >
                    Ödeme Durumu
                  </p>
                  <p
                    style={{
                      fontSize: "14px",
                      fontWeight: "500",
                      color: "#28a745",
                    }}
                  >
                    Başarılı
                  </p>
                </div>
              </div>
            ) : (
              <p style={{ fontSize: "14px", color: "#666" }}>
                Ödeme detayları bulunamadı.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Delivery Information */}
      <div className="col-lg-12">
        <div
          style={{
            border: "1px solid #eee",
            borderRadius: "8px",
            padding: "24px",
            backgroundColor: "#fff",
            marginBottom: "20px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          <h5
            style={{
              fontSize: "18px",
              fontWeight: "600",
              color: "#333",
              marginBottom: "20px",
              borderBottom: "1px solid #eee",
              paddingBottom: "12px",
            }}
          >
            Teslimat Bilgileri
          </h5>
          <div style={{ display: "flex", gap: "16px" }}>
            <div>
              <p
                style={{
                  fontSize: "14px",
                  color: "#666",
                  marginBottom: "4px",
                }}
              >
                Alıcı
              </p>
              <p style={{ fontSize: "14px", fontWeight: "500" }}>
                {order?.recipientFirstName} {order?.recipientLastName}
              </p>
            </div>
            <div>
              <p
                style={{
                  fontSize: "14px",
                  color: "#666",
                  marginBottom: "4px",
                }}
              >
                Telefon
              </p>
              <p style={{ fontSize: "14px", fontWeight: "500" }}>
                {order?.recipientPhoneNumber}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Ordered Products */}
      <div className="col-lg-12">
        <div
          style={{
            border: "1px solid #eee",
            borderRadius: "8px",
            padding: "24px",
            backgroundColor: "#fff",
            marginBottom: "20px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          <h5
            style={{
              fontSize: "18px",
              fontWeight: "600",
              color: "#333",
              marginBottom: "20px",
              borderBottom: "1px solid #eee",
              paddingBottom: "12px",
            }}
          >
            Sipariş Edilen Ürünler
          </h5>
          {order?.orderItems?.map((item) => (
            <div
              key={item.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                padding: "16px",
                border: "1px solid #eee",
                borderRadius: "8px",
                marginBottom: "12px",
                backgroundColor: "#f8f9fa",
              }}
            >
              {item.product?.baseImageUrl && (
                <div
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "8px",
                    overflow: "hidden",
                  }}
                >
                  <Image
                    src={item.product.baseImageUrl}
                    alt={item.product.title || ""}
                    width={80}
                    height={80}
                    style={{ objectFit: "cover" }}
                  />
                </div>
              )}
              <div style={{ flex: 1 }}>
                <h6
                  style={{
                    fontSize: "16px",
                    fontWeight: "600",
                    marginBottom: "4px",
                  }}
                >
                  {item.product?.title}
                </h6>
                <p style={{ fontSize: "14px", color: "#666" }}>
                  Adet: {item.quantity}
                </p>
              </div>
              <p style={{ fontSize: "16px", fontWeight: "600", color: "#333" }}>
                {formatCurrency(
                  (typeof item.price === "number" ? item.price : 0) *
                    (typeof item.quantity === "number" ? item.quantity : 0)
                )}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Back Button */}
      <div className="col-lg-12">
        <div style={{ textAlign: "right", marginTop: "20px" }}>
          <Link
            href="/profile/orders"
            style={{
              padding: "10px 16px",
              border: "1px solid #000",
              borderRadius: "4px",
              backgroundColor: "#000",
              color: "#fff",
              fontSize: "14px",
              fontWeight: "500",
              textDecoration: "none",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
          >
            Siparişlere Dön
          </Link>
        </div>
      </div>
    </div>
  );
}

export default withProfileLayout(OrderDetailPage);
