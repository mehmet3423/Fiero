"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useUpdateTrendyolPriceInventory } from "@/hooks/services/admin-trendyol-marketplace/useUpdateTrendyolPriceInventory";
import { useGetProductWithTrendyol } from "@/hooks/services/admin-trendyol-marketplace/useGetProductWithTrendyol";
import { useGetTrendyolProductStatusOptions } from "@/hooks/services/enum-options/useGetTrendyolProductStatusOptions";
import { useGetTrendyolOperationTypes } from "@/hooks/services/enum-options/useGetTrendyolOperationTypes";
import { TrendyolUpdatePriceInventoryRequest, TrendyolPriceInventoryItem } from "@/constants/models/trendyol/TrendyolUpdatePriceInventoryRequest";
import TrendyolProductOperations from "@/components/admin/trendyol-marketplace/TrendyolProductOperations";
import TrendyolProductHeader from "@/components/admin/trendyol-marketplace/TrendyolProductHeader";
import { ProductWithTrendyolResponse } from "@/constants/models/trendyol/ProductWithTrendyolResponse";
import toast from "react-hot-toast";

function UpdateTrendyolPriceInventoryPage() {
  const router = useRouter();
  const { productId } = router.query;
  const [loading, setLoading] = useState(false);
  const [productDetails, setProductDetails] = useState<ProductWithTrendyolResponse | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Form state
  const [formData, setFormData] = useState<TrendyolPriceInventoryItem>({
    barcode: "",
    quantity: 0,
    salePrice: 0,
    listPrice: 0
  });

  // Hooks
  const { updateTrendyolPriceInventory, isPending: updateLoading } = useUpdateTrendyolPriceInventory();
  const { getProductWithTrendyol, isPending: detailsLoading } = useGetProductWithTrendyol();
  const { data: trendyolStatusOptions, isLoading: statusOptionsLoading, refetch: refetchStatusOptions } = useGetTrendyolProductStatusOptions();
  const { data: trendyolOperationTypes, isLoading: operationTypesLoading, refetch: refetchOperationTypes } = useGetTrendyolOperationTypes();


  // Load product details when productId changes
  useEffect(() => {
    if (productId && typeof productId === 'string') {
      loadProductDetails(productId);
      // Load enum data when product is loaded
      refetchStatusOptions();
      refetchOperationTypes();
    }
  }, [productId, refreshTrigger]);


  const loadProductDetails = async (productId: string) => {
    try {
      const response = await getProductWithTrendyol(productId);
      if (response.data) {
        setProductDetails(response.data);
        // Update form data with current values
        setFormData({
          barcode: response.data.barcodeNumber,
          quantity: response.data.sellableQuantity,
          salePrice: response.data.price,
          listPrice: response.data.price // Default to current price, can be adjusted
        });
      }
    } catch (error) {
    }
  };


  // Handle form changes
  const handleInputChange = (field: keyof TrendyolPriceInventoryItem, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!productDetails) {
      toast.error("Ürün bilgileri yüklenemedi");
      return;
    }

    if (formData.quantity < 0) {
      toast.error("Stok adedi negatif olamaz");
      return;
    }

    if (formData.salePrice < 0) {
      toast.error("Satış fiyatı negatif olamaz");
      return;
    }

    if (formData.listPrice < 0) {
      toast.error("Liste fiyatı negatif olamaz");
      return;
    }

    try {
      setLoading(true);
      const request: TrendyolUpdatePriceInventoryRequest = {
        items: [formData]
      };

      await updateTrendyolPriceInventory(request);
      toast.success("Ürün stok ve fiyat bilgileri başarıyla güncellendi");

      // Refresh product details to show updated values
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };



  // Validation
  const isFormValid = () => {
    return productDetails &&
      formData.barcode.trim() !== "" &&
      formData.quantity >= 0 &&
      formData.salePrice >= 0 &&
      formData.listPrice >= 0;
  };

  // Loading state
  if (detailsLoading && !productDetails) {
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
                  Trendyol Ürün Stok ve Fiyat Güncelleme
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
              <p className="text-muted mb-0">Lütfen bekleyin, ürün detayları getiriliyor...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state - Product not found after loading
  if (!detailsLoading && !productDetails) {
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
                  Trendyol Ürün Stok ve Fiyat Güncelleme
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
                Trendyol Ürün Stok ve Fiyat Güncelleme
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
                productDetails={productDetails!}
                title="Stok ve Fiyat Güncellenecek Ürün"
                showBackButton={false}
                showPriceBadge={true}
                showStockBadge={true}
                compactLayout={true}
              />

              {productDetails && (
                <>

                  {/* Update Form */}
                  <div className="row mb-4">
                    <div className="col-12">
                      <h6 className="mb-3" style={{ color: "#566a7f", fontWeight: "600" }}>
                        <i className="bx bx-edit me-2"></i>
                        Güncelleme Bilgileri
                      </h6>

                      <div className="row g-4">
                        <div className="col-md-3">
                          <label className="form-label fw-semibold">
                            <i className="bx bx-barcode me-2"></i>
                            Barkod
                          </label>
                          <input
                            type="text"
                            className="form-control form-control-lg"
                            value={formData.barcode}
                            onChange={(e) => handleInputChange('barcode', e.target.value)}
                            placeholder="Barkod"
                            readOnly
                            style={{ backgroundColor: "#f8f9fa", border: "2px solid #e9ecef" }}
                          />
                        </div>

                        <div className="col-md-3">
                          <label className="form-label fw-semibold">
                            <i className="bx bx-package me-2"></i>
                            Yeni Stok Adedi
                          </label>
                          <input
                            type="number"
                            className="form-control form-control-lg"
                            value={formData.quantity}
                            onChange={(e) => handleInputChange('quantity', parseInt(e.target.value) || 0)}
                            min="0"
                            placeholder="Stok adedi girin"
                            style={{ border: "2px solid #e9ecef" }}
                          />
                        </div>

                        <div className="col-md-3">
                          <label className="form-label fw-semibold">
                            <i className="bx bx-money me-2"></i>
                            Yeni Satış Fiyatı
                          </label>
                          <div className="input-group">
                            <span className="input-group-text" style={{ backgroundColor: "#f8f9fa", border: "2px solid #e9ecef" }}>₺</span>
                            <input
                              type="number"
                              className="form-control form-control-lg"
                              value={formData.salePrice}
                              onChange={(e) => handleInputChange('salePrice', parseFloat(e.target.value) || 0)}
                              min="0"
                              step="0.01"
                              placeholder="Satış fiyatı girin"
                              style={{ border: "2px solid #e9ecef" }}
                            />
                          </div>
                        </div>

                        <div className="col-md-3">
                          <label className="form-label fw-semibold">
                            <i className="bx bx-receipt me-2"></i>
                            Yeni Liste Fiyatı
                          </label>
                          <div className="input-group">
                            <span className="input-group-text" style={{ backgroundColor: "#f8f9fa", border: "2px solid #e9ecef" }}>₺</span>
                            <input
                              type="number"
                              className="form-control form-control-lg"
                              value={formData.listPrice}
                              onChange={(e) => handleInputChange('listPrice', parseFloat(e.target.value) || 0)}
                              min="0"
                              step="0.01"
                              placeholder="Liste fiyatı girin"
                              style={{ border: "2px solid #e9ecef" }}
                            />
                          </div>
                        </div>
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
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={!isFormValid() || loading || updateLoading || detailsLoading}
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
                            Stok ve Fiyat Güncelle
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

export default UpdateTrendyolPriceInventoryPage; 