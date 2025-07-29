import Head from "next/head";

const DeliveryReturn = () => {
  return (
    <>
      <Head>
        <title>Delivery Return</title>
      </Head>
      <div className="tf-page-title style-2">
        <div className="container-full">
          <div className="heading text-center">Delivery Return</div>
        </div>
      </div>
      <section className="flat-spacing-25">
        <div className="container">
          <div className="tf-main-area-page tf-page-delivery">
            <div className="box">
              <h4>Delivery</h4>
              <ul className="tag-list">
                <li>All orders shipped with UPS Express.</li>
                <li>Always free shipping for orders over US $250.</li>
                <li>All orders are shipped with a UPS tracking number.</li>
              </ul>
            </div>
            <div className="box">
              <h4>Returns</h4>
              <ul className="tag-list">
                <li>Items returned within 14 days of their original shipment date in same as new condition will be eligible for a full refund or store credit.</li>
                <li>Refunds will be charged back to the original form of payment used for purchase.</li>
                <li>Customer is responsible for shipping charges when making returns and shipping/handling fees of original purchase is non-refundable.</li>
                <li>All sale items are final purchases.</li>
              </ul>
            </div>
            <div className="box">
              <h4>Help</h4>
              <p>Give us a shout if you have any other questions and/or concerns.</p>
              <p className="text_black-2">Email: contact@domain.com</p>
              <p className="text_black-2">Phone: +1 (23) 456 789</p>
            </div>
          </div>
        </div>
      </section>
      <style jsx>{`
        .tf-page-title {
          background: linear-gradient(120deg, #f8fafc 0%, #f6fafd 100%);
          padding: 70px 0 30px 0;
          margin-bottom: 0;
        }
        .container-full {
          width: 100vw;
          max-width: 100vw;
          margin: 0 auto;
        }
        .heading.text-center {
          font-size: 2.8rem;
          font-weight: 700;
          text-align: center;
          color: #222;
          margin: 0 auto;
          letter-spacing: -0.01em;
        }
        .flat-spacing-25 {
          padding: 0 0 40px 0;
        }
        .container {
          max-width: 900px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }
        .tf-main-area-page.tf-page-delivery {
          margin-top: 30px;
        }
        .box {
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 2px 16px rgba(0,0,0,0.04);
          padding: 32px 32px 24px 32px;
          margin-bottom: 28px;
        }
        .box h4 {
          font-size: 1.35rem;
          font-weight: 700;
          margin-bottom: 16px;
          color: #222;
        }
        .tag-list {
          list-style: disc inside;
          padding-left: 0;
          margin-bottom: 0;
        }
        .tag-list li {
          font-size: 1.08rem;
          color: #444;
          margin-bottom: 8px;
          line-height: 1.7;
        }
        .text_black-2 {
          color: #222;
          font-weight: 500;
        }
        @media (max-width: 700px) {
          .tf-page-title {
            padding: 40px 0 18px 0;
          }
          .box {
            padding: 18px 10px 14px 10px;
          }
          .container {
            padding: 0 0.5rem;
          }
          .heading.text-center {
            font-size: 2rem;
          }
        }
      `}</style>
    </>
  );
};

export default DeliveryReturn;
