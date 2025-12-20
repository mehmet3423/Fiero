import { useState } from "react";
import { useRouter } from "next/router";
import { useCreateBundleDiscount } from "@/hooks/services/discounts/bundle-discount/useCreateBundleDiscount";
import { DiscountType } from "@/constants/enums/DiscountType";
import ProductSelector from "@/components/ProductSelector";
import CampaignFormWrapper from "@/components/admin/campaigns/CampaignFormWrapper";
import { NotificationSettings as NotificationSettingsType } from "@/constants/models/Notification";

const CreateBundleDiscountPage = () => {
  const router = useRouter();
  const { createBundleDiscount, isPending } = useCreateBundleDiscount();
  const [totalOriginalPrice, setTotalOriginalPrice] = useState(0);

  const [formData, setFormData] = useState({
    productIds: [] as string[],
    bundlePrice: 0,
    name: "",
    description: "",
    discountValue: 0,
    maxDiscountValue: 0,
    discountValueType: 1,
    startDate: "",
    endDate: "",
    isActive: true,
    type: DiscountType.Bundle,
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
      await createBundleDiscount(formData);
      router.push("/admin/campaigns/bundle-discount");
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
      campaignType="bundle-discount"
      campaignTypeLabel="Bundle İndirimleri"
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
      submitDisabled={formData.productIds.length < 2}
      nameLabel="Paket İndirim Adı"
    >
      {/* Ürün seçimi */}
      <ProductSelector
        selectedProductIds={formData.productIds}
        onProductSelect={handleProductSelect}
        multiSelect={true}
        title="Ürünler"
        height="400px"
        onTotalPriceChange={setTotalOriginalPrice}
        discountType="bundle"
      />

      {/* İndirim detayları */}
      <div className="row mb-3">
        <div className="col-md-6">
          <label className="form-label">Paket Fiyatı</label>
          <input
            type="number"
            className="form-control"
            name="bundlePrice"
            value={formData.bundlePrice}
            onChange={handleChange}
            min={0}
            onWheel={(e) => (e.target as HTMLInputElement).blur()}
            required
          />
          {formData.bundlePrice > 0 && totalOriginalPrice > 0 && (
            <small className="text-muted d-block mt-1">
              Toplam indirim: %
              {(
                ((totalOriginalPrice - formData.bundlePrice) /
                  totalOriginalPrice) *
                100
              ).toFixed(2)}
            </small>
          )}
        </div>
        <div className="col-md-6">
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
    </CampaignFormWrapper>
  );
};

export default CreateBundleDiscountPage;
