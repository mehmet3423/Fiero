import AnnouncementSlider from "@/components/home/AnnouncementSlider";
import FeaturedProductsModern from "@/components/home/FeaturedProductsModern";

import ShopCollection from "@/components/home/ShopCollection";
// import TestimonialModern from "@/components/home/TestimonialModern";
import IconBoxModern from "@/components/home/IconBoxModern";
import BrandCarousel from "@/components/home/BrandCarousel";
// Modern Categories Section (visual only, static demo)
const HomeCategories = () => {
  const categories = [
    { title: "New Arrivals", img: "assets/site/images/collections/collection-circle-8.jpg" },
    { title: "Best Sellers", img: "assets/site/images/collections/collection-2.jpg" },
    { title: "Top Rated", img: "assets/site/images/collections/collection-circle-10.jpg" },
    { title: "Brands We Love", img: "assets/site/images/collections/collection-circle-11.jpg" },
    { title: "Trending", img: "assets/site/images/collections/collection-circle-12.jpg" },
    { title: "The Re-Imagined", img: "assets/site/images/collections/collection-circle-13.jpg" },
    { title: "Sale", img: "assets/site/images/collections/sale.jpg", sale: "30% off" },
  ];
  return (
    <section className="categories-bar-section">
      <div className="categories-bar-scroll">
        {categories.map((cat, i) => (
          <div key={cat.title} className="category-bar-item">
            <a href="#" className={`category-bar-circle${cat.sale ? ' sale' : ''}`}>
              <img
                src={cat.img}
                alt={cat.title}
                className="category-bar-img"
                loading="lazy"
              />
              {cat.sale && (
                <span className="category-bar-sale-badge">{cat.sale}</span>
              )}
            </a>
            <div className="category-bar-title">{cat.title}</div>
          </div>
        ))}
        <div className="category-bar-item">
          <a href="#" className="category-bar-circle shopall">
            <span className="category-bar-shopall-icon">
              <i className="icon icon-arrow1-top-left"></i>
            </span>
          </a>
          <div className="category-bar-title">Shop all</div>
        </div>
      </div>
      <style jsx>{`
        .categories-bar-section {
          width: 100vw;
          max-width: 100vw;
          overflow-x: auto;
          background: #fff;
          margin-bottom: 2.5rem;
          padding: 0.5rem 0 1.5rem 0;
        }
        .categories-bar-scroll {
          display: flex;
          flex-direction: row;
          align-items: flex-end;
          justify-content: center;
          gap: 32px;
          padding: 0 32px;
          overflow-x: auto;
          scrollbar-width: thin;
          scrollbar-color: #eee #fff;
        }
        .category-bar-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          min-width: 110px;
          max-width: 120px;
          margin-bottom: 0.5rem;
        }
        .category-bar-circle {
          width: 110px;
          height: 110px;
          border-radius: 50%;
          background: #f3f3f3;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          transition: box-shadow 0.2s, border 0.2s;
          border: 2px solid transparent;
        }
        .category-bar-circle:hover {
          box-shadow: 0 4px 16px rgba(0,0,0,0.10);
          border: 2px solid #222;
        }
        .category-bar-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 50%;
        }
        .category-bar-title {
          font-size: 1.08rem;
          font-weight: 600;
          color: #181818;
          margin-top: 0.7rem;
          text-align: center;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 110px;
        }
        .category-bar-sale-badge {
          position: absolute;
          top: 8px;
          right: 8px;
          background: #181818;
          color: #fff;
          font-size: 0.85rem;
          font-weight: 600;
          padding: 2px 10px;
          border-radius: 8px;
          z-index: 2;
        }
        .category-bar-circle.sale {
          background: #e74c3c;
        }
        .category-bar-circle.sale .category-bar-img {
          opacity: 0.7;
        }
        .category-bar-circle.shopall {
          background: #fff;
          border: 1.5px solid #222;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .category-bar-shopall-icon {
          font-size: 2.1rem;
          color: #222;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        @media (max-width: 900px) {
          .categories-bar-scroll {
            gap: 18px;
            padding: 0 10px;
          }
          .category-bar-circle, .category-bar-item {
            min-width: 80px;
            max-width: 90px;
          }
          .category-bar-circle {
            width: 80px;
            height: 80px;
          }
          .category-bar-title {
            max-width: 80px;
            font-size: 0.98rem;
          }
        }
        @media (max-width: 600px) {
          .categories-bar-section {
            padding-bottom: 0.5rem;
          }
          .categories-bar-scroll {
            gap: 10px;
            padding: 0 4px;
          }
          .category-bar-circle, .category-bar-item {
            min-width: 60px;
            max-width: 70px;
          }
          .category-bar-circle {
            width: 60px;
            height: 60px;
          }
          .category-bar-title {
            max-width: 60px;
            font-size: 0.92rem;
            margin-top: 0.4rem;
          }
        }
      `}</style>
    </section>
  );
};
import SEOHead from "@/components/SEO/SEOHead";
import {
  GeneralContentModel,
  GeneralContentType,
} from "@/constants/models/GeneralContent";
import { blogPosts } from "@/data/blogData";
import { useAuth } from "@/hooks/context/useAuth";
import { useGeneralContents } from "@/hooks/services/general-content/useGeneralContents";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import BannerGroup from "../components/home/BannerGroup";
import BlogPosts from "../components/home/BlogPosts";
import FeaturedProducts from "../components/home/FeaturedProducts";
import MainSlideshow from "../components/home/MainSlideshow";
import Newsletter from "../components/home/Newsletter";
import ServiceIcons from "../components/home/ServiceIcons";
import { GetStaticProps } from "next";
import { useGetProductListByIds } from "@/hooks/services/products/useGetProductListByIds";


