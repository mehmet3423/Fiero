import CampaignFormWrapper from "@/components/admin/campaigns/CampaignFormWrapper";
import { DiscountType } from "@/constants/enums/DiscountType";
import { NotificationSettings as NotificationSettingsType } from "@/constants/models/Notification";
import { useCreateSpecialDayDiscount } from "@/hooks/services/discounts/specialDay-discount/useCreateSpecialDayDiscount";
import { useRouter } from "next/router";
import { useState } from "react";

interface CreateSpecialDayDiscountForm {
  name: string;
  nameEn: string;
  description: string;
  discountValue: number;
  discountValueType: number;
  maxDiscountValue: number;
  startDate: string;
  endDate: string;
  day: number;
  month: number;
  isActive: boolean;
  type: DiscountType;
  isWithinActiveDateRange: boolean;
  notificationSettings: NotificationSettingsType;
}

const CreateSpecialDayDiscountPage = () => {
  const router = useRouter();
  const { createSpecialDayDiscount, isPending } = useCreateSpecialDayDiscount();

  const [formData, setFormData] = useState<CreateSpecialDayDiscountForm>({
    name: "",
    nameEn: "",
    description: "",
    discountValue: 0,
    discountValueType: 1,
    maxDiscountValue: 0,
    startDate: "",
    endDate: "",
    day: 1,
    month: 1,
    isActive: true,
    type: DiscountType.SpecialDayDiscount,
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
      await createSpecialDayDiscount(formData);
      router.push("/admin/campaigns/special-day-discount");
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
          : name === "discountValueType" || name === "month" || name === "day"
            ? Number(value)
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

  const months = [
    { value: 1, label: "Ocak" },
    { value: 2, label: "Şubat" },
    { value: 3, label: "Mart" },
    { value: 4, label: "Nisan" },
    { value: 5, label: "Mayıs" },
    { value: 6, label: "Haziran" },
    { value: 7, label: "Temmuz" },
    { value: 8, label: "Ağustos" },
    { value: 9, label: "Eylül" },
    { value: 10, label: "Ekim" },
    { value: 11, label: "Kasım" },
    { value: 12, label: "Aralık" },
  ];

  const getDaysInMonth = (month: number) => {
    const daysInMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    return daysInMonth[month - 1];
  };

  const dayOptions = Array.from(
    { length: getDaysInMonth(formData.month) },
    (_, i) => i + 1
  );

  return (
    <CampaignFormWrapper
      campaignType="special-day-discount"
      campaignTypeLabel="Özel Gün İndirimleri"
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

      {/* Özel Gün Seçimi */}
      <div className="row mb-3">
        <div className="col-md-6">
          <label className="form-label">Ay *</label>
          <select
            className="form-select"
            name="month"
            value={formData.month}
            onChange={handleChange}
            required
          >
            {months.map((month) => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-6">
          <label className="form-label">Gün *</label>
          <select
            className="form-select"
            name="day"
            value={formData.day}
            onChange={handleChange}
            required
          >
            {dayOptions.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
        </div>
      </div>
    </CampaignFormWrapper>
  );
};

export default CreateSpecialDayDiscountPage;
