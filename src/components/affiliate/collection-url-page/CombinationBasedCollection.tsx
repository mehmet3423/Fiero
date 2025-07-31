import { CombinationBasedAffiliateItem } from "@/constants/models/Affiliate";
import { useCart } from "@/hooks/context/useCart";
import { useActiveCollectionCookie } from "@/hooks/useActiveCollectionCookie";
import { useState } from "react";
import { toast } from "react-hot-toast";

interface CombinationBasedCollectionProps {
  combinationBasedAffiliateItems: CombinationBasedAffiliateItem[];
}

function CombinationBasedCollection({
  combinationBasedAffiliateItems,
}: CombinationBasedCollectionProps) {
  const {
    cartProducts,
    addToCart,
    updateQuantity,
    updateLoading,
    removeFromCart,
  } = useCart();
  const {
    canAddToCart,
    updateActiveCollection,
    removeMultipleFromActiveCollection,
    addMultipleActiveCollection,
  } = useActiveCollectionCookie();
  const [isLoading, setIsLoading] = useState(false);

  const handleAddAllToCart = async () => {
    setIsLoading(true);
    try {
      // Tüm ürünleri sırayla sepete ekle
      for (const item of combinationBasedAffiliateItems) {
        if (canAddToCart(item.affiliateCollectionId)) {
          await addToCart(item.product.id);
        }
        addMultipleActiveCollection(
          item.affiliateCollectionId,
          combinationBasedAffiliateItems.map((item) => item.product.id)
        );
      }
    } catch (error) {
      console.error("Ürünler sepete eklenirken hata oluştu:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveAllFromCart = async () => {
    setIsLoading(true);
    try {
      // Tüm ürünleri sırayla sepetten kaldır
      for (const item of combinationBasedAffiliateItems) {
        await removeFromCart(item.product.id);
      }
      // Tüm ürünleri aktif koleksiyondan kaldır
      removeMultipleFromActiveCollection(
        combinationBasedAffiliateItems.map((item) => item.product.id)
      );
    } catch (error) {
      console.error("Ürünler sepetten kaldırılırken hata oluştu:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (
      !canAddToCart(combinationBasedAffiliateItems[0].affiliateCollectionId)
    ) {
      toast.error(
        "Farklı bir koleksiyondan ürün ekleyemezsiniz. Lütfen önce mevcut koleksiyonu tamamlayın."
      );
      return;
    }
    if (quantity < 1 || quantity > 10) return;
    updateQuantity(productId, quantity);
    updateActiveCollection(productId);
  };

  const isAllProductsInCart = () => {
    return combinationBasedAffiliateItems.every((item) =>
      cartProducts.some((cartItem) => cartItem.id === item.product.id)
    );
  };

  const getProductQuantity = (productId: string) => {
    const product = cartProducts.find((item) => item.id === productId);
    return product ? product.quantity : 0;
  };
  const truncate = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  return (
    <div>
      <div className="mb-4">
        <button
          className="btn btn-dark"
          onClick={
            isAllProductsInCart() ? handleRemoveAllFromCart : handleAddAllToCart
          }
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              ></span>
              {isAllProductsInCart() ? "Kaldırılıyor..." : "Ekleniyor..."}
            </>
          ) : isAllProductsInCart() ? (
            "Tüm Ürünleri Sepetten Kaldır"
          ) : (
            "Tüm Ürünleri Sepete Ekle"
          )}
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-hover">
          <thead>
            <tr>
              <th style={{ width: "100px" }}>Resim</th>
              <th>Ürün Adı</th>
              <th>Açıklama</th>
              <th>Fiyat</th>
              <th style={{ width: "150px", textAlign: "center" }}>İşlem</th>
            </tr>
          </thead>
          <tbody>
            {combinationBasedAffiliateItems.map((item) => (
              <tr
                key={item.id}
                style={{ cursor: "pointer" }}
                onClick={() =>
                  (window.location.href = `/products/${item.product.id}`)
                }
              >
                <td>
                  <img
                    src={item.product.baseImageUrl || "/images/no-image.png"}
                    alt={item.product.title}
                    style={{
                      width: "80px",
                      height: "80px",
                      objectFit: "cover",
                      marginLeft: "8px",
                    }}
                    className="rounded"
                  />
                </td>
                <td>{item.product.title}</td>
                <td>
                  <small className="text-muted">
                    {truncate(item.product.description, 60)}
                  </small>
                </td>
                <td>{item.product.price} TL</td>
                <td onClick={(e) => e.stopPropagation()}>
                  {cartProducts.some(
                    (cartItem) => cartItem.id === item.product.id
                  ) ? (
                    <div className="cart-product-quantity d-flex align-items-center justify-content-center">
                      <button
                        disabled={updateLoading}
                        className="btn btn-link p-0 mr-2"
                        onClick={() =>
                          handleUpdateQuantity(
                            item.product.id,
                            Math.max(1, getProductQuantity(item.product.id) - 1)
                          )
                        }
                        style={{ fontSize: "1.2rem", color: "#777" }}
                      >
                        <i className="icon-minus"></i>
                      </button>

                      <p className="mb-0">
                        {getProductQuantity(item.product.id)}
                      </p>

                      <button
                        disabled={updateLoading}
                        className="btn btn-link p-0 ml-2"
                        onClick={() =>
                          handleUpdateQuantity(
                            item.product.id,
                            Math.min(
                              10,
                              getProductQuantity(item.product.id) + 1
                            )
                          )
                        }
                        style={{ fontSize: "1.2rem", color: "#777" }}
                      >
                        <i className="icon-plus"></i>
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <span
                        className="px-3 py-1 d-inline-block"
                        style={{
                          backgroundColor: "black",
                          color: "white",
                          fontSize: "0.9rem",
                          borderRadius: "20px",
                          fontWeight: "500",
                          border: "1px solid #ccc",
                          minWidth: "120px",
                        }}
                      >
                        Sepette Değil
                      </span>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default CombinationBasedCollection;
