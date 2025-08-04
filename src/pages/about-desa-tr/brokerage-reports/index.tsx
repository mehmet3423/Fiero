
import AboutDesaTrLayout from "../_layout";
import styles from "../../../styles/AboutDesa.module.css";

export default function Page() {
  return (
    <AboutDesaTrLayout>
      <div className={`${styles["flatpage-text"]} ${styles["flatpage-text--link"]}`}>
        <h1><strong>ARACI KURUM RAPORLARI</strong></h1>

        <div className={styles["corporate-links"]}>
          <p>
            ● <a href="https://www.desa.com.tr/desa-yi-yakindan-taniyalim/" rel="noopener noreferrer" target="_blank">İnfo Yatırım Menkul Değerler Yakından Tanıyalım Programı: “DESA Deri’yi Yakından Tanıyalım</a>
          </p>
          <p>
            ● <a href="https://14231c.cdn.akinoncloud.com/cms/2023/07/10/3e3c8f0b-1f54-4716-9239-6f1566e63e74.pdf" rel="noopener noreferrer" target="_blank">TFG İstanbul Menkul – DESA Company Report –  ENG – July 2023</a>
          </p>
          <p>
            ● <a href="https://14231c.cdn.akinoncloud.com/cms/2023/07/10/9c1d980d-4271-45d3-9d0e-aa0a3579a540.pdf" rel="noopener noreferrer" target="_blank">TFG İstanbul Menkul Değerler –  DESA Şirket Raporu – TR – Temmuz 2023</a>
          </p>
          <p>
            ● <a href="https://14231c.cdn.akinoncloud.com/cms/2023/06/08/71f26ed1-99f7-44cf-b27c-fb8d8d497246.pdf" rel="noopener noreferrer" target="_blank">Tacirler Yatırım DESA Company Report –  ENG – May 2023</a>
          </p>
          <p>
            ● <a href="https://14231c.cdn.akinoncloud.com/cms/2023/06/08/c3c46470-b747-4f43-bd58-f95a0eb2ef46.pdf" rel="noopener noreferrer" target="_blank">Tacirler Yatırım DESA Şirket Raporu – TR – Mayıs 2023</a>
          </p>
          <p>
            ● <a href="https://14231c.cdn.akinoncloud.com/cms/2023/06/06/ce93d51a-4760-44bd-9386-54682400f3fc.pdf" rel="noopener noreferrer" target="_blank">Tacirler Yatırım Model Portföyü</a>
          </p>
        </div>
      </div>
    </AboutDesaTrLayout>
  );
}
