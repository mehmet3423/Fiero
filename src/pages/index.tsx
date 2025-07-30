import AnnouncementSlider from "@/components/home/AnnouncementSlider";
import HomeCategories from "@/components/home/HomeCategories";
import ShopCollection from "@/components/home/ShopCollection";
import BannerCollection from "@/components/home/BannerCollection";
import TestimonialSection from "@/components/home/TestimonialSection";
import IconBoxModern from "@/components/home/IconBoxModern";
import BrandCarousel from "@/components/home/BrandCarousel";
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

        <div className="container main-content-container">
          <div className="home-section home-section--serviceicons">
            <ServiceIcons />
          </div>

          {/* Banner Collection Alanı */}
          <div className="home-section home-section--collectionbanners">
            <BannerCollection />
          </div>

          {/* Ecomus's Favorites Alanı */}
          <div className="home-section home-section--bestseller">
            <FeaturedProducts
              productHeader="Ecomus's Favorites" 
              productIds={mainProductList2ProductIds}
            />
          </div>
          <div className="home-section home-section--shopcollection">
            <ShopCollection />
          </div>

          <div className="home-section home-section--testimonial">
            <TestimonialSection />
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
