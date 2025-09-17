import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useCreateProductDiscount } from "@/hooks/services/discounts/product-discount/useCreateProductDiscount";
import { DiscountType } from "@/constants/enums/DiscountType";
import ProductSelector from "@/components/ProductSelector";
import NotificationSettings from "@/components/shared/NotificationSettings";
import { NotificationSettings as NotificationSettingsType } from "@/constants/models/Notification";

interface ProductDiscountForm {
  name: string;
  description: string;
  discountValue: number;
  discountValueType: number;
  maxDiscountValue: number;
  startDate: string;
  endDate: string;
  productId: string;
  productName: string;
  isActive: boolean;
  type: DiscountType;
  isWithinActiveDateRange: boolean;
  notificationSettings: NotificationSettingsType;
}

export default function CreateProductDiscount() {
  const router = useRouter();
  const { createProductDiscount, isPending } = useCreateProductDiscount();
  const [productWithDiscountWarning, setProductWithDiscountWarning] = useState<{
    show: boolean;
    productTitle: string;
  }>({ show: false, productTitle: "" });

  const [formData, setFormData] = useState<ProductDiscountForm>({
    name: "",
    description: "",
    discountValue: 0,
    discountValueType: 1,
    maxDiscountValue: 0,
    startDate: "",
    endDate: "",
    productId: "",
    productName: "",
    isActive: true,
    type: DiscountType.Product,
    isWithinActiveDateRange: false,
    notificationSettings: {
      isEmailNotificationEnabled: false,
      emailNotificationSubject: "",
      emailNotificationTextBody: "",
      emailNotificationHtmlBody: "",
      isSMSNotificationEnabled: false,
      smsNotificationSubject: "",
      smsNotificationTextBody: "",
      smsNotificationHtmlBody: "",
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.productId) {
      alert("Lütfen bir ürün seçin!");
      return;
    }

    try {
      await createProductDiscount(formData);
      router.push("/admin/campaigns/product-discount");
    } catch (error) {
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    const numberFields = [
      "discountValueType",
      "day",
      "month",
      "discountValue",
      "maxDiscountValue",
    ];
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : type === "number" || numberFields.includes(name)
            ? name === "discountValueType" || name === "day" || name === "month"
              ? parseInt(value, 10) // Integer alanlar için
              : parseFloat(value) // Float alanlar için
            : value,
    }));
  };

  const handleNotificationSettingsChange = (
    notificationSettings: NotificationSettingsType
  ) => {
    setFormData((prev) => ({
      ...prev,
      notificationSettings,
    }));
  };

  const handleProductSelect = (productId: string) => {
    setFormData((prev) => ({ ...prev, productId }));
  };

  const handleProductWithDiscountSelected = (
    hasDiscount: boolean,
    productTitle?: string
  ) => {
    if (hasDiscount && productTitle) {
      setProductWithDiscountWarning({
        show: true,
        productTitle,
      });
    } else {
      setProductWithDiscountWarning({
        show: false,
        productTitle: "",
      });
    }
  };

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold py-3 mb-4">
            <span className="text-muted fw-light">
              <Link
                href="/admin/campaigns"
                className="text-muted fw-light hover:text-primary"
              >
                Kampanyalar
              </Link>{" "}
              /{" "}
              <Link
                href="/admin/campaigns/product-discount"
                className="text-muted fw-light hover:text-primary"
              >
                Ürün İndirimleri
              </Link>{" "}
              /
            </span>{" "}
            Yeni İndirim
          </h4>
          <Link
            href="/admin/campaigns/product-discount"
            className="btn btn-outline-secondary"
            style={{
              backgroundColor: "#e9e9e9",
              color: "#000",
              borderColor: "#d9d9d9",
            }}
          >
            <i className="bx bx-arrow-back me-1"></i>
            Geri
          </Link>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            {/* Temel bilgiler */}
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">İndirim Adı</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">İndirim Açıklaması</label>
                <input
                  type="text"
                  className="form-control"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* İndirim detayları */}
            <div className="row mb-3">
              <div className="col-md-4">
                <label className="form-label">İndirim Değeri</label>
                <input
                  type="number"
                  className="form-control"
                  name="discountValue"
                  value={formData.discountValue}
                  onChange={handleChange}
                  min={0}
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  required
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">İndirim Tipi</label>
                <select
                  className="form-select"
                  name="discountValueType"
                  value={formData.discountValueType}
                  onChange={(e) => handleChange(e)}
                  required
                >
                  <option value={1}>Yüzde (%)</option>
                  <option value={2}>Tutar (₺)</option>
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label">Maksimum İndirim Değeri</label>
                <input
                  type="number"
                  className="form-control"
                  name="maxDiscountValue"
                  value={formData.maxDiscountValue}
                  onChange={handleChange}
                  min={0}
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  required
                />
              </div>
            </div>

            {/* Ürün seçimi */}
            <ProductSelector
              selectedProductIds={
                formData.productId ? [formData.productId] : []
              }
              onProductSelect={handleProductSelect}
              onProductWithDiscountSelected={handleProductWithDiscountSelected}
              multiSelect={false}
              title="Ürün Seçimi"
              height="300px"
              discountType="product"
            />

            {/* Uyarı mesajı */}
            {productWithDiscountWarning.show && (
              <div
                className="alert  d-flex align-items-center mb-3"
                role="alert"
              >
                <i
                  className="bx bx-error-circle me-2"
                  style={{
                    fontSize: "1.5rem",
                    color: "red",
                  }}
                ></i>
                <div>
                  <small className="text-dark">
                    Kırmızı ünlem ikonuna sahip ürünlerin indirimleri mevcut.
                    Yeni indirim eklediğinizde, mevcut indirim otomatik olarak
                    kaldırılacak ve yerine yeni indirim uygulanacaktır.
                  </small>
                </div>
              </div>
            )}

            {/* Tarih aralığı */}
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Başlangıç Tarihi</label>
                <input
                  type="datetime-local"
                  className="form-control"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  min={new Date().toISOString().slice(0, 16)}
                  required
                  style={{ cursor: "pointer" }}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Bitiş Tarihi</label>
                <input
                  type="datetime-local"
                  className="form-control"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  min={
                    formData.startDate || new Date().toISOString().slice(0, 16)
                  }
                  required
                  style={{ cursor: "pointer" }}
                />
              </div>
            </div>

            {/* Durum */}
            <div className="row mb-3">
              <div className="col-md-12">
                <div
                  className="form-check form-switch"
                  style={{ fontSize: "16px" }}
                >
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="isActive"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    style={{ cursor: "pointer" }}
                  />
                  <label className="form-check-label" htmlFor="isActive">
                    Aktif
                  </label>
                </div>
              </div>
            </div>

            {/* Notification Settings */}
            <NotificationSettings
              value={formData.notificationSettings}
              onChange={handleNotificationSettingsChange}
            />

            {/* Submit button */}
            <div className="d-flex gap-2">
              <button
                type="submit"
                className={`btn ${isPending || !formData.productId
                    ? "btn-light text-muted"
                    : productWithDiscountWarning.show
                      ? "btn-warning"
                      : "btn-primary"
                  }`}
                disabled={isPending || !formData.productId}
                style={{
                  filter:
                    isPending || !formData.productId
                      ? "grayscale(50%)"
                      : "none",
                  opacity: isPending || !formData.productId ? 0.7 : 1,
                }}
              >
                {isPending
                  ? "Kaydediliyor..."
                  : productWithDiscountWarning.show
                    ? "Mevcut İndirimi Değiştir ve Kaydet"
                    : "Kaydet"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
