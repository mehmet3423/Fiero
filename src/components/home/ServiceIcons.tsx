
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Link from "next/link";

const serviceCategories = [
  {
    title: "Tops",
    img: "/assets/site/images/collections/collection-42.jpg",
    link: "/shop-collection-sub"
  },
  {
    title: "Sweatshirts",
    img: "/assets/site/images/collections/collection-43.jpg",
    link: "/shop-collection-sub"
  },
  {
    title: "Swim",
    img: "/assets/site/images/collections/collection-44.jpg",
    link: "/shop-collection-sub"
  },
  {
    title: "Dresses",
    img: "/assets/site/images/collections/collection-45.jpg",
    link: "/shop-collection-sub"
  },
  {
    title: "Cardigans",
    img: "/assets/site/images/collections/collection-46.jpg",
    link: "/shop-collection-sub"
  },
];

function ServiceIcons() {
  return (
    <section className="flat-spacing-5 pb_0">
      <div className="container">
        <div className="flat-title">
          <span className="title wow fadeInUp" data-wow-delay="0s">Categories you might like</span>
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
              el: ".sw-pagination-collection" 
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
            {serviceCategories.map((category, index) => (
              <SwiperSlide key={index}>
                <div className="collection-item style-2 hover-img">
                  <div className="collection-inner">
                    <Link href={category.link} className="collection-image img-style">
                      <img 
                        className="lazyload" 
                        data-src={category.img} 
                        src={category.img} 
                        alt="collection-img" 
                      />
                    </Link>
                    <div className="collection-content">
                      <Link href={category.link} className="tf-btn collection-title hover-icon fs-15 rounded-full">
                        <span>{category.title}</span>
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
