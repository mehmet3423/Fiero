import PageLoadingAnimation from "@/components/shared/PageLoadingAnimation";
import { useCart } from "@/hooks/context/useCart";

import { useGetDiscountList } from "@/hooks/services/discounts/useGetDiscountList";
import { DiscountType } from "@/constants/enums/DiscountType";
import BundleProducts from "@/components/product/BundleProducts";
import BundleSlider from "@/components/product/BundleSlider";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";

function ShoppingCartPage() {
  const {
    cartProducts,
    initialLoading,
    updateQuantity,
    removeFromCart,
    clearCart,
    updateLoading,
    removeLoading,
    clearLoading,
    cargoPrice,
    cargoDiscountedPrice,
  } = useCart();
  const { t } = useLanguage();

  // Bundle discount'ları getir
  const { discounts: bundleDiscounts } = useGetDiscountList({
    discountType: DiscountType.Bundle,
    isActive: true,
    pageSize: 50, // Cart'taki tüm ürünler için yeterli bundle sayısı
  });

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1 || quantity > 10) return;
    updateQuantity(productId, quantity);
  };

  if (initialLoading) {
    return <PageLoadingAnimation />;
  }

  const EmptyCart = () => (
    <div>
      {/* page-title */}
      <div className="tf-page-title">
        <div className="container-full">
          <div className="heading text-center">{t("shoppingCart.pageTitle")}</div>
        </div>
      </div>
      {/* /page-title */}

      <nav aria-label="breadcrumb" className="breadcrumb-nav">
        <div className="container">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link href="/">{t("home")}</Link>
            </li>
            <li className="breadcrumb-item">
              <Link href="/products">{t("products")}</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {t("shoppingCart.breadcrumbShoppingCart")}
            </li>
          </ol>
        </div>
      </nav>
      <div className="py-5 text-center bg-white">
        <div className="container">
          <i
            className="icon-shopping-cart"
            style={{
              fontSize: "3.5rem",
              color: "#040404",
              marginBottom: "1.25rem",
            }}
          ></i>
          <h3 className="mb-3">{t("shoppingCart.emptyCartTitle")}</h3>
          <p className="mb-4">
            S{t("shoppingCart.emptyCartMessage")}
          </p>
          <Link href="/" className="btn btn-dark">
            <span>{t("shoppingCart.startShoppingButton")}</span>
            <i className="icon-long-arrow-right ml-2"></i>
          </Link>
        </div>
      </div>
    </div>
  );

  if (!cartProducts || cartProducts.length === 0) return <EmptyCart />;

  // Frontend'de toplam hesaplama (backend'de henüz doğru hesaplanmıyor)
  const normalTotal = cartProducts.reduce(
    (total, item) => total + Number(item.price || 0) * Number(item.quantity),
    0
  );

  const cartTotal = cartProducts.reduce((total, item) => {
    const priceToUse = item.discountedPrice || item.price || 0;
    return total + Number(priceToUse) * Number(item.quantity);
  }, 0);

  const cartDiscountAmount = normalTotal - cartTotal; // İndirim miktarı

  // Final toplam hesaplama
  const finalTotal = cartTotal + (cargoDiscountedPrice || cargoPrice);
  const normalTotalWithCargo = normalTotal + cargoPrice;

  return (
    <main className="main" style={{ backgroundColor: "#fff" }}>
      {/* page-title */}
      <div className="tf-page-title">
        <div className="container-full">
          <div className="heading text-center">{t("shoppingCart.pageTitle")}</div>
        </div>
      </div>
      {/* /page-title */}

      <nav aria-label="breadcrumb" className="breadcrumb-nav">
        <div className="container">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link href="/">{t("home")}</Link>
            </li>
            <li className="breadcrumb-item">
              <Link href="/products">{t("store")}</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {t("shoppingCart.breadcrumbShoppingCart")}
            </li>
          </ol>
        </div>
      </nav>

      {/* page-cart */}
      <section className="flat-spacing-11">
        <div className="container">
          <div className="tf-cart-countdown">
            <div className="title-left">
              <svg
                className="d-inline-block"
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="24"
                viewBox="0 0 16 24"
                fill="rgb(219 18 21)"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M10.0899 24C11.3119 22.1928 11.4245 20.2409 10.4277 18.1443C10.1505 19.2691 9.64344 19.9518 8.90645 20.1924C9.59084 18.2379 9.01896 16.1263 7.19079 13.8576C7.15133 16.2007 6.58824 17.9076 5.50148 18.9782C4.00436 20.4517 4.02197 22.1146 5.55428 23.9669C-0.806588 20.5819 -1.70399 16.0418 2.86196 10.347C3.14516 11.7228 3.83141 12.5674 4.92082 12.8809C3.73335 7.84186 4.98274 3.54821 8.66895 0C8.6916 7.87426 11.1062 8.57414 14.1592 12.089C17.4554 16.3071 15.5184 21.1748 10.0899 24Z"
                ></path>
              </svg>
              {/*<p>Bu ürünler sınırlıdır, ödeme yapın </p>*/}
            </div>
            <div
              className="js-countdown timer-count"
              data-timer="600"
              data-labels="d:,h:,m:,s"
            ></div>
          </div>
          <div className="tf-page-cart-wrap">
            <div className="tf-page-cart-item">
              <form>
                <table className="tf-table-page-cart">
                  <thead>
                    <tr>
                      <th>{t("product")}</th>
                      <th>{t("price")}</th>
                      <th>{t("quantity")}</th>
                      <th>{t("total")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartProducts.map((item) => {
                      const discountedTotal =
                        (item.price || 0) === (item.discountedPrice || 0)
                          ? Number(item.price || 0) * Number(item.quantity)
                          : Number(item.discountedPrice || 0) *
                          Number(item.quantity);

                      return (
                        <tr key={item.id} className="tf-cart-item file-delete">
                          <td className="tf-cart-item_product">
                            <Link
                              href={`/products/${item.id}`}
                              className="img-box"
                            >
                              <Image
                                src={
                                  item.baseImageUrl ||
                                  "/assets/images/no-image.jpg"
                                }
                                alt={item.title}
                                width={80}
                                height={80}
                                style={{
                                  width: "80px",
                                  height: "80px",
                                  objectFit: "cover",
                                }}
                              />
                            </Link>
                            <div className="cart-info">
                              <Link
                                href={`/products/${item.id}`}
                                className="cart-title link"
                              >
                                {item.title}
                              </Link>
                              <div className="cart-meta-variant">
                                {t("quantity")}: {item.quantity}
                              </div>
                              <button
                                onClick={() => removeFromCart(item.id)}
                                disabled={removeLoading}
                                className="remove-cart link remove"
                                style={{
                                  background: "none",
                                  border: "none",
                                  color: "#999",
                                  textDecoration: "underline",
                                  cursor: "pointer",
                                }}
                              >
                                {t("remove")}
                              </button>
                            </div>
                          </td>
                          <td
                            className="tf-cart-item_price"
                            data-cart-title={t("price")}
                          >
                            <div className="cart-price">
                              {(() => {
                                // Check if there's an active discount
                                const hasDiscount =
                                  (item as any).discountDTO !== null;

                                if (
                                  hasDiscount ||
                                  (item.price || 0) !==
                                  (item.discountedPrice || 0)
                                ) {
                                  return (
                                    <div style={{ position: "relative" }}>
                                      <span
                                        style={{
                                          textDecoration: "line-through",
                                          color: "#999",
                                          fontSize: "1.3rem",
                                          display: "block",
                                        }}
                                      >
                                        {(item.price || 0).toFixed(2)} ₺
                                      </span>
                                      <span
                                        style={{
                                          fontSize: "1.5rem",
                                          color: "#e65540",
                                          fontWeight: "600",
                                        }}
                                      >
                                        {Number(
                                          item.discountedPrice || 0
                                        ).toFixed(2)}{" "}
                                        ₺
                                      </span>
                                    </div>
                                  );
                                } else {
                                  return (
                                    <span
                                      style={{
                                        fontSize: "1.5rem",
                                        fontWeight: "600",
                                      }}
                                    >
                                      {(item.price || 0).toFixed(2)} ₺
                                    </span>
                                  );
                                }
                              })()}
                            </div>
                          </td>
                          <td
                            className="tf-cart-item_quantity"
                            data-cart-title={t("quantity")}
                          >
                            <div className="cart-quantity">
                              <div className="wg-quantity">
                                <button
                                  disabled={
                                    updateLoading || item.quantity === 1
                                  }
                                  onClick={() =>
                                    handleUpdateQuantity(
                                      item.id,
                                      Math.max(1, item.quantity - 1)
                                    )
                                  }
                                  className="btn-quantity minus-btn"
                                  style={{
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    padding: "4px",
                                  }}
                                >
                                  <svg
                                    className="d-inline-block"
                                    width="9"
                                    height="1"
                                    viewBox="0 0 9 1"
                                    fill="currentColor"
                                  >
                                    <path d="M9 1H5.14286H3.85714H0V1.50201e-05H3.85714L5.14286 0L9 1.50201e-05V1Z"></path>
                                  </svg>
                                </button>
                                <input
                                  type="text"
                                  name="number"
                                  value={item.quantity}
                                  readOnly
                                  style={{
                                    width: "40px",
                                    textAlign: "center",
                                    border: "1px solid #ddd",
                                    borderRadius: "4px",
                                    padding: "4px",
                                  }}
                                />
                                <button
                                  disabled={updateLoading}
                                  onClick={() =>
                                    handleUpdateQuantity(
                                      item.id,
                                      Math.min(10, item.quantity + 1)
                                    )
                                  }
                                  className="btn-quantity plus-btn"
                                  style={{
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    padding: "4px",
                                  }}
                                >
                                  <svg
                                    className="d-inline-block"
                                    width="9"
                                    height="9"
                                    viewBox="0 0 9 9"
                                    fill="currentColor"
                                  >
                                    <path d="M9 5.14286H5.14286V9H3.85714V5.14286H0V3.85714H3.85714V0H5.14286V3.85714H9V5.14286Z"></path>
                                  </svg>
                                </button>
                              </div>
                            </div>
                          </td>
                          <td
                            className="tf-cart-item_total"
                            data-cart-title={t("total")}
                          >
                            <div className="cart-total">
                              {(() => {
                                // Check if there's an active discount
                                const hasDiscount =
                                  (item as any).discountDTO !== null;

                                if (
                                  hasDiscount ||
                                  (item.price || 0) !==
                                  (item.discountedPrice || 0)
                                ) {
                                  return (
                                    <div style={{ position: "relative" }}>
                                      <span
                                        style={{
                                          textDecoration: "line-through",
                                          color: "#999",
                                          fontSize: "1.3rem",
                                          display: "block",
                                        }}
                                      >
                                        {(
                                          (item.price || 0) * item.quantity
                                        ).toFixed(2)}{" "}
                                        ₺
                                      </span>
                                      <span
                                        style={{
                                          fontSize: "1.5rem",
                                          color: "#e65540",
                                          fontWeight: "600",
                                        }}
                                      >
                                        {discountedTotal.toFixed(2)} ₺
                                      </span>
                                    </div>
                                  );
                                } else {
                                  return (
                                    <span
                                      style={{
                                        fontSize: "1.5rem",
                                        fontWeight: "600",
                                      }}
                                    >
                                      {(
                                        (item.price || 0) * item.quantity
                                      ).toFixed(2)}{" "}
                                      ₺
                                    </span>
                                  );
                                }
                              })()}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {/*<div className="tf-page-cart-note">
                  <label htmlFor="cart-note">Sipariş Notu Ekle</label>
                  <textarea
                    name="note"
                    id="cart-note"
                    placeholder="Size nasıl yardımcı olabiliriz?"
                  ></textarea>
                </div>*/}
              </form>
            </div>
            <div className="tf-page-cart-footer">
              <div className="tf-cart-footer-inner">
                <div className="tf-free-shipping-bar">
                  <div className="tf-progress-bar">
                    <span style={{ width: "50%" }}>
                      <div className="progress-car">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="21"
                          height="14"
                          viewBox="0 0 21 14"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M0 0.875C0 0.391751 0.391751 0 0.875 0H13.5625C14.0457 0 14.4375 0.391751 14.4375 0.875V3.0625H17.3125C17.5867 3.0625 17.845 3.19101 18.0104 3.40969L20.8229 7.12844C20.9378 7.2804 21 7.46572 21 7.65625V11.375C21 11.8582 20.6082 12.25 20.125 12.25H17.7881C17.4278 13.2695 16.4554 14 15.3125 14C14.1696 14 13.1972 13.2695 12.8369 12.25H7.72563C7.36527 13.2695 6.39293 14 5.25 14C4.10706 14 3.13473 13.2695 2.77437 12.25H0.875C0.391751 12.25 0 11.8582 0 11.375V0.875ZM2.77437 10.5C3.13473 9.48047 4.10706 8.75 5.25 8.75C6.39293 8.75 7.36527 9.48046 7.72563 10.5H12.6875V1.75H1.75V10.5H2.77437ZM14.4375 8.89937V4.8125H16.8772L19.25 7.94987V10.5H17.7881C17.4278 9.48046 16.4554 8.75 15.3125 8.75C15.0057 8.75 14.7112 8.80264 14.4375 8.89937ZM5.25 10.5C4.76676 10.5 4.375 10.8918 4.375 11.375C4.375 11.8582 4.76676 12.25 5.25 12.25C5.73323 12.25 6.125 11.8582 6.125 11.375C6.125 10.8918 5.73323 10.5 5.25 10.5ZM15.3125 10.5C14.8293 10.5 14.4375 10.8918 14.4375 11.375C14.4375 11.8582 14.8293 12.25 15.3125 12.25C15.7957 12.25 16.1875 11.8582 16.1875 11.375C16.1875 10.8918 15.7957 10.5 15.3125 10.5Z"
                          ></path>
                        </svg>
                      </div>
                    </span>
                  </div>
                  <div className="tf-progress-msg">
                    <span className="price fw-6">75.00 ₺</span>
                    {t("shoppingCart.freeShippingMessage1")}<span className="fw-6">
                      {t("shoppingCart.freeShippingMessage2")}</span>
                    {t("shoppingCart.freeShippingMessage3")}
                  </div>
                </div>
                <div className="tf-page-cart-checkout">
                  {/*<div className="shipping-calculator">
                    <summary
                      className="accordion-shipping-header d-flex justify-content-between align-items-center collapsed"
                      data-bs-target="#shipping"
                      data-bs-toggle="collapse"
                      aria-controls="shipping"
                    >
                      <h3 className="shipping-calculator-title">
                        Kargo Tahmini
                      </h3>
                      <span className="shipping-calculator_accordion-icon"></span>
                    </summary>
                    <div className="collapse" id="shipping">
                      <div className="accordion-shipping-content">
                        <fieldset className="field">
                          <label className="label">Ülke</label>
                          <select
                            className="tf-select w-100"
                            id="ShippingCountry_CartDrawer-Form"
                            name="address[country]"
                            data-default=""
                          >
                            <option value="---" data-provinces="[]">
                              ---
                            </option>
                            <option value="Turkey" data-provinces="[]">
                              Türkiye
                            </option>
                            <option value="United States" data-provinces="[]">
                              Amerika Birleşik Devletleri
                            </option>
                            <option value="Germany" data-provinces="[]">
                              Almanya
                            </option>
                            <option value="France" data-provinces="[]">
                              Fransa
                            </option>
                            <option value="United Kingdom" data-provinces="[]">
                              Birleşik Krallık
                            </option>
                          </select>
                        </fieldset>
                        <fieldset className="field">
                          <label className="label">Posta Kodu</label>
                          <input type="text" name="text" placeholder="" />
                        </fieldset>
                        <button className="tf-btn btn-fill animate-hover-btn radius-3 justify-content-center">
                          <span>Tahmin Et</span>
                        </button>
                      </div>
                    </div>
                  </div>*/}
                  <div className="cart-checkbox">
                    <input
                      type="checkbox"
                      className="tf-check"
                      id="cart-gift-checkbox"
                    />
                    <label htmlFor="cart-gift-checkbox" className="fw-4">
                      <span>{t("giftWrap")}</span> {t("giftWrapPrice")}
                      <span className="fw-5">5.00 ₺</span>
                    </label>
                  </div>
                  <div className="tf-cart-totals-discounts">
                    <h3>{t("shoppingCart.subtotalLabel")}</h3>
                    <span className="total-value">
                      {normalTotal.toFixed(2)} ₺
                    </span>
                  </div>
                  {cartTotal !== normalTotal && (
                    <div className="tf-cart-totals-discounts">
                      <h3>{t("shoppingCart.discountLabel")}</h3>
                      <span className="total-value" style={{ color: "green" }}>
                        -{cartDiscountAmount.toFixed(2)} ₺
                      </span>
                    </div>
                  )}
                  <div className="tf-cart-totals-discounts">
                    <h3>{t("shoppingCart.shippingLabel")}</h3>
                    <span className="total-value">
                      {cargoDiscountedPrice &&
                        cargoPrice !== cargoDiscountedPrice ? (
                        <>
                          <span
                            style={{
                              textDecoration: "line-through",
                              color: "#999",
                              marginRight: "0.5rem",
                            }}
                          >
                            {cargoPrice.toFixed(2)} ₺
                          </span>
                          <span style={{ color: "#e65540" }}>
                            {cargoDiscountedPrice.toFixed(2)} ₺
                          </span>
                        </>
                      ) : (
                        `${cargoPrice.toFixed(2)} ₺`
                      )}
                    </span>
                  </div>
                  <div className="tf-cart-totals-discounts">
                    <h3>{t("total")}</h3>
                    <span className="total-value">
                      {normalTotalWithCargo !== finalTotal ? (
                        <>
                          <span
                            style={{
                              textDecoration: "line-through",
                              color: "#999",
                              marginRight: "0.5rem",
                            }}
                          >
                            {normalTotalWithCargo.toFixed(2)} ₺
                          </span>
                          <span
                            style={{ color: "#040404", fontSize: "1.8rem" }}
                          >
                            {finalTotal.toFixed(2)} ₺
                          </span>
                        </>
                      ) : (
                        `${normalTotalWithCargo.toFixed(2)} ₺`
                      )}
                    </span>
                  </div>
                  <p className="tf-cart-tax">
                    {t("taxAndShippingNote1")} <Link href="/shipping-delivery">
                      {t("taxAndShippingNote2")}</Link>{" "}
                    {t("taxAndShippingNote3")}
                  </p>
                  <div className="cart-checkbox">
                    <input
                      type="checkbox"
                      className="tf-check"
                      id="check-agree"
                    />
                    <label htmlFor="check-agree" className="fw-4">
                      <Link href="/terms">{t("agreeTerms1")}</Link> {t("agreeTerms2")}
                    </label>
                  </div>
                  <div className="cart-checkout-btn">
                    <Link
                      href="/checkout"
                      className="tf-btn w-100 btn-fill animate-hover-btn radius-3 justify-content-center"
                    >
                      <span>{t("proceedToCheckout")}</span>
                    </Link>
                  </div>
                  <div className="tf-page-cart_imgtrust">
                    <p className="text-center fw-6">{t("securePayment")}</p>
                    <div className="cart-list-social">
                      <div className="payment-item">
                        <svg
                          viewBox="0 0 38 24"
                          xmlns="http://www.w3.org/2000/svg"
                          role="img"
                          width="38"
                          height="24"
                          aria-labelledby="pi-visa"
                        >
                          <title id="pi-visa">Visa</title>
                          <path
                            opacity=".07"
                            d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z"
                          ></path>
                          <path
                            fill="#fff"
                            d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32"
                          ></path>
                          <path
                            d="M28.3 10.1H28c-.4 1-.7 1.5-1 3h1.9c-.3-1.5-.3-2.2-.6-3zm2.9 5.9h-1.7c-.1 0-.1 0-.2-.1l-.2-.9-.1-.2h-2.4c-.1 0-.2 0-.2.2l-.3.9c0 .1-.1.1-.1.1h-2.1l.2-.5L27 8.7c0-.5.3-.7.8-.7h1.5c.1 0 .2 0 .2.2l1.4 6.5c.1.4.2.7.2 1.1.1.1.1.1.1.2zm-13.4-.3l.4-1.8c.1 0 .2.1.2.1.7.3 1.4.5 2.1.4.2 0 .5-.1.7-.2.5-.2.5-.7.1-1.1-.2-.2-.5-.3-.8-.5-.4-.2-.8-.4-1.1-.7-1.2-1-.8-2.4-.1-3.1.6-.4.9-.8 1.7-.8 1.2 0 2.5 0 3.1.2h.1c-.1.6-.2 1.1-.4 1.7-.5-.2-1-.4-1.5-.4-.3 0-.6 0-.9.1-.2 0-.3.1-.4.2-.2.2-.2.5 0 .7l.5.4c.4.2.8.4 1.1.6.5.3 1 .8 1.1 1.4.2.9-.1 1.7-.9 2.3-.5.4-.7.6-1.4.6-1.4 0-2.5.1-3.4-.2-.1.2-.1.2-.2.1zm-3.5.3c.1-.7.1-.7.2-1 .5-2.2 1-4.5 1.4-6.7.1-.2.1-.3.3-.3H18c-.2 1.2-.4 2.1-.7 3.2-.3 1.5-.6 3-1 4.5 0 .2-.1.2-.3.2M5 8.2c0-.1.2-.2.3-.2h3.4c.5 0 .9.3 1 .8l.9 4.4c0 .1 0 .1.1.2 0-.1.1-.1.1-.1l2.1-5.1c-.1-.1 0-.2.1-.2h2.1c0 .1 0 .1-.1.2l-3.1 7.3c-.1.2-.1.3-.2.4-.1.1-.3 0-.5 0H9.7c-.1 0-.2 0-.2-.2L7.9 9.5c-.2-.2-.5-.5-.9-.6-.6-.3-1.7-.5-1.9-.5L5 8.2z"
                            fill="#142688"
                          ></path>
                        </svg>
                      </div>
                      <div className="payment-item">
                        <svg
                          viewBox="0 0 38 24"
                          xmlns="http://www.w3.org/2000/svg"
                          width="38"
                          height="24"
                          role="img"
                          aria-labelledby="pi-paypal"
                        >
                          <title id="pi-paypal">PayPal</title>
                          <path
                            opacity=".07"
                            d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z"
                          ></path>
                          <path
                            fill="#fff"
                            d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32"
                          ></path>
                          <path
                            fill="#003087"
                            d="M23.9 8.3c.2-1 0-1.7-.6-2.3-.6-.7-1.7-1-3.1-1h-4.1c-.3 0-.5.2-.6.5L14 15.6c0 .2.1.4.3.4H17l.4-3.4 1.8-2.2 4.7-2.1z"
                          ></path>
                          <path
                            fill="#3086C8"
                            d="M23.9 8.3l-.2.2c-.5 2.8-2.2 3.8-4.6 3.8H18c-.3 0-.5.2-.6.5l-.6 3.9-.2 1c0 .2.1.4.3.4H19c.3 0 .5-.2.5-.4v-.1l.4-2.4v-.1c0-.2.3-.4.5-.4h.3c2.1 0 3.7-.8 4.1-3.2.2-1 .1-1.8-.4-2.4-.1-.5-.3-.7-.5-.8z"
                          ></path>
                          <path
                            fill="#012169"
                            d="M23.3 8.1c-.1-.1-.2-.1-.3-.1-.1 0-.2 0-.3-.1-.3-.1-.7-.1-1.1-.1h-3c-.1 0-.2 0-.2.1-.2.1-.3.2-.3.4l-.7 4.4v.1c0-.3.3-.5.6-.5h1.3c2.5 0 4.1-1 4.6-3.8v-.2c-.1-.1-.3-.2-.5-.2h-.1z"
                          ></path>
                        </svg>
                      </div>
                      <div className="payment-item">
                        <svg
                          viewBox="0 0 38 24"
                          xmlns="http://www.w3.org/2000/svg"
                          role="img"
                          width="38"
                          height="24"
                          aria-labelledby="pi-master"
                        >
                          <title id="pi-master">Mastercard</title>
                          <path
                            opacity=".07"
                            d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z"
                          ></path>
                          <path
                            fill="#fff"
                            d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32"
                          ></path>
                          <circle fill="#EB001B" cx="15" cy="12" r="7"></circle>
                          <circle fill="#F79E1B" cx="23" cy="12" r="7"></circle>
                          <path
                            fill="#FF5F00"
                            d="M22 12c0-2.4-1.2-4.5-3-5.7-1.8 1.3-3 3.4-3 5.7s1.2 4.5 3 5.7c1.8-1.2 3-3.3 3-5.7z"
                          ></path>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* page-cart */}

      {/* Bundle Products Slider */}
      {cartProducts && cartProducts.length > 0 && bundleDiscounts && (
        <div className="bundle-products-section mt-5">
          <BundleSlider
            cartProducts={cartProducts}
            bundleDiscounts={bundleDiscounts}
          />
        </div>
      )}
    </main>
  );
}

export default ShoppingCartPage;
