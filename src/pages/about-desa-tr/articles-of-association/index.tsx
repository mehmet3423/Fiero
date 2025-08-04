
import AboutDesaTrLayout from "../_layout";
import styles from "../../../styles/AboutDesa.module.css";

export default function Page() {
  return (
    <AboutDesaTrLayout>
      <div className={styles["flatpage-text"]}>
          <h1><strong>Ana Sözleşme</strong></h1>
          <div className={styles["corporate-links"]}>
            <p>
              <a
                href="https://akn-desa.a-cdn.akinoncloud.com/cms/2025/01/21/e735b76b-8a86-4b4e-89c5-89ceaa8de62f.pdf"
                rel="noopener noreferrer"
                target="_blank"
              >
                Ana sözleşme için tıklayınız.
              </a>
            </p>
          </div>
        </div>
    </AboutDesaTrLayout>
  );
}
