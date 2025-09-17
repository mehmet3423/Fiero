import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useUpdateBundleDiscount } from "@/hooks/services/discounts/bundle-discount/useUpdateBundleDiscount";
import { DiscountType } from "@/constants/enums/DiscountType";
import { useGetDiscountById } from "@/hooks/services/discounts/useGetDiscountById";
import ProductSelector from "@/components/ProductSelector";

interface BundleDiscountForm {
  name: string;
  description: string;
  discountValue: number;
  discountValueType: number;
  maxDiscountValue: number;
  startDate: string;
  endDate: string;
  productIds: string[];
  isActive: boolean;
  type: DiscountType;
  isWithinActiveDateRange: boolean;
  bundlePrice: number;
}

export default function EditBundleDiscount() {
  const router = useRouter();
  const { id } = router.query;
  const { updateDiscount, isPending: isUpdating } = useUpdateBundleDiscount();
  const { discount, isLoading: discountLoading } = useGetDiscountById(
    id as string
  );
  const [totalOriginalPrice, setTotalOriginalPrice] = useState(0);

  const [formData, setFormData] = useState<BundleDiscountForm>({
    name: "",
    description: "",
    discountValue: 0,
    discountValueType: 1,
    maxDiscountValue: 0,
    startDate: "",
    endDate: "",
    productIds: [],
    isActive: true,
    type: DiscountType.Bundle,
    bundlePrice: 0,
    isWithinActiveDateRange: false,
  });

  useEffect(() => {
    if (discount) {
      // API'den gelen bundleDiscountProducts array'inden productId'leri çıkar
      // İki farklı yapıyı kontrol et: direct bundleDiscountProducts veya bundleDiscount.bundleDiscountProducts
      const productIds =
        (discount as any).bundleDiscountProducts?.map(
          (product: any) => product.productId
        ) ||
        (discount as any).bundleDiscount?.bundleDiscountProducts?.map(
          (product: any) => product.productId
        ) ||
        [];

      setFormData({
        name: discount.name || "",
        description: discount.description || "",
        discountValue: discount.discountValue || 0,
        discountValueType: discount.discountValueType || 0,
        maxDiscountValue: discount.maxDiscountValue || 0,
        startDate: discount.startDate || "",
        endDate: discount.endDate || "",
        isActive: discount.isActive ?? true,
        type: DiscountType.Bundle,
        isWithinActiveDateRange: false,
        productIds: productIds,
        bundlePrice:
          (discount as any).bundlePrice ||
          (discount as any).bundleDiscount?.bundlePrice ||
          0,
      });
    }
  }, [discount]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateDiscount({
        id: id as string,
        ...formData,
        bundlePrice: formData.bundlePrice || 0,
        productIds: formData.productIds,
        createdOn: Date.now(),
        createdOnValue: new Date().toISOString(),
        bundleDiscountId: id as string,
      });
      router.push("/admin/campaigns/bundle-discount");
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
          : name === "discountValue"
          ? Number(value)
          : name === "bundlePrice"
          ? Number(value)
          : value,
    }));
  };

  const handleProductSelect = (productId: string) => {
    setFormData((prev) => ({
      ...prev,
      productIds: prev.productIds.includes(productId)
        ? prev.productIds.filter((id) => id !== productId)
        : [...prev.productIds, productId],
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
                href="/admin/campaigns/bundle-discount"
                className="text-muted fw-light hover:text-primary"
              >
                Bundle İndirimleri
              </Link>{" "}
              /
            </span>{" "}
            İndirim Düzenle
          </h4>
          <Link
            href="/admin/campaigns/bundle-discount"
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

            {/* Ürün seçimi */}
            <ProductSelector
              selectedProductIds={formData.productIds}
              onProductSelect={handleProductSelect}
              multiSelect={true}
              title="Ürün Seçimi"
              height="400px"
              onTotalPriceChange={setTotalOriginalPrice}
            />

            {/* Bundle Price */}
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Paket Fiyatı</label>
                <input
                  type="number"
                  className="form-control"
                  name="bundlePrice"
                  value={formData.bundlePrice}
                  onChange={handleChange}
                  min={0}
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  required
                />
                {formData.bundlePrice > 0 && totalOriginalPrice > 0 && (
                  <small className="text-muted d-block mt-1">
                    Toplam indirim: %
                    {(
                      ((totalOriginalPrice - formData.bundlePrice) /
                        totalOriginalPrice) *
                      100
                    ).toFixed(2)}
                  </small>
                )}
              </div>
              <div className="col-md-6">
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
