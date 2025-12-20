import { useGetRefundRequestedOrderItems } from "@/hooks/services/order/useGetRefundRequestedOrderItems";
import RefundsTable from "@/components/admin/refunds/RefundsTable";
import RefundsFilters from "@/components/admin/refunds/RefundsFilters";
import { useState } from "react";
import CirclePagination from "@/components/shared/CirclePagination";

interface RefundFilters {
  search?: string;
  startDate?: string;
  endDate?: string;
  from?: number;
}

function RefundsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<RefundFilters>({});
  const [appliedFilters, setAppliedFilters] = useState<RefundFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  const pageSize = 10;

  const {
    refundRequests,
    isLoading,
    error,
    totalCount: apiTotalCount,
    totalPages: apiTotalPages,
  } = useGetRefundRequestedOrderItems(currentPage, pageSize, appliedFilters);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleFilterChange = (field: keyof RefundFilters, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSearch = () => {
    const formattedFilters = { ...filters };

    if (formattedFilters.startDate) {
      const startDate = new Date(formattedFilters.startDate);
      startDate.setHours(0, 0, 0, 0);
      formattedFilters.startDate = startDate.toISOString();
    }

    if (formattedFilters.endDate) {
      const endDate = new Date(formattedFilters.endDate);
      endDate.setHours(23, 59, 59, 999);
      formattedFilters.endDate = endDate.toISOString();
    }

    setAppliedFilters(formattedFilters);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({});
    setAppliedFilters({});
    setCurrentPage(1);
  };

  if (isLoading) {
    return (
      <div className="card">
        <h5
          className="card-header"
          style={{ fontSize: "1.2rem", fontWeight: "bold", padding: "20px" }}
        >
          İade Yönetimi
        </h5>
        <div className="d-flex justify-content-center align-items-center p-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Yükleniyor...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <h5
          className="card-header"
          style={{ fontSize: "1.2rem", fontWeight: "bold", padding: "20px" }}
        >
          İade Yönetimi
        </h5>
        <div className="alert alert-danger m-3">
          İade talepleri yüklenirken bir hata oluştu. Lütfen daha sonra tekrar
          deneyin.
        </div>
      </div>
    );
  }

  return (
    <div className="admin-compact-list">
      <div className="card bg-transparent border-0 mb-3">
        <div className="card-body py-3 d-flex flex-column flex-md-row justify-content-between align-items-md-center">
          <div>
            <h4 className="mb-1 fw-bold d-flex align-items-center gap-2">
              <i className="bx bx-undo"></i>
              İade Yönetimi
            </h4>
            <p className="mb-0 text-muted" style={{ fontSize: "0.875rem" }}>
              İade taleplerini yönetin, inceleyin ve filtreleyin.
            </p>
          </div>
          <div className="mt-3 mt-md-0">
            <button
              className="btn btn-outline-primary btn-sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <i
                className={`bx ${
                  showFilters ? "bx-chevron-up" : "bx-filter"
                } me-1`}
              ></i>
              {showFilters ? "Filtreleri Gizle" : "Filtrele"}
            </button>
          </div>
        </div>
      </div>

      {/* Filtreleme Paneli */}
      {showFilters && (
        <RefundsFilters
          filters={filters}
          showFilters={showFilters}
          onFilterChange={handleFilterChange}
          onSearch={handleSearch}
          onClearFilters={clearFilters}
        />
      )}

      <div className="card shadow-sm">
        {refundRequests.length === 0 ? (
          <div className="text-center p-5">
            <i className="bx bx-undo fs-1 text-muted mb-3"></i>
            <p className="text-muted">Henüz iade talebi bulunmamaktadır.</p>
          </div>
        ) : (
          <>
            <RefundsTable
              refundRequests={refundRequests}
              currentPage={currentPage}
              pageSize={pageSize}
            />
            {apiTotalPages > 1 && (
              <CirclePagination
                totalCount={apiTotalCount}
                currentPage={currentPage}
                pageSize={pageSize}
                onPageChange={handlePageChange}
                variant="compact"
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default RefundsPage;
