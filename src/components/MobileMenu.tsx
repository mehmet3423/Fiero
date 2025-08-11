import { PathEnums } from "@/constants/enums/PathEnums";
import { UserRole } from "@/constants/enums/UserRole";
import { useSearch } from "@/context/SearchContext";
import { useAuth } from "@/hooks/context/useAuth";
import { useCategories } from "@/hooks/services/categories/useCategories";
import { useSubCategoriesLookUp } from "@/hooks/services/categories/useSubCategoriesLookUp";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "react-hot-toast";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const { userRole, userProfile } = useAuth();
  const { isAdmin } = useIsAdmin();
  const { categories } = useCategories();
  const [expandedCategoryId, setExpandedCategoryId] = useState<string | null>(
    null
  );
  const { searchTerm, setSearchTerm } = useSearch();
  const [localSearchTerm, setLocalSearchTerm] = useState("");

  // Alt kategori verisi
  const { categories: subCategories = [] } = useSubCategoriesLookUp(
    expandedCategoryId || ""
  );

  const showCustomerFeatures =
    userRole === UserRole.CUSTOMER || userRole === null;
  const showSellerFeatures = userRole === UserRole.SELLER;
  const showAdminFeatures = userRole === UserRole.ADMIN;

  const handleCategoryClick = (categoryId: string) => {
    setExpandedCategoryId((prevId) => (prevId === categoryId ? null : categoryId));
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
        className={`offcanvas offcanvas-start canvas-mb ${isOpen ? "show" : ""}`}
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
              {categories?.items?.length &&
                categories.items.map((category) => (
                  <li key={category.id} className="nav-mb-item">
                    <a
                      href={`#dropdown-menu-${category.id}`}
                      className={`collapsed mb-menu-link ${expandedCategoryId === category.id ? "current" : ""
                        }`}
                      data-bs-toggle="collapse"
                      aria-expanded={expandedCategoryId === category.id}
                      aria-controls={`dropdown-menu-${category.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        handleCategoryClick(category.id);
                      }}
                    >
                      <span>{category.name}</span>
                      <span className="btn-open-sub"></span>
                    </a>

                    <div
                      id={`dropdown-menu-${category.id}`}
                      className={`collapse ${expandedCategoryId === category.id ? "show" : ""
                        }`}
                    >
                      {subCategories?.length > 0 && (
                        <ul className="sub-nav-menu" id="sub-menu-navigation">
                          {subCategories.map((subCategory) => (
                            <li key={subCategory.id}>
                              <a
                                href="#"
                                className={`sub-nav-link ${router.query.subCategoryId === subCategory.id
                                    ? "current"
                                    : ""
                                  }`}
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleLinkClick(
                                    `${PathEnums.PRODUCTS}?categoryId=${category.id}&subCategoryId=${subCategory.id}`
                                  );
                                }}
                              >
                                {subCategory.name}
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
                    className={`mb-menu-link ${router.pathname === PathEnums.SELLER_PRODUCTS
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
                    className={`mb-menu-link ${router.pathname === "/admin" ? "current" : ""
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
                  }}
                >
                  <i className="icon icon-search"></i>Ara
                </a>
              </div>

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
                  $("#signin-modal").modal("show");
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