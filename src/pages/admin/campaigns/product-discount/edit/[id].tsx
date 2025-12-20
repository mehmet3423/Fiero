import CampaignFormWrapper from "@/components/admin/campaigns/CampaignFormWrapper";
import ProductSelector from "@/components/ProductSelector";
import { DiscountType } from "@/constants/enums/DiscountType";
import { ProductDiscount } from "@/constants/models/Discount";
import { useUpdateProductDiscount } from "@/hooks/services/discounts/product-discount/useUpdateProductDiscount";
import { useGetDiscountById } from "@/hooks/services/discounts/useGetDiscountById";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

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
  isActive: boolean;
  type: DiscountType;
  isWithinActiveDateRange: boolean;
}

export default function EditProductDiscount() {
  const router = useRouter();
  const { id } = router.query;
  const { updateDiscount, isPending: isUpdating } = useUpdateProductDiscount();
  const { discount, isLoading: discountLoading } = useGetDiscountById(
    id as string
  );

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
    isActive: true,
    type: DiscountType.Product,
    isWithinActiveDateRange: false,
  });

  useEffect(() => {
    if (discount) {
      setFormData({
        name: discount.name || "",
        nameEn: (discount as any).nameEn || "",
        description: discount.description || "",
        discountValue: discount.discountValue || 0,
        discountValueType:
          typeof discount.discountValueType === "string"
            ? parseInt(discount.discountValueType, 10)
            : discount.discountValueType,
        maxDiscountValue: discount.maxDiscountValue || 0,
        startDate: discount.startDate || "",
        endDate: discount.endDate || "",
        isActive: discount.isActive ?? true,
        type: DiscountType.Product,
        isWithinActiveDateRange:
          (discount as any).productDiscount?.isWithinActiveDateRange ??
          discount.isWithinActiveDateRange ??
          false,
        productId: (discount as any).productDiscount?.productId || "",
      });
    }
  }, [discount]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const apiData: ProductDiscount = {
        id: String(id),
        ...formData,
        productName: "",
        createdOn: Date.now(),
        createdOnValue: new Date().toISOString(),
      };
      // Son kontrol: discountValueType'ı number'a çevir
      if (typeof apiData.discountValueType === "string") {
        apiData.discountValueType = parseInt(apiData.discountValueType, 10);
      }

      await updateDiscount(apiData);
      router.push("/admin/campaigns/product-discount");
    } catch (error) { }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    const numberFields = ["discountValueType", "day", "month", "discountValue"];
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

  if (discountLoading) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <CampaignFormWrapper
      campaignType="product-discount"
      campaignTypeLabel="Ürün İndirimleri"
      action="edit"
      name={formData.name}
      nameEn={formData.nameEn}
      description={formData.description}
      startDate={formData.startDate}
      endDate={formData.endDate}
      isActive={formData.isActive}
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
      onSubmit={handleSubmit}
      isSubmitting={isUpdating}
      submitDisabled={!formData.productId}
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
            value={Number(formData.discountValueType)}
            onChange={handleChange}
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
        onProductSelect={(productId) => {
          setFormData((prev) => ({ ...prev, productId }));
        }}
        multiSelect={false}
        title="Ürün Seçimi"
        height="300px"
      />
    </CampaignFormWrapper>
  );
}
