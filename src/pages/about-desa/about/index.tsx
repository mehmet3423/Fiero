import { withAboutDesaLayout } from "../_layout";
import styles from "../../../styles/AboutDesa.module.css";

function AboutPage() {
  return (
    <div style={{ width: '100%', maxWidth: 'none' }}>
      <div className={styles["flatpage-content"]}>
        <div className={`${styles["flatpage-text"]} ${styles["flatpage-text--link"]}`}>
          <p>
            <img src="https://cdn-ayae.akinon.net/cms/2018/10/09/84c62133-acc8-4495-8417-d340480c715a.jpg" alt="DESA" />
          </p>
          
          <h1><strong>ABOUT DESA</strong></h1>
          
          <p>
            DESA is Turkey's leading leather and leather goods manufacturer and retailer, completing its vertical integration with operations including a leather tannery, design and production of bags, accessories, women's and men's clothing, as well as distribution through both wholesale and retail sales channels. DESA alone accounts for 70% of Turkey's leather haberdashery product exports to Italy. The company boasts a total of 110 stores and approximately 97 sales points worldwide for its NINETEENSEVENTYTWO brand. With a 20.000 m² tannery in Çorlu and production facilities spanning 25.500 m² in Istanbul and Düzce, the company provides integrated solutions to numerous international luxury brands like Prada and Miu Miu. In Poppi, Arezzo, within Italy's Casentino Valley, DESA operates a new facility established on a 5-acre plot with 1,896 m² of indoor space, commencing production and R&D activities in early May 2023. Having received customs approval for the "Made in Italy" label in May 2024, DESA aims to increase its workforce from 65 to 100 employees by the end of 2024 through its organized training programs.
          </p>
          
          <p>
            <img src="https://cdn-ayae.akinon.net/cms/2018/10/09/2ada40e9-a9f3-454a-ae11-04e00cd68bcf.jpg" alt="DESA Company" />
          </p>
          
          <p>
            DESA has been listed on Borsa İstanbul under the "DESA" code since May 2004. As of December 31, 2024, DESA's total assets have reached 4,022 billion Turkish Lira, with total revenues of 2,98 billion Turkish Lira. On June 13, 2025, 62,67% of the company belongs to Çelet Holding, 18,56% to Melih Çelet, 0.8% to other partners, and the remaining 17,97% is publicly traded.
          </p>
          
          <p>As of December, 2024, DESA's market value is 5.2 billion Turkish Lira.</p>
          
          <p>
            <img src="https://cdn-ayae.akinon.net/cms/2018/10/09/c647979c-617e-45c0-9c35-022b9b2ca398.jpg" alt="DESA Manufacturing" />
          </p>
        </div>
      </div>
    </div>
  );
}

export default withAboutDesaLayout(AboutPage);
