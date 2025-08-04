import { PathEnums } from "@/constants/enums/PathEnums";
import { useCart } from "@/hooks/context/useCart";
import Link from "next/link";
import { useState } from "react";

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { cartProducts, removeFromCart, updateQuantity } = useCart();
  const [agreeTerms, setAgreeTerms] = useState(false);

  const cartTotal = cartProducts.reduce(
    (total, item) => total + (item.discountedPrice || item.price) * item.quantity,
    0
  );

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1 || quantity > 10) return;
    updateQuantity(productId, quantity);
  };

  const updateCartQuantity = (productId: string, newQuantity: number) => {
    handleUpdateQuantity(productId, newQuantity);
  };

  if (!isOpen) return null;

  return (
    <>
      
      {/* Cart Modal */}
      <div
        className={`modal fullRight ${isOpen ? 'show' : ''} modal-shopping-cart`}
        style={{ display: isOpen ? 'block' : 'none' }}
      >
        {/* Backdrop */}
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
                        cartProducts.map((item) => (
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
                                {(item.discountedPrice || item.price).toLocaleString("tr-TR", {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}₺
                              </div>
                              <div className="tf-mini-cart-btns">
                                <div className="wg-quantity small">
                                  <span
                                    className="btn-quantity minus-btn"
                                    onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                                  >
                                    -
                                  </span>
                                  <input type="text" name="number" value={item.quantity} readOnly />
                                  <span
                                    className="btn-quantity plus-btn"
                                    onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                                  >
                                    +
                                  </span>
                                </div>
                                <div
                                  className="tf-mini-cart-remove"
                                  onClick={() => removeFromCart(item.id)}
                                  style={{
                                    cursor: 'pointer',
                                    transition: 'color 0.3s ease'
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
                        ))
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
                    <div className="tf-cart-totals-discounts">
                      <div className="tf-cart-total">Ara Toplam</div>
                      <div className="tf-totals-total-value fw-6">
                        {cartTotal.toLocaleString("tr-TR", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}₺
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