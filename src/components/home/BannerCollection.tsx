import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import Link from 'next/link';
import 'swiper/css';
import 'swiper/css/pagination';

interface BannerItem {
  id: number;
  title: string;
  image: string;
  link: string;
}

const BannerCollection: React.FC = () => {
  const bannerItems: BannerItem[] = [
    {
      id: 1,
      title: "The January Collection",
      image: "/assets/site/images/collections/collection-47.jpg",
      link: "/shop-collection-sub"
    },
    {
      id: 2,
      title: "Olympia's picks",
      image: "/assets/site/images/collections/collection-48.jpg",
      link: "/shop-collection-sub"
    }
  ];

  return (
    <section className="flat-spacing-10 pb_0">
      <div className="container">
        <Swiper
          modules={[Pagination]}
          slidesPerView={2}
          spaceBetween={30}
          pagination={{ 
            clickable: true,
            dynamicBullets: true 
          }}
          breakpoints={{
            0: { 
              slidesPerView: 1.3, 
              spaceBetween: 15 
            },
            768: { 
              slidesPerView: 2, 
              spaceBetween: 15 
            },
            1024: { 
              slidesPerView: 2, 
              spaceBetween: 30 
            }
          }}
          className="tf-sw-recent"
        >
          {bannerItems.map((item) => (
            <SwiperSlide key={item.id}>
              <div className="collection-item-v4 hover-img">
                <div className="collection-inner">
                  <Link href={item.link} className="collection-image img-style radius-10">
                    <img 
                      className="lazyload" 
                      data-src={item.image} 
                      src={item.image} 
                      alt="collection-img" 
                    />
                  </Link>
                  <div className="collection-content wow fadeInUp" data-wow-delay="0s">
                    <h5 className="heading text_white">{item.title}</h5>
                    <Link href={item.link} className="tf-btn style-3 fw-6 btn-light-icon rounded-full animate-hover-btn">
                      <span>Shop now</span>
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default BannerCollection;
