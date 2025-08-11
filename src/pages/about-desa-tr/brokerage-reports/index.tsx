
import AboutDesaTrLayout from "../_layout";
import styles from "../../../styles/AboutDesa.module.css";

export default function Page() {
  return (
    <AboutDesaTrLayout>
      <div className={`${styles["flatpage-text"]} ${styles["flatpage-text--link"]}`}>
        <h1><strong>ARACI KURUM RAPORLARI (Taslak)</strong></h1>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Bu sayfa taslak olarak hazırlanmıştır.</p>
        <p>Aracı kurum raporları yakında burada yer alacaktır.</p>
        <ul>
          <li>2025 Aracı Kurum Raporu - Hazırlanıyor</li>
          <li>2024 Aracı Kurum Raporu - Taslak</li>
        </ul>
        <p>Güncellemeler için lütfen daha sonra tekrar kontrol edin.</p>
      </div>
    </AboutDesaTrLayout>
  );
}
