
import React from "react";

const ReturnExchangePolicyPage = () => {
  return (
    <>
      <div className="tf-page-title style-2">
        <div className="container-full">
          <div className="heading text-center">İade &amp; Değişim Politikası</div>
        </div>
      </div>
      <section className="flat-spacing-25">
        <div className="container">
          <div className="tf-main-area-page">
            <div className="flatpage__content">
              <div className="flatpage__header">
                <div className="flatpage__title flatpage__title--noimg">İade &amp; Değişim Politikası</div>
                <img className="lazyload flatpage__img" src="" alt="İade &amp; Değişim Politikası" style={{ display: "none" }} />
              </div>
              <div className="flatpage__text">
                <p>Desa.com.tr internet satış müşterilerinin “Sebep Göstermeden Cayma Hakkı” 14 gündür. Desa.com.tr’den satın aldığınız, bedeni uymayan ve/veya kullanmadığınız, hasar görmemiş, kutusu ve etiketleri orijinal olan her ürünü; faturanızı ibraz ederek fatura tarihinizden itibaren (hediye ise hediye değiştirme kartınızın üzerinde yazılı olan tarihten itibaren) 14 gün içinde iade edebilir ya da desa.com.tr ve Desa mağazalarından aynı değerde ürün ile fatura veya hediye değişim kartı ibraz ederek değiştirebilirsiniz.</p>
                <p>İade için ürünlerinizi, sipariş tarihinden 14 gün içinde, siparişlerim ekranından alacağınız iade kodu ile anlaşmalı kargo firmamız aracılığı ile ücret ödemeden gönderebilirsiniz.</p>
                <p><strong>İADE VE İŞLEM SÜRESİ</strong></p>
                <p>İade durumunda ödeme şeklinize göre iade yapılır. Ürünün iade şartlarına uygunluğu kontrol edildikten sonra Desa.com.tr tarafından kredi kartınıza iade işlemi 10-14 iş günü içerisinde gerçekleşir.</p>
                <p>Taksitli yapılan ödemelerin iadeleri banka tarafından aynı taksit sayısında iade edilir.</p>
                <p>Havale ödemelerinde banka hesap bilgilerinizi tarafımıza bildirmeniz gerekmektedir, havale tutarının iadesi sadece sipariş veren kişiye ait bir hesap numarasına yapılır.</p>
                <p>Bir siparişte müşterinin satın aldığı ürünlerin kısmen iade edilmesi durumunda yararlanılan kampanyanın koşulları bozuluyorsa, müşteriye iade edilecek tutar; o siparişe ait toplam sipariş tutarı ile iade etmediği ürünün/ürünlerin birlikte satın alımında oluşan yeni tutarın farkı şeklinde hesaplanır. Ürünlerin tamamının iade edildiği durumlarda ise o siparişe ait toplam tutar müşteriye iade edilir.</p>
                <p>İade edilecek ürünlerin, orijinal ambalajlarında, tüm aksesuar ve ambalaj malzemeleriyle birlikte eksiksiz bir şekilde, fiziksel açıdan hasar görmemiş, kullanılmamış, yeniden satılabilir durumda olması ve ürünün orijinal faturasının, faturanın arka sayfasındaki form doldurularak gönderilmesi gerekmektedir. Faturasız iadeler kabul edilmemektedir.</p>
                <p>desa.com.tr’den verdiğiniz siparişleriniz için Desa mağazalarımızdan iade kabulü yapılmamaktadır. İade etmek istediğiniz ürünü iade protokolüne uygun şekilde anlaşmalı kargo şirketi ile iade kodu/iade adresine göndermeniz gerekmektedir.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <style jsx>{`
        .tf-main-area-page {
          margin-bottom: 3rem;
          padding: 2.5rem;
          background: #fff;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          border-radius: 10px;
        }
        .flatpage__header {
          display: flex;
          align-items: center;
          margin-bottom: 2rem;
        }
        .flatpage__title {
          font-size: 1.5rem;
          font-weight: bold;
          color: #333;
          margin-bottom: 0;
        }
        .flatpage__title--noimg {
          margin-right: 1rem;
        }
        .flatpage__img {
          max-width: 80px;
          margin-left: 1rem;
        }
        .flatpage__text {
          color: #666;
          line-height: 1.6;
        }
        .flatpage__text p {
          margin-bottom: 0.7rem;
        }
      `}</style>
    </>
  );
};

export default ReturnExchangePolicyPage;
