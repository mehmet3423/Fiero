
import AboutDesaTrLayout from "../_layout";
import styles from "../../../styles/AboutDesa.module.css";

export default function Page() {
  return (
    <AboutDesaTrLayout>
      <div className={`${styles["flatpage-text"]} ${styles["flatpage-text--link"]}`}>
        <h1><strong>YATIRIMCI İLİŞKİLERİ İLETİŞİM</strong></h1>
        <p>
          <span>E-posta: </span>
          <a href="mailto:yatirimci.iliskileri@desa.com.tr" rel="noopener noreferrer" target="_blank">yatirimci.iliskileri@desa.com.tr</a>
          {' '} &amp; {' '}
          <a href="mailto:investor.relations@desa.com.tr" rel="noopener noreferrer" target="_blank">investor.relations@desa.com.tr</a>
        </p>
      </div>
    </AboutDesaTrLayout>
  );
}
