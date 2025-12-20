import CampaignFormWrapper from "@/components/admin/campaigns/CampaignFormWrapper";
import { DiscountType } from "@/constants/enums/DiscountType";
import { useUpdateCartDiscount } from "@/hooks/services/discounts/cart-discount/useUpdateCartDiscount";
import { useGetDiscountById } from "@/hooks/services/discounts/useGetDiscountById";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

interface CartDiscountForm {
  name: string;
  nameEn: string;
  description: string;
  discountValue: number;
  discountValueType: number;
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
}

export default function EditCartDiscount() {
  const router = useRouter();
  const { id } = router.query;
  const { updateDiscount, isPending: isUpdating } = useUpdateCartDiscount();
  const { discount, isLoading: discountLoading } = useGetDiscountById(
    id as string
  );

  // Helper function to format date for datetime-local input
  const formatDateForInput = (dateString: string): string => {
    if (!dateString) return "";
    // Remove seconds and milliseconds if present (datetime-local expects YYYY-MM-DDTHH:mm)
    return dateString.slice(0, 16);
  };

  const [formData, setFormData] = useState<CartDiscountForm>({
    name: "",
    nameEn: "",
    description: "",
    discountValue: 0,
    discountValueType: 1,
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
  });

  useEffect(() => {
    if (discount) {
      setFormData({
        name: discount.name || "",
        nameEn: (discount as any).nameEn || "",
        description: discount.description || "",
        discountValue: discount.discountValue || 0,
        discountValueType: discount.discountValueType || 1,
        maxDiscountValue: discount.maxDiscountValue || 0,
        startDate: formatDateForInput(discount.startDate || ""),
        endDate: formatDateForInput(discount.endDate || ""),
        isActive: discount.isActive || true,
        type: DiscountType.Cart,
        isWithinActiveDateRange: false,
        minimumCartAmount:
          (discount as any).cartDiscount?.minimumCartAmount || 0,
        maximumCartAmount:
          (discount as any).cartDiscount?.maximumCartAmount || 0,
        minimumCartProductCount:
          (discount as any).cartDiscount?.minimumCartProductCount || 0,
        maximumCartProductCount:
          (discount as any).cartDiscount?.maximumCartProductCount || 0,
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
      });
      router.push("/admin/campaigns/cart-discount");
    } catch (error) { }
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
            name === "discountValue" ||
            name === "minimumCartAmount" ||
            name === "maximumCartAmount" ||
            name === "minimumCartProductCount" ||
            name === "maximumCartProductCount"
            ? Number(value)
            : value,
    }));
  };

  if (discountLoading) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <CampaignFormWrapper
      campaignType="cart-discount"
      campaignTypeLabel="Sepet İndirimleri"
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
            required
            onWheel={(e) => (e.target as HTMLInputElement).blur()}
          />
        </div>
      </div>

      {/* Sepet koşulları */}
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
            required
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
}
