import { useGetCargoStatuses } from "@/hooks/services/enum-options/useGetCargoStatuses";

interface OrderFilters {
  search?: string;
  startDate?: string;
  endDate?: string;
  cargoStatus?: number;
  minPrice?: number;
  maxPrice?: number;
}

interface OrdersFiltersProps {
  filters: OrderFilters;
  showFilters: boolean;
  onFilterChange: (field: keyof OrderFilters, value: any) => void;
  onSearch: () => void;
  onClearFilters: () => void;
  onToggleFilters: () => void;
}

export default function OrdersFilters({
  filters,
  showFilters,
  onFilterChange,
  onSearch,
  onClearFilters,
  onToggleFilters,
}: OrdersFiltersProps) {
  const { data: cargoStatuses } = useGetCargoStatuses(true);

  return (
    <>
      <div className="mb-3">
        <button
          className="btn btn-outline-primary btn-sm"
          onClick={onToggleFilters}
          type="button"
        >
          <i className="bx bx-filter me-1"></i>
          {showFilters ? "Filtreleri Gizle" : "Filtreleri Göster"}
        </button>
      </div>

      {showFilters && (
        <div className="card mb-4">
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-3">
                <label className="form-label small">
                  Sipariş No / Müşteri
                </label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="Ara..."
                  value={filters.search || ""}
                  onChange={(e) => onFilterChange("search", e.target.value)}
                />
              </div>

              <div className="col-md-2">
                <label className="form-label small">Başlangıç Tarihi</label>
                <input
                  type="date"
                  className="form-control form-control-sm"
                  value={filters.startDate || ""}
                  onChange={(e) => onFilterChange("startDate", e.target.value)}
                />
              </div>

              <div className="col-md-2">
                <label className="form-label small">Bitiş Tarihi</label>
                <input
                  type="date"
                  className="form-control form-control-sm"
                  value={filters.endDate || ""}
                  onChange={(e) => onFilterChange("endDate", e.target.value)}
                />
              </div>

              <div className="col-md-2">
                <label className="form-label small">Kargo Durumu</label>
                <select
                  className="form-select form-select-sm"
                  value={filters.cargoStatus ?? ""}
                  onChange={(e) =>
                    onFilterChange(
                      "cargoStatus",
                      e.target.value === "" ? undefined : Number(e.target.value)
                    )
                  }
                >
                  <option value="">Tümü</option>
                  {cargoStatuses?.map((status: any) => (
                    <option key={status.value} value={status.value}>
                      {status.displayName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-3">
                <label className="form-label small">Fiyat Aralığı</label>
                <div className="d-flex gap-2">
                  <input
                    type="number"
                    className="form-control form-control-sm"
                    placeholder="Min"
                    value={filters.minPrice || ""}
                    onChange={(e) =>
                      onFilterChange(
                        "minPrice",
                        e.target.value ? Number(e.target.value) : undefined
                      )
                    }
                  />
                  <input
                    type="number"
                    className="form-control form-control-sm"
                    placeholder="Max"
                    value={filters.maxPrice || ""}
                    onChange={(e) =>
                      onFilterChange(
                        "maxPrice",
                        e.target.value ? Number(e.target.value) : undefined
                      )
                    }
                  />
                </div>
              </div>

              <div className="col-12">
                <button
                  className="btn btn-primary btn-sm me-2"
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
                >
                  <i className="bx bx-x me-1"></i>
                  Temizle
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
