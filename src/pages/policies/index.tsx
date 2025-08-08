import React from "react";
import SEOHead from "@/components/SEO/SEOHead";

const PrivacyPolicyPage = () => {
  return (
    <>
      <SEOHead canonical="/privacy-policy" />
      {/* Page Title */}
      <div className="tf-page-title style-2">
        <div className="container-full">
          <div className="heading text-center">POLİTİKALARIMIZ - BELGELERİMİZ</div>
        </div>
      </div>
      {/* /Page Title */}

      {/* Main Page */}
      <section className="flat-spacing-25">
        <div className="container">
          <div className="tf-main-area-page">
            <p className="intro-text">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
          </div>
        </div>
      </section>
      {/* /Main Page */}

      <style jsx>{`      
        .tf-main-area-page {
          margin-bottom: 3rem;
          padding: 2.5rem;
          background: #fff;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          border-radius: 10px;
        }
        .tf-main-area-page .intro-text {
          font-size: 1.2rem;
          font-weight: 500;
          color: #444;
          margin-bottom: 1.5rem;
        }
        .tf-main-area-page p {
          margin-bottom: 1.5rem;
          color: #666;
          line-height: 1.8;
        }
        .policy-list {
          list-style-type: disc;
          margin-left: 1.5rem;
          margin-bottom: 2rem;
        }
        .policy-list li {
          margin-bottom: 0.8rem;
          color: #555;
        }
        .section-title {
          font-size: 1.5rem;
          font-weight: bold;
          color: #333;
          margin-bottom: 1rem;
        }
        .policy-links {
          list-style-type: none;
          padding: 0;
        }
        .policy-links li {
          margin-bottom: 0.8rem;
        }
        .policy-links a {
          color: black;
          text-decoration: none;
        }
        .policy-links a:hover {
          text-decoration: underline;
        }
      `}</style>
    </>
  );
};

export default PrivacyPolicyPage;
