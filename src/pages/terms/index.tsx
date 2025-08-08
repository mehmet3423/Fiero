export default function TermsPage() {
  return (
    <>
      {/* Page Title */}
      <div className="tf-page-title style-2">
        <div className="container-full">
          <div className="heading text-center">Terms & Conditions</div>
        </div>
      </div>
      {/* Main Page */}
      <section className="flat-spacing-25">
        <div className="container">
          <div className="tf-main-area-page tf-terms-conditions">
            <div className="box">
              <h4>ÜYELİK SÖZLEŞMESİ</h4>
              <p>lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                

            </div>
          </div>
        </div>
      </section>
      {/* /main-page */}
      <style jsx>{`
        .tf-main-area-page {
          margin-top: 32px;
        }
        .tf-terms-conditions .box {
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 16px rgba(0,0,0,0.04);
          padding: 32px;
          margin-bottom: 32px;
        }
        .tf-terms-conditions h4 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 24px;
          color: #222;
        }
        .tf-terms-conditions h5 {
          font-size: 1.15rem;
          font-weight: 500;
          margin-bottom: 12px;
          color: #333;
        }
        .tf-terms-conditions p {
          color: #666;
          line-height: 1.7;
          margin-bottom: 16px;
        }
        @media (max-width: 768px) {
          .tf-terms-conditions .box {
            padding: 16px;
          }
        }
      `}</style>
    </>
  );
}