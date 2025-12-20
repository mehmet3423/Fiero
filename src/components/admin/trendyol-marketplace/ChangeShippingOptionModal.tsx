import React, { useState, useEffect } from "react";
import { ShipmentPackage } from "@/constants/models/trendyol/GetShipmentPackagesRequest";
import { useGetTrendyolCargoProviders } from "@/hooks/services/admin-trendyol-marketplace/useGetTrendyolCargoProviders";
import { CargoProviderItem } from "@/constants/models/trendyol/CargoProvidersResponse";

interface ChangeShippingOptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  package: ShipmentPackage | null;
  onUpdate: (shippingOption: string, cargoProviderId?: number) => void;
  onShowConfirmation: (shippingOption: string, cargoProviderId?: number, alternativeData?: any) => void;
}

const ChangeShippingOptionModal: React.FC<ChangeShippingOptionModalProps> = ({
  isOpen,
  onClose,
  onOpen,
  package: pkg,
  onUpdate,
  onShowConfirmation,
}) => {
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [selectedCargoProvider, setSelectedCargoProvider] = useState<number | null>(null);
  const [selectedAlternativeOption, setSelectedAlternativeOption] = useState<string>("");
  const [trackingUrl, setTrackingUrl] = useState<string>("");
  const [contactInfo, setContactInfo] = useState<string>("");
  const [desi, setDesi] = useState<number>(1);
  const [koli, setKoli] = useState<number>(1);
  const [urlError, setUrlError] = useState<string>("");

  const { cargoProviders, isLoading } = useGetTrendyolCargoProviders();

  // Extract providers array from the response
  const providers = cargoProviders?.data?.providers || [];

  // Initialize tooltips when modal opens
  useEffect(() => {
    if (isOpen) {
      // Initialize Bootstrap tooltips
      const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
      tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new (window as any).bootstrap.Tooltip(tooltipTriggerEl);
      });
    }
  }, [isOpen]);

  const handleOptionChange = (option: string) => {
    // Tüm seçimleri sıfırla
    setSelectedCargoProvider(null);
    setSelectedAlternativeOption("");
    setTrackingUrl("");
    setContactInfo("");
    setDesi(1);
    setKoli(1);

    // Yeni seçeneği ayarla
    setSelectedOption(option);
  };

  const handleCargoProviderChange = (providerId: number) => {
    setSelectedCargoProvider(providerId);
  };

  const validateUrl = (url: string) => {
    if (!url.trim()) {
      setUrlError("");
      return true;
    }

    try {
      new URL(url);
      setUrlError("");
      return true;
    } catch {
      setUrlError("Lütfen doğru bir URL giriniz.");
      return false;
    }
  };

  const handleTrackingUrlChange = (url: string) => {
    setTrackingUrl(url);
    validateUrl(url);
  };

  const handleContactInfoChange = (value: string) => {
    // Sadece rakam kabul et
    const numericValue = value.replace(/\D/g, '');
    setContactInfo(numericValue);
  };

  const handleAlternativeOptionChange = (option: string) => {
    // Alt seçenek değiştiğinde ilgili alanları sıfırla
    setTrackingUrl("");
    setContactInfo("");
    setDesi(1);
    setKoli(1);
    setUrlError("");

    // Yeni alt seçeneği ayarla
    setSelectedAlternativeOption(option);
  };

  const handleUpdate = () => {
    if (selectedOption === "trendyol_contracted" && !selectedCargoProvider) {
      return; // Don't allow update without selecting a cargo provider
    }

    if (selectedOption === "alternative_delivery" && !selectedAlternativeOption) {
      return; // Don't allow update without selecting an alternative option
    }

    if (selectedAlternativeOption === "non_contracted_cargo" && !trackingUrl.trim()) {
      return; // Don't allow update without tracking URL
    }

    if (selectedAlternativeOption === "non_contracted_cargo" && trackingUrl.trim() && !validateUrl(trackingUrl)) {
      return; // Don't allow update with invalid URL
    }

    if ((selectedAlternativeOption === "own_vehicle" || selectedAlternativeOption === "authorized_service") && !contactInfo.trim()) {
      return; // Don't allow update without contact info
    }

    // Eğer alternatif teslimat seçildiyse onay modal'ını göster
    if (selectedOption === "alternative_delivery") {
      const alternativeData = {
        option: selectedAlternativeOption,
        trackingUrl: trackingUrl,
        contactInfo: contactInfo,
        desi: desi,
        koli: koli
      };
      onShowConfirmation(selectedOption, selectedCargoProvider || undefined, alternativeData);
    } else {
      // Diğer seçenekler için direkt güncelle
      onUpdate(selectedOption, selectedCargoProvider || undefined);
      onClose();
    }
  };


  const handleClose = () => {
    setSelectedOption("");
    setSelectedCargoProvider(null);
    setSelectedAlternativeOption("");
    setTrackingUrl("");
    setContactInfo("");
    setDesi(1);
    setKoli(1);
    setUrlError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content" style={{ borderRadius: "8px", maxWidth: "800px" }}>
          <div className="modal-header" style={{ borderBottom: "1px solid #e9ecef", padding: "1.5rem" }}>
            <h5 className="modal-title" style={{ fontSize: "1.1rem", fontWeight: "600", margin: 0, color: "#000" }}>
              Paketi hangi seçenek ile göndermek istiyorsunuz?
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={handleClose}
              aria-label="Close"
              style={{ fontSize: "1.2rem" }}
            ></button>
          </div>

          <div className="modal-body" style={{ padding: "1.5rem" }}>
            <div className="mb-4">
              <div className="form-check mb-3">
                <input
                  className="form-check-input"
                  type="radio"
                  name="shippingOption"
                  id="trendyolContracted"
                  value="trendyol_contracted"
                  checked={selectedOption === "trendyol_contracted"}
                  onChange={(e) => handleOptionChange(e.target.value)}
                  style={{
                    width: "18px",
                    height: "18px",
                    marginTop: "2px",
                    accentColor: "#ff6b35"
                  }}
                />
                <label
                  className="form-check-label"
                  htmlFor="trendyolContracted"
                  style={{ fontSize: "0.95rem", fontWeight: "500", marginLeft: "8px", color: "#000" }}
                >
                  Trendyol anlaşmalı farklı kargo firması ile göndermek istiyorum
                </label>
              </div>

              {selectedOption === "trendyol_contracted" && (
                <div className="ms-4 mb-3" style={{ marginLeft: "2rem !important" }}>
                  <a
                    href="#"
                    className="text-decoration-none"
                    onClick={(e) => e.preventDefault()}
                    style={{
                      color: "#ff6b35",
                      fontSize: "0.9rem",
                      fontWeight: "500"
                    }}
                  >
                    Anlaşmalı olduğumuz kargo firmalarına ulaşmak için tıklayınız
                  </a>
                  <p
                    className="small mt-2"
                    style={{
                      fontSize: "0.85rem",
                      lineHeight: "1.4",
                      marginTop: "0.5rem !important",
                      color: "#6c757d"
                    }}
                  >
                    Sipariş paketiniz seçeceğiniz kargo şirketi ile değiştirilecek ve kargo tutarı mevcut ödeme modeliniz üzerinden faturalandırılacaktır.
                  </p>

                  <div className="mt-3 d-flex align-items-center gap-2">
                    <label
                      htmlFor="cargoProviderSelect"
                      className="form-label mb-0"
                      style={{
                        fontSize: "0.9rem",
                        fontWeight: "500",
                        color: "#000",
                        whiteSpace: "nowrap"
                      }}
                    >
                      Kargo Firması Seçiniz:
                    </label>
                    <select
                      id="cargoProviderSelect"
                      className="form-select"
                      value={selectedCargoProvider || ""}
                      onChange={(e) => handleCargoProviderChange(Number(e.target.value))}
                      disabled={isLoading}
                      style={{
                        fontSize: "0.9rem",
                        padding: "0.5rem 0.75rem",
                        border: "1px solid #ced4da",
                        borderRadius: "4px",
                        color: "#000",
                        minWidth: "200px"
                      }}
                    >
                      {providers.map((provider: CargoProviderItem) => (
                        <option key={provider.id} value={provider.id}>
                          {provider.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>

            <div className="mb-4">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="shippingOption"
                  id="alternativeDelivery"
                  value="alternative_delivery"
                  checked={selectedOption === "alternative_delivery"}
                  onChange={(e) => handleOptionChange(e.target.value)}
                  style={{
                    width: "18px",
                    height: "18px",
                    marginTop: "2px",
                    accentColor: "#ff6b35"
                  }}
                />
                <label
                  className="form-check-label"
                  htmlFor="alternativeDelivery"
                  style={{ fontSize: "0.95rem", fontWeight: "500", marginLeft: "8px", color: "#000" }}
                >
                  Alternatif teslimat ile göndermek istiyorum
                </label>
              </div>

              {selectedOption === "alternative_delivery" && (
                <div className="ms-4 mb-3" style={{ marginLeft: "2rem !important" }}>
                  {/* Trendyol anlaşması olmayan farklı kargo şirketi */}
                  <div className="form-check mb-3">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="alternativeOption"
                      id="nonContractedCargo"
                      value="non_contracted_cargo"
                      checked={selectedAlternativeOption === "non_contracted_cargo"}
                      onChange={(e) => handleAlternativeOptionChange(e.target.value)}
                      style={{
                        width: "18px",
                        height: "18px",
                        marginTop: "2px",
                        accentColor: "#ff6b35"
                      }}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="nonContractedCargo"
                      style={{ fontSize: "0.9rem", fontWeight: "500", marginLeft: "8px", color: "#000" }}
                    >
                      Trendyol anlaşması olmayan farklı kargo şirketi ile göndermek istiyorum
                    </label>
                  </div>

                  {selectedAlternativeOption === "non_contracted_cargo" && (
                    <div className="ms-4 mb-3">
                      <label
                        htmlFor="trackingUrl"
                        className="form-label"
                        style={{
                          fontSize: "0.9rem",
                          fontWeight: "500",
                          marginBottom: "0.5rem",
                          color: "#000"
                        }}
                      >
                        Kargo Takip URL Adresi
                      </label>
                      <input
                        id="trackingUrl"
                        type="url"
                        className="form-control"
                        value={trackingUrl}
                        onChange={(e) => handleTrackingUrlChange(e.target.value)}
                        placeholder="https://"
                        style={{
                          fontSize: "0.9rem",
                          padding: "0.5rem 0.75rem",
                          border: urlError ? "1px solid #dc3545" : "1px solid #ced4da",
                          borderRadius: "4px",
                          color: "#000"
                        }}
                      />
                      {urlError && (
                        <div className="text-danger mt-1" style={{ fontSize: "0.8rem" }}>
                          {urlError}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Kendi Aracımla ile göndermek istiyorum */}
                  <div className="form-check mb-3">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="alternativeOption"
                      id="ownVehicle"
                      value="own_vehicle"
                      checked={selectedAlternativeOption === "own_vehicle"}
                      onChange={(e) => handleAlternativeOptionChange(e.target.value)}
                      style={{
                        width: "18px",
                        height: "18px",
                        marginTop: "2px",
                        accentColor: "#ff6b35"
                      }}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="ownVehicle"
                      style={{ fontSize: "0.9rem", fontWeight: "500", marginLeft: "8px", color: "#000" }}
                    >
                      Kendi Aracımla ile göndermek istiyorum
                    </label>
                  </div>

                  {selectedAlternativeOption === "own_vehicle" && (
                    <div className="ms-4 mb-3">
                      <div className="row">
                        <div className="col-4">
                          <label
                            htmlFor="contactInfo"
                            className="form-label"
                            style={{
                              fontSize: "0.9rem",
                              fontWeight: "500",
                              marginBottom: "0.5rem",
                              color: "#000"
                            }}
                          >
                            İletişim Bilgisi
                          </label>
                          <input
                            id="contactInfo"
                            type="tel"
                            className="form-control"
                            value={contactInfo}
                            onChange={(e) => handleContactInfoChange(e.target.value)}
                            placeholder="0(___)"
                            maxLength={11}
                            style={{
                              fontSize: "0.9rem",
                              padding: "0.5rem 0.75rem",
                              border: "1px solid #ced4da",
                              borderRadius: "4px",
                              color: "#000"
                            }}
                          />
                        </div>
                        <div className="col-4">
                          <label
                            htmlFor="desi"
                            className="form-label"
                            style={{
                              fontSize: "0.9rem",
                              fontWeight: "500",
                              marginBottom: "0.5rem",
                              color: "#000"
                            }}
                          >
                            Desi
                          </label>
                          <input
                            id="desi"
                            type="number"
                            className="form-control"
                            value={desi}
                            onChange={(e) => setDesi(Number(e.target.value))}
                            min="1"
                            style={{
                              fontSize: "0.9rem",
                              padding: "0.5rem 0.75rem",
                              border: "1px solid #ced4da",
                              borderRadius: "4px",
                              color: "#000"
                            }}
                          />
                        </div>
                        <div className="col-4">
                          <label
                            htmlFor="koli"
                            className="form-label"
                            style={{
                              fontSize: "0.9rem",
                              fontWeight: "500",
                              marginBottom: "0.5rem",
                              color: "#000"
                            }}
                          >
                            Koli
                          </label>
                          <input
                            id="koli"
                            type="number"
                            className="form-control"
                            value={koli}
                            onChange={(e) => setKoli(Number(e.target.value))}
                            min="1"
                            style={{
                              fontSize: "0.9rem",
                              padding: "0.5rem 0.75rem",
                              border: "1px solid #ced4da",
                              borderRadius: "4px",
                              color: "#000"
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Yetkili servisin müşteriye teslim etmesini istiyorum */}
                  <div className="form-check mb-3">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="alternativeOption"
                      id="authorizedService"
                      value="authorized_service"
                      checked={selectedAlternativeOption === "authorized_service"}
                      onChange={(e) => handleAlternativeOptionChange(e.target.value)}
                      style={{
                        width: "18px",
                        height: "18px",
                        marginTop: "2px",
                        accentColor: "#ff6b35"
                      }}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="authorizedService"
                      style={{ fontSize: "0.9rem", fontWeight: "500", marginLeft: "8px", color: "#000" }}
                    >
                      Yetkili servisin müşteriye teslim etmesini istiyorum
                      <i
                        className="bx bx-info-circle ms-1"
                        style={{ color: "#007bff", fontSize: "0.8rem", cursor: "pointer" }}
                        title="Siparişinizi yetkili servis müşteriye teslim edip kurulum yapacaksa lütfen bu kutucuğu işaretleyiniz."
                        data-bs-toggle="tooltip"
                        data-bs-placement="right"
                        data-bs-html="true"
                      ></i>
                    </label>
                  </div>

                  {selectedAlternativeOption === "authorized_service" && (
                    <div className="ms-4 mb-3">
                      <div className="row">
                        <div className="col-4">
                          <label
                            htmlFor="contactInfoService"
                            className="form-label"
                            style={{
                              fontSize: "0.9rem",
                              fontWeight: "500",
                              marginBottom: "0.5rem",
                              color: "#000"
                            }}
                          >
                            İletişim Bilgisi
                          </label>
                          <input
                            id="contactInfoService"
                            type="tel"
                            className="form-control"
                            value={contactInfo}
                            onChange={(e) => handleContactInfoChange(e.target.value)}
                            placeholder="0(___)"
                            maxLength={11}
                            style={{
                              fontSize: "0.9rem",
                              padding: "0.5rem 0.75rem",
                              border: "1px solid #ced4da",
                              borderRadius: "4px",
                              color: "#000"
                            }}
                          />
                        </div>
                        <div className="col-4">
                          <label
                            htmlFor="desiService"
                            className="form-label"
                            style={{
                              fontSize: "0.9rem",
                              fontWeight: "500",
                              marginBottom: "0.5rem",
                              color: "#000"
                            }}
                          >
                            Desi
                          </label>
                          <input
                            id="desiService"
                            type="number"
                            className="form-control"
                            value={desi}
                            onChange={(e) => setDesi(Number(e.target.value))}
                            min="1"
                            style={{
                              fontSize: "0.9rem",
                              padding: "0.5rem 0.75rem",
                              border: "1px solid #ced4da",
                              borderRadius: "4px",
                              color: "#000"
                            }}
                          />
                        </div>
                        <div className="col-4">
                          <label
                            htmlFor="koliService"
                            className="form-label"
                            style={{
                              fontSize: "0.9rem",
                              fontWeight: "500",
                              marginBottom: "0.5rem",
                              color: "#000"
                            }}
                          >
                            Koli
                          </label>
                          <input
                            id="koliService"
                            type="number"
                            className="form-control"
                            value={koli}
                            onChange={(e) => setKoli(Number(e.target.value))}
                            min="1"
                            style={{
                              fontSize: "0.9rem",
                              padding: "0.5rem 0.75rem",
                              border: "1px solid #ced4da",
                              borderRadius: "4px",
                              color: "#000"
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="modal-footer" style={{
            borderTop: "1px solid #e9ecef",
            padding: "1rem 1.5rem",
            justifyContent: "flex-end",
            gap: "0.75rem"
          }}>
            <button
              type="button"
              className="btn"
              onClick={handleClose}
              style={{
                backgroundColor: "white",
                border: "1px solid #6c757d",
                color: "#6c757d",
                padding: "0.5rem 1rem",
                borderRadius: "4px",
                fontSize: "0.9rem",
                fontWeight: "500"
              }}
            >
              Vazgeç
            </button>
            <button
              type="button"
              className="btn"
              onClick={handleUpdate}
              disabled={
                !selectedOption ||
                (selectedOption === "trendyol_contracted" && !selectedCargoProvider) ||
                (selectedOption === "alternative_delivery" && !selectedAlternativeOption) ||
                (selectedAlternativeOption === "non_contracted_cargo" && !trackingUrl.trim()) ||
                (selectedAlternativeOption === "non_contracted_cargo" && trackingUrl.trim() && !!urlError) ||
                ((selectedAlternativeOption === "own_vehicle" || selectedAlternativeOption === "authorized_service") && !contactInfo.trim())
              }
              style={{
                backgroundColor: (
                  selectedOption &&
                  (selectedOption !== "trendyol_contracted" || selectedCargoProvider) &&
                  (selectedOption !== "alternative_delivery" || selectedAlternativeOption) &&
                  (selectedAlternativeOption !== "non_contracted_cargo" || (trackingUrl.trim() && !urlError)) &&
                  ((selectedAlternativeOption !== "own_vehicle" && selectedAlternativeOption !== "authorized_service") || contactInfo.trim())
                ) ? "#ff6b35" : "#6c757d",
                border: "none",
                color: "white",
                padding: "0.5rem 1rem",
                borderRadius: "4px",
                fontSize: "0.9rem",
                fontWeight: "500",
                opacity: (
                  selectedOption &&
                  (selectedOption !== "trendyol_contracted" || selectedCargoProvider) &&
                  (selectedOption !== "alternative_delivery" || selectedAlternativeOption) &&
                  (selectedAlternativeOption !== "non_contracted_cargo" || (trackingUrl.trim() && !urlError)) &&
                  ((selectedAlternativeOption !== "own_vehicle" && selectedAlternativeOption !== "authorized_service") || contactInfo.trim())
                ) ? 1 : 0.6
              }}
            >
              Güncelle
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default ChangeShippingOptionModal;
