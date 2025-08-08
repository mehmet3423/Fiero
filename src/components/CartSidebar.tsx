import { PathEnums } from "@/constants/enums/PathEnums";
import { useCart } from "@/hooks/context/useCart";
import Link from "next/link";
import { useState } from "react";

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const {
    cartProducts,
    initialLoading,
    removeFromCart,
    updateQuantity,
    updateLoading,
    removeLoading,
    cargoPrice,
    cargoDiscountedPrice,
    totalPrice, // Backend'den gelen toplam fiyat
    totalDiscountedPrice, // Backend'den gelen indirimli toplam fiyat
  } = useCart();
  
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1 || quantity > 10) return;
    updateQuantity(productId, quantity);
  };

  const updateCartQuantity = (productId: string, newQuantity: number) => {
    handleUpdateQuantity(productId, newQuantity);
  };

  if (!isOpen) return null;

  // Loading durumunda
  if (initialLoading) {
    return (
      <>
        <div
          className={`modal fullRight ${isOpen ? 'show' : ''} modal-shopping-cart`}
          style={{ display: isOpen ? 'block' : 'none' }}
        >
          <div
            className="modal-backdrop-overlay"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0,0,0,0.5)',
              zIndex: -1
            }}
            onClick={onClose}
          ></div>
          <div className="modal-dialog">
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="header">
                <div className="title fw-5">Alışveriş Sepeti</div>
                <span className="icon-close icon-close-popup" onClick={onClose} style={{ cursor: 'pointer' }}></span>
              </div>
              <div className="wrap">
                <div className="tf-mini-cart-wrap">
                  <div className="tf-mini-cart-main">
                    <div className="tf-mini-cart-sroll">
                      <div className="tf-mini-cart-items">
                        <div style={{ textAlign: 'center', padding: '20px' }}>
                          <p>Sepet yükleniyor...</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Backend'den gelen fiyatları kullan
  const backendSubtotal = totalPrice - (cargoDiscountedPrice || cargoPrice); // Backend toplam - kargo
  const backendTotal = totalPrice; // Backend'den gelen toplam fiyat

  // Frontend'de gösterim için hesaplama (sadece görsel amaçlı)
  const frontendSubtotal = cartProducts.reduce(
    (total, item) => total + Number(item.price || 0) * Number(item.quantity),
    0
  );

  const frontendDiscountedSubtotal = cartProducts.reduce((total, item) => {
    const priceToUse = item.discountedPrice || item.price || 0;
    return total + Number(priceToUse) * Number(item.quantity);
  }, 0);

  const frontendDiscountAmount = frontendSubtotal - frontendDiscountedSubtotal;

  return (
    <>
      <div
        className={`modal fullRight ${isOpen ? 'show' : ''} modal-shopping-cart`}
        style={{ display: isOpen ? 'block' : 'none' }}
      >
        <div
          className="modal-backdrop-overlay"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: -1
          }}
          onClick={onClose}
        ></div>
        <div className="modal-dialog">
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="header">
              <div className="title fw-5">Alışveriş Sepeti</div>
              <span className="icon-close icon-close-popup" onClick={onClose} style={{ cursor: 'pointer' }}></span>
            </div>
            <div className="wrap">
              <div className="tf-mini-cart-wrap">
                <div className="tf-mini-cart-main">
                  <div className="tf-mini-cart-sroll">
                    <div className="tf-mini-cart-items">
                      {cartProducts.length > 0 ? (
                        cartProducts.map((item) => {
                          const discountedTotal =
                            (item.price || 0) === (item.discountedPrice || 0)
                              ? Number(item.price || 0) * Number(item.quantity)
                              : Number(item.discountedPrice || 0) * Number(item.quantity);

                          return (
                            <div key={item.id} className="tf-mini-cart-item">
                              <div className="tf-mini-cart-image">
                                <Link href={`/products/${item.id}`} onClick={onClose}>
                                  <img src={item.baseImageUrl || "/assets/site/images/no-image.jpg"} alt={item.title} />
                                </Link>
                              </div>
                              <div className="tf-mini-cart-info">
                                <Link className="title link" href={`/products/${item.id}`} onClick={onClose}>
                                  {item.title}
                                </Link>
                                <div className="price fw-6">
                                  {(() => {
                                    // Ücretsiz ürünler için fiyat gösterimi
                                    if ((item as any).isFreeProduct) {
                                      return (
                                        <div style={{ position: "relative" }}>
                                          <span>
                                            {(item.price || 0).toFixed(2)} ₺
                                          </span>
                                        </div>
                                      );
                                    }

                                    // Check if there's an active discount
                                    const hasDiscount = (item as any).discountDTO !== null;

                                    if (hasDiscount || (item.price || 0) !== (item.discountedPrice || 0)) {
                                      return (
                                        <div style={{ position: "relative" }}>
                                          <span
                                            className="old-price"
                                            style={{
                                              textDecoration: "line-through",
                                              fontSize: "12px",
                                              color: "#999",
                                              display: "block",
                                            }}
                                          >
                                            {(item.price || 0).toFixed(2)} ₺
                                          </span>
                                          <span className="new-price">
                                            {Number(item.discountedPrice || 0).toFixed(2)} ₺
                                          </span>
                                        </div>
                                      );
                                    } else {
                                      return (
                                        <span>
                                          {(item.price || 0).toFixed(2)} ₺
                                        </span>
                                      );
                                    }
                                  })()}
                                </div>
                                <div className="tf-mini-cart-btns">
                                  <div className="wg-quantity small">
                                    <span
                                      className="btn-quantity minus-btn"
                                      onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                                      style={{ 
                                        opacity: updateLoading || item.quantity === 1 ? 0.5 : 1,
                                        pointerEvents: updateLoading || item.quantity === 1 ? 'none' : 'auto'
                                      }}
                                    >
                                      -
                                    </span>
                                    <input type="text" name="number" value={item.quantity} readOnly />
                                    <span
                                      className="btn-quantity plus-btn"
                                      onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                                      style={{ 
                                        opacity: updateLoading ? 0.5 : 1,
                                        pointerEvents: updateLoading ? 'none' : 'auto'
                                      }}
                                    >
                                      +
                                    </span>
                                  </div>
                                  <div
                                    className="tf-mini-cart-remove"
                                    onClick={() => removeFromCart(item.id)}
                                    style={{
                                      cursor: 'pointer',
                                      transition: 'color 0.3s ease',
                                      opacity: removeLoading ? 0.5 : 1,
                                      pointerEvents: removeLoading ? 'none' : 'auto'
                                    }}
                                    onMouseEnter={(e) => {
                                      const target = e.target as HTMLElement;
                                      if (target) target.style.color = '#dc3545';
                                    }}
                                    onMouseLeave={(e) => {
                                      const target = e.target as HTMLElement;
                                      if (target) target.style.color = '';
                                    }}
                                  >
                                    Kaldır
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="empty-cart" style={{ textAlign: 'center', padding: '20px' }}>
                          <p>Sepetiniz boş</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="tf-mini-cart-bottom">
                  <div className="tf-mini-cart-bottom-wrap">
                    
                    {/* Ücretsiz Ürün Bildirimi */}
                    {cartProducts.some((item) => (item as any).isFreeProduct) && (
                      <div className="free-product-notification mb-3">
                        <div
                          className="d-flex align-items-center justify-content-between"
                          style={{
                            backgroundColor: "#f8f9fa",
                            padding: "8px 12px",
                            borderRadius: "4px",
                            border: "1px solid #e9ecef",
                            marginBottom: "10px"
                          }}
                        >
                          <div className="d-flex align-items-center">
                            <i
                              className="icon-gift"
                              style={{
                                fontSize: "14px",
                                marginRight: "6px",
                                color: "#28a745",
                              }}
                            ></i>
                            <span style={{ fontSize: "12px", color: "#495057" }}>
                              Ücretsiz Ürün Kampanyası
                            </span>
                          </div>
                          <span
                            style={{
                              fontSize: "12px",
                              color: "#28a745",
                              fontWeight: "500",
                            }}
                          >
                            Aktif
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="tf-cart-totals-discounts">
                      <div className="tf-cart-total">Ara Toplam</div>
                      <div className="tf-totals-total-value fw-6">
                        {backendSubtotal.toFixed(2)} ₺
                      </div>
                    </div>

                    {frontendDiscountAmount > 0 && (
                      <div className="tf-cart-totals-discounts">
                        <div className="tf-cart-total">Ürün İndirimleri</div>
                        <div className="tf-totals-total-value fw-6" style={{ color: "green" }}>
                          -{frontendDiscountAmount.toFixed(2)} ₺
                        </div>
                      </div>
                    )}

                    <div className="tf-cart-totals-discounts">
                      <div className="tf-cart-total">Kargo</div>
                      <div className="tf-totals-total-value fw-6">
                        {cargoDiscountedPrice && cargoPrice !== cargoDiscountedPrice ? (
                          <div>
                            <del style={{ color: "#999", fontSize: "12px", display: "block" }}>
                              {cargoPrice.toFixed(2)} ₺
                            </del>
                            <span>{cargoDiscountedPrice.toFixed(2)} ₺</span>
                          </div>
                        ) : (
                          <span>{cargoPrice.toFixed(2)} ₺</span>
                        )}
                      </div>
                    </div>

                    <div className="tf-mini-cart-line"></div>
                    
                    <div className="tf-cart-totals-discounts">
                      <div className="tf-cart-total fw-6">Toplam</div>
                      <div className="tf-totals-total-value fw-6" style={{ fontSize: "16px", color: "#040404" }}>
                        {backendTotal.toFixed(2)} ₺
                      </div>
                    </div>

                    <div className="tf-mini-cart-line"></div>
                    <div className="tf-mini-cart-view-checkout">
                      <Link href={PathEnums.CART} onClick={onClose} className="tf-btn btn-outline radius-3 link w-100 justify-content-center">
                        Sepeti Görüntüle
                      </Link>
                      <Link
                        href={PathEnums.CHECKOUT}
                        onClick={onClose}
                        className={`tf-btn btn-fill animate-hover-btn radius-3 w-100 justify-content-center ${!agreeTerms ? 'disabled' : ''}`}
                      >
                        <span>Ödemeye Geç</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}