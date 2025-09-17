import PageLoadingAnimation from "@/components/shared/PageLoadingAnimation";
import GeneralModal from "@/components/shared/GeneralModal";
import { useCart } from "@/hooks/context/useCart";
import { useGetDiscountList } from "@/hooks/services/discounts/useGetDiscountList";
import { useGetCouponDiscount } from "@/hooks/services/discounts/useGetCouponDiscount";
import { DiscountType } from "@/constants/enums/DiscountType";
import BundleProducts from "@/components/product/BundleProducts";
import BundleSlider from "@/components/product/BundleSlider";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-hot-toast";

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
    minimumCargoAmount,
    giftWrapPrice,
    totalPrice,
    totalProductPhaseDiscountedPrice,
    isGiftWrap,
    giftWrapMessage,
    updateGiftWrap,
    applyCoupon,
    removeCoupon,
    appliedCoupon,
    cartDiscount,
  } = useCart();
  const { t } = useLanguage();

  // Tüm indirim tiplerini getir
  const { discounts: bundleDiscounts } = useGetDiscountList({
    discountType: DiscountType.Bundle,
    isActive: true,
    pageSize: 50,
  });
  const { discounts: productDiscounts } = useGetDiscountList({
    discountType: DiscountType.Product,
    isActive: true,
    pageSize: 50,
  });
  const { discounts: subCatDiscounts } = useGetDiscountList({
    discountType: DiscountType.SubCategory,
    isActive: true,
    pageSize: 50,
  });
  const { discounts: weekdayDiscounts } = useGetDiscountList({
    discountType: DiscountType.WeekdayDiscount,
    isActive: true,
    pageSize: 50,
  });
  const { discounts: specialDayDiscounts } = useGetDiscountList({
    discountType: DiscountType.SpecialDayDiscount,
    isActive: true,
    pageSize: 50,
  });
  const { discounts: birthdayDiscounts } = useGetDiscountList({
    discountType: DiscountType.BirthdayDiscount,
    isActive: true,
    pageSize: 50,
  });
  const { discounts: timeOfDayDiscounts } = useGetDiscountList({
    discountType: DiscountType.TimeOfDayDiscount,
    isActive: true,
    pageSize: 50,
  });
  const { discounts: shippingDiscounts } = useGetDiscountList({
    discountType: DiscountType.ShippingDiscount,
    isActive: true,
    pageSize: 50,
  });
  const { discounts: couponDiscounts } = useGetDiscountList({
    discountType: DiscountType.Coupon,
    isActive: true,
    pageSize: 50,
  });
  const { discounts: buyXPayYDiscounts } = useGetDiscountList({
    discountType: DiscountType.BuyXPayY,
    isActive: true,
    pageSize: 50,
  });
  const { discounts: giftProductDiscounts } = useGetDiscountList({
    discountType: DiscountType.GiftProductDiscount,
    isActive: true,
    pageSize: 50,
  });

  // Kupon sistemi için state'ler ve hook'lar
  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");
  const { getCouponDiscount, isPending: isCouponLoading } =
    useGetCouponDiscount();

  // Hediye paketi mesajı için state
  const [giftWrapModalMessage, setGiftWrapModalMessage] = useState("");

  // Clean up modal backdrops on component unmount
  useEffect(() => {
    return () => {
      // Clean up any remaining modal backdrops when component unmounts
      $(".modal-backdrop").remove();
      $("body").removeClass("modal-open").css("padding-right", "");
    };
  }, []);

  // Helper function to clean up modal backdrop
  const cleanupModalBackdrop = () => {
    setTimeout(() => {
      $(".modal-backdrop").remove();
      $("body").removeClass("modal-open").css("padding-right", "");
    }, 200);
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1 || quantity > 10) return;
    updateQuantity(productId, quantity);
  };

  // Kupon uygulama fonksiyonu
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      return;
    }

    const backendSubtotal = totalPrice - (cargoDiscountedPrice || cargoPrice);

    await getCouponDiscount(
      couponCode,
      async (data) => {
        // Minimum sepet tutarını kontrol et
        const minimumCartAmount = data.minimumCartAmount || 0;
        if (backendSubtotal < minimumCartAmount) {
          setCouponError(
            `Bu kupon için minimum sepet tutarı ${minimumCartAmount}₺ olmalıdır. Mevcut sepet tutarınız: ${backendSubtotal.toFixed(
              2
            )}₺`
          );
          return;
        }

        // Cart context'ine kupon verilerini uygula (bu cart API'sini yenileyecek)
        await applyCoupon(couponCode, data);
        setCouponCode(""); // Başarılı uygulamadan sonra input'u temizle
        setCouponError(""); // Hata mesajını temizle
      },
      (error) => {
        setCouponError("Geçersiz kupon kodu!");
      }
    );
  };

  // Kupon indirimi hesaplama
  let couponDiscountAmount = 0;
  if (
    appliedCoupon &&
    (appliedCoupon.isActive || appliedCoupon.data?.isActive)
  ) {
    const couponData = appliedCoupon.data || appliedCoupon;
    const minimumCartAmount = couponData.minimumCartAmount || 0;
    const backendSubtotal = totalPrice - (cargoDiscountedPrice || cargoPrice);

    if (backendSubtotal >= minimumCartAmount) {
      if (couponData.discountValueType === 1) {
        couponDiscountAmount = couponData.discountValue;
      } else if (couponData.discountValueType === 0) {
        couponDiscountAmount =
          (backendSubtotal * couponData.discountValue) / 100;
      }

      if (
        couponData.maximumDiscountAmount &&
        couponDiscountAmount > couponData.maximumDiscountAmount
      ) {
        couponDiscountAmount = couponData.maximumDiscountAmount;
      }

      if (couponDiscountAmount > backendSubtotal) {
        couponDiscountAmount = backendSubtotal;
      }
    }
  }

  if (initialLoading) {
    return <PageLoadingAnimation />;
  }

  const EmptyCart = () => (
    <div>
      {/* page-title */}
      <div className="tf-page-title">
        <div className="container-full">
          <div className="heading text-center">
            {t("shoppingCart.pageTitle")}
          </div>
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
          <p className="mb-4">S{t("shoppingCart.emptyCartMessage")}</p>
          <Link href="/" className="btn btn-dark">
            <span>{t("shoppingCart.startShoppingButton")}</span>
            <i className="icon-long-arrow-right ml-2"></i>
          </Link>
        </div>
      </div>
    </div>
  );

  if (!cartProducts || cartProducts.length === 0) return <EmptyCart />;

  const frontendSubtotal = cartProducts.reduce(
    (total, item) => total + Number(item.price || 0) * Number(item.quantity),
    0
  );

  const frontendDiscountedSubtotal = cartProducts.reduce((total, item) => {
    const priceToUse = item.discountedPrice || item.price || 0;
    return total + Number(priceToUse) * Number(item.quantity);
  }, 0);

  const frontendDiscountAmount = frontendSubtotal - frontendDiscountedSubtotal;

  // Sepetteki ürünlerin ilk aktif indirim kaynağını bul
  const getDiscountSourceName = (item: any) => {
    const discount = item.discountResponse;
    if (!discount) return "";

    if (discount.subCategoryDiscount) {
      return (
        subCatDiscounts.find((d) => d.id === discount.id)?.name ||
        "Alt Kategori İndirimi"
      );
    }
    if (discount.specialDayDiscount) {
      return (
        specialDayDiscounts.find((d) => d.id === discount.id)?.name ||
        "Özel Gün İndirimi"
      );
    }
    if (discount.birthdayDiscount) {
      return (
        birthdayDiscounts.find((d) => d.id === discount.id)?.name ||
        "Doğum Günü İndirimi"
      );
    }
    if (discount.weekdayDiscount) {
      return (
        weekdayDiscounts.find((d) => d.id === discount.id)?.name ||
        "Haftanın Günü İndirimi"
      );
    }
    if (discount.timeOfDayDiscount) {
      return (
        timeOfDayDiscounts.find((d) => d.id === discount.id)?.name ||
        "Günün Saati İndirimi"
      );
    }

    // Eğer hiçbir tip eşleşmezse discount'un adını döndür
    return discount.name || "Ürün İndirimleri";
  };

  return (
    <main className="main" style={{ backgroundColor: "#fff" }}>
      {/* page-title */}
      <div className="tf-page-title">
        <div className="container-full">
          <div className="heading text-center">
            {t("shoppingCart.pageTitle")}
          </div>
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
                    {(() => {
                      const freeDiscountGroups = new Map<string, any[]>();
                      const normalProducts: any[] = [];
                      const freeProducts: any[] = [];

                      cartProducts.forEach((item) => {
                        if (item.isFreeProduct) {
                          freeProducts.push(item);
                        } else if ((item as any).freeQuantity > 0) {
                          const groupKey =
                            (item as any).freeGroupKey || "default";
                          if (!freeDiscountGroups.has(groupKey)) {
                            freeDiscountGroups.set(groupKey, []);
                          }
                          freeDiscountGroups.get(groupKey)!.push(item);
                        } else {
                          const isPartOfFreeDiscount = cartProducts.some(
                            (otherItem) => {
                              return (
                                (otherItem as any).freeQuantity > 0 &&
                                (otherItem as any).freeGroupKey ===
                                  (item as any).freeGroupKey &&
                                otherItem.id !== item.id
                              );
                            }
                          );

                          if (isPartOfFreeDiscount) {
                            const groupKey =
                              (item as any).freeGroupKey || "default";
                            if (!freeDiscountGroups.has(groupKey)) {
                              freeDiscountGroups.set(groupKey, []);
                            }
                            freeDiscountGroups.get(groupKey)!.push(item);
                          } else {
                            normalProducts.push(item);
                          }
                        }
                      });
                      const sortedProducts: any[] = [];

                      freeDiscountGroups.forEach((group) => {
                        sortedProducts.push(...group);
                      });

                      sortedProducts.push(...normalProducts);
                      sortedProducts.push(...freeProducts);

                      return sortedProducts.map((item): React.ReactElement => {
                        // API response'u data property'si içinde geliyor, onu çıkar
                        const productData = item.data || item;

                        const freeQty = Number(
                          (productData as any).freeQuantity || 0
                        );
                        const paidQty = Math.max(
                          0,
                          Number(productData.quantity) - freeQty
                        );

                        const buyXCount = Number((item as any).buyXCount || 0);
                        const payYCount = Number((item as any).payYCount || 0);
                        const isBuyXPayY = Boolean((item as any).isBuyXPayY);
                        const isrepeatable = Boolean(
                          (item as any).isrepeatable
                        );
                        const hasExplicitDiscount =
                          (item.price || 0) !== (item.discountedPrice || 0);

                        const unitPrice = Number(item.price || 0);
                        const unitDiscounted = Number(
                          item.discountedPrice || 0
                        );

                        let discountedTotal;
                        if (isBuyXPayY && buyXCount > 0 && payYCount > 0) {
                          const totalQuantity = Number(item.quantity);
                          if (isrepeatable === false) {
                            if (totalQuantity >= buyXCount) {
                              const discountedPart = payYCount * unitPrice;
                              const remainingPart =
                                (totalQuantity - buyXCount) * unitPrice;
                              discountedTotal = discountedPart + remainingPart;
                            } else {
                              discountedTotal = totalQuantity * unitPrice;
                            }
                          } else {
                            const fullSets = Math.floor(
                              totalQuantity / buyXCount
                            );
                            const remainingItems = totalQuantity % buyXCount;
                            const paidInSets = fullSets * payYCount;
                            const totalPaidItems =
                              paidInSets + Math.min(remainingItems, payYCount);
                            discountedTotal = totalPaidItems * unitPrice;
                          }
                        } else if (hasExplicitDiscount) {
                          discountedTotal =
                            unitDiscounted * Number(item.quantity);
                        } else {
                          discountedTotal = unitPrice * paidQty;
                        }

                        const getRowStyle = () => {
                          const hasGiftAmount =
                            (item as any).giftAmount !== undefined;

                          if (item.isFreeProduct) {
                            return {
                              borderLeft: "6px solid #28a745",
                              position: "relative" as const,
                            };
                          } else if (
                            isBuyXPayY &&
                            buyXCount > 0 &&
                            payYCount > 0
                          ) {
                            return {
                              borderLeft: "6px solid #17a2b8",
                              position: "relative" as const,
                            };
                          } else if (hasGiftAmount && !item.isFreeProduct) {
                            return {
                              borderLeft: "6px solid #28a745",
                              position: "relative" as const,
                            };
                          }
                          return {};
                        };

                        const getIconStyle = () => {
                          const hasGiftAmount =
                            (item as any).giftAmount !== undefined;
                          const hasFreeQuantity =
                            Number((item as any).freeQuantity || 0) > 0;

                          if (item.isFreeProduct) {
                            return {
                              position: "absolute" as const,
                              left: "-12px",
                              top: "50%",
                              transform: "translateY(-50%)",
                              background: "#28a745",
                              color: "white",
                              borderRadius: "50%",
                              width: "24px",
                              height: "24px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "12px",
                              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                              zIndex: 1,
                            };
                          } else if (
                            isBuyXPayY &&
                            buyXCount > 0 &&
                            payYCount > 0
                          ) {
                            return {
                              position: "absolute" as const,
                              left: "-12px",
                              top: "50%",
                              transform: "translateY(-50%)",
                              background: "#17a2b8",
                              color: "white",
                              borderRadius: "50%",
                              width: "24px",
                              height: "24px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "10px",
                              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                              zIndex: 1,
                            };
                          } else if (
                            hasGiftAmount &&
                            !item.isFreeProduct &&
                            hasFreeQuantity
                          ) {
                            return {
                              position: "absolute" as const,
                              left: "-10px",
                              top: "50%",
                              transform: "translateY(-50%)",
                              background: "#ffc107",
                              color: "white",
                              borderRadius: "50%",
                              width: "20px",
                              height: "20px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "10px",
                              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                              zIndex: 1,
                            };
                          }
                          return {};
                        };

                        return (
                          <tr
                            key={item.id}
                            className="tf-cart-item file-delete"
                            style={getRowStyle()}
                          >
                            <td className="tf-cart-item_product">
                              {getIconStyle() &&
                                Object.keys(getIconStyle()).length > 0 && (
                                  <div style={getIconStyle()}>
                                    {item.isFreeProduct
                                      ? "🎁"
                                      : isBuyXPayY &&
                                        buyXCount > 0 &&
                                        payYCount > 0
                                      ? "💎"
                                      : "💰"}
                                  </div>
                                )}
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
                                  if (
                                    isBuyXPayY &&
                                    buyXCount > 0 &&
                                    payYCount > 0
                                  ) {
                                    const savings = buyXCount - payYCount;
                                    const savingsPercent = Math.round(
                                      (savings / buyXCount) * 100
                                    );

                                    return (
                                      <div className="position-relative">
                                        <div className="d-flex flex-column">
                                          <span className="fs-4 fw-medium">
                                            {(item.price || 0).toFixed(2)} ₺
                                          </span>
                                          <div>
                                            <span className="badge bg-success text-white fs-6">
                                              {buyXCount} Al {payYCount} Öde
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  }

                                  if (item.isFreeProduct) {
                                    return (
                                      <div style={{ position: "relative" }}>
                                        <span>
                                          {(item.price || 0).toFixed(2)} ₺
                                        </span>
                                      </div>
                                    );
                                  }

                                  // Check if there's an active discount and prices are different
                                  const hasDiscount =
                                    (item as any).discountDTO !== null;
                                  const pricesAreDifferent =
                                    (item.price || 0) !==
                                    (item.discountedPrice || 0);

                                  // Sadece gerçekten indirimli olan ürünlerde üstü çizili fiyat göster
                                  if (
                                    hasDiscount &&
                                    pricesAreDifferent &&
                                    (item.price || 0) >
                                      (item.discountedPrice || 0)
                                  ) {
                                    return (
                                      <div className="position-relative">
                                        <span
                                          className="text-decoration-line-through position-absolute text-muted fs-6"
                                          style={{ top: "-20px" }}
                                        >
                                          {(item.price || 0).toFixed(2)} ₺
                                        </span>
                                        <span className="fs-4 text-success fw-medium d-block">
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
                                          fontWeight: 500,
                                          lineHeight: "1.2",
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
                                  if (
                                    isBuyXPayY &&
                                    buyXCount > 0 &&
                                    payYCount > 0
                                  ) {
                                    const originalTotal =
                                      (item.price || 0) * item.quantity;
                                    const savings =
                                      originalTotal - discountedTotal;

                                    return (
                                      <div className="position-relative">
                                        <div className="d-flex flex-column">
                                          <span
                                            className="  text-muted small"
                                            style={{
                                              textDecoration: "line-through",
                                            }}
                                          >
                                            {originalTotal.toFixed(2)} ₺
                                          </span>
                                          <span className="fs-4 fw-bold text-success">
                                            {discountedTotal.toFixed(2)} ₺
                                          </span>
                                        </div>
                                      </div>
                                    );
                                  }

                                  if (item.isFreeProduct) {
                                    const paidQuantity = Math.max(
                                      0,
                                      item.quantity - freeQty
                                    );
                                    const unitPrice = item.price || 0;

                                    // Ücretsiz kampanya kapsamındaki miktar için ödenecek fiyat
                                    const discountedPrice =
                                      paidQuantity * unitPrice;

                                    return (
                                      <div className="position-relative">
                                        <span
                                          className="position-absolute  text-muted"
                                          style={{
                                            fontSize: "1.4rem",
                                            top: "-20px",
                                            textDecoration: "line-through",
                                          }}
                                        >
                                          {(
                                            (item.price || 0) * item.quantity
                                          ).toFixed(2)}{" "}
                                          ₺
                                        </span>
                                        <span className="text-success fw-bold fs-4">
                                          {discountedPrice.toFixed(2)} ₺
                                        </span>
                                      </div>
                                    );
                                  }

                                  // Check if there's an active discount and prices are different
                                  const hasDiscount =
                                    (item as any).discountDTO !== null;
                                  const pricesAreDifferent =
                                    (item.price || 0) !==
                                    (item.discountedPrice || 0);

                                  // Sadece gerçekten indirimli olan ürünlerde üstü çizili fiyat göster
                                  if (
                                    hasDiscount &&
                                    pricesAreDifferent &&
                                    (item.price || 0) >
                                      (item.discountedPrice || 0)
                                  ) {
                                    return (
                                      <div className="position-relative">
                                        <span
                                          className="  position-absolute fs-6 text-muted"
                                          style={{
                                            top: "-20px",
                                            textDecoration: "line-through",
                                          }}
                                        >
                                          {(
                                            (item.price || 0) * item.quantity
                                          ).toFixed(2)}{" "}
                                          ₺
                                        </span>
                                        <span className="fs-4 text-success fw-medium d-block">
                                          {discountedTotal.toFixed(2)} ₺
                                        </span>
                                      </div>
                                    );
                                  } else {
                                    return (
                                      <span style={{ fontSize: "1.5rem" }}>
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
                      });
                    })()}
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
                    {t("shoppingCart.freeShippingMessage1")}
                    <span className="fw-6">
                      {t("shoppingCart.freeShippingMessage2")}
                    </span>
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
                  {/* Kupon Kodu Uygulama */}
                  <div className="mb-4">
                    {appliedCoupon ? (
                      <div
                        className="checkout-coupon-success "
                        style={{
                          background: "#d6f5df",
                          borderRadius: "12px",
                          padding: "18px 20px 14px 20px",
                          minHeight: "90px",
                          position: "relative",
                          width: "100%",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          boxSizing: "border-box",
                        }}
                      >
                        <button
                          className="coupon-close-btn"
                          onClick={async () => {
                            await removeCoupon();
                            setCouponCode("");
                          }}
                          title="Kuponu Kaldır"
                          style={{
                            position: "absolute",
                            top: "8px",
                            right: "8px",
                            background: "none",
                            border: "none",
                            color: "#249c5a",
                            fontSize: "14px",
                            cursor: "pointer",
                            padding: "4px",
                            lineHeight: 1,
                            width: "24px",
                            height: "24px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: "50%",
                            transition: "background-color 0.2s",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor =
                              "rgba(36, 156, 90, 0.1)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor =
                              "transparent";
                          }}
                        >
                          <i className="bx bx-x"></i>
                        </button>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            width: "100%",
                          }}
                        >
                          <i
                            className="bx bxs-check-circle"
                            style={{
                              color: "#249c5a",
                              fontSize: 22,
                              marginRight: 10,
                              marginTop: 2,
                              flexShrink: 0,
                            }}
                          ></i>
                          <div style={{ width: "100%" }}>
                            <div
                              style={{
                                fontWeight: 700,
                                color: "#249c5a",
                                fontSize: 15,
                                marginBottom: 2,
                                lineHeight: 1.3,
                              }}
                            >
                              {appliedCoupon?.data?.name ||
                                appliedCoupon?.name ||
                                "Kupon"}{" "}
                              kuponu uygulandı!
                            </div>
                            <div
                              style={{
                                color: "#249c5a",
                                fontSize: 14,
                                fontWeight: 500,
                                marginBottom: 0,
                                lineHeight: 1.5,
                              }}
                            >
                              {(appliedCoupon?.data?.discountValueType ||
                                appliedCoupon?.discountValueType) === 1
                                ? `%${
                                    appliedCoupon?.data?.discountValue ||
                                    appliedCoupon?.discountValue
                                  } indirim`
                                : `${
                                    appliedCoupon?.data?.discountValue ||
                                    appliedCoupon?.discountValue
                                  }₺ indirim`}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="input-group" style={{ height: "48px" }}>
                          <input
                            type="text"
                            className={`form-control ${
                              couponError ? "is-invalid" : ""
                            }`}
                            placeholder="Kupon kodu giriniz"
                            value={couponCode}
                            onChange={(e) => {
                              setCouponCode(e.target.value);
                              if (couponError) setCouponError(""); // Kullanıcı yazmaya başladığında hatayı temizle
                            }}
                            disabled={isCouponLoading}
                            onKeyPress={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                handleApplyCoupon();
                              }
                            }}
                            style={{
                              height: "48px",
                              fontSize: "16px",
                              padding: "12px 16px",
                              borderTopRightRadius: "0",
                              borderBottomRightRadius: "0",
                            }}
                          />
                          <div className="input-group-append">
                            <button
                              className="btn btn-outline-primary-2"
                              type="button"
                              disabled={isCouponLoading || !couponCode.trim()}
                              onClick={handleApplyCoupon}
                              style={{
                                height: "48px",
                                width: "40px",
                                minWidth: "40px",
                                borderTopLeftRadius: "0",
                                borderBottomLeftRadius: "0",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "16px",
                                padding: "0",
                              }}
                            >
                              {isCouponLoading ? (
                                <i className="icon-spinner icon-spin"></i>
                              ) : (
                                <i className="icon-long-arrow-right"></i>
                              )}
                            </button>
                          </div>
                        </div>
                        {couponError && (
                          <div className="mt-2">
                            <small className="text-danger d-flex align-items-center">
                              <i className="bx bx-error-circle me-1"></i>
                              {couponError}
                            </small>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {cartProducts.some((item) => item.isFreeProduct) && (
                    <div className="free-product-notification mb-1">
                      <div
                        className="d-flex align-items-center justify-content-between"
                        style={{
                          backgroundColor: "#f8f9fa",
                          padding: "8px 12px",
                          borderRadius: "4px",
                          border: "1px solid #e9ecef",
                        }}
                      >
                        <div className="d-flex align-items-center">
                          <i
                            className="bx bx-gift"
                            style={{
                              fontSize: "1.5rem",
                              marginRight: "6px",
                              color: "#28a745",
                            }}
                          ></i>
                          <span
                            style={{ fontSize: "1.5rem", color: "#495057" }}
                          >
                            Ücretsiz Ürün Kampanyası
                          </span>
                        </div>
                        <span
                          style={{
                            fontSize: "1.5rem",
                            color: "#28a745",
                            fontWeight: "500",
                          }}
                        >
                          Aktif
                        </span>
                      </div>
                    </div>
                  )}

                  {(() => {
                    const buyXPayYProduct = cartProducts.find(
                      (item) => (item as any).isBuyXPayY
                    );
                    if (buyXPayYProduct) {
                      const buyXCount = Number(
                        (buyXPayYProduct as any).buyXCount || 0
                      );
                      const payYCount = Number(
                        (buyXPayYProduct as any).payYCount || 0
                      );

                      return (
                        <div className="buyxpayy-notification mb-1">
                          <div
                            className="d-flex align-items-center justify-content-between"
                            style={{
                              backgroundColor: "#e3f2fd",
                              padding: "8px 12px",
                              borderRadius: "4px",
                              border: "1px solid #17a2b8",
                            }}
                          >
                            <div className="d-flex align-items-center">
                              <i
                                className="bx bx-package"
                                style={{
                                  fontSize: "1.5rem",
                                  marginRight: "6px",
                                  color: "#17a2b8",
                                }}
                              ></i>
                              <span
                                style={{ fontSize: "1.5rem", color: "#495057" }}
                              >
                                {buyXCount} Al {payYCount} Öde Kampanyası
                              </span>
                            </div>
                            <span
                              style={{
                                fontSize: "1.5rem",
                                color: "#17a2b8",
                                fontWeight: "500",
                              }}
                            >
                              Aktif
                            </span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })()}

                  <div className="cart-checkbox">
                    <input
                      type="checkbox"
                      className="tf-check"
                      id="cart-gift-checkbox"
                      checked={isGiftWrap}
                      onChange={(e) => {
                        if (e.target.checked) {
                          // Hediye paketi seçildiğinde modal aç
                          $("#giftWrapModal").modal("show");
                        } else {
                          // Hediye paketi kaldırıldığında direkt güncelle
                          updateGiftWrap(false);
                        }
                      }}
                    />
                    <label htmlFor="cart-gift-checkbox" className="fw-4">
                      <span>{t("giftWrap")}</span> {t("giftWrapPrice")}
                      <span className="fw-5">{giftWrapPrice.toFixed(2)} ₺</span>
                    </label>
                  </div>
                  <table className="table table-summary">
                    <tbody>
                      <tr className="summary-original-total text-dark">
                        <td style={{ fontSize: "1.7rem" }}>Sepet Tutarı:</td>
                        <td>
                          <span className="text-decoration-line-through text-dark">
                            {frontendSubtotal.toFixed(2)} ₺
                          </span>
                        </td>
                      </tr>
                      {frontendDiscountAmount > 0 && (
                        <tr className="summary-discount">
                          <td>
                            {(() => {
                              // Sepetteki ilk indirimli ürünü bul
                              const discountedProduct = cartProducts.find(
                                (item) => item.discountResponse
                              );
                              return discountedProduct
                                ? getDiscountSourceName(discountedProduct)
                                : "Ürün İndirimleri";
                            })()}
                            :
                          </td>
                          <td>
                            <small
                              style={{ color: "green", fontSize: "1.4rem" }}
                            >
                              -{frontendDiscountAmount.toFixed(2)} ₺
                            </small>
                          </td>
                        </tr>
                      )}
                      {cartDiscount && (
                        <tr className="summary-discount">
                          <td>Sepet İndirimi:</td>
                          <td>
                            <small
                              style={{ color: "green", fontSize: "1.4rem" }}
                            >
                              {cartDiscount?.discountValueType === 1
                                ? `-%${cartDiscount?.discountValue} indirim`
                                : cartDiscount?.discountValueType === 2
                                ? `-${cartDiscount?.discountValue.toFixed(2)}₺`
                                : ""}
                            </small>
                          </td>
                        </tr>
                      )}

                      {couponDiscountAmount > 0 && (
                        <tr className="summary-discount">
                          <td>
                            <strong>
                              {appliedCoupon?.data?.name || appliedCoupon?.name}
                            </strong>{" "}
                            Kuponu İndirimi:
                            <div
                              style={{
                                fontSize: "1.3rem",
                                color: "#666",
                                marginTop: "4px",
                              }}
                            >
                              (
                              {appliedCoupon?.data?.discountValueType === 1 ||
                              appliedCoupon?.discountValueType === 1
                                ? `%${
                                    appliedCoupon?.data?.discountValue ||
                                    appliedCoupon?.discountValue
                                  } indirim`
                                : `${
                                    appliedCoupon?.data?.discountValue ||
                                    appliedCoupon?.discountValue
                                  }₺ indirim`}
                              )
                              {(appliedCoupon?.data?.minimumCartAmount ||
                                appliedCoupon?.minimumCartAmount) > 0 && (
                                <div
                                  style={{
                                    fontSize: "0.7rem",
                                    color: "#999",
                                    marginTop: "2px",
                                  }}
                                >
                                  Min. sepet:{" "}
                                  {appliedCoupon?.data?.minimumCartAmount ||
                                    appliedCoupon?.minimumCartAmount}
                                  ₺
                                </div>
                              )}
                              {(appliedCoupon?.data?.maximumDiscountAmount ||
                                appliedCoupon?.maximumDiscountAmount) && (
                                <div
                                  style={{
                                    fontSize: "0.7rem",
                                    color: "#999",
                                    marginTop: "2px",
                                  }}
                                >
                                  Max. indirim:{" "}
                                  {appliedCoupon?.data?.maximumDiscountAmount ||
                                    appliedCoupon?.maximumDiscountAmount}
                                  ₺
                                </div>
                              )}
                            </div>
                          </td>
                          <td>
                            <small
                              style={{
                                color: "green",
                                fontSize: "1.4rem",
                                fontWeight: "600",
                              }}
                            >
                              {appliedCoupon?.data?.discountValueType === 1 ||
                              appliedCoupon?.discountValueType === 1
                                ? `-%${
                                    appliedCoupon?.data?.discountValue ||
                                    appliedCoupon?.discountValue
                                  }`
                                : `-${couponDiscountAmount.toFixed(2)} ₺`}
                            </small>
                          </td>
                        </tr>
                      )}
                      <tr className="summary-subtotal">
                        <td>Ara Toplam:</td>
                        <td>{totalProductPhaseDiscountedPrice.toFixed(2)} ₺</td>
                      </tr>

                      <tr className="summary-shipping">
                        <td>Kargo:</td>
                        <td>
                          {cargoDiscountedPrice !== null &&
                          cargoDiscountedPrice !== undefined &&
                          cargoPrice !== cargoDiscountedPrice ? (
                            <div>
                              <del
                                style={{
                                  color: "#999",
                                  fontSize: "1.3rem",
                                  display: "block",
                                  lineHeight: "1",
                                }}
                              >
                                {cargoPrice.toFixed(2)} ₺
                              </del>
                              <span
                                style={{
                                  fontSize: "1.5rem",
                                  display: "block",
                                  lineHeight: "1.2",
                                }}
                              >
                                {cargoDiscountedPrice.toFixed(2)} ₺
                              </span>
                            </div>
                          ) : (
                            <span style={{ fontSize: "1.5rem" }}>
                              {cargoPrice.toFixed(2)} ₺
                            </span>
                          )}
                          {(() => {
                            const shippingDiscount =
                              shippingDiscounts?.[0] as any;
                            return (
                              shippingDiscount?.cargoDiscount
                                ?.minimumCargoAmount && (
                                <div
                                  style={{
                                    fontSize: "1.05rem",
                                    color: "gray",
                                    fontWeight: "500",
                                    marginTop: "4px",
                                  }}
                                >
                                  {shippingDiscount.cargoDiscount.minimumCargoAmount.toFixed(
                                    2
                                  )}{" "}
                                  ₺ üzerine{" "}
                                  <strong
                                    style={{
                                      color: "green",
                                      fontSize: "1.15rem",
                                    }}
                                  >
                                    ücretsiz kargo
                                  </strong>
                                </div>
                              )
                            );
                          })()}
                        </td>
                      </tr>

                      {isGiftWrap && (
                        <tr className="summary-gift-wrap">
                          <td>Hediye Paketi:</td>
                          <td>
                            <span style={{ fontSize: "1.5rem" }}>
                              {giftWrapPrice.toFixed(2)} ₺
                            </span>
                          </td>
                        </tr>
                      )}

                      <tr className="summary-total">
                        <td style={{ fontWeight: "bold" }}>Toplam:</td>
                        <td>
                          <span
                            style={{
                              color: "#040404",
                              fontSize: "1.8rem",
                              display: "block",
                              lineHeight: "1.2",
                            }}
                          >
                            {totalPrice.toFixed(2)} ₺
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <p className="tf-cart-tax">
                    {t("taxAndShippingNote1")}{" "}
                    <Link href="/shipping-delivery">
                      {t("taxAndShippingNote2")}
                    </Link>{" "}
                    {t("taxAndShippingNote3")}
                  </p>
                  <div className="cart-checkbox">
                    <input
                      type="checkbox"
                      className="tf-check"
                      id="check-agree"
                    />
                    <label htmlFor="check-agree" className="fw-4">
                      <Link href="/terms">{t("agreeTerms1")}</Link>{" "}
                      {t("agreeTerms2")}
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

      {/* Hediye Paketi Modal */}
      <GeneralModal
        id="giftWrapModal"
        title="Hediye Paketi Mesajı"
        showFooter
        approveButtonText="Ekle"
        formId="giftWrapForm"
        onClose={() => {
          // Clean up modal backdrop and body classes
          cleanupModalBackdrop();
          setGiftWrapModalMessage("");
        }}
      >
        <form
          id="giftWrapForm"
          onSubmit={async (e) => {
            e.preventDefault();
            await updateGiftWrap(true, giftWrapModalMessage);

            // Close modal using jQuery
            $("#giftWrapModal").modal("hide");

            // Clean up modal backdrop
            cleanupModalBackdrop();

            setGiftWrapModalMessage("");
          }}
        >
          <div className="form-group">
            <label htmlFor="giftWrapMessage">
              Hediye Mesajı (İsteğe bağlı)
            </label>
            <textarea
              id="giftWrapMessage"
              className="form-control"
              rows={4}
              placeholder="Hediye paketinize eklenecek mesajı buraya yazabilirsiniz..."
              value={giftWrapModalMessage}
              onChange={(e) => setGiftWrapModalMessage(e.target.value)}
            />
            <small className="form-text text-muted">
              Mesaj yazmadan da hediye paketi ekleyebilirsiniz.
            </small>
          </div>
        </form>
      </GeneralModal>
    </main>
  );
}

export default ShoppingCartPage;
