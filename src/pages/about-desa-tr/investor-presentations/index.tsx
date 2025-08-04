
import AboutDesaTrLayout from "../_layout";
import styles from "../../../styles/AboutDesa.module.css";

export default function Page() {
  return (
    <AboutDesaTrLayout>
      <div className={`${styles["flatpage-text"]} ${styles["flatpage-text--link"]}`}>
        <h1><strong>YATIRIMCI SUNUMLARI</strong></h1>

        <p><strong>2025</strong></p>
        <div className={styles["corporate-links"]}>
          <p><a href="https://akn-desa.a-cdn.akinoncloud.com/cms/2025/05/30/881a2543-77f9-4ac1-8c22-732069ba1023.pdf" rel="noopener noreferrer" target="_blank">1. ÇEYREK</a></p>
        </div>

        <p><strong>2024</strong></p>
        <div className={styles["corporate-links"]}>
          <p>
            <a href="https://akn-desa.a-cdn.akinoncloud.com/cms/2024/07/19/9945394f-0394-4d99-a411-f3878e268aba.pdf" rel="noopener noreferrer" target="_blank">1. ÇEYREK</a>
            &nbsp;●&nbsp;
            <a href="https://akn-desa.a-cdn.akinoncloud.com/cms/2024/10/01/be3de37d-88ca-4738-ad72-097de14bec28.pdf" rel="noopener noreferrer" target="_blank">2. ÇEYREK</a>
            &nbsp;●&nbsp;
            <a href="https://akn-desa.a-cdn.akinoncloud.com/cms/2024/11/21/6d99897d-fc5a-4a11-b25d-015db2d682ac.pdf" rel="noopener noreferrer" target="_blank">3. ÇEYREK</a>
            &nbsp;●&nbsp;
            <a href="https://akn-desa.a-cdn.akinoncloud.com/cms/2025/05/12/20c43edc-17de-409b-86eb-4458969329cd.pdf" rel="noopener noreferrer" target="_blank">YILLIK</a>
          </p>
        </div>

        <p><strong>2023</strong></p>
        <div className={styles["corporate-links"]}>
          <p>
            <a href="https://14231c.cdn.akinoncloud.com/cms/2023/08/15/14fe6814-7efc-48ab-9a45-ddd16b05a03f.pdf" rel="noopener noreferrer" target="_blank">2. ÇEYREK</a>
            &nbsp;●&nbsp;
            <a href="https://akn-desa.a-cdn.akinoncloud.com/cms/2023/11/09/61734f70-c824-4687-acc5-a28719a51c5d.pdf" rel="noopener noreferrer" target="_blank">3. ÇEYREK</a>
            &nbsp;●&nbsp;
            <a href="https://akn-desa.a-cdn.akinoncloud.com/cms/2024/06/07/3df0cb4b-2bd4-463f-8539-a1a7186c9fee.pdf" rel="noopener noreferrer" target="_blank">YILLIK</a>
          </p>
        </div>

        <p><strong>2022</strong></p>
        <div className={styles["corporate-links"]}>
          <p>
            <a href="https://14231c.cdn.akinoncloud.com/cms/2023/05/24/09781c88-a6a5-4c7d-9363-f944fe5d199a.pdf" rel="noopener noreferrer" target="_blank">YILLIK</a>
          </p>
        </div>
      </div>
    </AboutDesaTrLayout>
  );
}
