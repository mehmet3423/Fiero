import { withAboutDesaLayout } from "../_layout";
import styles from "../../../styles/AboutDesa.module.css";

function Investors() {
  return (
    <div style={{ width: '100%', maxWidth: 'none', border: 'none', boxShadow: 'none' }}>
      <div className={styles["flatpage-content"]} style={{ border: 'none', boxShadow: 'none' }}>
        <div className={`${styles["flatpage-text"]} ${styles["flatpage-text--link"]}`} style={{ border: 'none', boxShadow: 'none' }}>
          <img 
            src="/assets/site/images/about-desa/investors-banner.jpg" 
            alt="Investors" 
            className={styles["investors-banner"]}
            style={{ boxShadow: 'none', border: 'none', borderRadius: 0 }}
          />
          
          <h4 className={styles["investors-title"]}>INVESTORS</h4>
          
          <p className={styles["intro-text"]}>
            "HERE AT DESA, WE ARE COMMITTED TO CREATING SUSTAINABLE, LONG TERM VALUE FOR ALL OF OUR STAKEHOLDERS INCLUDING OUR EMPLOYEES, CLIENTS, BUSINESS PARTNERS AND CERTAINLY OUR MINORITY SHAREHOLDERS"
          </p>
          
          <p>
            Founded as a family company in 1972, DESA has been continuing its operations as a producer of leather and leather products, signing off significant accomplishments for 45 years. Taking the justified pride to become "Turkey's Export Champion" in 2010, 2011, 2012 and 2014 in its field and owning a unique and vertically integrated business model, DESA continues striving to be a prestigious international brand by strengthening its current profile with its high quality products.
          </p>
          
          <p>
            DESA's operations include a tannery, two plants for production of women, men wear, handbags and accessories as well as distribution of those products via whole and retail channels. DESA's retail operations are mainly domestic with 54 DESA, 37 DESA Samsonite, 2 DESA Franchaise and 14 Samsonite JV, 3 Tumi, totalling 110 stores in Turkey. In addition to production facilities with a total area of 25.500 m2 in İstanbul and Düzce, DESA owns a tannery with an area of 20.000 m2 located in Çorlu. Company provides integrated solutions for several international brands such as Prada, Miu Miu, Tumi and Lipault. After 24 years of distribution for Samsonite in Turkey, world's biggest travel products manufacturer, DESA strengthened its international profile further by establishing a 40%- 60% joint venture with Samsonite in 2007.
          </p>
          
          <p>
            DESA gives significant importance to materials and craftsmanship of high standard that provide its products with high quality and durability. The company also offers its products via online store on www.desa.com.tr. With the perfectionist mentality it embraces in its service quality, DESA always makes investments to human source through designs, researches and developments. Company's strategic goal in long term is to increase DESA brand products both locally and internationally.
          </p>
          
          <h5 className={styles["section-title"]}>About DESA</h5>
          
          <p>
            DESA is a public company that has been traded in Borsa Istanbul A.Ş. since May 2004 under the "DESA" code. With its total assets reaching TRY 4,022 billion as of December 31st, 2024, DESA reported TRY 2,98 billion of net revenues and TRY 327,7 million of net profit. All figures are computed according to TMS29 standarts, i.e. Turkish Accounting Standards for Financial Reporting in Inflationary Economies.
          </p>
        </div>
      </div>
    </div>
  );
}

export default withAboutDesaLayout(Investors);
