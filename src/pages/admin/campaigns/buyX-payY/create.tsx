import { useState } from "react";
import { useRouter } from "next/router";
import { useCreateBuyXPayYDiscount } from "@/hooks/services/discounts/buyX-payY/useCreateBuyXPayYDiscount";
import { DiscountType } from "@/constants/enums/DiscountType";
import ProductSelector from "@/components/ProductSelector";
import CampaignFormWrapper from "@/components/admin/campaigns/CampaignFormWrapper";
import { NotificationSettings as NotificationSettingsType } from "@/constants/models/Notification";

const CreateBuyXPayYDiscountPage = () => {
  const router = useRouter();
  const { createBuyXPayYDiscount, isPending } = useCreateBuyXPayYDiscount();

  const [formData, setFormData] = useState({
    productIds: [] as string[],
    name: "",
    description: "",
    discountValue: 0,
    discountValueType: 1,
    maxDiscountValue: 0,
    startDate: "",
    endDate: "",
    isActive: true,
    buyXCount: 0,
    payYCount: 0,
    type: DiscountType.BuyXPayY,
    isRepeatable: false,
    maxFreeProductPerOrder: 0,
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
      // Form submit fonksiyonunda:
      await createBuyXPayYDiscount({
        ...formData,
        buyXPayYProducts: formData.productIds, // <-- Bunu ekle!
      });
      router.push("/admin/campaigns/buyX-payY");
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
          ? parseFloat(value) || 0
          : value,
    }));
  };

  const handleProductSelect = (productId: string) => {
    setFormData((prev) => ({
      ...prev,
      productIds: prev.productIds.includes(productId)
        ? prev.productIds.filter((id) => id !== productId)
        : [...prev.productIds, productId],
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
      campaignType="buyX-payY"
      campaignTypeLabel="X Al Y Öde İndirimleri"
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
      {/* X Al Y Öde Ayarları */}
      <div className="row mb-3">
        <div className="col-md-3">
          <label className="form-label">Kaç Adet Al (X)</label>
          <input
            type="number"
            className="form-control"
            name="buyXCount"
            value={formData.buyXCount || ""}
            onChange={handleChange}
            min={1}
            onWheel={(e) => (e.target as HTMLInputElement).blur()}
            placeholder="Örn: 3"
            required
          />
        </div>
        <div className="col-md-3">
          <label className="form-label">Kaç Adet Öde (Y)</label>
          <input
            type="number"
            className="form-control"
            name="payYCount"
            value={formData.payYCount || ""}
            onChange={handleChange}
            min={1}
            onWheel={(e) => (e.target as HTMLInputElement).blur()}
            placeholder="Örn: 2"
            required
          />
        </div>
        <div className="col-md-3">
          <label className="form-label">Maksimum İndirim Değeri</label>
          <input
            type="number"
            className="form-control"
            name="maxDiscountValue"
            value={formData.maxDiscountValue}
            onChange={handleChange}
            min={1}
            onWheel={(e) => (e.target as HTMLInputElement).blur()}
          />
        </div>
        <div className="col-md-3">
          <label className="form-label">
            Maksimum Ücretsiz Ürün Sipariş Başına
          </label>
          <input
            type="number"
            className="form-control"
            name="maxFreeProductPerOrder"
            value={formData.maxFreeProductPerOrder}
            onChange={handleChange}
            min={1}
            onWheel={(e) => (e.target as HTMLInputElement).blur()}
          />
        </div>
      </div>

      {/* Ürün Seçimi */}
      <div className="mb-3">
        <ProductSelector
          selectedProductIds={formData.productIds}
          onProductSelect={handleProductSelect}
          multiSelect={true}
          title="Kampanya Ürünleri"
          height="400px"
          restrictCampaignType="buyX-payY"
        />
      </div>

      {/* Tekrarlanabilir Checkbox */}
      <div className="row mb-3">
        <div className="col-md-6">
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              name="isRepeatable"
              checked={formData.isRepeatable}
              onChange={handleChange}
            />
            <label className="form-check-label">Tekrarlanabilir</label>
          </div>
        </div>
      </div>
    </CampaignFormWrapper>
  );
};

export default CreateBuyXPayYDiscountPage;
