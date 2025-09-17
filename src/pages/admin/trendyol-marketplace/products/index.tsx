"use client";
import CirclePagination from "@/components/shared/CirclePagination";
import { DiscountSort, LikeCountSort, RatingSort, SalesCountSort } from "@/constants/enums/SortOptions";
import { TrendyolProductStatus } from "@/constants/enums/TrendyolProductStatus";
import { useCategories } from "@/hooks/services/categories/useCategories";
import { useGetAllProductsWithTrendyolList } from "@/hooks/services/admin-trendyol-marketplace/useGetAllProductsWithTrendyolList";
import { useGetTrendyolBrandsHybrid } from "@/hooks/services/admin-trendyol-marketplace/useGetTrendyolBrands";
import { useGetTrendyolProductStatusOptions } from "@/hooks/services/enum-options/useGetTrendyolProductStatusOptions";
import { useBasicProductList, ProductResponse } from "@/hooks/services/products/useBasicProductList";
import { useDeleteTrendyolProducts } from "@/hooks/services/admin-trendyol-marketplace/useDeleteTrendyolProducts";
import { ProductWithTrendyolResponse } from "@/constants/models/trendyol/ProductWithTrendyolResponse";
import Image from "next/image";
import { useEffect, useMemo, useState, useRef, useCallback } from "react";
import { BrandItem } from "@/constants/models/trendyol/BrandListRequest";

