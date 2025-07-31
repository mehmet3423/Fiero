import { useAuth } from "@/hooks/context/useAuth";
import { useLogout } from "@/hooks/services/useLogout";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactNode } from "react";
import NotFound from "@/pages/404";

interface ProfileLayoutProps {
  children: ReactNode;
}

function ProfileLayout({ children }: ProfileLayoutProps) {
  const { userProfile } = useAuth();
  const router = useRouter();
  const { handleLogout, isPending } = useLogout();

  if (!userProfile) return <NotFound />;

  const navItemStyle = {
    userSelect: "none" as const,
    cursor: "pointer",
  };

  const navLinks = [
    { href: "/profile", label: "Profilim" },
    { href: "/profile/orders", label: "Siparişlerim" },
    { href: "/profile/addresses", label: "Adreslerim" },
    { href: "/profile/cards", label: "Kartlarım" },
    { href: "/profile/reviews", label: "Yorumlarım" },
    { href: "/shopping-cart", label: "Alışveriş Sepetim" },
    { href: "/favorites", label: "Favorilerim" },
    { href: "/profile/affiliate", label: "Affiliate" },
    { href: "/profile/returns", label: "İade Taleplerim" },
    { href: "/profile/support-tickets", label: "Destek Taleplerim" },
    { href: "/logout", label: "Çıkış Yap" },
  ];

  return (
    <main className="main">
      {/* Page Title */}
      <div className="tf-page-title">
        <div className="container-full">
          <div className="heading text-center">Hesabım</div>
        </div>
      </div>

      {/* Page Content */}
      <section className="flat-spacing-11">
        <div className="container">
          <div className="row">
            {/* Sidebar Navigation */}
            <div className="col-lg-3">
              <ul className="my-account-nav">
                {navLinks.map((item) => (
                  <li key={item.href}>
                    {item.href === "/logout" ? (
                      <button
                        onClick={handleLogout}
                        disabled={isPending}
                        className={`my-account-nav-item ${isPending ? "disabled" : ""
                          }`}
                      >
                        {isPending ? "Çıkış Yapılıyor..." : item.label}
                      </button>
                    ) : (
                      <Link
                        href={item.href}
                        className={`my-account-nav-item ${router.pathname === item.href ? "active" : ""
                          }`}
                      >
                        {item.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Main Content */}
            <div className="col-lg-9">
              <div className="my-account-content account-dashboard">
                {children}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export function withProfileLayout<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  return function WithProfileLayout(props: P) {
    return (
      <ProfileLayout>
        <WrappedComponent {...props} />
      </ProfileLayout>
    );
  };
}

export default ProfileLayout;
               