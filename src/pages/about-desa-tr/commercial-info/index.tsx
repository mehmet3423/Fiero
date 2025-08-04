
import AboutDesaTrLayout from "../_layout";
import styles from "../../../styles/AboutDesa.module.css";

export default function Page() {
  return (
    <AboutDesaTrLayout>
      <div className={styles["flatpage-text"]}>
        <h1><strong>Ticari Bilgiler</strong></h1>
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontWeight: 600, margin: '24px 0 8px' }}>Firma Ünvanı</div>
          <div>Desa Deri Sanayi ve Ticaret A.Ş.</div>
        </div>
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontWeight: 600, margin: '24px 0 8px' }}>Şirket Merkezi</div>
          <div>İnönü Mah. Halkalı Cad. No: 208 Sefaköy / İstanbul</div>
        </div>
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontWeight: 600, margin: '24px 0 8px' }}>Sermayesi</div>
          <div>490.000.000,00 TL</div>
        </div>
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontWeight: 600, margin: '24px 0 8px' }}>Vergi Dairesi</div>
          <div>Büyük Mükellefler</div>
        </div>
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontWeight: 600, margin: '24px 0 8px' }}>Vergi No</div>
          <div>293 004 8627</div>
        </div>
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontWeight: 600, margin: '24px 0 8px' }}>Ticaret Sicil No</div>
          <div>185047-0</div>
        </div>
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontWeight: 600, margin: '24px 0 8px' }}>E-Posta</div>
          <div>
            <a href="mailto:investor.relations@desa.com.tr" rel="noopener noreferrer" target="_blank" style={{ textDecoration: 'underline' }}>investor.relations@desa.com.tr</a>
            {' '} - {' '}
            <a href="mailto:yatirimci.iliskileri@desa.com.tr" rel="noopener noreferrer" target="_blank" style={{ textDecoration: 'underline' }}>yatirimci.iliskileri@desa.com.tr</a>
          </div>
        </div>
      </div>
    </AboutDesaTrLayout>
  );
}