// SEO prop interface
interface HomeSEOData {
  id?: string;
  title?: string;
  description?: string;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImageUrl?: string;
}

interface HomeProps {
  seoData?: HomeSEOData;
}

const Home: React.FC<HomeProps> = ({ seoData }) => {
  console.log("seoData", seoData);
  const { userProfile } = useAuth();
  // Ana sayfada gösterilecek son 3 blog gönderisi
  const latestPosts = blogPosts?.slice(0, 3) || [];

  const [showcaseBannerContents, setShowcaseBannerContents] =
    useState<GeneralContentModel[]>();
  const [mainSliderContents, setMainSliderContents] =
    useState<GeneralContentModel[]>();
  const [secondSliderContents, setSecondSliderContents] =
    useState<GeneralContentModel[]>();
  const [mainBannerContents, setMainBannerContents] =
    useState<GeneralContentModel[]>();
  const [mainProductList1Contents, setMainProductList1Contents] =
    useState<GeneralContentModel[]>();
  const [mainProductList2Contents, setMainProductList2Contents] =
    useState<GeneralContentModel[]>();

  //index showcase bannerleri
  const {
    contents,
    isLoading: generalContentsLoading,
    refetchContents,
  } = useGeneralContents(GeneralContentType.Index_ShowcaseBanner);

  //index main slider
  const {
    contents: mainSliderContentsData,
    isLoading: mainSliderContentsLoading,
    refetchContents: refetchMainSliderContents,
  } = useGeneralContents(GeneralContentType.MainSlider);

  //index second slider
  const {
    contents: secondSliderContentsData,
    isLoading: secondSliderContentsLoading,
    refetchContents: refetchSecondSliderContents,
  } = useGeneralContents(GeneralContentType.SecondSlider);

  //index main banner
  const {
    contents: mainBannerContentsData,
    isLoading: mainBannerContentsLoading,
    refetchContents: refetchMainBannerContents,
  } = useGeneralContents(GeneralContentType.MainBanner);

  //index main product list (hem 1 hem 2'yi içerir)
  const {
    contents: mainProductListContentsData,
    isLoading: mainProductListContentsLoading,
    refetchContents: refetchMainProductListContents,
  } = useGeneralContents(GeneralContentType.MainProductList);



  //burda contents içindeki showcase bannerleri alıyoruz hepsini alamıyoruz
  useEffect(() => {
    const fetchGeneralContents = () => {
      setShowcaseBannerContents(contents?.items || []);
      setMainSliderContents(mainSliderContentsData?.items || []);
      setSecondSliderContents(secondSliderContentsData?.items || []);
      setMainBannerContents(mainBannerContentsData?.items || []);
      setMainProductList1Contents(mainProductListContentsData?.items || []);
      setMainProductList2Contents(mainProductListContentsData?.items || []);
    };
    fetchGeneralContents();
  }, [
    contents,
    mainSliderContentsData,
    secondSliderContentsData,
    mainBannerContentsData,
    mainProductListContentsData,
  ]);

  const homeSlides = [
    ...(mainSliderContentsData?.items
      ?.slice()
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .map((item) => ({
        image: item.imageUrl || "",
        buttonLink: item.contentUrl || "",
      })) || []),
    // {
    //   image:
    //     "https://static.ticimax.cloud/cdn-cgi/image/width=1903,quality=99/61950/uploads/sayfatasarim/sayfa1/0d9b2533-6340-4eb7-ad44-67b48f628faf.jpg",
    //   buttonLink: "/products",
    // },
    // {
    //   image:
    //     "https://static.ticimax.cloud/cdn-cgi/image/width=1903,quality=99/61950/uploads/sayfatasarim/sayfa1/5c519e14-5747-4240-9ddb-53da0939ab12.jpg",
    //   buttonLink: "/products",
    // },
    // {
    //   image:
    //     "https://static.ticimax.cloud/cdn-cgi/image/width=1903,quality=99/61950/uploads/sayfatasarim/sayfa1/outlet-urunlerde-60-indirim-3f03.jpg",
    //   buttonLink: "/products",
    // },
  ];


  const secondHomeSlides = [
    ...(secondSliderContentsData?.items
      ?.slice()
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .map((item) => ({
        image: item.imageUrl || "",
        buttonLink: item.contentUrl || "",
      })) || []),
    // {
    //   image:
    //     "https://static.ticimax.cloud/cdn-cgi/image/width=1903,quality=99/61950/uploads/sayfatasarim/sayfa1/0d9b2533-6340-4eb7-ad44-67b48f628faf.jpg",
    //   buttonLink: "/products",
    // },
  ];


  const banners = [
    ...(mainBannerContents
      ?.slice()
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .map((item) => ({
        image: item.imageUrl || "",
        link: item.contentUrl || "",
      })) || []),
  ];

  const ProductHeader = [
    {
      id: 1,
      title: "Popüler Ürünler",
    },
  ];

  // mainProductList1 ve mainProductList2 içeriklerinin content alanını parse et
  let mainProductList1ProductIds: string[] = [];
  let mainProductList2ProductIds: string[] = [];
  let isMainProductListLoading = mainProductListContentsLoading;

  if (
    !mainProductListContentsLoading &&
    mainProductListContentsData?.items &&
    mainProductListContentsData.items.length > 0
  ) {
    // Order'a göre sırala
    const sortedItems = mainProductListContentsData.items.sort(
      (a, b) => (a.order ?? 0) - (b.order ?? 0)
    );

    // İlk eleman (order: 0) Main Product List 1
    if (sortedItems[0]) {
      try {
        mainProductList1ProductIds = JSON.parse(sortedItems[0].content || "[]");
      } catch {
        mainProductList1ProductIds = [];
      }
    }

    // İkinci eleman (order: 1) Main Product List 2
    if (sortedItems[1]) {
      try {
        mainProductList2ProductIds = JSON.parse(sortedItems[1].content || "[]");
      } catch {
        mainProductList2ProductIds = [];
      }
    }
  }
 const { products: modernProducts, isLoading: isModernLoading } = useGetProductListByIds(mainProductList2ProductIds);



  return (
    <>
      <SEOHead canonical={"/"} />
      <div>
        {/* SEO için gizli H1 başlığı */}
        <h1 style={{ position: "absolute", left: "-9999px", fontSize: "1px" }}>
          Nors - Kaliteli Ürünler ve Harika Tasarımlar Online Mağazası
        </h1>

        <div className="home-section home-section--announcement">
          <AnnouncementSlider />
        </div>

        <div className="home-section home-section--categories">
          <HomeCategories />
        </div>

        <div className="home-section home-section--heroslider">
          <MainSlideshow
            slides={[
              {
                image: "/assets/site/images/slider/women-slideshow-1.jpg",
                title: "Elegance",
                subtitle: "From casual to formal, we've got you covered",
                buttonText: "Shop collection",
                buttonLink: "/products",
              },
              {
                image: "/assets/site/images/slider/women-slideshow-2.jpg",
                title: "Boutique",
                subtitle: "From casual to formal, we've got you covered",
                buttonText: "Shop collection",
                buttonLink: "/products",
              },
              {
                image: "/assets/site/images/slider/women-slideshow-3.jpg",
                title: "Luxury",
                subtitle: "From casual to formal, we've got you covered",
                buttonText: "Shop collection",
                buttonLink: "/products",
              },
            ]}
          />
        </div>

        <div className="container">
          <div className="home-section home-section--serviceicons">
            <ServiceIcons />
          </div>

          {/* Banner Collection Alanı */}
          <div className="home-section home-section--collectionbanners" style={{ marginBottom: "2.7rem" }}>
            <section className="collection-banner-section">
              <div className="collection-banner-wrapper">
                <div className="collection-banner-item">
                  <a href="/shop-collection-sub" className="collection-banner-img-link">
                    <img src="/assets/site/images/collections/collection-47.jpg" alt="The January Collection" className="collection-banner-img" />
                    <div className="collection-banner-content">
                      <h5 className="collection-banner-title">The January Collection</h5>
                      <span className="collection-banner-btn">Shop now</span>
                    </div>
                  </a>
                </div>
                <div className="collection-banner-item">
                  <a href="/shop-collection-sub" className="collection-banner-img-link">
                    <img src="/assets/site/images/collections/collection-48.jpg" alt="Olympia's Picks" className="collection-banner-img" />
                    <div className="collection-banner-content">
                      <h5 className="collection-banner-title">Olympia's Picks</h5>
                      <span className="collection-banner-btn">Shop now</span>
                    </div>
                  </a>
                </div>
              </div>
            </section>
          </div>

          {/* Popüler Ürünler (Best Seller) Alanı */}
          <div className="home-section home-section--bestseller" style={{ marginBottom: "2.2rem" }}>
            <section className="flat-spacing-15 pb_0">
              <div className="container bestseller-container">
                <div className="flat-title wow fadeInUp" data-wow-delay="0s" style={{ textAlign: "center", marginBottom: "2.2rem" }}>
                  <span className="title" style={{ fontSize: "2.5rem", fontWeight: 700, display: "block", marginBottom: "0.5rem" }}>Popüler Ürünler</span>
                  <p className="sub-title" style={{ fontSize: "1.15rem", color: "#444", margin: 0 }}>Beautifully Functional. Purposefully Designed. Consciously Crafted.</p>
                </div>
                {/* Modern Ürün Slideri */}
                <div className="bestseller-slider-wrapper">
                  {isModernLoading ? (
                    <p style={{ textAlign: "center" }}>Yükleniyor...</p>
                  ) : (
                    <FeaturedProductsModern products={modernProducts} />
                  )}
                </div>

              </div>
            </section>
          </div>
          <div className="home-section home-section--shopcollection">
            <ShopCollection />
          </div>

          <div className="home-section home-section--iconboxmodern">
            <IconBoxModern />
          </div>

          {/* Brand Carousel Section */}
          <div className="home-section home-section--brandcarousel">
            <BrandCarousel />
          </div>

          {/* <CustomerReviews />
        <div className="container">
          <h2 className="title text-center mb-4">Göstergesd Paneli</h2>
          {showcaseBannerContents && (
            <CustomGridContentViewer contents={showcaseBannerContents} />
          )}
        </div> */}
        </div>
        <style jsx global>{`
          /* Banner Collection Alanı */
          .collection-banner-section {
            width: 100%;
            background: #fff;
            padding: 0;
            margin: 0 0 0 0;
            overflow-x: hidden;
          }
          .collection-banner-wrapper {
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: stretch;
            gap: 2.5rem;
            width: 100%;
            max-width: 1280px;
            margin: 0 auto;
            padding: 0 3vw;
            box-sizing: border-box;
          }
          .collection-banner-item {
            flex: 1 1 0;
            background: #fff;
            border-radius: 2rem;
            box-shadow: none;
            display: flex;
            flex-direction: column;
            align-items: stretch;
            justify-content: flex-end;
            overflow: hidden;
            min-width: 0;
            max-width: 700px;
            position: relative;
            transition: none;
          }
          .collection-banner-img-link {
            display: block;
            width: 100%;
            height: 680px;
            position: relative;
            border-radius: 2rem;
            overflow: hidden;
          }
          .collection-banner-img {
            object-fit: cover;
            width: 100%;
            height: 100%;
            border-radius: 2rem;
            display: block;
          }
          .collection-banner-content {
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
            width: 100%;
            padding-bottom: 2.5rem;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: flex-end;
            z-index: 2;
            background: none;
          }
          .collection-banner-title {
            color: #fff;
            font-size: 2rem;
            font-weight: 500;
            margin-bottom: 1.2rem;
            text-shadow: 0 2px 8px rgba(0,0,0,0.18);
            text-align: center;
          }
          .collection-banner-btn {
            display: inline-block;
            background: #fff;
            color: #222;
            font-size: 1.1rem;
            font-weight: 500;
            border-radius: 2rem;
            padding: 0.7rem 2.1rem;
            box-shadow: 0 2px 8px rgba(0,0,0,0.10);
            text-decoration: none;
            transition: background 0.18s, color 0.18s, box-shadow 0.18s;
          }
          .collection-banner-btn:hover {
            background: #222;
            color: #fff;
            box-shadow: 0 4px 16px rgba(0,0,0,0.18);
          }
          @media (max-width: 1200px) {
            .collection-banner-wrapper {
              gap: 1.2rem;
              padding: 0 1vw;
            }
            .collection-banner-item {
              max-width: 420px;
            }
            .collection-banner-img-link {
              height: 520px;
            }
          }
          @media (max-width: 900px) {
            .collection-banner-wrapper {
              flex-direction: column;
              gap: 1.2rem;
              align-items: stretch;
              max-width: 98vw;
              padding: 0 0.5vw;
            }
            .collection-banner-item {
              max-width: 100vw;
            }
            .collection-banner-img-link {
              height: 340px;
            }
            .collection-banner-title {
              font-size: 1.2rem;
            }
          }
          .home-section {
            margin-bottom: 2.2rem;
          }
          .home-section--announcement {
            margin-bottom: 0.7rem;
          }
          .home-section--categories {
            margin-bottom: 1.2rem;
          }
          .home-section--heroslider {
            margin-bottom: 1.7rem;
          }
          .home-section--serviceicons {
            margin-bottom: 1.2rem;
          }
          .home-section--bannergroup {
            margin-bottom: 1.7rem;
          }
          .home-section--featuredproducts {
            margin-bottom: 2.2rem;
          }
          .home-section--shopcollection {
            margin-bottom: 1.7rem;
          }
          .home-section--iconboxmodern {
            margin-bottom: 0.5rem;
          }
          /* Popüler Ürünler (Best Seller) alanı için stiller */
          .bestseller-container {
            padding-bottom: 0.5rem;
          }
          .bestseller-slider-wrapper .swiper,
          .bestseller-slider-wrapper .swiper-container {
            padding-bottom: 0px !important;
          }
          .bestseller-slider-wrapper .product-card, .bestseller-slider-wrapper .card-product {
            background: #fff;
            border-radius: 18px;
            box-shadow: 0 4px 24px 0 rgba(30, 32, 37, 0.10);
            transition: box-shadow 0.2s, transform 0.2s;
            border: none;
            overflow: hidden;
            margin-bottom: 0.5rem;
            display: flex;
            flex-direction: column;
            align-items: stretch;
            min-height: 370px;
            max-width: 320px;
            margin-left: auto;
            margin-right: auto;
            padding-bottom: 18px;
          }
          .bestseller-slider-wrapper .product-card:hover, .bestseller-slider-wrapper .card-product:hover {
            box-shadow: 0 8px 32px 0 rgba(30, 32, 37, 0.18);
            transform: translateY(-4px) scale(1.02);
          }
          .bestseller-slider-wrapper .product-card .product-image-wrapper, .bestseller-slider-wrapper .card-product .product-image-wrapper {
            width: 100%;
            aspect-ratio: 1/1.1;
            background: #f7f7f7;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
          }
          .bestseller-slider-wrapper .product-card img, .bestseller-slider-wrapper .card-product img {
            border-radius: 12px 12px 0 0;
            object-fit: contain;
            width: 100%;
            height: 100%;
            max-height: 260px;
            background: #f7f7f7;
            display: block;
          }
          .bestseller-slider-wrapper .product-card-title, .bestseller-slider-wrapper .card-product-info .title {
            font-size: 1.13rem;
            font-weight: 600;
            color: #181818;
            margin: 1.1rem 0 0.2rem 0;
            text-align: center;
            min-height: 2.1em;
            letter-spacing: 0.01em;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .bestseller-slider-wrapper .product-card-price, .bestseller-slider-wrapper .card-product-info .price {
            font-size: 1.08rem;
            font-weight: 500;
            color: #222;
            margin-bottom: 0.3rem;
            text-align: center;
            display: block;
          }
          .bestseller-slider-wrapper .card-product-info {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 0 12px;
          }
          .bestseller-slider-wrapper .product-card-actions, .bestseller-slider-wrapper .list-product-btn {
            display: flex;
            justify-content: center;
            gap: 10px;
            margin-bottom: 1.1rem;
          }
          .bestseller-slider-wrapper .product-card-actions .box-icon, .bestseller-slider-wrapper .list-product-btn .box-icon {
            background: #fff;
            border-radius: 50%;
            box-shadow: 0 2px 8px 0 rgba(30,32,37,0.10);
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: box-shadow 0.18s, background 0.18s;
            font-size: 1.2rem;
            color: #222;
            border: none;
            cursor: pointer;
            position: relative;
          }
          .bestseller-slider-wrapper .product-card-actions .box-icon:hover, .bestseller-slider-wrapper .list-product-btn .box-icon:hover {
            background: #f3f3f3;
            box-shadow: 0 4px 16px 0 rgba(30,32,37,0.13);
          }
          .bestseller-slider-wrapper .swiper-button-next, .bestseller-slider-wrapper .swiper-button-prev {
            background: #fff;
            border-radius: 50%;
            box-shadow: 0 2px 8px 0 rgba(30,32,37,0.10);
            width: 44px;
            height: 44px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #222;
            transition: box-shadow 0.18s, background 0.18s;
            top: 45%;
          }
          .bestseller-slider-wrapper .swiper-button-next:hover, .bestseller-slider-wrapper .swiper-button-prev:hover {
            background: #f3f3f3;
            box-shadow: 0 4px 16px 0 rgba(30,32,37,0.13);
          }
          .bestseller-slider-wrapper .swiper-pagination-bullet {
            background: #222;
            opacity: 0.3;
            margin: 0 4px;
          }
          .bestseller-slider-wrapper .swiper-pagination-bullet-active {
            opacity: 1;
          }
          @media (max-width: 900px) {
            .bestseller-slider-wrapper .product-card, .bestseller-slider-wrapper .card-product {
              min-height: 260px;
              max-width: 220px;
            }
            .bestseller-slider-wrapper .product-card .product-image-wrapper, .bestseller-slider-wrapper .card-product .product-image-wrapper {
              aspect-ratio: 1/1.1;
            }
            .bestseller-slider-wrapper .product-card img, .bestseller-slider-wrapper .card-product img {
              max-height: 120px;
            }
          }
          @media (max-width: 600px) {
            .bestseller-slider-wrapper .product-card, .bestseller-slider-wrapper .card-product {
              min-height: 180px;
              max-width: 140px;
            }
            .bestseller-slider-wrapper .product-card .product-image-wrapper, .bestseller-slider-wrapper .card-product .product-image-wrapper {
              aspect-ratio: 1/1.1;
            }
            .bestseller-slider-wrapper .product-card img, .bestseller-slider-wrapper .card-product img {
              max-height: 80px;
            }
          }
        `}</style>
      </div>
    </>
  );
};

// getStaticProps - Ana sayfa SEO verilerini çeker
export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  try {
    // API'den ana sayfa SEO verilerini çek
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/SEO/GetSEOBySlug?slug=/`
    );

    if (response.ok) {
      const seoData = await response.json();
      return {
        props: {
          seoData: seoData || null,
        },
        revalidate: 60, // 1 dakikada bir güncelle
      };
    }
  } catch (error) {
    console.error("Ana sayfa SEO verisi alınamadı:", error);
  }

  // Hata durumunda varsayılan değerler döndür
  return {
    props: {
      seoData: null,
    },
    revalidate: 60,
  };
};

export default Home;
