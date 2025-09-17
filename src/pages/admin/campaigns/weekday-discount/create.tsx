import { useState } from "react";
import { useRouter } from "next/router";
import { useCreateWeekdayDiscount } from "@/hooks/services/discounts/weekday-dicount/useCreateWeekdayDiscount";
import Link from "next/link";
import { DiscountType } from "@/constants/enums/DiscountType";
import { WeekdayDiscount } from "@/constants/models/Discount";
import NotificationSettings from "@/components/shared/NotificationSettings";
import { NotificationSettings as NotificationSettingsType } from "@/constants/models/Notification";

interface CreateWeekdayDiscountForm {
  name: string;
  description: string;
  discountValue: number;
  discountValueType: number;
  maxDiscountValue: number;
  startDate: string;
  endDate: string;
  dayOfWeek: number;
  isActive: boolean;
  type: DiscountType;
  isWithinActiveDateRange: boolean;
  notificationSettings: NotificationSettingsType;
}

const CreateWeekdayDiscountPage = () => {
  const router = useRouter();
  const { createWeekdayDiscount, isPending } = useCreateWeekdayDiscount();

  const [formData, setFormData] = useState<CreateWeekdayDiscountForm>({
    name: "",
    description: "",
    discountValue: 0,
    discountValueType: 1,
    maxDiscountValue: 0,
    startDate: "",
    endDate: "",
    dayOfWeek: 1, // Default: Pazartesi
    isActive: true,
    type: DiscountType.WeekdayDiscount,
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
      await createWeekdayDiscount(formData);
      router.push("/admin/campaigns/weekday-discount");
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

  const weekdays = [
    { value: 0, label: "Pazar", description: "Hafta sonu" },
    { value: 1, label: "Pazartesi", description: "Hafta içi" },
    { value: 2, label: "Salı", description: "Hafta içi" },
    { value: 3, label: "Çarşamba", description: "Hafta içi" },
    { value: 4, label: "Perşembe", description: "Hafta içi" },
    { value: 5, label: "Cuma", description: "Hafta içi" },
    { value: 6, label: "Cumartesi", description: "Hafta sonu" },
  ];

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
                href="/admin/campaigns/weekday-discount"
                className="text-muted fw-light hover:text-primary"
              >
                Haftanın Günleri İndirimleri
              </Link>{" "}
              /
            </span>{" "}
            Yeni İndirim
          </h4>
          <Link
            href="/admin/campaigns/weekday-discount"
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
                      placeholder="Haftanın günü indirimi adı"
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
                    <label className="form-label">Haftanın Günü *</label>
                    <select
                      className="form-select"
                      name="dayOfWeek"
                      value={formData.dayOfWeek}
                      onChange={handleChange}
                      required
                    >
                      {weekdays.map((day) => (
                        <option key={day.value} value={day.value}>
                          {day.label} ({day.description})
                        </option>
                      ))}
                    </select>
                    <small className="form-text text-muted">
                      İndirimin hangi gün geçerli olacağını seçin
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
                        href="/admin/campaigns/weekday-discount"
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

export default CreateWeekdayDiscountPage;
