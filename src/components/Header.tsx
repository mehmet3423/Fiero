import { PathEnums } from "@/constants/enums/PathEnums";
import { UserRole } from "@/constants/enums/UserRole";
import { useSearch } from "@/context/SearchContext";
import { useAuth } from "@/hooks/context/useAuth";
import { useCart } from "@/hooks/context/useCart";
import { useFavorites } from "@/hooks/context/useFavorites";
import { useMainCategoriesLookUp } from "@/hooks/services/categories/useMainCategoriesLookUp";
import { useSubCategoriesLookUp } from "@/hooks/services/categories/useSubCategoriesLookUp";
import { useLogout } from "@/hooks/services/useLogout";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import MobileMenu from "./MobileMenu";

export default function Header() {
  const router = useRouter();
  const {
    userRole,
    userProfile,
    userProfileLoading,
    showEmailConfirmationModal,
  } = useAuth();
  const { totalFavorites } = useFavorites();
  const { cartProducts, totalItems, removeFromCart } = useCart();
  const { searchTerm, setSearchTerm, searchResults } = useSearch();
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const { categories } = useMainCategoriesLookUp();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [hoveredCategoryId, setHoveredCategoryId] = useState<string>("");
  const { categories: subCategories } = useSubCategoriesLookUp(hoveredCategoryId);

  const showCustomerFeatures = userRole === UserRole.CUSTOMER || userRole === null;
  const showSellerFeatures = userRole === UserRole.SELLER;
  const showAdminFeatures = userRole === UserRole.ADMIN;

  if (userProfileLoading) {
    return <></>;
  }

  const cartTotal = cartProducts.reduce(
    (total, item) => total + (item.discountedPrice || item.price) * item.quantity,
    0
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setShowResults(true);
  };

  const { handleLogout } = useLogout();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.length >= 3) {
      router.push(`/products?search=${encodeURIComponent(searchTerm)}`);
      setShowResults(false);
    } else {
      toast.error("En az 3 karakter girmelisiniz");
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (!isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    document.body.style.overflow = "";
  };

  return (
    <>
      {/* Top Bar */}
      <div className="tf-top-bar bg_white line">
        <div className="px_15 lg-px_40">
          <div className="tf-top-bar_wrap grid-3 gap-30 align-items-center">
            <ul className="tf-top-bar_item tf-social-icon d-flex gap-10">
              <li>
                <a href="https://www.facebook.com/desafashion?fref=ts"
                  className="box-icon w_28 round social-facebook bg_line">
                  <i className="icon fs-12 icon-fb"></i>
                </a>
              </li>              
              <li>
                <a href="https://www.instagram.com/desafashion/"
                  className="box-icon w_28 round social-instagram bg_line">
                  <i className="icon fs-12 icon-instagram"></i>
                </a>
              </li>
              <li>
                <a
                  href="https://www.youtube.com/channel/UCgapbfRp7RWO60AREk6OFtg/"
                  className="box-icon w_28 round social-youtube border-line"
                  target="_blank"
                  style={{backgroundColor: '#ebebeb'}}
                >
                  <i
                    className="icon fs-8 icon-play"
                    style={{
                      border: '1px solid #000',
                      padding: '1px 4px',
                      borderRadius: '2px',
                      backgroundColor: '#000',
                      color: '#fff',
                      fontSize: '8px'
                    }}
                  ></i>
                </a>
              </li>
            </ul>
            <div className="text-center overflow-hidden">
              <div className="swiper tf-sw-top_bar" data-preview="1" data-space="0" data-loop="true" data-speed="1000" data-delay="2000">
                <div className="swiper-wrapper">
                  <div className="swiper-slide">
                    <p className="top-bar-text fw-5">
                      Spring Fashion Sale{" "}
                      <Link href="/products" className="tf-btn btn-line">
                        Shop now<i className="icon icon-arrow1-top-left"></i>
                      </Link>
                    </p>
                  </div>
                  <div className="swiper-slide">
                    <p className="top-bar-text fw-5">Summer sale discount off 70%</p>
                  </div>
                  <div className="swiper-slide">
                    <p className="top-bar-text fw-5">Time to refresh your wardrobe.</p>
                  </div>
                </div>
              </div>
            </div>
            {/* <div className="top-bar-language tf-cur justify-content-end">
              <div className="tf-currencies">
                <select className="image-select center style-default type-currencies">
                  <option data-thumbnail="images/country/tr.svg">TRY <span>₺ | Turkey</span></option>
                  <option data-thumbnail="images/country/us.svg">USD <span>$ | United States</span></option>
                  <option data-thumbnail="images/country/de.svg">EUR <span>€ | Germany</span></option>
                </select>
              </div>
              <div className="tf-languages">
                <select className="image-select center style-default type-languages">
                  <option>Türkçe</option>
                  <option>English</option>
                  <option>العربية</option>
                </select>
              </div>
            </div> */}
          </div>
        </div>
      </div>
      {/* /Top Bar */}

      {/* Header */}
      <header id="header" className="header-default">
        <div className="px_15 lg-px_40">
          <div className="row wrapper-header align-items-center">
            <div className="col-md-4 col-3 tf-lg-hidden">
              <button
                onClick={toggleMobileMenu}
                className="nav-icon-item"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="16"
                  viewBox="0 0 24 16"
                  fill="none"
                >
                  <path
                    d="M2.00056 2.28571H16.8577C17.1608 2.28571 17.4515 2.16531 17.6658 1.95098C17.8802 1.73665 18.0006 1.44596 18.0006 1.14286C18.0006 0.839753 17.8802 0.549063 17.6658 0.334735C17.4515 0.120408 17.1608 0 16.8577 0H2.00056C1.69745 0 1.40676 0.120408 1.19244 0.334735C0.978109 0.549063 0.857702 0.839753 0.857702 1.14286C0.857702 1.44596 0.978109 1.73665 1.19244 1.95098C1.40676 2.16531 1.69745 2.28571 2.00056 2.28571ZM0.857702 8C0.857702 7.6969 0.978109 7.40621 1.19244 7.19188C1.40676 6.97755 1.69745 6.85714 2.00056 6.85714H22.572C22.8751 6.85714 23.1658 6.97755 23.3801 7.19188C23.5944 7.40621 23.7148 7.6969 23.7148 8C23.7148 8.30311 23.5944 8.59379 23.3801 8.80812C23.1658 9.02245 22.8751 9.14286 22.572 9.14286H2.00056C1.69745 9.14286 1.40676 9.02245 1.19244 8.80812C0.978109 8.59379 0.857702 8.30311 0.857702 8ZM0.857702 14.8571C0.857702 14.554 0.978109 14.2633 1.19244 14.049C1.40676 13.8347 1.69745 13.7143 2.00056 13.7143H12.2863C12.5894 13.7143 12.8801 13.8347 13.0944 14.049C13.3087 14.2633 13.4291 14.554 13.4291 14.8571C13.4291 15.1602 13.3087 15.4509 13.0944 15.6653C12.8801 15.8796 12.5894 16 12.2863 16H2.00056C1.69745 16 1.40676 15.8796 1.19244 15.6653C0.978109 15.4509 0.857702 15.1602 0.857702 14.8571Z"
                    fill="currentColor"
                  ></path>
                </svg>
              </button>
            </div>
            <div className="col-xl-3 col-md-4 col-6">
              <Link href="/" className="logo-header">
                <Image
                  src="/assets/site/images/logo/desa-logo.svg"
                  alt="Desa Logo"
                  width={120}
                  height={40}
                  className="logo"
                />
              </Link>
            </div>
            <div className="col-xl-6 tf-md-hidden">
              <nav className="box-navigation text-center">
                <ul className="box-nav-ul d-flex align-items-center justify-content-center gap-30">
                  <li className="menu-item">
                    <Link href={PathEnums.HOME} className="item-link">
                      Anasayfa
                    </Link>
                  </li>

                  {categories?.items?.length &&
                    categories.items
                      .slice()
                      .sort((a, b) => a.displayIndex - b.displayIndex)
                      .map((category) => (
                        <li
                          key={category.id}
                          className="menu-item"
                          onMouseEnter={() => setHoveredCategoryId(category.id)}
                          onMouseLeave={() => setHoveredCategoryId("")}
                        >
                          <Link
                            href={`${PathEnums.PRODUCTS}?categoryId=${category.id}`}
                            className="item-link"
                          >
                            {category.name}
                            <i className="icon icon-arrow-down"></i>
                          </Link>

                          {hoveredCategoryId === category.id && subCategories && (
                            <div className="sub-menu mega-menu">
                              <div className="container">
                                <div className="row">
                                  <div className="col-lg-12">
                                    <div className="mega-menu-item">
                                      <div className="menu-heading">
                                        {category.name} Alt Kategorileri
                                      </div>
                                      <ul className="menu-list">
                                        {subCategories
                                          .slice()
                                          .sort((a, b) => a.displayIndex - b.displayIndex)
                                          .map((subCategory) => (
                                            <li key={subCategory.id}>
                                              <Link
                                                href={`${PathEnums.PRODUCTS}?categoryId=${category.id}&subCategoryId=${subCategory.id}`}
                                                className="menu-link-text link"
                                              >
                                                {subCategory.name}
                                              </Link>
                                            </li>
                                          ))}
                                      </ul>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </li>
                      ))}
                  <li className="menu-item">
                    <Link href={`${PathEnums.PRODUCTS}?categoryId=outlet`} className="item-link">
                      Outlet
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
            <div className="col-xl-3 col-md-4 col-3">
              <ul className="nav-icon d-flex justify-content-end align-items-center gap-20">
                <li className="nav-search">
                  <button
                    onClick={() => setShowResults(!showResults)}
                    className="nav-icon-item"
                  >
                    <i className="icon icon-search"></i>
                  </button>
                  {showResults && (
                    <div className="search-results-dropdown">
                      <div className="search-results-list">
                        {searchResults.length > 0 ? (
                          searchResults.map((product) => (
                            <Link
                              key={product.id}
                              href={`/products/${product.id}`}
                              className="search-result-item"
                              onClick={() => setShowResults(false)}
                            >
                              <Image
                                src={product.baseImageUrl || "/assets/images/no-image.jpg"}
                                alt={product.title}
                                width={50}
                                height={50}
                              />
                              <div>
                                <div className="search-result-title">
                                  {product.title}
                                </div>
                                <div className="search-result-price">
                                  {product.price.toLocaleString("tr-TR", {
                                    style: "currency",
                                    currency: "TRY",
                                  })}
                                </div>
                              </div>
                            </Link>
                          ))
                        ) : (
                          <div className="search-no-results">
                            <i className="icon icon-search"></i>
                            <span>Ürün bulunamadı</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </li>
                <li className="nav-account">
                  {userProfile ? (
                    <div className="dropdown">
                      <button
                        className="nav-icon-item"
                        data-bs-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        <i className="icon icon-account"></i>
                      </button>
                      <div className="dropdown-menu dropdown-menu-end">
                        <div className="dropdown-header">
                          <div className="user-info">
                            <div className="user-name">
                              {showAdminFeatures
                                ? "Admin"
                                : `${userProfile?.applicationUser?.firstName || "Kullanıcı"} ${userProfile?.applicationUser?.lastName || ""
                                }`}
                            </div>
                          </div>
                        </div>
                        <div className="dropdown-body">
                          {!showAdminFeatures && (
                            <Link href={PathEnums.PROFILE} className="dropdown-item">
                              <i className="icon-user"></i>
                              <span>Profil</span>
                            </Link>
                          )}
                          {showCustomerFeatures && (
                            <>
                              <Link href={`${PathEnums.PROFILE}/orders`} className="dropdown-item">
                                <i className="bx bx-shopping-bag"></i>
                                <span>Siparişlerim</span>
                              </Link>
                              <Link href={`${PathEnums.PROFILE}/addresses`} className="dropdown-item">
                                <i className="icon-map-marker"></i>
                                <span>Adreslerim</span>
                              </Link>
                            </>
                          )}
                          {showSellerFeatures && (
                            <Link href={PathEnums.SELLER_PRODUCTS} className="dropdown-item">
                              <i className="bx bx-user-pin"></i>
                              <span>Ürünleri Yönet</span>
                            </Link>
                          )}
                          {showAdminFeatures && (
                            <Link href={PathEnums.ADMIN_DASHBOARD} className="dropdown-item">
                              <i className="icon-cog"></i>
                              <span>Admin Paneli</span>
                            </Link>
                          )}
                        </div>
                        <div className="dropdown-footer">
                          <button className="dropdown-item text-danger" onClick={handleLogout}>
                            <i className="icon-sign-out"></i>
                            <span>Çıkış Yap</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <button
                      className="nav-icon-item"
                      onClick={() => router.push("/login")}
                    >
                      <i className="icon icon-account"></i>
                    </button>
                  )}
                </li>
                <li className="nav-wishlist">
                  <Link href={PathEnums.FAVORITES} className="nav-icon-item">
                    <i className="icon icon-heart"></i>
                    {totalFavorites > 0 && <span className="count-box">{totalFavorites}</span>}
                  </Link>
                </li>
                <li className="nav-cart">
                  <div className="dropdown">
                    <button
                      className="nav-icon-item"
                      data-bs-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
                    >
                      <i className="icon icon-bag"></i>
                      {totalItems > 0 && <span className="count-box">{totalItems}</span>}
                    </button>
                    <div className="dropdown-menu dropdown-menu-end">
                      <div className="dropdown-cart-products">
                        {cartProducts.map((item) => (
                          <div key={item.id} className="dropdown-cart-item">
                            <Image
                              src={item.baseImageUrl || "/assets/images/no-image.jpg"}
                              alt={item.title}
                              width={50}
                              height={50}
                            />
                            <div className="cart-item-info">
                              <Link href={`/products/${item.id}`} className="cart-item-title">
                                {item.title}
                              </Link>
                              <div className="cart-item-price">
                                {item.quantity} x{" "}
                                {(
                                  item.discountedPrice !== item.price && item.discountedPrice
                                    ? item.discountedPrice
                                    : item.price ?? 0
                                ).toLocaleString("tr-TR", {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                                ₺
                              </div>
                            </div>
                            <button
                              className="btn-remove"
                              onClick={() => removeFromCart(item.id)}
                              title="Ürünü Kaldır"
                            >
                              <i className="icon-close"></i>
                            </button>
                          </div>
                        ))}
                      </div>
                      <div className="dropdown-cart-total">
                        <span className="cart-total-label">Toplam</span>
                        <span className="cart-total-price">
                          {cartTotal.toLocaleString("tr-TR", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                          ₺
                        </span>
                      </div>
                      <div className="dropdown-cart-action">
                        <Link href={PathEnums.CART} className="btn btn-outline-primary-2">
                          <span>Sepete Git</span>
                          <i className="icon-long-arrow-right"></i>
                        </Link>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </header>
      {/* /Header */}

      {/* Mobil Menü */}
      {isMobileMenuOpen && (
        <MobileMenu isOpen={isMobileMenuOpen} onClose={closeMobileMenu} />
      )}
    </>
  );
}