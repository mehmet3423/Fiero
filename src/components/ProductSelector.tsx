import { useState, useEffect } from "react";
import { useGetAllProducts } from "@/hooks/services/products/useGetAllProducts";
import Image from "next/image";

interface ProductSelectorProps {
  selectedProductIds: string[];
  onProductSelect: (productId: string) => void;
  multiSelect?: boolean;
  title?: string;
  height?: string;
  onTotalPriceChange?: (totalPrice: number) => void;
  onProductWithDiscountSelected?: (
    hasDiscount: boolean,
    productTitle?: string
  ) => void;
  discountType?:
    | "product"
    | "bundle"
    | "cargo"
    | "birthday"
    | "subCategory"
    | "specialDay"
    | "weekday"
    | "timeOfDay"
    | "coupon"
    | "cart";
}

const ProductSelector: React.FC<ProductSelectorProps> = ({
  selectedProductIds,
  onProductSelect,
  multiSelect = false,
  title = "Ürünler",
  height = "400px",
  onTotalPriceChange,
  onProductWithDiscountSelected,
  discountType,
}) => {
  const { data: products } = useGetAllProducts();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts =
    products?.items.filter((product) =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  const selectedProducts =
    products?.items.filter((product) =>
      selectedProductIds.includes(product.id)
    ) || [];

  const totalOriginalPrice = selectedProducts.reduce(
    (sum, product) => sum + product.price,
    0
  );

  // Check if product has active discount based on the specific discount type
  const hasActiveDiscount = (product: any) => {
    // Debug: Log product and its discount info

    // If no specific discount type is provided, check all discounts (legacy behavior)
    if (!discountType) {
      if (product.discountDTO !== null && product.discountDTO !== undefined) {
        return true;
      }

      if (product.productDiscounts && Array.isArray(product.productDiscounts)) {
        const hasActiveProductDiscount = product.productDiscounts.some(
          (discount: any) =>
            discount.isActive && discount.isWithinActiveDateRange !== false
        );
        return hasActiveProductDiscount;
      }

      return false;
    }

    // Check for specific discount types
    if (product.discountDTO !== null && product.discountDTO !== undefined) {
      // Check if the current active discount matches the specified type
      const currentDiscount = product.discountDTO;

      // API response contains discountType as string and type property for discount category
      // First check if we have a type field that matches our expected discount types
      if (currentDiscount.type !== undefined) {
        let typeMatches = false;
        switch (discountType) {
          case "product":
            typeMatches =
              currentDiscount.type === 0 || currentDiscount.type === "Product"; // DiscountType.Product
            break;
          case "bundle":
            typeMatches =
              currentDiscount.type === 1 || currentDiscount.type === "Bundle"; // DiscountType.Bundle
            break;
          case "cargo":
            typeMatches =
              currentDiscount.type === 2 || currentDiscount.type === "Cargo"; // DiscountType.Cargo
            break;
          case "birthday":
            typeMatches =
              currentDiscount.type === 3 || currentDiscount.type === "Birthday"; // DiscountType.Birthday
            break;
          case "subCategory":
            typeMatches =
              currentDiscount.type === 4 ||
              currentDiscount.type === "SubCategory";
            break;
          case "specialDay":
            typeMatches =
              currentDiscount.type === 5 ||
              currentDiscount.type === "SpecialDay";
            break;
          case "weekday":
            typeMatches =
              currentDiscount.type === 6 || currentDiscount.type === "Weekday";
            break;
          case "timeOfDay":
            typeMatches =
              currentDiscount.type === 7 ||
              currentDiscount.type === "TimeOfDay";
            break;
          case "coupon":
            typeMatches =
              currentDiscount.type === 8 || currentDiscount.type === "Coupon";
            break;
          case "cart":
            typeMatches =
              currentDiscount.type === 9 || currentDiscount.type === "Cart";
            break;
        }
        return typeMatches;
      }

      // Fallback: check nested objects (in case API structure is different)
      switch (discountType) {
        case "product":
          const hasProductDiscount =
            currentDiscount.productDiscount !== null &&
            currentDiscount.productDiscount !== undefined;
          return hasProductDiscount;
        case "bundle":
          const hasBundleDiscount =
            currentDiscount.bundleDiscount !== null &&
            currentDiscount.bundleDiscount !== undefined;
          return hasBundleDiscount;
        default:
          return false;
      }
    }

    return false;
  };

  // Toplam fiyat değiştiğinde parent component'e bildir
  useEffect(() => {
    if (onTotalPriceChange) {
      onTotalPriceChange(totalOriginalPrice);
    }
  }, [totalOriginalPrice, onTotalPriceChange]);

  const handleProductClick = (productId: string) => {
    const selectedProduct = products?.items.find((p) => p.id === productId);

    if (multiSelect) {
      onProductSelect(productId);
    } else {
      // Tek seçim modunda, aynı ürüne tıklanırsa seçimi kaldır
      if (selectedProductIds.includes(productId)) {
        onProductSelect("");
        // Product selection cleared
        if (onProductWithDiscountSelected) {
          onProductWithDiscountSelected(false);
        }
      } else {
        onProductSelect(productId);
        // Check if selected product has discount and notify parent
        if (selectedProduct && onProductWithDiscountSelected) {
          const productHasDiscount = hasActiveDiscount(selectedProduct);
          onProductWithDiscountSelected(
            productHasDiscount,
            selectedProduct.title
          );
        }
      }
    }
  };

  return (
    <div className="row mb-3">
      <div className="col-md-12">
        <label className="form-label">
          {title} {multiSelect && "(BİRDEN FAZLA ÜRÜN SEÇEBİLİRSİNİZ)"}
        </label>
      </div>

      <div className="col-md-6">
        <div className="input-group mb-3">
          <span className="input-group-text">
            <i className="bx bx-search"></i>
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Ürün ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div
          className="border rounded p-2"
          style={{ height: height, overflowY: "auto" }}
        >
          {!products ? (
            <div className="text-center py-3">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Yükleniyor...</span>
              </div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-3 text-muted">Ürün bulunamadı</div>
          ) : (
            <div className="list-group">
              {filteredProducts.map((product) => {
                const productHasDiscount = hasActiveDiscount(product);
                return (
                  <div
                    key={product.id}
                    className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center position-relative ${selectedProductIds.includes(
                      product.id
                    )}`}
                    onClick={() => handleProductClick(product.id)}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="d-flex align-items-center">
                      <div
                        className="product-image me-3"
                        style={{
                          minWidth: "50px",
                          minHeight: "50px",
                        }}
                      >
                        <Image
                          src={
                            product.baseImageUrl ||
                            "/assets/images/products/no-image.jpg"
                          }
                          alt={product.title}
                          width={50}
                          height={50}
                          className="img-thumbnail"
                          style={{ objectFit: "cover" }}
                          unoptimized
                        />
                      </div>
                      <div>
                        <h6 className="mb-1 text-dark d-flex align-items-center gap-2">
                          {product.title}
                          {productHasDiscount && (
                            <span className="badge ">
                              <i
                                className="bx bx-info-circle me-1"
                                style={{ fontSize: "1.2rem", color: "red" }}
                              ></i>
                            </span>
                          )}
                        </h6>
                        <small className="text-dark">
                          {productHasDiscount &&
                          product.discountedPrice !== product.price ? (
                            <>
                              <del className="text-muted me-1">
                                {product.price.toFixed(2)}₺
                              </del>
                              <span className="text-success fw-bold">
                                {product.discountedPrice.toFixed(2)}₺
                              </span>
                            </>
                          ) : (
                            `${product.price.toFixed(2)}₺`
                          )}
                        </small>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="col-md-6">
        <label className="form-label mb-3">
          Seçilen Ürün{multiSelect ? "ler" : ""} ({selectedProductIds.length})
        </label>
        {selectedProductIds.length > 0 ? (
          <div
            className="border rounded p-2"
            style={{ height: height, overflowY: "auto" }}
          >
            <ul className="list-group">
              {selectedProducts.map((product) => {
                const productHasDiscount = hasActiveDiscount(product);
                return (
                  <li
                    key={product.id}
                    className={`list-group-item d-flex justify-content-between align-items-center py-1 px-2 ${
                      productHasDiscount ? " bg-opacity-25" : ""
                    }`}
                  >
                    <div className="d-flex align-items-center">
                      <div
                        className="product-image me-2"
                        style={{
                          minWidth: "35px",
                          minHeight: "35px",
                        }}
                      >
                        <Image
                          src={
                            product.baseImageUrl ||
                            "/assets/images/products/no-image.jpg"
                          }
                          alt={product.title}
                          width={35}
                          height={35}
                          className="img-thumbnail"
                          style={{ objectFit: "cover" }}
                          unoptimized
                        />
                      </div>
                      <div>
                        <div
                          style={{ fontSize: "0.85rem" }}
                          className="d-flex align-items-center gap-1"
                        >
                          {product.title}
                          {productHasDiscount && (
                            <span
                              className="badge "
                              style={{ fontSize: "0.7rem" }}
                            >
                              <i
                                className="bx bx-info-circle me-1"
                                style={{ fontSize: "1.2rem", color: "red" }}
                              ></i>
                            </span>
                          )}
                        </div>
                        <small
                          className="text-muted"
                          style={{ fontSize: "0.8rem" }}
                        >
                          {productHasDiscount &&
                          product.discountedPrice !== product.price ? (
                            <>
                              <del className="text-muted me-1">
                                {product.price.toFixed(2)}₺
                              </del>
                              <span className="text-success fw-bold">
                                {product.discountedPrice.toFixed(2)}₺
                              </span>
                            </>
                          ) : (
                            `${product.price.toFixed(2)}₺`
                          )}
                        </small>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger p-1"
                      style={{ fontSize: "0.7rem" }}
                      onClick={() => handleProductClick(product.id)}
                    >
                      <i className="bx bx-x"></i>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : (
          <div
            className="border rounded p-2 text-center py-5 text-muted"
            style={{ height: height }}
          >
            Henüz ürün seçilmedi
          </div>
        )}
      </div>
      {multiSelect && (
        <div className="mt-2 pt-2 border-top">
          <strong>Toplam: {totalOriginalPrice.toFixed(2)}₺</strong>
        </div>
      )}
    </div>
  );
};

export default ProductSelector;
