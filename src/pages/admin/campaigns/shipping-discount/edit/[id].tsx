import { DiscountType } from "@/constants/enums/DiscountType";
import { Discount, ShippingDiscount } from "@/constants/models/Discount";
import { useGetDiscountById } from "@/hooks/services/discounts/useGetDiscountById";
import { useUpdateShippingDiscount } from "@/hooks/services/discounts/shipping-discount/useUpdateShippingDiscount";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

function EditShippingDiscount() {
  const router = useRouter();
  const { id } = router.query;

  const { updateDiscount, isPending: isUpdating } = useUpdateShippingDiscount();

  const { discount, isLoading: isLoadingDiscount } = useGetDiscountById(
    id as string
  );

  const [formData, setFormData] = useState<
    Discount & { minimumCargoAmount: number }
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
    } catch (error) {
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
                href="/admin/campaigns/shipping-discount"
                className="text-muted fw-light hover:text-primary"
              >
                Kargo İndirimleri
              </Link>{" "}
              /
            </span>{" "}
            İndirim Düzenle
          </h4>
          <Link
            href="/admin/campaigns/shipping-discount"
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
                  placeholder="Kargo indirimi adı"
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
              <div className="col-md-3 mb-3">
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
                  placeholder="İndirim değeri"
                />
              </div>
              <div className="col-md-3 mb-3">
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
              <div className="col-md-3 mb-3">
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
                  placeholder="Maksimum indirim değeri"
                />
              </div>
              <div className="col-md-3 mb-3">
                <label className="form-label">Minimum Sepet Tutarı *</label>
                <input
                  type="number"
                  className="form-control"
                  name="minimumCargoAmount"
                  value={formData.minimumCargoAmount}
                  onChange={handleChange}
                  min={0}
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  required
                  placeholder="Minimum sepet tutarı"
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
                href="/admin/campaigns/shipping-discount"
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

export default EditShippingDiscount;
