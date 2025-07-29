// src/components/home/ShopCollection.tsx
import Image from "next/image";
import Link from "next/link";

const ShopCollection = () => (
  <section className="shop-collection-section">
    <div className="shop-collection-modern-bg">
      <div className="shop-collection-modern">
        <div className="shop-collection-modern-img">
          <Image
            src="/assets/site/images/collections/collection-58.jpg"
            alt="collection-img"
            width={900}
            height={900}
            className="shop-collection-img"
            unoptimized
          />
        </div>
        <div className="shop-collection-modern-content">
          <div className="shop-collection-heading">
            Redefining Fashion <br /> Excellence
          </div>
          <p className="shop-collection-desc">
            Here is your chance to upgrade your wardrobe with a variation of styles
          </p>
          <Link href="/blog" legacyBehavior>
            <button type="button" className="shop-collection-btn">
              Read our stories
            </button>
          </Link>
        </div>
      </div>
    </div>
    <style jsx>{`
      .shop-collection-section {
        padding: 2.5rem 0 2.5rem 0;
        background: #fff;
      }
      .shop-collection-modern-bg {
        background: #f7f7f7;
        border-radius: 0.8rem;
        max-width: 98vw;
        margin: 0 auto;
        padding: 0;
      }
      .shop-collection-modern {
        display: flex;
        flex-direction: row;
        align-items: stretch;
        min-height: 600px;
        max-width: 1700px;
        margin: 0 auto;
        background: none;
        border-radius: 0.8rem;
        overflow: hidden;
      }
      .shop-collection-modern-img {
        flex: 1 1 0;
        min-width: 0;
        display: flex;
        align-items: stretch;
        justify-content: flex-end;
        background: none;
        border-radius: 0.8rem 0 0 0.8rem;
        overflow: hidden;
      }
      .shop-collection-img {
        width: 100%;
        height: 100%;
        min-height: 600px;
        max-height: 900px;
        object-fit: cover;
        border-radius: 0.8rem 0 0 0.8rem;
        display: block;
      }
      .shop-collection-modern-content {
        flex: 1 1 0;
        min-width: 0;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
        padding: 4.5rem 4vw 4.5rem 4vw;
        background: #f7f7f7;
        border-radius: 0 0.8rem 0.8rem 0;
      }
      .shop-collection-heading {
        font-size: 3.2rem;
        font-weight: 700;
        color: #181818;
        line-height: 1.1;
        margin-bottom: 2.2rem;
      }
      .shop-collection-desc {
        font-size: 1.18rem;
        color: #444;
        margin-bottom: 2.2rem;
      }
      .shop-collection-btn {
        display: inline-block;
        background: #000 !important;
        color: #fff !important;
        font-size: 0.98rem;
        font-weight: 500;
        border-radius: 999px;
        padding: 0.62rem 1.45rem;
        text-decoration: none;
        transition: background 0.18s, color 0.18s, box-shadow 0.18s, transform 0.18s;
        box-shadow: 0 2px 12px rgba(0,0,0,0.10);
        border: none;
        letter-spacing: 0.01em;
        cursor: pointer;
        outline: none;
      }
      .shop-collection-btn:hover, .shop-collection-btn:focus {
        background: #222 !important;
        color: #fff !important;
        transform: translateY(-2px) scale(1.04);
        box-shadow: 0 4px 18px rgba(0,0,0,0.13);
      }
      .shop-collection-btn:hover {
        background: #333;
        color: #fff;
      }
      @media (max-width: 1200px) {
        .shop-collection-modern {
          min-height: 400px;
        }
        .shop-collection-img {
          min-height: 400px;
        }
        .shop-collection-modern-content {
          padding: 2.2rem 2vw 2.2rem 2vw;
        }
        .shop-collection-heading {
          font-size: 2.1rem;
        }
      }
      @media (max-width: 900px) {
        .shop-collection-modern {
          flex-direction: column;
          min-height: 0;
        }
        .shop-collection-modern-img {
          border-radius: 0.8rem 0.8rem 0 0;
        }
        .shop-collection-img {
          min-height: 220px;
          max-height: 320px;
          border-radius: 0.8rem 0.8rem 0 0;
        }
        .shop-collection-modern-content {
          border-radius: 0 0 0.8rem 0.8rem;
        }
      }
    `}</style>
  </section>
);

export default ShopCollection;