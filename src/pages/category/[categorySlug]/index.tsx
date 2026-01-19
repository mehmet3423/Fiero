import ProductCard from "@/components/home/ProductCard";
import SEOHead from "@/components/SEO/SEOHead";
import CirclePagination from "@/components/shared/CirclePagination";
import { useLanguage } from "@/context/LanguageContext";
import { useGetProductRatings } from "@/hooks/services/settings";
import { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import {
  GET_ACTIVE_MAIN_CATEGORY_LIST,
  GET_MAIN_CATEGORY_BY_SLUG,
  GET_ALL_PRODUCTS,
} from "@/constants/links";
import { Category } from "@/constants/models/Category";
import { Product } from "@/constants/models/Product";

// UUID kontrolü için utility fonksiyonu
const isUuid = (value: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value
  );

interface CategoryPageProps {
  category: Category | null;
  initialProducts: Product[];
  initialTotalCount: number;
  pageSize: number;
}

const CategoryPage = ({
  category,
  initialProducts,
  initialTotalCount,
  pageSize,
}: CategoryPageProps) => {
  const { t } = useLanguage();
  const router = useRouter();
  const { page } = router.query;
  const { isRatingEnabled } = useGetProductRatings();

  const [displayPage, setDisplayPage] = useState(1);
  const [products, setProducts] = useState(initialProducts);
  const [totalCount, setTotalCount] = useState(initialTotalCount);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (page && typeof page === "string") {
      const pageNumber = parseInt(page, 10);
      if (pageNumber >= 1 && pageNumber !== displayPage) {
        setDisplayPage(pageNumber);
        // Client-side pagination için API çağrısı
        fetchProducts(pageNumber);
      }
    } else {
      setDisplayPage(1);
    }
  }, [page]);

  const fetchProducts = async (pageNum: number) => {
    if (!category?.id) return;

    setIsLoading(true);
    try {
      const response = await fetch(GET_ALL_PRODUCTS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          page: pageNum - 1,
          pageSize: pageSize,
          from: 0,
          mainCategoryIds: [category.id],
          subCategoryIds: [],
          specificationOptionIds: [],
          search: "",
          discountSort: 0,
          ratingSort: 0,
          salesCountSort: 0,
          likeCountSort: 0,
          isAvailable: true,
        }),
      });

      const result = await response.json();
      if (result?.isSucceed && result?.data) {
        setProducts(result.data.items || []);
        setTotalCount(result.data.count || 0);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage !== displayPage) {
      setDisplayPage(newPage);
      router.push(
        {
          pathname: router.pathname,
          query: { ...router.query, page: newPage.toString() },
        },
        undefined,
        { shallow: true }
      );
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (!category) {
    return (
      <main className="main">
        <div className="container py-5">
          <div className="text-center">
            <h4>{t("productsPage.noProductsFoundTitle")}</h4>
            <p className="text-muted">
              {t("productsPage.noProductsFoundMessage")}
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <>
      <SEOHead slug={category.seo?.slug} />
      <main className="main">
        <div className="tf-page-title">
          <div className="container-full">
            <div className="heading text-center">
              {category.name || t("productsPage.pageTitle")}
            </div>
            <p className="text-center text-2 text_black-2 mt_5">
              {t("productsPage.pageSubtitle")}
            </p>
          </div>
        </div>

        <section className="flat-spacing-2">
          <div className="container">
            <div className="row g-4">
              {isLoading ? (
                <div className="col-12 d-flex justify-content-center align-items-center">
                  <div className="spinner-border" role="status">
                    <span className="sr-only"></span>
                  </div>
                </div>
              ) : products.length > 0 ? (
                products.map((product) => (
                  <div
                    key={product.id}
                    className="col-6 col-sm-6 col-md-4 col-lg-3 d-flex"
                  >
                    <ProductCard
                      product={product}
                      isRatingEnabled={isRatingEnabled}
                    />
                  </div>
                ))
              ) : (
                <div className="col-12 text-center py-5">
                  <h4>{t("productsPage.noProductsFoundTitle")}</h4>
                  <p className="text-muted">
                    {t("productsPage.noProductsFoundMessage")}
                  </p>
                </div>
              )}
            </div>
            <div className="d-flex justify-content-center mt-4">
              <CirclePagination
                totalCount={totalCount}
                currentPage={displayPage}
                pageSize={pageSize}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    // Aktif kategorileri çek (paginationlu endpoint - seo bilgisi için)
    const response = await fetch(
      `${GET_ACTIVE_MAIN_CATEGORY_LIST}?Page=0&PageSize=100`
    );

    if (!response.ok) {
      return { paths: [], fallback: "blocking" };
    }

    const data = await response.json();
    // Paginationlu endpoint CategoryListResponse döndürüyor
    const categories = data?.data?.items || [];

    // Slug'ı olan kategorilerin path'lerini oluştur
    const paths = categories
      .filter((cat: Category) => cat.seo?.slug && cat.isActive)
      .map((cat: Category) => ({
        params: { categorySlug: cat.seo!.slug! },
      }));

    return {
      paths,
      fallback: "blocking", // Yeni slug'lar için lazy generation
    };
  } catch (error) {
    console.error("Error fetching categories for static paths:", error);
    return { paths: [], fallback: "blocking" };
  }
};

export const getStaticProps: GetStaticProps<CategoryPageProps> = async ({
  params,
}) => {
  const categorySlug = params?.categorySlug as string;

  if (!categorySlug) {
    return { notFound: true };
  }

  try {
    // UUID kontrolü - slug UUID ise ID olarak kullan
    const slugIsUuid = isUuid(categorySlug);

    let category: Category | null = null;

    if (slugIsUuid) {
      // UUID ise, aktif kategori liste endpoint'inden kategoriyi bul
      const listResponse = await fetch(
        `${GET_ACTIVE_MAIN_CATEGORY_LIST}?Page=0&PageSize=100`
      );

      if (listResponse.ok) {
        const listData = await listResponse.json();
        // Paginationlu endpoint CategoryListResponse döndürüyor
        const categories = listData?.data?.items || [];
        category =
          categories.find((cat: Category) => cat.id === categorySlug) || null;
      }
    } else {
      // Slug ise, slug endpoint'ini kullan
      const categoryResponse = await fetch(
        `${GET_MAIN_CATEGORY_BY_SLUG}?Slug=${encodeURIComponent(categorySlug)}`
      );

      if (categoryResponse.ok) {
        const categoryData = await categoryResponse.json();
        category = categoryData?.data as Category;
      }
    }

    if (!category || !category.id) {
      return { notFound: true };
    }

    // Mevcut endpoint ile ürünleri çek
    const productsResponse = await fetch(GET_ALL_PRODUCTS, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        page: 0,
        pageSize: 20,
        from: 0,
        mainCategoryIds: [category.id],
        subCategoryIds: [],
        specificationOptionIds: [],
        search: "",
        discountSort: 0,
        ratingSort: 0,
        salesCountSort: 0,
        likeCountSort: 0,
        isAvailable: true,
      }),
    });

    const productsData = await productsResponse.json();
    const products = (productsData?.data?.items || []) as Product[];
    const totalCount = productsData?.data?.count || 0;

    return {
      props: {
        category,
        initialProducts: products,
        initialTotalCount: totalCount,
        pageSize: 20,
      },
      revalidate: 60, // 60 saniyede bir ISR ile yenile
    };
  } catch (error) {
    console.error("Error in getStaticProps:", error);
    return { notFound: true };
  }
};

export default CategoryPage;
