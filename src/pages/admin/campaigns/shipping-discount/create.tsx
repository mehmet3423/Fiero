import { DiscountType } from "@/constants/enums/DiscountType";
import { useCreateShippingDiscount } from "@/hooks/services/discounts/shipping-discount/useCreateShippingDiscount";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import NotificationSettings from "@/components/shared/NotificationSettings";
import { NotificationSettings as NotificationSettingsType } from "@/constants/models/Notification";
import { useGetSystemSettingTypes } from "@/hooks/services/settings/useGetSystemSettingTypes";
import { useGetSystemSettings } from "@/hooks/services/settings/useGetSystemSettings";

interface CreateShippingDiscountForm {
  name: string;
  description: string;
  discountValue: number;
  discountValueType: number;
  startDate: string;
  endDate: string;
  minimumCargoAmount: number;
  isActive: boolean;
  type: DiscountType;
  isWithinActiveDateRange: boolean;
  notificationSettings: NotificationSettingsType;
}

function CreateShippingDiscountPage() {
  const router = useRouter();
  const { createShippingDiscount, isPending } = useCreateShippingDiscount();
  const { settingTypes, isLoading: isSettingTypesLoading } = useGetSystemSettingTypes();
  const { settings, isLoading: isSettingsLoading } = useGetSystemSettings();
  const shippingCostKey = settingTypes.find(s => s.key === "ShippingCost")?.value;

  const maxShippingPrice = Number(
    settings.find(s => s.key === shippingCostKey)?.value ?? 0
  );
  const [formData, setFormData] = useState<CreateShippingDiscountForm>({
    name: "",
    description: "",
    discountValue: 0,
    discountValueType: 1,
    startDate: "",
    endDate: "",
    minimumCargoAmount: 0,
    isActive: true,
    type: DiscountType.ShippingDiscount,
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
    try {
      await createShippingDiscount(formData);
      router.push("/admin/campaigns/shipping-discount");
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
            ? parseFloat(value)
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
                href="/admin/campaigns/shipping-discount"
                className="text-muted fw-light hover:text-primary"
              >
                Kargo İndirimleri
              </Link>{" "}
              /
            </span>{" "}
            Yeni İndirim
          </h4>
          <Link
            href="/admin/campaigns/shipping-discount"
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

      <div className="row">
        <div className="col-md-12">
          <div className="card mb-4">
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">İndirim Adı *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Kargo indirimi adı"
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
                      placeholder="İndirim açıklaması (isteğe bağlı)"
                    />
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">İndirim Değeri *</label>
                    <input
                      type="number"
                      className="form-control"
                      name="discountValue"
                      value={formData.discountValue}
                      onChange={handleChange}
                      min={0}
                      max={maxShippingPrice}
                      onWheel={(e) => (e.target as HTMLInputElement).blur()}
                      required
                      placeholder={`Maksimum ${maxShippingPrice}₺ olabilir`}
                      disabled={isSettingTypesLoading || isSettingsLoading}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">İndirim Tipi *</label>
                    <select
                      className="form-select"
                      name="discountValueType"
                      value={formData.discountValueType}
                      onChange={handleChange}
                      required
                    >
                      <option value="1">Yüzde (%)</option>
                      <option value="2">Tutar (₺)</option>
                    </select>
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Başlangıç Tarihi *</label>
                    <input
                      type="datetime-local"
                      className="form-control"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Bitiş Tarihi *</label>
                    <input
                      type="datetime-local"
                      className="form-control"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">
                      MİNİMUM SİPARİŞ TUTARI *
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      name="minimumCargoAmount"
                      value={formData.minimumCargoAmount}
                      onChange={handleChange}
                      min={0}
                      step="0.01"
                      required
                      placeholder="Minimum sipariş tutarı"
                    />
                    <small className="form-text text-muted">
                      Bu tutarın üzerindeki siparişlerde kargo indirimi
                      uygulanır
                    </small>
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Durum</label>
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input form-check-input-sm"
                        name="isActive"
                        checked={formData.isActive}
                        onChange={handleChange}
                        style={{ transform: "scale(0.7)" }}
                      />
                      <label
                        className="form-check-label"
                        style={{ fontSize: "1.2rem" }}
                      >
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

                <div className="row">
                  <div className="col-12">
                    <div className="d-flex gap-3">
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={isPending}
                      >
                        {isPending ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm me-2"
                              role="status"
                              aria-hidden="true"
                            ></span>
                            Oluşturuluyor...
                          </>
                        ) : (
                          "İndirim Oluştur"
                        )}
                      </button>
                      <Link
                        href="/admin/campaigns/shipping-discount"
                        className="btn btn-outline-secondary"
                      >
                        İptal
                      </Link>
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

export default CreateShippingDiscountPage;
