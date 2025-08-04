import { withAboutDesaLayout } from "../_layout";
import styles from "../../../styles/AboutDesa.module.css";

function InvestorRelationsContact() {
  return (
    <div style={{ width: '100%', maxWidth: 'none' }}>
      <div className={styles["flatpage-content"]}>
        <div className={`${styles["flatpage-text"]} ${styles["flatpage-text--link"]}`}>
          <p>
            <img src="https://akn-desa.a-cdn.akinoncloud.com/cms/2024/03/27/26a3b9e1-e7ff-41eb-9e78-ef48cccd67b5.jpe" alt="Investor Relations Contact" />
          </p>
          
          <h1><strong>INVESTOR RELATIONS CONTACT</strong></h1>
          
          <p>
            <strong>Investor Relations E-mail:</strong> <a href="mailto:investor.relations@desa.com.tr" rel="noopener noreferrer" target="_blank">investor.relations@desa.com.tr</a> & <a href="mailto:yatirimci.iliskileri@desa.com.tr" rel="noopener noreferrer" target="_blank">yatirimci.iliskileri@desa.com.tr</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default withAboutDesaLayout(InvestorRelationsContact);
