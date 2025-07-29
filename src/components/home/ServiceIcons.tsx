
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const serviceCategories = [
  {
    icon: "icon-truck",
    title: "Tops",
    img: "/assets/site/images/collections/collection-42.jpg",
    link: "#"
  },
  {
    icon: "icon-rotate-left",
    title: "Sweatshirts",
    img: "/assets/site/images/collections/collection-43.jpg",
    link: "#"
  },
  {
    icon: "icon-life-ring",
    title: "Swim",
    img: "/assets/site/images/collections/collection-44.jpg",
    link: "#"
  },
  {
    icon: "icon-envelope",
    title: "Dresses",
    img: "/assets/site/images/collections/collection-45.jpg",
    link: "#"
  },
  {
    icon: "icon-gift",
    title: "Cardigans",
    img: "/assets/site/images/collections/collection-46.jpg",
    link: "#"
  },
];

function ServiceIcons() {
  return (
    <section className="service-categories-slider-section pb-0">
      <div className="container">
        <div className="service-slider-title mb-4">
          <span className="title">Categories you might like</span>
        </div>
        {/* Alanların kaybolmaması için slider ve başlık arasında boşluk ve görünürlük garantisi */}
        <div className="service-categories-slider-nav">
          {serviceCategories && serviceCategories.length > 0 ? (
            <>
              <Swiper
                modules={[Navigation, Pagination]}
                slidesPerView={4}
                spaceBetween={30}
                navigation={{
                  nextEl: ".nav-next-slider",
                  prevEl: ".nav-prev-slider",
                }}
                pagination={{ clickable: true, el: ".service-swiper-pagination" }}
                breakpoints={{
                  0: { slidesPerView: 1.2, spaceBetween: 10 },
                  600: { slidesPerView: 2, spaceBetween: 15 },
                  900: { slidesPerView: 3, spaceBetween: 20 },
                  1200: { slidesPerView: 4, spaceBetween: 30 },
                }}
                className="service-categories-swiper"
              >
                {serviceCategories.map((cat, i) => (
                  <SwiperSlide key={cat.title}>
                    <div className="collection-item style-2 hover-img">
                      <div className="collection-inner">
                        <a href={cat.link} className="collection-image img-style">
                          <img src={cat.img} alt={cat.title} loading="lazy" />
                        </a>
                        <div className="collection-content">
                          <a href={cat.link} className="tf-btn collection-title hover-icon fs-15 rounded-full">
                            <span>{cat.title}</span>
                            <i className="icon icon-arrow1-top-left"></i>
                          </a>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
              <div className="nav-sw nav-next-slider nav-next-collection box-icon w_46 round"><span className="icon icon-arrow-left"></span></div>
              <div className="nav-sw nav-prev-slider nav-prev-collection box-icon w_46 round"><span className="icon icon-arrow-right"></span></div>
              <div className="sw-dots style-2 sw-pagination-collection justify-content-center"></div>
            </>
          ) : (
            <div style={{ minHeight: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>
              Kategori bulunamadı.
            </div>
          )}
        </div>
      </div>
      <style jsx>{`
        .service-categories-slider-section {
          background: #fff;
          padding-top: 24px;
          padding-bottom: 24px;
        }
        .service-slider-title {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 3.8rem;
          min-height: 48px;
        }
        @media (max-width: 900px) {
          .service-slider-title {
            margin-bottom: 2.2rem;
          }
        }
        .service-slider-title .title {
          font-size: 2rem;
          font-weight: 700;
          color: #222;
          letter-spacing: 0.01em;
          display: block;
          text-align: center;
        }
        .service-categories-slider-nav {
          position: relative;
        }
        .service-categories-swiper {
          padding-bottom: 48px;
        }
        .collection-item.style-2 {
          background: #fff;
          border-radius: 22px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.07);
          border: 1px solid #f0f0f0;
          transition: box-shadow 0.2s, transform 0.2s;
          min-height: 480px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .collection-item.style-2:hover {
          box-shadow: 0 8px 32px rgba(0,0,0,0.13);
          transform: translateY(-4px) scale(1.03);
        }
        .collection-inner {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
        }
        .collection-image {
          width: 100%;
          height: 540px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          border-radius: 18px;
          margin-bottom: 1.2rem;
        }
        .collection-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 18px;
          transition: transform 0.2s;
        }
        .collection-item.style-2:hover .collection-image img {
          transform: scale(1.07);
        }
        .collection-content {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .collection-title {
          display: inline-flex;
          align-items: center;
          background: #f5f6fa;
          color: #222;
          font-size: 1.25rem;
          font-weight: 600;
          border-radius: 999px;
          padding: 0.7rem 2.2rem;
          text-decoration: none;
          margin-bottom: 0.5rem;
          transition: background 0.2s, color 0.2s;
          box-shadow: 0 2px 12px rgba(0,0,0,0.08);
        }
        .collection-title:hover {
          background: #6c63ff;
          color: #fff;
        }
        .collection-title .icon {
          font-size: 1.2rem;
          margin-left: 0.5rem;
        }
        .nav-sw {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 2;
          background: #fff;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          width: 46px;
          height: 46px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.2s;
        }
        .nav-next-slider {
          right: -23px;
        }
        .nav-prev-slider {
          left: -23px;
        }
        .nav-sw:hover {
          background: #f5f6fa;
        }
        .sw-pagination-collection {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 10px;
        }
        :global(.sw-pagination-collection .swiper-pagination-bullet) {
          width: 12px;
          height: 12px;
          background: #6c63ff;
          opacity: 0.3;
          border-radius: 50%;
          margin: 0 3px;
          transition: opacity 0.2s, background 0.2s;
        }
        :global(.sw-pagination-collection .swiper-pagination-bullet-active) {
          background: #6c63ff;
          opacity: 1;
        }
        @media (max-width: 1200px) {
          .collection-item.style-2 {
            min-height: 320px;
          }
          .collection-image {
            height: 320px;
          }
          .collection-title {
            font-size: 1rem;
            padding: 0.5rem 1.2rem;
          }
        }
        @media (max-width: 900px) {
          .service-slider-title .title {
            font-size: 1.1rem;
          }
          .collection-item.style-2 {
            min-height: 180px;
          }
          .collection-image {
            height: 90px;
          }
          .collection-title {
            font-size: 0.92rem;
            padding: 0.4rem 0.8rem;
          }
        }
      `}</style>
    </section>
  );
}

export default ServiceIcons;
