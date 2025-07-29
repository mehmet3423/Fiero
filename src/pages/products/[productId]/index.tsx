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
import ProductTabs from "@/components/product-detail/ProductTabs";
import AccordionSection from "@/components/product-detail/AccordionSection"; // Import AccordionSection
import PeopleAlsoBought from "@/components/product-detail/PeopleAlsoBought";
import RecentlyViewed from "@/components/product-detail/RecentlyViewed";

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
  productId: string;
}

const ProductDetailPage = ({ seoId }: { seoId: string }) => {
  const router = useRouter();
  const { productId } = router.query;
  const { addToCart, addLoading: isAddingToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const { product, isLoading, error } = useProductDetail(productId as string);

  const {
    reviews,
    isLoading: isLoadingReviews,
    error: errorReviews,
  } = useGetReviews(productId as string);
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
    productId: productId as string,
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
        productId: productId as string,
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
      toast.success("Review updated successfully!");
    } catch (error) {
      console.error("Error updating review:", error);
      toast.error("Failed to update review.");
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
      toast.error("Ürün sepete eklenirken bir hata oluştu");
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
      toast.error("İşlem sırasında bir hata oluştu");
    }
  };

  if (isLoading) {
    return <PageLoadingAnimation />;
  }

  if (error) {
    return (
      <div className="text-center py-5 mt-15 mb-15">
        <h4>Ürün bulunamadı</h4>
        <p className="text-muted">
          Arama kriterlerinize uygun ürün bulunmamaktadır.
        </p>
      </div>
    );
  }

  if (!product) {
    return <div>Ürün bulunamadı.</div>;
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
      {product?.seoId && <SEOHead seoId={product.seoId} />}
      <main className="main">
        {/*   NAVBAR  */}
        <nav aria-label="breadcrumb" className="tf-breadcrumb">
          <div className="container">
            <div className="tf-breadcrumb-wrap d-flex justify-content-between flex-wrap align-items-center">
              <div className="tf-breadcrumb-list">
                <Link href="/" className="text">Home</Link>
                <i className="icon icon-arrow-right"></i>
                <Link href="/products" className="text">Products</Link>
                <i className="icon icon-arrow-right"></i>
                <span className="text">{product.title}</span>
              </div>
              <div className="tf-breadcrumb-prev-next">
                <a href="#" className="tf-breadcrumb-prev hover-tooltip center">
                  <i className="icon icon-arrow-left"></i>
                </a>
                <a href="#" className="tf-breadcrumb-back hover-tooltip center">
                  <i className="icon icon-shop"></i>
                </a>
                <a href="#" className="tf-breadcrumb-next hover-tooltip center">
                  <i className="icon icon-arrow-right"></i>
                </a>
              </div>
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
                <div style={{ marginTop: "2rem" }}> {/* Added spacing above the bundle section */}
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
              <AccordionSection />
              <PeopleAlsoBought />
              <RecentlyViewed /> {/* Add this component here */}
              <ProductTabs
                activeTab={activeTab}
                handleTabChange={handleTabChange}
                reviews={reviews}
                sortedReviews={sortedReviews}
                sortOrder={sortOrder}
                handleSortChange={handleSortChange}
                handleReviewImageClick={handleReviewImageClick}
                handleReviewSubmit={handleReviewSubmit}
                getRatingPercentage={getRatingPercentage}
                extendedProduct={extendedProduct}
                productId={productId as string}
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
    // En popüler ürünlerin ID'lerini çek (performans için sadece ilk 100 ürün)
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/Product/GetAllProducts?Page=1&PageSize=100`
    );

    if (response.ok) {
      const data = await response.json();
      const paths =
        data.items?.map((product: any) => ({
          params: { productId: product.id.toString() },
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
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const productId = params?.productId as string;
  try {
    // API'den product detayını çek
    const productResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/Product/GetProductById?id=${productId}`
    );
    let product = null;
    if (productResponse.ok) {
      product = await productResponse.json();
    }
    return {
      props: {
        seoId: product?.seoId || null,
        productId,
      },
      revalidate: 120,
    };
  } catch (error) {
    console.error("Product detail SEO verisi alınamadı:", error);
  }
  return {
    props: {
      seoId: null,
      productId,
    },
    revalidate: 120,
  };
};

export default ProductDetailPage;