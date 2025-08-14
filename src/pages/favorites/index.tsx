import PageLoadingAnimation from "@/components/shared/PageLoadingAnimation";
import { useAuth } from "@/hooks/context/useAuth";
import { useCart } from "@/hooks/context/useCart";
import { useFavorites } from "@/hooks/context/useFavorites";
import ProductCard from "@/components/home/ProductCard";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

function FavoritesPage() {
  const { t } = useLanguage();
  const { userProfile } = useAuth();
  const {
    favorites,
    isLoading: favoritesLoading,
  } = useFavorites();

  if (favoritesLoading) {
    return <PageLoadingAnimation />;
  }

  const EmptyFavorites = () => (
    <div className="py-5 text-center">
      <div className="container">
        <i className="icon-heart-o display-1 text-muted mb-4"></i>
        <h3 className="mb-3">{t("favorites.emptyFavoritesTitle")}</h3>
        <p className="mb-4">
          {t("favorites.emptyFavoritesMessage")}
        </p>
        <Link href="/" className="tf-btn w-100 radius-3 btn-fill animate-hover-btn justify-content-center">
          <span>{t("favorites.startShoppingButton")}</span>
          <i className="icon-long-arrow-right ml-2"></i>
        </Link>
      </div>
    </div>
  );

  return (
    <main className="main">

      {/* page-title */}
      <div className="tf-page-title">
        <div className="container-full">
          <div className="heading text-center">{t("favorites.breadcrumbFavorites")}</div>
        </div>
      </div>
      {/* /page-title */}
      {/* Breadcrumb */}
      <div className="tf-breadcrumb">
        <div className="container">
          <div className="tf-breadcrumb-wrap d-flex justify-content-between flex-wrap align-items-center">
            <div className="tf-breadcrumb-list">
              <Link href="/" className="text">
                {t("home")}
              </Link>
              <i className="icon icon-arrow-right"></i>
              <span className="text">{t("favorites.breadcrumbFavorites")}</span>
            </div>
          </div>
        </div>
      </div>
      {/* /Breadcrumb */}

      {!favorites || favorites.length === 0 ? (
        <div className="products mb-3">
          <div className="row">
            <div className="col-12 d-flex justify-content-center align-items-center">
              <EmptyFavorites />
            </div>
          </div>
        </div>
      ) : (
        <section className="flat-spacing-2">
          <div className="container">
            <div className="grid-layout wrapper-shop" data-grid="grid-4">
              {favorites.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

export default FavoritesPage;