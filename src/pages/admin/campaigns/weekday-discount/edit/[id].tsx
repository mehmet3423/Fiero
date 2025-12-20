import CampaignFormWrapper from "@/components/admin/campaigns/CampaignFormWrapper";
import { DiscountType } from "@/constants/enums/DiscountType";
import { useGetDiscountById } from "@/hooks/services/discounts/useGetDiscountById";
import { useUpdateWeekdayDiscount } from "@/hooks/services/discounts/weekday-dicount/useUpdateWeekdayDiscount";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

interface WeekdayDiscountForm {
  name: string;
  nameEn: string;
  description: string;
  discountValue: number;
  discountValueType: number;
  maxDiscountValue: number;
  startDate: string;
  endDate: string;
  dayOfWeek: number;
  isActive: boolean;
  type: DiscountType;
  isWithinActiveDateRange: boolean;
}

export default function EditWeekdayDiscount() {
  const router = useRouter();
  const { id } = router.query;
  const { updateDiscount, isPending: isUpdating } = useUpdateWeekdayDiscount();
  const { discount, isLoading: discountLoading } = useGetDiscountById(
    id as string
  );

  const [formData, setFormData] = useState<WeekdayDiscountForm>({
    name: "",
    nameEn: "",
    description: "",
    discountValue: 0,
    discountValueType: 1,
    maxDiscountValue: 0,
    startDate: "",
    endDate: "",
    dayOfWeek: 1,
    isActive: true,
    type: DiscountType.WeekdayDiscount,
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
        startDate: discount.startDate || "",
        endDate: discount.endDate || "",
        isActive: discount.isActive ?? true,
        type: DiscountType.WeekdayDiscount,
        isWithinActiveDateRange: false,
        dayOfWeek: discount.weekdayDiscount?.dayOfWeek ?? 1,
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
      router.push("/admin/campaigns/weekday-discount");
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
          : name === "discountValueType" || name === "dayOfWeek"
            ? Number(value)
            : type === "number"
              ? parseFloat(value)
              : value,
    }));
  };

  if (discountLoading) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <CampaignFormWrapper
      campaignType="weekday-discount"
      campaignTypeLabel="Haftanın Günü İndirimleri"
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
      {/* İndirim Değerleri */}
      <div className="row mb-3">
        <div className="col-md-4">
          <label className="form-label">İndirim Değeri *</label>
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
          <label className="form-label">İndirim Tipi *</label>
          <select
            className="form-select"
            name="discountValueType"
            value={formData.discountValueType}
            onChange={handleChange}
            required
          >
            <option value="1">Yüzde (%)</option>
            <option value="2">Tutar (₺)</option>
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

      {/* Haftanın Günü */}
      <div className="row mb-3">
        <div className="col-md-12">
          <label className="form-label">Haftanın Günü *</label>
          <select
            className="form-select"
            name="dayOfWeek"
            value={formData.dayOfWeek}
            onChange={handleChange}
            required
          >
            <option value={1}>Pazartesi</option>
            <option value={2}>Salı</option>
            <option value={3}>Çarşamba</option>
            <option value={4}>Perşembe</option>
            <option value={5}>Cuma</option>
            <option value={6}>Cumartesi</option>
            <option value={0}>Pazar</option>
          </select>
        </div>
      </div>
    </CampaignFormWrapper>
  );
}
