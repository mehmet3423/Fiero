import React, { useState } from 'react';


const HafsanurDesaPage: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <main className="hafsanur-desa-page">
      <div className="container">
        {/* Banner Section */}
        <div className="banner-section mb-5">
          <div className="customizable-landing-page-banner text-center">
            <a href="/hafsanur-sancaktutan-desa-kombinleri/" className="d-inline-block">
              <img
                className="ls-is-cached lazyloaded img-fluid d-block mx-auto"
                src="/assets/site/images/hafsanur-desa/hafsanurbanner.png"
                alt="Hafsanur x DESA"
                loading="lazy"
              />
            </a>
          </div>
        </div>

        {/* Video Section */}
        <div className="video-section mb-5">
          <div className="text-center">
            <div
              id="player"
              className="player mx-auto d-block rounded overflow-hidden"
              style={{
                maxWidth: 'calc(177.778vh)',
                height: 'calc(56.25vw)',
              }}
            >
              <video
                src="/assets/site/images/hafsanur-desa/hafsavideo1.mp4"
                width="100%"
                height="100%"
                controls
                muted
                autoPlay
                loop
                playsInline
                className="w-100 h-100 border-0 rounded"
              >
                Tarayıcınız video etiketini desteklemiyor.
              </video>
            </div>
          </div>
        </div>


        <div className="row g-0 mb-5" style={{display: 'flex',overflow: 'hidden' }}>
          {/* Sol Görsel */}
          <div   style={{ position: 'relative', width: '60%' }}>
            <a href="/kadin-espadril/" className="d-block w-100 h-100 position-relative">
              <img  
                src="/assets/site/images/hafsanur-desa/hafsa1.jpg"
                alt="Süet Espadriller"
                className="img-fluid w-100 h-100"
                style={{ objectFit: 'cover', objectPosition: 'center' }}
                loading="lazy"
              />
            </a>
          </div>

          {/* Sağ Görsel */}
          <div  style={{ position: 'relative',width: '40%' }}>
            <a href="/kadin-canta/" className="d-block w-100 h-100 position-relative">
              <img
                src="/assets/site/images/hafsanur-desa/hafsa2.png"
                alt="Deri Çantalar"
                className="img-fluid w-100 h-100"
                style={{ objectFit: 'cover', objectPosition: 'center' }}
                loading="lazy"
              />
            </a>
          </div>
        </div>

        <div className="row g-0 mb-5" style={{display: 'flex',overflow: 'hidden' }}>
          {/* Sol Görsel */}
          <div   style={{ position: 'relative', width: '60%' }}>
            <a href="/kadin-espadril/" className="d-block w-100 h-100 position-relative">
              <img  
                src="/assets/site/images/hafsanur-desa/hafsa3.jpg"
                alt="Süet Espadriller"
                className="img-fluid w-100 h-100"
                style={{ objectFit: 'cover', objectPosition: 'center' }}
                loading="lazy"
              />
            </a>
          </div>

          {/* Sağ Görsel */}
          <div  style={{ position: 'relative',width: '40%' }}>
            <a href="/kadin-canta/" className="d-block w-100 h-100 position-relative">
              <img
                src="/assets/site/images/hafsanur-desa/hafsa4.png"
                alt="Deri Çantalar"
                className="img-fluid w-100 h-100"
                style={{ objectFit: 'cover', objectPosition: 'center' }}
                loading="lazy"
              />
            </a>
          </div>
        </div>

        
        <div className="row g-0 mb-5 customizable-landing-page-triple-image">
          {/* Sol görsel */}
          <div className="col-12 col-md-4 left">
            <a href="/limited-edition/" className="d-block w-100 h-100">
              <picture className="d-block w-100 h-100">
                <img
                  src="/assets/site/images/hafsanur-desa/hafsa5.png"
                  alt="Limited Edition"
                  className="img-fluid w-100 h-100"
                  style={{ objectFit: 'cover', objectPosition: 'center' }}
                  loading="lazy"
                />
              </picture>
            </a>
          </div>

          {/* Orta görsel */}
          <div className="col-12 col-md-4 mid">
            <a href="/kadin-suet-ceket/" className="d-block w-100 h-100">
              <picture className="d-block w-100 h-100">
                <img
                  src="/assets/site/images/hafsanur-desa/hafsa6.png"
                  alt="Süet Ceket"
                  className="img-fluid w-100 h-100"
                  style={{ objectFit: 'cover', objectPosition: 'center' }}
                  loading="lazy"
                />
              </picture>
            </a>
          </div>

          {/* Sağ görsel */}
          <div className="col-12 col-md-4 right">
            <a href="/kadin-aksesuar/" className="d-block w-100 h-100">
              <picture className="d-block w-100 h-100">
                <img
                  src="/assets/site/images/hafsanur-desa/hafsa7.png"
                  alt="Aksesuar"
                  className="img-fluid w-100 h-100"
                  style={{ objectFit: 'cover', objectPosition: 'center' }}
                  loading="lazy"
                />
              </picture>
            </a>
          </div>
        </div>

        {/* Anniversary Section */}
        <div className="anniversary-section mb-5">
          <div className="text-center">
            <div
              className="anniversary container js-anniversary player mx-auto d-block rounded overflow-hidden"
              style={{
                maxWidth: 'calc(177.778vh)',
                height: 'calc(56.25vw)',
              }}
            >
              <div className="anniversary__header">
                {/* Başlık veya ek içerik buraya gelebilir */}
              </div>

              <div className="anniversary__video h-100">
                <video
                  src="/assets/site/images/hafsanur-desa/hafsavideo2.mp4"
                  width="100%"
                  height="100%"
                  muted
                  autoPlay
                  loop
                  playsInline
                  controls
                  className="anniversary__video__embed border-0 rounded w-100 h-100"
                  style={{ objectFit: 'cover' }}
                >
                  Tarayıcınız video etiketini desteklemiyor.
                </video>
              </div>

              <div className="anniversary__content">
                {/* İsteğe bağlı metin veya buton buraya eklenebilir */}
              </div>

              <div className="anniversary__footer">
                {/* Footer alanı */}
              </div>
            </div>
          </div>
        </div>


        {/* Açıklama Bölümü */}
        <div className="bottom-category-desc js-bottom-category-description my-5">
          <div className={isExpanded ? 'long_content' : 'short_content'}>
            <h1 className="fw-bold fs-3">
              Hafsanur Sancaktutan DESA’nın Yeni Yüzü: Kendini Yaşa, DESA!
            </h1>
            <p className="mb-3">
              Yeni sezonda, yeni Desa, yeni bir dokunuşla Hafsanur Sancaktutan ile karşınızda.
              Başarılı ve yetenekli oyuncu Hafsanur Sancaktutan’ın marka yüzü olduğu yeni sezonda,
              Desa’nın zamansız deri kalitesi ve trendleri yansıtan sonbahar kış koleksiyonu dönemin
              en ikonik isimlerinden biriyle bir araya geliyor. Hafsanur’un yüksek enerjisi, Desa’nın
              üstün kalitesiyle yeni bir mesaj veriyor: Kendini Yaşa!
            </p>
            {isExpanded && (
              <>
                <h2 className="fs-5 fw-semibold">Kendine Yaklaş, Daha da Yakın!</h2>
                <p>
                  Hafsanur’un yüksek enerjisi, doğal hareketleri ve güçlü duruşu, reklam filminin hikayesine ilham oluyor.
                  Yeni kampanyayla aradığın “o” dokunuş, kendini en iyi şekilde yaşayacağın '' o” görünüm,
                  tüm gözleri üzerine çevirecek “o” duruş, şimdi Desa’da. Desa’yla Kendini Yaşa!
                </p>

                <h2 className="fs-5 fw-semibold">İlkbahar-Yaz 2025 Koleksiyonu</h2>
                <p>
                  DESA’nın zamansız ve sürdürülebilir deri dokunuşlarıyla yeniden şekillenen İlkbahar-Yaz 2025 koleksiyonu;
                  Hafsanur’un enerjisi ile buluşarak mevsimin ruhunu cesur bir şekilde yansıtıyor.
                </p>
              </>
            )}
          </div>

          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setIsExpanded(!isExpanded);
            }}
            className="js-read-more-link read-more text-decoration-underline d-inline-block mt-2"
          >
            {isExpanded ? 'Devamını Gizle' : 'Devamını Oku'}
          </a>
        </div>



      </div>
    </main>
  );
};

export default HafsanurDesaPage;
