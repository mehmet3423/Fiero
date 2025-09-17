import { useState } from "react";
import { useRouter } from "next/router";
import { useCreateFreeProductDiscount } from "@/hooks/services/discounts/gift-product-discount/useCreateFreeProductDiscount";
import { DiscountType } from "@/constants/enums/DiscountType";
import { DiscountValueType } from "@/constants/enums/DiscountValueType";
import Link from "next/link";
import ProductSelector from "@/components/ProductSelector";
import NotificationSettings from "@/components/shared/NotificationSettings";
import { NotificationSettings as NotificationSettingsType } from "@/constants/models/Notification";

const CreateGiftProductDiscountPage = () => {
  const router = useRouter();
  const { createFreeProductDiscount, isPending } =
    useCreateFreeProductDiscount();

  const [formData, setFormData] = useState({
    productIds: [] as string[],
    name: "",
    description: "",
    discountValue: 0,
    discountValueType: DiscountValueType.Percentage,
    startDate: "",
    endDate: "",
    isActive: true,
    maxFreeProductPrice: 0,
    isRepeatable: false,
    minimumQuantity: 0,
    maxFreeProductsPerOrder: 0,
    type: DiscountType.GiftProductDiscount,
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
    try {
      await createFreeProductDiscount(formData);
      router.push("/admin/campaigns/gift-product-discount");
    } catch (error) {
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : type === "number"
          ? parseFloat(value) || 0
          : value,
    }));
  };

  const handleProductSelect = (productId: string) => {
    setFormData((prev) => ({
      ...prev,
      productIds: prev.productIds.includes(productId)
        ? prev.productIds.filter((id) => id !== productId)
        : [...prev.productIds, productId],
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
                href="/admin/campaigns/gift-product-discount"
                className="text-muted fw-light hover:text-primary"
              >
                Ücretsiz Ürün İndirimleri
              </Link>{" "}
              /
            </span>{" "}
            Yeni İndirim
          </h4>
          <Link
            href="/admin/campaigns/gift-product-discount"
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
                  placeholder="Örn: Ücretsiz Ürün Kampanyası"
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Açıklama</label>
                <input
                  type="text"
                  className="form-control"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="İndirim açıklaması"
                />
              </div>
            </div>

            {/* Ücretsiz Ürün ayarları */}
            <div className="row mb-3">
              <div className="col-md-4">
                <label className="form-label">Minimum Ürün Adeti</label>
                <input
                  type="number"
                  className="form-control"
                  name="minimumQuantity"
                  value={formData.minimumQuantity}
                  onChange={handleChange}
                  min={1}
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  required
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">
                  Sipariş Başına Ücretsiz Ürün Adeti
                </label>
                <input
                  type="number"
                  className="form-control"
                  name="maxFreeProductsPerOrder"
                  value={formData.maxFreeProductsPerOrder}
                  onChange={handleChange}
                  min={1}
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  required
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">
                  Maksimum Ücretsiz Ürün Fiyatı
                </label>
                <input
                  type="number"
                  className="form-control"
                  name="maxFreeProductPrice"
                  value={formData.maxFreeProductPrice}
                  onChange={handleChange}
                  min={0}
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  required
                />
              </div>
            </div>

            {/* Ürün seçimi */}
            <div className="mb-3">
              <ProductSelector
                selectedProductIds={formData.productIds}
                onProductSelect={handleProductSelect}
                multiSelect={true}
                title="Kampanya Ürünleri"
                height="400px"
              />
            </div>

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
                />
              </div>
            </div>

            {/* Durum */}
            <div className="row mb-4">
              <div className="col-md-6">
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                  />
                  <label className="form-check-label">İndirim aktif</label>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    name="isRepeatable"
                    checked={formData.isRepeatable}
                    onChange={handleChange}
                  />
                  <label className="form-check-label">Tekrarlanabilir</label>
                </div>
              </div>
            </div>

            {/* Notification Settings */}
            <NotificationSettings
              value={formData.notificationSettings}
              onChange={handleNotificationSettingsChange}
            />

            {/* Submit buttons */}
            <div className="d-flex gap-2">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isPending}
              >
                {isPending ? "Oluşturuluyor..." : "İndirim Oluştur"}
              </button>
              <Link
                href="/admin/campaigns/gift-product-discount"
                className="btn btn-secondary"
              >
                İptal
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateGiftProductDiscountPage;
