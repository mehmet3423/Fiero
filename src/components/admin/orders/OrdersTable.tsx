import Link from "next/link";
import { formatDate } from "@/utils/dateFormatter";
import { formatCurrency } from "@/utils/currencyFormatter";
import StatusBadge from "@/components/shared/StatusBadge";

interface Order {
  id: string;
  orderNumber: string;
  totalPrice?: number;
  cargoStatus: number;
  createdOnValue: string;
  customer?: {
    applicationUser?: {
      firstName?: string;
      lastName?: string;
      email?: string;
    };
  };
  orderItems?: any[];
  shippingAddress?: {
    firstName?: string;
    lastName?: string;
  };
}

interface OrdersTableProps {
  orders: Order[];
  calculateTotalAmount: (order: Order) => number;
  currentPage: number;
  pageSize: number;
}

export default function OrdersTable({
  orders,
  calculateTotalAmount,
  currentPage,
  pageSize,
}: OrdersTableProps) {
  if (!orders || orders.length === 0) {
    return (
      <div className="card">
        <div className="card-body text-center py-5">
          <i
            className="bx bx-shopping-bag"
            style={{ fontSize: "3rem", color: "#ccc" }}
          ></i>
          <p className="text-muted mt-2">Henüz sipariş bulunmamaktadır</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-body">
        <div className="table-responsive">
          <table className="table table-hover table-striped table-sm align-middle text-nowrap small">
            <thead>
              <tr>
                <th>Sıra</th>
                <th>Sipariş No</th>
                <th>Müşteri</th>
                <th>Toplam Tutar</th>
                <th>Durum</th>
                <th>Tarih</th>
                <th>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={order.id}>
                  <td>{(currentPage - 1) * pageSize + index + 1}</td>
                  <td>
                    <strong>#{order.orderNumber}</strong>
                  </td>
                  <td>
                    {order.shippingAddress ? (
                      <div>
                        <div>
                          {order.shippingAddress.firstName ?? "-"}{" "}
                          {order.shippingAddress.lastName ?? ""}
                        </div>
                      </div>
                    ) : (
                      <span className="text-muted">-</span>
                    )}
                  </td>
                  <td>
                    <strong>
                      {formatCurrency(calculateTotalAmount(order))}
                    </strong>
                  </td>
                  <td>
                    <StatusBadge status={order.cargoStatus} type="order" />
                  </td>
                  <td>{formatDate(order.createdOnValue)}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="btn btn-sm btn-outline-primary"
                        title="Siparişi Görüntüle"
                      >
                        <i className="bx bx-show-alt"></i>
                      </Link>
                      <Link
                        href={`/admin/cargo/create?orderId=${order.id}`}
                        className="btn btn-sm btn-outline-success"
                        title="Kargo Oluştur"
                      >
                        <i className="bx bx-package"></i>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
