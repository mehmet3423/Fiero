
import AboutDesaTrLayout from "../_layout";
import styles from "../../../styles/AboutDesa.module.css";

export default function Page() {
  return (
    <AboutDesaTrLayout>
      <div className={styles["flatpage-text"]}>
        <h1>Hakkımızda (Taslak)</h1>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam ac erat euismod, dictum massa at, cursus enim.</p>
        <p>Bu sayfa henüz tamamlanmamıştır. İçerik yakında eklenecektir.</p>
        <p>Proin euismod, urna eu tincidunt consectetur, nisi erat facilisis erat, vitae dictum enim sapien nec enim.</p>
        <p>Burada şirketimizin vizyonu ve misyonu hakkında bilgiler yer alacaktır.</p>
        <p>Güncellemeler için bizi takip etmeye devam edin.</p>
        <p>Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae.</p>
        <p>Bu alan, ek bilgiler ve görseller ile zenginleştirilecektir.</p>
        <p>Teşekkürler!</p>
      </div>
    </AboutDesaTrLayout>
  );
}
