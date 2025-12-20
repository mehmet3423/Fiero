import CampaignFormWrapper from "@/components/admin/campaigns/CampaignFormWrapper";
import { DiscountType } from "@/constants/enums/DiscountType";
import { DiscountValueType } from "@/constants/enums/DiscountValueType";
import { CartDiscount } from "@/constants/models/Discount";
import { NotificationSettings as NotificationSettingsType } from "@/constants/models/Notification";
import { useCreateCartDiscount } from "@/hooks/services/discounts/cart-discount/useCreateCartDiscount";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "react-hot-toast";

interface CartDiscountForm {
  name: string;
  nameEn: string;
  description: string;
  discountValue: string;
  discountValueType: DiscountValueType;
  maxDiscountValue: number;
  startDate: string;
  endDate: string;
  minimumCartAmount: number;
  maximumCartAmount: number;
  minimumCartProductCount: number;
  maximumCartProductCount: number;
  isActive: boolean;
  type: DiscountType;
  isWithinActiveDateRange: boolean;
  notificationSettings: NotificationSettingsType;
}

const CreateCartDiscountPage = () => {
  const router = useRouter();
  const { createCartDiscount, isPending } = useCreateCartDiscount();

  const [formData, setFormData] = useState<CartDiscountForm>({
    name: "",
    nameEn: "",
    description: "",
    discountValue: "",
    discountValueType: DiscountValueType.Percentage,
    maxDiscountValue: 0,
    startDate: "",
    endDate: "",
    minimumCartAmount: 0,
    maximumCartAmount: 0,
    minimumCartProductCount: 0,
    maximumCartProductCount: 0,
    isActive: true,
    type: DiscountType.Cart,
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
      const requestData: Omit<
        CartDiscount,
        "id" | "createdOn" | "createdOnValue"
      > = {
        ...formData,
        discountValue: Number(formData.discountValue),
        minimumCartAmount: Number(formData.minimumCartAmount),
      };

      await createCartDiscount(requestData);
      router.push("/admin/campaigns/cart-discount");
    } catch (error) {
      toast.error("Sepet indirimi oluşturulurken bir hata oluştu");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
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
      campaignType="cart-discount"
      campaignTypeLabel="Sepet İndirimleri"
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
    >
      {/* İndirim Değer ve Tip Ayarları */}
      <div className="row mb-3">
        <div className="col-md-4">
          <label className="form-label">İndirim Değeri</label>
          <input
            type="number"
            className="form-control"
            name="discountValue"
            value={formData.discountValue}
            onChange={handleChange}
            min={0}
            required
            onWheel={(e) => (e.target as HTMLInputElement).blur()}
          />
        </div>
        <div className="col-md-4">
          <label className="form-label">İndirim Tipi</label>
          <select
            className="form-select"
            name="discountValueType"
            value={formData.discountValueType}
            onChange={handleChange}
            required
          >
            <option value={1}>Yüzde (%)</option>
            <option value={2}>Sabit Tutar (₺)</option>
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
          />
        </div>
      </div>

      {/* Sepet Kriterleri */}
      <div className="row mb-3">
        <div className="col-md-3">
          <label className="form-label">Minimum Sepet Tutarı</label>
          <input
            type="number"
            className="form-control"
            name="minimumCartAmount"
            value={formData.minimumCartAmount}
            onChange={handleChange}
            min={0}
            required
            onWheel={(e) => (e.target as HTMLInputElement).blur()}
          />
        </div>
        <div className="col-md-3">
          <label className="form-label">Maximum Sepet Tutarı</label>
          <input
            type="number"
            className="form-control"
            name="maximumCartAmount"
            value={formData.maximumCartAmount}
            onChange={handleChange}
            min={0}
            onWheel={(e) => (e.target as HTMLInputElement).blur()}
          />
        </div>
        <div className="col-md-3">
          <label className="form-label">Minimum Ürün Sayısı</label>
          <input
            type="number"
            className="form-control"
            name="minimumCartProductCount"
            value={formData.minimumCartProductCount}
            onChange={handleChange}
            min={0}
            onWheel={(e) => (e.target as HTMLInputElement).blur()}
          />
        </div>
        <div className="col-md-3">
          <label className="form-label">Maximum Ürün Sayısı</label>
          <input
            type="number"
            className="form-control"
            name="maximumCartProductCount"
            value={formData.maximumCartProductCount}
            onChange={handleChange}
            min={0}
            onWheel={(e) => (e.target as HTMLInputElement).blur()}
          />
        </div>
      </div>
    </CampaignFormWrapper>
  );
};

export default CreateCartDiscountPage;
