import { OrderSupportRequestType } from "@/constants/enums/OrderSupportRequestType";
import { getAllOrderSupportRequestTypes } from "@/helpers/enum/orderSupportRequestType";
import { useGetUserOrders } from "@/hooks/services/order/useGetUserOrders";
import { useOrderSupportTicket } from "@/hooks/services/support/useOrderSupportTicket";
import { useState } from "react";
import { Order, OrderItem } from "@/constants/models/Order";
import { toast } from "react-hot-toast";

function OrderSupportTicket() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedOrderItem, setSelectedOrderItem] = useState<OrderItem | null>(
    null
  );

  const [formData, setFormData] = useState({
    requestType: OrderSupportRequestType.Other,
    title: "",
    description: "",
  });

  // Kullanıcının siparişlerini getir
  const { orders, isLoading: ordersLoading } = useGetUserOrders(1, 50); // page=1, pageSize=50

  // Order Support Ticket hook
  const { handleSubmitTicket, isPending: isSubmitting } =
    useOrderSupportTicket();

  const handleOrderSelect = (order: Order) => {
    setSelectedOrder(order);
    setSelectedOrderItem(null); // OrderItem seçimini resetle
  };

  const handleOrderItemSelect = (orderItem: OrderItem) => {
    setSelectedOrderItem(orderItem);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedOrderItem) {
      toast.error("Lütfen bir sipariş ürünü seçin");
      return;
    }

    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error("Lütfen tüm alanları doldurun");
      return;
    }

    try {
      await handleSubmitTicket({
        requestType: formData.requestType,
        title: formData.title,
        description: formData.description,
        orderItemId: selectedOrderItem.id,
      });

      // Başarılı olursa formu resetle
      setFormData({
        requestType: OrderSupportRequestType.Other,
        title: "",
        description: "",
      });
      setSelectedOrder(null);
      setSelectedOrderItem(null);
    } catch (error) {
      // Error handling hook içinde yapılıyor
    }
  };

  if (ordersLoading) {
    return (
      <div className="text-center py-4">
        <div className="spinner-border" role="status">
          <span className="sr-only">Yükleniyor...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-2">
      {/* Sipariş Seçimi */}
      <div className="form-group mb-4">
        <label className="form-label">Sipariş Seçimi</label>
        {orders.length === 0 ? (
          <div className="alert alert-info">
            Henüz hiç siparişiniz bulunmuyor.
          </div>
        ) : (
          <div className="order-list">
            {orders.map((order) => (
              <div
                key={order.id}
                className={`order-card ${
                  selectedOrder?.id === order.id ? "selected" : ""
                }`}
                onClick={() => handleOrderSelect(order)}
              >
                <div className="order-header">
                  <strong>Sipariş No: {order.orderNumber}</strong>
                  <span className="order-date">
                    {new Date(order.createdOnValue).toLocaleDateString("tr-TR")}
                  </span>
                </div>
                <div className="order-recipient">
                  {order.recipientFirstName} {order.recipientLastName}
                </div>
                <div className="order-items-count">
                  {order.orderItems?.length || 0} ürün
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sipariş Ürünü Seçimi */}
      {selectedOrder && (
        <div className="form-group mb-4">
          <label className="form-label">
            Hangi ürün ile ilgili destek talep ediyorsunuz?
          </label>
          <div className="order-items-list">
            {selectedOrder.orderItems?.map((orderItem) => (
              <div
                key={orderItem.id}
                className={`order-item-card ${
                  selectedOrderItem?.id === orderItem.id ? "selected" : ""
                }`}
                onClick={() => handleOrderItemSelect(orderItem)}
              >
                <div className="order-item-content">
                  {orderItem.product?.baseImageUrl ? (
                    <img
                      src={orderItem.product.baseImageUrl}
                      alt={orderItem.product?.title || "Ürün"}
                      className="order-item-image"
                    />
                  ) : (
                    <div className="order-item-placeholder"></div>
                  )}
                  <div className="order-item-details">
                    <div className="order-item-title">
                      {orderItem.product?.title || "Ürün Adı Yok"}
                    </div>
                    <div className="order-item-info">
                      Adet: {orderItem.quantity} • Fiyat:{" "}
                      {orderItem.discountedPrice || orderItem.price}₺
                    </div>
                    <div className="order-item-number">
                      Ürün No: {orderItem.orderItemNumber}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Destek Talebi Formu */}
      {selectedOrderItem && (
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label htmlFor="requestType" className="form-label">
              Talep Türü
            </label>
            <select
              className="form-control"
              id="requestType"
              value={formData.requestType}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  requestType: Number(e.target.value),
                })
              }
              required
            >
              {getAllOrderSupportRequestTypes().map((type) => (
                <option key={type.value} value={type.value}>
                  {type.title}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group mb-3">
            <label htmlFor="title" className="form-label">
              Konu Başlığı
            </label>
            <input
              type="text"
              className="form-control"
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
              placeholder="Kısa bir başlık yazın..."
            />
          </div>

          <div className="form-group mb-4">
            <label htmlFor="description" className="form-label">
              Açıklama
            </label>
            <textarea
              className="form-control"
              id="description"
              rows={5}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
              placeholder="Lütfen sorununuzu detaylı bir şekilde açıklayın..."
            ></textarea>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            <span>
              {isSubmitting ? "Gönderiliyor..." : "Destek Talebi Oluştur"}
            </span>
            <i className="icon-long-arrow-right"></i>
          </button>
        </form>
      )}

      <style jsx>{`
        .form-label {
          font-weight: 500;
          color: #333;
          margin-bottom: 0.5rem;
        }

        .form-control {
          border: 1px solid #ebebeb;
          border-radius: 0.3rem;
          padding: 0.7rem 1rem;
          transition: all 0.3s;
        }

        .form-control:focus {
          border-color: #040404;
          box-shadow: none;
        }

        textarea.form-control {
          resize: vertical;
          min-height: 120px;
        }

        .btn-primary {
          min-width: 150px;
        }

        .btn-primary i {
          margin-left: 0.5rem;
        }

        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .order-list {
          max-height: 300px;
          overflow-y: auto;
          border: 1px solid #ebebeb;
          border-radius: 0.3rem;
        }

        .order-card {
          padding: 1rem;
          border-bottom: 1px solid #f0f0f0;
          cursor: pointer;
          transition: all 0.3s;
        }

        .order-card:hover {
          background-color: #f8f9fa;
        }

        .order-card.selected {
          background-color: #e3f2fd;
          border-left: 4px solid #2196f3;
        }

        .order-card:last-child {
          border-bottom: none;
        }

        .order-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }

        .order-date {
          color: #666;
          font-size: 0.9rem;
        }

        .order-recipient {
          color: #333;
          margin-bottom: 0.25rem;
        }

        .order-items-count {
          color: #666;
          font-size: 0.9rem;
        }

        .order-items-list {
          border: 1px solid #ebebeb;
          border-radius: 0.3rem;
          max-height: 400px;
          overflow-y: auto;
        }

        .order-item-card {
          padding: 1rem;
          border-bottom: 1px solid #f0f0f0;
          cursor: pointer;
          transition: all 0.3s;
        }

        .order-item-card:hover {
          background-color: #f8f9fa;
        }

        .order-item-card.selected {
          background-color: #e8f5e8;
          border-left: 4px solid #4caf50;
        }

        .order-item-placeholder {
          width: 60px;
          height: 60px;
          background-color: #f0f0f0;
          border: 1px solid #ebebeb;
          border-radius: 0.3rem;
        }

        .order-item-card:last-child {
          border-bottom: none;
        }

        .order-item-content {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .order-item-image {
          width: 60px;
          height: 60px;
          object-fit: cover;
          border-radius: 0.3rem;
          border: 1px solid #ebebeb;
        }

        .order-item-details {
          flex: 1;
        }

        .order-item-title {
          font-weight: 500;
          color: #333;
          margin-bottom: 0.25rem;
        }

        .order-item-info {
          color: #666;
          font-size: 0.9rem;
          margin-bottom: 0.25rem;
        }

        .order-item-number {
          color: #999;
          font-size: 0.8rem;
        }

        .alert {
          padding: 1rem;
          border-radius: 0.3rem;
          border: 1px solid #bee5eb;
          background-color: #d1ecf1;
          color: #0c5460;
        }

        .spinner-border {
          width: 3rem;
          height: 3rem;
          border: 0.25em solid #f3f3f3;
          border-right-color: transparent;
          border-radius: 50%;
          animation: spinner-border 0.75s linear infinite;
        }

        @keyframes spinner-border {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 767px) {
          .order-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .order-item-content {
            flex-direction: column;
            align-items: flex-start;
            text-align: left;
          }

          .order-item-image {
            width: 80px;
            height: 80px;
          }
        }
      `}</style>
    </div>
  );
}

export default OrderSupportTicket;
