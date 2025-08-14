import { useAuth } from "@/hooks/context/useAuth";
import { useLogout } from "@/hooks/services/useLogout";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactNode } from "react";
import NotFound from "@/pages/404";
import { useLanguage } from "@/context/LanguageContext";

interface ProfileLayoutProps {
  children: ReactNode;
}

function ProfileLayout({ children }: ProfileLayoutProps) {
  const { userProfile } = useAuth();
  const router = useRouter();
  const { handleLogout, isPending } = useLogout();
  const { t } = useLanguage();

  if (!userProfile) return <NotFound />;

  const navItemStyle = {
    userSelect: "none" as const,
    cursor: "pointer",
  };

  const navLinks = [
    { href: "/profile", label: t("profile.myAccount") },
    { href: "/profile/orders", label: t("orders.myOrders") },
    { href: "/profile/addresses", label: t("myAddresses.myAddress") },
    { href: "/profile/cards", label: t("myCards.myCards") },
    { href: "/profile/reviews", label: t("myReviews.myReviewsTitle") },
    { href: "/shopping-cart", label: t("shoppingCart.myShoppingCart") },
    { href: "/favorites", label: t("favorites.myFavorites") },
    { href: "/profile/affiliate", label: "Affiliate" },
    { href: "/profile/returns", label: t("returnsPage.myReturns") },
    { href: "/profile/support-tickets", label: t("supportTicketsPage.myTickets") },
    { href: "/logout", label: t("logOut") },
  ];

  return (
    <main className="main">
      {/* Page Title */}
      <div className="tf-page-title">
        <div className="container-full">
          <div className="heading text-center">{t("profile.myAccount")}</div>
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
               