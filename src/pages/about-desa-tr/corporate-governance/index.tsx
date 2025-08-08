
import AboutDesaTrLayout from "../_layout";
import styles from "../../../styles/AboutDesa.module.css";

export default function Page() {
  return (
    <AboutDesaTrLayout>
      <div className={`${styles["flatpage-text"]} ${styles["flatpage-text--link"]}`}>
        <h2>Kurumsal Yönetim (Taslak)</h2>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Bu sayfa taslak olarak hazırlanmıştır.</p>
        <p>Kurumsal yönetim bilgileri yakında burada yer alacaktır.</p>
        <ul>
          <li>2025 Kurumsal Yönetim - Hazırlanıyor</li>
          <li>2024 Kurumsal Yönetim - Taslak</li>
        </ul>
        <p>Güncellemeler için lütfen daha sonra tekrar kontrol edin.</p>
      </div>
    </AboutDesaTrLayout>
  );
}
