import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useUpdateFreeProductDiscount } from "@/hooks/services/discounts/gift-product-discount/useUpdateFreeProductDiscount";
import { DiscountType } from "@/constants/enums/DiscountType";
import { useGetDiscountById } from "@/hooks/services/discounts/useGetDiscountById";
import ProductSelector from "@/components/ProductSelector";
import CampaignFormWrapper from "@/components/admin/campaigns/CampaignFormWrapper";
import { NotificationSettings as NotificationSettingsType } from "@/constants/models/Notification";

interface GiftProductDiscountForm {
  name: string;
  description: string;
  discountValue: number;
  discountValueType: number;
  maxDiscountValue: number;
  startDate: string;
  endDate: string;
  productIds: string[];
  selectedProductsData: any[];
  isActive: boolean;
  type: DiscountType;
  isWithinActiveDateRange: boolean;
  isRepeatable: boolean;
  minimumAmount: number;
}

export default function EditGiftProductDiscount() {
  const router = useRouter();
  const { id } = router.query;
  const { updateDiscount, isPending: isUpdating } =
    useUpdateFreeProductDiscount();
  const { discount, isLoading: discountLoading } = useGetDiscountById(
    id as string
  );

  const [formData, setFormData] = useState<GiftProductDiscountForm>({
    name: "",
    description: "",
    discountValue: 0,
    discountValueType: 1,
    maxDiscountValue: 0,
    startDate: "",
    endDate: "",
    productIds: [],
    selectedProductsData: [],
    isActive: true,
    type: DiscountType.GiftProductDiscount,
    isWithinActiveDateRange: false,
    isRepeatable: false,
    minimumAmount: 0,
  });

  useEffect(() => {
    if (discount) {
      // freeProductDiscountProducts, freeProductDiscount object'inin içinde!
      const freeProductDiscountProducts =
        (discount as any).freeProductDiscount?.freeProductDiscountProducts ||
        [];

      const productIds = freeProductDiscountProducts.map((product: any) => {
        return product.productId || product.id;
      });

      // Seçili ürünlerin tam detaylarını extract et
      const selectedProductsData = freeProductDiscountProducts
        .map((item: any) => {
          if (item.product) {
            return item.product;
          }
          return {
            id: item.productId || item.id,
            title: `Ürün ID: ${item.productId || item.id}`,
            price: 0,
            baseImageUrl: null,
          };
        })
        .filter(Boolean);

      setFormData({
        name: discount.name || "",
        description: discount.description || "",
        discountValue: discount.discountValue || 0,
        discountValueType: discount.discountValueType || 1,
        maxDiscountValue: discount.maxDiscountValue || 0,
        startDate: discount.startDate || "",
        endDate: discount.endDate || "",
        isActive: discount.isActive ?? true,
        type: DiscountType.GiftProductDiscount,
        isWithinActiveDateRange: false,
        productIds: productIds,
        selectedProductsData: selectedProductsData,
        isRepeatable: discount.freeProductDiscount?.isRepeatable || false,
        minimumAmount: discount.freeProductDiscount?.minimumQuantity || 0,
      });
    }
  }, [discount]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateDiscount({
        id: id as string,
        ...formData,
        createdOn: Date.now(),
        createdOnValue: new Date().toISOString(),
        minimumQuantity: formData.minimumAmount,
        freeProductIds: formData.productIds,
        buyXPayYProducts: formData.productIds,
        productIds: formData.productIds,
        freeProductDiscountProducts: [], // Backend'den gelen response'da bu property var ama edit'te boş
      });
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
          : name === "discountValueType"
          ? Number(value)
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

  if (discountLoading) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <CampaignFormWrapper
      campaignType="gift-product-discount"
      campaignTypeLabel="Hediye Ürün İndirimleri"
      action="edit"
      name={formData.name}
      description={formData.description}
      startDate={formData.startDate}
      endDate={formData.endDate}
      isActive={formData.isActive}
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
      onSubmit={handleSubmit}
      isSubmitting={isUpdating}
      submitDisabled={formData.productIds.length === 0}
    >
      {/* Minimum Tutar */}
      <div className="row mb-3">
        <div className="col-md-12">
          <label className="form-label">Minimum Tutar *</label>
          <input
            type="number"
            className="form-control"
            name="minimumAmount"
            value={formData.minimumAmount}
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
          selectedProductsData={formData.selectedProductsData}
          onProductSelect={handleProductSelect}
          multiSelect={true}
          title="Kampanya Ürünleri"
          height="400px"
          restrictCampaignType="free-product"
          excludeProductIds={formData.productIds}
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
}
