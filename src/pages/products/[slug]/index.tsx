import ReviewForm from "@/components/product-detail/ReviewForm";
import FullscreenGallery from "@/components/product/FullscreenGallery";
import VideoThumbnail from "@/components/product/VideoThumbnail";
import PageLoadingAnimation from "@/components/shared/PageLoadingAnimation";
import SEOHead from "@/components/SEO/SEOHead";
import { GetStaticProps, GetStaticPaths } from "next";
import { DtoReview } from "@/constants/models/Review";
import { UpdatedReview } from "@/constants/models/UpdatedReview";
import { useCart } from "@/hooks/context/useCart";
import { useFavorites } from "@/hooks/context/useFavorites";
import { useGetProductBySlug } from "@/hooks/services/products/useGetProductBySlug";
import { useProductDetail } from "@/hooks/services/products/useProductDetail";
import { useAddReview } from "@/hooks/services/reviews/useAddReview";
import { useDeleteReview } from "@/hooks/services/reviews/useDeleteReview";
import { useGetReviews } from "@/hooks/services/reviews/useGetReviews";
import { useUpdateReview } from "@/hooks/services/reviews/useUpdateReview";
import { useGetDiscountList } from "@/hooks/services/discounts/useGetDiscountList";
import { DiscountType } from "@/constants/enums/DiscountType";
import BundleProducts from "@/components/product/BundleProducts";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import ProductGallery from "@/components/product-detail/ProductGallery";
import ProductDetails from "@/components/product-detail/ProductDetails";
import AccordionSection from "@/components/product-detail/AccordionSection";
import PeopleAlsoBought from "@/components/product-detail/PeopleAlsoBought";
import { useLanguage } from "@/context/LanguageContext";
import { useGetProductRatings } from "@/hooks/services/settings";
import { GET_ALL_PRODUCTS, GET_PRODUCT_BY_ID, GET_PRODUCT_BY_SLUG } from "@/constants/links";

// Removed utility imports - using simplified discount structure

interface ExtendedProductDetail {
  images?: string[];
  colors?: string[];
  sizes?: string[];
  features?: string[];
  categories?: string[];
  banner?: string[];
}

// SEO interface for product detail
interface ProductDetailSEOData {
  id?: string;
  title?: string;
  description?: string;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string;
  canonical?: string;
  ogImageUrl?: string;
}

interface ProductDetailProps {
  seoData?: ProductDetailSEOData;
  seoId: string | null;
  slug: string;
}

const isUuid = (value: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value
  );

