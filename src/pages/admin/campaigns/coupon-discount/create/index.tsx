import { DiscountType } from "@/constants/enums/DiscountType";
import { useCreateCouponDiscount } from "@/hooks/services/discounts/coupon-discount/useCreateCouponDiscount";
import { useRouter } from "next/router";
import { useState } from "react";
import CampaignFormWrapper from "@/components/admin/campaigns/CampaignFormWrapper";
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
    } catch (error) {}
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
      campaignType="coupon-discount"
      campaignTypeLabel="Kupon İndirimleri"
      action="create"
      name={formData.name}
      description={formData.description}
      startDate={formData.startDate}
      endDate={formData.endDate}
      isActive={formData.isActive}
      notificationSettings={formData.notificationSettings}
      onNameChange={(value) =>
        setFormData((prev) => ({ ...prev, name: value }))
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

      {/* Kupon Ayarları */}
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
    </CampaignFormWrapper>
  );
};

export default CreateCouponDiscountPage;
