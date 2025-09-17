"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/router";
import { useGetProductWithTrendyol } from "@/hooks/services/admin-trendyol-marketplace/useGetProductWithTrendyol";
import { useUpdateTrendyolProducts } from "@/hooks/services/admin-trendyol-marketplace/useUpdateTrendyolProducts";
import { useGetTrendyolBrandsHybrid } from "@/hooks/services/admin-trendyol-marketplace/useGetTrendyolBrands";
import { useGetTrendyolCategoryTree } from "@/hooks/services/admin-trendyol-marketplace/useGetTrendyolCategoryTree";
import { useGetTrendyolCargoProviders } from "@/hooks/services/admin-trendyol-marketplace/useGetTrendyolCargoProviders";
import { useGetTrendyolCargoProviderById } from "@/hooks/services/admin-trendyol-marketplace/useGetTrendyolCargoProviderById";
import { useGetTrendyolCategoryAttributes } from "@/hooks/services/admin-trendyol-marketplace/useGetTrendyolCategoryAttributes";
import { useGetTrendyolSupplierAddresses } from "@/hooks/services/admin-trendyol-marketplace/useGetTrendyolSupplierAddresses";
import { useGetTrendyolProductStatusOptions } from "@/hooks/services/enum-options/useGetTrendyolProductStatusOptions";
import { useGetTrendyolOperationTypes } from "@/hooks/services/enum-options/useGetTrendyolOperationTypes";
import { useCloudinaryImageUpload } from "@/hooks/useCloudinaryImageUpload";
import TrendyolProductOperations from "@/components/admin/trendyol-marketplace/TrendyolProductOperations";
import TrendyolProductAttributes from "@/components/admin/trendyol-marketplace/TrendyolProductAttributes";
import TrendyolProductHeader from "@/components/admin/trendyol-marketplace/TrendyolProductHeader";
import TrendyolCategorySelector from "@/components/admin/trendyol-marketplace/TrendyolCategorySelector";
import { TrendyolUpdateProductRequest, TrendyolUpdateProductItemRequest } from "@/constants/models/trendyol/TrendyolUpdateProductRequest";
import { TrendyolDeliveryOption } from "@/constants/models/trendyol/TrendyolDeliveryOption";
import { TrendyolProductAttribute } from "@/constants/models/trendyol/TrendyolProductAttribute";
import { TrendyolProductImage } from "@/constants/models/trendyol/TrendyolProductImage";
import { ProductWithTrendyolResponse } from "@/constants/models/trendyol/ProductWithTrendyolResponse";
import toast from "react-hot-toast";
import Image from "next/image";

