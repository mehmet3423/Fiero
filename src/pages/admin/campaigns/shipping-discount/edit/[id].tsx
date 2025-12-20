import { DiscountType } from "@/constants/enums/DiscountType";
import { Discount, ShippingDiscount } from "@/constants/models/Discount";
import { useGetDiscountById } from "@/hooks/services/discounts/useGetDiscountById";
import { useUpdateShippingDiscount } from "@/hooks/services/discounts/shipping-discount/useUpdateShippingDiscount";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import CampaignFormWrapper from "@/components/admin/campaigns/CampaignFormWrapper";
import { NotificationSettings as NotificationSettingsType } from "@/constants/models/Notification";

function EditShippingDiscount() {
  const router = useRouter();
  const { id } = router.query;

  const { updateDiscount, isPending: isUpdating } = useUpdateShippingDiscount();

  const { discount, isLoading: isLoadingDiscount } = useGetDiscountById(
    id as string
  );

  const [formData, setFormData] = useState<
    Discount & {
      minimumCargoAmount: number;
    }
  >({
    name: "",
    description: "",
    discountValue: 0,
    discountValueType: 1,
    maxDiscountValue: 0,
    startDate: "",
    endDate: "",
    isActive: true,
    type: DiscountType.ShippingDiscount,
    isWithinActiveDateRange: false,
    id: "",
    createdOn: 0,
    createdOnValue: "",
    minimumCargoAmount: 0,
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
        maxDiscountValue: discount.maxDiscountValue || 0,
        startDate: discount.startDate,
        endDate: discount.endDate,
        isActive: discount.isActive,
        type: discount.type,
        isWithinActiveDateRange: discount.isWithinActiveDateRange || false,
        minimumCargoAmount:
          (discount as any).cargoDiscount?.minimumCargoAmount || 0,
      });
    }
  }, [discount]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const shippingDiscountData: ShippingDiscount = {
        id: formData.id,
        name: formData.name,
        description: formData.description,
        discountValue: formData.discountValue,
        discountValueType: formData.discountValueType,
        maxDiscountValue: formData.maxDiscountValue,
        startDate: formData.startDate,
        endDate: formData.endDate,
        isActive: formData.isActive,
        type: formData.type,
        isWithinActiveDateRange: formData.isWithinActiveDateRange,
        createdOn: formData.createdOn,
        createdOnValue: formData.createdOnValue,
        minimumCargoAmount: formData.minimumCargoAmount,
      };

      await updateDiscount(shippingDiscountData);
      router.push("/admin/campaigns/shipping-discount");
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
    return <div>Yükleniyor...</div>;
  }

  return (
    <CampaignFormWrapper
      campaignType="shipping-discount"
      campaignTypeLabel="Kargo İndirimleri"
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
      {/* İndirim Değer ve Tip Ayarları */}
      <div className="row mb-3">
        <div className="col-md-6">
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
        <div className="col-md-6">
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
      </div>

      {/* Minimum Sipariş Tutarı */}
      <div className="row mb-3">
        <div className="col-md-12">
          <label className="form-label">MİNİMUM SİPARİŞ TUTARI *</label>
          <input
            type="number"
            className="form-control"
            name="minimumCargoAmount"
            value={formData.minimumCargoAmount}
            onChange={handleChange}
            min={0}
            onWheel={(e) => (e.target as HTMLInputElement).blur()}
            required
          />
        </div>
      </div>
    </CampaignFormWrapper>
  );
}

export default EditShippingDiscount;
