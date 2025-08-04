import { withAboutDesaLayout } from "../_layout";
import styles from "../../../styles/AboutDesa.module.css";

function AnalystReports() {
  return (
    <div style={{ width: '100%', maxWidth: 'none' }}>
      <div className={styles["flatpage-content"]}>
        <div className={`${styles["flatpage-text"]} ${styles["flatpage-text--link"]}`}>
          <p>
            <img 
              src="/assets/site/images/about-desa/analyst-reports-banner.jpg" 
              alt="Analyst Reports"
            />
          </p>
          
          <h1><strong>ANALYST REPORTS</strong></h1>
          
          <h2 className={styles["section-title"]}>Brokerage Reports</h2>
          
          <div className={styles["corporate-links"]}>
            <p>
              <a
                href="https://14231c.cdn.akinoncloud.com/cms/2023/07/31/34683219-4398-4544-900f-e5b8d2f5856a.pdf"
                rel="noopener noreferrer"
                target="_blank"
              >
                Tacirler Yatırım – Model Portfolio – ENG
              </a>
            </p>

            <p>
              <a
                href="https://14231c.cdn.akinoncloud.com/cms/2023/07/10/3e3c8f0b-1f54-4716-9239-6f1566e63e74.pdf"
                rel="noopener noreferrer"
                target="_blank"
              >
                TFG İstanbul Menkul – DESA Company Report – ENG – July 2023
              </a>
            </p>

            <p>
              <a
                href="https://14231c.cdn.akinoncloud.com/cms/2023/06/08/71f26ed1-99f7-44cf-b27c-fb8d8d497246.pdf"
                rel="noopener noreferrer"
                target="_blank"
              >
                Tacirler Yatırım – DESA Company Report – ENG – May 2023
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withAboutDesaLayout(AnalystReports);
