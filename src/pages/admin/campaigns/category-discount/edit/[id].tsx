import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useUpdateSubcategoryDiscount } from "@/hooks/services/discounts/subcategory-discount/useUpdateSubcategoryDiscount";
import { DiscountType } from "@/constants/enums/DiscountType";
import { useGetDiscountById } from "@/hooks/services/discounts/useGetDiscountById";
import { useCategories } from "@/hooks/services/categories/useCategories";
import CampaignFormWrapper from "@/components/admin/campaigns/CampaignFormWrapper";
import { NotificationSettings as NotificationSettingsType } from "@/constants/models/Notification";

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
      (categories as any)?.items?.$values?.find(
        (c: any) => c.id === formData.categoryId
      );

    if (!category) return [];

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
      const subCategoryId = discount.subCategoryDiscount?.subCategoryId || "";

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
        isActive: discount.isActive ?? true,
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
        createdOn: Date.now(),
        createdOnValue: new Date().toISOString(),
        subCategoryId: formData.subCategoryId,
        subCategory: {} as any, // Backend'den gelen response'da bu property yok
      });
      router.push("/admin/campaigns/category-discount");
    } catch (error) {}
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    // Ana kategori değiştiğinde alt kategoriyi sıfırla
    if (name === "categoryId") {
      setFormData((prev) => ({
        ...prev,
        categoryId: value,
        subCategoryId: "",
      }));
      return;
    }

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

  if (discountLoading) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <CampaignFormWrapper
      campaignType="category-discount"
      campaignTypeLabel="Kategori İndirimleri"
      action="edit"
      name={formData.name}
      description={formData.description}
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
      submitDisabled={!formData.subCategoryId}
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

      {/* Kategori ve Alt Kategori Seçimi */}
      <div className="row mb-3">
        <div className="col-md-6">
          <label className="form-label">Ana Kategori *</label>
          <select
            className="form-select"
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            required
          >
            <option value="">Kategori Seçin</option>
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
        <div className="col-md-6">
          <label className="form-label">Alt Kategori *</label>
          <select
            className="form-select"
            name="subCategoryId"
            value={formData.subCategoryId}
            onChange={handleChange}
            required
            disabled={!formData.categoryId}
          >
            <option value="">Alt Kategori Seçin</option>
            {filteredSubCategories.map((subCategory: any) => (
              <option key={subCategory.id} value={subCategory.id}>
                {subCategory.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </CampaignFormWrapper>
  );
}
