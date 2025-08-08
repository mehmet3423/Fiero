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
import { useEffect, useRef, useState, useMemo } from "react";
import { toast } from "react-hot-toast";
import MobileMenu from "./MobileMenu";
import CartSidebar from "./CartSidebar";
import SearchSidebar from "./SearchSidebar";
import AnnouncementSlider from "./home/AnnouncementSlider";

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
  const { searchTerm, setSearchTerm, searchResults, isSearching } = useSearch();
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const { categories } = useMainCategoriesLookUp();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);

  const [hoveredCategoryId, setHoveredCategoryId] = useState<string>("");
  const { categories: subCategories } =
    useSubCategoriesLookUp(hoveredCategoryId);

  // Chunk subcategories into groups of 10 for column layout
  const chunkedSubCategories = useMemo(() => {
    if (!subCategories) return [];
    const sorted = [...subCategories].sort(
      (a, b) => a.displayIndex - b.displayIndex
    );
    const chunks: (typeof sorted)[] = [];
    for (let i = 0; i < sorted.length; i += 10) {
      chunks.push(sorted.slice(i, i + 10));
    }
    return chunks;
  }, [subCategories]);

  const showCustomerFeatures =
    userRole === UserRole.CUSTOMER || userRole === null;
  const showSellerFeatures = userRole === UserRole.SELLER;
  const showAdminFeatures = userRole === UserRole.ADMIN;
  const [sustainabilityDropdownOpen, setSustainabilityDropdownOpen] = useState(false);

  if (userProfileLoading) {
    return <></>;
  }

  const cartTotal = cartProducts.reduce(
    (total, item) =>
      total + (item.discountedPrice || item.price) * item.quantity,
    0
  );

  const [showSearchInput, setShowSearchInput] = useState(false);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
        // Eğer arama boşsa input'u da kapat
        if (!searchTerm) {
          setShowSearchInput(false);
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [searchTerm]);

  useEffect(() => {
    function handleAccountDropdownClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement;
      if (!target.closest(".nav-account")) {
        setIsAccountDropdownOpen(false);
      }
    }

    if (isAccountDropdownOpen) {
      document.addEventListener("mousedown", handleAccountDropdownClickOutside);
      return () =>
        document.removeEventListener(
          "mousedown",
          handleAccountDropdownClickOutside
        );
    }
  }, [isAccountDropdownOpen]);

  const [isCartDropdownOpen, setIsCartDropdownOpen] = useState(false);
  useEffect(() => {
    console.log(
      "Header useEffect - isCartDropdownOpen changed to:",
      isCartDropdownOpen
    );
  }, [isCartDropdownOpen]);

  const [windowWidth, setWindowWidth] = useState(0);
  useEffect(() => {
    // İlk yükleme
    setWindowWidth(window.innerWidth);

    // Resize event listener
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    // 3 karakter veya daha fazla olduğunda sonuçları göster
    if (value.length >= 3) {
      setShowResults(true);
    } else if (value.length === 0) {
      setShowResults(false);
    }
  };
  const toggleSearch = () => {
    setShowSearchInput(!showSearchInput);
    if (!showSearchInput) {
      setTimeout(() => {
        const input = document.querySelector(".canvas-search input");
        (input as HTMLInputElement)?.focus();
      }, 100);
    } else {
      setSearchTerm("");
      setShowResults(false);
    }
  };

  // Search input'unu kapatma fonksiyonu:
  const closeSearch = () => {
    setShowSearchInput(false);
    setSearchTerm("");
    setShowResults(false);
  };

  // Arama sonucu öğesine tıklama:
  const handleResultClick = (productId: string) => {
    router.push(`/products/${productId}`);
    closeSearch();
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
      <AnnouncementSlider />
      <div className="tf-top-bar bg_white line py-4 sticky-top">
        <div className="px_15 lg-px_40">
          <div className="tf-top-bar_item d-flex justify-content-center align-items-center">
            <div className="col-4 tf-lg-hidden" style={{ paddingLeft: '25px' }}>
              <button onClick={toggleMobileMenu} className="nav-icon-item">
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
            <div className="col-4 justify-content-center align-items-center mx-4"
              style={{
                paddingLeft: windowWidth > 768 ? "10%" : "0",
              }}>
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
            <div className="col-4 tf-md-hidden text-center overflow-hidden">
              <div
                className="swiper tf-sw-top_bar"
                data-preview="1"
                data-space="0"
                data-loop="true"
                data-speed="1000"
                data-delay="2000"
              >
                <div className="swiper-wrapper">
                  <div className="swiper-slide">
                    <p className="top-bar-text fw-5">
                      Spring Fashion Sale{" "}
                      <Link href="/products" className="tf-btn btn-line">
                        Shop now<i className="icon icon-arrow1-top-left"></i>
                      </Link>
                    </p>
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
            <div className="col-4 d-flex justify-content-end"
              style={{
                paddingRight: windowWidth > 1024 ? "10%" : "25px",
              }}>
              <ul className="nav-icon d-flex justify-content-end align-items-center gap-20">
                <li className="nav-search tf-md-hidden">
                  <button onClick={toggleSearch} className="nav-icon-item">
                    <i className="icon icon-search"></i>
                  </button>
                  <SearchSidebar
                    isOpen={showSearchInput}
                    onClose={closeSearch}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    showResults={showResults}
                    setShowResults={setShowResults}
                  />
                </li>
                <li className="nav-account">
                  {userProfile ? (
                    <div className="dropdown">
                      <button
                        className="nav-icon-item"
                        onClick={() => {
                          setIsAccountDropdownOpen(!isAccountDropdownOpen);
                        }}
                      >
                        <i className="icon icon-account"></i>
                      </button>
                      {isAccountDropdownOpen && (
                        <div className="dropdown-menu dropdown-menu-end show">
                          <div className="dropdown-header">
                            <div className="user-info">
                              <div className="user-name">
                                {showAdminFeatures
                                  ? "Admin"
                                  : `${userProfile?.applicationUser?.firstName ||
                                  "Kullanıcı"
                                  } ${userProfile?.applicationUser?.lastName ||
                                  ""
                                  }`}
                              </div>
                            </div>
                          </div>
                          <div className="dropdown-body">
                            {!showAdminFeatures && (
                              <Link
                                href={PathEnums.PROFILE}
                                className="dropdown-item"
                                onClick={() => setIsAccountDropdownOpen(false)}
                              >
                                <i className="icon-user"></i>
                                <span> Profil</span>
                              </Link>
                            )}
                            {showCustomerFeatures && (
                              <>
                                <Link
                                  href={`${PathEnums.PROFILE}/orders`}
                                  className="dropdown-item"
                                  onClick={() =>
                                    setIsAccountDropdownOpen(false)
                                  }
                                >
                                  <i className="bx bx-shopping-bag"></i>
                                  <span>Siparişlerim</span>
                                </Link>
                                <Link
                                  href={`${PathEnums.PROFILE}/addresses`}
                                  className="dropdown-item"
                                  onClick={() =>
                                    setIsAccountDropdownOpen(false)
                                  }
                                >
                                  <i className="icon-map-marker"></i>
                                  <span>Adreslerim</span>
                                </Link>
                              </>
                            )}
                            {showSellerFeatures && (
                              <Link
                                href={PathEnums.SELLER_PRODUCTS}
                                className="dropdown-item"
                                onClick={() => setIsAccountDropdownOpen(false)}
                              >
                                <i className="bx bx-user-pin"></i>
                                <span>Ürünleri Yönet</span>
                              </Link>
                            )}
                            {showAdminFeatures && (
                              <Link
                                href={PathEnums.ADMIN_DASHBOARD}
                                className="dropdown-item"
                                onClick={() => setIsAccountDropdownOpen(false)}
                              >
                                <i className="icon-cog"></i>
                                <span>Admin Paneli</span>
                              </Link>
                            )}
                          </div>
                          <div className="dropdown-footer">
                            <button
                              className="dropdown-item text-danger"
                              onClick={() => {
                                setIsAccountDropdownOpen(false);
                                handleLogout();
                              }}
                            >
                              <i className="icon-sign-out"></i>
                              <span>Çıkış Yap</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <button
                      className="nav-icon-item"
                      onClick={() => router.push("/login")} // Giriş yapmamış kullanıcı için login sayfası
                    >
                      <i className="icon icon-account"></i>
                    </button>
                  )}
                </li>
                <li className="nav-wishlist tf-md-hidden">
                  <button
                    className={`nav-icon-item ${totalFavorites > 0 ? 'has-favorites' : ''}`}
                    onClick={() => router.push("/favorites")}
                    style={{ marginTop: '3px' }}
                  >
                    {totalFavorites > 0 ? (
                      // Dolu kalp SVG - büyük ve geniş
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="#000000ff" >
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                      </svg>
                    ) : (
                      // Boş kalp icon - normal boyutta
                      <i className="icon icon-heart" style={{ fontSize: '17px' }}></i>
                    )}
                    {totalFavorites > 0 && (
                      <span className="count-box" style={{ marginTop: '2px' }}>{totalFavorites}</span>
                    )}
                  </button>
                </li>
                <li className="nav-cart">
                  <button
                    className="nav-icon-item"
                    onClick={() => {
                      console.log(
                        "Cart button clicked, current state:",
                        isCartDropdownOpen
                      );
                      const newState = !isCartDropdownOpen;
                      console.log("Setting new state to:", newState);
                      setIsCartDropdownOpen(newState);
                    }}
                  >
                    <i className="icon icon-bag"></i>
                    {totalItems > 0 && (
                      <span className="count-box">{totalItems}</span>
                    )}
                  </button>

                  <CartSidebar
                    isOpen={isCartDropdownOpen}
                    onClose={() => {
                      console.log("CartSidebar onClose called");
                      setIsCartDropdownOpen(false);
                    }}
                  />
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      {/* /Top Bar */}

      {/* Header */}
      <header id="header" className="header-default" >
        <div className="px_15 lg-px_40">
          <div className="row wrapper-header align-items-center">

            <div className="tf-md-hidden align-items-center ">
              <nav className="box-navigation text-center" >
                <ul className="box-nav-ul d-flex align-items-center justify-content-center gap-30" >
                  <li className="menu-item">
                    <Link href={PathEnums.HAFSANUR_DESA} className="item-link">
                      HAFSANUR X DESA
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

                        >
                          <Link
                            href={`${PathEnums.PRODUCTS}?categoryId=${category.id}`}
                            className="item-link"
                            onMouseEnter={() => setHoveredCategoryId(category.id)}
                            onMouseLeave={() => setHoveredCategoryId("")}
                          >
                            {category.name}
                            <i className="icon icon-arrow-down"></i>
                          </Link>

                          {hoveredCategoryId === category.id &&
                            subCategories && (
                              <div className="sub-menu mega-menu">
                                <div className="container">
                                  <div className="row">
                                    <div className="col-lg-12">
                                      <div className="mega-menu-item">
                                        <div
                                          className="menu-columns"
                                          style={{
                                            display: "flex",
                                            gap: "40px",
                                          }}
                                        >
                                          {chunkedSubCategories.map(
                                            (chunk, idx) => (
                                              <ul
                                                key={idx}
                                                className="menu-list"
                                              >
                                                {chunk.map(
                                                  (subCategory, subIdx) => (
                                                    <li key={subCategory.id}>
                                                      <Link
                                                        href={`${PathEnums.PRODUCTS}?categoryId=${category.id}&subCategoryId=${subCategory.id}`}
                                                        className="menu-link-text link"
                                                        style={{
                                                          fontWeight:
                                                            subIdx === 0
                                                              ? "600"
                                                              : "normal",
                                                          color:
                                                            subIdx === 0
                                                              ? "#333"
                                                              : "#666",
                                                          fontSize:
                                                            subIdx === 0
                                                              ? "16px"
                                                              : "12px",
                                                        }}
                                                      >
                                                        {subCategory.name}
                                                      </Link>
                                                    </li>
                                                  )
                                                )}
                                              </ul>
                                            )
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                        </li>
                      ))}
                  <li className="menu-item"
                    onMouseEnter={() => setSustainabilityDropdownOpen(true)}
                    onMouseLeave={() => setSustainabilityDropdownOpen(false)}
                    style={{ position: 'relative' }}
                  >
                    <Link href={PathEnums.SUSTAINABILITY} className="item-link">
                      SÜRDÜRÜLEBİLİRLİK
                      <i className="icon icon-arrow-down"></i>
                    </Link>

                    {/* Sürdürülebilirlik Dropdown */}
                    {sustainabilityDropdownOpen && (
                      <div className="ss-sub-menu">
                        <div className="dropdown-content-wrapper">
                          <ul className="menu-list-small">
                            <li>
                              <Link
                                href="/sustainability"
                                className="menu-link-text"
                              >
                                Sürdürülebilirlik Hikayemiz
                              </Link>
                            </li>
                            <li>
                              <Link
                                href="/sustainability/leather-working-group"
                                className="menu-link-text"
                              >
                                LWG Golf Certificate
                              </Link>
                            </li>
                            <li>
                              <Link
                                href="/sustainability/enerji"
                                className="menu-link-text"
                              >
                                Güneşin Enerjisi
                              </Link>
                            </li>
                            <li>
                              <Link
                                href="/her-ilmek-bir-kadina-destek"
                                className="menu-link-text"
                              >
                                Her İlmek Bir Kadına Destek
                              </Link>
                            </li>
                            <li>
                              <Link
                                href="/sustainability/hatira-ormani"
                                className="menu-link-text"
                              >
                                Desa Ormanı
                              </Link>
                            </li>
                            <li>
                              <Link
                                href="#"
                                className="menu-link-text"
                              >
                                Sürdürülebilir Tasarımlar
                              </Link>
                            </li>

                          </ul>

                          {/* sol taraftaki resim */}
                          <div className="dropdown-image">
                            <Link href="/sustainability/featured-project">
                              <img
                                src="/assets/site/images/header/her-ilmek-resim.png"
                                alt="Sürdürülebilirlik Projesi"
                                className="dropdown-banner-img"
                              />
                            </Link>
                          </div>
                        </div>
                      </div>
                    )}
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>

      </header>
      {/* /Header */}
      {/* Mobil Menü */}
      {isMobileMenuOpen && (
        <MobileMenu isOpen={isMobileMenuOpen} onClose={closeMobileMenu} />
      )}
      <style jsx>{`
      
      
  .tf-top-bar.sticky-top {
    position: relative !important;
    top: 0px;
    left: 0;
    right: 0;
    z-index: 1002;
    background: white !important;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
    
  .header-default {
    position: relative;
    z-index: 1001;
    margin-top: 0px;
      }
    

  .nav-icon-item {
    background: none !important;
    border: none !important;
    padding: 0 !important;
    margin: 0;
    color: inherit;
    font-size: inherit;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }

  .nav-icon-item:hover {
    background: none !important;
    border: none !important;
  }

  .nav-icon-item:focus {
    outline: none;
    box-shadow: none;
  }

  .nav-icon-item i {
    font-size: 16px;
    line-height: 1;
  }

  .nav-icon-item .count-box {
    position: absolute;
    top: -7px;
    right: -7px;
    background: #ff0000;
    color: white;
    border-radius: 50%;
    width: 15px;
    height: 15px;
    font-size: 11px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
  }
    /* Heart icon - normal durumda */
  .nav-wishlist .nav-icon-item i.icon-heart {
    color: #333;
    transition: all 0.3s ease;
  }

  /* Heart icon - favoriler varsa siyah dolu */
  .nav-wishlist .nav-icon-item.has-favorites i.icon-heart {
    background-color: #000 !important;
    font-weight: 900 !important;
  }

  .nav-account {
    position: relative;
  }

  .nav-account .dropdown-menu {
    position: absolute;
    top: 100%;
    right: 0;
    min-width: 200px;
    background: white;
    border: 1px solid #ddd;
    border-radius: 4px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    z-index: 1000;
    margin-top: 5px;
  }

  .nav-account .dropdown-menu.show {
    display: block;
  }

  .sub-menu {
    position: absolute;
    top: 100%;
    z-index: 1000;
  }
    .mega-menu {
    position: absolute;
    top: 70px;
    left: 0;
    right: 0;
    background: white;
    box-shadow-bottom: 0 4px 20px rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    padding: 20px 0;
    z-index: 1000;
    opacity: 1;
    visibility: visible;
  }

  .menu-columns {
    display: flex;
    gap: 40px;
    justify-content: flex-start;
  }

  .menu-list {
    list-style: none;
    margin: 0;
    padding: 0;
    min-width: 150px;
  }

  .menu-list li {
    margin-bottom: 8px;
  }

  .menu-link-text {
    color: #666;
    text-decoration: none;
    font-size: 14px;
    padding: 4px 0;
    display: block;
    transition: color 0.2s ease;
  }

  .menu-link-text:hover {
    color: #333;
  }

  .ss-sub-menu {
  position: absolute; 
  top: 100%; 
  right: 0; 
  z-index: 1000; 
  background: white; 
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1); 
  border-radius: 4px; 
}

.dropdown-content-wrapper {
  display: flex;
  flex-direction: row-reverse;
  min-width: 420px; 
  padding: 20px; 
}

.menu-list-small {
  list-style: none;
  margin: 0;
  padding: 0;
}

.menu-list-small li {
  margin-bottom: 12px;
}

.menu-list-small li:last-child {
  margin-bottom: 0;
}

.dropdown-image {
  width: 180px;
  height: auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

  .dropdown-banner-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  .dropdown-image:hover .dropdown-banner-img {
    transform: scale(1.02);
  }
`}</style>
    </>
  );
}
