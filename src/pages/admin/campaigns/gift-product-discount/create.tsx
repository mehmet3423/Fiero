import { useState } from "react";
import { useRouter } from "next/router";
import { useCreateFreeProductDiscount } from "@/hooks/services/discounts/gift-product-discount/useCreateFreeProductDiscount";
import { DiscountType } from "@/constants/enums/DiscountType";
import { DiscountValueType } from "@/constants/enums/DiscountValueType";
import ProductSelector from "@/components/ProductSelector";
import CampaignFormWrapper from "@/components/admin/campaigns/CampaignFormWrapper";
import { NotificationSettings as NotificationSettingsType } from "@/constants/models/Notification";

const CreateGiftProductDiscountPage = () => {
  const router = useRouter();
  const { createFreeProductDiscount, isPending } =
    useCreateFreeProductDiscount();

  const [formData, setFormData] = useState({
    productIds: [] as string[],
    name: "",
    description: "",
    discountValue: 0,
    discountValueType: DiscountValueType.Percentage,
    startDate: "",
    endDate: "",
    isActive: true,
    maxFreeProductPrice: 0,
    isRepeatable: false,
    minimumQuantity: 0,
    maxFreeProductsPerOrder: 0,
    type: DiscountType.GiftProductDiscount,
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
      await createFreeProductDiscount(formData);
      router.push("/admin/campaigns/gift-product-discount");
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
      campaignType="gift-product-discount"
      campaignTypeLabel="Ücretsiz Ürün İndirimleri"
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
      {/* Ücretsiz Ürün Ayarları */}
      <div className="row mb-3">
        <div className="col-md-4">
          <label className="form-label">Minimum Ürün Adeti</label>
          <input
            type="number"
            className="form-control"
            name="minimumQuantity"
            value={formData.minimumQuantity}
            onChange={handleChange}
            min={1}
            onWheel={(e) => (e.target as HTMLInputElement).blur()}
            required
          />
        </div>
        <div className="col-md-4">
          <label className="form-label">
            Sipariş Başına Ücretsiz Ürün Adeti
          </label>
          <input
            type="number"
            className="form-control"
            name="maxFreeProductsPerOrder"
            value={formData.maxFreeProductsPerOrder}
            onChange={handleChange}
            min={1}
            onWheel={(e) => (e.target as HTMLInputElement).blur()}
            required
          />
        </div>
        <div className="col-md-4">
          <label className="form-label">Maksimum Ücretsiz Ürün Fiyatı</label>
          <input
            type="number"
            className="form-control"
            name="maxFreeProductPrice"
            value={formData.maxFreeProductPrice}
            onChange={handleChange}
            min={0}
            onWheel={(e) => (e.target as HTMLInputElement).blur()}
            required
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
          restrictCampaignType="free-product"
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

export default CreateGiftProductDiscountPage;
