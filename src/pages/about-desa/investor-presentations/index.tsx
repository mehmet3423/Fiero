import { withAboutDesaLayout } from "../_layout";
import styles from "../../../styles/AboutDesa.module.css";

function InvestorPresentations() {
  return (
    <div style={{ width: '100%', maxWidth: 'none' }}>
      <div className={styles["flatpage-content"]}>
        <div className={`${styles["flatpage-text"]} ${styles["flatpage-text--link"]}`}>
          <p>
            <img src="http://login.setrow.com/photo/2103/images/download_2.jpg" alt="Investor Presentations" />
          </p>
          
          <h1><strong>INVESTOR PRESENTATIONS</strong></h1>
          
          <p><strong>2025</strong></p>
          
          <div className={styles["corporate-links"]}>
            <p><a href="https://akn-desa.a-cdn.akinoncloud.com/cms/2025/05/21/f254eab7-9320-4457-b23e-f141b2205e26.pdf" rel="noopener noreferrer" target="_blank">1st QUARTER</a></p>
          </div>
          
          <p><strong>2024</strong></p>
          
          <div className={styles["corporate-links"]}>
            <p>
              <a href="https://akn-desa.a-cdn.akinoncloud.com/cms/2024/07/19/cfab552c-6209-45b9-9c47-eaf195ee1167.pdf" rel="noopener noreferrer" target="_blank">1st QUARTER</a> 
              &nbsp;●&nbsp; 
              <a href="https://akn-desa.a-cdn.akinoncloud.com/cms/2024/10/01/fd0d56c1-f683-4123-a8bf-7d445b8c2f38.pdf" rel="noopener noreferrer" target="_blank">2nd QUARTER</a> 
              &nbsp;●&nbsp; 
              <a href="https://akn-desa.a-cdn.akinoncloud.com/cms/2024/11/21/f4863c0d-c19d-43e6-a818-d333738c38d6.pdf" rel="noopener noreferrer" target="_blank">3rd QUARTER</a> 
              &nbsp;●&nbsp; 
              <a href="https://akn-desa.a-cdn.akinoncloud.com/cms/2025/05/12/2b9f2f09-32c0-44cf-b0af-2be3375529f6.pdf" rel="noopener noreferrer" target="_blank">ANNUAL</a>
            </p>
          </div>
          
          <p><strong>2023</strong></p>
          
          <div className={styles["corporate-links"]}>
            <p>
              <a href="https://14231c.cdn.akinoncloud.com/cms/2023/08/15/6b01744a-8d8e-49b9-8035-e564fcdb04dd.pdf" rel="noopener noreferrer" target="_blank">2nd QUARTER</a>
              &nbsp;&nbsp;●&nbsp;&nbsp;
              <a href="https://akn-desa.a-cdn.akinoncloud.com/cms/2023/11/16/8035e61a-85cd-4367-a832-c26211ee7ec9.pdf" rel="noopener noreferrer" target="_blank">3rd QUARTER</a>
              &nbsp;&nbsp;●&nbsp;&nbsp;
              <span style={{ textDecoration: 'underline' }}>ANNUAL</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withAboutDesaLayout(InvestorPresentations);
