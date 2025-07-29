import { useAuth } from "@/hooks/context/useAuth";
import { useLogout } from "@/hooks/services/useLogout";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactNode, useEffect, useState } from "react";
import AdminMobileMenu from "../shared/AdminMobileMenu";

interface AdminLayoutProps {
  children: ReactNode;
}

interface MenuItem {
  path: string;
  icon: string;
  label: string;
  subItems?: {
    path: string;
    label: string;
  }[];
  underConstruction?: {
    progress: number;
    estimatedTime: string;
    description?: string;
  };
}

const menuItems: MenuItem[] = [
  {
    path: "/admin",
    icon: "bx bx-home-circle",
    label: "Ana Sayfa",
  },
  {
    path: "/admin/categories",
    icon: "bx bx-layout",
    label: "Kategoriler",
  },
  {
    path: "/admin/sub-category-specifications",
    icon: "bx bx-list-ul",
    label: "Alt Kategori Özellikleri",
  },
  {
    path: "/admin/general-content",
    icon: "bx bx-edit",
    label: "İçerik Yönetimi",
  },

  {
    path: "/admin/products",
    icon: "bx bx-closet",
    label: "Ürünler",
  },
  {
    path: "/admin/support-tickets",
    icon: "bx bx-support",
    label: "Destek Talepleri",
  },
  {
    path: "/admin/orders",
    icon: "bx bx-shopping-bag",
    label: "Siparişler",
  },
  {
    path: "/admin/campaigns",
    icon: "bx bx-gift",
    label: "Kampanyalar",
  },
  {
    path: "/admin/affiliates",
    icon: "bx bx-link",
    label: "Affiliate Yönetimi",
  },
  // {
  //   path: "/admin/customers",
  //   icon: "bx bx-universal-access",
  //   label: "Kullanıcılar",
  // },

  {
    path: "/admin/reports",
    icon: "bx bx-bar-chart",
    label: "Ürün Raporları",
  },
  {
    path: "/admin/seo",
    icon: "bx bx-code",
    label: "SEO Yönetimi",
  },
  {
    path: "/admin/sitemap-items",
    icon: "bx bx-code",
    label: "Sitemap Item Yonetimi",
  },
  {
    path: "/admin/blogs",
    icon: "bx bx-book",
    label: "Blog Yönetimi",
  },
  {
    path: "/admin/settings",
    icon: "bx bx-cog",
    label: "Ayarlar",
  },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { userProfile } = useAuth();
  const { handleLogout, isPending } = useLogout();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="layout-wrapper layout-content-navbar">
      <div className="layout-container">
        {/* Sidebar */}
        <aside
          id="layout-menu"
          className="layout-menu menu-vertical menu bg-menu-theme"
          style={{ width: "260px", flexShrink: 0 }}
        >
          <div
            className="app-brand demo d-flex align-items-center justify-content-center"
            style={{ height: "60px" }}
          >
            <Link href="/admin" className="app-brand-link">
              <span
                className="app-brand-logo demo"
                style={{
                  width: "30px",
                  height: "30px",
                }}
              >
                <Image
                  src={"/assets/admin/img/logo/happncodelogo.png"}
                  alt="Nors Admin"
                  width={0}
                  height={0}
                  style={{ width: "100%", height: "100%" }}
                />
              </span>
            </Link>
          </div>
          <ul className="menu-inner py-1">
            {menuItems.map((item) => (
              <li
                key={item.path}
                className={`menu-item ${router.pathname === item.path ? "active open" : ""
                  }`}
              >
                <Link href={item.path} className="menu-link">
                  <i className={`menu-icon tf-icons ${item.icon}`}></i>
                  <div data-i18n={item.label}>{item.label}</div>
                </Link>
              </li>
            ))}
          </ul>
        </aside>

        {/* Content */}
        <div
          className="layout-page"
          style={{ flex: "1 1 auto", width: "calc(100% - 260px)" }}
        >
          <nav
            className="layout-navbar container-fluid navbar navbar-expand-xl navbar-detached align-items-center bg-navbar-theme"
            id="layout-navbar"
          >
            <div className="layout-menu-toggle navbar-nav align-items-xl-center me-3 me-xl-0 d-xl-none">
              <button
                className="nav-item nav-link px-0 me-xl-4"
                onClick={() => setIsSidebarOpen(true)}
              >
                <i className="bx bx-menu bx-sm"></i>
              </button>
            </div>

            <div className="navbar-nav align-items-center flex-grow-1">
              <div className="nav-item d-flex align-items-center w-px-400">
                <i className="bx bx-search fs-4 lh-0 me-2"></i>
                <input
                  type="text"
                  className="form-control border-0 shadow-none"
                  placeholder="Ara..."
                  aria-label="Ara..."
                />
              </div>
            </div>

            <div
              className="navbar-nav-right d-flex align-items-center"
              id="navbar-collapse"
            >
              <ul className="navbar-nav flex-row align-items-center ms-auto">
                {/* Notifications */}
                <li className="nav-item dropdown-notifications navbar-dropdown dropdown me-3">
                  <a
                    className="nav-link dropdown-toggle hide-arrow"
                    href="javascript:void(0);"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <i className="bx bx-bell bx-sm"></i>
                  </a>
                  <ul className="dropdown-menu dropdown-menu-end py-0">
                    <li className="dropdown-menu-header border-bottom">
                      <div className="dropdown-header d-flex align-items-center py-3">
                        <h5 className="text-body mb-0 me-auto">Bildirimler</h5>
                        <a
                          href="#"
                          className="dropdown-notifications-all text-body"
                          data-bs-toggle="tooltip"
                          data-bs-placement="top"
                          title="Tümünü okundu olarak işaretle"
                        >
                          <i className="bx fs-4 bx-envelope-open"></i>
                        </a>
                      </div>
                    </li>
                    <li className="dropdown-notifications-list scrollable-container">
                      <ul className="list-group list-group-flush">
                        <li className="list-group-item list-group-item-action dropdown-notifications-item">
                          <div className="d-flex">
                            <div className="flex-shrink-0 me-3">
                              <div className="avatar">
                                <span className="avatar-initial rounded-circle bg-label-danger">
                                  <i className="bx bx-cart"></i>
                                </span>
                              </div>
                            </div>
                            <div className="flex-grow-1">
                              <h6 className="mb-1">Yeni sipariş alındı</h6>
                              <p className="mb-0">
                                Yeni bir sipariş oluşturuldu
                              </p>
                              <small className="text-muted">1 saat önce</small>
                            </div>
                          </div>
                        </li>
                      </ul>
                    </li>
                    <li className="dropdown-menu-footer border-top">
                      <a
                        href="#"
                        className="dropdown-item d-flex justify-content-center p-3"
                      >
                        Tüm bildirimleri görüntüle
                      </a>
                    </li>
                  </ul>
                </li>
                {/* User */}
                <li className="nav-item navbar-dropdown dropdown-user dropdown">
                  <a
                    className="nav-link dropdown-toggle hide-arrow d-flex align-items-center"
                    href="javascript:void(0);"
                    data-bs-toggle="dropdown"
                  >
                    <div className="avatar avatar-online me-2">
                      <Image
                        src="https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg"
                        alt="User Avatar"
                        className="rounded-circle"
                        width={40}
                        height={40}
                      />
                    </div>
                    <div className="flex-grow-1">
                      <span className="fw-semibold d-block">
                        {userProfile?.applicationUser?.firstName ||
                          "Admin Kullanıcı"}
                      </span>
                      <small className="text-muted">Admin</small>
                    </div>
                  </a>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li>
                      <a className="dropdown-item" href="#">
                        <div className="d-flex">
                          <div className="avatar avatar-online me-2">
                            <Image
                              src="https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg"
                              alt="User Avatar"
                              className="rounded-circle"
                              width={40}
                              height={40}
                            />
                          </div>
                          <div className="flex-grow-1">
                            <span className="fw-semibold d-block">
                              {userProfile?.applicationUser?.firstName ||
                                "Admin Kullanıcı"}
                            </span>
                            <small className="text-muted">Admin</small>
                          </div>
                        </div>
                      </a>
                    </li>
                    <li>
                      <div className="dropdown-divider"></div>
                    </li>
                    <li>
                      <a
                        className="dropdown-item text-danger"
                        href="#"
                        onClick={handleLogout}
                      >
                        <i className="bx bx-power-off me-2"></i>
                        <span className="align-middle">Çıkış Yap</span>
                      </a>
                    </li>
                  </ul>
                </li>
                {/* /User */}
              </ul>
            </div>
          </nav>

          <div className="content-wrapper">
            <div className="container-fluid flex-grow-1 container-p-y">
              <main>{children}</main>
            </div>

            <footer className="content-footer footer bg-footer-theme">
              <div className="container-fluid d-flex flex-wrap justify-content-between py-2 flex-md-row flex-column">
                <div className="mb-2 mb-md-0">
                  © {new Date().getFullYear()}, Nors Admin Panel
                </div>
              </div>
            </footer>
          </div>
        </div>
      </div>

      {/* Mobil Menü */}
      {isMounted && (
        <AdminMobileMenu
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          menuItems={menuItems}
          userProfile={userProfile}
        />
      )}
    </div>
  );
}
