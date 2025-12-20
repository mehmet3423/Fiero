interface RefundFilters {
  search?: string;
  startDate?: string;
  endDate?: string;
}

interface RefundsFiltersProps {
  filters: RefundFilters;
  showFilters: boolean;
  onFilterChange: (field: keyof RefundFilters, value: any) => void;
  onSearch: () => void;
  onClearFilters: () => void;
}

export default function RefundsFilters({
  filters,
  showFilters,
  onFilterChange,
  onSearch,
  onClearFilters,
}: RefundsFiltersProps) {
  return (
    <>
      {showFilters && (
        <div className="card mb-4 shadow-sm">
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label small">
                  Sipariş No / Müşteri / E-posta
                </label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="Ara..."
                  value={filters.search || ""}
                  onChange={(e) => onFilterChange("search", e.target.value)}
                />
              </div>

              <div className="col-md-3">
                <label className="form-label small">Başlangıç Tarihi</label>
                <input
                  type="date"
                  className="form-control form-control-sm"
                  value={filters.startDate || ""}
                  onChange={(e) => onFilterChange("startDate", e.target.value)}
                />
              </div>

              <div className="col-md-3">
                <label className="form-label small">Bitiş Tarihi</label>
                <input
                  type="date"
                  className="form-control form-control-sm"
                  value={filters.endDate || ""}
                  onChange={(e) => onFilterChange("endDate", e.target.value)}
                />
              </div>

              <div className="col-md-2 d-flex align-items-end">
                <div className="d-flex gap-2 w-100">
                  <button
                    className="btn btn-primary btn-sm flex-fill"
                    onClick={onSearch}
                    type="button"
                  >
                    <i className="bx bx-search me-1"></i>
                    Filtrele
                  </button>
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={onClearFilters}
                    type="button"
                    title="Temizle"
                  >
                    <i className="bx bx-x"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

