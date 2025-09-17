import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

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

interface AdminMobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
    menuItems: MenuItem[];
    userProfile: any;
}

const AdminMobileMenu: React.FC<AdminMobileMenuProps> = ({
    isOpen,
    onClose,
    menuItems,
    userProfile,
}) => {
    const router = useRouter();
    const [openMenus, setOpenMenus] = useState<string[]>([]);

    // Menü açıkken body scrollunu engelleme
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    // Initialize open menus based on current route
    useEffect(() => {
        const currentPath = router.pathname;
        const menusToOpen: string[] = [];
        
        menuItems.forEach((item) => {
            if (item.subItems) {
                const hasActiveSubItem = item.subItems.some(subItem => currentPath === subItem.path);
                if (hasActiveSubItem) {
                    menusToOpen.push(item.path);
                }
            }
        });
        
        setOpenMenus(menusToOpen);
    }, [router.pathname, menuItems]);

    const toggleMenu = (itemPath: string) => {
        setOpenMenus(prev => 
            prev.includes(itemPath)
                ? prev.filter(path => path !== itemPath)
                : [...prev, itemPath]
        );
    };

    return (
        <div className={`admin-mobile-menu-container ${isOpen ? 'active' : ''}`}>
            <div className="admin-mobile-menu-overlay" onClick={onClose}></div>
            <div className="admin-mobile-menu-wrapper bg-menu-theme">
                <span className="admin-mobile-menu-close text-secondary" onClick={onClose}>
                    <i className="bx bx-x"></i>
                </span>

                <div className="app-brand demo d-flex align-items-center justify-content-center" style={{ height: "60px" }}>
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

                <div className="menu-inner-shadow"></div>

                <ul className="menu-inner py-1">
                    {menuItems.map((item) => (
                        <li
                            key={item.path}
                            className={`menu-item ${
                                item.subItems
                                    ? item.subItems.some(subItem => router.pathname === subItem.path)
                                        ? "active open"
                                        : openMenus.includes(item.path)
                                        ? "open"
                                        : ""
                                    : router.pathname === item.path
                                        ? "active open"
                                        : ""
                            }`}
                        >
                            {item.subItems ? (
                                <>
                                    <a 
                                        href="#" 
                                        className="menu-link menu-toggle"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            toggleMenu(item.path);
                                        }}
                                    >
                                        <i className={`menu-icon tf-icons ${item.icon}`}></i>
                                        <div>{item.label}</div>
                                    </a>
                                    <ul className="menu-sub">
                                        {item.subItems.map((subItem) => (
                                            <li
                                                key={subItem.path}
                                                className={`menu-item ${
                                                    router.pathname === subItem.path ? "active" : ""
                                                }`}
                                            >
                                                <Link
                                                    href={subItem.path}
                                                    className="menu-link"
                                                    onClick={() => {
                                                        onClose();
                                                    }}
                                                >
                                                    <div>{subItem.label}</div>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </>
                            ) : (
                                <Link
                                    href={item.path}
                                    className="menu-link"
                                    onClick={() => {
                                        onClose();
                                    }}
                                >
                                    <i className={`menu-icon tf-icons ${item.icon}`}></i>
                                    <div>{item.label}</div>
                                </Link>
                            )}
                        </li>
                    ))}
                </ul>
            </div>

            <style jsx global>{`
        .admin-mobile-menu-container {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 1080;
          background-color: rgba(0, 0, 0, 0);
          visibility: hidden;
          transition: background-color 0.3s, visibility 0.3s;
          
        }
        
        .admin-mobile-menu-container.active {
          background-color: rgba(0, 0, 0, 0.5);
          visibility: visible;
          
        }
        
        .admin-mobile-menu-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          cursor: pointer;
          
        }
        
        .admin-mobile-menu-wrapper {
          position: absolute;
          top: 0;
          left: -280px;
          width: 280px;
          height: 100%;
          overflow-y: auto;
          transition: left 0.3s;
          box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
          z-index: 1090;
          display: flex;
          flex-direction: column;
          height: 100%;
          background-color: black;
        }
        
        .admin-mobile-menu-container.active .admin-mobile-menu-wrapper {
          left: 0;
        }
        
        .admin-mobile-menu-close {
          position: absolute;
          top: 1rem;
          right: 1rem;
          font-size: 1.5rem;
          cursor: pointer;
          z-index: 10;
        }

        .admin-mobile-menu-wrapper .menu-inner {
          display: flex;
          flex-direction: column;
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .admin-mobile-menu-wrapper .menu-item {
          margin: 0;
          padding: 0;
        }

        .admin-mobile-menu-wrapper .menu-link {
          display: flex;
          align-items: center;
          padding: 0.625rem 1.25rem;
          color: #697a8d;
          text-decoration: none;
        }

        .admin-mobile-menu-wrapper .menu-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 0.5rem;
          width: 1.5rem;
          height: 1.5rem;
          font-size: 1.25rem;
        }

        .admin-mobile-menu-wrapper .menu-item.active .menu-link {
          color: #696cff;
          font-weight: 500;
        }

        .admin-mobile-menu-wrapper .menu-item.active .menu-icon {
          color: #696cff;
        }

        .admin-mobile-menu-wrapper .menu-sub {
          display: block;
          list-style: none;
          margin: 0;
          padding: 0;
          padding-left: 2rem;
        }

        .admin-mobile-menu-wrapper .menu-sub .menu-link {
          padding: 0.5rem 1.25rem;
          font-size: 0.9rem;
        }
      `}</style>
        </div>
    );
};

export default AdminMobileMenu; 