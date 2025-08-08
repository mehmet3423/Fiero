import GeneralModal from "@/components/shared/GeneralModal";
import PageLoadingAnimation from "@/components/shared/PageLoadingAnimation";
import { Address, District, Province } from "@/constants/models/Address";
import { CreateOrderRequest } from "@/constants/models/Order";
import { useAuth } from "@/hooks/context/useAuth";
import { useCart } from "@/hooks/context/useCart";

import Select from "react-select";
import React, { useState } from "react";
function CheckoutPage() {
  const [countries] = useState<any[]>([]);
  const [selectedCountryId, setSelectedCountryId] = useState<string>("");
  const [formData, setFormData] = useState<{ recipientName: string; recipientSurname: string }>({ recipientName: "", recipientSurname: "" });
  const [newAddress, setNewAddress] = useState<{ city: string; fullAddress: string }>({ city: "", fullAddress: "" });
  const userProfile = { applicationUser: { email: "" } };
  const [formattedPhone, setFormattedPhone] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "recipientPhoneNumber") {
      // Sadece rakamları al ve 10 karakterle sınırla
      const numericValue = value.replace(/\D/g, ""); // Harfleri kaldır
      if (numericValue.length <= 10) {
        setFormattedPhone(numericValue); // Telefon numarasını güncelle
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); };
  // Sepet verisi
  const { cartProducts = [] } = useCart();
  const total = cartProducts.reduce((sum: number, item: any) => sum + ((item.discountedPrice || item.price) * item.quantity), 0);
  return (
    <main>
      {/* Page Title */}
      <div className="tf-page-title">
        <div className="container-full">
          <div className="heading text-center">Ödeme</div>
        </div>
      </div>
      {/* Page Cart Section */}
      <section className="flat-spacing-11">
        <div className="container">
          <div className="tf-page-cart-wrap layout-2">
            <div className="tf-page-cart-item">
              <h5 className="fw-5 mb_20">Fatura Bilgileri</h5>
              <form className="form-checkout" onSubmit={handleSubmit}>
                <div className="box grid-2">
                  <fieldset className="fieldset">
                    <label htmlFor="first-name">Ad</label>
                    <input type="text" id="first-name" name="recipientName" value={formData.recipientName} onChange={handleInputChange} required />
                  </fieldset>
                  <fieldset className="fieldset">
                    <label htmlFor="last-name">Soyad</label>
                    <input type="text" id="last-name" name="recipientSurname" value={formData.recipientSurname} onChange={handleInputChange} required />
                  </fieldset>
                </div>
                <fieldset className="box fieldset">
                  <label htmlFor="country">Ülke/Bölge</label>
                  <div className="select-custom">
                    <select
                      className="tf-select w-100"
                      id="country"
                      name="country"
                      value={selectedCountryId}
                      onChange={(e) => setSelectedCountryId(e.target.value)}
                    >
                      <option value="">Ülke Seç</option>
                      <option value="turkey">Türkiye</option>
                      {/* <option value="usa">Amerika Birleşik Devletleri</option>
                        <option value="uk">United Kingdom</option>
                        <option value="germany">Germany</option>
                        <option value="france">France</option>
                        <option value="italy">Italy</option>
                        <option value="spain">Spain</option>
                        <option value="canada">Canada</option>
                        <option value="australia">Australia</option> */}
                    </select>
                  </div>
                </fieldset>
                <fieldset className="box fieldset">
                  <label htmlFor="city">Şehir</label>
                  <input type="text" id="city" name="city" value={newAddress.city || ""} onChange={e => setNewAddress({ ...newAddress, city: e.target.value })} />
                </fieldset>
                <fieldset className="box fieldset">
                  <label htmlFor="address">Adres</label>
                  <input type="text" id="address" name="fullAddress" value={newAddress.fullAddress || ""} onChange={e => setNewAddress({ ...newAddress, fullAddress: e.target.value })} />
                </fieldset>
                <fieldset className="box fieldset">
                  <label htmlFor="phone">Telefon Numarası</label>
                  <input
                    type="tel"
                    id="phone"
                    name="recipientPhoneNumber"
                    value={formattedPhone}
                    onChange={handleInputChange}
                    placeholder="5xx-xxx-xx-xx"
                    required
                  />
                </fieldset>
                <fieldset className="box fieldset">
                  <label htmlFor="email">Email</label>
                  <input type="email" id="email" name="email" value={userProfile?.applicationUser?.email || ""} readOnly />
                </fieldset>
                <fieldset className="box fieldset">
                  <label htmlFor="note">Sipariş Notu (opsiyonel)</label>
                  <textarea name="note" id="note"></textarea>
                </fieldset>
              </form>
            </div>
            <div className="tf-page-cart-footer">
              <div className="tf-cart-footer-inner">
                <h5 className="fw-5 mb_20">Siparişiniz</h5>
                <form className="tf-page-cart-checkout widget-wrap-checkout">
                  <ul className="wrap-checkout-product">
                    {cartProducts.length === 0 ? (
                      <li className="checkout-product-item">
                        <div className="content">
                          <div className="info">
                            <p className="name text-center">Sepetinizde ürün yok.</p>
                          </div>
                        </div>
                      </li>
                    ) : (
                      cartProducts.map((item: any) => (
                        <li key={item.id} className="checkout-product-item">
                          <figure className="img-product">
                            <img src={item.baseImageUrl || item.imageUrl || '/assets/images/products/no-image.jpg'} alt={item.title} />
                            <span className="quantity">{item.quantity}</span>
                          </figure>
                          <div className="content">
                            <div className="info">
                              <p className="name">{item.title}</p>
                              {item.variant && <span className="variant">{item.variant}</span>}
                            </div>
                            <span className="price">{(item.discountedPrice || item.price).toFixed(2)}₺</span>
                          </div>
                        </li>
                      ))
                    )}
                  </ul>
                  <div className="coupon-box">
                    <input type="text" placeholder="İndirim Kodu" />
                    <a href="#" className="tf-btn btn-sm radius-3 btn-fill btn-icon animate-hover-btn">Uygula</a>
                  </div>
                  <div className="d-flex justify-content-between line pb_20">
                    <h6 className="fw-5">Toplam</h6>
                    <h6 className="total fw-5">{total.toFixed(2)}₺</h6>
                  </div>
                  <div className="wd-check-payment">
                    <div className="fieldset-radio mb_20">
                      <input type="radio" name="payment" id="bank" className="tf-check" defaultChecked />
                      <label htmlFor="bank">Online Ödeme</label>
                    </div>
                    <div className="fieldset-radio mb_20">
                      <input type="radio" name="payment" id="delivery" className="tf-check" />
                      <label htmlFor="delivery">Kapıda Ödeme</label>
                    </div>
                    <p className="text_black-2 mb_20">
                      Kişisel bilgileriniz, hizmet kalitemizi iyileştirmek
                      ve{' '}<a href="/privacy-policy" className="text-decoration-underline">gizlilik politikamız</a>da belirtilen amaçlar için kullanılacaktır.
                    </p>
                    {/* <div className="box-checkbox fieldset-radio mb_20">
                      <input type="checkbox" id="check-agree" className="tf-check" />
                      <label htmlFor="check-agree" className="text_black-2">
                        I have read and agree to the website{' '}
                        <a href="/terms-conditions" className="text-decoration-underline">terms and conditions</a>.
                      </label>
                    </div> */}
                  </div>
                  <button className="tf-btn radius-3 btn-fill btn-icon animate-hover-btn justify-content-center">Sipariş Ver</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default CheckoutPage;