function TrendyolProductsPage() {
  // Filter states
  const [filters, setFilters] = useState({
    page: 1,
    pageSize: 20,
    from: 0,
    discountSort: DiscountSort.None,
    ratingSort: RatingSort.None,
    salesCountSort: SalesCountSort.None,
    likeCountSort: LikeCountSort.None,
    mainCategoryId: "",
    subCategoryId: "",
    search: "",
    trendyolStatuses: [] as TrendyolProductStatus[],
    approved: undefined as boolean | undefined,
    onSale: undefined as boolean | undefined,
    archived: undefined as boolean | undefined,
    rejected: undefined as boolean | undefined,
    blacklisted: undefined as boolean | undefined,
    barcode: "",
    stockCode: "",
    productMainId: "",
    startDate: undefined as number | undefined,
    endDate: undefined as number | undefined,
    dateQueryType: "CREATED_DATE" as string | undefined,
    brandIds: [] as number[],
  });

  // Data fetching hooks
  const { getAllProductsWithTrendyolList: fetchProducts, isPending: productsLoading } =
    useGetAllProductsWithTrendyolList();

  const { categories: categoriesData, isLoading: categoriesLoading } = useCategories();

  const {
    brands: brandList,
    hasMore: brandHasMore,
    isLoading: brandsLoading,
    searchLoading: brandSearchLoading,
    isSearchMode: brandSearchMode,
    loadMoreBrands,
    handleScroll: handleBrandScroll,
    searchBrands,
    resetBrands
  } = useGetTrendyolBrandsHybrid();

  // Delete product hook
  const { deleteTrendyolProducts, isPending: isDeleting } = useDeleteTrendyolProducts();

  // Enum options hooks
  const { data: trendyolStatusOptions, isLoading: statusOptionsLoading } =
    useGetTrendyolProductStatusOptions();

  useEffect(() => {
  }, [trendyolStatusOptions]);



  // Products data state
  const [productsData, setProductsData] = useState<any>(null);
  const [initialLoading, setInitialLoading] = useState(true);

  // Brands state
  const [brandSearchTerm, setBrandSearchTerm] = useState("");
  const [showBrandDropdown, setShowBrandDropdown] = useState(false);
  const brandDropdownRef = useRef<HTMLDivElement>(null);

  // Dynamic filter states
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [activeFilterTypes, setActiveFilterTypes] = useState<string[]>([]);
  const [showTrendyolStatusDropdown, setShowTrendyolStatusDropdown] = useState(false);
  const [showGeneralStatusDropdown, setShowGeneralStatusDropdown] = useState(false);
  const [showBrandsDropdown, setShowBrandsDropdown] = useState(false);
  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const [productSearchTerm, setProductSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<ProductResponse | null>(null);
  const filterDropdownRef = useRef<HTMLDivElement>(null);
  const trendyolStatusFilterRef = useRef<HTMLDivElement>(null);
  const generalStatusFilterRef = useRef<HTMLDivElement>(null);
  const brandsFilterRef = useRef<HTMLDivElement>(null);
  const productDropdownRef = useRef<HTMLDivElement>(null);

  // Delete modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState<ProductWithTrendyolResponse | null>(null);

  // Product selection hook
  const { products: allProducts, loading: productListLoading } =
    useBasicProductList();

  // Filter products based on search term
  const productListForSelection = useMemo(() => {
    if (!productSearchTerm) return allProducts;
    return allProducts.filter(product =>
      product.title.toLowerCase().includes(productSearchTerm.toLowerCase()) ||
      product.id.toLowerCase().includes(productSearchTerm.toLowerCase())
    );
  }, [allProducts, productSearchTerm]);

  // Load initial data
  useEffect(() => {
    const initializePage = async () => {
      setInitialLoading(true);
      await loadProducts();
      setInitialLoading(false);
    };
    initializePage();
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (brandDropdownRef.current && !brandDropdownRef.current.contains(event.target as Node)) {
        setShowBrandDropdown(false);
      }
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target as Node)) {
        setShowFilterDropdown(false);
      }
      if (trendyolStatusFilterRef.current && !trendyolStatusFilterRef.current.contains(event.target as Node)) {
        setShowTrendyolStatusDropdown(false);
      }
      if (generalStatusFilterRef.current && !generalStatusFilterRef.current.contains(event.target as Node)) {
        setShowGeneralStatusDropdown(false);
      }
      if (brandsFilterRef.current && !brandsFilterRef.current.contains(event.target as Node)) {
        setShowBrandsDropdown(false);
      }
      if (productDropdownRef.current && !productDropdownRef.current.contains(event.target as Node)) {
        setShowProductDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const loadProducts = async () => {
    try {
      // Backend için uygun formatta request hazırla
      const requestPayload = {
        page: filters.page - 1, // Backend 0-based indexing kullanıyor
        pageSize: filters.pageSize,
        from: filters.from,
        discountSort: filters.discountSort,
        ratingSort: filters.ratingSort,
        salesCountSort: filters.salesCountSort,
        likeCountSort: filters.likeCountSort,
        mainCategoryId: filters.mainCategoryId || null, // Boş string'i null'a çevir
        subCategoryId: filters.subCategoryId || null,
        search: filters.search || null,
        trendyolStatuses: filters.trendyolStatuses.length > 0 ? filters.trendyolStatuses : null,
        approved: filters.approved,
        onSale: filters.onSale,
        archived: filters.archived,
        rejected: filters.rejected,
        blacklisted: filters.blacklisted,
        barcode: filters.barcode || null,
        stockCode: filters.stockCode || null,
        productMainId: filters.productMainId || null,
        startDate: filters.startDate || null,
        endDate: filters.endDate || null,
        dateQueryType: filters.dateQueryType || null,
        brandIds: filters.brandIds.length > 0 ? filters.brandIds : null
      };

      const response = await fetchProducts(requestPayload);
      if (response?.isSucceed) {
        setProductsData(response.data);
      } else {
      }
    } catch (error) {
    }
  };



  // Debounced brand search effect
  const debouncedSearch = useCallback(() => {
    searchBrands(brandSearchTerm.trim());
  }, [brandSearchTerm, searchBrands]);

  useEffect(() => {
    const timer = setTimeout(debouncedSearch, 300);
    return () => clearTimeout(timer);
  }, [brandSearchTerm, debouncedSearch]);

  // Manual filter trigger - removed automatic filtering

  // Selected main category
  const selectedMainCategory = useMemo(() => {
    if (!categoriesData?.items || !filters.mainCategoryId) return null;
    return categoriesData.items.find((cat: any) => cat.id === filters.mainCategoryId);
  }, [categoriesData, filters.mainCategoryId]);

  // Sub categories
  const subCategories = useMemo(() => {
    if (!selectedMainCategory?.subCategories) return [];
    return selectedMainCategory.subCategories;
  }, [selectedMainCategory]);

  // Reset sub category when main category changes
  useEffect(() => {
    if (filters.subCategoryId && !subCategories.find((sub: any) => sub.id === filters.subCategoryId)) {
      setFilters(prev => ({ ...prev, subCategoryId: "", page: 1 }));
    }
  }, [filters.mainCategoryId, subCategories]);

  // Filter update function
  const updateFilter = (key: keyof typeof filters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Brand filter functions
  const filteredBrands = useMemo(() => {
    if (!brandSearchTerm) return brandList;
    return brandList.filter(brand =>
      brand.name.toLowerCase().includes(brandSearchTerm.toLowerCase())
    );
  }, [brandList, brandSearchTerm]);

  const selectedBrands = useMemo(() => {
    return brandList.filter(brand => filters.brandIds.includes(brand.id));
  }, [brandList, filters.brandIds]);

  const toggleBrand = (brandId: number) => {
    const newBrandIds = filters.brandIds.includes(brandId)
      ? filters.brandIds.filter(id => id !== brandId)
      : [...filters.brandIds, brandId];
    setFilters(prev => ({ ...prev, brandIds: newBrandIds }));
  };

  const clearBrands = () => {
    updateFilter('brandIds', []);
  };

  const selectProduct = (product: ProductResponse) => {
    setSelectedProduct(product);
    updateFilter('productMainId', product.id);
    setShowProductDropdown(false);
    setProductSearchTerm("");
  };

  const clearSelectedProduct = () => {
    setSelectedProduct(null);
    updateFilter('productMainId', '');
  };

  // Delete product functions
  const handleDeleteProduct = async () => {
    if (!productToDelete?.barcodeNumber) return;

    try {
      await deleteTrendyolProducts({
        items: [{ barcode: productToDelete.barcodeNumber }]
      });

      // Refresh product list after successful deletion
      setTimeout(() => loadProducts(), 500);

      // Close modal
      setShowDeleteModal(false);
      setProductToDelete(null);
    } catch (error) {
    }
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setProductToDelete(null);
  };

  // Manual filter function
  const applyFilters = () => {
    setFilters(prev => ({ ...prev, page: 1, from: 0 }));
    setTimeout(() => loadProducts(), 0);
  };

  // Status filter functions
  // Get all active filters with their display names and removal functions
  const getActiveFilters = (): Array<{ type: string; name: string; remove: () => void }> => {
    const active: Array<{ type: string; name: string; remove: () => void }> = [];

    // Status filters
    if (filters.approved === true) {
      active.push({
        type: 'status',
        name: 'Onaylı',
        remove: () => updateFilter('approved', undefined)
      });
    }
    if (filters.onSale === true) {
      active.push({
        type: 'status',
        name: 'Satışta',
        remove: () => updateFilter('onSale', undefined)
      });
    }
    if (filters.archived === true) {
      active.push({
        type: 'status',
        name: 'Arşivlenmiş',
        remove: () => updateFilter('archived', undefined)
      });
    }
    if (filters.rejected === true) {
      active.push({
        type: 'status',
        name: 'Reddedilmiş',
        remove: () => updateFilter('rejected', undefined)
      });
    }
    if (filters.blacklisted === true) {
      active.push({
        type: 'status',
        name: 'Kara Listede',
        remove: () => updateFilter('blacklisted', undefined)
      });
    }

    // Trendyol Status
    if (filters.trendyolStatuses.length > 0) {
      const statusNames = filters.trendyolStatuses.map(status => {
        const statusOption = trendyolStatusOptions?.find(option => option.value === status);
        return statusOption?.displayName || `Durum ${status}`;
      }).join(', ');

      active.push({
        type: 'trendyol-status',
        name: statusNames,
        remove: () => updateFilter('trendyolStatuses', [])
      });
    }

    // Brands
    selectedBrands.forEach(brand => {
      active.push({
        type: 'brand',
        name: brand.name,
        remove: () => toggleBrand(brand.id)
      });
    });

    // Search filters
    if (filters.barcode) {
      active.push({
        type: 'search',
        name: `Barkod: ${filters.barcode}`,
        remove: () => updateFilter('barcode', '')
      });
    }
    if (filters.stockCode) {
      active.push({
        type: 'search',
        name: `Stok: ${filters.stockCode}`,
        remove: () => updateFilter('stockCode', '')
      });
    }
    if (filters.productMainId && selectedProduct) {
      active.push({
        type: 'search',
        name: `Ürün: ${selectedProduct.title}`,
        remove: () => clearSelectedProduct()
      });
    }

    return active;
  };

  const toggleStatusFilter = (filterType: 'approved' | 'onSale' | 'archived' | 'rejected' | 'blacklisted') => {
    const currentValue = filters[filterType];
    updateFilter(filterType, currentValue === true ? undefined : true);
  };

  // Add filter type to active filters
  const addFilterType = (filterType: string) => {
    if (!activeFilterTypes.includes(filterType)) {
      setActiveFilterTypes(prev => [...prev, filterType]);
    }
    setShowFilterDropdown(false);
  };

  // Remove filter type and its values
  const removeFilterType = (filterType: string) => {
    setActiveFilterTypes(prev => prev.filter(type => type !== filterType));

    // Clear the filter values when removing filter type
    switch (filterType) {
      case 'trendyol-status':
        updateFilter('trendyolStatuses', []);
        break;
      case 'status-filters':
        updateFilter('approved', undefined);
        updateFilter('onSale', undefined);
        updateFilter('archived', undefined);
        updateFilter('rejected', undefined);
        updateFilter('blacklisted', undefined);
        break;
      case 'brands':
        updateFilter('brandIds', []);
        break;
      case 'barcode':
        updateFilter('barcode', '');
        break;
      case 'stock-code':
        updateFilter('stockCode', '');
        break;
      case 'product-main-id':
        clearSelectedProduct();
        break;
      case 'date-range':
        updateFilter('startDate', undefined);
        updateFilter('endDate', undefined);
        updateFilter('dateQueryType', 'CREATED_DATE');
        break;
    }
  };

  // Get filter type display name
  const getFilterTypeDisplayName = (filterType: string) => {
    switch (filterType) {
      case 'trendyol-status': return 'Trendyol Durumu';
      case 'status-filters': return 'Durum Filtreleri';
      case 'brands': return 'Markalar';
      case 'barcode': return 'Barkod';
      case 'stock-code': return 'Stok Kodu';
      case 'product-main-id': return 'Ürün Seç';
      case 'date-range': return 'Tarih Aralığı';
      default: return filterType;
    }
  };

  // Get status filter display value  
  const getStatusFilterValue = () => {
    const activeStatuses = [];
    if (filters.approved === true) activeStatuses.push('Onaylı');
    if (filters.onSale === true) activeStatuses.push('Satışta');
    if (filters.archived === true) activeStatuses.push('Arşivlenmiş');
    if (filters.rejected === true) activeStatuses.push('Reddedilmiş');
    if (filters.blacklisted === true) activeStatuses.push('Kara Listede');
    return activeStatuses.join(', ') || 'Durum seçin...';
  };

  // Get active status filters for display
  const getActiveStatusFilters = () => {
    const active = [];
    if (filters.approved === true) active.push('Onaylı');
    if (filters.onSale === true) active.push('Satışta');
    if (filters.archived === true) active.push('Arşivlenmiş');
    if (filters.rejected === true) active.push('Reddedilmiş');
    if (filters.blacklisted === true) active.push('Kara Listede');
    return active;
  };

  // Remove individual status filter
  const removeStatusFilter = (statusName: string) => {
    switch (statusName) {
      case 'Onaylı':
        updateFilter('approved', undefined);
        break;
      case 'Satışta':
        updateFilter('onSale', undefined);
        break;
      case 'Arşivlenmiş':
        updateFilter('archived', undefined);
        break;
      case 'Reddedilmiş':
        updateFilter('rejected', undefined);
        break;
      case 'Kara Listede':
        updateFilter('blacklisted', undefined);
        break;
    }
  };

  // Pagination
  const totalCount = productsData?.count || 0;
  const currentProducts = productsData?.items || [];

  // Initialize Bootstrap tooltips when products change
  useEffect(() => {
    // @ts-ignore
    if (typeof window !== 'undefined' && window.bootstrap) {
      const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
      tooltipTriggerList.map(function (tooltipTriggerEl) {
        // @ts-ignore
        return new window.bootstrap.Tooltip(tooltipTriggerEl);
      });
    }
  }, [currentProducts]); // Re-initialize when products change

  const handlePageChange = (pageNumber: number) => {
    setFilters(prev => ({ ...prev, page: pageNumber, from: (pageNumber - 1) * prev.pageSize }));
    // Load products when page changes
    setTimeout(() => loadProducts(), 0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Status badge component
  const StatusBadge = ({ status }: { status?: TrendyolProductStatus }) => {
    if (status === undefined || status === null) {
      return <span className="badge bg-label-secondary" style={{ fontSize: "0.7rem" }}>Belirtilmemiş</span>;
    }

    // Find the status option from dynamic data
    const statusOption = trendyolStatusOptions?.find(option => option.value === status);
    const displayText = statusOption?.displayName || `Durum ${status}`;

    // Define badge classes based on status values
    const getBadgeClass = (statusValue: number) => {
      switch (statusValue) {
        case TrendyolProductStatus.OnSale: return "bg-label-success";
        case TrendyolProductStatus.NotOnSale: return "bg-label-warning";
        case TrendyolProductStatus.PermanentlyDeleted: return "bg-label-danger";
        case TrendyolProductStatus.AwaitingApproval: return "bg-label-info";
        case TrendyolProductStatus.ApprovalFailed: return "bg-label-danger";
        case TrendyolProductStatus.RejectedByTrendyol: return "bg-label-danger";
        case TrendyolProductStatus.ReadyForPublish: return "bg-label-primary";
        case TrendyolProductStatus.BlacklistedByTrendyol: return "bg-label-dark";
        case TrendyolProductStatus.PendingBatchResult: return "bg-label-warning";
        default: return "bg-label-secondary";
      }
    };

    return <span className={`badge ${getBadgeClass(status)}`} style={{ fontSize: "0.7rem", whiteSpace: "normal", lineHeight: "1.2", maxWidth: "100%" }}>{displayText}</span>;
  };

  // Loading state for initial data (categories, status options, products etc.)
  if (categoriesLoading || statusOptionsLoading || initialLoading) {
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
                  Trendyol Ürün Yönetimi
                </h6>
                <button
                  className="btn btn-dark btn-sm"
                  type="button"
                  onClick={() => window.location.href = '/admin/trendyol-marketplace/products/create'}
                  style={{ fontSize: "0.75rem" }}
                >
                  <i className="bx bx-plus me-1"></i>
                  Yeni Ürün Ekle
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
              <h5 className="mb-2">Sayfa Hazırlanıyor</h5>
              <p className="text-muted mb-4">
                {categoriesLoading && "Kategoriler yükleniyor..."}
                {statusOptionsLoading && "Durum seçenekleri yükleniyor..."}
                {initialLoading && !categoriesLoading && !statusOptionsLoading && "Ürünler yükleniyor..."}
                {!categoriesLoading && !statusOptionsLoading && !initialLoading && "Sayfa hazırlanıyor..."}
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
                Trendyol Ürün Yönetimi
              </h6>
              <button
                className="btn btn-dark btn-sm"
                type="button"
                onClick={() => window.location.href = '/admin/trendyol-marketplace/products/create'}
                style={{ fontSize: "0.75rem" }}
              >
                <i className="bx bx-plus me-1"></i>
                Yeni Ürün Ekle
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="card mb-4">
          <div className="card-body">
            <div className="row g-3">
              {/* Search */}
              <div className="col-md-3">
                <label className="form-label" style={{ fontSize: "0.75rem" }}>
                  Ürün Açıklaması Ara
                </label>
                <div className="input-group input-group-sm">
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="Ürün açıklaması..."
                    value={filters.search}
                    onChange={(e) => updateFilter('search', e.target.value)}
                    style={{ fontSize: "0.75rem" }}
                  />
                  {filters.search && (
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      type="button"
                      onClick={() => updateFilter('search', '')}
                    >
                      <i className="bx bx-x"></i>
                    </button>
                  )}
                </div>
              </div>

              {/* Main Category */}
              <div className="col-md-3">
                <label className="form-label" style={{ fontSize: "0.75rem" }}>
                  Ana Kategori
                </label>
                <select
                  className="form-select form-select-sm"
                  value={filters.mainCategoryId}
                  onChange={(e) => updateFilter('mainCategoryId', e.target.value)}
                  disabled={categoriesLoading}
                  style={{ fontSize: "0.75rem" }}
                >
                  <option value="">Tüm Kategoriler</option>
                  {categoriesData?.items?.map((category: any) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sub Category */}
              <div className="col-md-3">
                <label className="form-label" style={{ fontSize: "0.75rem" }}>
                  Alt Kategori
                </label>
                <select
                  className="form-select form-select-sm"
                  value={filters.subCategoryId}
                  onChange={(e) => updateFilter('subCategoryId', e.target.value)}
                  disabled={!selectedMainCategory}
                  style={{ fontSize: "0.75rem" }}
                >
                  <option value="">Tüm Alt Kategoriler</option>
                  {subCategories.map((subCategory: any) => (
                    <option key={subCategory.id} value={subCategory.id}>
                      {subCategory.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filtre Ekle Button */}
              <div className="col-md-3">
                <label className="form-label" style={{ fontSize: "0.75rem" }}>
                  &nbsp;
                </label>
                <div className="position-relative" ref={filterDropdownRef}>
                  <button
                    className="form-control form-control-sm"
                    type="button"
                    onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                    style={{
                      fontSize: "0.75rem",
                      textAlign: "left",
                      cursor: "pointer",
                      backgroundColor: "#fff",
                      border: "1px solid #d9dee3",
                      color: "#697a8d"
                    }}
                  >
                    <i className="bx bx-filter me-1"></i>
                    Filtre Ekle
                  </button>

                  {showFilterDropdown && (
                    <div className="dropdown-menu show mt-1" style={{ minWidth: "200px", zIndex: 1050 }}>
                      {!activeFilterTypes.includes('trendyol-status') && (
                        <button
                          className="dropdown-item"
                          type="button"
                          onClick={() => addFilterType('trendyol-status')}
                        >
                          <i className="bx bx-plus me-2"></i>
                          Trendyol Durumu
                        </button>
                      )}
                      {!activeFilterTypes.includes('status-filters') && (
                        <button
                          className="dropdown-item"
                          type="button"
                          onClick={() => addFilterType('status-filters')}
                        >
                          <i className="bx bx-plus me-2"></i>
                          Durum Filtreleri
                        </button>
                      )}
                      {!activeFilterTypes.includes('brands') && (
                        <button
                          className="dropdown-item"
                          type="button"
                          onClick={() => addFilterType('brands')}
                        >
                          <i className="bx bx-plus me-2"></i>
                          Markalar
                        </button>
                      )}
                      {!activeFilterTypes.includes('barcode') && (
                        <button
                          className="dropdown-item"
                          type="button"
                          onClick={() => addFilterType('barcode')}
                        >
                          <i className="bx bx-plus me-2"></i>
                          Barkod
                        </button>
                      )}
                      {!activeFilterTypes.includes('stock-code') && (
                        <button
                          className="dropdown-item"
                          type="button"
                          onClick={() => addFilterType('stock-code')}
                        >
                          <i className="bx bx-plus me-2"></i>
                          Stok Kodu
                        </button>
                      )}
                      {!activeFilterTypes.includes('product-main-id') && (
                        <button
                          className="dropdown-item"
                          type="button"
                          onClick={() => addFilterType('product-main-id')}
                        >
                          <i className="bx bx-plus me-2"></i>
                          Ürün Seç
                        </button>
                      )}
                      {!activeFilterTypes.includes('date-range') && (
                        <button
                          className="dropdown-item"
                          type="button"
                          onClick={() => addFilterType('date-range')}
                        >
                          <i className="bx bx-plus me-2"></i>
                          Tarih Aralığı
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>


            </div>

            {/* Dynamic Filter Inputs Row */}
            {activeFilterTypes.length > 0 && (
              <div className="row g-3">
                {activeFilterTypes.map((filterType) => (
                  <div key={filterType} className={filterType === 'product-main-id' ? 'col-md-6' : 'col-md-3'}>
                    <label className="form-label" style={{ fontSize: "0.75rem" }}>
                      {getFilterTypeDisplayName(filterType)}
                    </label>
                    <div className="input-group input-group-sm">
                      {/* Trendyol Status Dropdown */}
                      {filterType === 'trendyol-status' && (
                        <div className="position-relative flex-grow-1" ref={trendyolStatusFilterRef}>
                          <div
                            className="form-control form-control-sm d-flex flex-wrap align-items-center gap-1"
                            style={{ minHeight: "32px", cursor: "pointer", padding: "4px 8px" }}
                            onClick={() => setShowTrendyolStatusDropdown(!showTrendyolStatusDropdown)}
                          >
                            {statusOptionsLoading ? (
                              <span style={{ fontSize: "0.75rem", color: "#6c757d" }}>Yükleniyor...</span>
                            ) : filters.trendyolStatuses.length > 0 ? (
                              filters.trendyolStatuses.map((status) => {
                                const statusOption = trendyolStatusOptions?.find(option => option.value === status);
                                return (
                                  <span key={status} className="badge bg-light border d-flex align-items-center" style={{ fontSize: "0.7rem", color: "#495057" }}>
                                    {statusOption?.displayName || `Durum ${status}`}
                                    <button
                                      type="button"
                                      className="btn-close ms-1"
                                      style={{ fontSize: "0.5em" }}
                                      onClick={e => {
                                        e.stopPropagation();
                                        updateFilter('trendyolStatuses', filters.trendyolStatuses.filter(s => s !== status));
                                      }}
                                    />
                                  </span>
                                );
                              })
                            ) : (
                              <span style={{ fontSize: "0.75rem", color: "#6c757d" }}>Durum seçin...</span>
                            )}
                            <i className="bx bx-chevron-down ms-auto" style={{ fontSize: "0.8em", color: "#6c757d" }}></i>
                          </div>
                          {showTrendyolStatusDropdown && (
                            <div className="dropdown-menu show w-100" style={{ zIndex: 1050, maxHeight: 300, overflowY: 'auto' }}>
                              <div className="px-3 py-2">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                  <small style={{ fontSize: "0.75rem", fontWeight: "500" }}>Trendyol Durumları</small>
                                  <button
                                    type="button"
                                    className="btn-close"
                                    style={{ fontSize: "0.7em" }}
                                    onClick={() => setShowTrendyolStatusDropdown(false)}
                                  />
                                </div>
                                {statusOptionsLoading ? (
                                  <div className="text-center py-3">
                                    <div className="spinner-border spinner-border-sm text-primary" role="status">
                                      <span className="visually-hidden">Yükleniyor...</span>
                                    </div>
                                    <small className="d-block mt-1" style={{ fontSize: "0.7rem", color: "#6c757d" }}>Durumlar yükleniyor...</small>
                                  </div>
                                ) : trendyolStatusOptions && trendyolStatusOptions.length > 0 ? (
                                  <div className="d-flex flex-column gap-2">
                                    {trendyolStatusOptions.map(option => (
                                      <div key={option.value} className="form-check">
                                        <input
                                          className="form-check-input"
                                          type="checkbox"
                                          id={`trendyol-status-${option.value}`}
                                          checked={filters.trendyolStatuses.includes(option.value)}
                                          onChange={() => {
                                            if (filters.trendyolStatuses.includes(option.value)) {
                                              updateFilter('trendyolStatuses', filters.trendyolStatuses.filter(s => s !== option.value));
                                            } else {
                                              updateFilter('trendyolStatuses', [...filters.trendyolStatuses, option.value]);
                                            }
                                          }}
                                        />
                                        <label className="form-check-label" htmlFor={`trendyol-status-${option.value}`} style={{ fontSize: "0.75rem" }}>{option.displayName}</label>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="text-center py-3">
                                    <small style={{ fontSize: "0.7rem", color: "#6c757d" }}>Durum seçeneği bulunamadı</small>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Status Filters Input */}
                      {filterType === 'status-filters' && (
                        <div className="position-relative flex-grow-1" ref={generalStatusFilterRef}>
                          <div
                            className="form-control form-control-sm d-flex flex-wrap align-items-center gap-1"
                            style={{ minHeight: "32px", cursor: "pointer", padding: "4px 8px" }}
                            onClick={() => setShowGeneralStatusDropdown(!showGeneralStatusDropdown)}
                          >
                            {getActiveStatusFilters().map((status) => (
                              <span key={status} className="badge bg-light border d-flex align-items-center" style={{ fontSize: "0.7rem", color: "#495057" }}>
                                {status}
                                <button
                                  type="button"
                                  className="btn-close ms-1"
                                  style={{ fontSize: "0.5em" }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeStatusFilter(status);
                                  }}
                                />
                              </span>
                            ))}
                            {getActiveStatusFilters().length === 0 && (
                              <span style={{ fontSize: "0.75rem", color: "#6c757d" }}>Durum seçin...</span>
                            )}
                            <i className="bx bx-chevron-down ms-auto" style={{ fontSize: "0.8em", color: "#6c757d" }}></i>
                          </div>
                          {showGeneralStatusDropdown && (
                            <div className="dropdown-menu show w-100" style={{ zIndex: 1050 }}>
                              <div className="px-3 py-2">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                  <small style={{ fontSize: "0.75rem", fontWeight: "500" }}>Durum Filtreleri</small>
                                  <button
                                    type="button"
                                    className="btn-close"
                                    style={{ fontSize: "0.7em" }}
                                    onClick={() => setShowGeneralStatusDropdown(false)}
                                  />
                                </div>
                                <div className="d-flex flex-column gap-2">
                                  <div className="form-check">
                                    <input
                                      className="form-check-input"
                                      type="checkbox"
                                      id="approved-filter"
                                      checked={filters.approved === true}
                                      onChange={() => toggleStatusFilter('approved')}
                                    />
                                    <label className="form-check-label" htmlFor="approved-filter" style={{ fontSize: "0.75rem" }}>Onaylı</label>
                                  </div>
                                  <div className="form-check">
                                    <input
                                      className="form-check-input"
                                      type="checkbox"
                                      id="onSale-filter"
                                      checked={filters.onSale === true}
                                      onChange={() => toggleStatusFilter('onSale')}
                                    />
                                    <label className="form-check-label" htmlFor="onSale-filter" style={{ fontSize: "0.75rem" }}>Satışta</label>
                                  </div>
                                  <div className="form-check">
                                    <input
                                      className="form-check-input"
                                      type="checkbox"
                                      id="archived-filter"
                                      checked={filters.archived === true}
                                      onChange={() => toggleStatusFilter('archived')}
                                    />
                                    <label className="form-check-label" htmlFor="archived-filter" style={{ fontSize: "0.75rem" }}>Arşivlenmiş</label>
                                  </div>
                                  <div className="form-check">
                                    <input
                                      className="form-check-input"
                                      type="checkbox"
                                      id="rejected-filter"
                                      checked={filters.rejected === true}
                                      onChange={() => toggleStatusFilter('rejected')}
                                    />
                                    <label className="form-check-label" htmlFor="rejected-filter" style={{ fontSize: "0.75rem" }}>Reddedilmiş</label>
                                  </div>
                                  <div className="form-check">
                                    <input
                                      className="form-check-input"
                                      type="checkbox"
                                      id="blacklisted-filter"
                                      checked={filters.blacklisted === true}
                                      onChange={() => toggleStatusFilter('blacklisted')}
                                    />
                                    <label className="form-check-label" htmlFor="blacklisted-filter" style={{ fontSize: "0.75rem" }}>Kara Listede</label>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Brands Input */}
                      {filterType === 'brands' && (
                        <div className="position-relative flex-grow-1" ref={brandsFilterRef}>
                          <div
                            className="form-control form-control-sm d-flex flex-wrap align-items-center gap-1"
                            style={{ minHeight: "32px", cursor: "pointer", padding: "4px 8px" }}
                            onClick={() => setShowBrandsDropdown(!showBrandsDropdown)}
                          >
                            {selectedBrands.map((brand) => (
                              <span key={brand.id} className="badge bg-light border d-flex align-items-center" style={{ fontSize: "0.7rem", color: "#495057" }}>
                                {brand.name}
                                <button
                                  type="button"
                                  className="btn-close ms-1"
                                  style={{ fontSize: "0.5em" }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleBrand(brand.id);
                                  }}
                                />
                              </span>
                            ))}
                            {selectedBrands.length === 0 && (
                              <span style={{ fontSize: "0.75rem", color: "#6c757d" }}>Marka seçin...</span>
                            )}
                            <i className="bx bx-chevron-down ms-auto" style={{ fontSize: "0.8em", color: "#6c757d" }}></i>
                          </div>
                          {showBrandsDropdown && (
                            <div className="dropdown-menu show w-100" style={{ maxHeight: "300px", overflowY: "auto", zIndex: 1050 }}>
                              <div className="px-3 py-2">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                  <small style={{ fontSize: "0.75rem", fontWeight: "500" }}>Markalar</small>
                                  <button
                                    type="button"
                                    className="btn-close"
                                    style={{ fontSize: "0.7em" }}
                                    onClick={() => setShowBrandsDropdown(false)}
                                  />
                                </div>
                                <div className="mb-2">
                                  <input
                                    type="text"
                                    className="form-control form-control-sm"
                                    placeholder="Marka ara..."
                                    value={brandSearchTerm}
                                    onChange={(e) => setBrandSearchTerm(e.target.value)}
                                    style={{ fontSize: "0.75rem" }}
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                </div>
                                {(brandsLoading || brandSearchLoading) ? (
                                  <div className="text-center py-3">
                                    <div className="spinner-border spinner-border-sm text-primary" role="status">
                                      <span className="visually-hidden">Yükleniyor...</span>
                                    </div>
                                    <small className="d-block mt-1 text-muted" style={{ fontSize: "0.7rem" }}>
                                      {brandSearchLoading ? "Markalar aranıyor..." : "Markalar yükleniyor..."}
                                    </small>
                                  </div>
                                ) : filteredBrands.length > 0 ? (
                                  <div
                                    className="d-flex flex-column gap-2"
                                    style={{ maxHeight: "180px", overflowY: "auto" }}
                                    onScroll={handleBrandScroll}
                                  >
                                    {filteredBrands.map((brand) => (
                                      <div key={brand.id} className="form-check">
                                        <input
                                          className="form-check-input"
                                          type="checkbox"
                                          id={`brand-${brand.id}`}
                                          checked={filters.brandIds.includes(brand.id)}
                                          onChange={() => toggleBrand(brand.id)}
                                        />
                                        <label className="form-check-label" htmlFor={`brand-${brand.id}`} style={{ fontSize: "0.75rem" }}>{brand.name}</label>
                                      </div>
                                    ))}
                                    {!brandSearchMode && brandHasMore && (
                                      <div className="text-center py-2">
                                        <small className="text-muted" style={{ fontSize: "0.7rem" }}>Daha fazla marka görmek için aşağı kaydırın</small>
                                      </div>
                                    )}
                                    {brandsLoading && brandHasMore && (
                                      <div className="text-center py-2">
                                        <div className="spinner-border spinner-border-sm text-primary" role="status">
                                          <span className="visually-hidden">Yükleniyor...</span>
                                        </div>
                                        <small className="d-block mt-1 text-muted" style={{ fontSize: "0.7rem" }}>Daha fazla marka yükleniyor...</small>
                                      </div>
                                    )}
                                  </div>
                                ) : (
                                  <div className="text-center py-3">
                                    <small className="text-muted" style={{ fontSize: "0.7rem" }}>
                                      {brandSearchMode ? "Arama kriterine uygun marka bulunamadı. Daha fazla marka görmek için aşağı kaydırın." : "Marka bulunamadı"}
                                    </small>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Barcode Input */}
                      {filterType === 'barcode' && (
                        <div className="position-relative flex-grow-1">
                          <div
                            className="form-control form-control-sm d-flex align-items-center"
                            style={{ minHeight: "32px", padding: "4px 8px" }}
                          >
                            <input
                              type="text"
                              className="border-0 flex-grow-1"
                              placeholder="Barkod numarası..."
                              value={filters.barcode}
                              onChange={(e) => updateFilter('barcode', e.target.value)}
                              style={{ fontSize: "0.75rem", outline: "none" }}
                            />
                            {filters.barcode && (
                              <button
                                className="btn btn-link btn-sm p-0 ms-2"
                                type="button"
                                onClick={() => updateFilter('barcode', '')}
                                style={{ fontSize: "0.75rem", color: "#6c757d" }}
                              >
                                <i className="bx bx-x"></i>
                              </button>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Stock Code Input */}
                      {filterType === 'stock-code' && (
                        <div className="position-relative flex-grow-1">
                          <div
                            className="form-control form-control-sm d-flex align-items-center"
                            style={{ minHeight: "32px", padding: "4px 8px" }}
                          >
                            <input
                              type="text"
                              className="border-0 flex-grow-1"
                              placeholder="Stok kodu..."
                              value={filters.stockCode}
                              onChange={(e) => updateFilter('stockCode', e.target.value)}
                              style={{ fontSize: "0.75rem", outline: "none" }}
                            />
                            {filters.stockCode && (
                              <button
                                className="btn btn-link btn-sm p-0 ms-2"
                                type="button"
                                onClick={() => updateFilter('stockCode', '')}
                                style={{ fontSize: "0.75rem", color: "#6c757d" }}
                              >
                                <i className="bx bx-x"></i>
                              </button>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Product Main ID Input */}
                      {filterType === 'product-main-id' && (
                        <div className="position-relative flex-grow-1" ref={productDropdownRef}>
                          <div
                            className="form-control form-control-sm d-flex align-items-center"
                            style={{ minHeight: "32px", cursor: "pointer", padding: "4px 8px" }}
                            onClick={() => setShowProductDropdown(!showProductDropdown)}
                          >
                            {selectedProduct ? (
                              <span style={{ fontSize: "0.75rem", color: "#495057", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1, minWidth: 0 }}>{selectedProduct.title}</span>
                            ) : (
                              <span style={{ fontSize: "0.75rem", color: "#6c757d", flex: 1, minWidth: 0 }}>Ürün seçin...</span>
                            )}
                            {selectedProduct && (
                              <button
                                type="button"
                                className="btn-close"
                                style={{ fontSize: "0.5em", flexShrink: 0, marginRight: "4px" }}
                                onClick={e => {
                                  e.stopPropagation();
                                  clearSelectedProduct();
                                }}
                              />
                            )}
                            <i className="bx bx-chevron-down" style={{ fontSize: "0.8em", color: "#6c757d", flexShrink: 0 }}></i>
                          </div>
                          {showProductDropdown && (
                            <div className="dropdown-menu show w-100" style={{ zIndex: 1050, maxHeight: 300, overflowY: 'auto', minWidth: "600px" }}>
                              <div className="px-3 py-2">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                  <small style={{ fontSize: "0.75rem", fontWeight: "500" }}>Ürün Seç</small>
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
                                    style={{ fontSize: "0.75rem" }}
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                </div>
                                {productListLoading ? (
                                  <div className="text-center py-3">
                                    <div className="spinner-border spinner-border-sm text-primary" role="status">
                                      <span className="visually-hidden">Yükleniyor...</span>
                                    </div>
                                    <small className="d-block mt-1" style={{ fontSize: "0.7rem", color: "#6c757d" }}>Ürünler yükleniyor...</small>
                                  </div>
                                ) : productListForSelection && productListForSelection.length > 0 ? (
                                  <div className="d-flex flex-column gap-1" style={{ maxHeight: 200, overflowY: 'auto' }}>
                                    {productListForSelection.map(product => (
                                      <button
                                        key={product.id}
                                        type="button"
                                        className="btn btn-link btn-sm text-start p-2"
                                        onClick={() => selectProduct(product)}
                                        style={{ fontSize: "0.75rem", color: "#495057", border: "none", background: "none", textAlign: "left" }}
                                      >
                                        <div className="fw-medium" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                          {product.title}
                                        </div>
                                      </button>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="text-center py-3">
                                    <small style={{ fontSize: "0.7rem", color: "#6c757d" }}>
                                      {productSearchTerm ? "Ürün bulunamadı" : "Ürün aramak için yazmaya başlayın"}
                                    </small>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Date Range Input */}
                      {filterType === 'date-range' && (
                        <div className="d-flex flex-column gap-3">
                          {/* Tarih Türü Seçimi */}
                          <div className="d-flex align-items-center gap-2">
                            <select
                              className="form-select form-select-sm"
                              value={filters.dateQueryType || ''}
                              onChange={(e) => updateFilter('dateQueryType', e.target.value || undefined)}
                              style={{ fontSize: "0.75rem", flex: "1" }}
                            >
                              <option value="CREATED_DATE">📅 Oluşturma Tarihi</option>
                              <option value="LAST_MODIFIED_DATE">🔄 Son Güncelleme</option>
                              <option value="LISTED_DATE">📋 Listeleme Tarihi</option>
                            </select>
                            {(filters.startDate || filters.endDate) && (
                              <button
                                className="btn btn-outline-danger btn-sm"
                                type="button"
                                onClick={() => {
                                  updateFilter('startDate', undefined);
                                  updateFilter('endDate', undefined);
                                }}
                                style={{ fontSize: "0.75rem" }}
                                title="Tarih aralığını temizle"
                              >
                                <i className="bx bx-trash"></i>
                              </button>
                            )}
                          </div>

                          {/* Hızlı Tarih Seçenekleri */}
                          <div className="d-flex flex-wrap gap-1">
                            <button
                              type="button"
                              className="btn btn-outline-secondary btn-sm"
                              onClick={() => {
                                const today = new Date();
                                const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
                                updateFilter('startDate', weekAgo.getTime());
                                updateFilter('endDate', today.getTime());
                              }}
                              style={{ fontSize: "0.7rem" }}
                            >
                              Son 7 Gün
                            </button>
                            <button
                              type="button"
                              className="btn btn-outline-secondary btn-sm"
                              onClick={() => {
                                const today = new Date();
                                const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
                                updateFilter('startDate', monthAgo.getTime());
                                updateFilter('endDate', today.getTime());
                              }}
                              style={{ fontSize: "0.7rem" }}
                            >
                              Son 30 Gün
                            </button>
                            <button
                              type="button"
                              className="btn btn-outline-secondary btn-sm"
                              onClick={() => {
                                const today = new Date();
                                const threeMonthsAgo = new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000);
                                updateFilter('startDate', threeMonthsAgo.getTime());
                                updateFilter('endDate', today.getTime());
                              }}
                              style={{ fontSize: "0.7rem" }}
                            >
                              Son 3 Ay
                            </button>
                            <button
                              type="button"
                              className="btn btn-outline-secondary btn-sm"
                              onClick={() => {
                                updateFilter('startDate', undefined);
                                updateFilter('endDate', undefined);
                              }}
                              style={{ fontSize: "0.7rem" }}
                            >
                              Temizle
                            </button>
                          </div>

                          {/* Tarih Aralığı Seçimi */}
                          <div className="d-flex gap-2">
                            <div className="flex-grow-1">
                              <div className="input-group input-group-sm">
                                <span className="input-group-text" style={{ fontSize: "0.7rem", backgroundColor: "#f8f9fa" }}>
                                  <i className="bx bx-calendar"></i>
                                </span>
                                <input
                                  type="date"
                                  className="form-control form-control-sm"
                                  value={filters.startDate ? new Date(filters.startDate).toISOString().split('T')[0] : ''}
                                  onChange={(e) => {
                                    const date = e.target.value ? new Date(e.target.value).getTime() : undefined;
                                    updateFilter('startDate', date);
                                  }}
                                  style={{ fontSize: "0.75rem" }}
                                  max={filters.endDate ? new Date(filters.endDate).toISOString().split('T')[0] : undefined}
                                />
                              </div>
                              <small className="text-muted" style={{ fontSize: "0.65rem" }}>Başlangıç</small>
                            </div>
                            <div className="d-flex align-items-center">
                              <i className="bx bx-right-arrow-alt" style={{ fontSize: "1.2rem", color: "#6c757d" }}></i>
                            </div>
                            <div className="flex-grow-1">
                              <div className="input-group input-group-sm">
                                <input
                                  type="date"
                                  className="form-control form-control-sm"
                                  value={filters.endDate ? new Date(filters.endDate).toISOString().split('T')[0] : ''}
                                  onChange={(e) => {
                                    const date = e.target.value ? new Date(e.target.value).getTime() : undefined;
                                    updateFilter('endDate', date);
                                  }}
                                  style={{ fontSize: "0.75rem" }}
                                  min={filters.startDate ? new Date(filters.startDate).toISOString().split('T')[0] : undefined}
                                />
                                <span className="input-group-text" style={{ fontSize: "0.7rem", backgroundColor: "#f8f9fa" }}>
                                  <i className="bx bx-calendar"></i>
                                </span>
                              </div>
                              <small className="text-muted" style={{ fontSize: "0.65rem" }}>Bitiş</small>
                            </div>
                          </div>

                          {/* Seçilen Tarih Aralığı Özeti */}
                          {(filters.startDate || filters.endDate) && (
                            <div className="alert alert-info py-2" style={{ fontSize: "0.75rem", margin: 0 }}>
                              <div className="d-flex align-items-center gap-2">
                                <i className="bx bx-info-circle"></i>
                                <span>
                                  <strong>Seçilen Aralık:</strong> {
                                    filters.startDate && filters.endDate
                                      ? `${new Date(filters.startDate).toLocaleDateString('tr-TR')} - ${new Date(filters.endDate).toLocaleDateString('tr-TR')}`
                                      : filters.startDate
                                        ? `${new Date(filters.startDate).toLocaleDateString('tr-TR')} ve sonrası`
                                        : `${new Date(filters.endDate!).toLocaleDateString('tr-TR')} ve öncesi`
                                  }
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Remove Filter Button */}
                      <button
                        className="btn btn-outline-secondary btn-sm"
                        type="button"
                        onClick={() => removeFilterType(filterType)}
                        title="Filtreyi kaldır"
                      >
                        <i className="bx bx-x"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}


            {/* Action Buttons Row */}
            <div className="row g-3 mt-2">
              <div className="col-md-6">
                {(filters.search ||
                  filters.mainCategoryId ||
                  filters.subCategoryId ||
                  activeFilterTypes.length > 0) && (
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      type="button"
                      onClick={() => {
                        setFilters({
                          ...filters,
                          search: '',
                          mainCategoryId: '',
                          subCategoryId: '',
                          trendyolStatuses: [],
                          brandIds: [],
                          approved: undefined,
                          onSale: undefined,
                          archived: undefined,
                          rejected: undefined,
                          blacklisted: undefined,
                          barcode: '',
                          stockCode: '',
                          productMainId: '',
                          startDate: undefined,
                          endDate: undefined,
                          dateQueryType: 'CREATED_DATE',
                          page: 1,
                          from: 0
                        });
                        setActiveFilterTypes([]);
                        setSelectedProduct(null);
                        setProductSearchTerm("");
                        // Don't auto-filter after clearing - user needs to click "Filtrele"
                      }}
                      style={{ fontSize: "0.75rem" }}
                    >
                      <i className="bx bx-refresh me-1"></i>
                      Tüm Filtreleri Temizle
                    </button>
                  )}
              </div>
              <div className="col-md-6 d-flex justify-content-end">
                <button
                  className="btn btn-primary btn-sm"
                  type="button"
                  onClick={applyFilters}
                  disabled={productsLoading}
                  style={{ fontSize: "0.75rem" }}
                >
                  {productsLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                      Filtreleniyor...
                    </>
                  ) : (
                    <>
                      <i className="bx bx-search me-1"></i>
                      Filtrele
                    </>
                  )}
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Products List */}
        {productsLoading ? (
          <div className="card">
            <div className="card-body text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Yükleniyor...</span>
              </div>
            </div>
          </div>
        ) : currentProducts.length > 0 ? (
          <div className="row g-3 mb-4">
            {currentProducts.map((product: ProductWithTrendyolResponse) => (
              <div
                key={product.id}
                className="col-12 col-sm-6 col-md-4 col-xl-3"
              >
                <div className="card h-100">
                  <div className="position-relative">
                    {product.trendyolInfo && (
                      <div
                        className="position-absolute top-0 start-0 m-2"
                        style={{ zIndex: 1 }}
                      >
                        <span className="badge bg-label-success" style={{ fontSize: "0.7rem" }}>Trendyol</span>
                      </div>
                    )}
                    <Image
                      width={0}
                      height={0}
                      sizes="100vw"
                      src={product.baseImageUrl || "/assets/images/no-image.jpg"}
                      alt={product.title}
                      className="card-img-top"
                      style={{ height: "200px", objectFit: "contain" }}
                    />
                    <div
                      className="position-absolute top-0 end-0 m-2"
                      style={{ zIndex: 1 }}
                    >
                      <div className="btn-group">
                        <button
                          className="btn btn-sm btn-light"
                          style={{ fontSize: "0.75rem" }}
                          data-bs-toggle="tooltip"
                          data-bs-placement="top"
                          title="Ürün Güncelle"
                          onClick={() => window.location.href = `/admin/trendyol-marketplace/products/update?productId=${product.id}`}
                        >
                          <i className="bx bx-cog text-primary"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-light"
                          style={{ fontSize: "0.75rem" }}
                          data-bs-toggle="tooltip"
                          data-bs-placement="top"
                          title="Stok/Fiyat Güncelle"
                          onClick={() => window.location.href = `/admin/trendyol-marketplace/products/update-price-inventory?productId=${product.id}`}
                        >
                          <i className="bx bx-dollar text-warning"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-light"
                          style={{ fontSize: "0.75rem" }}
                          data-bs-toggle="tooltip"
                          data-bs-placement="top"
                          title="Ürünü Sil"
                          onClick={() => {
                            setProductToDelete(product);
                            setShowDeleteModal(true);
                          }}
                        >
                          <i className="bx bx-trash text-danger"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="card-body p-3">
                    <h6
                      className="card-title mb-1"
                      style={{ fontSize: "0.8rem" }}
                    >
                      {product.title}
                    </h6>
                    <div className="d-flex justify-content-between align-items-center mt-2">
                      <span
                        className={`badge ${product.sellableQuantity > 0 ? 'bg-label-success' : 'bg-label-danger'}`}
                        style={{ fontSize: "0.8rem" }}
                      >
                        <strong>Stok:</strong> {product.sellableQuantity}
                      </span>
                      <span style={{ fontSize: "0.9rem", fontWeight: "600" }}>
                        ₺{product.price.toLocaleString()}
                      </span>
                    </div>
                    {product.discountedPrice > 0 && product.discountedPrice !== product.price && (
                      <div className="mt-1">
                        <span className="text-success" style={{ fontSize: "0.75rem" }}>
                          İndirimli: ₺{product.discountedPrice.toLocaleString()}
                        </span>
                      </div>
                    )}
                    <div className="mt-2">
                      <StatusBadge status={product.trendyolStatus} />
                    </div>
                    <small
                      className="d-block mt-2"
                      style={{ fontSize: "0.75rem", fontWeight: "600" }}
                    >
                      <strong>Barkod:</strong> {product.barcodeNumber}
                    </small>
                    {product.trendyolInfo?.stockCode && (
                      <small
                        className="text-info d-block"
                        style={{ fontSize: "0.75rem", fontWeight: "600" }}
                      >
                        <strong>Stok Kodu:</strong> {product.trendyolInfo.stockCode}
                      </small>
                    )}
                    {product.trendyolInfo?.attributes && (
                      <small
                        className="d-block"
                        style={{ fontSize: "0.75rem", fontWeight: "600" }}
                      >
                        <strong>Renk:</strong> {product.trendyolInfo.attributes.find(attr => attr.attributeName === 'Renk')?.attributeValue || 'Belirtilmemiş'}
                      </small>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card">
            <div className="card-body text-center py-5">
              <i
                className="bx bx-package mb-2"
                style={{ fontSize: "3rem", color: "#d9dee3" }}
              ></i>
              <h6 style={{ fontSize: "0.9rem" }}>Ürün bulunamadı</h6>
              <p className="text-muted mb-3" style={{ fontSize: "0.8rem" }}>
                Filtrelere uygun Trendyol ürünü bulunmamaktadır.
              </p>
            </div>
          </div>
        )}

        {/* Page Info and Pagination */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mt-4 border-top pt-3">
          <div
            className="text-muted mb-3 mb-md-0"
            style={{ fontSize: "0.813rem" }}
          >
            {filters.search
              ? `"${filters.search}" aramasına uygun ${totalCount} ürün bulundu - Sayfa ${filters.page}/${Math.ceil(totalCount / filters.pageSize)}`
              : `Toplam ${totalCount} ürün içinden ${(filters.page - 1) * filters.pageSize + 1
              }-${Math.min(
                filters.page * filters.pageSize,
                totalCount
              )} arası gösteriliyor`}
          </div>

          {/* CirclePagination componentini sadece birden fazla sayfa varsa göster */}
          {totalCount > filters.pageSize && (
            <CirclePagination
              totalCount={totalCount}
              currentPage={filters.page}
              pageSize={filters.pageSize}
              onPageChange={(page) => handlePageChange(page)}
            />
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && productToDelete && (
          <div className="modal fade show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header border-0 pb-0">
                  <h5 className="modal-title text-danger d-flex align-items-center">
                    <i className="bx bx-trash me-2"></i>
                    Ürün Silme Onayı
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={handleCloseDeleteModal}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="alert alert-warning d-flex align-items-center mb-4">
                    <i className="bx bx-error-circle me-2"></i>
                    <div>
                      <strong>Dikkat!</strong> Bu işlemin geri dönüşü olmayacaktır. Silmek istediğinizden emin misiniz?
                    </div>
                  </div>

                  {/* Product Information */}
                  <div className="card border">
                    <div className="card-body p-3">
                      <div className="d-flex gap-3">
                        <div className="flex-shrink-0">
                          <Image
                            width={80}
                            height={80}
                            src={productToDelete.baseImageUrl || "/assets/images/no-image.jpg"}
                            alt={productToDelete.title}
                            className="rounded"
                            style={{ objectFit: "contain" }}
                          />
                        </div>
                        <div className="flex-grow-1">
                          <h6 className="mb-2" style={{ fontSize: "0.9rem", fontWeight: "600" }}>
                            {productToDelete.title}
                          </h6>

                          <div className="row g-2 mb-2">
                            <div className="col-6">
                              <div className="d-flex align-items-center gap-2">
                                <small className="text-muted" style={{ fontSize: "0.75rem" }}>Barkod:</small>
                                <span style={{ fontSize: "0.8rem", fontWeight: "500" }}>{productToDelete.barcodeNumber}</span>
                              </div>
                            </div>
                            <div className="col-6">
                              <div className="d-flex align-items-center gap-2">
                                <small className="text-muted" style={{ fontSize: "0.75rem" }}>Fiyat:</small>
                                <span style={{ fontSize: "0.8rem", fontWeight: "500" }}>₺{productToDelete.price.toLocaleString()}</span>
                              </div>
                            </div>
                          </div>

                          <div className="row g-2 mb-2">
                            <div className="col-6">
                              <div className="d-flex align-items-center gap-2">
                                <small className="text-muted" style={{ fontSize: "0.75rem" }}>Stok:</small>
                                <span className={`badge ${productToDelete.sellableQuantity > 0 ? 'bg-label-success' : 'bg-label-danger'}`} style={{ fontSize: "0.7rem" }}>
                                  {productToDelete.sellableQuantity}
                                </span>
                              </div>
                            </div>
                            <div className="col-6">
                              <div className="d-flex align-items-center gap-2">
                                <small className="text-muted" style={{ fontSize: "0.75rem" }}>Trendyol Stok Kodu:</small>
                                <span style={{ fontSize: "0.8rem", fontWeight: "500" }}>
                                  {productToDelete.trendyolInfo?.stockCode || '0'}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="mb-2">
                            <div className="d-flex align-items-center gap-2">
                              <small className="text-muted" style={{ fontSize: "0.75rem" }}>Trendyol Durumu:</small>
                              <StatusBadge status={productToDelete.trendyolStatus} />
                            </div>
                          </div>

                          {productToDelete.trendyolInfo && (
                            <>
                              {productToDelete.trendyolInfo.attributes && (
                                <div className="mb-2">
                                  <small className="text-muted d-block" style={{ fontSize: "0.75rem" }}>Özellikler:</small>
                                  <div className="d-flex flex-wrap gap-1">
                                    {productToDelete.trendyolInfo.attributes.map((attr, index) => (
                                      <span key={index} className="badge bg-light text-dark border" style={{ fontSize: "0.7rem" }}>
                                        {attr.attributeName}: {attr.attributeValue}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-0 pt-0">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={handleCloseDeleteModal}
                    disabled={isDeleting}
                  >
                    İptal
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={handleDeleteProduct}
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Siliniyor...
                      </>
                    ) : (
                      <>
                        <i className="bx bx-trash me-1"></i>
                        Ürünü Sil
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .card {
          border-radius: 0.5rem;
          border: 1px solid #eee;
          box-shadow: none;
        }
        .btn {
          border-radius: 3px;
        }
        .form-select,
        .form-control {
          border-radius: 3px;
        }
        .badge {
          font-weight: 500;
          padding: 0.35em 0.65em;
        }
        .bg-label-primary {
          background-color: #e7e7ff;
          color: #696cff;
        }
        .bg-label-success {
          background-color: #e8fadf;
          color: #71dd37;
        }
        .bg-label-danger {
          background-color: #ffecec;
          color: #ff3e1d;
        }
        .bg-label-warning {
          background-color: #fff2e1;
          color: #ffab00;
        }
        .bg-label-info {
          background-color: #e1f5fe;
          color: #03c3ec;
        }
        .bg-label-secondary {
          background-color: #f5f5f9;
          color: #8592a3;
        }
        .bg-label-dark {
          background-color: #e8e8e8;
          color: #233446;
        }
        .dropdown-menu.show {
          display: block;
        }
        .pagination {
          margin: 0;
        }
        .page-link {
          border: 1px solid #d9dee3;
          min-width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.25rem;
          font-size: 0.75rem;
          color: #697a8d;
        }
        .page-item.active .page-link {
          background-color: #696cff;
          border-color: #696cff;
          color: #fff;
        }
        .page-item.disabled .page-link {
          color: #adb5bd;
          opacity: 0.65;
        }
        .page-link i {
          font-size: 1rem;
        }
      `}</style>
    </div>
  );
}

export default TrendyolProductsPage;