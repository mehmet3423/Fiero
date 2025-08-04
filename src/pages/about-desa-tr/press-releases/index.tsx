
import AboutDesaTrLayout from "../_layout";
import styles from "../../../styles/AboutDesa.module.css";

export default function Page() {
  return (
    <AboutDesaTrLayout>
      <div className={`${styles["flatpage-text"]} ${styles["flatpage-text--link"]}`}>
        <h1><strong>BASIN BÜLTENLERİ</strong></h1>

        <p><strong>2025</strong></p>
        <div className={styles["corporate-links"]}>
          <p>
            <a href="https://akn-desa.a-cdn.akinoncloud.com/cms/2025/06/04/d15f1a65-fe81-4b28-a587-764e92a46df0.pdf" rel="noopener noreferrer" target="_blank">1. ÇEYREK</a>
          </p>
        </div>

        <p><strong>2024</strong></p>
        <div className={styles["corporate-links"]}>
          <p>
            <a href="https://akn-desa.a-cdn.akinoncloud.com/cms/2025/01/21/13277fc5-3344-4a12-b18b-584facbf42c4.pdf" rel="noopener noreferrer" target="_blank">2. ÇEYREK</a>
            &nbsp;●&nbsp;
            <a href="https://akn-desa.a-cdn.akinoncloud.com/cms/2025/01/21/353ba761-2dc8-43a5-afb6-cec53bc51cf0.pdf" rel="noopener noreferrer" target="_blank">3. ÇEYREK</a>
            &nbsp;●&nbsp;
            <a href="https://akn-desa.a-cdn.akinoncloud.com/cms/2025/03/21/bb003fad-9f26-4186-8781-8f787aa717d8.pdf" rel="noopener noreferrer" target="_blank">YILLIK</a>
          </p>
        </div>

        <p><strong>2023</strong></p>
        <div className={styles["corporate-links"]}>
          <p>
            <a href="https://14231c.cdn.akinoncloud.com/cms/2023/08/08/aac31757-002a-468a-8e18-840da52526dc.pdf" rel="noopener noreferrer" target="_blank">2. ÇEYREK</a>
            &nbsp;●&nbsp;
            <a href="https://akn-desa.a-cdn.akinoncloud.com/cms/2023/11/01/e1b25103-164b-46c5-93a8-2fadd80fbad9.pdf" rel="noopener noreferrer" target="_blank">3. ÇEYREK</a>
            &nbsp;●&nbsp;
            <a href="https://akn-desa.a-cdn.akinoncloud.com/cms/2025/01/21/3554cdc2-01e4-4b9f-9c1d-6a9c8f9a9471.pdf" rel="noopener noreferrer" target="_blank">YILLIK</a>
          </p>
        </div>
      </div>
    </AboutDesaTrLayout>
  );
}
