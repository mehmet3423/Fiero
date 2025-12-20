import CampaignFormWrapper from "@/components/admin/campaigns/CampaignFormWrapper";
import { DiscountType } from "@/constants/enums/DiscountType";
import { NotificationSettings as NotificationSettingsType } from "@/constants/models/Notification";
import { useCreateWeekdayDiscount } from "@/hooks/services/discounts/weekday-dicount/useCreateWeekdayDiscount";
import { useRouter } from "next/router";
import { useState } from "react";

interface CreateWeekdayDiscountForm {
  name: string;
  nameEn: string;
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
    nameEn: "",
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
    <CampaignFormWrapper
      campaignType="weekday-discount"
      campaignTypeLabel="Haftanın Günleri İndirimleri"
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
            <option value="1">Yüzde (%)</option>
            <option value="2">Tutar (₺)</option>
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

      {/* Haftanın Günü Seçimi */}
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
    </CampaignFormWrapper>
  );
};

export default CreateWeekdayDiscountPage;
