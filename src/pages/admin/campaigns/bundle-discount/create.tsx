import { useState } from "react";
import { useRouter } from "next/router";
import { useCreateBundleDiscount } from "@/hooks/services/discounts/bundle-discount/useCreateBundleDiscount";
import { DiscountType } from "@/constants/enums/DiscountType";
import Link from "next/link";
import ProductSelector from "@/components/ProductSelector";

const CreateBundleDiscountPage = () => {
  const router = useRouter();
  const { createBundleDiscount, isPending } = useCreateBundleDiscount();
  const [totalOriginalPrice, setTotalOriginalPrice] = useState(0);

  const [formData, setFormData] = useState({
    productIds: [] as string[],
    bundlePrice: 0,
    name: "",
    description: "",
    discountValue: 0,
    maxDiscountValue: 0,
    discountValueType: 0,
    startDate: "",
    endDate: "",
    isActive: true,
    type: DiscountType.Bundle,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createBundleDiscount(formData);
      router.push("/admin/campaigns/bundle-discount");
    } catch (error) {
      console.error("Error creating bundle discount:", error);
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

  const handleProductSelect = (productId: string) => {
    setFormData((prev) => ({
      ...prev,
      productIds: prev.productIds.includes(productId)
        ? prev.productIds.filter((id) => id !== productId)
        : [...prev.productIds, productId],
    }));
  };

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
                href="/admin/campaigns/bundle-discount"
                className="text-muted fw-light hover:text-primary"
              >
                Bundle İndirimleri
              </Link>{" "}
              /
            </span>{" "}
            Yeni İndirim
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
            {/* Temel bilgiler */}
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Paket İndirim Adı</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Açıklama</label>
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
              title="Ürünler"
              height="400px"
              onTotalPriceChange={setTotalOriginalPrice}
              discountType="bundle"
            />

            {/* İndirim detayları */}
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Paket Fiyatı</label>
                <input
                  type="number"
                  className="form-control"
                  name="bundlePrice"
                  value={formData.bundlePrice}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
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
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>

            {/* Tarih aralığı */}
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Başlangıç Tarihi</label>
                <input
                  type="datetime-local"
                  className="form-control"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  min={new Date().toISOString().slice(0, 16)}
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Bitiş Tarihi</label>
                <input
                  type="datetime-local"
                  className="form-control"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  min={
                    formData.startDate || new Date().toISOString().slice(0, 16)
                  }
                  required
                />
              </div>
            </div>

            {/* Durum */}
            <div className="form-check mb-3">
              <input
                type="checkbox"
                className="form-check-input"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
              />
              <label className="form-check-label">
                {formData.isActive ? "Aktif" : "Pasif"}
              </label>
            </div>

            <button
              type="submit"
              className={`btn ${
                isPending || formData.productIds.length < 2
                  ? "btn-light text-muted"
                  : "btn-primary"
              }`}
              disabled={isPending || formData.productIds.length < 2}
              style={{
                filter:
                  isPending || formData.productIds.length < 2
                    ? "grayscale(50%)"
                    : "none",
                opacity: isPending || formData.productIds.length < 2 ? 0.7 : 1,
              }}
            >
              {isPending ? "Kaydediliyor..." : "Kaydet"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateBundleDiscountPage;
