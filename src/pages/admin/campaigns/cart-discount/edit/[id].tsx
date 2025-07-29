import { DiscountType } from "@/constants/enums/DiscountType";
import { useUpdateCartDiscount } from "@/hooks/services/discounts/cart-discount/useUpdateCartDiscount";
import { useGetDiscountById } from "@/hooks/services/discounts/useGetDiscountById";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

interface CartDiscountForm {
  name: string;
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

  const [formData, setFormData] = useState<CartDiscountForm>({
    name: "",
    description: "",
    discountValue: 0,
    discountValueType: 0,
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
        description: discount.description || "",
        discountValue: discount.discountValue || 0,
        discountValueType: discount.discountValueType || 0,
        maxDiscountValue: discount.maxDiscountValue || 0,
        startDate: discount.startDate || "",
        endDate: discount.endDate || "",
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
    } catch (error) {
      console.error("Error updating discount:", error);
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
    <div>
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
                href="/admin/campaigns/cart-discount"
                className="text-muted fw-light hover:text-primary"
              >
                Sepet İndirimleri
              </Link>{" "}
              /
            </span>{" "}
            İndirim Düzenle
          </h4>
          <Link
            href="/admin/campaigns/cart-discount"
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
                <label className="form-label">İndirim Adı</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
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
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-4 mb-3">
                <label className="form-label">İndirim Değeri</label>
                <input
                  type="number"
                  className="form-control"
                  name="discountValue"
                  value={formData.discountValue}
                  onChange={handleChange}
                  min={0}
                  required
                />
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label">İndirim Tipi</label>
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
                  min={0}
                  required
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-3 mb-3">
                <label className="form-label">Minimum Sepet Tutarı</label>
                <input
                  type="number"
                  className="form-control"
                  name="minimumCartAmount"
                  value={formData.minimumCartAmount}
                  onChange={handleChange}
                  min={0}
                />
              </div>
              <div className="col-md-3 mb-3">
                <label className="form-label">Maximum Sepet Tutarı</label>
                <input
                  type="number"
                  className="form-control"
                  name="maximumCartAmount"
                  value={formData.maximumCartAmount}
                  onChange={handleChange}
                  min={0}
                />
              </div>
              <div className="col-md-3 mb-3">
                <label className="form-label">Minimum Ürün Sayısı</label>
                <input
                  type="number"
                  className="form-control"
                  name="minimumCartProductCount"
                  value={formData.minimumCartProductCount}
                  onChange={handleChange}
                  min={0}
                  required
                />
              </div>
              <div className="col-md-3 mb-3">
                <label className="form-label">Maximum Ürün Sayısı</label>
                <input
                  type="number"
                  className="form-control"
                  name="maximumCartProductCount"
                  value={formData.maximumCartProductCount}
                  onChange={handleChange}
                  min={0}
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Başlangıç Tarihi</label>
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
                <label className="form-label">Bitiş Tarihi</label>
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

            <div className="row">
              <div className="col-md-12 mb-3 " style={{ fontSize: "16px" }}>
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    style={{ cursor: "pointer" }}
                    type="checkbox"
                    id="isActive"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor="isActive">
                    Aktif
                  </label>
                </div>
              </div>
            </div>

            <div className="d-flex gap-2">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isUpdating}
              >
                {isUpdating ? "Kaydediliyor..." : "Kaydet"}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => router.back()}
              >
                İptal
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
