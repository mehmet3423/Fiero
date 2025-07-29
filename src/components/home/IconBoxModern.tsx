import React from "react";

const iconBoxes = [
  {
    icon: "icon-shipping",
    title: "Free Shipping",
    desc: "Free shipping over order $120",
  },
  {
    icon: "icon-payment fs-22",
    title: "Flexible Payment",
    desc: "Pay with Multiple Credit Cards",
  },
  {
    icon: "icon-return fs-22",
    title: "14 Day Returns",
    desc: "Within 30 days for an exchange",
  },
  {
    icon: "icon-suport",
    title: "Premium Support",
    desc: "Outstanding premium support",
  },
];

const IconBoxModern = () => (
  <section className="iconbox-modern-section">
    <div className="iconbox-modern-outer">
      <div className="iconbox-modern-wrapper">
        {iconBoxes.map((box, i) => (
          <div className="iconbox-modern-item" key={i}>
            <div className="iconbox-modern-icon">
              <i className={box.icon}></i>
            </div>
            <div className="iconbox-modern-content">
              <div className="iconbox-modern-title">{box.title}</div>
              <div className="iconbox-modern-desc">{box.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
    <style jsx>{`
      .iconbox-modern-section {
        width: 100%;
        background: #fff;
        padding: 2.5rem 0 1.5rem 0;
        margin: 0;
        overflow-x: hidden;
      }
      .iconbox-modern-outer {
        width: 100%;
        display: flex;
        justify-content: center;
      }
      .iconbox-modern-wrapper {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: stretch;
        gap: 1.5rem;
        width: 100%;
        max-width: 1280px;
        margin: 0 auto;
        padding: 0 16px;
        box-sizing: border-box;
      }
      .iconbox-modern-item {
        flex: 1 1 0;
        background: #fafafa;
        border-radius: 1.2rem;
        box-shadow: 0 2px 12px rgba(0,0,0,0.04);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 2.5rem 1.5rem 2rem 1.5rem;
        min-width: 0;
        max-width: 320px;
        text-align: center;
        transition: box-shadow 0.2s, transform 0.2s;
        font-size: 1.15rem;
        height: 100%;
      }
      .iconbox-modern-item:hover {
        box-shadow: 0 4px 24px rgba(0,0,0,0.10);
        transform: translateY(-4px) scale(1.03);
      }
      .iconbox-modern-icon {
        font-size: 2.8rem;
        color: #222;
        margin-bottom: 1.3rem;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .iconbox-modern-title {
        font-size: 1.35rem;
        font-weight: 700;
        color: #181818;
        margin-bottom: 0.7rem;
      }
      .iconbox-modern-desc {
        font-size: 1.08rem;
        color: #666;
        font-weight: 400;
      }
      @media (max-width: 1200px) {
        .iconbox-modern-wrapper {
          gap: 1.2rem;
          max-width: 900px;
          padding: 0 8px;
        }
        .iconbox-modern-item {
          padding: 1.5rem 0.5rem 1.2rem 0.5rem;
          max-width: 220px;
        }
        .iconbox-modern-title {
          font-size: 1.12rem;
        }
      }
      @media (max-width: 900px) {
        .iconbox-modern-wrapper {
          flex-direction: column;
          gap: 1.2rem;
          align-items: stretch;
          max-width: 95vw;
          padding: 0 4px;
        }
        .iconbox-modern-item {
          padding: 1.2rem 0.5rem 1rem 0.5rem;
          max-width: 100vw;
        }
      }
    `}</style>
  </section>
);

export default IconBoxModern;
