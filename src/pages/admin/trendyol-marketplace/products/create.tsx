"use client";
import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/router";
import { useBasicProductList } from "@/hooks/services/products/useBasicProductList";
import { useGetTrendyolBrandsHybrid } from "@/hooks/services/admin-trendyol-marketplace/useGetTrendyolBrands";
import { useGetTrendyolCategoryTree } from "@/hooks/services/admin-trendyol-marketplace/useGetTrendyolCategoryTree";
import { useGetTrendyolCargoProviders } from "@/hooks/services/admin-trendyol-marketplace/useGetTrendyolCargoProviders";
import { useGetTrendyolCategoryAttributes } from "@/hooks/services/admin-trendyol-marketplace/useGetTrendyolCategoryAttributes";
import { useGetTrendyolSupplierAddresses } from "@/hooks/services/admin-trendyol-marketplace/useGetTrendyolSupplierAddresses";
import { useCreateTrendyolProducts } from "@/hooks/services/admin-trendyol-marketplace/useCreateTrendyolProducts";
import { useCloudinaryImageUpload } from "@/hooks/useCloudinaryImageUpload";
import { ProductResponse } from "@/hooks/services/products/useBasicProductList";
import { TrendyolCreateProductRequest, TrendyolCreateProductItemRequest } from "@/constants/models/trendyol/TrendyolCreateProductRequest";
import { TrendyolDeliveryOption } from "@/constants/models/trendyol/TrendyolDeliveryOption";
import { TrendyolProductAttribute } from "@/constants/models/trendyol/TrendyolProductAttribute";
import { TrendyolProductImage } from "@/constants/models/trendyol/TrendyolProductImage";
import TrendyolProductAttributes from "@/components/admin/trendyol-marketplace/TrendyolProductAttributes";
import TrendyolCategorySelector from "@/components/admin/trendyol-marketplace/TrendyolCategorySelector";
import toast from "react-hot-toast";

function CreateTrendyolProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductResponse | null>(null);
  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const [productSearchTerm, setProductSearchTerm] = useState("");
  const [showBrandDropdown, setShowBrandDropdown] = useState(false);
  const [brandSearchTerm, setBrandSearchTerm] = useState("");

  const [showCargoDropdown, setShowCargoDropdown] = useState(false);
  const [showAddressDropdown, setShowAddressDropdown] = useState(false);
  const [showReturningAddressDropdown, setShowReturningAddressDropdown] = useState(false);

  // Category selection states
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [selectedMainCategory, setSelectedMainCategory] = useState<any>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<any>(null);
  const [selectedSubSubCategory, setSelectedSubSubCategory] = useState<any>(null);

  // Form state
  const [formData, setFormData] = useState<TrendyolCreateProductItemRequest>({
    barcode: "",
    title: "",
    productMainId: "",
    brandId: 0,
    categoryId: 0,
    quantity: 0,
    stockCode: "",
    dimensionalWeight: 0,
    description: "",
    currencyType: "TRY",
    listPrice: 0,
    salePrice: 0,
    vatRate: 0,
    cargoCompanyId: 0,
    shipmentAddressId: undefined,
    returningAddressId: undefined,
    deliveryOption: undefined,
    images: [],
    attributes: []
  });

  // Hooks
  const { products: allProducts, loading: productListLoading } = useBasicProductList();
  const {
    brands,
    hasMore: brandHasMore,
    isLoading: brandsLoading,
    searchLoading,
    isSearchMode,
    loadMoreBrands,
    handleScroll: handleBrandScroll,
    searchBrands,
    resetBrands
  } = useGetTrendyolBrandsHybrid(
    formData.brandId || undefined,
    undefined // No selected brand name for create page
  );
  const { categoryTree, isLoading: categoriesLoading } = useGetTrendyolCategoryTree();
  const { cargoProviders, isLoading: cargoLoading } = useGetTrendyolCargoProviders();
  const { supplierAddresses, isLoading: addressesLoading } = useGetTrendyolSupplierAddresses();
  const { categoryAttributes, isLoading: attributesLoading } = useGetTrendyolCategoryAttributes(formData.categoryId);




  const { createTrendyolProducts, isPending: createLoading } = useCreateTrendyolProducts();

  // Cloudinary for images
  const {
    selectedFile,
    setSelectedFile,
    imageUrl,
    setImageUrl,
    uploadImage,
    isUploading: imageUploading
  } = useCloudinaryImageUpload();

  // Filtered lists
  const productListForSelection = useMemo(() => {
    if (!allProducts) return [];
    return allProducts.filter(product =>
      product.title.toLowerCase().includes(productSearchTerm.toLowerCase())
    );
  }, [allProducts, productSearchTerm]);

  const [categories, setCategories] = useState<any[]>([]);

  // Debounced brand search effect
  const debouncedSearch = useCallback(() => {
    searchBrands(brandSearchTerm.trim());
  }, [brandSearchTerm, searchBrands]);

  useEffect(() => {
    const timer = setTimeout(debouncedSearch, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [brandSearchTerm, debouncedSearch]);

  // Load categories
  useEffect(() => {
    if (categoryTree && 'data' in categoryTree && (categoryTree as any).data?.categories) {
      setCategories((categoryTree as any).data.categories);
    }
  }, [(categoryTree as any)?.data?.categories]); // Only run when categories data changes

  // Category selection functions
  const selectMainCategory = (category: any) => {
    setSelectedMainCategory(category);
    setSelectedSubCategory(null);
    setSelectedSubSubCategory(null);
    handleInputChange('categoryId', category.id);
    // Clear attributes when category changes
    setFormData(prev => ({ ...prev, attributes: [] }));
  };

  const selectSubCategory = (category: any) => {
    setSelectedSubCategory(category);
    setSelectedSubSubCategory(null);
    handleInputChange('categoryId', category.id);
    // Clear attributes when category changes
    setFormData(prev => ({ ...prev, attributes: [] }));
  };

  const selectSubSubCategory = (category: any) => {
    setSelectedSubSubCategory(category);
    handleInputChange('categoryId', category.id);
    // Clear attributes when category changes
    setFormData(prev => ({ ...prev, attributes: [] }));
  };

  // Clear attributes when category is cleared
  useEffect(() => {
    if (formData.categoryId === 0) {
      // Clear attributes when no category is selected
      setFormData(prev => ({ ...prev, attributes: [] }));
    }
  }, [formData.categoryId]);

  const clearCategorySelection = () => {
    setSelectedMainCategory(null);
    setSelectedSubCategory(null);
    setSelectedSubSubCategory(null);
    handleInputChange('categoryId', 0);
  };



  const getSelectedCategoryPath = () => {
    const path = [];
    if (selectedMainCategory) path.push(selectedMainCategory.name);
    if (selectedSubCategory) path.push(selectedSubCategory.name);
    if (selectedSubSubCategory) path.push(selectedSubSubCategory.name);
    return path.join(' > ');
  };

  // Product selection
  const selectProduct = (product: ProductResponse) => {
    setSelectedProduct(product);
    setFormData(prev => ({
      ...prev,
      productMainId: product.id,
      barcode: product.barcodeNumber || "",
      title: product.title,
      description: product.description,
      listPrice: product.price,
      salePrice: product.price,
      images: product.contentImageUrls?.map(url => ({ url })) || []
    }));
    setShowProductDropdown(false);
    setProductSearchTerm("");
  };

  const clearSelectedProduct = () => {
    setSelectedProduct(null);
    setFormData(prev => ({
      ...prev,
      productMainId: "",
      barcode: "",
      title: "",
      description: "",
      listPrice: 0,
      salePrice: 0,
      images: []
    }));
  };

  // Handle form changes
  const handleInputChange = (field: keyof TrendyolCreateProductItemRequest, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Image handling
  const handleImageUpload = async () => {
    const uploadedUrl = await uploadImage();
    if (uploadedUrl) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, { url: uploadedUrl }]
      }));
      setSelectedFile(null);
      setImageUrl("");
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  // Attribute handling
  const addAttribute = () => {
    setFormData(prev => ({
      ...prev,
      attributes: [...prev.attributes, { attributeId: 0, attributeValueId: undefined, customAttributeValue: "" }]
    }));
  };

  const updateAttribute = (index: number, field: keyof TrendyolProductAttribute, value: any) => {
    setFormData(prev => {
      const updatedAttributes = prev.attributes.map((attr, i) => {
        if (i === index) {
          // Eğer nitelik değişiyorsa, değeri temizle
          if (field === 'attributeId') {
            return { ...attr, [field]: value, attributeValueId: undefined, customAttributeValue: "" };
          }
          return { ...attr, [field]: value };
        }
        return attr;
      });

      return {
        ...prev,
        attributes: updatedAttributes
      };
    });
  };

  const removeAttribute = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attributes: prev.attributes.filter((_, i) => i !== index)
    }));
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedProduct) {
      toast.error("Lütfen bir ürün seçin");
      return;
    }

    if (formData.images.length === 0) {
      toast.error("En az bir ürün görseli ekleyin");
      return;
    }

    try {
      setLoading(true);
      const request: TrendyolCreateProductRequest = {
        items: [formData]
      };

      await createTrendyolProducts(request);
      toast.success("Ürün başarıyla Trendyol'a gönderildi");
      router.push("/admin/trendyol-marketplace/products");
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  // Validation
  const isFormValid = () => {
    return selectedProduct &&
      formData.title.trim() !== "" &&
      formData.brandId > 0 &&
      formData.categoryId > 0 &&
      formData.quantity >= 0 &&
      formData.stockCode.trim() !== "" &&
      formData.dimensionalWeight >= 0 &&
      formData.description.trim() !== "" &&
      formData.listPrice >= 0 &&
      formData.salePrice >= 0 &&
      formData.vatRate >= 0 &&
      formData.cargoCompanyId > 0 &&
      formData.images.length > 0;
  };

  return (
    <div className="content-wrapper">
      <div className="container-l flex-grow-1 container-p-y">
        {/* Header */}
        <div className="card bg-transparent border-0 mb-0">
          <div className="card-body mb-0 pb-3">
            <div className="d-flex pt-0 justify-content-between align-items-center">
              <h6
                className="card-header"
                style={{
                  fontSize: "1.3rem",
                  fontWeight: "bold",
                  color: "#566a7f",
                  marginLeft: "-10px",
                }}
              >
                Yeni Trendyol Ürün Ekle
              </h6>
              <button
                className="btn btn-outline-secondary btn-sm"
                type="button"
                onClick={() => router.back()}
                style={{ fontSize: "0.75rem" }}
              >
                <i className="bx bx-arrow-back me-1"></i>
                Geri Dön
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="card">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              {/* Product Selection */}
              <div className="row mb-4">
                <div className="col-12">
                  <h6 className="mb-3" style={{ color: "#566a7f", fontWeight: "600" }}>
                    <i className="bx bx-package me-2"></i>
                    Ürün Seçimi
                  </h6>

                  <div className="row">
                    <div className="col-md-6">
                      <label className="form-label">Ürün Seç *</label>
                      <div className="position-relative">
                        <div
                          className="form-control d-flex align-items-center"
                          style={{ minHeight: "38px", cursor: "pointer" }}
                          onClick={() => setShowProductDropdown(!showProductDropdown)}
                        >
                          {selectedProduct ? (
                            <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {selectedProduct.title}
                            </span>
                          ) : (
                            <span style={{ color: "#6c757d", flex: 1 }}>Ürün seçin...</span>
                          )}
                          {selectedProduct && (
                            <button
                              type="button"
                              className="btn-close ms-2"
                              style={{ fontSize: "0.7em" }}
                              onClick={(e) => {
                                e.stopPropagation();
                                clearSelectedProduct();
                              }}
                            />
                          )}
                          <i className="bx bx-chevron-down ms-2"></i>
                        </div>

                        {showProductDropdown && (
                          <div className="dropdown-menu show w-100" style={{ zIndex: 1050, maxHeight: 300, overflowY: 'auto' }}>
                            <div className="px-3 py-2">
                              <div className="d-flex justify-content-between align-items-center mb-2">
                                <small style={{ fontWeight: "500" }}>Ürün Seç</small>
                                <button
                                  type="button"
                                  className="btn-close"
                                  style={{ fontSize: "0.7em" }}
                                  onClick={() => setShowProductDropdown(false)}
                                />
                              </div>
                              <div className="mb-2">
                                <input
                                  type="text"
                                  className="form-control form-control-sm"
                                  placeholder="Ürün adı ara..."
                                  value={productSearchTerm}
                                  onChange={(e) => setProductSearchTerm(e.target.value)}
                                  onClick={(e) => e.stopPropagation()}
                                />
                              </div>
                              {productListLoading ? (
                                <div className="text-center py-3">
                                  <div className="spinner-border spinner-border-sm text-primary" role="status">
                                    <span className="visually-hidden">Yükleniyor...</span>
                                  </div>
                                  <small className="d-block mt-1 text-muted">Ürünler yükleniyor...</small>
                                </div>
                              ) : productListForSelection.length > 0 ? (
                                <div style={{ maxHeight: 200, overflowY: 'auto' }}>
                                  {productListForSelection.map(product => (
                                    <button
                                      key={product.id}
                                      type="button"
                                      className="btn btn-link btn-sm text-start p-2 w-100"
                                      onClick={() => selectProduct(product)}
                                      style={{ fontSize: "0.875rem", color: "#495057", border: "none", background: "none" }}
                                    >
                                      <div className="fw-medium" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                        {product.title}
                                      </div>
                                    </button>
                                  ))}
                                </div>
                              ) : (
                                <div className="text-center py-3">
                                  <small className="text-muted">
                                    {productSearchTerm ? "Ürün bulunamadı" : "Ürün aramak için yazmaya başlayın"}
                                  </small>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {selectedProduct && (
                <>
                  {/* Basic Information */}
                  <div className="row mb-4">
                    <div className="col-12">
                      <h6 className="mb-3" style={{ color: "#566a7f", fontWeight: "600" }}>
                        <i className="bx bx-info-circle me-2"></i>
                        Temel Bilgiler
                      </h6>

                      <div className="row g-3">
                        <div className="col-md-6">
                          <label className="form-label">Barkod</label>
                          <input
                            type="text"
                            className="form-control"
                            value={formData.barcode}
                            readOnly
                            style={{ backgroundColor: "#f8f9fa" }}
                          />
                          <small className="text-muted" style={{ fontStyle: "italic", fontSize: "0.75rem" }}>
                            <i className="bx bx-info-circle me-1"></i>
                            Bu alan otomatik doldurulur ve değiştirilemez
                          </small>
                        </div>

                        <div className="col-md-6">
                          <label className="form-label">Ürün Başlığı *</label>
                          <input
                            type="text"
                            className="form-control"
                            value={formData.title}
                            onChange={(e) => handleInputChange('title', e.target.value)}
                            maxLength={100}
                            placeholder="Ürün başlığı (maksimum 100 karakter)"
                          />
                        </div>

                        <div className="col-md-12">
                          <label className="form-label">Marka *</label>
                          <div className="position-relative">
                            <div
                              className="form-control d-flex align-items-center"
                              style={{ minHeight: "38px", cursor: "pointer" }}
                              onClick={() => setShowBrandDropdown(!showBrandDropdown)}
                            >
                              {formData.brandId > 0 ? (
                                <span style={{ flex: 1 }}>
                                  {brands.find(b => b.id === formData.brandId)?.name || "Marka seçildi"}
                                </span>
                              ) : (
                                <span style={{ color: "#6c757d", flex: 1 }}>Marka seçin...</span>
                              )}
                              <i className="bx bx-chevron-down ms-2"></i>
                            </div>

                            {showBrandDropdown && (
                              <div className="dropdown-menu show w-100" style={{ zIndex: 1050, maxHeight: 300, overflowY: 'auto' }}>
                                <div className="px-3 py-2">
                                  <div className="d-flex justify-content-between align-items-center mb-2">
                                    <small style={{ fontWeight: "500" }}>Marka Seç</small>
                                    <button
                                      type="button"
                                      className="btn-close"
                                      style={{ fontSize: "0.7em" }}
                                      onClick={() => setShowBrandDropdown(false)}
                                    />
                                  </div>
                                  <div className="mb-2">
                                    <input
                                      type="text"
                                      className="form-control form-control-sm"
                                      placeholder="Marka ara..."
                                      value={brandSearchTerm}
                                      onChange={(e) => setBrandSearchTerm(e.target.value)}
                                      onClick={(e) => e.stopPropagation()}
                                    />
                                  </div>
                                  {(brandsLoading || searchLoading) ? (
                                    <div className="text-center py-3">
                                      <div className="spinner-border spinner-border-sm text-primary" role="status">
                                        <span className="visually-hidden">Yükleniyor...</span>
                                      </div>
                                      <small className="d-block mt-1 text-muted">
                                        {searchLoading ? "Markalar aranıyor..." : "Markalar yükleniyor..."}
                                      </small>
                                    </div>
                                  ) : brands.length > 0 ? (
                                    <div
                                      style={{ maxHeight: 200, overflowY: 'auto' }}
                                      onScroll={handleBrandScroll}
                                    >
                                      {brands.map(brand => (
                                        <button
                                          key={brand.id}
                                          type="button"
                                          className="btn btn-link btn-sm text-start p-2 w-100"
                                          onClick={() => {
                                            handleInputChange('brandId', brand.id);
                                            setShowBrandDropdown(false);
                                            setBrandSearchTerm("");
                                          }}
                                          style={{ fontSize: "0.875rem", color: "#495057", border: "none", background: "none" }}
                                        >
                                          {brand.name}
                                        </button>
                                      ))}
                                      {!isSearchMode && brandHasMore && (
                                        <div className="text-center py-2">
                                          <small className="text-muted">Daha fazla marka görmek için aşağı kaydırın</small>
                                        </div>
                                      )}
                                      {brandsLoading && brandHasMore && (
                                        <div className="text-center py-2">
                                          <div className="spinner-border spinner-border-sm text-primary" role="status">
                                            <span className="visually-hidden">Yükleniyor...</span>
                                          </div>
                                          <small className="d-block mt-1 text-muted">Daha fazla marka yükleniyor...</small>
                                        </div>
                                      )}
                                    </div>
                                  ) : (
                                    <div className="text-center py-3">
                                      <small className="text-muted">
                                        {isSearchMode ? "Arama kriterine uygun marka bulunamadı. Daha fazla marka görmek için aşağı kaydırın." : "Marka bulunamadı"}
                                      </small>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="col-md-12">
                          <label className="form-label">Kategori Seçiniz *</label>
                          <TrendyolCategorySelector
                            categories={categories}
                            selectedMainCategory={selectedMainCategory}
                            selectedSubCategory={selectedSubCategory}
                            selectedSubSubCategory={selectedSubSubCategory}
                            onSelectMainCategory={selectMainCategory}
                            onSelectSubCategory={selectSubCategory}
                            onSelectSubSubCategory={selectSubSubCategory}
                            onClearSelection={clearCategorySelection}
                            isLoading={categoriesLoading}
                            showDropdown={showCategoryDropdown}
                            onToggleDropdown={() => setShowCategoryDropdown(!showCategoryDropdown)}
                            getSelectedCategoryPath={getSelectedCategoryPath}
                          />
                        </div>

                        {/* Category Attributes Section */}
                        <TrendyolProductAttributes
                          attributes={formData.attributes}
                          categoryAttributes={categoryAttributes}
                          attributesLoading={attributesLoading}
                          selectedSubCategory={selectedSubCategory}
                          selectedSubSubCategory={selectedSubSubCategory}
                          selectedMainCategory={selectedMainCategory}
                          onUpdateAttribute={updateAttribute}
                          onRemoveAttribute={removeAttribute}
                          onAddAttribute={addAttribute}
                        />

                        <div className="col-md-4">
                          <label className="form-label">Stok Adedi *</label>
                          <input
                            type="number"
                            className="form-control"
                            value={formData.quantity}
                            onChange={(e) => handleInputChange('quantity', parseInt(e.target.value) || 0)}
                            min="0"
                            placeholder="Stok adedi"
                          />
                          <small className="text-muted" style={{ fontStyle: "italic", fontSize: "0.75rem" }}>
                            <i className="bx bx-info-circle me-1"></i>
                            Negatif değer girilemez
                          </small>
                        </div>

                        <div className="col-md-4">
                          <label className="form-label">Stok Kodu *</label>
                          <input
                            type="text"
                            className="form-control"
                            value={formData.stockCode}
                            onChange={(e) => handleInputChange('stockCode', e.target.value)}
                            placeholder="Stok kodu"
                          />
                        </div>

                        <div className="col-md-4">
                          <label className="form-label">Kargo Desi *</label>
                          <input
                            type="number"
                            className="form-control"
                            value={formData.dimensionalWeight}
                            onChange={(e) => handleInputChange('dimensionalWeight', parseFloat(e.target.value) || 0)}
                            min="0"
                            step="0.01"
                            placeholder="Kargo desi"
                          />
                          <small className="text-muted" style={{ fontStyle: "italic", fontSize: "0.75rem" }}>
                            <i className="bx bx-info-circle me-1"></i>
                            Negatif değer girilemez
                          </small>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="row mb-4">
                    <div className="col-12">
                      <label className="form-label">Ürün Açıklaması *</label>
                      <textarea
                        className="form-control"
                        rows={4}
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        placeholder="Ürün açıklaması"
                      />
                      <div className="mt-2">
                        <small className="text-muted" style={{ fontStyle: "italic", fontSize: "0.75rem" }}>
                          <i className="bx bx-info-circle me-1"></i>
                          HTML destekli açıklama yazabilirsiniz
                        </small>
                      </div>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="row mb-4">
                    <div className="col-12">
                      <h6 className="mb-3" style={{ color: "#566a7f", fontWeight: "600" }}>
                        <i className="bx bx-dollar-circle me-2"></i>
                        Fiyatlandırma
                      </h6>

                      <div className="row g-3">
                        <div className="col-md-3">
                          <label className="form-label">Para Birimi</label>
                          <select
                            className="form-select"
                            value={formData.currencyType}
                            onChange={(e) => handleInputChange('currencyType', e.target.value)}
                          >
                            <option value="TRY">TRY - Türk Lirası</option>
                            <option value="USD">USD - Amerikan Doları</option>
                            <option value="EUR">EUR - Euro</option>
                          </select>
                        </div>

                        <div className="col-md-3">
                          <label className="form-label">Liste Fiyatı *</label>
                          <input
                            type="number"
                            className="form-control"
                            value={formData.listPrice}
                            onChange={(e) => handleInputChange('listPrice', parseFloat(e.target.value) || 0)}
                            min="0"
                            step="0.01"
                            placeholder="Liste fiyatı"
                          />
                        </div>

                        <div className="col-md-3">
                          <label className="form-label">Satış Fiyatı *</label>
                          <input
                            type="number"
                            className="form-control"
                            value={formData.salePrice}
                            onChange={(e) => handleInputChange('salePrice', parseFloat(e.target.value) || 0)}
                            min="0"
                            step="0.01"
                            placeholder="Satış fiyatı"
                          />
                        </div>

                        <div className="col-md-3">
                          <label className="form-label">KDV Oranı *</label>
                          <select
                            className="form-select"
                            value={formData.vatRate}
                            onChange={(e) => handleInputChange('vatRate', parseInt(e.target.value))}
                          >
                            <option value={0}>0%</option>
                            <option value={1}>1%</option>
                            <option value={10}>10%</option>
                            <option value={20}>20%</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Shipping */}
                  <div className="row mb-4">
                    <div className="col-12">
                      <h6 className="mb-3" style={{ color: "#566a7f", fontWeight: "600" }}>
                        <i className="bx bx-truck me-2"></i>
                        Kargo ve Teslimat
                      </h6>

                      <div className="row g-3">
                        <div className="col-md-6">
                          <label className="form-label">Kargo Firması *</label>
                          <div className="position-relative">
                            <div
                              className="form-control d-flex align-items-center"
                              style={{ minHeight: "38px", cursor: "pointer" }}
                              onClick={() => setShowCargoDropdown(!showCargoDropdown)}
                            >
                              {formData.cargoCompanyId > 0 ? (
                                <span style={{ flex: 1 }}>
                                  {(cargoProviders as any)?.data?.providers?.find((c: any) => c.id === formData.cargoCompanyId)?.name || "Kargo firması seçildi"}
                                </span>
                              ) : (
                                <span style={{ color: "#6c757d", flex: 1 }}>Kargo firması seçin...</span>
                              )}
                              <i className="bx bx-chevron-down ms-2"></i>
                            </div>

                            {showCargoDropdown && (
                              <div className="dropdown-menu show w-100" style={{ zIndex: 1050, maxHeight: 300, overflowY: 'auto' }}>
                                <div className="px-3 py-2">
                                  <div className="d-flex justify-content-between align-items-center mb-2">
                                    <small style={{ fontWeight: "500" }}>Kargo Firması Seç</small>
                                    <button
                                      type="button"
                                      className="btn-close"
                                      style={{ fontSize: "0.7em" }}
                                      onClick={() => setShowCargoDropdown(false)}
                                    />
                                  </div>
                                  {cargoLoading ? (
                                    <div className="text-center py-3">
                                      <div className="spinner-border spinner-border-sm text-primary" role="status">
                                        <span className="visually-hidden">Yükleniyor...</span>
                                      </div>
                                      <small className="d-block mt-1 text-muted">Kargo firmaları yükleniyor...</small>
                                    </div>
                                  ) : (cargoProviders as any)?.data?.providers && (cargoProviders as any).data.providers.length > 0 ? (
                                    <div style={{ maxHeight: 200, overflowY: 'auto' }}>
                                      {(cargoProviders as any).data.providers.map((cargo: any) => (
                                        <button
                                          key={cargo.id}
                                          type="button"
                                          className="btn btn-link btn-sm text-start p-2 w-100"
                                          onClick={() => {
                                            handleInputChange('cargoCompanyId', cargo.id);
                                            setShowCargoDropdown(false);
                                          }}
                                          style={{ fontSize: "0.875rem", color: "#495057", border: "none", background: "none" }}
                                        >
                                          {cargo.name}
                                        </button>
                                      ))}
                                    </div>
                                  ) : (
                                    <div className="text-center py-3">
                                      <small className="text-muted">Kargo firması bulunamadı</small>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="col-md-6">
                          <label className="form-label">Sevkiyat Adresi</label>
                          <div className="position-relative">
                            <div
                              className="form-control d-flex align-items-center"
                              style={{ minHeight: "38px", cursor: "pointer" }}
                              onClick={() => setShowAddressDropdown(!showAddressDropdown)}
                            >
                              {formData.shipmentAddressId ? (
                                <span style={{ flex: 1 }}>
                                  {(supplierAddresses as any)?.data?.supplierAddresses?.find((a: any) => a.id === formData.shipmentAddressId)?.fullAddress || "Adres seçildi"}
                                </span>
                              ) : (
                                <span style={{ color: "#6c757d", flex: 1 }}>Sevkiyat adresi seçin (opsiyonel)...</span>
                              )}
                              <i className="bx bx-chevron-down ms-2"></i>
                            </div>

                            {showAddressDropdown && (
                              <div className="dropdown-menu show w-100" style={{ zIndex: 1050, maxHeight: 300, overflowY: 'auto' }}>
                                <div className="px-3 py-2">
                                  <div className="d-flex justify-content-between align-items-center mb-2">
                                    <small style={{ fontWeight: "500" }}>Sevkiyat Adresi Seç</small>
                                    <button
                                      type="button"
                                      className="btn-close"
                                      style={{ fontSize: "0.7em" }}
                                      onClick={() => setShowAddressDropdown(false)}
                                    />
                                  </div>
                                  <button
                                    type="button"
                                    className="btn btn-link btn-sm text-start p-2 w-100"
                                    onClick={() => {
                                      handleInputChange('shipmentAddressId', undefined);
                                      setShowAddressDropdown(false);
                                    }}
                                    style={{ fontSize: "0.875rem", color: "#6c757d", border: "none", background: "none" }}
                                  >
                                    Adres seçme
                                  </button>
                                  {addressesLoading ? (
                                    <div className="text-center py-3">
                                      <div className="spinner-border spinner-border-sm text-primary" role="status">
                                        <span className="visually-hidden">Yükleniyor...</span>
                                      </div>
                                      <small className="d-block mt-1 text-muted">Adresler yükleniyor...</small>
                                    </div>
                                  ) : (supplierAddresses as any)?.data?.supplierAddresses && (supplierAddresses as any).data.supplierAddresses.length > 0 ? (
                                    <div style={{ maxHeight: 200, overflowY: 'auto' }}>
                                      {(supplierAddresses as any).data.supplierAddresses.map((address: any) => (
                                        <button
                                          key={address.id}
                                          type="button"
                                          className="btn btn-link btn-sm text-start p-2 w-100"
                                          onClick={() => {
                                            handleInputChange('shipmentAddressId', address.id);
                                            setShowAddressDropdown(false);
                                          }}
                                          style={{ fontSize: "0.875rem", color: "#495057", border: "none", background: "none" }}
                                        >
                                          {address.fullAddress}
                                        </button>
                                      ))}
                                    </div>
                                  ) : (
                                    <div className="text-center py-3">
                                      <small className="text-muted">Adres bulunamadı</small>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="col-md-6">
                          <label className="form-label">İade Adresi</label>
                          <div className="position-relative">
                            <div
                              className="form-control d-flex align-items-center"
                              style={{ minHeight: "38px", cursor: "pointer" }}
                              onClick={() => setShowReturningAddressDropdown(!showReturningAddressDropdown)}
                            >
                              {formData.returningAddressId ? (
                                <span style={{ flex: 1 }}>
                                  {(supplierAddresses as any)?.data?.supplierAddresses?.find((a: any) => a.id === formData.returningAddressId)?.fullAddress || "Adres seçildi"}
                                </span>
                              ) : (
                                <span style={{ color: "#6c757d", flex: 1 }}>İade adresi seçin (opsiyonel)...</span>
                              )}
                              <i className="bx bx-chevron-down ms-2"></i>
                            </div>

                            {showReturningAddressDropdown && (
                              <div className="dropdown-menu show w-100" style={{ zIndex: 1050, maxHeight: 300, overflowY: 'auto' }}>
                                <div className="px-3 py-2">
                                  <div className="d-flex justify-content-between align-items-center mb-2">
                                    <small style={{ fontWeight: "500" }}>İade Adresi Seç</small>
                                    <button
                                      type="button"
                                      className="btn-close"
                                      style={{ fontSize: "0.7em" }}
                                      onClick={() => setShowReturningAddressDropdown(false)}
                                    />
                                  </div>
                                  <button
                                    type="button"
                                    className="btn btn-link btn-sm text-start p-2 w-100"
                                    onClick={() => {
                                      handleInputChange('returningAddressId', undefined);
                                      setShowReturningAddressDropdown(false);
                                    }}
                                    style={{ fontSize: "0.875rem", color: "#6c757d", border: "none", background: "none" }}
                                  >
                                    Adres seçme
                                  </button>
                                  {addressesLoading ? (
                                    <div className="text-center py-3">
                                      <div className="spinner-border spinner-border-sm text-primary" role="status">
                                        <span className="visually-hidden">Yükleniyor...</span>
                                      </div>
                                      <small className="d-block mt-1 text-muted">Adresler yükleniyor...</small>
                                    </div>
                                  ) : (supplierAddresses as any)?.data?.supplierAddresses && (supplierAddresses as any).data.supplierAddresses.length > 0 ? (
                                    <div style={{ maxHeight: 200, overflowY: 'auto' }}>
                                      {(supplierAddresses as any).data.supplierAddresses.map((address: any) => (
                                        <button
                                          key={address.id}
                                          type="button"
                                          className="btn btn-link btn-sm text-start p-2 w-100"
                                          onClick={() => {
                                            handleInputChange('returningAddressId', address.id);
                                            setShowReturningAddressDropdown(false);
                                          }}
                                          style={{ fontSize: "0.875rem", color: "#495057", border: "none", background: "none" }}
                                        >
                                          {address.fullAddress}
                                        </button>
                                      ))}
                                    </div>
                                  ) : (
                                    <div className="text-center py-3">
                                      <small className="text-muted">Adres bulunamadı</small>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="col-md-6">
                          <label className="form-label">Hızlı Teslimat</label>
                          <div className="row g-2">
                            <div className="col-6">
                              <select
                                className="form-select"
                                value={formData.deliveryOption?.fastDeliveryType || ""}
                                onChange={(e) => {
                                  const fastDeliveryType = e.target.value;
                                  handleInputChange('deliveryOption', {
                                    fastDeliveryType: fastDeliveryType,
                                    deliveryDuration: fastDeliveryType ? 1 : undefined
                                  });
                                }}
                              >
                                <option value="">Hızlı teslimat yok</option>
                                <option value="SAME_DAY_SHIPPING">Aynı Gün Kargo</option>
                                <option value="FAST_DELIVERY">Hızlı Teslimat</option>
                              </select>
                            </div>
                            <div className="col-6">
                              <input
                                type="number"
                                className="form-control"
                                value={formData.deliveryOption?.deliveryDuration || ""}
                                onChange={(e) => handleInputChange('deliveryOption', {
                                  ...formData.deliveryOption,
                                  deliveryDuration: parseInt(e.target.value) || undefined
                                })}
                                placeholder="Teslimat süresi (gün)"
                                min="1"
                                disabled={!formData.deliveryOption?.fastDeliveryType}
                              />
                            </div>
                            <small className="text-muted" style={{ fontStyle: "italic", fontSize: "0.75rem" }}>
                              <i className="bx bx-info-circle me-1"></i>
                              Hızlı teslimat seçildiğinde otomatik 1 gün olarak ayarlanır
                            </small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Images */}
                  <div className="row mb-4">
                    <div className="col-12">
                      <h6 className="mb-3" style={{ color: "#566a7f", fontWeight: "600" }}>
                        <i className="bx bx-images me-2"></i>
                        Ürün Görselleri *
                      </h6>

                      <div className="row g-3">
                        {/* Existing Images */}
                        {formData.images.map((image, index) => (
                          <div key={index} className="col-md-3">
                            <div className="position-relative">
                              <img
                                src={image.url}
                                alt={`Ürün görseli ${index + 1}`}
                                className="img-fluid rounded"
                                style={{ width: "100%", height: "150px", objectFit: "cover" }}
                              />
                              <button
                                type="button"
                                className="btn btn-danger btn-sm position-absolute top-0 end-0 m-1"
                                onClick={() => removeImage(index)}
                                style={{ fontSize: "0.7rem" }}
                              >
                                <i className="bx bx-x"></i>
                              </button>
                            </div>
                          </div>
                        ))}

                        {/* Add New Image */}
                        {formData.images.length < 8 && (
                          <div className="col-md-3">
                            <div className="border rounded p-3 text-center" style={{ height: "150px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                                style={{ display: "none" }}
                                id="image-upload"
                              />
                              <label htmlFor="image-upload" className="btn btn-outline-primary btn-sm mb-2" style={{ cursor: "pointer" }}>
                                <i className="bx bx-plus me-1"></i>
                                Görsel Ekle
                              </label>
                              {selectedFile && (
                                <button
                                  type="button"
                                  className="btn btn-success btn-sm"
                                  onClick={handleImageUpload}
                                  disabled={imageUploading}
                                >
                                  {imageUploading ? (
                                    <>
                                      <div className="spinner-border spinner-border-sm me-1" role="status">
                                        <span className="visually-hidden">Yükleniyor...</span>
                                      </div>
                                      Yükleniyor
                                    </>
                                  ) : (
                                    <>
                                      <i className="bx bx-upload me-1"></i>
                                      Yükle
                                    </>
                                  )}
                                </button>
                              )}
                              <small className="text-muted d-block mt-1">
                                Maksimum 8 görsel
                              </small>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>



                  {/* Submit Button */}
                  <div className="row">
                    <div className="col-12 text-end">
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={!isFormValid() || loading || createLoading}
                      >
                        {loading || createLoading ? (
                          <>
                            <div className="spinner-border spinner-border-sm me-2" role="status">
                              <span className="visually-hidden">Gönderiliyor...</span>
                            </div>
                            Trendyol'a Gönderiliyor...
                          </>
                        ) : (
                          <>
                            <i className="bx bx-send me-2"></i>
                            Trendyol'a Gönder
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateTrendyolProductPage; 