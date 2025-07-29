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
import { useCategories } from "@/hooks/services/categories/useCategories";
import { useGetAllProducts } from "@/hooks/services/products/useGetAllProducts";
import { useGetAllOutletProducts } from "@/hooks/services/products/useGetAllOutletProducts";
import { useSubCategorySpecifications } from "@/hooks/services/sub-category-specifications/useSubCategorySpecifications";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import ProductFilterSidebar from "@/components/ProductFilterSidebar";

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
  const [selectedMainCategoryId, setSelectedMainCategoryId] = useState<string>("");
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<string>("");
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
  const [sortBy, setSortBy] = useState<string>("popularity");
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [maxPossiblePrice, setMaxPossiblePrice] = useState<number>(1000);
  const [displayPage, setDisplayPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const [dropdownOpen, setDropdownOpen] = useState(false);


  const [grid, setGrid] = useState<number>(4);

  // Collection verilerini bir JSON dizisi olarak tanımla:
  const collections = [
    {
      key: "Accessories",
      title: "Accessories",
      image: "/assets/site/images/collections/collection-14.jpg", // kendi yolunuza göre güncelleyin
    },
    {
      key: "men",
      title: "Men",
      image: "/assets/site/images/collections/collection-1.jpg",
    },
    {
      key: "shoes",
      title: "Shoes",
      image: "/assets/site/images/collections/collection-16.jpg",
    },
    {
      key: "new-arrivals",
      title: "New Arrival",
      image: "/assets/site/images/collections/collection-17.jpg",
    },
    {
      key: "handbag",
      title: "Handbag",
      image: "/assets/site/images/collections/collection-18.jpg",
    },

    {
      key: "women",
      title: "Women",
      image: "/assets/site/images/collections/collection-2.jpg",
    },


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
      if (typeof window !== 'undefined' && window.Swiper) {
        const swiperElement = document.querySelector('.tf-sw-collection') as SwiperElement;

        if (swiperElement && !swiperElement.swiper) {
          console.log('Initializing collection swiper...');

          const swiper = new window.Swiper('.tf-sw-collection', {
            slidesPerView: 2,
            spaceBetween: 15,
            loop: false,
            navigation: {
              nextEl: '.nav-next-collection',
              prevEl: '.nav-prev-collection',
            },
            pagination: {
              el: '.sw-pagination-collection',
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

          console.log('Collection swiper initialized:', swiper);
        }
      }
    };

    const timer = setTimeout(initSwiper, 100);
    return () => clearTimeout(timer);
  },); // Collections statik olduğu için hızlanması açısından useEffect'e bağımlılık eklenmedi

  useEffect(() => {
    if (categoryId && typeof categoryId === "string") {
      setSelectedMainCategoryId(categoryId);
    }
    if (subCategoryId && typeof subCategoryId === "string") {
      setSelectedSubCategoryId(subCategoryId);
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
      setSelectedSubCategoryId("");
    }
  }, [categoryId, subCategoryId, page, title, search]);

  const {
    subCategorySpecifications,
    isLoading: subCategorySpecificationsLoading,
  } = useSubCategorySpecifications(selectedSubCategoryId);

  const [selectedSpecificationIds, setSelectedSpecificationIds] = useState<string[]>([]);
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
          newSelectedFilters[spec.name] = matchingOptions.map((opt) => opt.value);
        }
      }

      setSelectedFilters(newSelectedFilters);
    } else {
      setSelectedFilters({});
    }
  }, [selectedSpecificationIds, subCategorySpecifications]);

  const { categories, isLoading: categoriesLoading } = useCategories();

  const isOutletPage = selectedMainCategoryId === "outlet";

  const { data: allProducts, isLoading: allProductsLoading } = useGetAllProducts({
    page: displayPage - 1,
    pageSize: pageSize,
    searchTerm: searchTerm || undefined,
    mainCategoryId: !isOutletPage ? selectedMainCategoryId || undefined : undefined,
    subCategoryId: !isOutletPage ? selectedSubCategoryId || undefined : undefined,
    ...sortParams,
    enabled: !isOutletPage,
  });

  const { data: outletProducts, isLoading: outletProductsLoading } = useGetAllOutletProducts({
    page: displayPage - 1,
    pageSize: pageSize,
    searchTerm: searchTerm || undefined,
    ...sortParams,
    enabled: isOutletPage,
  });



  const selectedMainCategory = useMemo(() => {
    if (!categories?.items) return null;
    return categories.items.find((cat) => cat.id === selectedMainCategoryId);
  }, [categories, selectedMainCategoryId]);

  const subCategories = useMemo(() => {
    if (!selectedMainCategory?.subCategories) return [];
    return selectedMainCategory.subCategories;
  }, [selectedMainCategory]);

  useEffect(() => {
    if (!router.query.subCategoryId) {
      setSelectedSubCategoryId("");
    }
  }, [selectedMainCategoryId]);

  useEffect(() => {
    setDisplayPage(1);
  }, [searchTerm]);

  useEffect(() => {
    setDisplayPage(1);
  }, [sortBy]);

  const isLoading = categoriesLoading || allProductsLoading || outletProductsLoading;

  const currentProductData = isOutletPage ? outletProducts : allProducts;
  const apiProducts = (currentProductData?.items || []) as Product[];
  const actualPageSize = currentProductData?.size || pageSize;
  const totalCount = currentProductData?.count || 0;

  useEffect(() => {
    if (apiProducts && apiProducts.length > 0) {
      const prices = apiProducts.map(
        (product: Product) => product.discountedPrice ?? product.price
      );
      const minPrice = Math.floor(Math.min(...prices));
      const maxPrice = Math.ceil(Math.max(...prices));
      const roundedMaxPrice = Math.ceil(maxPrice / 10) * 10;
      setMaxPossiblePrice(roundedMaxPrice);
      setPriceRange([minPrice, roundedMaxPrice]);
    }
  }, [apiProducts]);

  const filteredProducts = useMemo(() => {
    if (!apiProducts) return [];
    let filtered = [...apiProducts];
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
    filtered = filtered.filter((product: Product) => {
      const productPrice = product.discountedPrice ?? product.price;
      return productPrice >= priceRange[0] && productPrice <= priceRange[1];
    });
    return filtered;
  }, [apiProducts, selectedFilters, priceRange]);

  const sortedProducts = filteredProducts;
  console.log("Sorted Products:", sortedProducts);

  const toggleFilters = () => {
    setIsFilterVisible(!isFilterVisible);
    document.body.classList.toggle("sidebar-filter-active");
  };


  const clearAllFilters = () => {
    setSelectedFilters({});
    setSelectedMainCategoryId("");
    setSelectedSubCategoryId("");
    setPriceRange([0, maxPossiblePrice]);
    setSelectedSpecificationIds([]);
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
      <div className="tf-page-title">
        <div className="container-full">
          <div className="heading text-center">New Arrival</div>
          <p className="text-center text-2 text_black-2 mt_5">
            Shop through our latest selection of Fashion
          </p>
        </div>
      </div>
      {/* /Page Title */}
      {/* Collection Slider Section */}
      <section className="flat-spacing-3 pb_0">
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
                {collections.map((col) => (
                  <div className="swiper-slide" key={col.key} data-lazy="true">
                    <div className="collection-item style-2 hover-img">
                      <div className="collection-inner">
                        <a
                          href="#"
                          className="collection-image img-style"
                        >
                          <img
                            className="lazyload"
                            data-src={col.image}
                            src={col.image}
                            alt="collection-img"
                          />
                        </a>
                        <div className="collection-content">
                          <a href="#" className="tf-btn collection-title hover-icon fs-15">
                            <span>{col.title}</span>
                            <i className="icon icon-arrow1-top-left"></i>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="nav-sw nav-prev-slider nav-next-collection box-icon w_46 round">
              <span className="icon icon-arrow-right"></span>
            </div>
            <div className="nav-sw nav-next-slider nav-prev-collection box-icon w_46 round">
              <span className="icon icon-arrow-left"></span>
            </div>

            {/* Pagination Dots */}
            <div className="sw-dots style-2 sw-pagination-collection justify-content-center"></div>
          </div>
        </div>
      </section>
      {/* /Collection Slider Section */}

      {/* Section Product */}
      <section className="flat-spacing-2">
        <div className="container">
          <div className="tf-shop-control row align-items-center mb-4">
            <div className="col-12 col-md-3 mb-2 mb-md-0">
              <a
                href="#"
                data-bs-toggle="offcanvas"
                aria-controls="offcanvasLeft"
                className="tf-btn-filter"
                onClick={toggleFilters}
              >
                <span className="icon icon-filter"></span>
                <span className="text">Filter</span>
              </a>
            </div>
            <div className="col-12 col-md-5 d-flex justify-content-center mb-2 mb-md-0">
              <ul className="tf-control-layout d-flex justify-content-center gap-2">
                {[2, 3, 4].map((g) => (
                  <li
                    key={g}
                    className={`tf-view-layout-switch sw-layout-${g}${grid === g ? " active" : ""}`}
                    data-value-grid={`grid-${g}`}
                    onClick={() => setGrid(g)}
                  >
                    <div className="item"><span className={`icon icon-grid-${g}`}></span></div>
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
                      {SORT_OPTION_LABELS[sortBy as keyof typeof SORT_OPTION_LABELS] || "Featured"}
                    </span>
                    <span className="icon icon-arrow-down"></span>
                  </div>
                  <div className={`dropdown-menu${dropdownOpen ? " show" : ""}`}>
                    {Object.entries(SORT_OPTION_LABELS).map(([key, label]) => (
                      <div
                        className={`select-item${sortBy === key ? " active" : ""}`}
                        key={key}
                        onClick={() => {
                          setSortBy(key);      // mevcut projedeki filtreleme fonksiyonunu tetikler
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
                  <span className="sr-only">Yükleniyor...</span>
                </div>
              </div>
            ) : sortedProducts.length > 0 ? (
              sortedProducts.map((product) => (
                <div
                  key={product.id}
                  className={
                    grid === 2
                      ? "col-12 col-md-6 d-flex"
                      : grid === 3
                        ? "col-12 col-md-4 d-flex"
                        : "col-12 col-sm-6 col-md-4 col-lg-3 d-flex"
                  }
                >
                  <ProductCard product={product} />
                </div>
              ))
            ) : (
              <div className="col-12 text-center py-5">
                <h4>Ürün bulunamadı</h4>
                <p className="text-muted">
                  Arama kriterlerinize uygun ürün bulunmamaktadır.
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
      `${process.env.NEXT_PUBLIC_API_URL}/api/SEO/GetSEOBySlug?slug=/products`
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