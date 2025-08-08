// src/components/home/ShopCollection.tsx
import Link from "next/link";

const ShopCollection = () => (
  <section className="flat-spacing-19">
    <div className="container">
      <div className="tf-grid-layout md-col-2   style-1">
        <div className="tf-image-wrap wow fadeInUp" data-wow-delay="0s">
          <img
            className="lazyload"
            data-src="/assets/site/images/collections/pabuc.jpg"
            src="/assets/site/images/collections/pabuc.jpg"
            alt="collection-img"
          />
        </div>
        <div className="tf-content-wrap wow fadeInUp" data-wow-delay="0s">
          <div className="heading">
            Modayı Yeniden <br /> Tanımlayalım
          </div>

          <Link
            href="/shop-collection-list"
            className="tf-btn style-2 btn-fill rounded-full animate-hover-btn"
          >
            Keşfet ➤
          </Link>
        </div>
      </div>
    </div>
  </section>
);

export default ShopCollection;
