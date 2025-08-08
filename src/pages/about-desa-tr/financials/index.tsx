
import AboutDesaTrLayout from "../_layout";
import styles from "../../../styles/AboutDesa.module.css";

export default function Page() {
  return (
    <AboutDesaTrLayout>
      <div className={`${styles["flatpage-text"]} ${styles["flatpage-text--link"]}`}>
        <h2>Finansal Bilgiler (Taslak)</h2>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Bu sayfa taslak olarak hazırlanmıştır.</p>
        <p>Finansal bilgiler yakında burada yer alacaktır.</p>
        <ul>
          <li>2025 Finansal Bilgi - Hazırlanıyor</li>
          <li>2024 Finansal Bilgi - Taslak</li>
        </ul>
        <p>Güncellemeler için lütfen daha sonra tekrar kontrol edin.</p>
      </div>
    </AboutDesaTrLayout>
  );
}
