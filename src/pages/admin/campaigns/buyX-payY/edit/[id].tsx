import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useUpdateBuyXPayYDiscount } from "@/hooks/services/discounts/buyX-payY/useUpdateBuyXPayYDiscount";
import { DiscountType } from "@/constants/enums/DiscountType";
import { useGetDiscountById } from "@/hooks/services/discounts/useGetDiscountById";
import ProductSelector from "@/components/ProductSelector";
import CampaignFormWrapper from "@/components/admin/campaigns/CampaignFormWrapper";
import { NotificationSettings as NotificationSettingsType } from "@/constants/models/Notification";

interface BuyXPayYDiscountForm {
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
  buyXCount: number;
  payYCount: number;
  maxFreeProductPerOrder: number;
  isRepeatable: boolean;
}

export default function EditBuyXPayYDiscount() {
  const router = useRouter();
  const { id } = router.query;
  const { updateDiscount, isPending: isUpdating } = useUpdateBuyXPayYDiscount();
  const { discount, isLoading: discountLoading } = useGetDiscountById(
    id as string
  );

  const [formData, setFormData] = useState<BuyXPayYDiscountForm>({
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
    type: DiscountType.BuyXPayY,
    isWithinActiveDateRange: false,
    buyXCount: 0,
    payYCount: 0,
    maxFreeProductPerOrder: 0,
    isRepeatable: false,
  });

  useEffect(() => {
    if (discount) {
      // buyXPayYProducts, buyXPayYDiscount object'inin içinde!
      const buyXPayYProducts = (discount as any).buyXPayYDiscount?.buyXPayYProducts || [];

      const productIds = buyXPayYProducts.map((product: any) => {
        return product.productId || product.id;
      });

      // Seçili ürünlerin tam detaylarını extract et
      const selectedProductsData = buyXPayYProducts
        .map((item: any) => {
          // Eğer product object'i varsa onu kullan
          if (item.product) {
            return item.product;
          }
          // Yoksa sadece ID ile minimal bir object oluştur
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
        type: DiscountType.BuyXPayY,
        isWithinActiveDateRange: false,
        productIds: productIds,
        selectedProductsData: selectedProductsData,
        buyXCount: (discount as any).buyXPayYDiscount?.buyXCount || 0,
        payYCount: (discount as any).buyXPayYDiscount?.payYCount || 0,
        maxFreeProductPerOrder:
          (discount as any).buyXPayYDiscount?.maxRepeatPerOrder || 0,
        isRepeatable: (discount as any).buyXPayYDiscount?.isRepeatable || false,
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
        isRepeatable: formData.isRepeatable,
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
          : name === "discountValueType" ||
            name === "buyXCount" ||
            name === "payYCount" ||
            name === "maxFreeProductPerOrder"
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
      campaignType="buyX-payY"
      campaignTypeLabel="X Al Y Öde İndirimleri"
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
      <ProductSelector
        selectedProductIds={formData.productIds}
        selectedProductsData={formData.selectedProductsData}
        onProductSelect={handleProductSelect}
        multiSelect={true}
        title="Ürün Seçimi"
        height="300px"
        restrictCampaignType="buyX-payY"
        excludeProductIds={formData.productIds}
      />
    </CampaignFormWrapper>
  );
}
