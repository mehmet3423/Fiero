import { useState } from "react";
import { useGetCargoByIntegrationCodes } from "@/hooks/services/cargo/useGetCargoByIntegrationCodes";
import Link from "next/link";
import CirclePagination from "@/components/shared/CirclePagination";

export default function CargoManagementPage() {
  const [searchCodes, setSearchCodes] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [shouldSearch, setShouldSearch] = useState(false);
  const pageSize = 10;

  // Search için integration codes
  const integrationCodes = searchCodes
    .split(",")
    .map((code) => code.trim())
    .filter(Boolean);

  const {
    cargoInfo,
    isLoading: isSearchLoading,
    error: searchError,
    refetch,
  } = useGetCargoByIntegrationCodes(
    integrationCodes,
    shouldSearch // Sadece shouldSearch true olduğunda sorgula
  );

  const handleSearch = () => {
    if (integrationCodes.length > 0) {
      setShouldSearch(true);
    }
  };

  return (
    <div className="container-fluid">
      {/* Header */}
      <div className="row">
        <div className="col-md-12">
          <div className="card mb-4">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                <i className="bx bx-package me-2 m-3"></i>
                Kargo Yönetimi
              </h5>
              <Link href="/admin/cargo/create" className="btn btn-primary m-3">
                <i className="bx bx-plus me-1"></i>
                Yeni Kargo Oluştur
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="row mb-4">
        <div className="col-md-12">
          <div className="card">
            <div className="card-header">
              <h6 className="m-3">Kargo Sorgula</h6>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-8">
                  <label className="form-label">
                    Entegrasyon Kodları (virgülle ayırın)
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Örn: INT001, INT002, INT003"
                    value={searchCodes}
                    onChange={(e) => {
                      setSearchCodes(e.target.value);
                      // Input değiştiğinde arama durumunu sıfırla
                      setShouldSearch(false);
                    }}
                  />
                </div>
                <div className="col-md-4 d-flex align-items-end">
                  <button
                    className="btn btn-primary"
                    onClick={handleSearch}
                    disabled={isSearchLoading || !searchCodes.trim()}
                  >
                    {isSearchLoading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Sorgulanıyor...
                      </>
                    ) : (
                      <>
                        <i className="bx bx-search me-1"></i>
                        Sorgula
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      {cargoInfo.length > 0 && (
        <div className="row">
          <div className="col-md-12">
            <div className="card">
              <div className="card-header">
                <h6 className="mb-0">
                  Kargo Bilgileri ({cargoInfo.length} sonuç)
                </h6>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Entegrasyon Kodu</th>
                        <th>Kargo No</th>
                        <th>Takip No</th>
                        <th>Gönderen</th>
                        <th>Alıcı</th>
                        <th>Durum</th>
                        <th>Tarih</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cargoInfo.map((cargo, index) => (
                        <tr key={index}>
                          <td>
                            <span className="badge bg-primary">
                              {cargo.customerPrivateCode}
                            </span>
                          </td>
                          <td>{cargo.cargoLinkNumber || "-"}</td>
                          <td>{cargo.cargoTrackingNumber || "-"}</td>
                          <td>{cargo.sender || "-"}</td>
                          <td>{cargo.receiver || "-"}</td>
                          <td>
                            <span
                              className={`badge ${
                                cargo.statusCode === "6"
                                  ? "bg-success"
                                  : cargo.statusCode === "7"
                                  ? "bg-danger"
                                  : cargo.statusCode === "8"
                                  ? "bg-secondary"
                                  : "bg-warning"
                              }`}
                            >
                              {cargo.status || cargo.statusEnglish || "-"}
                            </span>
                          </td>
                          <td>{cargo.departureDate || "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* No Results */}
      {integrationCodes.length > 0 &&
        cargoInfo.length === 0 &&
        !isSearchLoading && (
          <div className="row">
            <div className="col-md-12">
              <div className="card">
                <div className="card-body text-center">
                  <i className="bx bx-search-alt-2 display-1 text-muted"></i>
                  <h5 className="mt-3">Kargo Bulunamadı</h5>
                  <p className="text-muted">
                    Girdiğiniz entegrasyon kodları için kargo bilgisi
                    bulunamadı.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}
