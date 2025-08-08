import AboutDesaTrLayout from "../_layout";

function AnalystReportsTr() {
  return (
    <div>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Analist raporları burada listelenecektir.</p>
      <ul>
        <li>2025 Q2 Raporu - Henüz eklenmedi</li>
        <li>2025 Q1 Raporu - Taslak aşamasında</li>
        <li>2024 Yıllık Değerlendirme - Yakında</li>
      </ul>
      <p>Bu sayfa, analistlerin hazırladığı raporlar için ayrılmıştır. İçerik güncellenecektir.</p>
    </div>
  );
}

export default function Page() {
  return (
    <AboutDesaTrLayout>
      <div className="flatpage-text">
        <h2>Analist Raporları (TR)</h2>
        <AnalystReportsTr />
      </div>
    </AboutDesaTrLayout>
  );
}
