
import AboutDesaTrLayout from "../_layout";
import styles from "../../../styles/AboutDesa.module.css";

export default function Page() {
  return (
    <AboutDesaTrLayout>
      <div className={styles["flatpage-text"]}>
        <h2 className="text-center">Genel Kurul (Taslak)</h2>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Bu sayfa taslak olarak hazırlanmıştır.</p>
        <p>Genel kurul bilgileri yakında burada yer alacaktır.</p>
        <ul>
          <li>2025 Genel Kurul - Hazırlanıyor</li>
          <li>2024 Genel Kurul - Taslak</li>
        </ul>
        <p>Güncellemeler için lütfen daha sonra tekrar kontrol edin.</p>
      </div>
    </AboutDesaTrLayout>
  );
}
