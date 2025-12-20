import { useState } from "react";
import { useRouter } from "next/router";
import { useSubCategories } from "@/hooks/services/categories/useSubCategories";
import { useCreateSubCategoryDiscount } from "@/hooks/services/discounts/subcategory-discount/useCreateSubCategoryDiscount";
import { useCategories } from "@/hooks/services/categories/useCategories";
import { DiscountType } from "@/constants/enums/DiscountType";
import { SubCategory } from "@/constants/models/Category";
import { useGetDiscountList } from "@/hooks/services/discounts/useGetDiscountList";
import CampaignFormWrapper from "@/components/admin/campaigns/CampaignFormWrapper";
import { NotificationSettings as NotificationSettingsType } from "@/constants/models/Notification";

interface CreateSubCategoryDiscountForm {
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
  subCategory: SubCategory;
  isWithinActiveDateRange: boolean;
  notificationSettings: NotificationSettingsType;
}

const CreateSubCategoryDiscountPage = () => {
  const router = useRouter();
  const [selectedMainCategoryId, setSelectedMainCategoryId] = useState("");
  const { categories, isLoading: categoriesLoading } = useCategories();

  const { data: subCategories, isLoading: subCategoriesLoading } =
    useSubCategories(selectedMainCategoryId);
  const { createSubCategoryDiscount, isPending } =
    useCreateSubCategoryDiscount();

  // Alt kategori indirimlerini getir
  const { discounts: subCategoryDiscounts } = useGetDiscountList({
    page: 0,
    pageSize: 100, // Tüm alt kategori indirimlerini getir
    discountType: DiscountType.SubCategory,
    isActive: true, // Sadece aktif indirimleri kontrol et
  });

  const [categoryWithDiscountWarning, setCategoryWithDiscountWarning] =
    useState<{
      show: boolean;
      categoryName: string;
    }>({ show: false, categoryName: "" });

  const [formData, setFormData] = useState<CreateSubCategoryDiscountForm>({
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
    subCategory: {} as SubCategory,
    isWithinActiveDateRange: false,
    notificationSettings: {
      isEmailNotificationEnabled: false,
      emailNotificationSubject: "",
      emailNotificationTextBody: "",
      emailNotificationHtmlBody: "",
      isSMSNotificationEnabled: false,
      smsNotificationSubject: "",
      smsNotificationTextBody: "",
      smsNotificationHtmlBody: "",
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createSubCategoryDiscount(formData);
      router.push("/admin/campaigns/category-discount");
    } catch (error) {}
  };

  // Alt kategori indirim kontrolü için gerçek API kontrolü
  const checkCategoryHasDiscount = (
    categoryId: string
  ): { hasDiscount: boolean; categoryName: string } => {
    const selectedCategory = Array.isArray(subCategories)
      ? subCategories.find((cat) => cat.id === categoryId)
      : undefined;

    // Alt kategori indirimlerinde bu categoryId'ye sahip aktif indirim var mı kontrol et
    const hasActiveDiscount = subCategoryDiscounts?.some(
      (discount: any) =>
        discount.subCategoryDiscount?.subCategoryId === categoryId &&
        discount.isActive &&
        discount.isWithinActiveDateRange
    );

    return {
      hasDiscount: hasActiveDiscount || false,
      categoryName: selectedCategory?.name || "",
    };
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (name === "mainCategoryId") {
      setSelectedMainCategoryId(value);
      setFormData((prev) => ({ ...prev, subCategoryId: "" }));
      setCategoryWithDiscountWarning({ show: false, categoryName: "" });
    } else if (name === "subCategoryId") {
      // Alt kategori seçildiğinde indirim kontrolü yap
      if (value) {
        const discountCheck = checkCategoryHasDiscount(value);
        setCategoryWithDiscountWarning({
          show: discountCheck.hasDiscount,
          categoryName: discountCheck.categoryName,
        });
      } else {
        setCategoryWithDiscountWarning({ show: false, categoryName: "" });
      }

      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]:
          type === "checkbox"
            ? (e.target as HTMLInputElement).checked
            : type === "number"
            ? parseFloat(value)
            : value,
      }));
    }
  };

  const handleNotificationSettingsChange = (
    notificationSettings: NotificationSettingsType
  ) => {
    setFormData((prev) => ({
      ...prev,
      notificationSettings,
    }));
  };

  return (
    <CampaignFormWrapper
      campaignType="category-discount"
      campaignTypeLabel="Alt Kategori İndirimleri"
      action="create"
      name={formData.name}
      description={formData.description}
      startDate={formData.startDate}
      endDate={formData.endDate}
      isActive={formData.isActive}
      notificationSettings={formData.notificationSettings}
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
      onNotificationSettingsChange={handleNotificationSettingsChange}
      onSubmit={handleSubmit}
      isSubmitting={isPending}
      submitDisabled={!formData.subCategoryId}
      submitButtonText={
        categoryWithDiscountWarning.show
          ? "Mevcut İndirimi Değiştir ve Kaydet"
          : "Kaydet"
      }
      submitButtonVariant={
        categoryWithDiscountWarning.show ? "warning" : "primary"
      }
    >
      {/* İndirim Değerleri */}
      <div className="row mb-3">
        <div className="col-md-4">
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
        <div className="col-md-4">
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
        <div className="col-md-4">
          <label className="form-label">Maksimum İndirim Değeri</label>
          <input
            type="number"
            className="form-control"
            name="maxDiscountValue"
            value={formData.maxDiscountValue}
            onChange={handleChange}
            min={0}
            required
            onWheel={(e) => (e.target as HTMLInputElement).blur()}
          />
        </div>
      </div>

      {/* Kategori Seçimi */}
      <div className="row mb-3">
        <div className="col-md-6">
          <label className="form-label">Ana Kategori</label>
          <select
            className="form-select"
            name="mainCategoryId"
            value={selectedMainCategoryId}
            onChange={handleChange}
            required
          >
            <option value="">Ana Kategori Seçin</option>
            {categories?.items?.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-6">
          <label className="form-label">Alt Kategori</label>
          <select
            className="form-select"
            name="subCategoryId"
            value={formData.subCategoryId}
            onChange={handleChange}
            required
            disabled={!selectedMainCategoryId || subCategoriesLoading}
          >
            <option value="">Alt Kategori Seçin</option>
            {Array.isArray(subCategories) &&
              subCategories.map((subCategory) => (
                <option key={subCategory.id} value={subCategory.id}>
                  {subCategory.name}
                </option>
              ))}
          </select>
        </div>
      </div>

      {/* Uyarı Mesajı */}
      {categoryWithDiscountWarning.show && (
        <div className="alert d-flex align-items-center mb-3" role="alert">
          <i
            className="bx bx-error-circle me-2"
            style={{
              fontSize: "1.5rem",
              color: "red",
            }}
          ></i>
          <div>
            <small className="text-dark">
              <strong>{categoryWithDiscountWarning.categoryName}</strong>{" "}
              kategorisinin aktif indirimi mevcut. Yeni indirim eklediğinizde,
              mevcut indirim otomatik olarak kaldırılacak ve yerine yeni indirim
              uygulanacaktır.
            </small>
          </div>
        </div>
      )}
    </CampaignFormWrapper>
  );
};

export default CreateSubCategoryDiscountPage;
