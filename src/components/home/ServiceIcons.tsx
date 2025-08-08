import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Link from "next/link";
import { useCategories } from "@/hooks/services/categories/useCategories";
import Image from "next/image";

// Varsayılan kategori resimleri (kategori resmi yoksa kullanılacak)
const defaultCategoryImages = [
  "/assets/site/images/collections/collection-42.jpg",
  "/assets/site/images/collections/collection-43.jpg",
  "/assets/site/images/collections/collection-44.jpg",
  "/assets/site/images/collections/collection-45.jpg",
  "/assets/site/images/collections/collection-46.jpg",
];

function ServiceIcons() {
  const { categories, isLoading } = useCategories();

  const sortedCategories =
    categories?.items
      ?.sort((a, b) => a.displayIndex - b.displayIndex)
      .slice(0, 5) || [];

  return (
    <section className="flat-spacing-5 pb_0">
      <div className="container">
        <div className="flat-title">
          <span className="title wow fadeInUp" data-wow-delay="0s">
            Categories you might like
          </span>
        </div>
        <div className="hover-sw-nav">
          <Swiper
            modules={[Navigation, Pagination]}
            slidesPerView={4}
            spaceBetween={30}
            navigation={{
              nextEl: ".nav-next-collection",
              prevEl: ".nav-prev-collection",
            }}
            pagination={{
              clickable: true,
              el: ".sw-pagination-collection",
            }}
            breakpoints={{
              0: { slidesPerView: 1.2, spaceBetween: 15 },
              600: { slidesPerView: 2, spaceBetween: 30 },
              900: { slidesPerView: 3, spaceBetween: 30 },
              1200: { slidesPerView: 4, spaceBetween: 30 },
            }}
            className="tf-sw-collection"
            loop={false}
          >
            {isLoading
              ? // Loading durumu için placeholder'lar
                Array.from({ length: 4 }).map((_, index) => (
                  <SwiperSlide key={`loading-${index}`}>
                    <div className="collection-item style-2 hover-img">
                      <div className="collection-inner">
                        <div className="collection-image img-style">
                          <div
                            className="placeholder-image"
                            style={{
                              width: "100%",
                              height: "200px",
                              backgroundColor: "#f0f0f0",
                              borderRadius: "8px",
                            }}
                          ></div>
                        </div>
                        <div className="collection-content">
                          <div className="tf-btn collection-title hover-icon fs-15 rounded-full">
                            <span>Yükleniyor...</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))
              : sortedCategories.map((category, index) => (
                  <SwiperSlide key={category.id}>
                    <div className="collection-item style-2 hover-img">
                      <div className="collection-inner">
                        <Link
                          href={`/products?categoryId=${category.id}`}
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
                              width: "250px",
                              height: "300px",
                              borderRadius: "8px",
                            }}
                          />
                        </Link>
                        <div className="collection-content">
                          <Link
                            href={`/products?categoryId=${category.id}`}
                            className="tf-btn collection-title hover-icon fs-15 rounded-full"
                          >
                            <span>{category.name}</span>
                            <i className="icon icon-arrow1-top-left"></i>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
          </Swiper>
          <div className="nav-sw nav-prev-slider nav-next-collection box-icon w_46 round">
            <span className="icon icon-arrow-right"></span>
          </div>
          <div className="nav-sw nav-next-slider nav-prev-collection box-icon w_46 round">
            <span className="icon icon-arrow-left"></span>
          </div>
          <div className="sw-dots style-2 sw-pagination-collection justify-content-center"></div>
        </div>
      </div>
    </section>
  );
}

export default ServiceIcons;
