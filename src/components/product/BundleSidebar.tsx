import { BundleDiscount } from "@/constants/models/Discount";
import { useCart } from "@/hooks/context/useCart";
import { useGetProductListByIds } from "@/hooks/services/products/useGetProductListByIds";
import { useGetDiscountById } from "@/hooks/services/discounts/useGetDiscountById";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";

interface BundleSidebarProps {
  bundleDiscount: BundleDiscount;
  currentProductId: string;
  isOpen: boolean;
  onClose: () => void;
}

const BundleSidebar: React.FC<BundleSidebarProps> = ({
  bundleDiscount,
  currentProductId,
  isOpen,
  onClose,
}) => {
  const { addToCart } = useCart();
  const [isAddingBundle, setIsAddingBundle] = useState(false);
  console.log("bundleDiscount", bundleDiscount);

  // Bundle discount'tan product ID'leri çıkar
  const productIds =
    (bundleDiscount as any).bundleDiscountProducts?.map(
      (p: any) => p.productId
    ) ||
    bundleDiscount.productIds ||
    [];

  const { products, isLoading } = useGetProductListByIds(productIds);

  // Bundle discount ID'sini bundleDiscountProducts'tan al
  const bundleDiscountId = (bundleDiscount as any).bundleDiscountProducts?.[0]
    ?.bundleDiscountId;

  // Bundle discount detayını al
  const { discount: bundleDiscountDetail, isLoading: isBundleLoading } =
    useGetDiscountById(bundleDiscountId || "");

  const handleAddBundleToCart = async () => {
    console.log("BundleSidebar - Bundle Discount Debug:", {
      bundleDiscount,
      bundleDiscountId,
      bundleDiscountProducts: (bundleDiscount as any).bundleDiscountProducts,
    });

    if (!bundleDiscountId) {
      toast.error("Bundle ID bulunamadı");
      return;
    }

    setIsAddingBundle(true);
    try {
      // Bundle discount ID'sini itemId olarak gönder
      await addToCart(bundleDiscountId, 1);
      toast.success("Bundle sepete eklendi");
      onClose();
    } catch (error) {
      toast.error("Bundle sepete eklenirken bir hata oluştu");
      console.error("Bundle add error:", error);
    } finally {
      setIsAddingBundle(false);
    }
  };

  if (!isOpen) return null;

  // Bundle adını al - önce API'den gelen discount detayına bak, sonra mevcut bundleDiscount'a bak
  const bundleName =
    bundleDiscountDetail?.name || bundleDiscount.name || "Bundle Ürünleri";

  return (
    <>
      {/* Backdrop */}
      <div className="sidebar-backdrop" onClick={onClose} />

      {/* Sidebar */}
      <div className="bundle-sidebar">
        {/* Header */}
        <div className="sidebar-header">
          <h5 className="sidebar-title">
            {isBundleLoading ? "Yükleniyor..." : bundleName}
          </h5>
          <button className="close-btn" onClick={onClose}>
            <i className="icon-close"></i>
          </button>
        </div>

        {/* Content */}
        <div className="sidebar-content">
          {isLoading ? (
            <div className="loading-container">
              <div className="spinner-border text-primary" role="status"></div>
            </div>
          ) : (
            <>
              <p className="bundle-description">
                {bundleDiscountDetail?.description ||
                  bundleDiscount.description ||
                  "Bu bundle ile avantajlı fiyatlardan yararlanın."}
              </p>

              <div className="products-list">
                {products?.map((product) => (
                  <Link href={`/products/${product.id}`}>
                    <div key={product.id} className="product-item">
                      <Image
                        src={
                          product.baseImageUrl || "/assets/images/no-image.jpg"
                        }
                        alt={product.title}
                        width={80}
                        height={80}
                        style={{ objectFit: "cover", margin: 0, padding: 0 }}
                        className="product-img"
                      />
                      <div className="product-info">
                        <h6 className="product-title mb-2">
                          <Link
                            href={`/products/${product.id}`}
                            className="product-title-link"
                          >
                            {product.title}
                          </Link>
                        </h6>

                        <div className="product-price">
                          {product.price.toLocaleString("tr-TR", {
                            style: "currency",
                            currency: "TRY",
                          })}
                        </div>
                        {product.id === currentProductId && (
                          <div className="current-product-badge">
                            <i className="fas fa-check me-1"></i>
                            Şu anda görüntülediğiniz ürün
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Bundle Fiyat Bilgisi */}
              <div className="bundle-summary">
                <div className="price-row">
                  <span className="text-muted">Toplam liste fiyatı:</span>
                  <span className="original-total">
                    {products
                      ?.reduce((sum, product) => sum + product.price, 0)
                      .toLocaleString("tr-TR", {
                        style: "currency",
                        currency: "TRY",
                      })}
                  </span>
                </div>
                <div className="price-row">
                  <span className="savings-label">İndirim Tutarı:</span>
                  <span className="savings-amount">
                    {(
                      (products?.reduce(
                        (sum, product) => sum + product.price,
                        0
                      ) || 0) - (bundleDiscount.bundlePrice || 0)
                    ).toLocaleString("tr-TR", {
                      style: "currency",
                      currency: "TRY",
                    })}
                  </span>
                </div>
                <div className="price-row">
                  <span className="bundle-label text-muted">
                    Bundle Fiyatı:
                  </span>
                  <span className="bundle-total">
                    {(bundleDiscount.bundlePrice || 0).toLocaleString("tr-TR", {
                      style: "currency",
                      currency: "TRY",
                    })}
                  </span>
                </div>
              </div>

              {/* Sepete Ekle Butonu */}
              <button
                className="add-bundle-btn btn btn-primary bg-primary"
                onClick={handleAddBundleToCart}
                disabled={isAddingBundle}
              >
                {isAddingBundle ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                    ></span>
                    Bundle ekleniyor...
                  </>
                ) : (
                  <>Bundle sepete ekle</>
                )}
              </button>
            </>
          )}
        </div>
      </div>

      <style jsx>{`
        .sidebar-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          z-index: 1040;
          animation: fadeIn 0.3s ease;
        }

        .bundle-sidebar {
          position: fixed;
          top: 0;
          right: 0;
          width: 420px;
          height: 100vh;
          background-color: white;
          z-index: 1050;
          box-shadow: -4px 0 15px rgba(0, 0, 0, 0.1);
          overflow-y: auto;
          animation: slideIn 0.3s ease;
        }

        .sidebar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          border-bottom: 1px solid #e9ecef;
          background: #f8f9fa;
        }

        .sidebar-title {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
          color: #333;
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 16px;
          color: black;
          cursor: pointer;
          padding: 8px;
          border-radius: 4px;
          transition: all 0.2s ease;
        }

        .close-btn:hover {
          background: #e9ecef;
          color: #333;
        }

        .sidebar-content {
          padding: 20px;
        }

        .loading-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 200px;
        }

        .bundle-description {
          color: black;
          margin-bottom: 20px;
          line-height: 1.5;
        }

        .products-title {
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 15px;
          color: #333;
        }

        .products-list {
          margin-bottom: 20px;
        }

        .product-item {
          display: flex;
          gap: 15px;
          margin-bottom: 15px;
          padding: 15px;
          border: 1px solid #e9ecef;
          border-radius: 8px;
          transition: all 0.2s ease;
        }

        .product-item:hover {
          border-color: #007bff;
          box-shadow: 0 2px 8px rgba(0, 123, 255, 0.1);
        }

        .product-image {
          flex-shrink: 0;
          width: 80px;
          display: block;
          transition: transform 0.2s ease;
          text-decoration: none;
        }

        .product-image:hover {
          transform: scale(1.05);
        }

        .product-img {
          border-radius: 6px;
          border: 1px solid #e9ecef;
        }

        .product-info {
          flex-grow: 1;
        }

        .product-title {
          font-size: 14px;
          font-weight: 600;
          margin: 0 0 8px 0;
          color: #333;
          line-height: 1.3;
        }

        .product-title-link {
          color: #333;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .product-title-link:hover {
          color: #007bff;
          text-decoration: none;
        }

        .product-description {
          font-size: 12px;
          color: #666;
          margin-bottom: 8px;
          line-height: 1.4;
        }

        .product-price {
          font-size: 14px;
          font-weight: 600;
          color: #007bff;
          margin-bottom: 5px;
        }

        .current-product-badge {
          font-size: 11px;
          color: #28a745;
          font-weight: 500;
        }

        .bundle-summary {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 20px;
        }

        .price-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
          font-size: 14px;
        }

        .price-row:last-child {
          margin-bottom: 0;
          padding-top: 10px;
          border-top: 1px solid #dee2e6;
        }

        .original-total {
          text-decoration: line-through;
          color: black;
        }

        .bundle-label {
          font-weight: 600;
        }

        .bundle-total {
          font-weight: 600;
          color: #28a745;
          font-size: 16px;
        }

        .savings-label {
          color: #28a745;
          font-weight: 500;
        }

        .savings-amount {
          color: #28a745;
          font-weight: 600;
          font-size: 16px;
        }

        .add-bundle-btn {
          width: 100%;
          padding: 15px;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .add-bundle-btn:hover:not(:disabled) {
          background: #0056b3;
          transform: translateY(-1px);
        }

        .add-bundle-btn:disabled {
          opacity: 0.7;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideIn {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .bundle-sidebar {
            width: 100vw;
            right: 0;
          }
        }

        @media (max-width: 480px) {
          .sidebar-header {
            padding: 15px;
          }

          .sidebar-content {
            padding: 15px;
          }

          .product-item {
            gap: 10px;
            padding: 12px;
          }

          .bundle-summary {
            padding: 15px;
          }
        }
      `}</style>
    </>
  );
};

export default BundleSidebar;
