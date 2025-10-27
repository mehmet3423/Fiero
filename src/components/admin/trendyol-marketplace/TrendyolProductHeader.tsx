import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { ProductWithTrendyolResponse } from '@/constants/models/trendyol/ProductWithTrendyolResponse';

interface TrendyolProductHeaderProps {
  productDetails: ProductWithTrendyolResponse;
  title?: string;
  showBackButton?: boolean;
  onBackClick?: () => void;
  showPriceBadge?: boolean;
  showStockBadge?: boolean;
  compactLayout?: boolean;
  images?: Array<{ url: string }>;
}

const TrendyolProductHeader: React.FC<TrendyolProductHeaderProps> = ({
  productDetails,
  title = "Güncellenen Ürün",
  showBackButton = false,
  onBackClick,
  showPriceBadge = true,
  showStockBadge = true,
  compactLayout = false,
  images
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const thumbnailContainerRef = useRef<HTMLDivElement>(null);
  const [thumbnailStartIndex, setThumbnailStartIndex] = useState(0);

  // Get all images from product or use provided images
  const getAllImages = () => {
    if (images && images.length > 0) {
      return images.map(img => img.url);
    }

    const defaultImages = [];
    if (productDetails.baseImageUrl) defaultImages.push(productDetails.baseImageUrl);
    if (productDetails.contentImageUrls) defaultImages.push(...productDetails.contentImageUrls);
    return defaultImages;
  };

  const allImages = getAllImages();

  // Get visible thumbnails (only 4 at a time)
  const getVisibleThumbnails = () => {
    return allImages.slice(thumbnailStartIndex, thumbnailStartIndex + 4);
  };

  // Navigation functions for thumbnails
  const scrollThumbnails = (direction: 'up' | 'down') => {
    if (direction === 'up' && thumbnailStartIndex > 0) {
      setThumbnailStartIndex(thumbnailStartIndex - 1);
    } else if (direction === 'down' && thumbnailStartIndex + 4 < allImages.length) {
      setThumbnailStartIndex(thumbnailStartIndex + 1);
    }
  };

  const canScrollUp = () => {
    return thumbnailStartIndex > 0;
  };

  const canScrollDown = () => {
    return thumbnailStartIndex + 4 < allImages.length;
  };

  // Handle thumbnail click
  const handleThumbnailClick = (index: number) => {
    const actualIndex = thumbnailStartIndex + index;
    setSelectedImageIndex(actualIndex);
  };

  return (
    <div className="row mb-4">
      <div className="col-12">
        <div className="card border-0 shadow-sm" style={{ backgroundColor: "#f8f9fc", border: "1px solid #e3e6f0" }}>
          <div className="card-body p-4">
            {/* Desktop Header */}
            <div className="d-none d-md-flex align-items-center justify-content-between mb-4">
              <div className="d-flex align-items-center">
                <i className="bx bx-edit text-primary me-3" style={{ fontSize: "1.5rem" }}></i>
                <h5 className="mb-0 fw-bold text-primary">{title}: {productDetails.title}</h5>
              </div>
              <div className="d-flex gap-2">
                {showStockBadge && (
                  <span className={`badge ${productDetails.sellableQuantity > 0 ? 'bg-label-primary' : 'bg-danger'}`}>
                    Stok: {productDetails.sellableQuantity}
                  </span>
                )}
                {showPriceBadge && (
                  <span className="badge bg-label-primary">
                    ₺{productDetails.price.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                  </span>
                )}
                {showBackButton && onBackClick && (
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={onBackClick}
                    style={{ borderRadius: "8px" }}
                  >
                    <i className="bx bx-arrow-back me-2"></i>
                    Geri Dön
                  </button>
                )}
              </div>
            </div>

            {/* Mobile Header */}
            <div className="d-block d-md-none mb-3">
              <div className="d-flex align-items-center mb-3">
                <i className="bx bx-edit text-primary me-2" style={{ fontSize: "1.2rem" }}></i>
                <h6 className="mb-0 fw-bold text-primary" style={{ fontSize: "1rem", lineHeight: "1.3" }}>
                  {title}: {productDetails.title}
                </h6>
              </div>
              <div className="d-flex gap-2 justify-content-start mb-2">
                {showStockBadge && (
                  <span className={`badge ${productDetails.sellableQuantity > 0 ? 'bg-success' : 'bg-danger'}`} style={{ fontSize: "0.75rem" }}>
                    Stok: {productDetails.sellableQuantity}
                  </span>
                )}
                {showPriceBadge && (
                  <span className="badge bg-info" style={{ fontSize: "0.75rem" }}>
                    ₺{productDetails.price.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                  </span>
                )}
              </div>
              {showBackButton && onBackClick && (
                <div>
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm"
                    onClick={onBackClick}
                    style={{ fontSize: "0.75rem" }}
                  >
                    <i className="bx bx-arrow-back me-1"></i>
                    Geri Dön
                  </button>
                </div>
              )}
            </div>

            <div className="row">
              {/* Product Images */}
              <div className="col-lg-5 col-md-12 mb-4 mb-lg-0">
                <div className="product-image-gallery d-flex flex-column flex-sm-row">
                  {/* Thumbnail Images with Navigation - Desktop */}
                  {allImages.length > 1 && (
                    <>
                      {/* Desktop Thumbnails */}
                      <div className="thumbnail-container mb-3 mb-sm-0 me-sm-3 position-relative d-flex align-items-center d-none d-md-flex" style={{ width: "auto", height: "350px" }}>
                        {/* Up Arrow Button */}
                        <button
                          type="button"
                          className="btn btn-sm position-absolute"
                          style={{
                            top: "0px",
                            left: "50%",
                            transform: "translateX(-50%)",
                            width: "40px",
                            height: "28px",
                            borderRadius: "6px",
                            zIndex: 10,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            opacity: canScrollUp() ? 1 : 0.5,
                            pointerEvents: canScrollUp() ? "auto" : "none",
                            backgroundColor: "#ffffff",
                            border: "2px solid #e3e6f0",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                            color: "#6c757d"
                          }}
                          onClick={() => scrollThumbnails('up')}
                          disabled={!canScrollUp()}
                        >
                          <i className="bx bx-chevron-up" style={{ fontSize: "1rem" }}></i>
                        </button>

                        {/* Thumbnail Images Container */}
                        <div
                          ref={thumbnailContainerRef}
                          className="thumbnail-images d-flex flex-row flex-sm-column gap-2"
                          style={{
                            height: "240px",
                            paddingTop: "20px",
                            paddingBottom: "20px",
                            justifyContent: "center"
                          }}
                        >
                          <style>{`
                            .thumbnail-images::-webkit-scrollbar {
                              display: none;
                            }
                          `}</style>
                          {getVisibleThumbnails().map((imageUrl, index) => (
                            <div
                              key={index}
                              className={`thumbnail-item ${selectedImageIndex === thumbnailStartIndex + index ? 'active' : ''}`}
                              style={{
                                width: "50px",
                                height: "50px",
                                borderRadius: "6px",
                                overflow: "hidden",
                                cursor: "pointer",
                                border: selectedImageIndex === thumbnailStartIndex + index ? "2px solid #0d6efd" : "2px solid #e9ecef",
                                transition: "all 0.2s ease",
                                flexShrink: 0
                              }}
                              onClick={() => handleThumbnailClick(index)}
                            >
                              <Image
                                width={50}
                                height={50}
                                src={imageUrl}
                                alt={`${productDetails.title} ${thumbnailStartIndex + index + 1}`}
                                className="w-100 h-100"
                                style={{ objectFit: "cover" }}
                              />
                            </div>
                          ))}
                        </div>

                        {/* Down Arrow Button */}
                        <button
                          type="button"
                          className="btn btn-sm position-absolute"
                          style={{
                            bottom: "0px",
                            left: "50%",
                            transform: "translateX(-50%)",
                            width: "40px",
                            height: "28px",
                            borderRadius: "6px",
                            zIndex: 10,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            opacity: canScrollDown() ? 1 : 0.5,
                            pointerEvents: canScrollDown() ? "auto" : "none",
                            backgroundColor: "#ffffff",
                            border: "2px solid #e3e6f0",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                            color: "#6c757d"
                          }}
                          onClick={() => scrollThumbnails('down')}
                          disabled={!canScrollDown()}
                        >
                          <i className="bx bx-chevron-down" style={{ fontSize: "1rem" }}></i>
                        </button>
                      </div>

                      {/* Mobile Thumbnails */}
                      <div className="d-block d-md-none w-100 mb-3">
                        <div className="position-relative">
                          {/* Mobile Thumbnail Container */}
                          <div className="d-flex gap-2 justify-content-center align-items-center" style={{ height: "80px" }}>
                            {/* Left Arrow Button */}
                            <button
                              type="button"
                              className="btn btn-sm"
                              style={{
                                width: "35px",
                                height: "35px",
                                borderRadius: "6px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                opacity: canScrollUp() ? 1 : 0.5,
                                pointerEvents: canScrollUp() ? "auto" : "none",
                                backgroundColor: "#ffffff",
                                border: "2px solid #e3e6f0",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                                color: "#6c757d"
                              }}
                              onClick={() => scrollThumbnails('up')}
                              disabled={!canScrollUp()}
                            >
                              <i className="bx bx-chevron-left" style={{ fontSize: "1rem" }}></i>
                            </button>

                            {/* Mobile Thumbnails */}
                            <div className="d-flex gap-2">
                              {getVisibleThumbnails().map((imageUrl, index) => (
                                <div
                                  key={index}
                                  className={`thumbnail-item ${selectedImageIndex === thumbnailStartIndex + index ? 'active' : ''}`}
                                  style={{
                                    width: "60px",
                                    height: "60px",
                                    borderRadius: "8px",
                                    overflow: "hidden",
                                    cursor: "pointer",
                                    border: selectedImageIndex === thumbnailStartIndex + index ? "3px solid #0d6efd" : "2px solid #e9ecef",
                                    transition: "all 0.2s ease",
                                    flexShrink: 0
                                  }}
                                  onClick={() => handleThumbnailClick(index)}
                                >
                                  <Image
                                    width={60}
                                    height={60}
                                    src={imageUrl}
                                    alt={`${productDetails.title} ${thumbnailStartIndex + index + 1}`}
                                    className="w-100 h-100"
                                    style={{ objectFit: "cover" }}
                                  />
                                </div>
                              ))}
                            </div>

                            {/* Right Arrow Button */}
                            <button
                              type="button"
                              className="btn btn-sm"
                              style={{
                                width: "35px",
                                height: "35px",
                                borderRadius: "6px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                opacity: canScrollDown() ? 1 : 0.5,
                                pointerEvents: canScrollDown() ? "auto" : "none",
                                backgroundColor: "#ffffff",
                                border: "2px solid #e3e6f0",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                                color: "#6c757d"
                              }}
                              onClick={() => scrollThumbnails('down')}
                              disabled={!canScrollDown()}
                            >
                              <i className="bx bx-chevron-right" style={{ fontSize: "1rem" }}></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Main Image */}
                  <div className="main-image flex-grow-1">
                    <div className="position-relative" style={{ height: "350px", borderRadius: "10px", overflow: "hidden", backgroundColor: "#f8f9fa", border: "2px solid #e9ecef" }}>
                      {allImages[selectedImageIndex] ? (
                        <Image
                          fill
                          src={allImages[selectedImageIndex]}
                          alt={productDetails.title}
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

              {/* Current Product Information */}
              <div className="col-lg-7 col-md-12">
                <div className="product-info ps-lg-4">
                  <div style={{ height: "350px", display: "flex", flexDirection: "column", overflow: "hidden" }}>
                    {compactLayout ? (
                      // Compact layout for price-inventory page
                      <>
                        <div className="row g-2 h-100">
                          {/* Left Column */}
                          <div className="col-md-6">
                            <div className="d-flex flex-column gap-2 h-100">
                              <div className="info-card p-2" style={{ backgroundColor: "#fff", border: "1px solid #e9ecef", borderRadius: "6px", flex: "1", minHeight: "0" }}>
                                <div className="d-flex align-items-center">
                                  <div className="icon-wrapper me-2" style={{ width: "28px", height: "28px", backgroundColor: "#f8f9fa", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <i className="bx bx-star text-warning" style={{ fontSize: "1rem" }}></i>
                                  </div>
                                  <div>
                                    <small className="text-muted d-block mb-0" style={{ fontSize: "0.75rem" }}>Marka</small>
                                    <span className="fw-semibold text-dark" style={{ fontSize: "0.9rem" }}>
                                      {productDetails.trendyolInfo?.brand || "Marka bilgisi yok"}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="info-card p-2" style={{ backgroundColor: "#fff", border: "1px solid #e9ecef", borderRadius: "6px", flex: "1", minHeight: "0" }}>
                                <div className="d-flex align-items-center">
                                  <div className="icon-wrapper me-2" style={{ width: "28px", height: "28px", backgroundColor: "#f8f9fa", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <i className="bx bx-barcode text-primary" style={{ fontSize: "1rem" }}></i>
                                  </div>
                                  <div>
                                    <small className="text-muted d-block mb-0" style={{ fontSize: "0.75rem" }}>Barkod</small>
                                    <span className="fw-semibold text-dark font-monospace" style={{ fontSize: "0.9rem" }}>
                                      {productDetails.barcodeNumber}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="info-card p-2" style={{ backgroundColor: "#fff", border: "1px solid #e9ecef", borderRadius: "6px", flex: "1", minHeight: "0" }}>
                                <div className="d-flex align-items-center">
                                  <div className="icon-wrapper me-2" style={{ width: "28px", height: "28px", backgroundColor: "#e8f5e8", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <i className="bx bx-store text-warning" style={{ fontSize: "1rem" }}></i>
                                  </div>
                                  <div>
                                    <small className="text-muted d-block mb-0" style={{ fontSize: "0.75rem" }}>Mevcut Stok</small>
                                    <span className="fw-bold text-success" style={{ fontSize: "1.1rem" }}>
                                      {productDetails.sellableQuantity} adet
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Right Column */}
                          <div className="col-md-6">
                            <div className="d-flex flex-column gap-2 h-100">
                              <div className="info-card p-2" style={{ backgroundColor: "#fff", border: "1px solid #e9ecef", borderRadius: "6px", flex: "1", minHeight: "0" }}>
                                <div className="d-flex align-items-center">
                                  <div className="icon-wrapper me-2" style={{ width: "28px", height: "28px", backgroundColor: "#e8f5e8", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <i className="bx bx-money text-success" style={{ fontSize: "1rem" }}></i>
                                  </div>
                                  <div>
                                    <small className="text-muted d-block mb-0" style={{ fontSize: "0.75rem" }}>Mevcut Fiyat</small>
                                    <span className="fw-bold text-success" style={{ fontSize: "1.1rem" }}>
                                      ₺{productDetails.price.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="info-card p-2" style={{ backgroundColor: "#fff", border: "1px solid #e9ecef", borderRadius: "6px", flex: "1", minHeight: "0" }}>
                                <div className="d-flex align-items-center">
                                  <div className="icon-wrapper me-2" style={{ width: "28px", height: "28px", backgroundColor: "#f8f9fa", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <i className="bx bx-hash text-primary" style={{ fontSize: "1rem" }}></i>
                                  </div>
                                  <div>
                                    <small className="text-muted d-block mb-0" style={{ fontSize: "0.75rem" }}>Stok Kodu</small>
                                    <span className="fw-semibold text-dark font-monospace" style={{ fontSize: "0.9rem" }}>
                                      {productDetails.trendyolInfo?.stockCode}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="info-card p-2" style={{ backgroundColor: "#fff", border: "1px solid #e9ecef", borderRadius: "6px", flex: "1", minHeight: "0" }}>
                                <div className="d-flex align-items-center">
                                  <div className="icon-wrapper me-2" style={{ width: "28px", height: "28px", backgroundColor: "#f8f9fa", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <i className="bx bx-category text-primary" style={{ fontSize: "1rem" }}></i>
                                  </div>
                                  <div>
                                    <small className="text-muted d-block mb-0" style={{ fontSize: "0.75rem" }}>Trendyol Kategori</small>
                                    <span className="fw-semibold text-dark" style={{ fontSize: "0.9rem" }}>
                                      {productDetails.trendyolInfo?.categoryName}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      // Full layout for update page - Desktop only
                      <>
                        <div className="row g-2 h-100 d-none d-md-flex">
                          <div className="col-md-6">
                            <div className="d-flex flex-column gap-2 h-100">
                              <div className="info-card p-3" style={{ backgroundColor: "#fff", border: "1px solid #e9ecef", borderRadius: "6px", flex: "1", minHeight: "0" }}>
                                <div className="d-flex align-items-center mb-2">
                                  <div className="icon-wrapper me-2" style={{ width: "32px", height: "32px", backgroundColor: "#f8f9fa", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <i className="bx bx-star text-warning" style={{ fontSize: "1.1rem" }}></i>
                                  </div>
                                  <span className="text-muted" style={{ fontSize: "1.1rem", fontWeight: "500" }}>Marka</span>
                                </div>
                                <div className="ps-1">
                                  <span className="fw-bold text-dark" style={{ fontSize: "0.95rem" }}>
                                    {productDetails.trendyolInfo?.brand || "Marka bilgisi yok"}
                                  </span>
                                </div>
                              </div>

                              <div className="info-card p-3" style={{ backgroundColor: "#fff", border: "1px solid #e9ecef", borderRadius: "6px", flex: "1", minHeight: "0" }}>
                                <div className="d-flex align-items-center mb-2">
                                  <div className="icon-wrapper me-2" style={{ width: "32px", height: "32px", backgroundColor: "#f8f9fa", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <i className="bx bx-barcode text-primary" style={{ fontSize: "1.1rem" }}></i>
                                  </div>
                                  <span className="text-muted" style={{ fontSize: "1.1rem", fontWeight: "500" }}>Barkod</span>
                                </div>
                                <div className="ps-1">
                                  <span className="fw-bold text-dark font-monospace" style={{ fontSize: "0.95rem" }}>
                                    {productDetails.barcodeNumber}
                                  </span>
                                </div>
                              </div>

                              <div className="info-card p-3" style={{ backgroundColor: "#fff", border: "1px solid #e9ecef", borderRadius: "6px", flex: "1", minHeight: "0" }}>
                                <div className="d-flex align-items-center mb-2">
                                  <div className="icon-wrapper me-2" style={{ width: "32px", height: "32px", backgroundColor: "#e8f5e8", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <i className="bx bx-hash text-primary" style={{ fontSize: "1.1rem" }}></i>
                                  </div>
                                  <span className="text-muted" style={{ fontSize: "1.1rem", fontWeight: "500" }}>Stok Kodu</span>
                                </div>
                                <div className="ps-1">
                                  <span className="fw-bold text-dark font-monospace" style={{ fontSize: "0.95rem" }}>
                                    {productDetails.trendyolInfo?.stockCode || "Belirtilmemiş"}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="col-md-6">
                            <div className="d-flex flex-column gap-2 h-100">
                              <div className="info-card p-3" style={{ backgroundColor: "#fff", border: "1px solid #e9ecef", borderRadius: "6px", flex: "1", minHeight: "0" }}>
                                <div className="d-flex align-items-center mb-2">
                                  <div className="icon-wrapper me-2" style={{ width: "32px", height: "32px", backgroundColor: "#f8f9fa", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <i className="bx bx-category text-primary" style={{ fontSize: "1.1rem" }}></i>
                                  </div>
                                  <span className="text-muted" style={{ fontSize: "1.1rem", fontWeight: "500" }}>Kategori</span>
                                </div>
                                <div className="ps-1">
                                  <span className="fw-bold text-dark" style={{ fontSize: "0.95rem" }}>
                                    {productDetails.trendyolInfo?.categoryName || "Belirtilmemiş"}
                                  </span>
                                </div>
                              </div>

                              <div className="info-card p-3" style={{ backgroundColor: "#fff", border: "1px solid #e9ecef", borderRadius: "6px", flex: "1", minHeight: "0" }}>
                                <div className="d-flex align-items-center mb-2">
                                  <div className="icon-wrapper me-2" style={{ width: "32px", height: "32px", backgroundColor: "#e8f5e8", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <i className="bx bx-package text-success" style={{ fontSize: "1.1rem" }}></i>
                                  </div>
                                  <span className="text-muted" style={{ fontSize: "1.1rem", fontWeight: "500" }}>Kargo Desi</span>
                                </div>
                                <div className="ps-1">
                                  <span className="fw-bold text-dark" style={{ fontSize: "0.95rem" }}>
                                    {productDetails.trendyolInfo?.dimensionalWeight || 0} kg
                                  </span>
                                </div>
                              </div>

                              <div className="info-card p-3" style={{ backgroundColor: "#fff", border: "1px solid #e9ecef", borderRadius: "6px", flex: "1", minHeight: "0" }}>
                                <div className="d-flex align-items-center mb-2">
                                  <div className="icon-wrapper me-2" style={{ width: "32px", height: "32px", backgroundColor: "#f8f9fa", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <i className="bx bx-receipt text-warning" style={{ fontSize: "1.1rem" }}></i>
                                  </div>
                                  <span className="text-muted" style={{ fontSize: "1.1rem", fontWeight: "500" }}>KDV Oranı</span>
                                </div>
                                <div className="ps-1">
                                  <span className="fw-bold text-dark" style={{ fontSize: "0.95rem" }}>
                                    %{productDetails.trendyolInfo?.vatRate || 20}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Mobile compact layout */}
                        <div className="d-block d-md-none">
                          <div className="row g-2">
                            <div className="col-6">
                              <div className="info-card p-2" style={{ backgroundColor: "#fff", border: "1px solid #e9ecef", borderRadius: "6px" }}>
                                <div className="d-flex align-items-center mb-1">
                                  <div className="icon-wrapper me-2" style={{ width: "24px", height: "24px", backgroundColor: "#f8f9fa", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <i className="bx bx-star text-warning" style={{ fontSize: "0.9rem" }}></i>
                                  </div>
                                  <small className="text-muted" style={{ fontSize: "0.7rem" }}>Marka</small>
                                </div>
                                <div>
                                  <span className="fw-semibold text-dark" style={{ fontSize: "0.8rem" }}>
                                    {productDetails.trendyolInfo?.brand || "Marka bilgisi yok"}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="col-6">
                              <div className="info-card p-2" style={{ backgroundColor: "#fff", border: "1px solid #e9ecef", borderRadius: "6px" }}>
                                <div className="d-flex align-items-center mb-1">
                                  <div className="icon-wrapper me-2" style={{ width: "24px", height: "24px", backgroundColor: "#f8f9fa", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <i className="bx bx-barcode text-primary" style={{ fontSize: "0.9rem" }}></i>
                                  </div>
                                  <small className="text-muted" style={{ fontSize: "0.7rem" }}>Barkod</small>
                                </div>
                                <div>
                                  <span className="fw-semibold text-dark font-monospace" style={{ fontSize: "0.75rem" }}>
                                    {productDetails.barcodeNumber}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="col-6">
                              <div className="info-card p-2" style={{ backgroundColor: "#fff", border: "1px solid #e9ecef", borderRadius: "6px" }}>
                                <div className="d-flex align-items-center mb-1">
                                  <div className="icon-wrapper me-2" style={{ width: "24px", height: "24px", backgroundColor: "#f8f9fa", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <i className="bx bx-category text-primary" style={{ fontSize: "0.9rem" }}></i>
                                  </div>
                                  <small className="text-muted" style={{ fontSize: "0.7rem" }}>Kategori</small>
                                </div>
                                <div>
                                  <span className="fw-semibold text-dark" style={{ fontSize: "0.8rem" }}>
                                    {productDetails.trendyolInfo?.categoryName || "Belirtilmemiş"}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="col-6">
                              <div className="info-card p-2" style={{ backgroundColor: "#fff", border: "1px solid #e9ecef", borderRadius: "6px" }}>
                                <div className="d-flex align-items-center mb-1">
                                  <div className="icon-wrapper me-2" style={{ width: "24px", height: "24px", backgroundColor: "#f8f9fa", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <i className="bx bx-hash text-primary" style={{ fontSize: "0.9rem" }}></i>
                                  </div>
                                  <small className="text-muted" style={{ fontSize: "0.7rem" }}>Stok Kodu</small>
                                </div>
                                <div>
                                  <span className="fw-semibold text-dark font-monospace" style={{ fontSize: "0.75rem" }}>
                                    {productDetails.trendyolInfo?.stockCode || "Belirtilmemiş"}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="col-6">
                              <div className="info-card p-2" style={{ backgroundColor: "#fff", border: "1px solid #e9ecef", borderRadius: "6px" }}>
                                <div className="d-flex align-items-center mb-1">
                                  <div className="icon-wrapper me-2" style={{ width: "24px", height: "24px", backgroundColor: "#f8f9fa", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <i className="bx bx-package text-success" style={{ fontSize: "0.9rem" }}></i>
                                  </div>
                                  <small className="text-muted" style={{ fontSize: "0.7rem" }}>Kargo Desi</small>
                                </div>
                                <div>
                                  <span className="fw-semibold text-dark" style={{ fontSize: "0.8rem" }}>
                                    {productDetails.trendyolInfo?.dimensionalWeight || 0} kg
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="col-6">
                              <div className="info-card p-2" style={{ backgroundColor: "#fff", border: "1px solid #e9ecef", borderRadius: "6px" }}>
                                <div className="d-flex align-items-center mb-1">
                                  <div className="icon-wrapper me-2" style={{ width: "24px", height: "24px", backgroundColor: "#f8f9fa", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <i className="bx bx-receipt text-warning" style={{ fontSize: "0.9rem" }}></i>
                                  </div>
                                  <small className="text-muted" style={{ fontSize: "0.7rem" }}>KDV Oranı</small>
                                </div>
                                <div>
                                  <span className="fw-semibold text-dark" style={{ fontSize: "0.8rem" }}>
                                    %{productDetails.trendyolInfo?.vatRate || 20}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendyolProductHeader; 