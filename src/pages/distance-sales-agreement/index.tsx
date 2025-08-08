
import React from "react";

const ReturnExchangePolicyPage = () => {
  return (
    <>
      <div className="tf-page-title style-2">
        <div className="container-full">
          <div className="heading text-center">İade &amp; Değişim Politikası</div>
        </div>
      </div>
      <section className="flat-spacing-25">
        <div className="container">
          <div className="tf-main-area-page">
            <div className="flatpage__content">
              <div className="flatpage__header">
                <div className="flatpage__title flatpage__title--noimg">İade &amp; Değişim Politikası</div>
                <img className="lazyload flatpage__img" src="" alt="İade &amp; Değişim Politikası" style={{ display: "none" }} />
              </div>
              <div className="flatpage__text">
                <p>lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                </div>
            </div>
          </div>
        </div>
      </section>
      <style jsx>{`
        .tf-main-area-page {
          margin-bottom: 3rem;
          padding: 2.5rem;
          background: #fff;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          border-radius: 10px;
        }
        .flatpage__header {
          display: flex;
          align-items: center;
          margin-bottom: 2rem;
        }
        .flatpage__title {
          font-size: 1.5rem;
          font-weight: bold;
          color: #333;
          margin-bottom: 0;
        }
        .flatpage__title--noimg {
          margin-right: 1rem;
        }
        .flatpage__img {
          max-width: 80px;
          margin-left: 1rem;
        }
        .flatpage__text {
          color: #666;
          line-height: 1.6;
        }
        .flatpage__text p {
          margin-bottom: 0.7rem;
        }
      `}</style>
    </>
  );
};

export default ReturnExchangePolicyPage;
