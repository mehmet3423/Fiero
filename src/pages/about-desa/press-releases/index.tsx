import { withAboutDesaLayout } from "../_layout";
import styles from "../../../styles/AboutDesa.module.css";

function PressReleases() {
  return (
    <div style={{ width: '100%', maxWidth: 'none', border: 'none', boxShadow: 'none' }}>
      <div className={styles["flatpage-content"]} style={{ border: 'none', boxShadow: 'none' }}>
        <div className={`${styles["flatpage-text"]} ${styles["flatpage-text--link"]}`} style={{ border: 'none', boxShadow: 'none' }}>
          <p>
            <img src="http://login.setrow.com/photo/2103/images/download_1.jpg" alt="Press Releases" style={{ boxShadow: 'none', border: 'none', borderRadius: 0 }} />
          </p>
          
          <h1><strong>PRESS RELEASES</strong></h1>
          
          <p><strong>2025</strong></p>
          
          <div className={styles["corporate-links"]}>
            <p><a href="https://akn-desa.a-cdn.akinoncloud.com/cms/2025/06/04/32a0eccc-c3e1-44a8-a713-5f45e2b493e4.pdf" rel="noopener noreferrer" target="_blank">1ST QUARTER</a></p>
          </div>
          
          <p><strong>2024</strong></p>
          
          <div className={styles["corporate-links"]}>
            <p>
              <a href="https://akn-desa.a-cdn.akinoncloud.com/cms/2025/01/21/4d381113-45c7-434f-8654-2c2bba8cf893.pdf" rel="noopener noreferrer" target="_blank">2ND QUARTER</a>
              &nbsp;●&nbsp;
              <a href="https://akn-desa.a-cdn.akinoncloud.com/cms/2025/01/21/41479a9e-b034-4d20-8318-e5c6fc6fce4c.pdf" rel="noopener noreferrer" target="_blank">3RD QUARTER</a>
              &nbsp;●&nbsp;
              <a href="https://akn-desa.a-cdn.akinoncloud.com/cms/2025/04/03/1de76129-ec50-4ee1-bcab-7b5cb0d1d545.pdf" rel="noopener noreferrer" target="_blank">ANNUAL</a>
            </p>
          </div>
          
          <p><strong>2023</strong></p>
          
          <div className={styles["corporate-links"]}>
            <p>
              <a href="https://14231c.cdn.akinoncloud.com/cms/2023/08/08/cd60c53c-1740-44d9-a513-d6d238b1ddc0.pdf" rel="noopener noreferrer" target="_blank">2ND QUARTER</a>
              &nbsp;&nbsp;●&nbsp;&nbsp;
              <a href="https://akn-desa.a-cdn.akinoncloud.com/cms/2023/11/01/af4306a0-c3ec-40f7-adf5-044d2c29a047.pdf" rel="noopener noreferrer" target="_blank">3RD QUARTER</a>
              &nbsp;●&nbsp;
              <a href="https://akn-desa.a-cdn.akinoncloud.com/cms/2025/01/21/4225791d-9fa1-4740-9a99-989445c48b4a.pdf" rel="noopener noreferrer" target="_blank">ANNUAL</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withAboutDesaLayout(PressReleases);
