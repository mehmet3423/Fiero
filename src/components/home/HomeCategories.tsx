import React from "react";
import Link from "next/link";
import Image from "next/image";
import { SORT_OPTIONS } from "@/constants/enums/SortOptions";

const HomeCategories: React.FC = () => {
  const categories = [
    {
      title: "New Arrivals",
      img: "/assets/site/images/collections/collection-circle-8.jpg",
      link: "/products",
      sortBy: SORT_OPTIONS.POPULARITY, // Yeni ürünler için popülerlik sıralaması
    },
    {
      title: "Best Sellers",
      img: "/assets/site/images/collections/collection-circle-9.jpg",
      link: "/products",
      sortBy: SORT_OPTIONS.SALES_HIGH, // En çok satanlar
    },
    {
      title: "Top Rated",
      img: "/assets/site/images/collections/collection-circle-10.jpg",
      link: "/products",
      sortBy: SORT_OPTIONS.RATING, // En iyi puanlı ürünler
    },
    {
      title: "Brands We Love",
      img: "/assets/site/images/collections/collection-circle-11.jpg",
      link: "/products",
      sortBy: SORT_OPTIONS.LIKES_HIGH, // En çok beğenilenler
    },
    {
      title: "Trending",
      img: "/assets/site/images/collections/collection-circle-12.jpg",
      link: "/products",
      sortBy: SORT_OPTIONS.POPULARITY, // Trend olanlar için popülerlik
    },
    {
      title: "The Re-Imagined",
      img: "/assets/site/images/collections/collection-circle-13.jpg",
      link: "/products",
      sortBy: SORT_OPTIONS.POPULARITY, // Yeniden tasarlananlar için popülerlik
    },
    {
      title: "Sale",
      img: "/assets/site/images/collections/sale.jpg",
      link: "/products",
      sortBy: SORT_OPTIONS.PRICE_LOW, // İndirimli ürünler için düşük fiyat
      sale: "30% off",
    },
  ];

  return (
    <section className="flat-spacing-20">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="tf-categories-wrap">
              <div className="tf-categories-container">
                {categories.map((category, index) => (
                  <div key={index} className="collection-item-circle hover-img">
                    {category.sale ? (
                      <div className="has-saleoff-wrap position-relative">
                        <Link
                          href={`${category.link}?sortBy=${category.sortBy}`}
                          className="collection-image img-style"
                        >
                          <img
                            className="lazyload"
                            data-src={category.img}
                            src={category.img}
                            alt="collection-img"
                          />
                        </Link>
                        <div className="sale-off fw-5">{category.sale}</div>
                      </div>
                    ) : (
                      <Link
                        href={`${category.link}?sortBy=${category.sortBy}`}
                        className="collection-image img-style"
                      >
                        <img
                          className="lazyload"
                          data-src={category.img}
                          src={category.img}
                          alt="collection-img"
                        />
                      </Link>
                    )}
                    <div className="collection-content text-center">
                      <Link
                        href={`${category.link}?sortBy=${category.sortBy}`}
                        className="link title fw-6"
                      >
                        {category.title}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
              <div className="tf-shopall-wrap">
                <div className="collection-item-circle tf-shopall">
                  <Link
                    href="/products"
                    className="collection-image img-style tf-shopall-icon"
                  >
                    <i className="icon icon-arrow1-top-left"></i>
                  </Link>
                  <div className="collection-content text-center">
                    <Link href="/products" className="link title fw-6">
                      Shop all
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeCategories;
