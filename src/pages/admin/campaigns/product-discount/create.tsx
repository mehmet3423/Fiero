import ProductSelector from "@/components/ProductSelector";
import CampaignFormWrapper from "@/components/admin/campaigns/CampaignFormWrapper";
import { DiscountType } from "@/constants/enums/DiscountType";
import { NotificationSettings as NotificationSettingsType } from "@/constants/models/Notification";
import { useCreateProductDiscount } from "@/hooks/services/discounts/product-discount/useCreateProductDiscount";
import { useRouter } from "next/router";
import { useState } from "react";

interface ProductDiscountForm {
  name: string;
  nameEn: string;
  description: string;
  discountValue: number;
  discountValueType: number;
  maxDiscountValue: number;
  startDate: string;
  endDate: string;
  productId: string;
  productName: string;
  isActive: boolean;
  type: DiscountType;
  isWithinActiveDateRange: boolean;
  notificationSettings: NotificationSettingsType;
}

export default function CreateProductDiscount() {
  const router = useRouter();
  const { createProductDiscount, isPending } = useCreateProductDiscount();
  const [productWithDiscountWarning, setProductWithDiscountWarning] = useState<{
    show: boolean;
    productTitle: string;
  }>({ show: false, productTitle: "" });

  const [formData, setFormData] = useState<ProductDiscountForm>({
    name: "",
    nameEn: "",
    description: "",
    discountValue: 0,
    discountValueType: 1,
    maxDiscountValue: 0,
    startDate: "",
    endDate: "",
    productId: "",
    productName: "",
    isActive: true,
    type: DiscountType.Product,
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

    if (!formData.productId) {
      alert("Lütfen bir ürün seçin!");
      return;
    }

    try {
      await createProductDiscount(formData);
      router.push("/admin/campaigns/product-discount");
    } catch (error) { }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    const numberFields = [
      "discountValueType",
      "day",
      "month",
      "discountValue",
      "maxDiscountValue",
    ];
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : type === "number" || numberFields.includes(name)
            ? name === "discountValueType" || name === "day" || name === "month"
              ? parseInt(value, 10) // Integer alanlar için
              : parseFloat(value) // Float alanlar için
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

  const handleProductSelect = (productId: string) => {
    setFormData((prev) => ({ ...prev, productId }));
  };

  const handleProductWithDiscountSelected = (
    hasDiscount: boolean,
    productTitle?: string
  ) => {
    if (hasDiscount && productTitle) {
      setProductWithDiscountWarning({
        show: true,
        productTitle,
      });
    } else {
      setProductWithDiscountWarning({
        show: false,
        productTitle: "",
      });
    }
  };

  return (
    <CampaignFormWrapper
      campaignType="product-discount"
      campaignTypeLabel="Ürün İndirimleri"
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
      submitDisabled={!formData.productId}
      submitButtonText={
        productWithDiscountWarning.show
          ? "Mevcut İndirimi Değiştir ve Kaydet"
          : "Kaydet"
      }
      submitButtonVariant={
        productWithDiscountWarning.show ? "warning" : "primary"
      }
    >
      {/* İndirim detayları */}
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
            onWheel={(e) => (e.target as HTMLInputElement).blur()}
            required
          />
        </div>
        <div className="col-md-4">
          <label className="form-label">İndirim Tipi</label>
          <select
            className="form-select"
            name="discountValueType"
            value={formData.discountValueType}
            onChange={(e) => handleChange(e)}
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
          />
        </div>
      </div>

      {/* Ürün seçimi */}
      <ProductSelector
        selectedProductIds={formData.productId ? [formData.productId] : []}
        onProductSelect={handleProductSelect}
        onProductWithDiscountSelected={handleProductWithDiscountSelected}
        multiSelect={false}
        title="Ürün Seçimi"
        height="300px"
        discountType="product"
      />

      {/* Uyarı mesajı */}
      {productWithDiscountWarning.show && (
        <div className="alert d-flex align-items-center mb-3" role="alert">
          <i
            className="bx bx-error-circle me-2"
            style={{
              fontSize: "1.5rem",
              color: "red",
            }}
          ></i>
          <div>
            <small className="text-dark">
              Kırmızı ünlem ikonuna sahip ürünlerin indirimleri mevcut. Yeni
              indirim eklediğinizde, mevcut indirim otomatik olarak kaldırılacak
              ve yerine yeni indirim uygulanacaktır.
            </small>
          </div>
        </div>
      )}
    </CampaignFormWrapper>
  );
}
