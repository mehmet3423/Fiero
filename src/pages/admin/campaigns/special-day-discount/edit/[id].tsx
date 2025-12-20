import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useUpdateSpecialDayDiscount } from "@/hooks/services/discounts/specialDay-discount/useUpdateSpecialDayDiscount";
import { DiscountType } from "@/constants/enums/DiscountType";
import { useGetDiscountById } from "@/hooks/services/discounts/useGetDiscountById";
import CampaignFormWrapper from "@/components/admin/campaigns/CampaignFormWrapper";
import { NotificationSettings as NotificationSettingsType } from "@/constants/models/Notification";

interface SpecialDayDiscountForm {
  name: string;
  description: string;
  discountValue: number;
  discountValueType: number;
  maxDiscountValue: number;
  startDate: string;
  endDate: string;
  day: number;
  month: number;
  isActive: boolean;
  type: DiscountType;
  isWithinActiveDateRange: boolean;
}

export default function EditSpecialDayDiscount() {
  const router = useRouter();
  const { id } = router.query;
  const { updateDiscount, isPending: isUpdating } =
    useUpdateSpecialDayDiscount();
  const { discount, isLoading: discountLoading } = useGetDiscountById(
    id as string
  );

  const [formData, setFormData] = useState<SpecialDayDiscountForm>({
    name: "",
    description: "",
    discountValue: 0,
    discountValueType: 1,
    maxDiscountValue: 0,
    startDate: "",
    endDate: "",
    day: 1,
    month: 1,
    isActive: true,
    type: DiscountType.SpecialDayDiscount,
    isWithinActiveDateRange: false,
  });

  useEffect(() => {
    if (discount) {
      setFormData({
        name: discount.name || "",
        description: discount.description || "",
        discountValue: discount.discountValue || 0,
        discountValueType: discount.discountValueType || 1,
        maxDiscountValue: discount.maxDiscountValue || 0,
        startDate: discount.startDate || "",
        endDate: discount.endDate || "",
        isActive: discount.isActive ?? true,
        type: DiscountType.SpecialDayDiscount,
        isWithinActiveDateRange: false,
        day: (discount as any).specialDayDiscount?.day || 1,
        month: (discount as any).specialDayDiscount?.month || 1,
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
      router.push("/admin/campaigns/special-day-discount");
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
          : name === "discountValueType" || name === "day" || name === "month"
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
      campaignType="special-day-discount"
      campaignTypeLabel="Özel Gün İndirimleri"
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

      {/* Özel Gün */}
      <div className="row mb-3">
        <div className="col-md-6">
          <label className="form-label">Gün *</label>
          <input
            type="number"
            className="form-control"
            name="day"
            value={formData.day}
            onChange={handleChange}
            min={1}
            max={31}
            required
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Ay *</label>
          <select
            className="form-select"
            name="month"
            value={formData.month}
            onChange={handleChange}
            required
          >
            <option value={1}>Ocak</option>
            <option value={2}>Şubat</option>
            <option value={3}>Mart</option>
            <option value={4}>Nisan</option>
            <option value={5}>Mayıs</option>
            <option value={6}>Haziran</option>
            <option value={7}>Temmuz</option>
            <option value={8}>Ağustos</option>
            <option value={9}>Eylül</option>
            <option value={10}>Ekim</option>
            <option value={11}>Kasım</option>
            <option value={12}>Aralık</option>
          </select>
        </div>
      </div>
    </CampaignFormWrapper>
  );
}
