import CampaignFormWrapper from "@/components/admin/campaigns/CampaignFormWrapper";
import { DiscountType } from "@/constants/enums/DiscountType";
import { useUpdateBirthdayDiscount } from "@/hooks/services/discounts/birthday-discount/useUpdateBirthdayDiscount";
import { useGetDiscountById } from "@/hooks/services/discounts/useGetDiscountById";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

interface BirthdayDiscountForm {
  name: string;
  nameEn: string;
  description: string;
  discountValue: number;
  discountValueType: number;
  maxDiscountValue: number;
  startDate: string;
  endDate: string;
  validityDays: number;
  isActive: boolean;
  type: DiscountType;
  isWithinActiveDateRange: boolean;
}

export default function EditBirthdayDiscount() {
  const router = useRouter();
  const { id } = router.query;
  const { updateDiscount, isPending: isUpdating } = useUpdateBirthdayDiscount();
  const { discount, isLoading: discountLoading } = useGetDiscountById(
    id as string
  );

  const [formData, setFormData] = useState<BirthdayDiscountForm>({
    name: "",
    nameEn: "",
    description: "",
    discountValue: 0,
    discountValueType: 1,
    maxDiscountValue: 0,
    startDate: "",
    endDate: "",
    validityDays: 7,
    isActive: true,
    type: DiscountType.BirthdayDiscount,
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
        type: DiscountType.BirthdayDiscount,
        isWithinActiveDateRange: false,
        validityDays: discount.birthdayDiscount?.validDaysBefore || 7,
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
        validDaysBefore: formData.validityDays,
        validDaysAfter: formData.validityDays,
      });
      router.push("/admin/campaigns/birthday-discount");
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
          : name === "discountValueType" || name === "validityDays"
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
      campaignType="birthday-discount"
      campaignTypeLabel="Doğum Günü İndirimleri"
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

      {/* Geçerlilik Süresi */}
      <div className="row mb-3">
        <div className="col-md-12">
          <label className="form-label">Geçerlilik Süresi (Gün) *</label>
          <input
            type="number"
            className="form-control"
            name="validityDays"
            value={formData.validityDays}
            onChange={handleChange}
            min={1}
            required
            onWheel={(e) => (e.target as HTMLInputElement).blur()}
          />
          <small className="text-muted">
            Doğum gününden kaç gün önce ve sonra geçerli olacak
          </small>
        </div>
      </div>
    </CampaignFormWrapper>
  );
}
