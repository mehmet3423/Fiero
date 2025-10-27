import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useUpdateBuyXPayYDiscount } from "@/hooks/services/discounts/buyX-payY/useUpdateBuyXPayYDiscount";
import { useGetDiscountById } from "@/hooks/services/discounts/useGetDiscountById";
import { DiscountType } from "@/constants/enums/DiscountType";
import { DiscountValueType } from "@/constants/enums/DiscountValueType";
import Link from "next/link";
import ProductSelector from "@/components/ProductSelector";
import { BuyYPayXDiscount } from "@/constants/models/Discount";

const EditBuyXPayYDiscountPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { updateDiscount, isPending } = useUpdateBuyXPayYDiscount();
  const { discount, isLoading: discountLoading } = useGetDiscountById(
    id && id !== "undefined" ? (id as string) : ""
  );

  const [formData, setFormData] = useState({
    buyXPayYProducts: [] as string[],
    name: "",
    description: "",
    discountValue: 0,
    discountValueType: DiscountValueType.FixedAmount,
    maxDiscountValue: 0,
    startDate: "",
    endDate: "",
    isActive: true,
    buyXCount: 0,
    payYCount: 0,
    isRepeatable: false,
    maxFreeProductPerOrder: 0,
    type: DiscountType.BuyXPayY,
  });

  useEffect(() => {
    if (discount) {
      const buyXPayYDiscount = (discount as any).buyXPayYDiscount || discount;

      const formattedStartDate = discount.startDate
        ? new Date(discount.startDate).toISOString().slice(0, 16)
        : "";
      const formattedEndDate = discount.endDate
        ? new Date(discount.endDate).toISOString().slice(0, 16)
        : "";

      const newFormData = {
        buyXPayYProducts:
          buyXPayYDiscount.buyXPayYProducts?.map(
            (item: any) => item.productId
          ) || [],
        name: discount.name || "",
        description: discount.description || "",
        discountValue: discount.discountValue || 0,
        discountValueType:
          discount.discountValueType || DiscountValueType.FixedAmount,
        maxDiscountValue: discount.maxDiscountValue || 0,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        isActive: discount.isActive !== undefined ? discount.isActive : true,
        buyXCount: buyXPayYDiscount.buyXCount || 0,
        payYCount: buyXPayYDiscount.payYCount || 0,
        isRepeatable: buyXPayYDiscount.isRepeatable || false,
        maxFreeProductPerOrder: buyXPayYDiscount.maxFreeProductPerOrder || 0,
        type: DiscountType.BuyXPayY,
      };

      setFormData(newFormData);
    }
  }, [discount]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id || id === "undefined") {
      return;
    }

    try {
      // Format dates to remove seconds (keep only YYYY-MM-DDTHH:MM format)
      const formattedData = {
        ...formData,
        startDate: formData.startDate ? formData.startDate.slice(0, 16) : "",
        endDate: formData.endDate ? formData.endDate.slice(0, 16) : "",
      };

      await updateDiscount({
        id: id as string,
        ...formattedData,
      } as unknown as BuyYPayXDiscount);
      router.push("/admin/campaigns/buyX-payY");
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
          : type === "number"
            ? parseFloat(value) || 0
            : value,
    }));
  };

  const handleProductSelect = (productId: string) => {
    setFormData((prev) => ({
      ...prev,
      buyXPayYProducts: prev.buyXPayYProducts.includes(productId)
        ? prev.buyXPayYProducts.filter((id) => id !== productId)
        : [...prev.buyXPayYProducts, productId],
    }));
  };

  if (discountLoading) {
    return (
      <div className="container-fluid">
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: "400px" }}
        >
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Yükleniyor...</span>
          </div>
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
                href="/admin/campaigns/buyX-payY"
                className="text-muted fw-light hover:text-primary"
              >
                Al X Öde Y İndirimleri
              </Link>{" "}
              /
            </span>{" "}
            İndirim Düzenle
          </h4>
          <Link
            href="/admin/campaigns/buyX-payY"
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
            {/* İndirim Temel Bilgileri */}
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">İndirim Adı</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Örn: 3 Al 2 Öde Kampanyası"
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
                  placeholder="İndirim açıklaması"
                />
              </div>
            </div>

            {/* BuyX-PayY Özellikleri */}
            <div className="row mb-3">
              <div className="col-md-3">
                <label className="form-label">Alınan Adet (X)</label>
                <input
                  type="number"
                  className="form-control"
                  name="buyXCount"
                  value={formData.buyXCount}
                  onChange={handleChange}
                  min={1}
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  required
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">Ödenen Adet (Y)</label>
                <input
                  type="number"
                  className="form-control"
                  name="payYCount"
                  value={formData.payYCount}
                  onChange={handleChange}
                  min={1}
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  required
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">Maksimum İndirim Değeri</label>
                <input
                  type="number"
                  className="form-control"
                  name="maxDiscountValue"
                  value={formData.maxDiscountValue}
                  onChange={handleChange}
                  min={1}
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">
                  Sipariş Başına Maksimum Ücretsiz Ürün
                </label>
                <input
                  type="number"
                  className="form-control"
                  name="maxFreeProductPerOrder"
                  value={formData.maxFreeProductPerOrder}
                  onChange={handleChange}
                  min={1}
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                />
              </div>
            </div>

            {/* Ürün seçimi */}
            <div className="mb-3">
              <ProductSelector
                selectedProductIds={formData.buyXPayYProducts}
                onProductSelect={handleProductSelect}
                multiSelect={true}
                title="Kampanya Ürünleri"
                height="400px"
              />
            </div>

            {/* Tarih aralığı */}
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Başlangıç Tarihi</label>
                <input
                  type="datetime-local"
                  className="form-control"
                  name="startDate"
                  value={
                    formData.startDate ? formData.startDate.slice(0, 16) : ""
                  }
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Bitiş Tarihi</label>
                <input
                  type="datetime-local"
                  className="form-control"
                  name="endDate"
                  value={formData.endDate ? formData.endDate.slice(0, 16) : ""}
                  onChange={handleChange}
                  min={
                    formData.startDate
                      ? formData.startDate.slice(0, 16)
                      : new Date().toISOString().slice(0, 16)
                  }
                  required
                />
              </div>
            </div>

            {/* Durum ayarları */}
            <div className="row mb-4">
              <div className="col-md-6">
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    style={{ cursor: "pointer" }}
                  />
                  <label className="form-check-label">İndirim aktif</label>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    name="isRepeatable"
                    checked={formData.isRepeatable}
                    style={{ cursor: "pointer" }}
                    onChange={handleChange}
                  />
                  <label className="form-check-label">Tekrarlanabilir</label>
                </div>
              </div>
            </div>

            {/* Submit buttons */}
            <div className="d-flex gap-2">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isPending}
              >
                {isPending ? "Güncelleniyor..." : "İndirim Güncelle"}
              </button>
              <Link
                href="/admin/campaigns/buyX-payY"
                className="btn btn-secondary"
              >
                İptal
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditBuyXPayYDiscountPage;
