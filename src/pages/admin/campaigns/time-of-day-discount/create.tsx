import { useState } from "react";
import { useRouter } from "next/router";
import { useCreateTimeOfDayDiscount } from "@/hooks/services/discounts/timeOfDay-discount/useCreateTimeOfDayDiscount";
import Link from "next/link";
import { DiscountType } from "@/constants/enums/DiscountType";
import { TimeOfDayDiscount } from "@/constants/models/Discount";
import { DiscountValueType } from "@/constants/enums/DiscountValueType";
import NotificationSettings from "@/components/shared/NotificationSettings";
import { NotificationSettings as NotificationSettingsType } from "@/constants/models/Notification";

interface CreateTimeOfDayDiscountForm {
  name: string;
  description: string;
  discountValue: number;
  discountValueType: DiscountValueType;
  maxDiscountValue: number;
  startDate: string;
  endDate: string;
  startTime: number;
  endTime: number;
  isActive: boolean;
  type: DiscountType;
  isWithinActiveDateRange: boolean;
  notificationSettings: NotificationSettingsType;
}

const CreateTimeOfDayDiscountPage = () => {
  const router = useRouter();
  const { createTimeOfDayDiscount, isPending } = useCreateTimeOfDayDiscount();

  const [formData, setFormData] = useState<CreateTimeOfDayDiscountForm>({
    name: "",
    description: "",
    discountValue: 0,
    discountValueType: 1,
    maxDiscountValue: 0,
    startDate: "",
    endDate: "",
    startTime: 9, // Default: 09:00
    endTime: 17, // Default: 17:00
    isActive: true,
    type: DiscountType.TimeOfDayDiscount,
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

    // Saat doğrulaması
    if (formData.startTime >= formData.endTime) {
      alert("Başlangıç saati bitiş saatinden küçük olmalıdır");
      return;
    }

    try {
      // Convert form data to API format
      const apiData = {
        ...formData,
        startTime: `${formData.startTime.toString().padStart(2, "0")}:00:00`, // Format as HH:mm:ss
        endTime: `${formData.endTime.toString().padStart(2, "0")}:00:00`, // Format as HH:mm:ss
      };
      await createTimeOfDayDiscount(apiData as any);
      router.push("/admin/campaigns/time-of-day-discount");
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

  // Saat seçenekleri (0-23)
  const hourOptions = Array.from({ length: 24 }, (_, i) => ({
    value: i,
    label: `${i.toString().padStart(2, "0")}:00`,
  }));

  const formatTimeRange = () => {
    const formatHour = (hour: number) =>
      `${hour.toString().padStart(2, "0")}:00`;
    return `${formatHour(formData.startTime)} - ${formatHour(
      formData.endTime
    )}`;
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
                href="/admin/campaigns/time-of-day-discount"
                className="text-muted fw-light hover:text-primary"
              >
                Saat Aralığı İndirimleri
              </Link>{" "}
              /
            </span>{" "}
            Yeni İndirim
          </h4>
          <Link
            href="/admin/campaigns/time-of-day-discount"
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
                      placeholder="Saat aralığı indirimi adı"
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
                      <option value={1}>Yüzde (%)</option>
                      <option value={2}>Tutar (₺)</option>
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
                      placeholder="Maksimum indirim değeri"
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
                    <label className="form-label">Başlangıç Saati *</label>
                    <select
                      className="form-select"
                      name="startTime"
                      value={formData.startTime}
                      onChange={handleChange}
                      required
                    >
                      {hourOptions.map((hour) => (
                        <option key={hour.value} value={hour.value}>
                          {hour.label}
                        </option>
                      ))}
                    </select>
                    <small className="form-text text-muted">
                      İndirimin geçerli olacağı başlangıç saati
                    </small>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Bitiş Saati *</label>
                    <select
                      className="form-select"
                      name="endTime"
                      value={formData.endTime}
                      onChange={handleChange}
                      required
                    >
                      {hourOptions.map((hour) => (
                        <option key={hour.value} value={hour.value}>
                          {hour.label}
                        </option>
                      ))}
                    </select>
                    <small className="form-text text-muted">
                      İndirimin geçerli olacağı bitiş saati
                    </small>
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Saat Aralığı Önizleme</label>
                    <div className="form-control-plaintext">
                      <span
                        className={`badge bg-primary`}
                        style={{ fontSize: "0.875rem", padding: "8px 12px" }}
                      >
                        {formatTimeRange()}
                      </span>
                      {formData.startTime >= formData.endTime && (
                        <small className="text-danger d-block mt-1">
                          ⚠️ Başlangıç saati bitiş saatinden küçük olmalıdır
                        </small>
                      )}
                    </div>
                  </div>
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
                        disabled={
                          isPending || formData.startTime >= formData.endTime
                        }
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
                        href="/admin/campaigns/time-of-day-discount"
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

export default CreateTimeOfDayDiscountPage;
