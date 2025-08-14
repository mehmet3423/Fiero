import GeneralModal from "@/components/shared/GeneralModal";
import {
  CreateCollectionRequest,
  CollectionItem,
} from "@/constants/models/Affiliate";
import { useCreateAffiliateCollection } from "@/hooks/services/affiliate/useCreateAffiliateCollection";
import { useGetAllProducts } from "@/hooks/services/products/useGetAllProducts";
import { useCategories } from "@/hooks/services/categories/useCategories";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { AffiliateCollectionType } from "@/constants/enums/affiliate/AffiliateApplicationStatus";
import { useLanguage } from "@/context/LanguageContext";

interface CreateCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  affiliateUserId: string;
}



// Data Factory Functions
const createCollectionItems = (
  type: AffiliateCollectionType,
  productIds: string[],
  mainCategoryIds: string[],
  subCategoryIds: string[]
): CollectionItem[] => {
  switch (type) {
    case AffiliateCollectionType.Product:
    case AffiliateCollectionType.Combination:
    case AffiliateCollectionType.Collection:
      return productIds.map((id) => ({ productId: id }));
    case AffiliateCollectionType.Category:
      return [
        ...mainCategoryIds.map((id) => ({ mainCategoryId: id })),
        ...subCategoryIds.map((id) => ({ subCategoryId: id })),
      ];
    default:
      return [];
  }
};

const createRequestData = (
  formData: {
    name: string;
    description: string;
    affiliateUserId: string;
    url: string;
  },
  startDate: string,
  expirationDate: string,
  collectionItems: CollectionItem[]
): CreateCollectionRequest => ({
  name: formData.name,
  description: formData.description,
  affiliateUserId: formData.affiliateUserId,
  url: formData.url,
  startDate,
  expirationDate,
  collectionItems,
});

const resetFormState = (
  affiliateUserId: string,
  setFormData: (data: any) => void,
  setSelectedProductIds: (ids: string[]) => void,
  setSearchTerm: (term: string) => void,
  setSelectedMainCategoryIds: (ids: string[]) => void,
  setSelectedSubCategoryIds: (ids: string[]) => void,
  setExpandedMainCategories: (categories: Set<string>) => void,
  setStartDate: (date: string) => void,
  setExpirationDate: (date: string) => void,
  setCollectionType: (type: AffiliateCollectionType) => void
) => {
  setFormData({
    name: "",
    description: "",
    affiliateUserId: affiliateUserId,
    url: "https://fiero.happencode.com/",
  });
  setSelectedProductIds([]);
  setSearchTerm("");
  setSelectedMainCategoryIds([]);
  setSelectedSubCategoryIds([]);
  setExpandedMainCategories(new Set());
  setStartDate("");
  setExpirationDate("");
  setCollectionType(AffiliateCollectionType.Product);
};

