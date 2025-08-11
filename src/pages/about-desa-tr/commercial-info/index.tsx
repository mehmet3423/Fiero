
import AboutDesaTrLayout from "../_layout";
import styles from "../../../styles/AboutDesa.module.css";

export default function Page() {
  return (
    <AboutDesaTrLayout>
      <div className={styles["flatpage-text"]}>
        <h2 className="text-center">Ticari Bilgiler (Taslak)</h2>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Bu sayfa taslak olarak hazırlanmıştır.</p>
        <p>Ticari bilgiler yakında burada yer alacaktır.</p>
        <ul>
          <li>2025 Ticari Bilgi - Hazırlanıyor</li>
          <li>2024 Ticari Bilgi - Taslak</li>
        </ul>
        <p>Güncellemeler için lütfen daha sonra tekrar kontrol edin.</p>
      </div>
    </AboutDesaTrLayout>
  );
}
