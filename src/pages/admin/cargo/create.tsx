import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { useCreateOrderCargo } from "@/hooks/services/cargo/useCreateCargo";
import { useGetOrderById } from "@/hooks/services/order/useGetOrderById";
import {
  CreateCargoRequest,
  CreateCargoResponse,
  CargoCompany,
} from "@/constants/models/cargo/CreateCargo";
import { Order } from "@/constants/models/Order";
import BackButton from "@/components/shared/BackButton";
import { useGetCargoPricing } from "@/hooks/services/cargo/useGetCargoPricingData";
import { GetCargoPricingDataRequest } from "@/constants/models/cargo/CargoPricing";
import { useCancelCargoByIntegrationCode } from "@/hooks/services/cargo/useCancelCargoByIntegrationCode";
import GeneralModal from "@/components/shared/GeneralModal";
import { toast } from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { QueryKeys } from "@/constants/enums/QueryKeys";

export default function CreateCargoPage() {
  const router = useRouter();
  const { orderId } = router.query;
  const queryClient = useQueryClient();

  const {
    createOrderCargo,
    isLoading: isCreateLoading,
    error: createError,
    isSuccess,
    cargoData,
  } = useCreateOrderCargo();

  // Order bilgilerini çek
  const {
    order,
    isLoading: isOrderLoading,
    error: orderError,
  } = useGetOrderById({ orderId: orderId as string });

  // Kargo fiyatlandırma hook'u
  const {
    fetchCargoPricing,
    isLoading: isPricingLoading,
    isSuccess: isPricingSuccess,
    error: pricingError,
    pricingData,
  } = useGetCargoPricing();
  // Fiyatlandırma başarılı oldu mu state'i
  const [isPricingFetched, setIsPricingFetched] = useState(false);
  // Form state
  const [formData, setFormData] = useState<CreateCargoRequest>({
    orderId: "",
    cargoCompany: CargoCompany.ARAS,
    cargoPackageItems: [
      {
        lengthCm: 0,
        widthCm: 0,
        heightCm: 0,
      },
    ],
  });

  // Kargo iptal hook'u
  const {
    cancelCargo,
    isPending: isCancelPending,
    isSuccess: isCancelSuccess,
  } = useCancelCargoByIntegrationCode();

  // Form değişikliklerini takip etmek için ref
  const prevFormDataRef = useRef<CreateCargoRequest>(formData);

  // Order bilgileri geldiğinde form'u otomatik doldur
  useEffect(() => {
    if (order && orderId) {
      setFormData((prev) => ({
        ...prev,
        orderId: orderId as string,
      }));
    }
  }, [order, orderId]);

  // Fiyatlandırma başarılı olduğunda state'i güncelle
  useEffect(() => {
    if (isPricingSuccess) {
      setIsPricingFetched(true);
    }
  }, [isPricingSuccess]);

  // Form değiştiğinde fiyatlandırma state'ini sıfırla
  useEffect(() => {
    const prev = prevFormDataRef.current;
    const current = formData;

    // Kargo şirketi veya paket öğeleri değiştiyse fiyatlandırmayı sıfırla
    if (
      prev.cargoCompany !== current.cargoCompany ||
      JSON.stringify(prev.cargoPackageItems) !==
        JSON.stringify(current.cargoPackageItems)
    ) {
      setIsPricingFetched(false);
    }

    prevFormDataRef.current = formData;
  }, [formData]);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => {
      const newData = {
        ...prev,
        [field]: field === "cargoCompany" ? Number(value) : value,
      };
      // Kargo şirketi değiştiğinde fiyatlandırmayı sıfırla
      if (field === "cargoCompany") {
        setIsPricingFetched(false);
      }
      return newData;
    });
  };

  const handleTrackingItemChange = (
    index: number,
    field: string,
    value: any
  ) => {
    setFormData((prev) => {
      const newData = {
        ...prev,
        cargoPackageItems: prev.cargoPackageItems.map((item, i) =>
          i === index ? { ...item, [field]: value } : item
        ),
      };
      // Paket öğeleri değiştiğinde fiyatlandırmayı sıfırla
      setIsPricingFetched(false);
      return newData;
    });
  };

  const addTrackingItem = () => {
    setFormData((prev) => ({
      ...prev,
      cargoPackageItems: [
        ...prev.cargoPackageItems,
        {
          lengthCm: 0,
          widthCm: 0,
          heightCm: 0,
        },
      ],
    }));
    // Yeni paket öğesi eklendiğinde fiyatlandırmayı sıfırla
    setIsPricingFetched(false);
  };

  const removeTrackingItem = (index: number) => {
    if (formData.cargoPackageItems.length > 1) {
      setFormData((prev) => ({
        ...prev,
        cargoPackageItems: prev.cargoPackageItems.filter((_, i) => i !== index),
      }));
      // Paket öğesi kaldırıldığında fiyatlandırmayı sıfırla
      setIsPricingFetched(false);
    }
  };

  // Kargo iptal işlemi
  const handleCancelCargo = async () => {
    if (!cargoIntegrationCode) {
      toast.error("İptal edilecek kargo bulunamadı");
      return;
    }

    try {
      await cancelCargo(cargoIntegrationCode);
      // @ts-ignore
      if (window.$) window.$("#cancelCargoModal").modal("hide");
      // İptal başarılı olduğunda sayfayı yenile
      setTimeout(() => {
        router.reload();
      }, 1500);
    } catch (error) {
      console.error("Kargo iptal hatası:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Eğer fiyatlandırma henüz yapılmadıysa, önce fiyatlandırma isteği at
    if (!isPricingFetched) {
      try {
        const pricingRequest: GetCargoPricingDataRequest = {
          orderId: formData.orderId,
          cargoCompany: formData.cargoCompany,
          cargoPackageItems: formData.cargoPackageItems.map((item) => ({
            lengthCm: item.lengthCm,
            widthCm: item.widthCm,
            heightCm: item.heightCm,
          })),
        };
        await fetchCargoPricing(pricingRequest);
      } catch (error) {
        console.error("Kargo fiyat bilgisi alma hatası:", error);
      }
    } else {
      // Fiyatlandırma yapıldıysa, kargo oluştur
      try {
        await createOrderCargo(formData);
      } catch (error) {
        console.error("Kargo oluşturma hatası:", error);
      }
    }
  };

  // Kargo etiketi bilgilerini al (hem order'dan hem de create response'undan)
  const orderCargoIntegrationCode = order?.cargoIntegrationCode;
  const orderCargoLabelUrls = order?.cargoLabelUrls;
  const createCargoIntegrationCode = (cargoData as any)?.data?.data
    ?.cargoIntegrationCode;
  const createCargoLabelUrls = (cargoData as any)?.data?.data?.cargoLabelUrls;

  // Önce create response'u kontrol et, yoksa order'dan al
  const cargoIntegrationCode =
    createCargoIntegrationCode || orderCargoIntegrationCode;
  const cargoLabelUrls = createCargoLabelUrls || orderCargoLabelUrls;
  const firstLabelUrl = cargoLabelUrls?.[0]?.labelUrl;

  // Başarılı oluşturma sonrası sipariş detay verisini tazele ve yönlendir
  useEffect(() => {
    if (!isSuccess || cargoIntegrationCode) {
      return;
    }

    if (!formData.orderId) {
      return;
    }

    queryClient.invalidateQueries({
      queryKey: [QueryKeys.ORDER_DETAIL, formData.orderId],
    });
    queryClient.invalidateQueries({ queryKey: [QueryKeys.ORDERS] });

    const timeoutId = setTimeout(() => {
      router.push({
        pathname: `/admin/orders/${formData.orderId}`,
        query: { refresh: "1" },
      });
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [isSuccess, cargoIntegrationCode, formData.orderId, queryClient, router]);

  return (
    <div className="container-fluid">
      {/* Header */}
      <div className="row">
        <div className="col-md-12">
          <div className="card mb-4">
            <div className="card-header d-flex justify-content-between align-items-center gap-2 m-2">
              <div className="flex-grow-1 min-w-0">
                {order && (
                  <small
                    className="text-muted"
                    style={{ fontSize: "0.85rem", wordBreak: "break-word" }}
                  >
                    <span className="d-inline">
                      Sipariş:{" "}
                      <span style={{ whiteSpace: "nowrap" }}>
                        {order.orderNumber}
                      </span>
                    </span>{" "}
                    <span className="d-none d-md-inline">|</span>{" "}
                    <span className="d-inline">
                      Müşteri: {order.shippingAddress?.firstName}{" "}
                      {order.shippingAddress?.lastName}
                    </span>
                  </small>
                )}
              </div>
              <BackButton href="/admin/orders" className="flex-shrink-0" />
            </div>
          </div>
        </div>
      </div>

      {/* Order Loading */}
      {isOrderLoading && (
        <div className="row mb-4">
          <div className="col-md-12">
            <div className="alert alert-info" role="alert">
              <i className="bx bx-loader-alt bx-spin me-2"></i>
              Sipariş bilgileri yükleniyor...
            </div>
          </div>
        </div>
      )}

      {/* Order Error */}
      {orderError && (
        <div className="row mb-4">
          <div className="col-md-12">
            <div className="alert alert-warning" role="alert">
              <i className="bx bx-error me-2"></i>
              Sipariş bilgileri yüklenemedi. Manuel olarak sipariş ID'sini
              girebilirsiniz.
            </div>
          </div>
        </div>
      )}

      {/* Success Message */}
      {isSuccess && !cargoIntegrationCode && (
        <div className="row mb-4">
          <div className="col-md-12">
            <div className="alert alert-success" role="alert">
              <i className="bx bx-check me-2"></i>
              Kargo başarıyla oluşturuldu! Sipariş detay sayfasına
              yönlendiriliyorsunuz...
            </div>
          </div>
        </div>
      )}

      {/* Pricing Success Message */}
      {isPricingSuccess &&
        isPricingFetched &&
        !isSuccess &&
        (() => {
          const responseData = pricingData as any;
          const cargoPrice = responseData?.data?.data?.realCargoPrice;
          const distance = responseData?.data?.data?.distanceKm;

          return (
            <div className="row mb-4">
              <div className="col-md-12">
                <div className="alert alert-success" role="alert">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <i className="bx bx-check me-2"></i>
                      Kargo fiyat bilgisi başarıyla alındı! Şimdi kargo
                      oluşturabilirsiniz.
                    </div>
                    {cargoPrice && (
                      <div className="ms-3">
                        <strong className="fs-5">
                          <i className="bx bx-money me-1"></i>
                          {cargoPrice.toFixed(2)} ₺
                        </strong>
                        {distance && (
                          <small className="text-muted ms-2">
                            ({distance.toFixed(2)} km)
                          </small>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

      {/* Pricing Error Message */}
      {pricingError && (
        <div className="row mb-4">
          <div className="col-md-12">
            <div className="alert alert-warning" role="alert">
              <i className="bx bx-error me-2"></i>
              Kargo fiyat bilgisi alınırken bir hata oluştu. Lütfen tekrar
              deneyin.
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {createError && (
        <div className="row mb-4">
          <div className="col-md-12">
            <div className="alert alert-danger" role="alert">
              <i className="bx bx-error me-2"></i>
              Kargo oluşturma sırasında bir hata oluştu. Lütfen tekrar deneyin.
            </div>
          </div>
        </div>
      )}

      {/* Cargo Label Display */}
      {cargoIntegrationCode && firstLabelUrl ? (
        <div className="row">
          <div className="col-md-12">
            <div className="card">
              <div className="card-body text-center">
                <h5 className="card-title mb-4">
                  <i className="bx bx-package me-2"></i>
                  Kargo Etiketi
                </h5>

                {/* Label Image */}
                <div className="mb-4">
                  <img
                    src={firstLabelUrl}
                    alt="Kargo Etiketi"
                    className="img-fluid border rounded shadow"
                    style={{ maxHeight: "600px", maxWidth: "100%" }}
                  />
                </div>

                {/* Kargo Bilgileri */}
                <div className="mb-4 p-3 bg-light rounded">
                  <div className="row justify-content-center">
                    <div className="col-md-6 mb-2 text-center">
                      <strong>Entegrasyon Kodu:</strong>
                      <div className="text-muted">{cargoIntegrationCode}</div>
                    </div>
                    {order?.cargoNumber && (
                      <div className="col-md-6 mb-2">
                        <strong>Takip Kodu:</strong>
                        <div className="text-muted">{order.cargoNumber}</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="d-flex justify-content-center gap-3 mb-4 flex-wrap">
                  <a
                    href={firstLabelUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-info"
                  >
                    <i className="bx bx-link-external me-1"></i>
                    Yeni Sekmede Aç
                  </a>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => {
                      // @ts-ignore
                      if (window.$) window.$("#cancelCargoModal").modal("show");
                    }}
                    disabled={isCancelPending}
                  >
                    <i className="bx bx-x me-1"></i>
                    Kargoyu İptal Et
                  </button>
                </div>

                {/* Back Button */}
                <div className="d-flex justify-content-center">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => router.push(`/admin/orders/${orderId}`)}
                  >
                    <i className="bx bx-arrow-back me-1"></i>
                    Sipariş Detayına Dön
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : !cargoIntegrationCode || isCancelSuccess ? (
        /* Create Form - etiket yoksa veya iptal edildiyse göster */
        <div className="row">
          <div className="col-md-12">
            <div className="card">
              <div className="card-body mt-3">
                <form onSubmit={handleSubmit}>
                  {/* Temel Bilgiler */}
                  <div className="row">
                    <div className="col-12 mb-4">
                      <h6 className="text-primary">
                        <i className="bx bx-info-circle me-2"></i>
                        Sipariş ve Kargo Bilgileri
                      </h6>
                      <hr />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Sipariş ID *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.orderId}
                        onChange={(e) =>
                          handleInputChange("orderId", e.target.value)
                        }
                        required
                        placeholder="Örn: ORD-123456"
                        disabled={!!orderId}
                        title={
                          orderId
                            ? "Sipariş sayfasından otomatik dolduruldu"
                            : ""
                        }
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Kargo Şirketi *</label>
                      <select
                        className="form-control"
                        value={formData.cargoCompany}
                        onChange={(e) =>
                          handleInputChange("cargoCompany", e.target.value)
                        }
                        required
                      >
                        <option value={CargoCompany.ARAS}>Aras Kargo</option>
                        <option
                          value={CargoCompany.YURTICI}
                          disabled
                          style={{
                            color: "#adb5bd",
                            backgroundColor: "#f8f9fa",
                          }}
                        >
                          Yurtiçi Kargo (deaktif)
                        </option>
                        <option
                          value={CargoCompany.PTT}
                          disabled
                          style={{
                            color: "#adb5bd",
                            backgroundColor: "#f8f9fa",
                          }}
                        >
                          PTT Kargo (deaktif)
                        </option>
                        <option
                          value={CargoCompany.MNG}
                          disabled
                          style={{
                            color: "#adb5bd",
                            backgroundColor: "#f8f9fa",
                          }}
                        >
                          MNG Kargo (deaktif)
                        </option>
                        <option
                          value={CargoCompany.UPS}
                          disabled
                          style={{
                            color: "#adb5bd",
                            backgroundColor: "#f8f9fa",
                          }}
                        >
                          UPS (deaktif)
                        </option>
                        <option
                          value={CargoCompany.SURAT}
                          disabled
                          style={{
                            color: "#adb5bd",
                            backgroundColor: "#f8f9fa",
                          }}
                        >
                          Sürat Kargo (deaktif)
                        </option>
                      </select>
                    </div>
                  </div>

                  {/* Kargo Takip Öğeleri */}
                  <div className="row">
                    <div className="col-12 mb-4">
                      <h6 className="text-primary">
                        <i className="bx bx-package me-2"></i>
                        Kargo Takip Öğeleri
                      </h6>
                      <hr />
                    </div>
                    <div className="col-12">
                      {formData.cargoPackageItems.map((item, index) => (
                        <div key={index} className="card mb-3">
                          <div className="card-header d-flex justify-content-between align-items-center">
                            <h6 className="m-3">Takip Öğesi {index + 1}</h6>
                            {formData.cargoPackageItems.length > 1 && (
                              <button
                                type="button"
                                className="btn btn-sm btn-danger"
                                onClick={() => removeTrackingItem(index)}
                              >
                                <i className="bx bx-trash"></i>
                              </button>
                            )}
                          </div>
                          <div className="card-body">
                            <div className="row">
                              <div className="col-md-4 mb-3">
                                <label className="form-label">
                                  Uzunluk (cm) *
                                </label>
                                <input
                                  type="number"
                                  step="0.1"
                                  className="form-control"
                                  value={item.lengthCm}
                                  onChange={(e) =>
                                    handleTrackingItemChange(
                                      index,
                                      "lengthCm",
                                      parseFloat(e.target.value) || 0
                                    )
                                  }
                                  required
                                  min="0"
                                />
                              </div>
                              <div className="col-md-4 mb-3">
                                <label className="form-label">
                                  Genişlik (cm) *
                                </label>
                                <input
                                  type="number"
                                  step="0.1"
                                  className="form-control"
                                  value={item.widthCm}
                                  onChange={(e) =>
                                    handleTrackingItemChange(
                                      index,
                                      "widthCm",
                                      parseFloat(e.target.value) || 0
                                    )
                                  }
                                  required
                                  min="0"
                                />
                              </div>
                              <div className="col-md-4 mb-3">
                                <label className="form-label">
                                  Yükseklik (cm) *
                                </label>
                                <input
                                  type="number"
                                  step="0.1"
                                  className="form-control"
                                  value={item.heightCm}
                                  onChange={(e) =>
                                    handleTrackingItemChange(
                                      index,
                                      "heightCm",
                                      parseFloat(e.target.value) || 0
                                    )
                                  }
                                  required
                                  min="0"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      <button
                        type="button"
                        className="btn btn-secondary mb-4"
                        onClick={addTrackingItem}
                      >
                        <i className="bx bx-plus me-1"></i>
                        Takip Öğesi Ekle
                      </button>
                    </div>
                  </div>

                  {/* Form Actions */}
                  <div className="row">
                    <div className="col-12">
                      <div className="d-flex justify-content-end gap-2">
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={() => router.push("/admin/orders")}
                          disabled={isCreateLoading}
                        >
                          <i className="bx bx-x me-1"></i>
                          İptal
                        </button>
                        <button
                          type="submit"
                          className="btn btn-primary"
                          disabled={
                            isCreateLoading ||
                            isPricingLoading ||
                            isSuccess ||
                            isOrderLoading
                          }
                        >
                          {isPricingLoading ? (
                            <>
                              <span
                                className="spinner-border spinner-border-sm me-2"
                                role="status"
                                aria-hidden="true"
                              ></span>
                              Fiyat Alınıyor...
                            </>
                          ) : isCreateLoading ? (
                            <>
                              <span
                                className="spinner-border spinner-border-sm me-2"
                                role="status"
                                aria-hidden="true"
                              ></span>
                              Kargo Oluşturuluyor...
                            </>
                          ) : isSuccess ? (
                            <>
                              <i className="bx bx-check me-1"></i>
                              Kargo Oluşturuldu
                            </>
                          ) : !isPricingFetched ? (
                            <>
                              <i className="bx bx-money me-1"></i>
                              Kargo Fiyatı Al
                            </>
                          ) : (
                            <>
                              <i className="bx bx-save me-1"></i>
                              Kargo Oluştur
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* İptal Onay Modal */}
      <GeneralModal
        id="cancelCargoModal"
        title="Kargoyu İptal Et"
        size="md"
        showFooter={true}
        approveButtonText="İptal Et"
        onApprove={handleCancelCargo}
        onClose={() => {}}
        isLoading={isCancelPending}
      >
        <div className="text-center">
          <i
            className="bx bx-error-circle"
            style={{ fontSize: "3rem", color: "#dc3545" }}
          ></i>
          <h4 className="mt-3">Emin misiniz?</h4>
          <p className="text-muted">
            Entegrasyon kodu <strong>"{cargoIntegrationCode}"</strong> olan
            kargoyu iptal etmek istediğinizden emin misiniz? Bu işlem geri
            alınamaz.
          </p>
        </div>
      </GeneralModal>
    </div>
  );
}
