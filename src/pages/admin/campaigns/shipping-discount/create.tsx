import { DiscountType } from "@/constants/enums/DiscountType";
import { useCreateShippingDiscount } from "@/hooks/services/discounts/shipping-discount/useCreateShippingDiscount";
import { useRouter } from "next/router";
import { useState } from "react";
import CampaignFormWrapper from "@/components/admin/campaigns/CampaignFormWrapper";
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
  const { settingTypes, isLoading: isSettingTypesLoading } =
    useGetSystemSettingTypes();
  const { settings, isLoading: isSettingsLoading } = useGetSystemSettings();
  const shippingCostKey = settingTypes.find(
    (s) => s.key === "ShippingCost"
  )?.value;

  const maxShippingPrice = Number(
    settings.find((s) => s.key === shippingCostKey)?.value ?? 0
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
      campaignType="shipping-discount"
      campaignTypeLabel="Kargo İndirimleri"
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
      {/* İndirim Değer ve Tip Ayarları */}
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

      {/* Minimum Sipariş Tutarı */}
      <div className="row mb-3">
        <div className="col-md-6">
          <label className="form-label">MİNİMUM SİPARİŞ TUTARI *</label>
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
            Bu tutarın üzerindeki siparişlerde kargo indirimi uygulanır
          </small>
        </div>
      </div>
    </CampaignFormWrapper>
  );
}

export default CreateShippingDiscountPage;
