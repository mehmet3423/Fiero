import { useAuth } from "@/hooks/context/useAuth";
import { useGetUserSupportTickets } from "@/hooks/services/support/useGetUserSupportTickets";
import { useState } from "react";
import { withProfileLayout } from "../_layout";
import { SupportTicket } from "@/constants/models/SupportTicket";
import { getAllGeneralRequestTypes } from "@/helpers/enum/generalRequestType";
import CirclePagination from "@/components/shared/CirclePagination";
import Link from "next/link";

function SupportTicketsPage() {
  const { userProfile } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 3;

  const { tickets, totalCount, totalPages, isLoading, error, refetch } =
    useGetUserSupportTickets({
      customerId: userProfile?.applicationUser?.id,
      page: currentPage - 1,
      pageSize,
    });

  const getRequestTypeLabel = (requestType: number): string => {
    const types = getAllGeneralRequestTypes();
    return types.find((type) => type.value === requestType)?.title || "Bilinmeyen";
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("tr-TR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  if (isLoading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border" role="status" style={{ color: "#040404" }}>
          <span className="sr-only">Yükleniyor...</span>
        </div>
        <p className="mt-3 text-muted">Destek talepleriniz yükleniyor...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger">
        <div className="d-flex align-items-center">
          <i className="bx bx-error-circle me-2 fs-4"></i>
          <div>
            <h5 className="mb-1">Hata Oluştu</h5>
            <p className="mb-2">Destek talepleriniz yüklenirken bir hata oluştu.</p>
            <button
              onClick={() => refetch()}
              className="btn btn-outline-danger btn-sm"
            >
              <i className="bx bx-refresh me-1"></i>
              Tekrar Dene
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="row">
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
              Destek Taleplerim
            </h3>
            <Link
              href="/support-ticket"
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
              Yeni Talep
            </Link>
          </div>

          {tickets.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "40px",
                border: "1px solid #eee",
                borderRadius: "8px",
                backgroundColor: "#f8f9fa",
              }}
            >
              <p
                style={{
                  fontSize: "16px",
                  color: "#666",
                  marginBottom: "16px",
                }}
              >
                Henüz destek talebiniz bulunmuyor.
              </p>
              <Link
                href="/support-ticket"
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
                İlk Destek Talebinizi Oluşturun
              </Link>
            </div>
          ) : (
            <div className="row">
              {tickets.map((ticket: SupportTicket) => (
                <div key={ticket.id} className="col-12 mb-3">
                  <div
                    style={{
                      border: "1px solid #eee",
                      borderRadius: "8px",
                      padding: "16px",
                      backgroundColor: "#fff",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    }}
                  >
                    <h5
                      style={{
                        fontSize: "16px",
                        fontWeight: "600",
                        color: "#333",
                        marginBottom: "8px",
                      }}
                    >
                      {ticket.title}
                    </h5>
                    <p
                      style={{
                        fontSize: "14px",
                        color: "#666",
                        marginBottom: "8px",
                      }}
                    >
                      {(ticket.description?.length ?? 0) > 150
                        ? (ticket.description?.slice(0, 150) ?? "") + "..."
                        : ticket.description ?? ""}
                    </p>
                    <div
                      style={{
                        display: "flex",
                        gap: "16px",
                        fontSize: "14px",
                        color: "#555",
                      }}
                    >
                      <span>Talep ID: #{ticket.id}</span>
                      <span>Talep Türü: {getRequestTypeLabel(ticket.requestType)}</span>
                      <span>Oluşturma Tarihi: {formatDate(ticket.createdOnValue)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "24px",
              }}
            >
              <span
                style={{
                  fontSize: "14px",
                  color: "#666",
                }}
              >
                {(currentPage - 1) * pageSize + 1}-
                {Math.min(currentPage * pageSize, totalCount)} / {totalCount} kayıt
              </span>
              <CirclePagination
                totalCount={totalCount}
                currentPage={currentPage}
                pageSize={pageSize}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default withProfileLayout(SupportTicketsPage);
