import React from "react";
import Image from "next/image";
function CustomerReviews() {
  const reviews = [
    {
      id: 1,
      rating: 5,
      title: "Mükemmel Ürün",
      comment:
        "Bu ürünü almadan önce tereddüt etmiştim ama gerçekten harika çıktı! Kalitesi beklentimin çok üstünde, kullanımı çok pratik ve tam da anlatıldığı gibi geldi. Paketleme özenliydi ve kargosu hızlıydı. Kesinlikle tavsiye ederim! 😊👏",
      author: "Sakina Stout",
    },
    {
      id: 2,
      rating: 4.5,
      title: "Harika Ürün",
      comment:
        "Bu ürünü almadan önce tereddüt etmiştim ama gerçekten harika çıktı! Kalitesi beklentimin çok üstünde, kullanımı çok pratik ve tam da anlatıldığı gibi geldi. Paketleme özenliydi ve kargosu hızlıydı. Kesinlikle tavsiye ederim! 😊👏",
      author: "Maximus",
    },
    {
      id: 3,
      rating: 5,
      title: "Kaliteli Ürün",
      comment:
        "Bu ürünü almadan önce tereddüt etmiştim ama gerçekten harika çıktı! Kalitesi beklentimin çok üstünde, kullanımı çok pratik ve tam da anlatıldığı gibi geldi. Paketleme özenliydi ve kargosu hızlıydı. Kesinlikle tavsiye ederim! 😊👏",
      author: "Antony Tanner",
    },
  ];
  return (
    <div className="mb-5 mt-5">
      <div className="heading heading-center mb-3">
        <h2 className="title">Öne Çıkan Yorumlar</h2>
      </div>

      <hr className="mb-4" />

      <div className="row">
        {reviews.map((review) => (
          <div key={review.id} className="col-lg-4">
            <div className="testimonial">
              <div className="testimonial-owner">
                <div className="ratings-container">
                  <div className="ratings">
                    <div
                      className="ratings-val"
                      style={{ width: `${(review.rating / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              <blockquote className="testimonial-text">
                <h4>{review.title}</h4>
                <p>{review.comment}</p>
              </blockquote>
              <div className="testimonial-author" style={{ color: "black" }}>
                <span>{review.author}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CustomerReviews;
