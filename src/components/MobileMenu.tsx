import { PathEnums } from "@/constants/enums/PathEnums";
import { UserRole } from "@/constants/enums/UserRole";
import { useSearch } from "@/context/SearchContext";
import { useAuth } from "@/hooks/context/useAuth";
import { useActiveCategories } from "@/hooks/services/categories/useActiveCategories";
import { useSubCategories } from "@/hooks/services/categories/useSubCategories";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState, useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import { useLanguage } from "@/context/LanguageContext";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const { language } = useLanguage();
  const { userRole, userProfile } = useAuth();
  const { isAdmin } = useIsAdmin();
  const { categories: categoriesData } = useActiveCategories();
  const categories = categoriesData?.items || [];
  const [expandedCategoryId, setExpandedCategoryId] = useState<string | null>(
    null
  );
  const { searchTerm, setSearchTerm } = useSearch();
  const [localSearchTerm, setLocalSearchTerm] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const collapseRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Alt kategori verisi
  const { data: subCategoriesData } = useSubCategories(
    expandedCategoryId || ""
  );
  const subCategories = Array.isArray(subCategoriesData)
    ? subCategoriesData
    : [];

  const showCustomerFeatures =
    userRole === UserRole.CUSTOMER || userRole === null;
  const showSellerFeatures = userRole === UserRole.SELLER;
  const showAdminFeatures = userRole === UserRole.ADMIN;

  const handleCategoryClick = (categoryId: string) => {
    if (isAnimating) return; // Animasyon devam ederken yeni tıklamaları engelle

    const isCurrentlyExpanded = expandedCategoryId === categoryId;
    const collapseElement = collapseRefs.current[categoryId];

    if (!collapseElement) {
      setExpandedCategoryId(isCurrentlyExpanded ? null : categoryId);
      return;
    }

    setIsAnimating(true);

    if (isCurrentlyExpanded) {
      // Kapatma animasyonu
      collapseElement.style.height = collapseElement.scrollHeight + "px";
      collapseElement.offsetHeight; // Force reflow
      collapseElement.style.height = "0px";
      collapseElement.style.overflow = "hidden";

      setTimeout(() => {
        setExpandedCategoryId(null);
        collapseElement.style.height = "";
        collapseElement.style.overflow = "";
        setIsAnimating(false);
      }, 350);
    } else {
      // Açma animasyonu
      collapseElement.style.height = "0px";
      collapseElement.style.overflow = "hidden";
      setExpandedCategoryId(categoryId);

      // Alt kategoriler yüklendikten sonra animasyonu başlat
      setTimeout(() => {
        collapseElement.style.height = collapseElement.scrollHeight + "px";

        setTimeout(() => {
          collapseElement.style.height = "";
          collapseElement.style.overflow = "";
          setIsAnimating(false);
        }, 350);
      }, 50);
    }
  };

  const handleLinkClick = (path: string) => {
    router.push(path);
    onClose();
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localSearchTerm.length >= 3) {
      setSearchTerm(localSearchTerm);
      router.push(`/products?title=${encodeURIComponent(localSearchTerm)}`);
      onClose();
    } else {
      toast.error("En az 3 karakter girmelisiniz");
    }
  };

  return (
    <>
      <div
        className={`offcanvas offcanvas-start canvas-mb ${
          isOpen ? "show" : ""
        }`}
        id="mobileMenu"
      >
        <span
          className="icon-close icon-close-popup"
          onClick={onClose}
          aria-label="Close"
        ></span>

        <div className="mb-canvas-content">
          <div className="mb-body">
            <ul className="nav-ul-mb" id="wrapper-menu-navigation">
              {categories?.length > 0 &&
                categories.map((category) => (
                  <li key={category.id} className="nav-mb-item">
                    <a
                      href="#"
                      className={`mb-menu-link ${
                        expandedCategoryId === category.id ? "current" : ""
                      }`}
                      onClick={(e) => {
                        e.preventDefault();
                        handleCategoryClick(category.id);
                      }}
                    >
                      <span>
                        {language === "en" && category.nameEn
                          ? category.nameEn
                          : category.name}
                      </span>
                      <span
                        className={`btn-open-sub ${
                          expandedCategoryId === category.id ? "expanded" : ""
                        }`}
                      ></span>
                    </a>

                    <div
                      ref={(el) => {
                        collapseRefs.current[category.id] = el;
                      }}
                      className={`custom-collapse ${
                        expandedCategoryId === category.id ? "show" : ""
                      }`}
                      style={{
                        transition: "height 0.35s ease",
                        overflow: "hidden",
                      }}
                    >
                      {expandedCategoryId === category.id &&
                        subCategories &&
                        subCategories.length > 0 && (
                          <ul className="sub-nav-menu" id="sub-menu-navigation">
                            {subCategories.map((subCategory) => (
                              <li key={subCategory.id}>
                                <a
                                  href="#"
                                  className={`sub-nav-link ${
                                    router.query.subCategoryId ===
                                    subCategory.id
                                      ? "current"
                                      : ""
                                  }`}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleLinkClick(
                                      category.seo?.slug &&
                                        subCategory.seo?.slug
                                        ? `/category/${category.seo.slug}/${subCategory.seo.slug}`
                                        : `${PathEnums.PRODUCTS}?categoryId=${category.id}&subCategoryId=${subCategory.id}`
                                    );
                                  }}
                                >
                                  {language === "en" && subCategory.nameEn
                                    ? subCategory.nameEn
                                    : subCategory.name}
                                </a>
                              </li>
                            ))}
                          </ul>
                        )}
                    </div>
                  </li>
                ))}

              {showSellerFeatures && (
                <li className="nav-mb-item">
                  <a
                    href="#"
                    className={`mb-menu-link ${
                      router.pathname === PathEnums.SELLER_PRODUCTS
                        ? "current"
                        : ""
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleLinkClick(PathEnums.SELLER_PRODUCTS);
                    }}
                  >
                    <span>Ürünleri Yönet</span>
                  </a>
                </li>
              )}

              {showAdminFeatures && (
                <li className="nav-mb-item">
                  <a
                    href="#"
                    className={`mb-menu-link ${
                      router.pathname === "/admin" ? "current" : ""
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleLinkClick("/admin");
                    }}
                  >
                    <span>Admin Paneli</span>
                  </a>
                </li>
              )}
            </ul>

            <div className="mb-other-content">
              <div className="d-flex group-icon">
                <a
                  href="#"
                  className="site-nav-icon"
                  onClick={(e) => {
                    e.preventDefault();
                    handleLinkClick(PathEnums.FAVORITES);
                  }}
                >
                  <i className="icon icon-heart"></i>Favorilerim
                </a>
                <a
                  href="#"
                  className="site-nav-icon"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsSearchOpen(!isSearchOpen);
                  }}
                >
                  <i className="icon icon-search"></i>Ara
                </a>
              </div>

              {isSearchOpen && (
                <form
                  onSubmit={handleSearchSubmit}
                  className="mb-search-form"
                  style={{ marginTop: "10px", padding: "0 15px" , marginBottom: "10px"}}
                >
                  <div className="search-box d-flex">
                    <input
                      type="text"
                      placeholder="Ürün ara..."
                      value={localSearchTerm}
                      onChange={(e) => setLocalSearchTerm(e.target.value)}
                      className="form-control"
                      style={{
                        flex: 1,
                        padding: "8px 12px",
                        border: "1px solid #ddd",
                        borderRadius: "4px 0 0 4px",
                        boxShadow: "none",
                        outline: "none",
                      }}
                    />
                    <button
                      type="submit"
                      className="search-btn"
                      style={{
                        padding: "8px 12px",
                        background: "#000",
                        color: "#fff",
                        border: "none",
                        borderRadius: "0 4px 4px 0",
                      }}
                    >
                      <i className="icon icon-search"></i>
                    </button>
                  </div>
                </form>
              )}

              <div className="mb-notice">
                <a href={PathEnums.CONTACT} className="text-need">
                  Yardıma mı ihtiyacınız var?
                </a>
              </div>

              <ul className="mb-info">
                <li>Adres: İstanbul, Türkiye</li>
                <li>
                  Email: <b>info@nors.com</b>
                </li>
                <li>
                  Telefon: <b>+90 (212) 555-0123</b>
                </li>
              </ul>
            </div>
          </div>

          <div className="mb-bottom">
            {userProfile ? (
              <a href="#" className="site-nav-icon">
                <i className="icon icon-account"></i>
                {userProfile.applicationUser?.fullName || "Kullanıcı"}
              </a>
            ) : (
              <a
                href="#"
                className="site-nav-icon"
                onClick={(e) => {
                  e.preventDefault();
                  onClose();
                  router.push("/login");
                }}
              >
                <i className="icon icon-account"></i>Giriş Yap
              </a>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileMenu;