const CreateCollectionModal: React.FC<CreateCollectionModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  affiliateUserId,
}) => {
  const { t } = useLanguage();
  const { createCollection, isPending } = useCreateAffiliateCollection();
  const { data: productsData, isLoading: productsLoading } = useGetAllProducts({
    pageSize: 100,
  });
  const { categories, isLoading: categoriesLoading } = useCategories();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    affiliateUserId: affiliateUserId,
    url: "https://fiero.happencode.com/",
  });
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [collectionType, setCollectionType] = useState<AffiliateCollectionType>(
    AffiliateCollectionType.Product
  );

  // Category-based states
  const [selectedMainCategoryIds, setSelectedMainCategoryIds] = useState<
    string[]
  >([]);
  const [selectedSubCategoryIds, setSelectedSubCategoryIds] = useState<
    string[]
  >([]);
  const [expandedMainCategories, setExpandedMainCategories] = useState<
    Set<string>
  >(new Set());
  const [startDate, setStartDate] = useState<string>("");
  const [expirationDate, setExpirationDate] = useState<string>("");
  // Validation Functions
  const validateBasicFields = (name: string, description: string): boolean => {
    
    if (!name.trim()) {
      toast.error(t("affiliateCollections.validationNameRequired"));
      return false;
    }
    if (!description.trim()) {
      toast.error(t("affiliateCollections.validationDescriptionRequired"));
      return false;
    }
    return true;
  };

  const validateDates = (startDate: string, expirationDate: string): boolean => {
    
    if (!startDate) {
      toast.error(t("affiliateCollections.validationStartDateRequired"));
      return false;
    }
    if (!expirationDate) {
      toast.error(t("affiliateCollections.validationEndDateRequired"));
      return false;
    }
    if (new Date(startDate) >= new Date(expirationDate)) {
      toast.error(t("affiliateCollections.validationEndDateAfterStartDate"));
      return false;
    }
    return true;
  };

  const validateSelections = (
    type: AffiliateCollectionType,
    productIds: string[],
    mainCategoryIds: string[],
    subCategoryIds: string[]
  ): boolean => {
    const { t } = useLanguage();
    switch (type) {
      case AffiliateCollectionType.Product:
      case AffiliateCollectionType.Combination:
      case AffiliateCollectionType.Collection:
        if (productIds.length === 0) {
          toast.error(t("affiliateCollections.validationAtLeastOneProduct"));
          return false;
        }
        break;
      case AffiliateCollectionType.Category:
        if (mainCategoryIds.length === 0 && subCategoryIds.length === 0) {
          toast.error(t("affiliateCollections.validationAtLeastOneCategory"));
          return false;
        }
        break;
    }
    return true;
  };

  useEffect(() => {
    if (isOpen) {
      $("#createCollectionModal").modal("show");
    } else {
      $("#createCollectionModal").modal("hide");
    }

    // Modal kapatılma olaylarını dinle
    const handleModalHide = () => {
      onClose();
    };

    $("#createCollectionModal").on("hidden.bs.modal", handleModalHide);

    // Cleanup
    return () => {
      $("#createCollectionModal").off("hidden.bs.modal", handleModalHide);
    };
  }, [isOpen, onClose]);

  // Koleksiyon türü değiştiğinde seçili ürünleri temizle
  useEffect(() => {
    setSelectedProductIds([]);
    setSearchTerm("");
    setSelectedMainCategoryIds([]);
    setSelectedSubCategoryIds([]);
    setExpandedMainCategories(new Set());
    setStartDate("");
    setExpirationDate("");
  }, [collectionType]);

  const handleSubmit = async () => {
    if (!validateBasicFields(formData.name, formData.description)) {
      return;
    }

    if (!validateDates(startDate, expirationDate)) {
      return;
    }

    if (
      !validateSelections(
        collectionType,
        selectedProductIds,
        selectedMainCategoryIds,
        selectedSubCategoryIds
      )
    ) {
      return;
    }

    try {
      const collectionItems = createCollectionItems(
        collectionType,
        selectedProductIds,
        selectedMainCategoryIds,
        selectedSubCategoryIds
      );
      const collectionData = createRequestData(
        formData,
        startDate,
        expirationDate,
        collectionItems
      );

      await createCollection(collectionData, collectionType);

      // Reset form
      resetFormState(
        affiliateUserId,
        setFormData,
        setSelectedProductIds,
        setSearchTerm,
        setSelectedMainCategoryIds,
        setSelectedSubCategoryIds,
        setExpandedMainCategories,
        setStartDate,
        setExpirationDate,
        setCollectionType
      );

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Error creating collection:", error);
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleProductToggle = (productId: string) => {
    setSelectedProductIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleMainCategoryToggle = (categoryId: string) => {
    setSelectedMainCategoryIds((prev) => {
      const isCurrentlySelected = prev.includes(categoryId);

      if (isCurrentlySelected) {
        // Ana kategori seçimi kaldırılıyor
        return prev.filter((id) => id !== categoryId);
      } else {
        // Ana kategori seçiliyor - bu kategorinin alt kategorilerini seçimden kaldır
        const mainCategory = categories?.items?.find(
          (cat) => cat.id === categoryId
        );
        if (mainCategory && mainCategory.subCategories) {
          const subCategoryIds = mainCategory.subCategories.map(
            (sub) => sub.id
          );
          setSelectedSubCategoryIds((prevSub) =>
            prevSub.filter((subId) => !subCategoryIds.includes(subId))
          );
        }

        return [...prev, categoryId];
      }
    });
  };

  const handleSubCategoryToggle = (subCategoryId: string) => {
    setSelectedSubCategoryIds((prev) =>
      prev.includes(subCategoryId)
        ? prev.filter((id) => id !== subCategoryId)
        : [...prev, subCategoryId]
    );
  };

  const handleMainCategoryExpand = (categoryId: string) => {
    setExpandedMainCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const filteredProducts =
    productsData?.items?.filter((product) =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  return (
    <GeneralModal
      id="createCollectionModal"
      title={t("affiliateCollections.createCollectionTitle")}
      showFooter={true}
      approveButtonText={isPending ? t("affiliateCollections.createCollectionLoading") : t("affiliateCollections.createCollectionApproveButton")}
      approveButtonClassName="btn-dark"
      isLoading={isPending}
      onApprove={handleSubmit}
      onClose={onClose}
      size="lg"
    >
      <div className="row">
        <div className="col-md-6">
          <div>
            <label className="form-label">
              {t("affiliateCollections.collectionTypeLabel")} <span className="text-danger">*</span>
            </label>
            <select
              className="form-select border border-light shadow-none"
              style={{
                backgroundColor: "white",
                color: "#040404",
              }}
              value={collectionType}
              onChange={(e) =>
                setCollectionType(
                  Number(e.target.value) as AffiliateCollectionType
                )
              }
            >
              <option value={AffiliateCollectionType.Product}>
                {t("affiliateCollections.productBased")}
              </option>
              <option value={AffiliateCollectionType.Collection}>
                {t("affiliateCollections.collectionBased")}
              </option>
              <option value={AffiliateCollectionType.Combination}>
                {t("affiliateCollections.combinationBased")}
              </option>
              <option value={AffiliateCollectionType.Category}>
                {t("affiliateCollections.categoryBased")}
              </option>
            </select>
          </div>
        </div>
        <div className="col-md-6">
          <div>
            <label className="form-label">
              {t("affiliateCollections.collectionNameLabel")} <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className="form-control shadow-none border border-light"
              placeholder={t("affiliateCollections.collectionNamePlaceholder")}
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              maxLength={100}
            />
          </div>
        </div>
      </div>

      <div>
        <label className="form-label">
          {t("affiliateCollections.collectionDescriptionLabel")} <span className="text-danger">*</span>
        </label>
        <textarea
          className="form-control shadow-none border border-light"
          rows={3}
          placeholder={t("affiliateCollections.collectionDescriptionPlaceholder")}
          value={formData.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
          maxLength={500}
        />
      </div>

      {(collectionType === AffiliateCollectionType.Product ||
        collectionType === AffiliateCollectionType.Combination ||
        collectionType === AffiliateCollectionType.Collection) && (
          <div>
            <label className="form-label">
              {t("affiliateCollections.productsLabel")} <span className="text-danger">*</span>
            </label>

            {/* Tarih Seçim Alanları - Ürün Bazlı için */}
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">
                  {t("affiliateCollections.startDateLabel")} <span className="text-danger">*</span>
                </label>
                <input
                  type="datetime-local"
                  className="form-control shadow-none"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  min={new Date().toISOString().slice(0, 16)}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">
                  {t("affiliateCollections.endDateLabel")} <span className="text-danger">*</span>
                </label>
                <input
                  type="datetime-local"
                  className="form-control shadow-none"
                  value={expirationDate}
                  onChange={(e) => setExpirationDate(e.target.value)}
                  min={startDate || new Date().toISOString().slice(0, 16)}
                />
              </div>
            </div>

            <div>
              <input
                type="text"
                className="form-control shadow-none"
                placeholder={t("affiliateCollections.productsPlaceholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {productsLoading ? (
              <div className="text-center py-3">
                <div className="spinner-border spinner-border-sm" role="status">
                  <span className="sr-only">{t("loading")}</span>
                </div>
              </div>
            ) : (
              <div
                className="products-list"
                style={{
                  maxHeight: "300px",
                  overflowY: "auto",
                  border: "1px solid #dee2e6",
                  borderRadius: "0.375rem",
                  padding: "0.5rem",
                }}
              >
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className="form-check d-flex align-items-center p-2 border-bottom"
                    >
                      <input
                        className="form-check-input me-3 border-2"
                        type="checkbox"
                        id={`product-${product.id}`}
                        checked={selectedProductIds.includes(product.id)}
                        onChange={() => handleProductToggle(product.id)}
                        style={{
                          width: "20px",
                          height: "20px",
                          borderColor: selectedProductIds.includes(product.id) ? "#212529" : "#dee2e6",
                          backgroundColor: selectedProductIds.includes(product.id) ? "#212529" : "#ffffff",
                        }}
                      />
                      <div className="d-flex align-items-center flex-grow-1">
                        <img
                          src={product.baseImageUrl || "/placeholder-image.jpg"}
                          alt={product.title}
                          style={{
                            width: "40px",
                            height: "40px",
                            objectFit: "cover",
                            borderRadius: "4px",
                            marginRight: "0.75rem",
                            marginLeft: "10px",
                          }}
                        />
                        <div>
                          <label
                            className="form-check-label fw-medium"
                            htmlFor={`product-${product.id}`}
                            style={{ cursor: "pointer" }}
                          >
                            {product.title}
                          </label>
                          <div className="text-muted small">
                            {product.price?.toFixed(2)} ₺
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-3 text-muted">
                    {searchTerm
                      ? t("affiliateCollections.noProductsMatchSearch")
                      : t("affiliateCollections.noProductsFound")}
                  </div>
                )}
              </div>
            )}

            <small className="text-muted mt-2 d-block">
              {t("affiliateCollections.selectedProductsCount")}: {selectedProductIds.length}
            </small>
          </div>
        )}

      {collectionType === AffiliateCollectionType.Category && (
        <div>
          <label className="form-label">
            {t("affiliateCollections.categoriesLabel")} <span className="text-danger">*</span>
          </label>

          {/* Tarih Seçim Alanları */}
          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label">
                {t("affiliateCollections.startDateLabel")} <span className="text-danger">*</span>
              </label>
              <input
                type="datetime-local"
                className="form-control shadow-none"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                min={new Date().toISOString().slice(0, 16)}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">
                {t("affiliateCollections.endDateLabel")} <span className="text-danger">*</span>
              </label>
              <input
                type="datetime-local"
                className="form-control shadow-none"
                value={expirationDate}
                onChange={(e) => setExpirationDate(e.target.value)}
                min={startDate || new Date().toISOString().slice(0, 16)}
              />
            </div>
          </div>

          {categoriesLoading ? (
            <div className="text-center py-3">
              <div className="spinner-border spinner-border-sm" role="status">
                <span className="sr-only">{t("loading")}</span>
              </div>
            </div>
          ) : (
            <div
              className="categories-container"
              style={{
                maxHeight: "300px",
                overflowY: "auto",
                border: "1px solid #dee2e6",
                borderRadius: "0.375rem",
                backgroundColor: "#fff",
              }}
            >
              {categories?.items && categories.items.length > 0 ? (
                categories.items.map((mainCategory) => (
                  <div key={mainCategory.id} className="category-group">
                    {/* Ana Kategori Header */}
                    <div className="main-category-header">
                      <div className="category-row">
                        <div className="category-checkbox-section">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id={`main-category-${mainCategory.id}`}
                            checked={selectedMainCategoryIds.includes(
                              mainCategory.id
                            )}
                            onChange={() =>
                              handleMainCategoryToggle(mainCategory.id)
                            }
                            disabled={false}
                          />
                        </div>
                        <div className="category-content">
                          <div className="category-label-section">
                            <label
                              className="category-label main-category-label"
                              htmlFor={`main-category-${mainCategory.id}`}
                            >
                              {mainCategory.name}
                            </label>
                          </div>
                          <div className="category-expand-section">
                            {mainCategory.subCategories &&
                              mainCategory.subCategories.length > 0 && (
                                <button
                                  type="button"
                                  className="expand-btn"
                                  onClick={() =>
                                    handleMainCategoryExpand(mainCategory.id)
                                  }
                                >
                                  <i
                                    className={`bx ${expandedMainCategories.has(
                                      mainCategory.id
                                    )
                                      ? "bx-chevron-down"
                                      : "bx-chevron-right"
                                      }`}
                                  ></i>
                                </button>
                              )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Alt Kategoriler */}
                    {expandedMainCategories.has(mainCategory.id) &&
                      mainCategory.subCategories &&
                      mainCategory.subCategories.length > 0 && (
                        <div className="sub-categories-container">
                          {mainCategory.subCategories.map((subCategory) => (
                            <div
                              key={subCategory.id}
                              className="sub-category-row"
                            >
                              <div className="category-row">
                                <div className="category-checkbox-section">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id={`sub-category-${subCategory.id}`}
                                    checked={selectedSubCategoryIds.includes(
                                      subCategory.id
                                    )}
                                    onChange={() =>
                                      handleSubCategoryToggle(subCategory.id)
                                    }
                                    disabled={selectedMainCategoryIds.includes(
                                      mainCategory.id
                                    )}
                                  />
                                </div>
                                <div className="category-content">
                                  <div className="category-label-section">
                                    <label
                                      className="category-label sub-category-label"
                                      htmlFor={`sub-category-${subCategory.id}`}
                                    >
                                      {subCategory.name}
                                    </label>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                  </div>
                ))
              ) : (
                <div className="text-center py-3 text-muted">
                  {t("affiliateCollections.noCategoriesFound")}
                </div>
              )}
            </div>
          )}

          <small className="text-muted mt-2 d-block">
            {t("affiliateCollections.selectedMainCategoriesCount")}: {selectedMainCategoryIds.length},
            {t("affiliateCollections.selectedSubCategoriesCount")}: {selectedSubCategoryIds.length}
          </small>
        </div>
      )}

      <style jsx>{`
        .products-list::-webkit-scrollbar,
        .categories-container::-webkit-scrollbar {
          width: 6px;
        }

        .products-list::-webkit-scrollbar-track,
        .categories-container::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 3px;
        }

        .products-list::-webkit-scrollbar-thumb,
        .categories-container::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 3px;
        }

        .products-list::-webkit-scrollbar-thumb:hover,
        .categories-container::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }

        .form-check:hover {
          background-color: #f8f9fa;
        }

        /* Category Selection Styles */
        .category-group {
          border-bottom: 1px solid #eee;
        }

        .category-group:last-child {
          border-bottom: none;
        }

        .main-category-header {
          background-color: #f8f9fa;
          border-bottom: 1px solid #e9ecef;
        }

        .category-row {
          display: flex;
          align-items: center;
          padding: 12px 16px;
          gap: 12px;
        }

        .category-checkbox-section {
          display: flex;
          align-items: center;
          flex-shrink: 0;
          position: relative;
          margin-right: 10px;
        }

        .category-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-grow: 1;
          gap: 8px;
        }

        .category-label-section {
          flex-grow: 1;
        }

        .category-expand-section {
          flex-shrink: 0;
        }

        .category-label {
          margin: 0;
          cursor: pointer;
          font-weight: 500;
          color: #495057;
        }

        .main-category-label {
          font-weight: 600;
          color: #212529;
          font-size: 1.2rem;
        }

        .sub-category-label {
          font-weight: 400;
          color: #6c757d;
          font-size: 1.2rem;
        }

        .expand-btn {
          background: none;
          border: none;
          padding: 4px;
          color: #6c757d;
          cursor: pointer;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .expand-btn:hover {
          background-color: #e9ecef;
          color: #495057;
        }

        .expand-btn i {
          font-size: 16px;
        }

        .sub-categories-container {
          background-color: #ffffff;
        }

        .sub-category-row {
          border-bottom: 1px solid #f8f9fa;
          padding-left: 20px;
        }

        .sub-category-row:last-child {
          border-bottom: none;
        }

        .sub-category-row:hover {
          background-color: #f8f9fa;
        }

        .main-category-header:hover {
          background-color: #e9ecef;
        }

        .form-check-input {
          margin: 0;
          cursor: pointer;
          border: 2px solid #dee2e6 !important;
          box-shadow: none !important;
          background-color: #ffffff;
          width: 20px;
          height: 20px;
        }

        .form-check-input:checked {
          background-color: #212529;
          border-color: #212529 !important;
        }

        .form-check-input:focus {
          border: 2px solid #dee2e6 !important;
          box-shadow: none !important;
        }

        .form-check-input:hover {
          border-color: #adb5bd !important;
        }

        .form-control:focus,
        .form-select:focus,
        textarea:focus {
          border-color: #dee2e6 !important;
          box-shadow: none !important;
          outline: none !important;
        }

        .form-control:hover,
        .form-select:hover,
        textarea:hover {
          border-color: #adb5bd !important;
        }

        .form-check-input:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
    </GeneralModal>
  );
};

export default CreateCollectionModal;
