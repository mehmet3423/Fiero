import { useState } from "react";
import GeneralSupportTicketsTab from "@/components/admin/support-tickets/GeneralSupportTicketsTab";
import OrderSupportTicketsTab from "@/components/admin/support-tickets/OrderSupportTicketsTab";

export default function AdminSupportTicketsPage() {
  // Basit state yönetimi - URL ile uğraşmadan
  const [activeTab, setActiveTab] = useState<string>("general");

  // Tab değiştirme fonksiyonu
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="content-wrapper">
      <div className="container-l flex-grow-1 container-p-y">
        {/* Kompakt Başlık ve Tab Navigation */}
        <div className="row mb-3">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">
                <i className="bx bx-support me-2"></i>
                Destek Talepleri
              </h5>
            </div>

            {/* Kompakt Tab Navigation */}
            <div className="btn-group w-100" role="group">
              <button
                type="button"
                className={`btn focus:shadow-none focus:outline-none ${
                  activeTab === "general"
                    ? "btn-secondary"
                    : "btn-outline-secondary"
                }`}
                onClick={() => handleTabChange("general")}
              >
                <i className="bx bx-support me-1"></i>
                Genel
              </button>
              <button
                type="button"
                className={`btn focus:shadow-none focus:outline-none ${
                  activeTab === "order"
                    ? "btn-secondary"
                    : "btn-outline-secondary"
                }`}
                onClick={() => handleTabChange("order")}
              >
                <i className="bx bx-package me-1"></i>
                Sipariş
              </button>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="row">
          <div className="col-12">
            {activeTab === "general" && <GeneralSupportTicketsTab />}
            {activeTab === "order" && <OrderSupportTicketsTab />}
          </div>
        </div>
      </div>
    </div>
  );
}
