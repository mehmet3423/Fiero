import { PathEnums } from "@/constants/enums/PathEnums";
import { UserRole } from "@/constants/enums/UserRole";
import { useSearch } from "@/context/SearchContext";
import { useAuth } from "@/hooks/context/useAuth";
import { useCategories } from "@/hooks/services/categories/useCategories";
import { useSubCategories } from "@/hooks/services/categories/useSubCategories";
import { useMainCategoriesLookUp } from "@/hooks/services/categories/useMainCategoriesLookUp";
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

  // Kategori verisi (ana)
  const { categories: mainCategories } = useMainCategoriesLookUp();

  // Alt kategori verisi
  const { categories: subCategories = [] } = useSubCategoriesLookUp(
    expandedCategoryId || ""
  );

  const showCustomerFeatures =
    userRole === UserRole.CUSTOMER || userRole === null;
  const showSellerFeatures = userRole === UserRole.SELLER;
  const showAdminFeatures = userRole === UserRole.ADMIN;

  const handleCategoryClick = (categoryId: string) => {
    if (expandedCategoryId === categoryId) {
      setExpandedCategoryId(null);
    } else {
      setExpandedCategoryId(categoryId);
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
    <div
      className={`offcanvas offcanvas-start canvas-mb ${isOpen ? "show" : ""}`}
      id="mobileMenu"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100vh",
        backgroundColor: "white",
        zIndex: 1050,
        transform: isOpen ? "translateX(0)" : "translateX(-100%)",
        transition: "transform 0.3s ease-in-out",
        overflowY: "auto",
      }}
    >
      <span
        className="icon-close icon-close-popup"
        onClick={onClose}
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          fontSize: "24px",
          cursor: "pointer",
          zIndex: 1060,
        }}
      >
        <i className="icon-close"></i>
      </span>

      <div
        className="mb-canvas-content"
        style={{ height: "100%", display: "flex", flexDirection: "column" }}
      >
        <div className="mb-body" style={{ flex: 1, padding: "20px" }}>
          <ul
            className="nav-ul-mb"
            id="wrapper-menu-navigation"
            style={{ listStyle: "none", padding: 0, margin: 0 }}
          >
            {/* Anasayfa */}
            <li className="nav-mb-item" style={{ marginBottom: "10px" }}>
              <a
                href="#"
                className={`mb-menu-link ${
                  router.pathname === PathEnums.HOME ? "current" : ""
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(PathEnums.HOME);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 0",
                  textDecoration: "none",
                  color:
                    router.pathname === PathEnums.HOME ? "#007bff" : "#333",
                  fontSize: "16px",
                  fontWeight: "500",
                }}
              >
                <span>Anasayfa</span>
              </a>
            </li>

            {/* Kategoriler */}
            {categories?.items?.length &&
              categories.items.map((category) => (
                <li
                  key={category.id}
                  className="nav-mb-item"
                  style={{ marginBottom: "10px" }}
                >
                  <a
                    href="#"
                    className={`mb-menu-link ${
                      router.query.categoryId === category.id ? "current" : ""
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleCategoryClick(category.id);
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "12px 0",
                      textDecoration: "none",
                      color:
                        router.query.categoryId === category.id
                          ? "#007bff"
                          : "#333",
                      fontSize: "16px",
                      fontWeight: "500",
                    }}
                  >
                    <span>{category.name}</span>
                    <span
                      className="btn-open-sub"
                      style={{
                        transform:
                          expandedCategoryId === category.id
                            ? "rotate(180deg)"
                            : "rotate(0deg)",
                        transition: "transform 0.3s ease",
                      }}
                    >
                      <i className="icon-angle-down"></i>
                    </span>
                  </a>

                  {expandedCategoryId === category.id &&
                    subCategories?.length > 0 && (
                      <div className="collapse show">
                        <ul
                          className="sub-nav-menu"
                          style={{
                            listStyle: "none",
                            padding: "0 0 0 20px",
                            margin: 0,
                            borderLeft: "2px solid #eee",
                          }}
                        >
                          {subCategories.map((subCategory) => (
                            <li
                              key={subCategory.id}
                              style={{ marginBottom: "8px" }}
                            >
                              <a
                                href="#"
                                className={`sub-nav-link ${
                                  router.query.subCategoryId === subCategory.id
                                    ? "current"
                                    : ""
                                }`}
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleLinkClick(
                                    `${PathEnums.PRODUCTS}?categoryId=${category.id}&subCategoryId=${subCategory.id}`
                                  );
                                }}
                                style={{
                                  display: "block",
                                  padding: "8px 0",
                                  textDecoration: "none",
                                  color:
                                    router.query.subCategoryId ===
                                    subCategory.id
                                      ? "#007bff"
                                      : "#666",
                                  fontSize: "14px",
                                }}
                              >
                                {subCategory.name}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                </li>
              ))}

            {/* Outlet */}
            <li className="nav-mb-item" style={{ marginBottom: "10px" }}>
              <a
                href="#"
                className={`mb-menu-link ${
                  router.query.categoryId === "outlet" ? "current" : ""
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(`${PathEnums.PRODUCTS}?categoryId=outlet`);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 0",
                  textDecoration: "none",
                  color:
                    router.query.categoryId === "outlet" ? "#007bff" : "#333",
                  fontSize: "16px",
                  fontWeight: "500",
                }}
              >
                <span>Outlet</span>
              </a>
            </li>

            {/* Satıcı Özellikleri */}
            {showSellerFeatures && (
              <li className="nav-mb-item" style={{ marginBottom: "10px" }}>
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
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "12px 0",
                    textDecoration: "none",
                    color:
                      router.pathname === PathEnums.SELLER_PRODUCTS
                        ? "#007bff"
                        : "#333",
                    fontSize: "16px",
                    fontWeight: "500",
                  }}
                >
                  <span>Ürünleri Yönet</span>
                </a>
              </li>
            )}

            {/* Admin Özellikleri */}
            {showAdminFeatures && (
              <li className="nav-mb-item" style={{ marginBottom: "10px" }}>
                <a
                  href="#"
                  className={`mb-menu-link ${
                    router.pathname === "/admin" ? "current" : ""
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleLinkClick("/admin");
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "12px 0",
                    textDecoration: "none",
                    color: router.pathname === "/admin" ? "#007bff" : "#333",
                    fontSize: "16px",
                    fontWeight: "500",
                  }}
                >
                  <span>Admin Paneli</span>
                </a>
              </li>
            )}
          </ul>

          {/* Alt İçerik */}
          <div
            className="mb-other-content"
            style={{
              marginTop: "30px",
              paddingTop: "20px",
              borderTop: "1px solid #eee",
            }}
          >
            <div
              className="d-flex group-icon"
              style={{ gap: "20px", marginBottom: "20px" }}
            >
              <a
                href="#"
                className="site-nav-icon"
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(PathEnums.FAVORITES);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  textDecoration: "none",
                  color: "#333",
                  fontSize: "14px",
                }}
              >
                <i className="icon icon-heart"></i>
                <span>Favorilerim</span>
              </a>
              <a
                href="#"
                className="site-nav-icon"
                onClick={(e) => {
                  e.preventDefault();
                  // Arama modalını aç
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  textDecoration: "none",
                  color: "#333",
                  fontSize: "14px",
                }}
              >
                <i className="icon icon-search"></i>
                <span>Ara</span>
              </a>
            </div>

            <div className="mb-notice" style={{ marginBottom: "20px" }}>
              <a
                href={PathEnums.CONTACT}
                className="text-need"
                style={{
                  color: "#007bff",
                  textDecoration: "none",
                  fontSize: "14px",
                }}
              >
                Yardıma mı ihtiyacınız var?
              </a>
            </div>

            <ul
              className="mb-info"
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                fontSize: "12px",
                color: "#666",
                lineHeight: "1.6",
              }}
            >
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

        {/* Alt Bar */}
        <div
          className="mb-bottom"
          style={{
            padding: "20px",
            borderTop: "1px solid #eee",
            backgroundColor: "#f8f9fa",
          }}
        >
          {userProfile ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "15px",
              }}
            >
              <i
                className="icon icon-account"
                style={{ fontSize: "18px", color: "#007bff" }}
              ></i>
              <span style={{ fontSize: "14px", color: "#333" }}>
                {userProfile.applicationUser?.fullName || "Kullanıcı"}
              </span>
            </div>
          ) : (
            <a
              href="#"
              className="site-nav-icon"
              onClick={(e) => {
                e.preventDefault();
                onClose();
                $("#signin-modal").modal("show");
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                textDecoration: "none",
                color: "#333",
                fontSize: "14px",
                marginBottom: "15px",
              }}
            >
              <i className="icon icon-account"></i>
              <span>Giriş Yap</span>
            </a>
          )}

          <div
            className="bottom-bar-language"
            style={{ display: "flex", gap: "15px" }}
          >
            <div className="tf-currencies">
              <select
                className="image-select center style-default type-currencies"
                style={{
                  padding: "8px 12px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  fontSize: "12px",
                  backgroundColor: "white",
                }}
              >
                <option>TRY ₺ | Türkiye</option>
                <option>USD $ | Amerika</option>
                <option>EUR € | Avrupa</option>
              </select>
            </div>
            <div className="tf-languages">
              <select
                className="image-select center style-default type-languages"
                style={{
                  padding: "8px 12px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  fontSize: "12px",
                  backgroundColor: "white",
                }}
              >
                <option>Türkçe</option>
                <option>English</option>
                <option>العربية</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
