import { DiscountType } from "@/constants/enums/DiscountType";
import { useCreateCouponDiscount } from "@/hooks/services/discounts/coupon-discount/useCreateCouponDiscount";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import NotificationSettings from "@/components/shared/NotificationSettings";
import { NotificationSettings as NotificationSettingsType } from "@/constants/models/Notification";

interface CreateCouponDiscountForm {
  name: string;
  description: string;
  couponCode: string;
  discountValue: number;
  discountValueType: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  type: DiscountType;
  isWithinActiveDateRange: boolean;
  maxUsageCount: number;
  maxDiscountValue: number;
  notificationSettings: NotificationSettingsType;
}

const CreateCouponDiscountPage = () => {
  const router = useRouter();
  const { createCouponDiscount, isPending } = useCreateCouponDiscount();

  const [formData, setFormData] = useState<CreateCouponDiscountForm>({
    name: "",
    description: "",
    couponCode: "",
    discountValue: 0,
    discountValueType: 1,
    startDate: "",
    endDate: "",
    isActive: true,
    type: DiscountType.Coupon,
    isWithinActiveDateRange: false,
    maxUsageCount: 0,
    maxDiscountValue: 0,
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
      await createCouponDiscount(formData);
      router.push("/admin/campaigns/coupon-discount");
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
                href="/admin/campaigns/coupon-discount"
                className="text-muted fw-light hover:text-primary"
              >
                Kupon İndirimleri
              </Link>{" "}
              /
            </span>{" "}
            Yeni İndirim
          </h4>
          <Link
            href="/admin/campaigns/coupon-discount"
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
                      placeholder="Kupon indirimi adı"
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
                  <div className="col-md-4">
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

                  <div className="col-md-4">
                    <label className="form-label">İndirim Değeri *</label>
                    <input
                      type="number"
                      className="form-control"
                      name="discountValue"
                      value={formData.discountValue}
                      onChange={handleChange}
                      min={0}
                      onWheel={(e) => (e.target as HTMLInputElement).blur()}
                      required
                      placeholder="İndirim değeri"
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">
                      Maksimum İndirim Değeri
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      name="maxDiscountValue"
                      value={formData.maxDiscountValue}
                      onChange={handleChange}
                      min={0}
                      onWheel={(e) => (e.target as HTMLInputElement).blur()}
                      required
                      placeholder="Maksimum indirim değeri"
                    />
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Kupon Kodu *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="couponCode"
                      value={formData.couponCode}
                      onChange={handleChange}
                      required
                      placeholder="Kupon kodu"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Kullanım Limit *</label>
                    <input
                      type="number"
                      className="form-control"
                      name="maxUsageCount"
                      value={formData.maxUsageCount}
                      onChange={handleChange}
                      min={0}
                      required
                      onWheel={(e) => (e.target as HTMLInputElement).blur()}
                      placeholder="Kullanım limiti"
                    />
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
                        style={{ fontSize: "0.875rem" }}
                      >
                        İndirim aktif
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
                      <button type="submit" className="btn btn-primary">
                        İndirim Oluştur
                      </button>
                      <Link
                        href="/admin/campaigns/coupon-discount"
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
};

export default CreateCouponDiscountPage;
