/* eslint-disable @typescript-eslint/no-explicit-any */
import CategoryBasedCollection from "@/components/affiliate/collection-url-page/CategoryBasedCollection";
import CollectionBasedCollection from "@/components/affiliate/collection-url-page/CollectionBasedCollection";
import CombinationBasedCollection from "@/components/affiliate/collection-url-page/CombinationBasedCollection";
import ProductBasedCollection from "@/components/affiliate/collection-url-page/ProductBasedCollection";
import { AffiliateCollectionType } from "@/constants/enums/affiliate/AffiliateCollectionType";
import {
  CategoryBasedAffiliateItem,
  CollectionBasedAffiliateItem,
  CombinationBasedAffiliateItem,
  ProductBasedAffiliateItem,
} from "@/constants/models/Affiliate";
import { useCart } from "@/hooks/context/useCart";
import { useGetCollectionDetail } from "@/hooks/services/affiliate/useGetCollectionDetail";
import { useActiveCollectionCookie } from "@/hooks/useActiveCollectionCookie";
import { useParams } from "next/navigation";
import { toast } from "react-hot-toast";

function AffiliateCollectionPage() {
  const params = useParams();
  const { activeCollection, deleteActiveCollection } =
    useActiveCollectionCookie();
  const { clearCart } = useCart();
  const collectionId = params?.collectionId
    ? Array.isArray(params.collectionId)
      ? params.collectionId[0]
      : params.collectionId
    : null;
  const { collectionDetail, isLoading, error } = useGetCollectionDetail(
    collectionId || ""
  );

  const handleClearCartAndCollection = () => {
    clearCart();
    deleteActiveCollection();
    toast.success("Sepet ve koleksiyon temizlendi");
  };

  // params null veya collectionId yoksa
  if (!params || !("collectionId" in params)) {
    return (
      <main className="main">
        <div className="container py-5 text-center">
          <h2 className="text-danger">Koleksiyon bulunamadı</h2>
          <p>Lütfen geçerli bir koleksiyon linki ile tekrar deneyin.</p>
        </div>
      </main>
    );
  }

  if (!collectionId) {
    return (
      <main className="main">
        <div className="container py-5 text-center">
          <h2 className="text-danger">Koleksiyon bulunamadı</h2>
          <p>Lütfen geçerli bir koleksiyon linki ile tekrar deneyin.</p>
        </div>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="main">
        <div className="container py-5 text-center">
          <div className="spinner-border text-primary" role="status"></div>
          <span className="visually-hidden">Yükleniyor...</span>
        </div>
      </main>
    );
  }

  if (error || !collectionDetail) {
    return (
      <main className="main">
        <div className="container py-5 text-center">
          <h2 className="text-danger">Koleksiyon bulunamadı</h2>
          <p>Lütfen geçerli bir koleksiyon linki ile tekrar deneyin.</p>
        </div>
      </main>
    );
  }

  if (!collectionDetail.isActive) {
    return (
      <main className="main">
        <div className="container py-5 text-center">
          <h2 className="text-danger">Koleksiyon bulunamadı</h2>
          <p>Lütfen geçerli bir koleksiyon linki ile tekrar deneyin.</p>
        </div>
      </main>
    );
  }

  // Hangi ürün dizisi doluysa onu bul (any ile erişim)
  let items:
    | ProductBasedAffiliateItem[]
    | CombinationBasedAffiliateItem[]
    | CategoryBasedAffiliateItem[]
    | CollectionBasedAffiliateItem[] = [];
  let itemType: AffiliateCollectionType = AffiliateCollectionType.ProductBased;
  if (
    collectionDetail.productBasedAffiliateItems &&
    collectionDetail.productBasedAffiliateItems.length > 0
  ) {
    items = collectionDetail.productBasedAffiliateItems;
    itemType = AffiliateCollectionType.ProductBased;
  } else if (
    collectionDetail.combinationBasedAffiliateItems &&
    collectionDetail.combinationBasedAffiliateItems.length > 0
  ) {
    items = collectionDetail.combinationBasedAffiliateItems;
    itemType = AffiliateCollectionType.CombinationBased;
  } else if (
    collectionDetail.categoryBasedAffiliateItems &&
    collectionDetail.categoryBasedAffiliateItems.length > 0
  ) {
    items = collectionDetail.categoryBasedAffiliateItems;
    itemType = AffiliateCollectionType.CategoryBased;
  } else if (
    collectionDetail.collectionBasedAffiliateItems &&
    collectionDetail.collectionBasedAffiliateItems.length > 0
  ) {
    items = collectionDetail.collectionBasedAffiliateItems;
    itemType = AffiliateCollectionType.CollectionBased;
  }

  const hasCollectionConflict =
    activeCollection && activeCollection.collectionId !== collectionId;

  return (
    <main className="main">
      <nav aria-label="breadcrumb" className="breadcrumb-nav">
        <div className="container">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="/">Anasayfa</a>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Koleksiyon Detayı
            </li>
          </ol>
        </div>
      </nav>
      <div className="page-content pb-3">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              {hasCollectionConflict && (
                <div className="alert alert-warning mb-4" role="alert">
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                      <i className="bx bx-error-circle me-2 px-2"></i>
                      <span>
                        Başka bir koleksiyondan ürünleriniz var. Aynı anda tek
                        bir koleksiyon ile işlem yapabilirsiniz.
                      </span>
                    </div>
                    <button
                      className="btn btn-warning"
                      onClick={handleClearCartAndCollection}
                    >
                      <i className="bx bx-trash me-1"></i>
                      Sepeti Temizle
                    </button>
                  </div>
                </div>
              )}

              <div className="card shadow-sm border-0 mb-4">
                <div className="card-body p-4">
                  <h2 className="mb-3 text-primary fw-bold">{collectionDetail.name}</h2>
                  <p className="mb-4 text-muted">{collectionDetail.description}</p>

                  <div className="row mb-4 align-items-center">
                    {/* URL metni */}
                    <div
                      className="col-md-8"
                      onClick={() => {
                        navigator.clipboard.writeText(collectionDetail.url);
                        toast.success("URL kopyalandı!");
                      }}
                      style={{
                        cursor: "pointer",
                        padding: "8px",
                        borderRadius: "4px",
                      }}
                    >
                      <strong>URL:</strong>{" "}
                      <span className="text-secondary" style={{ wordBreak: "break-all" }}>
                        {collectionDetail.url}
                      </span>
                    </div>

                    {/* Kopyala ikonu butonu */}
                    <div className="col-md-4 d-flex justify-content-end pe-3">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(collectionDetail.url);
                          toast.success("URL kopyalandı!");
                        }}
                        className="btn"
                        style={{
                          backgroundColor: "black",
                          color: "white",
                          borderRadius: "8px",
                          padding: "10px 14px",
                          border: "none",
                          fontSize: "1rem",
                          lineHeight: "1.2",
                          transition: "background-color 0.3s ease",
                        }}

                        onMouseOver={(e) =>
                          (e.currentTarget.style.backgroundColor = "gray")
                        }
                        onMouseOut={(e) =>
                          (e.currentTarget.style.backgroundColor = "black")
                        }
                      >
                        <i className="bx bx-copy" style={{ fontSize: "1.2rem" }}></i>
                      </button>
                    </div>
                  </div>



                  <hr />
                  <h5 className="fw-semibold mb-3">
                    {itemType === AffiliateCollectionType.ProductBased &&
                      "Koleksiyon Ürünleri"}
                    {itemType === AffiliateCollectionType.CombinationBased &&
                      "Kombinasyon Ürünleri"}
                    {itemType === AffiliateCollectionType.CategoryBased &&
                      "Kategori Ürünleri"}
                    {itemType === AffiliateCollectionType.CollectionBased &&
                      "Alt Koleksiyon Ürünleri"}
                  </h5>

                  {itemType === AffiliateCollectionType.ProductBased && (
                    <ProductBasedCollection
                      productBasedAffiliateItems={
                        items as ProductBasedAffiliateItem[]
                      }
                    />
                  )}
                  {itemType === AffiliateCollectionType.CategoryBased && (
                    <CategoryBasedCollection
                      categoryBasedAffiliateItems={
                        items as CategoryBasedAffiliateItem[]
                      }
                    />
                  )}
                  {itemType === AffiliateCollectionType.CombinationBased && (
                    <CombinationBasedCollection
                      combinationBasedAffiliateItems={
                        items as CombinationBasedAffiliateItem[]
                      }
                    />
                  )}
                  {itemType === AffiliateCollectionType.CollectionBased && (
                    <CollectionBasedCollection
                      collectionBasedAffiliateItems={
                        items as CollectionBasedAffiliateItem[]
                      }
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main >
  );
}

export default AffiliateCollectionPage;