const ProductDetailPage = ({ seoId, slug: initialSlug }: ProductDetailProps) => {
  const { t } = useLanguage();
  const router = useRouter();
  const slugValue = (router.query.slug as string) || initialSlug || "";
  const slugIsUuid = slugValue ? isUuid(slugValue) : false;
  const { addToCart, addLoading: isAddingToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  // Product ratings ayarını kontrol et
  const { isRatingEnabled } = useGetProductRatings();

  const {
    product: productById,
    isLoading: isLoadingById,
    error: errorById,
  } = useProductDetail(slugIsUuid ? slugValue : undefined);
  const {
    data: productBySlug,
    isLoading: isLoadingBySlug,
    error: errorBySlug,
  } = useGetProductBySlug({
    slug: slugIsUuid ? "" : slugValue,
    enabled: !slugIsUuid,
  });

  const product = slugIsUuid ? productById : productBySlug;
  const productId = product?.id || (slugIsUuid ? slugValue : "");
  const isLoading = slugIsUuid ? isLoadingById : isLoadingBySlug;
  const error = slugIsUuid ? errorById : errorBySlug;

  const {
    reviews,
    isLoading: isLoadingReviews,
    error: errorReviews,
  } = useGetReviews({ productId });
  const { addReview, isPending } = useAddReview();
  const { updateReview, isPending: isUpdating } = useUpdateReview();
  const { deleteReview, isPending: isDeleting } = useDeleteReview();

  // Bundle discount hooks
  const { discounts: bundleDiscounts } = useGetDiscountList({
    discountType: DiscountType.Bundle,
    isActive: true,
    pageSize: 10,
  });

  // Extract product IDs from bundle discounts
  const bundleProductIds =
    bundleDiscounts
      ?.filter((discount) => {
        // Check bundleDiscount.bundleDiscountProducts structure
        const productIds =
          discount.bundleDiscount?.productIds ||
          (discount.bundleDiscount as any)?.bundleDiscountProducts?.map(
            (p: any) => p.productId
          ) ||
          [];
        return productIds.includes(productId as string);
      })
      ?.flatMap((discount) => {
        // Extract product IDs from bundleDiscount.bundleDiscountProducts
        const productIds =
          discount.bundleDiscount?.productIds ||
          (discount.bundleDiscount as any)?.bundleDiscountProducts?.map(
            (p: any) => p.productId
          ) ||
          [];
        return productIds;
      })
      ?.filter(
        (id, index, arr) => arr.indexOf(id) === index && id !== productId
      ) || // Remove duplicates and current product
    [];

  const [newReview, setNewReview] = useState({
    $id: "",
    id: "",
    customerId: "",
    customerName: "",
    title: "",
    content: "",
    rating: 0,
    imageUrl: "",
    productId: productId,
    comment: "",
    modifiedValue: "",
  });

  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [sortedReviews, setSortedReviews] = useState(reviews);
  const [activeTab, setActiveTab] = useState("reviews");
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const {
    addToFavorites,
    removeFromFavorites,
    isInFavorites,
    isLoading: isFavoritesLoading,
  } = useFavorites();
  // Ürün verilerini genişletilmiş tip ile birleştir
  const extendedProduct = product as typeof product & ExtendedProductDetail;

  // Galeri için yeni state'ler
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [initialSlide, setInitialSlide] = useState(0);

  // Review image modal için state'ler
  const [isReviewImageModalOpen, setIsReviewImageModalOpen] = useState(false);
  const [selectedReviewImage, setSelectedReviewImage] = useState<string | null>(
    null
  );

  // Açıklama expand/collapse state'i
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  // Tüm ürün görsellerini birleştiren yardımcı fonksiyon
  const getAllProductMedia = () => {
    const media: { url: string; type: "image" | "video" }[] = [];

    if (product?.baseImageUrl)
      media.push({ url: product.baseImageUrl, type: "image" });

    if (Array.isArray(product?.banner)) {
      media.push(
        ...product.banner.map((url) => ({ url, type: "image" as const }))
      );
    }

    if (Array.isArray(product?.contentImageUrls)) {
      media.push(
        ...product.contentImageUrls.map((url) => ({
          url,
          type: "image" as const,
        }))
      );
    }

    if (product?.videoUrl) {
      media.push({ url: product.videoUrl, type: "video" });
    }

    return media;
  };

  // Görsel tıklama handler'ı
  const handleImageClick = (index: number) => {
    setInitialSlide(index);
    setIsGalleryOpen(true);
  };

  // Review image tıklama handler'ı
  const handleReviewImageClick = (imageUrl: string) => {
    setSelectedReviewImage(imageUrl);
    setIsReviewImageModalOpen(true);
  };

  // productId değiştiğinde state'leri sıfırla
  useEffect(() => {
    if (productId) {
      setNewReview({
        $id: "",
        id: "",
        customerId: "",
        customerName: "",
        title: "",
        content: "",
        rating: 0,
        imageUrl: "",
        productId: productId,
        comment: "",
        modifiedValue: "",
      });
      setQuantity(1);
      setActiveTab("reviews");
      setEditingReviewId(null);
      setSortOrder("desc");
    }
  }, [productId]);

  useEffect(() => {
    if (reviews) {
      const sorted = [...reviews].sort((a, b) => {
        if (sortOrder === "desc") {
          return b.rating - a.rating;
        } else {
          return a.rating - b.rating;
        }
      });
      setSortedReviews(sorted);
    }
  }, [reviews, sortOrder]);

  useEffect(() => {
    if (reviews) {
      setNewReview((prev) => ({ ...prev, comment: reviews[0]?.content || "" }));
    }
  }, [reviews]);

  const handleReviewSubmit = async (review: typeof newReview) => {
    try {
      await addReview(review as DtoReview);
      setNewReview({
        $id: "",
        id: "",
        customerId: "",
        customerName: "",
        title: "",
        content: "",
        rating: 0,
        imageUrl: "",
        productId: productId as string,
        comment: "",
        modifiedValue: "",
      });
    } catch (err) {
      console.error("Yorum eklenirken hata oluştu:", err);
    }
  };

  const handleUpdateReview = async (updatedReview: UpdatedReview) => {
    try {
      const existingReview = reviews.find((r) => r.id === updatedReview.id);

      if (!existingReview) {
        throw new Error("Review not found");
      }

      const fullReview = {
        ...existingReview,
        ...updatedReview,
        customerId: existingReview.customerId || "",
        productId: existingReview.productId || "",
        comment: existingReview.comment || "",
      };

      await updateReview(fullReview);
      setEditingReviewId(null);
      toast.success(t("productDetail.errors.reviewUpdatedSuccess"));
    } catch (error) {
      console.error("Error updating review:", error);
      toast.error(t("productDetail.errors.reviewUpdateError"));
    }
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOrder(event.target.value as "asc" | "desc");
  };

  const handleAddToCart = async () => {
    if (!product) return;

    try {
      await addToCart(product.id, quantity);
    } catch (error) {
      toast.error(t("productDetail.errors.addToCartError"));
    }
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  const handleToggleFavorite = async () => {
    if (!product || isFavoritesLoading) return;

    try {
      if (isInFavorites(product.id)) {
        await removeFromFavorites(product.id);
      } else {
        await addToFavorites(product.id);
      }
    } catch (error) {
      toast.error(t("productDetail.errors.favoriteError"));
    }
  };

  if (isLoading) {
    return <PageLoadingAnimation />;
  }

  if (error) {
    return (
      <div className="text-center py-5 mt-15 mb-15">
        <h4>{t("productDetail.errors.productNotFound")}</h4>
        <p className="text-muted">
          {t("productDetail.errors.noProductsFound")}
        </p>
      </div>
    );
  }

  if (!product) {
    return <div>{t("productDetail.errors.productNotFound")}</div>;
  }

  // Yıldız derecelendirmesi için yardımcı fonksiyon
  const getRatingPercentage = (rating: number) => {
    return (rating / 5) * 100;
  };

  const averageRating =
    reviews && reviews.length > 0
      ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
      : 0;

  return (
    <>
      {seoId && <SEOHead seoId={seoId} />}
      <main className="main">
        {/*   NAVBAR  */}
        <nav aria-label="breadcrumb" className="tf-breadcrumb">
          <div className="container">
            <div className="tf-breadcrumb-wrap d-flex justify-content-between flex-wrap align-items-center">
              <div className="tf-breadcrumb-list">
                {/* <Link href="/" className="text">
                  {t("productDetail.breadcrumb.home")}
                </Link> */}
                {/* <i className="icon icon-arrow-right"></i> */}
                <Link href="/products" className="text">
                  {t("productDetail.breadcrumb.products")}
                </Link>
                <i className="icon icon-arrow-right"></i>
                <span className="text">{product.title}</span>
              </div>
              {/* <div className="tf-breadcrumb-prev-next">
                <a href="#" className="tf-breadcrumb-prev hover-tooltip center">
                  <i className="icon icon-arrow-left"></i>
                </a>
                <a href="#" className="tf-breadcrumb-back hover-tooltip center">
                  <i className="icon icon-shop"></i>
                </a>
                <a href="#" className="tf-breadcrumb-next hover-tooltip center">
                  <i className="icon icon-arrow-right"></i>
                </a>
              </div> */}
            </div>
          </div>
        </nav>
        {/* PAGE CONTENT */}
        <div className="page-content">
          <div className="container">
            <div className="product-details-top">
              <div className="row">
                <div className="col-md-6">
                  <ProductGallery
                    product={product}
                    getAllProductMedia={getAllProductMedia}
                  />
                </div>

                <div className="col-md-6">
                  <ProductDetails
                    product={product}
                    reviews={reviews}
                    averageRating={averageRating}
                    quantity={quantity}
                    setQuantity={setQuantity}
                    handleAddToCart={handleAddToCart}
                    handleToggleFavorite={handleToggleFavorite}
                    isAddingToCart={isAddingToCart}
                    isInFavorites={isInFavorites}
                    isFavoritesLoading={isFavoritesLoading}
                    isRatingEnabled={isRatingEnabled}
                  />
                </div>
              </div>
            </div>

            {/* Bundle Discount Products */}
            {(() => {
              if (!bundleDiscounts || bundleDiscounts.length === 0) {
                return null;
              }

              const filteredDiscounts = bundleDiscounts.filter((discount) => {
                // Bundle discount object'i yoksa atla
                if (!discount.bundleDiscount) {
                  return false;
                }

                // Product IDs'leri farklı kaynaklardan al
                let productIds = [];

                if (
                  discount.bundleDiscount.productIds &&
                  Array.isArray(discount.bundleDiscount.productIds)
                ) {
                  productIds = discount.bundleDiscount.productIds;
                } else if (
                  (discount.bundleDiscount as any)?.bundleDiscountProducts
                ) {
                  productIds = (
                    discount.bundleDiscount as any
                  ).bundleDiscountProducts.map((p: any) => p.productId);
                } else {
                  return false;
                }

                return productIds.includes(productId as string);
              });

              if (filteredDiscounts.length === 0) {
                return null;
              }
              return (
                <div style={{ marginTop: "2rem" }}>
                  {" "}
                  {/* Added spacing above the bundle section */}
                  <BundleProducts
                    bundleDiscounts={filteredDiscounts.map(
                      (d) => d.bundleDiscount as any
                    )}
                    currentProductId={productId as string}
                  />
                </div>
              );
            })()}
            <div className="product-details-tab">
              <AccordionSection product={product} />
              <PeopleAlsoBought
                categoryId={product?.subCategoryId}
                currentProductId={productId as string}
              />
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

// getStaticPaths - Hangi ürün sayfalarının pre-render edileceğini belirler
export const getStaticPaths: GetStaticPaths = async () => {
  try {
    // Slug'ı olan ürünlerin path'lerini oluştur
    const response = await fetch(
      `${GET_ALL_PRODUCTS}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          page: 0,
          pageSize: 100,
          mainCategoryIds: [],
          subCategoryIds: [],
          search: "",
          discountSort: 0,
          ratingSort: 0,
          salesCountSort: 0,
          likeCountSort: 0,
        }),
      }
    );

    if (response.ok) {
      const result = await response.json();
      const items = result?.data?.items || result?.items || [];
      const paths =
        items
          .filter((product: any) => product?.seo?.slug || product?.id)
          .map((product: any) => ({
            params: { slug: product?.seo?.slug || product.id.toString() },
          })) || [];

      return {
        paths,
        fallback: "blocking", // Yeni ürünler için ISR kullan
      };
    }
  } catch (error) {
    console.error("Product paths alınamadı:", error);
  }

  return {
    paths: [],
    fallback: "blocking",
  };
};

// getStaticProps - Ürün detay sayfası SEO verilerini çeker
export const getStaticProps: GetStaticProps<ProductDetailProps> = async ({
  params,
}) => {
  const slug = params?.slug as string;

  if (!slug) {
    return { notFound: true };
  }

  try {
    // UUID kontrolü - slug UUID ise ID olarak kullan
    const slugIsUuid = isUuid(slug);
    
    // API'den product detayını çek
    const productUrl = slugIsUuid
      ? `${GET_PRODUCT_BY_ID}?id=${slug}`
      : `${GET_PRODUCT_BY_SLUG}?Slug=${encodeURIComponent(slug)}`;

    const productResponse = await fetch(productUrl);

    if (!productResponse.ok) {
      return { notFound: true };
    }

    const responseJson = await productResponse.json();
    const product = responseJson?.data || responseJson;

    if (!product || !product.id) {
      return { notFound: true };
    }

    return {
      props: {
        seoId: product?.seoId || null,
        slug: slug, // slug her zaman string olacak, undefined olmayacak
      },
      revalidate: 120, // 2 dakikada bir ISR ile yenile
    };
  } catch (error) {
    console.error("Product detail SEO verisi alınamadı:", error);
    return { notFound: true };
  }
};

export default ProductDetailPage;
