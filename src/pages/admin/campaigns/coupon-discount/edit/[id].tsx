import { DiscountType } from "@/constants/enums/DiscountType";
import { DiscountValueType } from "@/constants/enums/DiscountValueType";
import { CouponDiscount } from "@/constants/models/Discount";
import { useUpdateCouponDiscount } from "@/hooks/services/discounts/coupon-discount/useUpdateCouponDiscount";
import { useGetDiscountById } from "@/hooks/services/discounts/useGetDiscountById";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import CampaignFormWrapper from "@/components/admin/campaigns/CampaignFormWrapper";
import { NotificationSettings as NotificationSettingsType } from "@/constants/models/Notification";

function EditCouponDiscount() {
  const router = useRouter();
  const { id } = router.query;

  const { updateDiscount, isPending: isUpdating } = useUpdateCouponDiscount();

  const { discount, isLoading: isLoadingDiscount } = useGetDiscountById(
    id as string
  );

  const [formData, setFormData] = useState<CouponDiscount>({
    name: "",
    description: "",
    discountValue: 0,
    discountValueType: DiscountValueType.Percentage,
    startDate: "",
    endDate: "",
    isActive: true,
    type: DiscountType.Coupon,
    isWithinActiveDateRange: false,
    id: "",
    createdOn: 0,
    createdOnValue: "",
    couponCode: "",
    maxUsageCount: 0,
    maxDiscountValue: 0,
  });

  useEffect(() => {
    if (discount) {
      setFormData({
        id: discount.id,
        createdOn: discount.createdOn,
        createdOnValue: discount.createdOnValue,
        name: discount.name,
        description: discount.description || "",
        discountValue: discount.discountValue,
        discountValueType: discount.discountValueType,
        startDate: discount.startDate,
        endDate: discount.endDate,
        isActive: discount.isActive,
        type: discount.type,
        isWithinActiveDateRange: discount.isWithinActiveDateRange || false,
        couponCode: discount.couponDiscount?.couponCode || "",
        maxUsageCount: discount.couponDiscount?.maxUsageCount || 0,
        maxDiscountValue: discount.maxDiscountValue || 0,
      });
    }
  }, [discount]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateDiscount(formData as CouponDiscount);
      router.push("/admin/campaigns/coupon-discount");
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

  if (isLoadingDiscount) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "400px" }}
      >
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Yükleniyor...</span>
        </div>
      </div>
    );
  }

  return (
    <CampaignFormWrapper
      campaignType="coupon-discount"
      campaignTypeLabel="Kupon İndirimleri"
      action="edit"
      name={formData.name}
      description={formData.description || ""}
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
    >
      {/* İndirim Değerleri */}
      <div className="row mb-3">
        <div className="col-md-4">
          <label className="form-label">İndirim Tipi *</label>
          <select
            className="form-select"
            name="discountValueType"
            value={formData.discountValueType}
            onChange={handleChange}
            required
          >
            <option value={DiscountValueType.Percentage}>Yüzde (%)</option>
            <option value={2}>Tutar (₺)</option>
          </select>
        </div>
        <div className="col-md-4">
          <label className="form-label">İndirim Değeri *</label>
          <input
            type="number"
            className="form-control"
            name="discountValue"
            value={formData.discountValue}
            onChange={handleChange}
            min={0}
            step="0.01"
            required
            placeholder="Örn: 10"
            onWheel={(e) => (e.target as HTMLInputElement).blur()}
          />
        </div>
        <div className="col-md-4">
          <label className="form-label">Maksimum İndirim Tutarı</label>
          <input
            type="number"
            className="form-control"
            name="maxDiscountValue"
            value={formData.maxDiscountValue}
            onChange={handleChange}
            min={0}
            step="0.01"
            placeholder="Opsiyonel"
            onWheel={(e) => (e.target as HTMLInputElement).blur()}
          />
          <small className="text-muted">
            Yüzde indirimlerde maksimum indirim tutarı
          </small>
        </div>
      </div>

      {/* Kupon Bilgileri */}
      <div className="row mb-3">
        <div className="col-md-6">
          <label className="form-label">Kupon Kodu *</label>
          <input
            type="text"
            className="form-control text-uppercase"
            name="couponCode"
            value={formData.couponCode}
            onChange={handleChange}
            required
            placeholder="Örn: SUMMER2024"
            style={{ textTransform: "uppercase" }}
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Maksimum Kullanım Sayısı</label>
          <input
            type="number"
            className="form-control"
            name="maxUsageCount"
            value={formData.maxUsageCount}
            onChange={handleChange}
            min={0}
            placeholder="0 = Sınırsız"
            onWheel={(e) => (e.target as HTMLInputElement).blur()}
          />
        </div>
      </div>
    </CampaignFormWrapper>
  );
}

export default EditCouponDiscount;
