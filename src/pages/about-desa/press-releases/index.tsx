import { withAboutDesaLayout } from "../_layout";
import styles from "../../../styles/AboutDesa.module.css";

function PressReleases() {
  return (
    <div style={{ width: '100%', maxWidth: 'none', border: 'none', boxShadow: 'none' }}>
      <div className={styles["flatpage-content"]} style={{ border: 'none', boxShadow: 'none' }}>
        <div className={`${styles["flatpage-text"]} ${styles["flatpage-text--link"]}`} style={{ border: 'none', boxShadow: 'none' }}>
          <p>
            <img src="/assets/site/images/collections/collection-69.jpg" alt="DESA" style={{ boxShadow: 'none', border: 'none', borderRadius: 0 }} />
          </p>
          <h1><strong>TASLAK BAŞLIK</strong></h1>
          <p>Lorem ipsum dolor sit amet, press releases taslak içerik.</p>
          <p>Rasgele metin: 44556 pressabc!</p>
          <p>Bu alan geçici olarak doldurulmuştur.</p>
          <p>Örnek yazı: test, deneme, basın, taslak.</p>
        </div>
      </div>
    </div>
  );
}

export default withAboutDesaLayout(PressReleases);
