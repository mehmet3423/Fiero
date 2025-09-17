import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useCreateOrderCargo } from "@/hooks/services/cargo/useCreateCargo";
import { useGetOrderById } from "@/hooks/services/order/useGetOrderById";
import {
  CreateCargoRequest,
  CargoCompany,
} from "@/constants/models/cargo/CreateCargo";
import BackButton from "@/components/shared/BackButton";

export default function CreateCargoPage() {
  const router = useRouter();
  const { orderId } = router.query;

  const {
    createOrderCargo,
    isLoading: isCreateLoading,
    error: createError,
    isSuccess,
  } = useCreateOrderCargo();

  // Order bilgilerini çek
  const {
    order,
    isLoading: isOrderLoading,
    error: orderError,
  } = useGetOrderById({ orderId: orderId as string });

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

  // Order bilgileri geldiğinde form'u otomatik doldur
  useEffect(() => {
    if (order && orderId) {
      setFormData((prev) => ({
        ...prev,
        orderId: orderId as string,
      }));
    }
  }, [order, orderId]);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: field === "cargoCompany" ? Number(value) : value,
    }));
  };

  const handleTrackingItemChange = (
    index: number,
    field: string,
    value: any
  ) => {
    setFormData((prev) => ({
      ...prev,
      cargoPackageItems: prev.cargoPackageItems.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
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
  };

  const removeTrackingItem = (index: number) => {
    if (formData.cargoPackageItems.length > 1) {
      setFormData((prev) => ({
        ...prev,
        cargoPackageItems: prev.cargoPackageItems.filter((_, i) => i !== index),
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createOrderCargo(formData);
    } catch (error) {
      console.error("Kargo oluşturma hatası:", error);
    }
  };

  // Success durumunda ana sayfaya yönlendir
  if (isSuccess) {
    setTimeout(() => {
      router.push("/admin/cargo");
    }, 2000);
  }

  return (
    <div className="container-fluid">
      {/* Header */}
      <div className="row">
        <div className="col-md-12">
          <div className="card mb-4">
            <div className="card-header d-flex justify-content-between align-items-center ">
              <div>
                {order && (
                  <small className="text-muted ms-3">
                    Sipariş: {order.orderNumber} | Müşteri:{" "}
                    {order.shippingAddress?.firstName}{" "}
                    {order.shippingAddress?.lastName}
                  </small>
                )}
              </div>
              <BackButton href="/admin/orders" className="m-3" />
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
      {isSuccess && (
        <div className="row mb-4">
          <div className="col-md-12">
            <div className="alert alert-success" role="alert">
              <i className="bx bx-check me-2"></i>
              Kargo başarıyla oluşturuldu! Ana sayfaya yönlendiriliyorsunuz...
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

      {/* Create Form */}
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
                        orderId ? "Sipariş sayfasından otomatik dolduruldu" : ""
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
                      <option value={CargoCompany.YURTICI}>
                        Yurtiçi Kargo
                      </option>
                      <option value={CargoCompany.PTT}>PTT Kargo</option>
                      <option value={CargoCompany.MNG}>MNG Kargo</option>
                      <option value={CargoCompany.UPS}>UPS</option>
                      <option value={CargoCompany.SURAT}>Sürat Kargo</option>
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
                          isCreateLoading || isSuccess || isOrderLoading
                        }
                      >
                        {isCreateLoading ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm me-2"
                              role="status"
                              aria-hidden="true"
                            ></span>
                            Oluşturuluyor...
                          </>
                        ) : isSuccess ? (
                          <>
                            <i className="bx bx-check me-1"></i>
                            Oluşturuldu
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
    </div>
  );
}
