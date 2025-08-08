
import AboutDesaTrLayout from "../_layout";
import styles from "../../../styles/AboutDesa.module.css";

export default function Page() {
  return (
    <AboutDesaTrLayout>
      <div className={styles["flatpage-text"]}>
        <h1><strong>Ana Sözleşme (Taslak)</strong></h1>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Bu sayfa taslak olarak hazırlanmıştır.</p>
        <p>Ana sözleşme içeriği yakında burada yer alacaktır.</p>
        <ul>
          <li>2025 Ana Sözleşme - Hazırlanıyor</li>
          <li>2024 Ana Sözleşme - Taslak</li>
        </ul>
        <p>Güncellemeler için lütfen daha sonra tekrar kontrol edin.</p>
      </div>
    </AboutDesaTrLayout>
  );
}
