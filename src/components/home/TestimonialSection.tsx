import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Controller } from 'swiper/modules';
import Link from 'next/link';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface TestimonialItem {
  id: number;
  text: string;
  authorName: string;
  authorImage: string;
  purchaseItem: string;
  purchaseLink: string;
}

interface TestimonialImage {
  id: number;
  image1: string;
  image2: string;
}

const TestimonialSection: React.FC = () => {
  const [firstSwiper, setFirstSwiper] = useState<any>(null);
  const [secondSwiper, setSecondSwiper] = useState<any>(null);
  
  const testimonials: TestimonialItem[] = [
    {
      id: 1,
      text: "The shipping is always fast and the customer service team is friendly and helpful. I highly recommend this site to anyone looking for affordable clothing.",
      authorName: "Robert smith",
      authorImage: "/assets/site/images/slider/te4.jpg",
      purchaseItem: "Boxy T-shirt",
      purchaseLink: "/product-detail"
    },
    {
      id: 2,
      text: "The shipping is always fast and the customer service team is friendly and helpful. I highly recommend this site to anyone looking for affordable clothing.",
      authorName: "Jenifer Unix",
      authorImage: "/assets/site/images/slider/te6.jpg",
      purchaseItem: "Sweetheart-neckline Top",
      purchaseLink: "/product-detail"
    }
  ];

  const testimonialImages: TestimonialImage[] = [
    {
      id: 1,
      image1: "/assets/site/images/slider/te4.jpg",
      image2: "/assets/site/images/slider/te3.jpg"
    },
    {
      id: 2,
      image1: "/assets/site/images/slider/te6.jpg",
      image2: "/assets/site/images/slider/te5.jpg"
    }
  ];

  return (
    <section className="flat-testimonial-v2 py-0 wow fadeInUp" data-wow-delay="0s">
      <div className="container">
        <div className="wrapper-thumbs-testimonial-v2 type-1 flat-thumbs-testimonial">
          <div className="box-left">
            <Swiper
              modules={[Navigation, Pagination, Controller]}
              slidesPerView={1}
              spaceBetween={40}
              speed={800}
              controller={{ control: secondSwiper }}
              onSwiper={setFirstSwiper}
              navigation={{
                nextEl: ".nav-next-tes-2",
                prevEl: ".nav-prev-tes-2",
              }}
              pagination={{ 
                clickable: true, 
                el: ".sw-pagination-tes-2" 
              }}
              breakpoints={{
                768: { spaceBetween: 30 },
                1024: { spaceBetween: 40 }
              }}
              className="tf-sw-tes-2"
            >
              {testimonials.map((testimonial) => (
                <SwiperSlide key={testimonial.id}>
                  <div className="testimonial-item lg lg-2">
                    <div className="icon">
                      <img 
                        className="lazyloaded" 
                        data-src="/assets/site/images/item/quote.svg" 
                        src="/assets/site/images/item/quote.svg" 
                        alt="quote"
                      />
                    </div>
                    <div className="heading fs-12 mb_18">PEOPLE ARE TALKING</div>
                    <div className="rating">
                      <i className="icon-start"></i>
                      <i className="icon-start"></i>
                      <i className="icon-start"></i>
                      <i className="icon-start"></i>
                      <i className="icon-start"></i>
                    </div>
                    <p className="text">
                      {testimonial.text}
                    </p>
                    <div className="author box-author">
                      <div className="box-img d-md-none rounded-0">
                        <img 
                          className="lazyload img-product" 
                          data-src={testimonial.authorImage} 
                          src={testimonial.authorImage} 
                          alt="image-product" 
                        />
                      </div>
                      <div className="content">
                        <div className="name">{testimonial.authorName}</div>
                        <Link href={testimonial.purchaseLink} className="metas link">
                          Purchase item : <span>{testimonial.purchaseItem}</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            <div className="d-md-flex d-none box-sw-navigation">
              <div className="nav-sw nav-next-slider nav-next-tes-2">
                <span className="icon icon-arrow-left"></span>
              </div>
              <div className="nav-sw nav-prev-slider nav-prev-tes-2">
                <span className="icon icon-arrow-right"></span>
              </div>
            </div>
            <div className="d-md-none sw-dots style-2 sw-pagination-tes-2"></div>
          </div>
          <div className="box-right">
            <Swiper
              modules={[Controller]}
              slidesPerView={1}
              spaceBetween={30}
              speed={800}
              controller={{ control: firstSwiper }}
              onSwiper={setSecondSwiper}
              allowTouchMove={false}
              className="tf-thumb-tes"
            >
              {testimonialImages.map((imageSet) => (
                <SwiperSlide key={imageSet.id}>
                  <div className="grid-img-group style-ter-1">
                    <div className="box-img item-1 hover-img">
                      <div className="img-style">
                        <img 
                          className="lazyload" 
                          data-src={imageSet.image1} 
                          src={imageSet.image1} 
                          alt="img-slider" 
                        />
                      </div>
                    </div>
                    <div className="box-img item-2 hover-img">
                      <div className="img-style">
                        <img 
                          className="lazyload" 
                          data-src={imageSet.image2} 
                          src={imageSet.image2} 
                          alt="img-slider" 
                        />
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
