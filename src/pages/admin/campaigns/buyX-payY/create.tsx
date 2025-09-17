import { useState } from "react";
import { useRouter } from "next/router";
import { useCreateBuyXPayYDiscount } from "@/hooks/services/discounts/buyX-payY/useCreateBuyXPayYDiscount";
import { DiscountType } from "@/constants/enums/DiscountType";
import Link from "next/link";
import ProductSelector from "@/components/ProductSelector";
import NotificationSettings from "@/components/shared/NotificationSettings";
import { NotificationSettings as NotificationSettingsType } from "@/constants/models/Notification";

const CreateBuyXPayYDiscountPage = () => {
  const router = useRouter();
  const { createBuyXPayYDiscount, isPending } = useCreateBuyXPayYDiscount();

  const [formData, setFormData] = useState({
    productIds: [] as string[],
    name: "",
    description: "",
    discountValue: 0,
    discountValueType: 1,
    maxDiscountValue: 0,
    startDate: "",
    endDate: "",
    isActive: true,
    buyXCount: 0,
    payYCount: 0,
    type: DiscountType.BuyXPayY,
    isRepeatable: false,
    maxFreeProductPerOrder: 0,
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
      // Form submit fonksiyonunda:
      await createBuyXPayYDiscount({
        ...formData,
        buyXPayYProducts: formData.productIds, // <-- Bunu ekle!
      });
      router.push("/admin/campaigns/buyX-payY");
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
                href="/admin/campaigns/buyX-payY"
                className="text-muted fw-light hover:text-primary"
              >
                X Al Y Öde İndirimleri
              </Link>{" "}
              /
            </span>{" "}
            Yeni İndirim
          </h4>
          <Link
            href="/admin/campaigns/buyX-payY"
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
                  placeholder="Örn: 3 Al 2 Öde Kampanyası"
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

            {/* X Al Y Öde ayarları */}
            <div className="row mb-3">
              <div className="col-md-3">
                <label className="form-label">Kaç Adet Al (X)</label>
                <input
                  type="number"
                  className="form-control"
                  name="buyXCount"
                  value={formData.buyXCount || ""}
                  onChange={handleChange}
                  min={1}
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  placeholder="Örn: 3"
                  required
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">Kaç Adet Öde (Y)</label>
                <input
                  type="number"
                  className="form-control"
                  name="payYCount"
                  value={formData.payYCount || ""}
                  onChange={handleChange}
                  min={1}
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  placeholder="Örn: 2"
                  required
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">Maksimum İndirim Değeri</label>
                <input
                  type="number"
                  className="form-control"
                  name="maxDiscountValue"
                  value={formData.maxDiscountValue}
                  onChange={handleChange}
                  min={1}
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">
                  Maksimum Ücretsiz Ürün Sipariş Başına
                </label>
                <input
                  type="number"
                  className="form-control"
                  name="maxFreeProductPerOrder"
                  value={formData.maxFreeProductPerOrder}
                  onChange={handleChange}
                  min={1}
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                />
              </div>
            </div>

            <div className="row mb-3"></div>

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
                href="/admin/campaigns/buyX-payY"
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

export default CreateBuyXPayYDiscountPage;
