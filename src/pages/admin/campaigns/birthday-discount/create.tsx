import CampaignFormWrapper from "@/components/admin/campaigns/CampaignFormWrapper";
import { DiscountType } from "@/constants/enums/DiscountType";
import { NotificationSettings as NotificationSettingsType } from "@/constants/models/Notification";
import { useCreateBirthdayDiscount } from "@/hooks/services/discounts/birthday-discount/useCreateBirthdayDiscount";
import { useRouter } from "next/router";
import { useState } from "react";

interface CreateBirthdayDiscountForm {
  name: string;
  nameEn: string;
  description: string;
  discountValue: number;
  discountValueType: number;
  maxDiscountValue: number;
  startDate: string;
  endDate: string;
  validDaysBefore: number;
  validDaysAfter: number;
  isActive: boolean;
  type: DiscountType;
  isWithinActiveDateRange: boolean;
  notificationSettings: NotificationSettingsType;
}

const CreateBirthdayDiscountPage = () => {
  const router = useRouter();
  const { createBirthdayDiscount, isPending } = useCreateBirthdayDiscount();

  const [formData, setFormData] = useState<CreateBirthdayDiscountForm>({
    name: "",
    nameEn: "",
    description: "",
    discountValue: 0,
    discountValueType: 1,
    maxDiscountValue: 0,
    startDate: "",
    endDate: "",
    validDaysBefore: 7,
    validDaysAfter: 7,
    isActive: true,
    type: DiscountType.BirthdayDiscount,
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
      await createBirthdayDiscount(formData);
      router.push("/admin/campaigns/birthday-discount");
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

  return (
    <CampaignFormWrapper
      campaignType="birthday-discount"
      campaignTypeLabel="Doğum Günü İndirimleri"
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
          <label className="form-label">Maksimum İndirim Değeri *</label>
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

      {/* Doğum Günü Geçerlilik Ayarları */}
      <div className="row mb-3">
        <div className="col-md-6">
          <label className="form-label">
            Doğum Gününden Önce Geçerli Gün Sayısı *
          </label>
          <input
            type="number"
            className="form-control"
            name="validDaysBefore"
            value={formData.validDaysBefore}
            onChange={handleChange}
            min={0}
            required
            onWheel={(e) => (e.target as HTMLInputElement).blur()}
            placeholder="Örn: 7 (7 gün önce)"
          />
          <small className="form-text text-muted">
            İndirimin doğum gününden kaç gün önce başlayacağı
          </small>
        </div>
        <div className="col-md-6">
          <label className="form-label">
            Doğum Gününden Sonra Geçerli Gün Sayısı *
          </label>
          <input
            type="number"
            className="form-control"
            name="validDaysAfter"
            value={formData.validDaysAfter}
            onChange={handleChange}
            min={0}
            required
            onWheel={(e) => (e.target as HTMLInputElement).blur()}
            placeholder="Örn: 7 (7 gün sonra)"
          />
          <small className="form-text text-muted">
            İndirimin doğum gününden kaç gün sonra biteceği
          </small>
        </div>
      </div>
    </CampaignFormWrapper>
  );
};

export default CreateBirthdayDiscountPage;
