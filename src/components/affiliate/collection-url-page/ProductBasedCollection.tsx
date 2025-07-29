import { ProductBasedAffiliateItem } from "@/constants/models/Affiliate";
import { useCart } from "@/hooks/context/useCart";
import { useActiveCollectionCookie } from "@/hooks/useActiveCollectionCookie";
import { toast } from "react-hot-toast";

interface ProductBasedCollectionProps {
  productBasedAffiliateItems: ProductBasedAffiliateItem[];
}

function ProductBasedCollection({ productBasedAffiliateItems }: ProductBasedCollectionProps) {
  const { cartProducts, addToCart, updateQuantity, updateLoading, removeFromCart } = useCart();
  const { canAddToCart, removeFromActiveCollection, updateActiveCollection, activeCollection, createActiveCollection, addMultipleActiveCollection } = useActiveCollectionCookie();

  const handleAddToCart = async (productId: string) => {
    if (!canAddToCart(productBasedAffiliateItems[0].affiliateCollectionId)) {
      toast.error('Farklı bir koleksiyondan ürün ekleyemezsiniz. Lütfen önce mevcut koleksiyonu tamamlayın.');
      return;
    }
    await addToCart(productId);
    if (!activeCollection) {
      createActiveCollection(productBasedAffiliateItems[0].affiliateCollectionId, productId);
    }
    else {
      updateActiveCollection(productId);
    }
  }


  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity < 0) return;

    if (!canAddToCart(productBasedAffiliateItems[0].affiliateCollectionId)) {
      toast.error('Farklı bir koleksiyondan ürün ekleyemezsiniz. Lütfen önce mevcut koleksiyonu tamamlayın.');
      return;
    }

    if (quantity === 0) {
      removeFromCart(productId);
      removeFromActiveCollection(productId);
      return;
    }
    updateQuantity(productId, quantity);
    updateActiveCollection(productId);
    console.log(productId);
  }

  const isProductInCart = (productId: string) => {
    return cartProducts.some(item => item.id === productId);
  }

  const getProductQuantity = (productId: string) => {
    const product = cartProducts.find(item => item.id === productId);
    return product ? product.quantity : 0;
  }

  const truncate = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };


  return (
    <div className="table-responsive">
      <table className="table table-hover">
        <thead>
          <tr>
            <th style={{ width: '100px' }}>Resim</th>
            <th>Ürün Adı</th>
            <th>Açıklama</th>
            <th>Fiyat</th>
            <th style={{ width: '150px', textAlign: 'center' }}>İşlem</th>
          </tr>
        </thead>
        <tbody>
          {productBasedAffiliateItems.map((item) => (
            <tr key={item.id} style={{ cursor: 'pointer' }} onClick={() => window.location.href = `/products/${item.product.id}`}>
              <td>
                <img
                  src={item.product.baseImageUrl || '/images/no-image.png'}
                  alt={item.product.title}
                  style={{ width: '80px', height: '80px', objectFit: 'cover', marginLeft: '8px' }}
                  className="rounded"
                />
              </td>
              <td>{item.product.title}</td>
              <td>
                <small className="text-muted">
                  {truncate(item.product.description, 60)}
                </small>

              </td>
              <td>{item.product.price} ₺</td>
              <td onClick={(e) => e.stopPropagation()}>
                {isProductInCart(item.product.id) ? (
                  <div className="cart-product-quantity d-flex align-items-center justify-content-center">
                    <button
                      disabled={updateLoading}
                      className="btn btn-link p-0 mr-2"
                      onClick={(e) => { e.stopPropagation(); handleUpdateQuantity(item.product.id, getProductQuantity(item.product.id) - 1); }}
                      style={{ fontSize: "1.2rem", color: "#777" }}
                    >
                      <i className="icon-minus"></i>
                    </button>

                    <p className="mb-0">{getProductQuantity(item.product.id)}</p>

                    <button
                      disabled={updateLoading}
                      className="btn btn-link p-0 ml-2"
                      onClick={(e) => { e.stopPropagation(); handleUpdateQuantity(item.product.id, Math.min(10, getProductQuantity(item.product.id) + 1)); }}
                      style={{ fontSize: "1.2rem", color: "#777" }}
                    >
                      <i className="icon-plus"></i>
                    </button>
                  </div>
                ) : (
                  <button
                    className="btn btn-primary btn-sm w-100"
                    onClick={(e) => { e.stopPropagation(); handleAddToCart(item.product.id); }}
                    style={{
                      backgroundColor: "black",
                      color: "white",
                      borderRadius: "8px",
                      padding: "8px 12px",
                      border: "none",
                      fontSize: "0.95rem",
                      margin: "0 auto",
                      display: "block",
                      width: "130px",
                    }}
                  >
                    Sepete Ekle
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
export default ProductBasedCollection
