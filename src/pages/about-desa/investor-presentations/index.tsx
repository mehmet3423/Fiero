import { withAboutDesaLayout } from "../_layout";
import styles from "../../../styles/AboutDesa.module.css";

function InvestorPresentations() {
  return (
    <div style={{ width: '100%', maxWidth: 'none', border: 'none', boxShadow: 'none' }}>
      <div className={styles["flatpage-content"]} style={{ border: 'none', boxShadow: 'none' }}>
        <div className={`${styles["flatpage-text"]} ${styles["flatpage-text--link"]}`} style={{ border: 'none', boxShadow: 'none' }}>
          <p>
            <img src="/assets/site/images/collections/collection-69.jpg" alt="DESA" style={{ boxShadow: 'none', border: 'none', borderRadius: 0 }} />
          </p>
          <h1><strong>TASLAK BAŞLIK</strong></h1>
          <p>Lorem ipsum dolor sit amet, investor presentations taslak içerik.</p>
          <p>Rasgele metin: 22334 presentationsxyz!</p>
          <p>Bu alan geçici olarak doldurulmuştur.</p>
          <p>Örnek yazı: test, deneme, sunum, taslak.</p>
        </div>
      </div>
    </div>
  );
}

export default withAboutDesaLayout(InvestorPresentations);
