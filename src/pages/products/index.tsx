"use client";
import ProductCard from "@/components/home/ProductCard";
import SEOHead from "@/components/SEO/SEOHead";
import CirclePagination from "@/components/shared/CirclePagination";
import { GetStaticProps } from "next";
import {
  DiscountSort,
  LikeCountSort,
  RatingSort,
  SORT_OPTIONS,
  SORT_OPTION_LABELS,
  SalesCountSort,
} from "@/constants/enums/SortOptions";
import { Product, TechnicalDetail } from "@/constants/models/Product";
import { SubCategorySpecification } from "@/constants/models/SubCategorySpecification";
import { useActiveCategories } from "@/hooks/services/categories/useActiveCategories";
import { useGetAllProducts } from "@/hooks/services/products/useGetAllProducts";
import { useGetAllOutletProducts } from "@/hooks/services/products/useGetAllOutletProducts";
import { useSubCategorySpecifications } from "@/hooks/services/sub-category-specifications/useSubCategorySpecifications";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import ProductFilterSidebar from "@/components/product/ProductFilterSidebar";
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";
import Image from "next/image";
import { useGetProductRatings } from "@/hooks/services/settings";

declare global {
  interface Window {
    Swiper: any;
  }
}

// UI için kullanılacak ürün tipi
interface UIProduct {
  id: string;
  name: string;
  price: number;
  image?: string;
  oldPrice?: number;
  colors?: string[];
  category: string;
  rating: number;
  reviews: number;
  description?: string;
  isOutlet: boolean;
}

// QuickView için genişletilmiş ürün tipi
interface EnhancedProduct extends UIProduct {
  images: string[];
  description: string;
}

// HTMLElement interface'ini extend et
interface SwiperElement extends HTMLElement {
  swiper?: any;
}

const mapApiProductToUIProduct = (product: Product): UIProduct => {
  return {
    id: product.id,
    name: product.title,
    price: product.price,
    image: product.imageUrl || product.baseImageUrl,
    isOutlet: product.isOutlet,
    category: product.subCategory?.name || "Uncategorized",
    rating: 0,
    reviews: product.comments?.length || 0,
    description: product.description,
  };
};

interface ProductsSEOData {
  id?: string;
  title?: string;
  description?: string;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string;
  canonical?: string;
  ogImageUrl?: string;
}

interface ProductsProps {
  seoData?: ProductsSEOData;
}

