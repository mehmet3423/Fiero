import React, { useEffect } from "react";
import Swiper from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const RecentlyViewed: React.FC = () => {
  useEffect(() => {
    new Swiper(".tf-sw-recent", {
      slidesPerView: 4,
      spaceBetween: 30,
      navigation: {
        nextEl: ".nav-next-recent",
        prevEl: ".nav-prev-recent",
      },
      pagination: {
        el: ".sw-pagination-recent",
        clickable: true,
      },
      breakpoints: {
        1024: {
          slidesPerView: 4,
          spaceBetween: 30,
        },
        768: {
          slidesPerView: 3,
          spaceBetween: 15,
        },
        480: {
          slidesPerView: 2,
          spaceBetween: 10,
        },
      },
    });
  }, []);

  return (
    <section className="flat-spacing-4 pt_0">
      <div className="container">
        <div className="flat-title">
          <span className="title">Recently Viewed</span>
        </div>
        <div className="hover-sw-nav hover-sw-2">
          <div className="swiper tf-sw-recent wrap-sw-over">
            <div className="swiper-wrapper">
              {/* Product 1 */}
              <div className="swiper-slide">
                <div className="card-product">
                  <div className="card-product-wrapper">
                    <a href="product-detail.html" className="product-img">
                      <img
                        className="img-product"
                        src="/assets/site/images/products/light-green-1.jpg"
                        alt="product"
                      />
                      <img
                        className="img-hover"
                        src="/assets/site/images/products/light-green-2.jpg"
                        alt="product hover"
                      />
                    </a>
                    <div className="list-product-btn">
                      <a
                        href="product-description-vertical.html#quick_add"
                        data-bs-toggle="modal"
                        className="box-icon bg_white quick-add tf-btn-loading"
                      >
                        <span className="icon icon-bag"></span>
                        <span className="tooltip">Quick Add</span>
                      </a>
                      <a
                        href="javascript:void(0);"
                        className="box-icon bg_white wishlist btn-icon-action"
                      >
                        <span className="icon icon-heart"></span>
                        <span className="tooltip">Add to Wishlist</span>
                      </a>
                      <a
                        href="product-description-vertical.html#compare"
                        data-bs-toggle="offcanvas"
                        aria-controls="offcanvasLeft"
                        className="box-icon bg_white compare btn-icon-action"
                      >
                        <span className="icon icon-compare"></span>
                        <span className="tooltip">Add to Compare</span>
                      </a>
                      <a
                        href="product-description-vertical.html#quick_view"
                        data-bs-toggle="modal"
                        className="box-icon bg_white quickview tf-btn-loading"
                      >
                        <span className="icon icon-view"></span>
                        <span className="tooltip">Quick View</span>
                      </a>
                    </div>
                  </div>
                  <div className="card-product-info">
                    <a href="product-detail.html" className="title link">
                      Loose Fit Sweatshirt
                    </a>
                    <span className="price">$10.00</span>
                    <ul className="list-color-product">
                      <li className="list-color-item color-swatch active">
                        <span className="tooltip">Light Green</span>
                        <span className="swatch-value bg_light-green"></span>
                        <img
                          className="img-product"
                          src="/assets/site/images/products/light-green-1.jpg"
                          alt="color swatch"
                          style={{
                            width: "50px",
                            height: "50px",
                            objectFit: "cover",
                          }}
                        />
                      </li>
                      <li className="list-color-item color-swatch">
                        <span className="tooltip">Black</span>
                        <span className="swatch-value bg_dark"></span>
                        <img
                          className="img-product"
                          src="/assets/site/images/products/black-3.jpg"
                          alt="color swatch"
                          style={{
                            width: "50px",
                            height: "50px",
                            objectFit: "cover",
                          }}
                        />
                      </li>
                      <li className="list-color-item color-swatch">
                        <span className="tooltip">Blue</span>
                        <span className="swatch-value bg_blue-2"></span>
                        <img
                          className="img-product"
                          src="/assets/site/images/products/blue.jpg"
                          alt="color swatch"
                          style={{
                            width: "50px",
                            height: "50px",
                            objectFit: "cover",
                          }}
                        />
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              {/* Product 2 */}
              <div className="swiper-slide">
                <div className="card-product">
                  <div className="card-product-wrapper">
                    <a href="product-detail.html" className="product-img">
                      <img
                        className="img-product"
                        src="/assets/site/images/products/brown-2.jpg"
                        alt="product"
                      />
                      <img
                        className="img-hover"
                        src="/assets/site/images/products/brown-3.jpg"
                        alt="product hover"
                      />
                    </a>
                    <div className="list-product-btn">
                      <a
                        href="product-description-vertical.html#quick_add"
                        data-bs-toggle="modal"
                        className="box-icon bg_white quick-add tf-btn-loading"
                      >
                        <span className="icon icon-bag"></span>
                        <span className="tooltip">Quick Add</span>
                      </a>
                      <a
                        href="javascript:void(0);"
                        className="box-icon bg_white wishlist btn-icon-action"
                      >
                        <span className="icon icon-heart"></span>
                        <span className="tooltip">Add to Wishlist</span>
                      </a>
                      <a
                        href="product-description-vertical.html#compare"
                        data-bs-toggle="offcanvas"
                        aria-controls="offcanvasLeft"
                        className="box-icon bg_white compare btn-icon-action"
                      >
                        <span className="icon icon-compare"></span>
                        <span className="tooltip">Add to Compare</span>
                      </a>
                      <a
                        href="product-description-vertical.html#quick_view"
                        data-bs-toggle="modal"
                        className="box-icon bg_white quickview tf-btn-loading"
                      >
                        <span className="icon icon-view"></span>
                        <span className="tooltip">Quick View</span>
                      </a>
                    </div>
                  </div>
                  <div className="card-product-info">
                    <a href="product-detail.html" className="title link">
                      V-neck linen T-shirt
                    </a>
                    <span className="price">$114.95</span>
                    <ul className="list-color-product">
                      <li className="list-color-item color-swatch active">
                        <span className="tooltip">Brown</span>
                        <span className="swatch-value bg_brown"></span>
                        <img
                          className="img-product"
                          src="/assets/site/images/products/brown-2.jpg"
                          alt="color swatch"
                          style={{
                            width: "50px",
                            height: "50px",
                            objectFit: "cover",
                          }}
                        />
                      </li>
                      <li className="list-color-item color-swatch">
                        <span className="tooltip">White</span>
                        <span className="swatch-value bg_white"></span>
                        <img
                          className="img-product"
                          src="/assets/site/images/products/white-5.jpg"
                          alt="color swatch"
                          style={{
                            width: "50px",
                            height: "50px",
                            objectFit: "cover",
                          }}
                        />
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              {/* Product 3 */}
              <div className="swiper-slide">
                <div className="card-product">
                  <div className="card-product-wrapper">
                    <a href="product-detail.html" className="product-img">
                      <img
                        className="img-product"
                        src="/assets/site/images/products/white-2.jpg"
                        alt="product"
                      />
                      <img
                        className="img-hover"
                        src="/assets/site/images/products/pink-1.jpg"
                        alt="product hover"
                      />
                    </a>
                    <div className="list-product-btn">
                      <a
                        href="product-description-vertical.html#quick_add"
                        data-bs-toggle="modal"
                        className="box-icon bg_white quick-add tf-btn-loading"
                      >
                        <span className="icon icon-bag"></span>
                        <span className="tooltip">Quick Add</span>
                      </a>
                      <a
                        href="javascript:void(0);"
                        className="box-icon bg_white wishlist btn-icon-action"
                      >
                        <span className="icon icon-heart"></span>
                        <span className="tooltip">Add to Wishlist</span>
                      </a>
                      <a
                        href="product-description-vertical.html#compare"
                        data-bs-toggle="offcanvas"
                        aria-controls="offcanvasLeft"
                        className="box-icon bg_white compare btn-icon-action"
                      >
                        <span className="icon icon-compare"></span>
                        <span className="tooltip">Add to Compare</span>
                      </a>
                      <a
                        href="product-description-vertical.html#quick_view"
                        data-bs-toggle="modal"
                        className="box-icon bg_white quickview tf-btn-loading"
                      >
                        <span className="icon icon-view"></span>
                        <span className="tooltip">Quick View</span>
                      </a>
                    </div>
                  </div>
                  <div className="card-product-info">
                    <a href="product-detail.html" className="title link">
                      Oversized Printed T-shirt
                    </a>
                    <span className="price">$16.95</span>
                    <ul className="list-color-product">
                      <li className="list-color-item color-swatch active">
                        <span className="tooltip">White</span>
                        <span className="swatch-value bg_white"></span>
                        <img
                          className="img-product"
                          src="/assets/site/images/products/white-2.jpg"
                          alt="color swatch"
                          style={{
                            width: "50px",
                            height: "50px",
                            objectFit: "cover",
                          }}
                        />
                      </li>
                      <li className="list-color-item color-swatch">
                        <span className="tooltip">Pink</span>
                        <span className="swatch-value bg_pink"></span>
                        <img
                          className="img-product"
                          src="/assets/site/images/products/pink-1.jpg"
                          alt="color swatch"
                          style={{
                            width: "50px",
                            height: "50px",
                            objectFit: "cover",
                          }}
                        />
                      </li>
                      <li className="list-color-item color-swatch">
                        <span className="tooltip">Black</span>
                        <span className="swatch-value bg_dark"></span>
                        <img
                          className="img-product"
                          src="/assets/site/images/products/black-2.jpg"
                          alt="color swatch"
                          style={{
                            width: "50px",
                            height: "50px",
                            objectFit: "cover",
                          }}
                        />
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              {/* Product 4 */}
              <div className="swiper-slide">
                <div className="card-product">
                  <div className="card-product-wrapper">
                    <a href="product-detail.html" className="product-img">
                      <img
                        className="img-product"
                        src="/assets/site/images/products/white-3.jpg"
                        alt="product"
                      />
                      <img
                        className="img-hover"
                        src="/assets/site/images/products/white-4.jpg"
                        alt="product hover"
                      />
                    </a>
                    <div className="list-product-btn">
                      <a
                        href="product-description-vertical.html#quick_add"
                        data-bs-toggle="modal"
                        className="box-icon bg_white quick-add tf-btn-loading"
                      >
                        <span className="icon icon-bag"></span>
                        <span className="tooltip">Quick Add</span>
                      </a>
                      <a
                        href="javascript:void(0);"
                        className="box-icon bg_white wishlist btn-icon-action"
                      >
                        <span className="icon icon-heart"></span>
                        <span className="tooltip">Add to Wishlist</span>
                      </a>
                      <a
                        href="product-description-vertical.html#compare"
                        data-bs-toggle="offcanvas"
                        aria-controls="offcanvasLeft"
                        className="box-icon bg_white compare btn-icon-action"
                      >
                        <span className="icon icon-compare"></span>
                        <span className="tooltip">Add to Compare</span>
                      </a>
                      <a
                        href="product-description-vertical.html#quick_view"
                        data-bs-toggle="modal"
                        className="box-icon bg_white quickview tf-btn-loading"
                      >
                        <span className="icon icon-view"></span>
                        <span className="tooltip">Quick View</span>
                      </a>
                    </div>
                  </div>
                  <div className="card-product-info">
                    <a href="product-detail.html" className="title link">
                      Oversized Printed T-shirt
                    </a>
                    <span className="price">$10.00</span>
                    <ul className="list-color-product">
                      <li className="list-color-item color-swatch active">
                        <span className="tooltip">White</span>
                        <span className="swatch-value bg_white"></span>
                        <img
                          className="img-product"
                          src="/assets/site/images/products/white-3.jpg"
                          alt="color swatch"
                          style={{
                            width: "50px",
                            height: "50px",
                            objectFit: "cover",
                          }}
                        />
                      </li>
                      <li className="list-color-item color-swatch">
                        <span className="tooltip">Black</span>
                        <span className="swatch-value bg_dark"></span>
                        <img
                          className="img-product"
                          src="/assets/site/images/products/black-1.jpg"
                          alt="color swatch"
                          style={{
                            width: "50px",
                            height: "50px",
                            objectFit: "cover",
                          }}
                        />
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="nav-sw nav-next-slider nav-next-recent box-icon w_46 round">
            <span className="icon icon-arrow-left"></span>
          </div>
          <div className="nav-sw nav-prev-slider nav-prev-recent box-icon w_46 round">
            <span className="icon icon-arrow-right"></span>
          </div>
          <div className="sw-dots style-2 sw-pagination-recent justify-content-center"></div>
        </div>
      </div>
    </section>
  );
};

export default RecentlyViewed;
