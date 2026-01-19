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
  GET_SUB_CATEGORY_LIST,
  GET_SUB_CATEGORY_BY_SLUG,
  GET_ALL_PRODUCTS,
} from "@/constants/links";
import { Category, SubCategory } from "@/constants/models/Category";
import { Product } from "@/constants/models/Product";

// UUID kontrolü için utility fonksiyonu
const isUuid = (value: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value
  );

interface SubCategoryPageProps {
  category: Category | null;
  subCategory: SubCategory | null;
  initialProducts: Product[];
  initialTotalCount: number;
  pageSize: number;
}

const SubCategoryPage = ({
  category,
  subCategory,
  initialProducts,
  initialTotalCount,
  pageSize,
}: SubCategoryPageProps) => {
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
        fetchProducts(pageNumber);
      }
    } else {
      setDisplayPage(1);
    }
  }, [page]);

  const fetchProducts = async (pageNum: number) => {
    if (!category?.id || !subCategory?.id) return;

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
          subCategoryIds: [subCategory.id],
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

  if (!category || !subCategory) {
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
      <SEOHead slug={subCategory.seo?.slug} />
      <main className="main">
        <div className="tf-page-title">
          <div className="container-full">
            <div className="heading text-center">
              {subCategory.name || t("productsPage.pageTitle")}
            </div>
            <p className="text-center text-2 text_black-2 mt_5">
              {category.name || t("productsPage.pageSubtitle")}
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
    const categoriesResponse = await fetch(
      `${GET_ACTIVE_MAIN_CATEGORY_LIST}?Page=0&PageSize=100`
    );

    if (!categoriesResponse.ok) {
      return { paths: [], fallback: "blocking" };
    }

    const categoriesData = await categoriesResponse.json();
    // Paginationlu endpoint CategoryListResponse döndürüyor
    const categories = categoriesData?.data?.items || [];

    const paths: Array<{
      params: { categorySlug: string; subCategorySlug: string };
    }> = [];

    // Her kategori için subcategory'leri çek ve path'leri oluştur
    for (const category of categories) {
      if (!category.seo?.slug || !category.isActive) continue;

      try {
        const subCategoriesResponse = await fetch(
          `${GET_SUB_CATEGORY_LIST}?MainCategoryId=${category.id}`
        );

        if (subCategoriesResponse.ok) {
          const subCategoriesData = await subCategoriesResponse.json();
          const subCategories = subCategoriesData?.data?.items || [];

          for (const subCategory of subCategories) {
            if (subCategory.seo?.slug && subCategory.isActive) {
              paths.push({
                params: {
                  categorySlug: category.seo.slug,
                  subCategorySlug: subCategory.seo.slug,
                },
              });
            }
          }
        }
      } catch (error) {
        console.error(
          `Error fetching subcategories for ${category.id}:`,
          error
        );
      }
    }

    return {
      paths,
      fallback: "blocking", // Yeni slug'lar için lazy generation
    };
  } catch (error) {
    console.error("Error fetching paths for subcategories:", error);
    return { paths: [], fallback: "blocking" };
  }
};

export const getStaticProps: GetStaticProps<SubCategoryPageProps> = async ({
  params,
}) => {
  const categorySlug = params?.categorySlug as string;
  const subCategorySlug = params?.subCategorySlug as string;

  if (!categorySlug || !subCategorySlug) {
    return { notFound: true };
  }

  try {
    // UUID kontrolü
    const categorySlugIsUuid = isUuid(categorySlug);
    const subCategorySlugIsUuid = isUuid(subCategorySlug);

    let category: Category | null = null;
    let subCategory: SubCategory | null = null;

    // Kategoriyi çek
    if (categorySlugIsUuid) {
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

    // SubCategory'yi çek
    if (subCategorySlugIsUuid) {
      // UUID ise, kategoriye ait subcategory listesinden bul
      const subCategoryListResponse = await fetch(
        `${GET_SUB_CATEGORY_LIST}?MainCategoryId=${category.id}`
      );

      if (subCategoryListResponse.ok) {
        const subCategoryListData = await subCategoryListResponse.json();
        const subCategories = subCategoryListData?.data?.items || [];
        subCategory =
          subCategories.find(
            (sub: SubCategory) => sub.id === subCategorySlug
          ) || null;
      }
    } else {
      // Slug ise, slug endpoint'ini kullan
      const subCategoryResponse = await fetch(
        `${GET_SUB_CATEGORY_BY_SLUG}?Slug=${encodeURIComponent(
          subCategorySlug
        )}`
      );

      if (subCategoryResponse.ok) {
        const subCategoryData = await subCategoryResponse.json();
        subCategory = subCategoryData?.data as SubCategory;
      }
    }

    if (!subCategory || !subCategory.id) {
      return { notFound: true };
    }

    // Ürünleri çek
    const productsResponse = await fetch(GET_ALL_PRODUCTS, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        page: 0,
        pageSize: 20,
        from: 0,
        mainCategoryIds: [category.id],
        subCategoryIds: [subCategory.id],
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
        subCategory,
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

export default SubCategoryPage;
