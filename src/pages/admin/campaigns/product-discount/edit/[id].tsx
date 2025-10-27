import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useUpdateProductDiscount } from "@/hooks/services/discounts/product-discount/useUpdateProductDiscount";
import { DiscountType } from "@/constants/enums/DiscountType";
import { useGetDiscountById } from "@/hooks/services/discounts/useGetDiscountById";
import ProductSelector from "@/components/ProductSelector";
import { DiscountValueType } from "@/constants/enums/DiscountValueType";
import { ProductDiscount } from "@/constants/models/Discount";

interface ProductDiscountForm {
  name: string;
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
    } catch (error) {
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    const numberFields = [
      "discountValueType",
      "day",
      "month",
      "discountValue",
    ];
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
                href="/admin/campaigns/product-discount"
                className="text-muted fw-light hover:text-primary"
              >
                Ürün İndirimleri
              </Link>{" "}
              /
            </span>{" "}
            İndirim Düzenle
          </h4>
          <Link
            href="/admin/campaigns/product-discount"
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
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  required
                />
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label">İndirim Tipi</label>
                <select
                  className="form-select"
                  name="discountValueType"
                  value={Number(formData.discountValueType)}
                  onChange={(e) => { handleChange(e); }}
                  required
                >
                  <option value={1}>Yüzde (%)</option>
                  <option value={2}>Tutar (₺)</option>
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
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  required
                />
              </div>
            </div>

            <ProductSelector
              selectedProductIds={
                formData.productId ? [formData.productId] : []
              }
              onProductSelect={(productId) => {
                setFormData((prev) => ({ ...prev, productId }));
              }}
              multiSelect={false}
              title="Ürün Seçimi"
              height="300px"
            />

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
              <div className="col-md-12 mb-3">
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
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