function UpdateTrendyolProductPage() {
  const router = useRouter();
  const { productId } = router.query;
  const [loading, setLoading] = useState(false);
  const [productDetails, setProductDetails] = useState<ProductWithTrendyolResponse | null>(null);

  // Dropdown states
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


  // Refs for click outside handling
  const brandDropdownRef = useRef<HTMLDivElement>(null);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);
  const cargoDropdownRef = useRef<HTMLDivElement>(null);
  const addressDropdownRef = useRef<HTMLDivElement>(null);
  const returningAddressDropdownRef = useRef<HTMLDivElement>(null);

  // Form state
  const [formData, setFormData] = useState<TrendyolUpdateProductItemRequest>({
    barcode: "",
    title: "",
    productMainId: "",
    brandId: 0,
    categoryId: 0,
    stockCode: "",
    dimensionalWeight: 0,
    description: "",
    currencyType: "TRY",
    cargoCompanyId: 0,
    deliveryDuration: undefined,
    deliveryOption: undefined,
    shipmentAddressId: undefined,
    returningAddressId: undefined,
    images: [],
    vatRate: 0,
    attributes: []
  });

  // Loading states
  const [initialLoading, setInitialLoading] = useState(true);

  // Hooks
  const { getProductWithTrendyol, isPending: detailsLoading } = useGetProductWithTrendyol();
  const { updateTrendyolProducts, isPending: updateLoading } = useUpdateTrendyolProducts();
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
    productDetails?.trendyolInfo?.brand || undefined
  );
  const { categoryTree, isLoading: categoriesLoading } = useGetTrendyolCategoryTree();
  const { cargoProviders, isLoading: cargoLoading } = useGetTrendyolCargoProviders();
  const { cargoProvider: selectedCargoProvider, isLoading: selectedCargoLoading } = useGetTrendyolCargoProviderById(formData.cargoCompanyId);
  const { supplierAddresses, isLoading: addressesLoading } = useGetTrendyolSupplierAddresses();
  const { categoryAttributes, isLoading: attributesLoading } = useGetTrendyolCategoryAttributes(formData.categoryId);
  const { data: trendyolStatusOptions, isLoading: statusOptionsLoading, refetch: refetchStatusOptions } = useGetTrendyolProductStatusOptions();
  const { data: trendyolOperationTypes, isLoading: operationTypesLoading, refetch: refetchOperationTypes } = useGetTrendyolOperationTypes();

  // Cloudinary for new images
  const {
    selectedFile,
    setSelectedFile,
    imageUrl,
    setImageUrl,
    uploadImage,
    isUploading: imageUploading
  } = useCloudinaryImageUpload();

  // State for categories
  const [categories, setCategories] = useState<any[]>([]);

  // Load product details and form data
  useEffect(() => {
    if (productId && typeof productId === 'string') {
      loadInitialData(productId);
    }
  }, [productId]);

  // Set initial loading to false when all required data is loaded
  useEffect(() => {
    if (productDetails && categories.length > 0 && !categoriesLoading) {
      setInitialLoading(false);
    }
  }, [productDetails, categories, categoriesLoading]);

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

  // Load initial data sequentially
  const loadInitialData = async (productId: string) => {
    try {
      // First load categories, then load product details
      await refetchStatusOptions();
      await refetchOperationTypes();

      // Wait for categories to be loaded
      if (!categoriesLoading && categoryTree) {
        await loadProductDetails(productId);
      } else {
        // If categories are still loading, wait a bit and try again
        setTimeout(() => {
          if (productId) {
            loadProductDetails(productId);
          }
        }, 500);
      }
    } catch (error) {
    }
  };

  // Load categories
  useEffect(() => {
    if (categoryTree && 'data' in categoryTree && (categoryTree as any).data?.categories) {
      const newCategories = (categoryTree as any).data.categories;
      setCategories(newCategories);

      // If we have product details but categories were loaded later, set category hierarchy
      if (productDetails?.trendyolInfo?.pimCategoryId && newCategories.length > 0) {
        findAndSetCategoryHierarchy(productDetails.trendyolInfo.pimCategoryId);
      }
    }
  }, [(categoryTree as any)?.data?.categories, productDetails]);

  // Re-populate form data when brands are loaded
  useEffect(() => {
    if (brands.length > 0 && productDetails && categories.length > 0) {
      // Force re-populate with updated brands
      const updatedProduct = { ...productDetails };
      populateFormData(updatedProduct);
    }
  }, [brands, productDetails, categories]);

  // Re-populate form data when cargo providers are loaded
  useEffect(() => {
    if ((cargoProviders as any)?.data?.providers?.length > 0 && productDetails && categories.length > 0) {
      // Force re-populate with updated cargo providers
      const updatedProduct = { ...productDetails };
      populateFormData(updatedProduct);
    }
  }, [cargoProviders, productDetails, categories]);


  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (brandDropdownRef.current && !brandDropdownRef.current.contains(event.target as Node)) {
        setShowBrandDropdown(false);
      }
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target as Node)) {
        setShowCategoryDropdown(false);
      }
      if (cargoDropdownRef.current && !cargoDropdownRef.current.contains(event.target as Node)) {
        setShowCargoDropdown(false);
      }
      if (addressDropdownRef.current && !addressDropdownRef.current.contains(event.target as Node)) {
        setShowAddressDropdown(false);
      }
      if (returningAddressDropdownRef.current && !returningAddressDropdownRef.current.contains(event.target as Node)) {
        setShowReturningAddressDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const loadProductDetails = async (productId: string) => {
    try {
      const response = await getProductWithTrendyol(productId);
      if (response.data) {
        setProductDetails(response.data);

        // Wait for categories to be loaded before populating form data
        if (categories.length > 0) {
          populateFormData(response.data);
        } else {
          // If categories are not loaded yet, wait for them
        }
      }
    } catch (error) {
      toast.error("Ürün bilgileri yüklenemedi");
    }
  };

  // Separate function to populate form data
  const populateFormData = (product: ProductWithTrendyolResponse) => {
    // Use brandId directly from trendyolInfo
    const brandId = product.trendyolInfo?.brandId || 0;

    // Get cargo company ID from the most recent successful operation
    let cargoCompanyId = 0;
    if (product.trendyolProductOperations && product.trendyolProductOperations.length > 0) {
      // Sort operations by createdOnValue (most recent first) and find the first successful one
      const sortedOperations = [...product.trendyolProductOperations].sort((a, b) => {
        const dateA = new Date(a.createdOnValue || '').getTime();
        const dateB = new Date(b.createdOnValue || '').getTime();
        return dateB - dateA;
      });

      const successfulOperation = sortedOperations.find(op => op.isFinal && op.status === 6); // 6 = ReadyForPublish
      if (successfulOperation?.cargoCompanyId) {
        cargoCompanyId = successfulOperation.cargoCompanyId;
      }
    }

    // If no cargo company found in operations, use default from providers
    if (cargoCompanyId === 0) {
      cargoCompanyId = (cargoProviders as any)?.data?.providers?.[0]?.id || 0;
    }

    // Convert trendyolInfo attributes to form format
    const convertedAttributes = product.trendyolInfo?.attributes?.map(attr => ({
      attributeId: attr.attributeId,
      attributeValueId: attr.attributeValueId || undefined,
      customAttributeValue: attr.attributeValueId ? "" : attr.attributeValue || ""
    })) || [];

    setFormData({
      barcode: product.barcodeNumber,
      title: product.title,
      productMainId: product.id,
      brandId: brandId,
      categoryId: product.trendyolInfo?.pimCategoryId || 0,
      stockCode: product.trendyolInfo?.stockCode || "",
      dimensionalWeight: product.trendyolInfo?.dimensionalWeight || 0,
      description: product.trendyolInfo?.description || "",
      currencyType: "TRY",
      cargoCompanyId: cargoCompanyId,
      deliveryDuration: undefined, // Bu değer TrendyolProductItem'da yok
      deliveryOption: product.trendyolInfo?.deliveryOption,
      shipmentAddressId: undefined, // Bu değer TrendyolProductItem'da yok, manuel seçilmeli
      returningAddressId: undefined, // Bu değer TrendyolProductItem'da yok, manuel seçilmeli
      images: product.trendyolInfo?.images || [
        ...(product.baseImageUrl ? [{ url: product.baseImageUrl }] : []),
        ...(product.contentImageUrls?.map(url => ({ url })) || [])
      ],
      vatRate: product.trendyolInfo?.vatRate || 20,
      attributes: convertedAttributes
    });

    // Set selected category hierarchy
    if (product.trendyolInfo?.pimCategoryId && categories.length > 0) {
      findAndSetCategoryHierarchy(product.trendyolInfo.pimCategoryId);
    }
  };


  // Find and set category hierarchy for existing product
  const findAndSetCategoryHierarchy = (categoryId: number) => {
    if (!categories || categories.length === 0) {
      return;
    }

    const findCategory = (categories: any[], targetId: number, path: any[] = []): any[] | null => {
      for (const category of categories || []) {
        const currentPath = [...path, category];

        if (category.id === targetId) {
          return currentPath;
        }

        if (category.subCategories) {
          const found = findCategory(category.subCategories, targetId, currentPath);
          if (found) return found;
        }
      }
      return null;
    };

    const categoryPath = findCategory(categories, categoryId);
    if (categoryPath) {
      if (categoryPath[0]) setSelectedMainCategory(categoryPath[0]);
      if (categoryPath[1]) setSelectedSubCategory(categoryPath[1]);
      if (categoryPath[2]) setSelectedSubSubCategory(categoryPath[2]);
    } else {
    }
  };

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

  const clearCategorySelection = () => {
    setSelectedMainCategory(null);
    setSelectedSubCategory(null);
    setSelectedSubSubCategory(null);
    handleInputChange('categoryId', 0);
    // Clear attributes when category is cleared
    setFormData(prev => ({ ...prev, attributes: [] }));
  };

  const getSelectedCategoryPath = () => {
    const path = [];
    if (selectedMainCategory) path.push(selectedMainCategory.name);
    if (selectedSubCategory) path.push(selectedSubCategory.name);
    if (selectedSubSubCategory) path.push(selectedSubSubCategory.name);
    return path.join(' > ');
  };

  // Handle form changes
  const handleInputChange = (field: keyof TrendyolUpdateProductItemRequest, value: any) => {
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

    if (!productDetails) {
      toast.error("Ürün bilgileri yüklenemedi");
      return;
    }

    if (formData.images.length === 0) {
      toast.error("En az bir ürün görseli gereklidir");
      return;
    }

    try {
      setLoading(true);
      const request: TrendyolUpdateProductRequest = {
        items: [formData]
      };

      await updateTrendyolProducts(request);
      toast.success("Ürün başarıyla güncellendi");

      // Refresh product details
      setTimeout(() => {
        if (typeof productId === 'string') {
          loadProductDetails(productId);
        }
      }, 1000);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  // Validation
  const isFormValid = () => {
    return productDetails &&
      formData.title.trim() !== "" &&
      formData.brandId > 0 &&
      formData.categoryId > 0 &&
      formData.stockCode.trim() !== "" &&
      formData.dimensionalWeight >= 0 &&
      formData.description.trim() !== "" &&
      formData.cargoCompanyId > 0 &&
      formData.images.length > 0;
  };



  // Show loading state while initial data is being fetched
  if (detailsLoading || initialLoading) {
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
                  Trendyol Ürün Güncelle
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

          {/* Loading State */}
          <div className="card">
            <div className="card-body text-center py-5">
              <div className="mb-4">
                <div className="spinner-border text-primary" role="status" style={{ width: "3rem", height: "3rem" }}>
                  <span className="visually-hidden">Yükleniyor...</span>
                </div>
              </div>
              <h5 className="mb-2">Ürün Bilgileri Yükleniyor</h5>
              <p className="text-muted mb-4">
                {detailsLoading && "Ürün detayları yükleniyor..."}
                {!detailsLoading && initialLoading && "Form verileri hazırlanıyor..."}
                {!detailsLoading && !initialLoading && "Sayfa hazırlanıyor..."}
              </p>
              <div className="progress" style={{ height: "6px" }}>
                <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{ width: "100%" }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state only after loading is complete and no product is found
  if (!productDetails && !detailsLoading && !initialLoading) {
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
                  Trendyol Ürün Güncelle
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

          {/* Error State */}
          <div className="card">
            <div className="card-body text-center py-5">
              <div className="mb-4">
                <i className="bx bx-error-circle text-danger" style={{ fontSize: "4rem" }}></i>
              </div>
              <h5 className="text-danger mb-3">Ürün Bulunamadı</h5>
              <p className="text-muted mb-4">
                Aradığınız ürün bulunamadı veya erişim izniniz bulunmuyor.
                <br />
                Lütfen geçerli bir ürün ID'si ile sayfaya erişin.
              </p>
              <div className="d-flex gap-2 justify-content-center">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => router.back()}
                >
                  <i className="bx bx-arrow-back me-2"></i>
                  Geri Dön
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => router.push('/admin/trendyol-marketplace/products')}
                >
                  <i className="bx bx-list-ul me-2"></i>
                  Ürün Listesine Git
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
                Trendyol Ürün Güncelle
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
              {/* Product Information Header */}
              <TrendyolProductHeader
                productDetails={productDetails as ProductWithTrendyolResponse}
                title="Güncellenen Ürün "
                showBackButton={false}
                showPriceBadge={true}
                showStockBadge={true}
                compactLayout={false}
                images={formData.images}
              />

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
                        Bu alan değiştirilemez
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

                    <div className="col-md-12" ref={brandDropdownRef}>
                      <label className="form-label">Marka *</label>
                      <div className="position-relative">
                        <div
                          className="form-control d-flex align-items-center"
                          style={{ minHeight: "38px", cursor: "pointer" }}
                          onClick={() => setShowBrandDropdown(!showBrandDropdown)}
                        >
                          {formData.brandId > 0 ? (
                            <span style={{ flex: 1 }}>
                              {productDetails?.trendyolInfo?.brand || "Marka bulunamadı"}
                            </span>
                          ) : (
                            <span style={{ color: "#6c757d", flex: 1 }}>Marka seçin...</span>
                          )}
                          {formData.brandId > 0 && (
                            <button
                              type="button"
                              className="btn-close ms-2"
                              style={{ fontSize: "0.7em" }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleInputChange('brandId', 0);
                              }}
                            />
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

                    <div className="col-md-12" ref={categoryDropdownRef}>
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

                    <div className="col-md-4">
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

              {/* Category Attributes Section */}
              <div className="row mb-4">
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

              {/* Shipping */}
              <div className="row mb-4">
                <div className="col-12">
                  <h6 className="mb-3" style={{ color: "#566a7f", fontWeight: "600" }}>
                    <i className="bx bx-truck me-2"></i>
                    Kargo ve Teslimat
                  </h6>

                  <div className="row g-3">
                    <div className="col-md-4" ref={cargoDropdownRef}>
                      <label className="form-label">Kargo Firması *</label>
                      <div className="position-relative">
                        <div
                          className="form-control d-flex align-items-center"
                          style={{ minHeight: "38px", cursor: "pointer" }}
                          onClick={() => setShowCargoDropdown(!showCargoDropdown)}
                        >
                          {formData.cargoCompanyId > 0 ? (
                            <span style={{ flex: 1 }}>
                              {selectedCargoLoading ? (
                                <span style={{ color: "#6c757d" }}>Kargo firması yükleniyor...</span>
                              ) : selectedCargoProvider?.data?.name ? (
                                selectedCargoProvider.data.name
                              ) : (
                                (cargoProviders as any)?.data?.providers?.find((c: any) => c.id === formData.cargoCompanyId)?.name || "Kargo firması seçildi"
                              )}
                            </span>
                          ) : (
                            <span style={{ color: "#6c757d", flex: 1 }}>Kargo firması seçin...</span>
                          )}
                          {formData.cargoCompanyId > 0 && (
                            <button
                              type="button"
                              className="btn-close ms-2"
                              style={{ fontSize: "0.7em" }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleInputChange('cargoCompanyId', 0);
                              }}
                            />
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

                    <div className="col-md-4" ref={addressDropdownRef}>
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

                    <div className="col-md-4" ref={returningAddressDropdownRef}>
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
                      </div>
                      <small className="text-muted" style={{ fontStyle: "italic", fontSize: "0.75rem" }}>
                        <i className="bx bx-info-circle me-1"></i>
                        Hızlı teslimat seçildiğinde otomatik 1 gün olarak ayarlanır
                      </small>
                    </div>
                  </div>
                </div>
              </div>

              {/* Images */}
              <div className="row mb-4">
                <div className="col-12">
                  <h6 className="mb-3" style={{ color: "#566a7f", fontWeight: "600" }}>
                    <i className="bx bx-images me-2"></i>
                    Ürün Görselleri * (Mevcut: {formData.images.length})
                  </h6>

                  <div className="row g-3">
                    {/* Existing Images */}
                    {formData.images.map((image, index) => (
                      <div key={index} className="col-md-3">
                        <div className="position-relative">
                          <Image
                            width={0}
                            height={0}
                            sizes="100vw"
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
                            title="Resmi sil"
                          >
                            <i className="bx bx-x"></i>
                          </button>
                          {index === 0 && (
                            <span className="badge bg-primary position-absolute bottom-0 start-0 m-1" style={{ fontSize: "0.6rem" }}>
                              Ana Resim
                            </span>
                          )}
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
                          <small className="text-muted d-block mt-1" style={{ fontStyle: "italic", fontSize: "0.75rem" }}>
                            <i className="bx bx-info-circle me-1"></i>
                            Maksimum 8 görsel
                          </small>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Recent Operations */}
              <TrendyolProductOperations
                operations={productDetails?.trendyolProductOperations || []}
                statusOptions={trendyolStatusOptions}
                operationTypes={trendyolOperationTypes}
              />

              {/* Submit Button */}
              <div className="row">
                <div className="col-12 text-end">
                  <div className="d-flex gap-2 justify-content-end">
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => router.back()}
                    >
                      <i className="bx bx-x me-2"></i>
                      İptal
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={!isFormValid() || loading || updateLoading}
                    >
                      {loading || updateLoading ? (
                        <>
                          <div className="spinner-border spinner-border-sm me-2" role="status">
                            <span className="visually-hidden">Güncelleniyor...</span>
                          </div>
                          Güncelleniyor...
                        </>
                      ) : (
                        <>
                          <i className="bx bx-save me-2"></i>
                          Ürünü Güncelle
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpdateTrendyolProductPage;