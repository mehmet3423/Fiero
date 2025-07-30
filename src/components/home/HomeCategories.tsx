import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const HomeCategories: React.FC = () => {
  const categories = [
    { title: "New Arrivals", img: "/assets/site/images/collections/collection-circle-8.jpg", link: "/shop-collection-sub" },
    { title: "Best Sellers", img: "/assets/site/images/collections/collection-circle-9.jpg", link: "/shop-collection-sub" },
    { title: "Top Rated", img: "/assets/site/images/collections/collection-circle-10.jpg", link: "/shop-collection-sub" },
    { title: "Brands We Love", img: "/assets/site/images/collections/collection-circle-11.jpg", link: "/shop-collection-sub" },
    { title: "Trending", img: "/assets/site/images/collections/collection-circle-12.jpg", link: "/shop-collection-sub" },
    { title: "The Re-Imagined", img: "/assets/site/images/collections/collection-circle-13.jpg", link: "/shop-collection-sub" },
    { title: "Sale", img: "/assets/site/images/collections/sale.jpg", link: "/shop-collection-sub", sale: "30% off" },
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
                        <Link href={category.link} className="collection-image img-style">
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
                      <Link href={category.link} className="collection-image img-style">
                        <img 
                          className="lazyload" 
                          data-src={category.img} 
                          src={category.img} 
                          alt="collection-img" 
                        />
                      </Link>
                    )}
                    <div className="collection-content text-center">
                      <Link href={category.link} className="link title fw-6">
                        {category.title}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
              <div className="tf-shopall-wrap">
                <div className="collection-item-circle tf-shopall">
                  <Link href="/shop-collection-sub" className="collection-image img-style tf-shopall-icon">
                    <i className="icon icon-arrow1-top-left"></i>
                  </Link>
                  <div className="collection-content text-center">
                    <Link href="/shop-collection-sub" className="link title fw-6">
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