const ProductPage: React.FC<ProductsProps> = ({ seoData }) => {
  const { t } = useLanguage();
  const sortOptionLabels = SORT_OPTION_LABELS;
  // Product ratings ayarını kontrol et
  const { isRatingEnabled } = useGetProductRatings();
  const [selectedMainCategoryIds, setSelectedMainCategoryIds] = useState<
    string[]
  >([]);
  const [selectedSubCategoryIds, setSelectedSubCategoryIds] = useState<
    string[]
  >([]);
  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, string[]>
  >({});
  const [sortBy, setSortBy] = useState<string>("popularity");
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [maxPossiblePrice, setMaxPossiblePrice] = useState<number>(100000);
  const [displayPage, setDisplayPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [grid, setGrid] = useState<number>(4);

  // Varsayılan kategori resimleri (kategori resmi yoksa kullanılacak)
  const defaultCategoryImages = [
    "/assets/site/images/collections/collection-42.jpg",
    "/assets/site/images/collections/collection-43.jpg",
    "/assets/site/images/collections/collection-44.jpg",
    "/assets/site/images/collections/collection-45.jpg",
    "/assets/site/images/collections/collection-46.jpg",
  ];

  const getSortParameters = (
    sortBy: string
  ): {
    discountSort?: DiscountSort;
    ratingSort?: RatingSort;
    salesCountSort?: SalesCountSort;
    likeCountSort?: LikeCountSort;
  } => {
    switch (sortBy) {
      case SORT_OPTIONS.PRICE_LOW:
        return { discountSort: DiscountSort.PriceAsc };
      case SORT_OPTIONS.PRICE_HIGH:
        return { discountSort: DiscountSort.PriceDesc };
      case SORT_OPTIONS.RATING:
        return { ratingSort: RatingSort.BestFirst };
      case SORT_OPTIONS.SALES_HIGH:
        return { salesCountSort: SalesCountSort.HighToLow };
      case SORT_OPTIONS.SALES_LOW:
        return { salesCountSort: SalesCountSort.LowToHigh };
      case SORT_OPTIONS.LIKES_HIGH:
        return { likeCountSort: LikeCountSort.HighToLow };
      case SORT_OPTIONS.LIKES_LOW:
        return { likeCountSort: LikeCountSort.LowToHigh };
      case SORT_OPTIONS.POPULARITY:
        return { salesCountSort: SalesCountSort.HighToLow };
      default:
        return {
          discountSort: DiscountSort.None,
          ratingSort: RatingSort.None,
          salesCountSort: SalesCountSort.None,
          likeCountSort: LikeCountSort.None,
        };
    }
  };

  const sortParams = getSortParameters(sortBy);

  const router = useRouter();
  const { categoryId, subCategoryId, page, title, search } = router.query;

  useEffect(() => {
    const initSwiper = () => {
      if (typeof window !== "undefined" && window.Swiper) {
        const swiperElement = document.querySelector(
          ".tf-sw-collection"
        ) as SwiperElement;

        if (swiperElement && !swiperElement.swiper) {
          const swiper = new window.Swiper(".tf-sw-collection", {
            slidesPerView: 2,
            spaceBetween: 15,
            loop: false,
            navigation: {
              nextEl: ".nav-next-collection",
              prevEl: ".nav-prev-collection",
            },
            pagination: {
              el: ".sw-pagination-collection",
              clickable: true,
            },
            breakpoints: {
              768: {
                slidesPerView: 3,
                spaceBetween: 30,
              },
              1024: {
                slidesPerView: 5,
                spaceBetween: 30,
              },
            },
          });
        }
      }
    };

    const timer = setTimeout(initSwiper, 100);
    return () => clearTimeout(timer);
  }); // Collections statik olduğu için hızlanması açısından useEffect'e bağımlılık eklenmedi

  useEffect(() => {
    if (categoryId && typeof categoryId === "string") {
      setSelectedMainCategoryIds([categoryId]);
    }
    if (subCategoryId && typeof subCategoryId === "string") {
      setSelectedSubCategoryIds([subCategoryId]);
    }
    if (page && typeof page === "string") {
      const pageNumber = parseInt(page, 10);
      if (pageNumber >= 1) {
        setDisplayPage(pageNumber);
      }
    }
    const searchQuery = search || title;
    if (searchQuery && typeof searchQuery === "string") {
      setSearchTerm(decodeURIComponent(searchQuery));
    }
    if (!router.query.subCategoryId) {
      setSelectedSubCategoryIds([]);
    }
  }, [categoryId, subCategoryId, page, title, search]);

  // Alt kategoriler için specifications - ilk seçili alt kategoriyi kullan
  const firstSelectedSubCategoryId = selectedSubCategoryIds[0] || "";
  const {
    subCategorySpecifications,
    isLoading: subCategorySpecificationsLoading,
  } = useSubCategorySpecifications(firstSelectedSubCategoryId);

  const [selectedSpecificationIds, setSelectedSpecificationIds] = useState<
    string[]
  >([]);
  useEffect(() => {
    if (
      subCategorySpecifications &&
      subCategorySpecifications.length > 0 &&
      selectedSpecificationIds.length > 0
    ) {
      const newSelectedFilters: Record<string, string[]> = {};

      for (const spec of subCategorySpecifications) {
        const matchingOptions = spec.specificationOptions.filter((option) =>
          selectedSpecificationIds.includes(option.id)
        );
        if (matchingOptions.length > 0) {
          newSelectedFilters[spec.name] = matchingOptions.map(
            (opt) => opt.value
          );
        }
      }

      setSelectedFilters(newSelectedFilters);
    } else {
      setSelectedFilters({});
    }
  }, [selectedSpecificationIds, subCategorySpecifications]);

  const { categories: categoriesData, isLoading: categoriesLoading } =
    useActiveCategories();
  const categories = { items: categoriesData?.items || [] };

  // Kategorileri displayIndex'e göre sırala ve ilk 5'ini al
  const sortedCategories =
    categories?.items
      ?.sort((a, b) => a.displayIndex - b.displayIndex)
      .slice(0, 5) || [];

  const isOutletPage = selectedMainCategoryIds.includes("outlet");

  const { data: allProducts, isLoading: allProductsLoading } =
    useGetAllProducts({
      page: displayPage - 1,
      pageSize: pageSize,
      searchTerm: searchTerm || undefined,
      mainCategoryIds: !isOutletPage
        ? selectedMainCategoryIds.length > 0
          ? selectedMainCategoryIds
          : undefined
        : undefined,
      subCategoryIds: !isOutletPage
        ? selectedSubCategoryIds.length > 0
          ? selectedSubCategoryIds
          : undefined
        : undefined,
      ...sortParams,
      enabled: !isOutletPage,
    });

  const { data: outletProducts, isLoading: outletProductsLoading } =
    useGetAllOutletProducts({
      page: displayPage - 1,
      pageSize: pageSize,
      searchTerm: searchTerm || undefined,
      ...sortParams,
      enabled: isOutletPage,
    });

  // Seçili ana kategorilerin alt kategorilerini topla
  const subCategories = useMemo(() => {
    if (!categories?.items || selectedMainCategoryIds.length === 0) return [];
    const allSubCategories: any[] = [];
    selectedMainCategoryIds.forEach((catId) => {
      const category = categories.items.find((cat) => cat.id === catId);
      if (category?.subCategories) {
        allSubCategories.push(...category.subCategories);
      }
    });
    return allSubCategories;
  }, [categories, selectedMainCategoryIds]);

  useEffect(() => {
    setDisplayPage(1);
  }, [searchTerm]);

  useEffect(() => {
    setDisplayPage(1);
  }, [sortBy]);

  const isLoading =
    categoriesLoading || allProductsLoading || outletProductsLoading;

  const currentProductData = isOutletPage ? outletProducts : allProducts;
  const apiProducts = (currentProductData?.items || []) as Product[];
  const actualPageSize = currentProductData?.size || pageSize;
  const totalCount = currentProductData?.count || 0;

  useEffect(() => {
    if (apiProducts && apiProducts.length > 0) {
      const prices = apiProducts.map((product: Product) => {
        const finalPrice = product.discountedPrice || product.price;

        return finalPrice;
      });

      const minPrice = Math.floor(Math.min(...prices));
      const maxPrice = Math.ceil(Math.max(...prices));
      const roundedMaxPrice = Math.ceil(maxPrice / 10) * 10;

      setMaxPossiblePrice(roundedMaxPrice);
      setPriceRange([minPrice, roundedMaxPrice]);
    }
  }, [apiProducts]);

  const filteredProducts = useMemo(() => {
    if (!apiProducts || apiProducts.length === 0) return [];

    let filtered = [...apiProducts];

    // Fiyat filtrelemesi - sadece priceRange güncellenmişse uygula
    if (priceRange[1] > 1000) {
      // priceRange güncellenmişse
      filtered = filtered.filter((product: Product) => {
        const finalPrice = product.discountedPrice || product.price;
        return finalPrice >= priceRange[0] && finalPrice <= priceRange[1];
      });
    }

    // Diğer filtreler
    if (Object.keys(selectedFilters).length > 0) {
      filtered = filtered.filter((product: Product) => {
        return Object.entries(selectedFilters).every(
          ([specName, selectedOptions]) => {
            const productSpec = product.technicalDetails?.find(
              (spec: TechnicalDetail) => spec.key === specName
            );
            if (!productSpec) return false;
            return selectedOptions.some(
              (option) => productSpec.value === option
            );
          }
        );
      });
    }

    return filtered;
  }, [apiProducts, selectedFilters, priceRange]);

  const sortedProducts = filteredProducts;

  const toggleFilters = () => {
    setIsFilterVisible(!isFilterVisible);
    document.body.classList.toggle("sidebar-filter-active");
  };

  const clearAllFilters = () => {
    setSelectedFilters({});
    setSelectedMainCategoryIds([]);
    setSelectedSubCategoryIds([]);
    setPriceRange([0, maxPossiblePrice]);
    setSelectedSpecificationIds([]);
    setDisplayPage(1);
  };

  // Çoklu kategori seçimi - toggle mantığı
  const handleMainCategoryChange = (categoryId: string) => {
    setSelectedMainCategoryIds((prev) => {
      if (prev.includes(categoryId)) {
        // Kategori seçiliyse kaldır
        const newIds = prev.filter((id) => id !== categoryId);
        // Alt kategorilerini de kaldır
        if (newIds.length !== prev.length) {
          const category = categories.items.find(
            (cat) => cat.id === categoryId
          );
          if (category?.subCategories) {
            const subCatIds = category.subCategories.map((sub) => sub.id);
            setSelectedSubCategoryIds((subPrev) =>
              subPrev.filter((id) => !subCatIds.includes(id))
            );
          }
        }
        return newIds;
      } else {
        // Kategori seçili değilse ekle
        return [...prev, categoryId];
      }
    });
    setDisplayPage(1);
  };

  // Çoklu alt kategori seçimi - toggle mantığı
  const handleSubCategoryChange = (subCategoryId: string) => {
    setSelectedSubCategoryIds((prev) => {
      if (prev.includes(subCategoryId)) {
        // Alt kategori seçiliyse kaldır
        return prev.filter((id) => id !== subCategoryId);
      } else {
        // Alt kategori seçili değilse ekle
        return [...prev, subCategoryId];
      }
    });
    setSelectedSpecificationIds([]); // Alt kategori değiştiğinde specification'ları temizle
    setDisplayPage(1);
  };

  const handlePageChange = useCallback(
    (newPage: number) => {
      if (newPage >= 1 && newPage !== displayPage) {
        setDisplayPage(newPage);
        const currentQuery = { ...router.query };
        if (currentQuery.page !== newPage.toString()) {
          currentQuery.page = newPage.toString();
          router.push(
            {
              pathname: router.pathname,
              query: currentQuery,
            },
            undefined,
            { shallow: true }
          );
        }
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    },
    [displayPage, router]
  );

  let canonical = "/products";
  if (router.query.categoryId && router.query.subCategoryId) {
    canonical = `/products?categoryId=${router.query.categoryId}&subCategoryId=${router.query.subCategoryId}`;
  } else if (router.query.categoryId) {
    canonical = `/products?categoryId=${router.query.categoryId}`;
  }

  return (
    <>
      <SEOHead canonical={canonical} />

      {/* Sadece filtre açıkken sidebar'ı gösterir */}
      {isFilterVisible && (
        <ProductFilterSidebar
          show={isFilterVisible}
          onClose={toggleFilters}
          categories={categories?.items || []}
          selectedFilters={selectedFilters}
          onFilterChange={setSelectedFilters}
          subCategorySpecifications={subCategorySpecifications || []}
          selectedSpecificationIds={selectedSpecificationIds}
          onSpecificationChange={setSelectedSpecificationIds}
          priceRange={priceRange}
          onPriceRangeChange={setPriceRange}
          selectedMainCategoryIds={selectedMainCategoryIds}
          selectedSubCategoryIds={selectedSubCategoryIds}
          onMainCategoryChange={handleMainCategoryChange}
          onSubCategoryChange={handleSubCategoryChange}
        />
      )}

      {/* Üst Bar */}
      {/* <div className="tf-top-bar bg_white line">
        <div className="px_15 lg-px_40">
          <div className="tf-top-bar_wrap grid-3 gap-30 align-items-center">
            <ul className="tf-top-bar_item tf-social-icon d-flex gap-10">
              <li>
                <a href="#" className="box-icon w_28 round social-facebook bg_line">
                  <i className="icon fs-12 icon-fb"></i>
                </a>
              </li>
              <li>
                <a href="#" className="box-icon w_28 round social-twiter bg_line">
                  <i className="icon fs-10 icon-Icon-x"></i>
                </a>
              </li>
              <li>
                <a href="#" className="box-icon w_28 round social-instagram bg_line">
                  <i className="icon fs-12 icon-instagram"></i>
                </a>
              </li>
              <li>
                <a href="#" className="box-icon w_28 round social-tiktok bg_line">
                  <i className="icon fs-12 icon-tiktok"></i>
                </a>
              </li>
              <li>
                <a href="#" className="box-icon w_28 round social-pinterest bg_line">
                  <i className="icon fs-12 icon-pinterest-1"></i>
                </a>
              </li>
            </ul>
            <div className="text-center overflow-hidden">
              <div className="swiper tf-sw-top_bar" data-preview="1" data-space="0" data-loop="true" data-speed="1000" data-delay="2000">
                <div className="swiper-wrapper">
                  <div className="swiper-slide">
                    <p className="top-bar-text fw-5">
                      Spring Fashion Sale{" "}
                      <a href="#" title="all collection" className="tf-btn btn-line">
                        Shop now<i className="icon icon-arrow1-top-left"></i>
                      </a>
                    </p>
                  </div>
                  <div className="swiper-slide">
                    <p className="top-bar-text fw-5">Summer sale discount off 70%</p>
                  </div>
                  <div className="swiper-slide">
                    <p className="top-bar-text fw-5">Time to refresh your wardrobe.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="top-bar-language tf-cur justify-content-end">
              <div className="tf-currencies">
                <select className="image-select center style-default type-currencies">
                  <option data-thumbnail="images/country/fr.svg">EUR <span>€ | France</span></option>
                  <option data-thumbnail="images/country/de.svg">EUR <span>€ | Germany</span></option>
                  <option selected data-thumbnail="images/country/us.svg">USD <span>$ | United States</span></option>
                  <option data-thumbnail="images/country/vn.svg">VND <span>₫ | Vietnam</span></option>
                </select>
              </div>
              <div className="tf-languages">
                <select className="image-select center style-default type-languages">
                  <option>English</option>
                  <option>العربية</option>
                  <option>简体中文</option>
                  <option>اردو</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div> */}

      {/* Page Title */}
      {/* <div className="tf-page-title">
        <div className="container-full">
          <div className="heading text-center">
            {t("productsPage.pageTitle")}
          </div>
          <p className="text-center text-2 text_black-2 mt_5">
            {t("productsPage.pageSubtitle")}
          </p>
        </div>
      </div> */}
      {/* /Page Title */}
      {/* Collection Slider Section */}
      {/* <section className="flat-spacing-3 pb_0">
        <div className="container">
          <div className="hover-sw-nav">
            <div
              className="swiper tf-sw-collection"
              data-preview="5"
              data-tablet="3"
              data-mobile="2"
              data-space-lg="30"
              data-space-md="30"
              data-space="15"
              data-loop="false"
              data-auto-play="false"
            >
              <div className="swiper-wrapper">
                {categoriesLoading
                  ? // Loading durumu için placeholder'lar
                    Array.from({ length: 5 }).map((_, index) => (
                      <div
                        className="swiper-slide"
                        key={`loading-${index}`}
                        data-lazy="true"
                      >
                        <div className="collection-item style-2 hover-img">
                          <div className="collection-inner">
                            <div className="collection-image img-style">
                              <div
                                className="placeholder-image"
                                style={{
                                  width: "100%",
                                  height: "250px",
                                  backgroundColor: "#f0f0f0",
                                  borderRadius: "8px",
                                }}
                              ></div>
                            </div>
                            <div className="collection-content">
                              <div className="tf-btn collection-title hover-icon fs-15">
                                <span>{t("common.loading")}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  : sortedCategories.map((category, index) => (
                      <div
                        className="swiper-slide"
                        key={category.id}
                        data-lazy="true"
                      >
                        <div className="collection-item style-2 hover-img">
                          <div className="collection-inner">
                            <Link
                              href={
                                category.seo?.slug
                                  ? `/category/${category.seo.slug}`
                                  : `/products?categoryId=${category.id}`
                              }
                              className="collection-image img-style"
                            >
                              <Image
                                className="lazyload"
                                data-src={
                                  category.imageUrl ||
                                  defaultCategoryImages[
                                    index % defaultCategoryImages.length
                                  ]
                                }
                                src={
                                  category.imageUrl ||
                                  defaultCategoryImages[
                                    index % defaultCategoryImages.length
                                  ]
                                }
                                alt={`${category.name} kategorisi`}
                                width={500}
                                height={500}
                                style={{
                                  width: "100%",
                                  height: "250px",
                                  objectFit: "contain",
                                  borderRadius: "8px",
                                }}
                              />
                            </Link>
                            <div className="collection-content ">
                              <Link
                                href={
                                  category.seo?.slug
                                    ? `/category/${category.seo.slug}`
                                    : `/products?categoryId=${category.id}`
                                }
                                className="tf-btn collection-title hover-icon fs-15 rounded-full"
                              >
                                <span>{category.name}</span>
                                <i className="icon icon-arrow1-top-left"></i>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
              </div>
            </div>

            <div className="nav-sw nav-prev-slider nav-next-collection box-icon w_46 round">
              <span className="icon icon-arrow-right"></span>
            </div>
            <div className="nav-sw nav-next-slider nav-prev-collection box-icon w_46 round">
              <span className="icon icon-arrow-left"></span>
            </div>

            <div className="sw-dots style-2 sw-pagination-collection justify-content-center"></div>
          </div>
        </div>
      </section> */}
      {/* /Collection Slider Section */}

      {/* Section Product */}
      <section className="flat-spacing-2">
        <div className="container">
          <div className="tf-shop-control row align-items-center mb-4">
            <div className="col-12 col-md-3 mb-2 mb-md-0">
              <a
                href="#"
                className="tf-btn-filter"
                onClick={(e) => {
                  e.preventDefault();
                  toggleFilters();
                }}
              >
                <span className="icon icon-filter"></span>
                <span className="text">{t("productsPage.filterButton")}</span>
              </a>
            </div>
            <div className="col-12 col-md-5 d-flex justify-content-center mb-2 mb-md-0">
              <ul className="tf-control-layout d-flex justify-content-center gap-2">
                {[2, 3, 4].map((g) => (
                  <li
                    key={g}
                    className={`tf-view-layout-switch sw-layout-${g}${
                      grid === g ? " active" : ""
                    }`}
                    data-value-grid={`grid-${g}`}
                    onClick={() => setGrid(g)}
                  >
                    <div className="item">
                      <span className={`icon icon-grid-${g}`}></span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-12 col-md-3 d-flex justify-content-end align-items-center">
              <div className="tf-control-sorting">
                <div
                  className={`tf-dropdown-sort${dropdownOpen ? " show" : ""}`}
                  tabIndex={0}
                  onBlur={() => setDropdownOpen(false)}
                >
                  <div
                    className="btn-select"
                    onClick={() => setDropdownOpen((open) => !open)}
                    style={{ cursor: "pointer" }}
                  >
                    <span className="text-sort-value">
                      {sortOptionLabels[
                        sortBy as keyof typeof sortOptionLabels
                      ] || t("productsPage.featured")}
                    </span>
                    <span className="icon icon-arrow-down"></span>
                  </div>
                  <div
                    className={`dropdown-menu${dropdownOpen ? " show" : ""}`}
                  >
                    {Object.entries(sortOptionLabels).map(([key, label]) => (
                      <div
                        className={`select-item${
                          sortBy === key ? " active" : ""
                        }`}
                        key={key}
                        onClick={() => {
                          setSortBy(key);
                          setDropdownOpen(false);
                        }}
                      >
                        <span className="text-value-item">{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row g-4">
            {isLoading ? (
              <div className="col-12 d-flex justify-content-center align-items-center">
                <div className="spinner-border" role="status">
                  <span className="sr-only"></span>
                </div>
              </div>
            ) : sortedProducts.length > 0 ? (
              sortedProducts.map((product) => (
                <div
                  key={product.id}
                  className={
                    grid === 2
                      ? "col-6 col-md-6 d-flex"
                      : grid === 3
                      ? "col-6 col-md-4 d-flex"
                      : "col-6 col-sm-6 col-md-4 col-lg-3 d-flex"
                  }
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
          {/* Pagination */}
          <div className="d-flex justify-content-center mt-4">
            <CirclePagination
              totalCount={totalCount}
              currentPage={displayPage}
              pageSize={actualPageSize}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </section>
      {/* /Section Product */}
    </>
  );
};

export const getStaticProps: GetStaticProps<ProductsProps> = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/SEO/GetSEOBySlug?slug=/products`
    );
    if (response.ok) {
      const seoData = await response.json();
      return {
        props: {
          seoData: seoData || null,
        },
        revalidate: 180,
      };
    }
  } catch (error) {
    console.error("Products SEO verisi alınamadı:", error);
  }
  return {
    props: {
      seoData: null,
    },
    revalidate: 180,
  };
};
export default ProductPage;
