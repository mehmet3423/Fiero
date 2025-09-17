import React, { useState } from 'react';
import Image from 'next/image';
import { TrendyolProductOperationResponse } from '@/constants/models/trendyol/ProductWithTrendyolResponse';
import { useGetTrendyolCategoryAttributes } from '@/hooks/services/admin-trendyol-marketplace/useGetTrendyolCategoryAttributes';
import { useGetTrendyolCargoProviderById } from '@/hooks/services/admin-trendyol-marketplace/useGetTrendyolCargoProviderById';
import { useGetTrendyolCategoryTree } from '@/hooks/services/admin-trendyol-marketplace/useGetTrendyolCategoryTree';
import { useGetTrendyolBrandsWithPagination } from '@/hooks/services/admin-trendyol-marketplace/useGetTrendyolBrands';

interface TrendyolProductOperationDetailProps {
  operation: TrendyolProductOperationResponse | null;
  isOpen: boolean;
  onClose: () => void;
  statusOptions?: Array<{ value: number; displayName: string }>;
  operationTypes?: Array<{ value: number; displayName: string }>;
}

const TrendyolProductOperationDetail: React.FC<TrendyolProductOperationDetailProps> = ({
  operation,
  isOpen,
  onClose,
  statusOptions = [],
  operationTypes = []
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Fetch additional data
  const { categoryAttributes, isLoading: categoryAttributesLoading, error: categoryAttributesError } = useGetTrendyolCategoryAttributes(operation?.categoryId || 0);
  const { cargoProvider, isLoading: cargoProviderLoading, error: cargoProviderError } = useGetTrendyolCargoProviderById(operation?.cargoCompanyId || 0);
  const { categoryTree, isLoading: categoryTreeLoading, error: categoryTreeError } = useGetTrendyolCategoryTree();
  const { brands, loadInitialBrands, checkAndLoadBrandIfNeeded, isLoading: brandsLoading, searchInProgress } = useGetTrendyolBrandsWithPagination(operation?.brandId);

  // Load brands when component mounts or brand ID changes
  React.useEffect(() => {
    if (operation?.brandId && brands.length === 0) {
      loadInitialBrands();
    }
  }, [operation?.brandId, brands.length, loadInitialBrands]);

  // Check if specific brand needs to be loaded
  React.useEffect(() => {
    if (operation?.brandId && brands.length > 0) {
      const brandExists = brands.find(b => b.id === operation.brandId);
      if (!brandExists) {
        // Try to find brand by making an additional search if needed
        checkAndLoadBrandIfNeeded(`brand-${operation.brandId}`);
      }
    }
  }, [operation?.brandId, brands, checkAndLoadBrandIfNeeded]);

  if (!isOpen || !operation) {
    return null;
  }

  // Helper functions for enum display
  const getStatusDisplayName = (statusValue: number) => {
    const statusOption = statusOptions?.find(option => option.value === statusValue);
    return statusOption?.displayName || `Durum ${statusValue}`;
  };

  const getOperationTypeDisplayName = (operationTypeValue: number) => {
    const operationType = operationTypes?.find(option => option.value === operationTypeValue);
    return operationType?.displayName || `İşlem ${operationTypeValue}`;
  };

  // Get all images
  const getAllImages = () => {
    return operation.images || [];
  };

  const allImages = getAllImages();

  // Helper function to get status color
  const getStatusColor = (status: number) => {
    switch (status) {
      case 1: return '#155724'; // Success/Approved
      case 5: return '#721c24'; // Failed
      case 8: return '#856404'; // Warning/Pending
      default: return '#6c757d'; // Default gray
    }
  };

  // Helper function to get operation type color
  const getOperationTypeColor = (operationType: number) => {
    switch (operationType) {
      case 1: return '#856404'; // Create
      case 3: return '#0c5460'; // Update
      default: return '#6c757d'; // Default gray
    }
  };

  // Helper function to find category name
  const getCategoryName = (categoryId: number) => {
    if (!categoryTree || Array.isArray(categoryTree) || !categoryTree.data?.categories) return 'Kategori bulunamadı';

    const findCategory = (categories: unknown[], targetId: number): string | null => {
      for (const category of categories) {
        const cat = category as { id: number; name: string; subCategories?: unknown[] };
        if (cat.id === targetId) {
          return cat.name;
        }
        if (cat.subCategories) {
          const found = findCategory(cat.subCategories, targetId);
          if (found) return found;
        }
      }
      return null;
    };

    return findCategory(categoryTree.data.categories, categoryId) || 'Kategori bulunamadı';
  };

  // Helper function to format dates
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Helper function to get attribute display name
  const getAttributeDisplayName = (attributeId: number) => {
    if (categoryAttributesLoading) {
      return (
        <span className="d-flex align-items-center">
          <div className="spinner-border spinner-border-sm me-2" role="status" style={{ width: '12px', height: '12px' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          Yükleniyor...
        </span>
      );
    }

    if (categoryAttributesError) {
      return <span className="text-danger">Hata: Özellik yüklenemedi</span>;
    }

    if (!categoryAttributes?.data?.categoryAttributes) return `Özellik ${attributeId}`;

    const attribute = categoryAttributes.data.categoryAttributes.find(attr => attr.attribute.id === attributeId);
    return attribute?.attribute.name || `Özellik ${attributeId}`;
  };

  // Helper function to get attribute value display name
  const getAttributeValueDisplayName = (attributeId: number, attributeValueId: number) => {
    if (categoryAttributesLoading) {
      return (
        <span className="d-flex align-items-center">
          <div className="spinner-border spinner-border-sm me-2" role="status" style={{ width: '12px', height: '12px' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          Yükleniyor...
        </span>
      );
    }

    if (categoryAttributesError) {
      return <span className="text-danger">Hata yüklenemedi</span>;
    }

    if (!categoryAttributes?.data?.categoryAttributes) return `Değer ${attributeValueId}`;

    const attribute = categoryAttributes.data.categoryAttributes.find(attr => attr.attribute.id === attributeId);
    if (!attribute) return `Değer ${attributeValueId}`;

    const value = attribute.attributeValues.find(val => val.id === attributeValueId);
    return value?.name || `Değer ${attributeValueId}`;
  };

  // Helper function to get brand name with loading and error states
  const getBrandName = (brandId?: number, brandName?: string) => {
    // First try to use brandName from backend if available
    if (brandName) {
      return brandName;
    }

    if (!brandId) return 'Belirtilmemiş';

    const brand = brands.find(b => b.id === brandId);
    
    if (brand) {
      return brand.name;
    }

    // Show loading state while brands are being fetched
    if (brandsLoading || searchInProgress) {
      return (
        <span className="d-flex align-items-center">
          <div className="spinner-border spinner-border-sm me-2" role="status" style={{ width: '12px', height: '12px' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          Yükleniyor...
        </span>
      );
    }

    // If we have brands loaded but specific brand not found
    if (brands.length > 0) {
      return `Marka (ID: ${brandId})`;
    }

    return 'Belirtilmemiş';
  };

  // Helper function to get category name with loading and error states
  const getCategoryNameWithState = (categoryId: number) => {
    if (!categoryId) return 'Belirtilmemiş';
    
    if (categoryTreeLoading) {
      return (
        <span className="d-flex align-items-center">
          <div className="spinner-border spinner-border-sm me-2" role="status" style={{ width: '12px', height: '12px' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          Yükleniyor...
        </span>
      );
    }

    if (categoryTreeError) {
      return <span className="text-danger">Hata: Kategori yüklenemedi</span>;
    }

    return getCategoryName(categoryId);
  };

  // Helper function to get cargo provider name with loading and error states  
  const getCargoProviderNameWithState = () => {
    if (!operation?.cargoCompanyId) return 'Belirtilmemiş';
    
    if (cargoProviderLoading) {
      return (
        <span className="d-flex align-items-center">
          <div className="spinner-border spinner-border-sm me-2" role="status" style={{ width: '12px', height: '12px' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          Yükleniyor...
        </span>
      );
    }

    if (cargoProviderError) {
      return <span className="text-danger">Hata: Kargo şirketi yüklenemedi</span>;
    }

    return cargoProvider?.data?.name || 'Belirtilmemiş';
  };

  return (
    <>
      {/* Modal Backdrop */}
      <div
        className="modal-backdrop fade show"
        style={{ zIndex: 1040 }}
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div
        className="modal fade show d-block"
        style={{ zIndex: 1050 }}
        tabIndex={-1}
        role="dialog"
      >
        <div className="modal-dialog modal-xl modal-dialog-scrollable" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                <i className="bx bx-detail me-2"></i>
                İşlem Detayları
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
                aria-label="Close"
              ></button>
            </div>

            <div className="modal-body">
              {/* Operation Status Header */}
              <div className="row mb-4">
                <div className="col-12">
                  <div className="card border-0 shadow-sm" style={{ backgroundColor: "#f8f9fc", border: "1px solid #e3e6f0" }}>
                    <div className="card-body p-4">
                      {/* Desktop Header */}
                      <div className="d-none d-lg-flex align-items-center justify-content-between mb-4">
                        <div className="d-flex align-items-center">
                          <i className="bx bx-cog text-primary me-3" style={{ fontSize: "1.5rem" }}></i>
                          <h5 className="mb-0 fw-bold text-primary">
                            {getOperationTypeDisplayName(operation.operationType)} İşlemi
                          </h5>
                        </div>
                        <div className="d-flex gap-2">
                          <span
                            className="badge text-wrap"
                            style={{
                              backgroundColor: getStatusColor(operation.status),
                              color: 'white',
                              fontSize: '0.85rem',
                              lineHeight: '1.2',
                              maxWidth: '200px',
                              whiteSpace: 'normal'
                            }}
                          >
                            {getStatusDisplayName(operation.status)}
                          </span>
                          <span
                            className={`badge ${operation.isFinal ? 'bg-success' : 'bg-warning'} flex-shrink-0`}
                            style={{ fontSize: '0.85rem' }}
                          >
                            {operation.isFinal ? 'Final' : 'Devam Ediyor'}
                          </span>
                        </div>
                      </div>

                      {/* Mobile Header */}
                      <div className="d-block d-lg-none mb-4">
                        <div className="d-flex align-items-center mb-3">
                          <i className="bx bx-cog text-primary me-2" style={{ fontSize: "1.3rem" }}></i>
                          <h6 className="mb-0 fw-bold text-primary" style={{ fontSize: "1rem", lineHeight: "1.3" }}>
                            {getOperationTypeDisplayName(operation.operationType)} İşlemi
                          </h6>
                        </div>
                        <div className="mb-2">
                          <span
                            className="badge text-wrap d-block"
                            style={{
                              backgroundColor: getStatusColor(operation.status),
                              color: 'white',
                              fontSize: '0.8rem',
                              lineHeight: '1.2',
                              width: 'fit-content',
                              whiteSpace: 'normal'
                            }}
                          >
                            {getStatusDisplayName(operation.status)}
                          </span>
                        </div>
                        <div>
                          <span
                            className={`badge ${operation.isFinal ? 'bg-success' : 'bg-warning'} d-block`}
                            style={{
                              fontSize: '0.8rem',
                              width: 'fit-content'
                            }}
                          >
                            {operation.isFinal ? 'Final' : 'Devam Ediyor'}
                          </span>
                        </div>
                      </div>

                      <div className="row">
                        {/* Product Images */}
                        {allImages.length > 0 && (
                          <div className="col-lg-5 col-md-12 mb-4 mb-lg-0">
                            <div className="product-image-gallery d-flex flex-column flex-sm-row">
                              {/* Thumbnail Images - Top on mobile, Left on desktop */}
                              {allImages.length > 1 && (
                                <div className="thumbnail-images mb-3 mb-sm-0 me-sm-3 d-flex d-sm-flex flex-row flex-sm-column gap-2" style={{ width: "auto" }}>
                                  <div
                                    className="d-flex flex-row flex-sm-column gap-2"
                                    style={{
                                      maxHeight: "280px",
                                      overflowY: "auto",
                                      overflowX: "auto",
                                      scrollbarWidth: "none",
                                      msOverflowStyle: "none"
                                    }}
                                  >
                                    <style>{`
                                      .thumbnail-images > div::-webkit-scrollbar {
                                        display: none;
                                      }
                                    `}</style>
                                    {allImages.map((imageUrl, index) => (
                                      <div
                                        key={index}
                                        className={`thumbnail-item ${selectedImageIndex === index ? 'active' : ''}`}
                                        style={{
                                          width: "50px",
                                          height: "50px",
                                          borderRadius: "6px",
                                          overflow: "hidden",
                                          cursor: "pointer",
                                          border: selectedImageIndex === index ? "2px solid #0d6efd" : "2px solid #e9ecef",
                                          transition: "all 0.2s ease",
                                          flexShrink: 0
                                        }}
                                        onClick={() => setSelectedImageIndex(index)}
                                      >
                                        <Image
                                          width={50}
                                          height={50}
                                          src={imageUrl}
                                          alt={`Ürün görseli ${index + 1}`}
                                          className="w-100 h-100"
                                          style={{ objectFit: "cover" }}
                                        />
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Main Image - Bottom on mobile, Right on desktop */}
                              <div className="main-image flex-grow-1">
                                <div className="position-relative" style={{ height: "280px", borderRadius: "10px", overflow: "hidden", backgroundColor: "#f8f9fa", border: "2px solid #e9ecef" }}>
                                  {allImages[selectedImageIndex] ? (
                                    <Image
                                      fill
                                      src={allImages[selectedImageIndex]}
                                      alt="Ürün görseli"
                                      style={{ objectFit: "cover" }}
                                      onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.style.display = 'none';
                                        target.nextElementSibling?.setAttribute('style', 'display: flex !important');
                                      }}
                                    />
                                  ) : (
                                    <div className="w-100 h-100 d-flex align-items-center justify-content-center">
                                      <div className="text-center">
                                        <i className="bx bx-image text-muted mb-2" style={{ fontSize: "2.5rem" }}></i>
                                        <p className="text-muted mb-0 small">Ürün resmi bulunamadı</p>
                                      </div>
                                    </div>
                                  )}
                                  {/* Fallback for image load error */}
                                  <div className="w-100 h-100 d-flex align-items-center justify-content-center" style={{ display: "none" }}>
                                    <div className="text-center">
                                      <i className="bx bx-image text-muted mb-2" style={{ fontSize: "2.5rem" }}></i>
                                      <p className="text-muted mb-0 small">Resim yüklenemedi</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Operation Information */}
                        <div className={allImages.length > 0 ? "col-lg-7 col-md-12" : "col-12"}>
                          <div className="product-info ps-lg-4">
                            <div className="row g-2">
                              <div className="col-md-6">
                                <div className="d-flex flex-column gap-2">
                                  <div className="info-card p-2 p-sm-3" style={{ backgroundColor: "#fff", border: "1px solid #e9ecef", borderRadius: "6px" }}>
                                    <div className="d-flex align-items-center mb-2">
                                      <div className="icon-wrapper me-2" style={{ width: "28px", height: "28px", backgroundColor: "#f8f9fa", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <i className="bx bx-calendar text-primary" style={{ fontSize: "1rem" }}></i>
                                      </div>
                                      <span className="text-muted" style={{ fontSize: "0.9rem", fontWeight: "500" }}>İstek Tarihi</span>
                                    </div>
                                    <div className="ps-1">
                                      <span className="fw-bold text-dark" style={{ fontSize: "0.85rem" }}>
                                        {formatDate(operation.requestedAt)}
                                      </span>
                                    </div>
                                  </div>

                                  <div className="info-card p-2 p-sm-3" style={{ backgroundColor: "#fff", border: "1px solid #e9ecef", borderRadius: "6px" }}>
                                    <div className="d-flex align-items-center mb-2">
                                      <div className="icon-wrapper me-2" style={{ width: "28px", height: "28px", backgroundColor: "#f8f9fa", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <i className="bx bx-check-circle text-success" style={{ fontSize: "1rem" }}></i>
                                      </div>
                                      <span className="text-muted" style={{ fontSize: "0.9rem", fontWeight: "500" }}>Yanıt Tarihi</span>
                                    </div>
                                    <div className="ps-1">
                                      <span className="fw-bold text-dark" style={{ fontSize: "0.85rem" }}>
                                        {operation.respondedAt ? formatDate(operation.respondedAt) : 'Henüz yanıt alınmadı'}
                                      </span>
                                    </div>
                                  </div>

                                  <div className="info-card p-2 p-sm-3" style={{ backgroundColor: "#fff", border: "1px solid #e9ecef", borderRadius: "6px" }}>
                                    <div className="d-flex align-items-center mb-2">
                                      <div className="icon-wrapper me-2" style={{ width: "28px", height: "28px", backgroundColor: "#f8f9fa", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <i className="bx bx-barcode text-primary" style={{ fontSize: "1rem" }}></i>
                                      </div>
                                      <span className="text-muted" style={{ fontSize: "0.9rem", fontWeight: "500" }}>Barkod</span>
                                    </div>
                                    <div className="ps-1">
                                      <span className="fw-bold text-dark font-monospace" style={{ fontSize: "0.85rem" }}>
                                        {operation.barcode || 'Belirtilmemiş'}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="col-md-6">
                                <div className="d-flex flex-column gap-2">
                                  <div className="info-card p-2 p-sm-3" style={{ backgroundColor: "#fff", border: "1px solid #e9ecef", borderRadius: "6px" }}>
                                    <div className="d-flex align-items-center mb-2">
                                      <div className="icon-wrapper me-2" style={{ width: "28px", height: "28px", backgroundColor: "#f8f9fa", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <i className="bx bx-hash text-primary" style={{ fontSize: "1rem" }}></i>
                                      </div>
                                      <span className="text-muted" style={{ fontSize: "0.9rem", fontWeight: "500" }}>Stok Kodu</span>
                                    </div>
                                    <div className="ps-1">
                                      <span className="fw-bold text-dark font-monospace" style={{ fontSize: "0.85rem" }}>
                                        {operation.stockCode || 'Belirtilmemiş'}
                                      </span>
                                    </div>
                                  </div>

                                  <div className="info-card p-2 p-sm-3" style={{ backgroundColor: "#fff", border: "1px solid #e9ecef", borderRadius: "6px" }}>
                                    <div className="d-flex align-items-center mb-2">
                                      <div className="icon-wrapper me-2" style={{ width: "28px", height: "28px", backgroundColor: "#f8f9fa", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <i className="bx bx-package text-success" style={{ fontSize: "1rem" }}></i>
                                      </div>
                                      <span className="text-muted" style={{ fontSize: "0.9rem", fontWeight: "500" }}>Stok Adedi</span>
                                    </div>
                                    <div className="ps-1">
                                      <span className="fw-bold text-dark" style={{ fontSize: "0.85rem" }}>
                                        {operation.quantity !== null && operation.quantity !== undefined ? `${operation.quantity} adet` : 'Belirtilmemiş'}
                                      </span>
                                    </div>
                                  </div>

                                  <div className="info-card p-2 p-sm-3 d-block d-md-none" style={{ backgroundColor: "#fff", border: "1px solid #e9ecef", borderRadius: "6px" }}>
                                    <div className="d-flex align-items-center mb-2">
                                      <div className="icon-wrapper me-2" style={{ width: "28px", height: "28px", backgroundColor: "#f8f9fa", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <i className="bx bx-info-circle text-info" style={{ fontSize: "1rem" }}></i>
                                      </div>
                                      <span className="text-muted" style={{ fontSize: "0.9rem", fontWeight: "500" }}>Durum</span>
                                    </div>
                                    <div className="ps-1">
                                      <span
                                        className="badge"
                                        style={{
                                          backgroundColor: getStatusColor(operation.status),
                                          color: 'white',
                                          fontSize: '0.75rem'
                                        }}
                                      >
                                        {getStatusDisplayName(operation.status)}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Details */}
              <div className="row mb-4">
                <div className="col-md-6">
                  <div className="card">
                    <div className="card-header">
                      <h6 className="mb-0">
                        <i className="bx bx-info-circle me-2"></i>
                        Ürün Bilgileri
                      </h6>
                    </div>
                    <div className="card-body">
                      <div className="row g-3">
                        <div className="col-12">
                          <label className="form-label text-muted">Ürün Başlığı</label>
                          <p className="fw-semibold">{operation.title || 'Belirtilmemiş'}</p>
                        </div>
                        <div className="col-6">
                          <label className="form-label text-muted">Marka</label>
                          <div className="fw-semibold">{getBrandName(operation.brandId, operation.brandName)}</div>
                        </div>
                        <div className="col-6">
                          <label className="form-label text-muted">Kategori</label>
                          <div className="fw-semibold">{getCategoryNameWithState(operation.categoryId || 0)}</div>
                        </div>
                        <div className="col-6">
                          <label className="form-label text-muted">Kargo Desi</label>
                          <p className="fw-semibold">
                            {operation.dimensionalWeight !== null && operation.dimensionalWeight !== undefined
                              ? `${operation.dimensionalWeight} kg`
                              : 'Belirtilmemiş'
                            }
                          </p>
                        </div>
                        <div className="col-6">
                          <label className="form-label text-muted">KDV Oranı</label>
                          <p className="fw-semibold">
                            {operation.vatRate !== null && operation.vatRate !== undefined
                              ? `%${operation.vatRate}`
                              : 'Belirtilmemiş'
                            }
                          </p>
                        </div>
                        <div className="col-12">
                          <label className="form-label text-muted">Para Birimi</label>
                          <p className="fw-semibold">{operation.currencyType || 'Belirtilmemiş'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="card">
                    <div className="card-header">
                      <h6 className="mb-0">
                        <i className="bx bx-money me-2"></i>
                        Fiyat Bilgileri
                      </h6>
                    </div>
                    <div className="card-body">
                      <div className="row g-3">
                        <div className="col-6">
                          <label className="form-label text-muted">Liste Fiyatı</label>
                          <p className="fw-semibold text-primary">
                            {operation.listPrice !== null && operation.listPrice !== undefined
                              ? `₺${operation.listPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}`
                              : 'Belirtilmemiş'
                            }
                          </p>
                        </div>
                        <div className="col-6">
                          <label className="form-label text-muted">Satış Fiyatı</label>
                          <p className="fw-semibold text-success">
                            {operation.salePrice !== null && operation.salePrice !== undefined
                              ? `₺${operation.salePrice.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}`
                              : 'Belirtilmemiş'
                            }
                          </p>
                        </div>
                        <div className="col-6">
                          <label className="form-label text-muted">Kargo Şirketi</label>
                          <div className="fw-semibold">{getCargoProviderNameWithState()}</div>
                        </div>
                        <div className="col-6">
                          <label className="form-label text-muted">Sevkiyat Adresi ID</label>
                          <p className="fw-semibold">{operation.shipmentAddressId || 'Belirtilmemiş'}</p>
                        </div>
                        <div className="col-12">
                          <label className="form-label text-muted">İade Adresi ID</label>
                          <p className="fw-semibold">{operation.returningAddressId || 'Belirtilmemiş'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Description */}
              {operation.description && (
                <div className="row mb-4">
                  <div className="col-12">
                    <div className="card">
                      <div className="card-header">
                        <h6 className="mb-0">
                          <i className="bx bx-text me-2"></i>
                          Ürün Açıklaması
                        </h6>
                      </div>
                      <div className="card-body">
                        <div dangerouslySetInnerHTML={{ __html: operation.description }} />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Product Attributes */}
              {operation.productAttributes && operation.productAttributes.length > 0 && (
                <div className="row mb-4">
                  <div className="col-12">
                    <div className="card">
                      <div className="card-header">
                        <h6 className="mb-0">
                          <i className="bx bx-list-ul me-2"></i>
                          Ürün Özellikleri
                        </h6>
                      </div>
                      <div className="card-body">
                        <div className="table-responsive">
                          <table className="table table-sm">
                            <thead>
                              <tr>
                                <th>Özellik Adı</th>
                                <th>Özellik Değeri</th>
                                <th>Özel Değer</th>
                              </tr>
                            </thead>
                            <tbody>
                              {operation.productAttributes.map((attr, index) => (
                                <tr key={index}>
                                  <td>{getAttributeDisplayName(attr.attributeId)}</td>
                                  <td>{attr.attributeValueId ? getAttributeValueDisplayName(attr.attributeId, attr.attributeValueId) : '-'}</td>
                                  <td>{attr.customAttributeValue || '-'}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Failure Reasons */}
              {operation.failureReasons && operation.failureReasons.length > 0 && (
                <div className="row mb-4">
                  <div className="col-12">
                    <div className="card border-danger">
                      <div className="card-header bg-danger text-white">
                        <h6 className="mb-0">
                          <i className="bx bx-error me-2"></i>
                          Hata Nedenleri
                        </h6>
                      </div>
                      <div className="card-body">
                        <ul className="list-unstyled mb-0">
                          {operation.failureReasons.map((reason, index) => (
                            <li key={index} className="mb-2">
                              <i className="bx bx-x-circle text-danger me-2"></i>
                              {reason}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Technical Details */}
              <div className="row">
                <div className="col-12">
                  <div className="card">
                    <div className="card-header">
                      <h6 className="mb-0">
                        <i className="bx bx-cog me-2"></i>
                        Teknik Detaylar
                      </h6>
                    </div>
                    <div className="card-body">
                      <div className="row g-3">
                        <div className="col-md-4">
                          <label className="form-label text-muted">Silinmiş mi?</label>
                          <p className="fw-semibold">
                            <span className={`badge ${operation.isDeleted ? 'bg-danger' : 'bg-success'}`}>
                              {operation.isDeleted ? 'Evet' : 'Hayır'}
                            </span>
                          </p>
                        </div>
                        <div className="col-md-4">
                          <label className="form-label text-muted">Oluşturulma Tarihi</label>
                          <p className="fw-semibold">
                            {operation.createdOnValue ? formatDate(operation.createdOnValue) : 'Belirtilmemiş'}
                          </p>
                        </div>
                        <div className="col-md-4">
                          <label className="form-label text-muted">Son Güncelleme</label>
                          <p className="fw-semibold">
                            {operation.modifiedOnValue ? formatDate(operation.modifiedOnValue) : 'Belirtilmemiş'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                <i className="bx bx-x me-2"></i>
                Kapat
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TrendyolProductOperationDetail;