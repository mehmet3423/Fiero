import CampaignFormWrapper from "@/components/admin/campaigns/CampaignFormWrapper";
import { DiscountType } from "@/constants/enums/DiscountType";
import { DiscountValueType } from "@/constants/enums/DiscountValueType";
import { NotificationSettings as NotificationSettingsType } from "@/constants/models/Notification";
import { useCreateTimeOfDayDiscount } from "@/hooks/services/discounts/timeOfDay-discount/useCreateTimeOfDayDiscount";
import { useRouter } from "next/router";
import { useState } from "react";

interface CreateTimeOfDayDiscountForm {
  name: string;
  nameEn: string;
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
    nameEn: "",
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

    try {
      // Convert form data to API format
      const apiData = {
        ...formData,
        startTime: `${formData.startTime.toString().padStart(2, "0")}:00:00`, // Format as HH:mm:ss
        endTime: `${formData.endTime.toString().padStart(2, "0")}:00:00`, // Format as HH:mm:ss
      };
      await createTimeOfDayDiscount(apiData as any);
      router.push("/admin/campaigns/time-of-day-discount");
    } catch (error) { }
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
    <CampaignFormWrapper
      campaignType="time-of-day-discount"
      campaignTypeLabel="Saat Aralığı İndirimleri"
      action="create"
      name={formData.name}
      nameEn={formData.nameEn}
      description={formData.description}
      startDate={formData.startDate}
      endDate={formData.endDate}
      isActive={formData.isActive}
      notificationSettings={formData.notificationSettings}
      onNameChange={(value) =>
        setFormData((prev) => ({ ...prev, name: value }))
      }
      onNameEnChange={(value) =>
        setFormData((prev) => ({ ...prev, nameEn: value }))
      }
      onDescriptionChange={(value) =>
        setFormData((prev) => ({ ...prev, description: value }))
      }
      onStartDateChange={(value) =>
        setFormData((prev) => ({ ...prev, startDate: value }))
      }
      onEndDateChange={(value) =>
        setFormData((prev) => ({ ...prev, endDate: value }))
      }
      onActiveToggle={(value) =>
        setFormData((prev) => ({ ...prev, isActive: value }))
      }
      onNotificationSettingsChange={handleNotificationSettingsChange}
      onSubmit={handleSubmit}
      isSubmitting={isPending}
      submitButtonText="İndirim Oluştur"
    >
      {/* İndirim Değerleri */}
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
            placeholder="Maksimum indirim değeri"
          />
        </div>
      </div>

      {/* Saat Aralığı Ayarları */}
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

      {/* Saat Aralığı Önizleme */}
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
          </div>
        </div>
      </div>
    </CampaignFormWrapper>
  );
};

export default CreateTimeOfDayDiscountPage;
