import AboutDesaTrLayout from "../_layout";

function InvestorsTr() {
  return (
    <div>
      <h2>Yatırımcılar (Taslak)</h2>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Bu sayfa taslak olarak hazırlanmıştır.</p>
      <p>Yatırımcılar ile ilgili bilgiler yakında burada yer alacaktır.</p>
      <ul>
        <li>2025 Yatırımcı Bilgisi - Hazırlanıyor</li>
        <li>2024 Yatırımcı Bilgisi - Taslak</li>
      </ul>
      <p>Güncellemeler için lütfen daha sonra tekrar kontrol edin.</p>
    </div>
  );
}

export default function Page() {
  return (
    <AboutDesaTrLayout>
      <InvestorsTr />
    </AboutDesaTrLayout>
  );
}
