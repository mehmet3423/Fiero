import { DiscountType } from "@/constants/enums/DiscountType";
import { DiscountValueType } from "@/constants/enums/DiscountValueType";
import { CouponDiscount } from "@/constants/models/Discount";
import { useUpdateCouponDiscount } from "@/hooks/services/discounts/coupon-discount/useUpdateCouponDiscount";
import { useGetDiscountById } from "@/hooks/services/discounts/useGetDiscountById";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

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
        discountValueType: DiscountValueType.Percentage,
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
      console.log(formData);
      await updateDiscount(formData as CouponDiscount);
      router.push("/admin/campaigns/coupon-discount");
    } catch (error) {
      console.error("Error saving discount:", error);
    }
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
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold py-3 mb-4">
            <span className="text-muted fw-light">
              <Link
                href="/admin/campaigns"
                className="text-muted fw-light hover:text-primary"
              >
                Kampanyalar
              </Link>{" "}
              /{" "}
              <Link
                href="/admin/campaigns/coupon-discount"
                className="text-muted fw-light hover:text-primary"
              >
                Kupon İndirimleri
              </Link>{" "}
              /
            </span>{" "}
            İndirim Düzenle
          </h4>
          <Link
            href="/admin/campaigns/coupon-discount"
            className="btn btn-outline-secondary"
            style={{
              backgroundColor: "#e9e9e9",
              color: "#000",
              borderColor: "#d9d9d9",
            }}
          >
            <i className="bx bx-arrow-back me-1"></i>
            Geri
          </Link>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">İndirim Adı *</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Kupon indirimi adı"
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">İndirim Açıklaması</label>
                <input
                  type="text"
                  className="form-control"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="İndirim açıklaması (isteğe bağlı)"
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-4 mb-3">
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
                  placeholder="İndirim değeri"
                />
              </div>
              <div className="col-md-4 mb-3">
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
              <div className="col-md-4 mb-3">
                <label className="form-label">Maksimum İndirim Değeri</label>
                <input
                  type="number"
                  className="form-control"
                  name="maxDiscountValue"
                  value={formData.maxDiscountValue}
                  onChange={handleChange}
                  required
                  placeholder="Maksimum indirim değeri"
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Kupon Kodu</label>
                <input
                  type="text"
                  className="form-control"
                  name="couponCode"
                  value={formData.couponCode}
                  onChange={handleChange}
                  required
                  placeholder="Kupon kodu"
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Kullanım Limit</label>
                <input
                  type="number"
                  className="form-control"
                  name="maxUsageCount"
                  value={formData.maxUsageCount}
                  onChange={handleChange}
                  required
                  placeholder="Kullanım limiti"
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Başlangıç Tarihi *</label>
                <input
                  type="datetime-local"
                  className="form-control"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Bitiş Tarihi *</label>
                <input
                  type="datetime-local"
                  className="form-control"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="row mb-4">
              <div className="col-md-6">
                <label className="form-label">Durum</label>
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input form-check-input-sm"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    style={{ transform: "scale(0.7)" }}
                  />
                  <label
                    className="form-check-label"
                    style={{ fontSize: "0.875rem" }}
                  >
                    İndirim aktif
                  </label>
                </div>
              </div>
            </div>

            <div className="d-flex gap-3">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Güncelleniyor...
                  </>
                ) : (
                  "İndirim Güncelle"
                )}
              </button>
              <Link
                href="/admin/campaigns/coupon-discount"
                className="btn btn-outline-secondary"
              >
                İptal
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditCouponDiscount;
