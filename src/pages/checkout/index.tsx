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
  const formattedPhone = "";
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
          <div className="heading text-center">Check Out</div>
        </div>
      </div>
      {/* Page Cart Section */}
      <section className="flat-spacing-11">
        <div className="container">
          <div className="row" style={{ display: 'flex', gap: '32px' }}>
            {/* Billing Details - Left Column */}
            <div className="col-lg-7 col-md-12" style={{ flex: 1 }}>
              <div className="tf-page-cart-item">
                <h5 className="fw-5 mb_20">Billing details</h5>
                <form className="form-checkout" onSubmit={handleSubmit}>
                  <div className="box grid-2">
                    <fieldset className="fieldset">
                      <label htmlFor="first-name">First Name</label>
                      <input type="text" id="first-name" name="recipientName" placeholder="Themesflat" value={formData.recipientName} onChange={handleInputChange} required />
                    </fieldset>
                    <fieldset className="fieldset">
                      <label htmlFor="last-name">Last Name</label>
                      <input type="text" id="last-name" name="recipientSurname" value={formData.recipientSurname} onChange={handleInputChange} required />
                    </fieldset>
                  </div>
                  <fieldset className="box fieldset">
                    <label htmlFor="country">Country/Region</label>
                    <div className="select-custom">
                      <Select
                        className="tf-select w-100"
                        options={countries.map((c: any) => ({ value: c.id, label: c.name }))}
                        value={countries.find((c: any) => c.id === selectedCountryId) ? { value: selectedCountryId, label: countries.find((c: any) => c.id === selectedCountryId)?.name } : null}
                        onChange={(selectedOption: any) => setSelectedCountryId(selectedOption?.value || "")}
                        placeholder="Country"
                        isClearable
                      />
                    </div>
                  </fieldset>
                  <fieldset className="box fieldset">
                    <label htmlFor="city">Town/City</label>
                    <input type="text" id="city" name="city" value={newAddress.city || ""} onChange={e => setNewAddress({ ...newAddress, city: e.target.value })} />
                  </fieldset>
                  <fieldset className="box fieldset">
                    <label htmlFor="address">Address</label>
                    <input type="text" id="address" name="fullAddress" value={newAddress.fullAddress || ""} onChange={e => setNewAddress({ ...newAddress, fullAddress: e.target.value })} />
                  </fieldset>
                  <fieldset className="box fieldset">
                    <label htmlFor="phone">Phone Number</label>
                    <input type="tel" id="phone" name="recipientPhoneNumber" value={formattedPhone} onChange={handleInputChange} />
                  </fieldset>
                  <fieldset className="box fieldset">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" name="email" value={userProfile?.applicationUser?.email || ""} readOnly />
                  </fieldset>
                  <fieldset className="box fieldset">
                    <label htmlFor="note">Order notes (optional)</label>
                    <textarea name="note" id="note"></textarea>
                  </fieldset>
                </form>
              </div>
            </div>
            {/* Your Order - Right Column */}
            <div className="col-lg-5 col-md-12" style={{ flex: 1, maxWidth: '400px' }}>
              <div style={{ background: '#fff', borderRadius: '8px', padding: '32px 24px', boxShadow: '0 0 8px rgba(0,0,0,0.04)' }}>
                <h5 style={{ fontWeight: 600, marginBottom: 24 }}>Your order</h5>
                <ul style={{ listStyle: 'none', padding: 0, marginBottom: 24 }}>
                  {cartProducts.length === 0 ? (
                    <li style={{ color: '#888', textAlign: 'center', padding: '24px 0' }}>Sepetinizde ürün yok.</li>
                  ) : (
                    cartProducts.map((item: any) => (
                      <li key={item.id} style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
                        <img src={item.imageUrl || '/public/assets/site/images/products/default.jpg'} alt={item.title} style={{ width: 48, height: 48, borderRadius: 8, marginRight: 16 }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 500 }}>{item.title}</div>
                          {item.variant && <div style={{ fontSize: 12, color: '#888' }}>{item.variant}</div>}
                        </div>
                        <div style={{ fontWeight: 500 }}>{(item.discountedPrice || item.price).toFixed(2)}₺</div>
                      </li>
                    ))
                  )}
                </ul>
                <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
                  <input type="text" placeholder="Discount code" style={{ flex: 1, padding: '8px 12px', border: '1px solid #ccc', borderRadius: 4 }} />
                  <button type="button" style={{ background: '#000', color: '#fff', border: 'none', borderRadius: 4, padding: '8px 16px', fontWeight: 500 }}>Apply</button>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, marginBottom: 24 }}>
                  <span>Total</span>
                  <span>{total.toFixed(2)}₺</span>
                </div>
                <div style={{ marginBottom: 24 }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                    <input type="radio" id="bank" name="payment" defaultChecked style={{ accentColor: '#e53935', marginRight: 8 }} />
                    <label htmlFor="bank" style={{ fontWeight: 500, color: '#222' }}>Direct bank transfer</label>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                    <input type="radio" id="delivery" name="payment" style={{ accentColor: '#ccc', marginRight: 8 }} />
                    <label htmlFor="delivery" style={{ fontWeight: 500, color: '#222' }}>Cash on delivery</label>
                  </div>
                </div>
                <div style={{ fontSize: 13, color: '#444', marginBottom: 16 }}>
                  Your personal data will be used to process your order, support your experience throughout this website, and for other purposes described in our <a href="/privacy-policy" style={{ textDecoration: 'underline' }}>privacy policy</a>.
                </div>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
                  <input type="checkbox" id="agree" style={{ marginRight: 8 }} />
                  <label htmlFor="agree" style={{ fontSize: 13, color: '#444' }}>
                    I have read and agree to the website <a href="/terms-conditions" style={{ textDecoration: 'underline' }}>terms and conditions</a>.
                  </label>
                </div>
                <button type="submit" style={{ width: '100%', background: '#000', color: '#fff', border: 'none', borderRadius: 4, padding: '12px 0', fontWeight: 600, fontSize: 16 }}>Place order</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default CheckoutPage;
