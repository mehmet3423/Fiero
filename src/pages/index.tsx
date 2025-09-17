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
import { SORT_OPTIONS } from "@/constants/enums/SortOptions";
import React, { useEffect, useState } from "react";
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

  const [mainSliderContents, setMainSliderContents] =
    useState<GeneralContentModel[]>();
  const [mainBannerContents, setMainBannerContents] =
    useState<GeneralContentModel[]>();
  const [mainProductList1Contents, setMainProductList1Contents] =
    useState<GeneralContentModel[]>();
  const [mainProductList2Contents, setMainProductList2Contents] =
    useState<GeneralContentModel[]>();
  const [testimonialContents, setTestimonialContents] =
    useState<GeneralContentModel[]>();

  //index main slider
  const {
    contents: mainSliderContentsData,
    isLoading: mainSliderContentsLoading,
    refetchContents: refetchMainSliderContents,
  } = useGeneralContents(GeneralContentType.MainSlider);

  //index second slider
  // const {
  //   contents: secondSliderContentsData,
  //   isLoading: secondSliderContentsLoading,
  //   refetchContents: refetchSecondSliderContents,
  // } = useGeneralContents(GeneralContentType.SecondSlider);

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

  //testimonial
  const {
    contents: testimonialContentsData,
    isLoading: testimonialContentsLoading,
    refetchContents: refetchTestimonialContents,
  } = useGeneralContents(GeneralContentType.Explore);

  //burda contents içindeki showcase bannerleri alıyoruz hepsini alamıyoruz
  useEffect(() => {
    const fetchGeneralContents = () => {
      setMainSliderContents(mainSliderContentsData?.items || []);
      setMainBannerContents(mainBannerContentsData?.items || []);
      setMainProductList1Contents(mainProductListContentsData?.items || []);
      setMainProductList2Contents(mainProductListContentsData?.items || []);
      setTestimonialContents(testimonialContentsData?.items || []);
    };
    fetchGeneralContents();
  }, [
    mainSliderContentsData,
    // secondSliderContentsData,
    mainBannerContentsData,
    mainProductListContentsData,
    testimonialContentsData,
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

  // const secondHomeSlides = [
  //   ...(secondSliderContentsData?.items
  //     ?.slice()
  //     .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  //     .map((item) => ({
  //       image: item.imageUrl || "",
  //       buttonLink: item.contentUrl || "",
  //     })) || []),
  //   // {
  //   //   image:
  //   //     "https://static.ticimax.cloud/cdn-cgi/image/width=1903,quality=99/61950/uploads/sayfatasarim/sayfa1/0d9b2533-6340-4eb7-ad44-67b48f628faf.jpg",
  //   //   buttonLink: "/products",
  //   // },
  // ];

  const banners = [
    ...(mainBannerContents
      ?.slice()
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .map((item, index) => ({
        id: item.id || index,
        title: item.title || "",
        alt: item.title || "Banner",
        image: item.imageUrl || "",
        link: item.contentUrl || "#",
      })) || []),
  ];

  const testimonials = [
    ...(testimonialContents
      ?.slice()
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .map((item) => ({
        id: item.id,
        title: item.title || "",
        text: item.content || "",
        image: item.imageUrl || "",
        link: item.contentUrl || "#",
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
  let mainProductList1Title: string = "Ecomus's Favorites";
  let mainProductList2Title: string = "Ecomus's Favorites";
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
    console.log("Sorted items:", sortedItems);

    // İlk eleman (order: 0) Main Product List 1
    if (sortedItems[0]) {
      try {
        console.log("MainProductList title:", sortedItems[0].title);
        console.log("MainProductList content:", sortedItems[0].content);
        mainProductList1Title = sortedItems[0].title || "Ecomus's Favorites";
        mainProductList1ProductIds = JSON.parse(sortedItems[0].content || "[]");
        console.log("Parsed product IDs:", mainProductList1ProductIds);
      } catch (error) {
        console.log("Parse error:", error);
        mainProductList1ProductIds = [];
      }
    }

    // İkinci eleman (order: 1) Main Product List 2
    if (sortedItems[1]) {
      try {
        console.log("MainProductList2 title:", sortedItems[1].title);
        console.log("MainProductList2 content:", sortedItems[1].content);
        mainProductList2Title = sortedItems[1].title || "Ecomus's Favorites";
        mainProductList2ProductIds = JSON.parse(sortedItems[1].content || "[]");
        console.log("Parsed product IDs 2:", mainProductList2ProductIds);
      } catch (error) {
        console.log("Parse error 2:", error);
        mainProductList2ProductIds = [];
      }
    } else {
      console.log(
        "MainProductList2 not found, using MainProductList1 for both"
      );
      // Eğer ikinci eleman yoksa, birinci elemanı ikinci için de kullan
      mainProductList2Title = mainProductList1Title;
      mainProductList2ProductIds = mainProductList1ProductIds;
    }
  }

  return (
    <>
      <SEOHead canonical={"/"} />
      <div>
        {/* SEO için gizli H1 başlığı */}
        <h1 style={{ position: "absolute", left: "-9999px", fontSize: "1px" }}>
          Mağaza - Kaliteli Ürünler ve Harika Tasarımlar Online Mağazası
        </h1>

        <div className="home-section home-section--heroslider">
          <MainSlideshow
            slides={
              mainSliderContents
                ?.slice()
                .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                .map((item) => ({
                  image: item.imageUrl || "",
                  title: item.title || "",
                  subtitle: item.content || "",
                  buttonText: "Shop collection",
                  buttonLink: item.contentUrl || "/products",
                })) || []
            }
          />
        </div>

        <div className="container main-content-container">
          <div className="home-section home-section--serviceicons">
            <ServiceIcons />
          </div>

          {/* Banner Collection Alanı */}
          <div className="home-section home-section--collectionbanners">
            <BannerCollection banners={banners} />
          </div>

          {/* Ecomus's Favorites Alanı */}
          <div className="home-section home-section--bestseller">
            <FeaturedProducts
              productHeader={mainProductList2Title}
              productIds={mainProductList2ProductIds}
            />
          </div>
          <div className="home-section home-section--shopcollection">
            <ShopCollection />
          </div>

          <div className="home-section home-section--testimonial">
            <TestimonialSection />
          </div>

          <div className="home-section home-section--iconboxmodern my-4">
            <IconBoxModern />
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
