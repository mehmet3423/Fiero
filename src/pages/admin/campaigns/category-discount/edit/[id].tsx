import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useUpdateSubcategoryDiscount } from "@/hooks/services/discounts/subcategory-discount/useUpdateSubcategoryDiscount";
import { DiscountType } from "@/constants/enums/DiscountType";
import { useGetDiscountById } from "@/hooks/services/discounts/useGetDiscountById";
import { useGetDiscountList } from "@/hooks/services/discounts/useGetDiscountList";
import { useSubCategories } from "@/hooks/services/categories/useSubCategories";
import { useCategories } from "@/hooks/services/categories/useCategories";
interface SubCategoryDiscountForm {
  name: string;
  description: string;
  discountValue: number;
  discountValueType: number;
  maxDiscountValue: number;
  startDate: string;
  endDate: string;
  subCategoryId: string;
  isActive: boolean;
  type: DiscountType;
  isWithinActiveDateRange: boolean;
  categoryId: string;
}

export default function EditCategoryDiscount() {
  const router = useRouter();
  const { id } = router.query;

  const [formData, setFormData] = useState<SubCategoryDiscountForm>({
    name: "",
    description: "",
    discountValue: 0,
    discountValueType: 1,
    maxDiscountValue: 0,
    startDate: "",
    endDate: "",
    subCategoryId: "",
    isActive: true,
    type: DiscountType.SubCategory,
    isWithinActiveDateRange: false,
    categoryId: "",
  });

  const { categories } = useCategories();

  const { updateDiscount, isPending: isUpdating } =
    useUpdateSubcategoryDiscount();
  const { discount, isLoading: discountLoading } = useGetDiscountById(
    id as string
  );

  // Seçilen kategoriye göre alt kategorileri filtrele
  const filteredSubCategories = (() => {
    const category =
      (categories as any)?.items?.find(
        (c: any) => c.id === formData.categoryId
      ) ??
      // Geriye dönük uyumluluk – $values kullanan eski response yapısı
      (categories as any)?.items?.$values?.find(
        (c: any) => c.id === formData.categoryId
      );

    if (!category) return [];

    // subCategories hem dizi hem de { $values: [] } şeklinde gelebilir
    if (Array.isArray(category.subCategories)) {
      return category.subCategories;
    }

    if ((category.subCategories as any)?.$values) {
      return (category.subCategories as any).$values;
    }

    return [];
  })();
  useEffect(() => {
    if (discount && categories) {
      const subCategoryId =
        (discount as any).subCategoryDiscount?.subCategoryId || "";

      // Alt kategori ID'sinden ana kategori ID'sini bul
      let categoryId = "";
      const categoryArray =
        (categories as any)?.items ?? (categories as any)?.items?.$values ?? [];

      (categoryArray as any[]).forEach((category: any) => {
        const subs = Array.isArray(category.subCategories)
          ? category.subCategories
          : (category.subCategories as any)?.$values ?? [];
        const foundSubCategory = subs.find(
          (sub: any) => sub.id === subCategoryId
        );
        if (foundSubCategory) {
          categoryId = category.id;
        }
      });

      setFormData({
        name: discount.name || "",
        description: discount.description || "",
        discountValue: discount.discountValue || 0,
        discountValueType: discount.discountValueType || 1,
        maxDiscountValue: discount.maxDiscountValue || 0,
        startDate: discount.startDate || "",
        endDate: discount.endDate || "",
        isActive: discount.isActive || true,
        type: DiscountType.SubCategory,
        isWithinActiveDateRange: false,
        subCategoryId: subCategoryId,
        categoryId: categoryId,
      });
    }
  }, [discount, categories]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateDiscount({
        id: id as string,
        ...formData,
        subCategoryId: formData.subCategoryId,
        createdOn: Date.now(),
        createdOnValue: new Date().toISOString(),
        subCategory: {
          id: formData.subCategoryId,
          $id: "",
          name: "",
          products: [],
          displayIndex: 0,
        },
      });
      router.push("/admin/campaigns/category-discount");
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
          : name === "discountValueType" || name === "discountValue"
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
                href="/admin/campaigns/category-discount"
                className="text-muted fw-light hover:text-primary"
              >
                Kategori İndirimleri
              </Link>{" "}
              /
            </span>{" "}
            İndirim Düzenle
          </h4>
          <Link
            href="/admin/campaigns/category-discount"
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
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
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
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Başlangıç Tarihi</label>
                <input
                  type="datetime-local"
                  style={{ cursor: "pointer" }}
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
                  style={{ cursor: "pointer" }}
                  className="form-control"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Ana Kategori</label>
                <select
                  className="form-select"
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      categoryId: e.target.value,
                      subCategoryId: "", // Ana kategori değiştiğinde alt kategoriyi sıfırla
                    });
                  }}
                  required
                >
                  <option value="">Ana Kategori Seçin</option>
                  {(
                    (categories as any)?.items ??
                    (categories as any)?.items?.$values ??
                    []
                  ).map((category: any) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Alt Kategori</label>
                <select
                  className="form-select"
                  name="subCategoryId"
                  value={formData.subCategoryId}
                  onChange={(e) => {
                    setFormData({ ...formData, subCategoryId: e.target.value });
                  }}
                  required
                  disabled={!formData.categoryId}
                >
                  <option value="">Alt Kategori Seçin</option>
                  {filteredSubCategories?.map((subCategory: any) => (
                    <option key={subCategory.id} value={subCategory.id}>
                      {subCategory.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="row">
              <div className="col-md-12 mb-3" style={{ fontSize: "16px" }}>
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
              <Link
                href="/admin/campaigns/category-discount"
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
