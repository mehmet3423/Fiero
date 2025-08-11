import GeneralModal from "@/components/shared/GeneralModal";
import PageLoadingAnimation from "@/components/shared/PageLoadingAnimation";
import { Address, District, Province } from "@/constants/models/Address";
import { CreateOrderRequest } from "@/constants/models/Order";
import { useAuth } from "@/hooks/context/useAuth";
import { useCart } from "@/hooks/context/useCart";
import { useGetProvinces } from "@/hooks/services/address/useGetProvinces";
import { useGetDistricts } from "@/hooks/services/address/useGetDistricts";
import { useGetAddresses } from "@/hooks/services/address/useGetAddresses";
import { useCreateAddress } from "@/hooks/services/address/useCreateAddress";

import Select from "react-select";
import React, { useState } from "react";
import toast from "react-hot-toast";

function CheckoutPage() {
  const { userProfile } = useAuth();
  const [formData, setFormData] = useState<{
    recipientName: string;
    recipientSurname: string;
    phoneNumber: string;
    tcId: string;
    email: string;
    // Corporate invoice fields
    companyName: string;
    taxNumber: string;
    taxOffice: string;
  }>({
    recipientName: "",
    recipientSurname: "",
    phoneNumber: "",
    tcId: "",
    email: "",
    companyName: "",
    taxNumber: "",
    taxOffice: "",
  });

  const [newAddress, setNewAddress] = useState<Partial<Address>>({
    firstName: "",
    lastName: "",
    title: "",
    fullAddress: "",
    city: "",
    district: "",
    country: "",
    neighbourhood: "",
    street: "",
    postalCode: "",
  });

  // Turkey is automatically selected and unchangeable
  const selectedCountryId = "turkey";
  const [selectedProvinceId, setSelectedProvinceId] = useState<string>("");
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>("");

  // Address selection
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [selectedBillingAddressId, setSelectedBillingAddressId] =
    useState<string>("");
  const [billingSameAsDelivery, setBillingSameAsDelivery] =
    useState<boolean>(true);
  const [isCorporateInvoice, setIsCorporateInvoice] = useState<boolean>(false);

  // Get user addresses and create address hook
  const { addresses, isLoading: isAddressesLoading } = useGetAddresses();
  const { createAddress, isPending: isAddingAddress } = useCreateAddress();

  // Get provinces and districts
  const { provinces, isLoading: isProvincesLoading } = useGetProvinces();
  const { districts, isLoading: isDistrictsLoading } =
    useGetDistricts(selectedProvinceId);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "phoneNumber") {
      // Sadece rakamları al ve 10 karakterle sınırla
      const numericValue = value.replace(/\D/g, "");
      if (numericValue.length <= 10) {
        setFormData((prev) => ({ ...prev, phoneNumber: numericValue }));
      }
    } else if (name === "tcId") {
      // TC kimlik numarası için sadece rakam ve 11 karakter
      const numericValue = value.replace(/\D/g, "");
      if (numericValue.length <= 11) {
        setFormData((prev) => ({ ...prev, tcId: numericValue }));
      }
    } else if (name === "taxNumber") {
      // Vergi numarası için sadece rakam
      const numericValue = value.replace(/\D/g, "");
      setFormData((prev) => ({ ...prev, taxNumber: numericValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleUseProfileInfo = () => {
    if (userProfile?.applicationUser) {
      setFormData({
        recipientName: userProfile.applicationUser.firstName || "",
        recipientSurname: userProfile.applicationUser.lastName || "",
        phoneNumber: userProfile.applicationUser.phoneNumber || "",
        tcId: "", // TC kimlik numarası kullanıcının girmesi gerekiyor
        email: userProfile.applicationUser.email || "",
        companyName: "",
        taxNumber: "",
        taxOffice: "",
      });
    }
  };

  const handleAddressSelection = (addressId: string) => {
    setSelectedAddressId(addressId);
  };

  const handleBillingAddressSelection = (addressId: string) => {
    setSelectedBillingAddressId(addressId);
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const selectedProvince = provinces.find(
        (p) => p.id === selectedProvinceId
      );
      const selectedDistrict = districts.find(
        (d) => d.id === selectedDistrictId
      );

      await createAddress(
        newAddress as Address,
        "Türkiye",
        selectedProvince?.name,
        selectedDistrict?.name
      );

      $("#addAddressModal").modal("hide");
      setNewAddress({
        firstName: "",
        lastName: "",
        title: "",
        fullAddress: "",
        city: "",
        district: "",
        country: "",
        neighbourhood: "",
        street: "",
        postalCode: "",
      });
      setSelectedProvinceId("");
      setSelectedDistrictId("");
      toast.success("Adres başarıyla eklendi");
    } catch {
      toast.error("Adres eklenirken bir hata oluştu");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Form validation
    if (
      !formData.recipientName ||
      !formData.recipientSurname ||
      !formData.phoneNumber ||
      !formData.tcId ||
      !formData.email
    ) {
      toast.error("Lütfen tüm zorunlu alanları doldurun");
      return;
    }

    if (formData.tcId.length !== 11) {
      toast.error("TC Kimlik Numarası 11 haneli olmalıdır");
      return;
    }

    if (!selectedAddressId) {
      toast.error("Lütfen teslimat adresi seçin");
      return;
    }

    if (!billingSameAsDelivery && !selectedBillingAddressId) {
      toast.error("Lütfen fatura adresi seçin");
      return;
    }

    if (
      isCorporateInvoice &&
      (!formData.companyName || !formData.taxNumber || !formData.taxOffice)
    ) {
      toast.error("Lütfen kurumsal fatura bilgilerini doldurun");
      return;
    }

    // Backend'e gönderilecek veri
    const orderData = {
      // Kullanıcı bilgileri
      recipientName: formData.recipientName,
      recipientSurname: formData.recipientSurname,
      phoneNumber: formData.phoneNumber,
      tcId: formData.tcId,
      email: formData.email,

      // Kurumsal fatura bilgileri (sadece kurumsal fatura seçilirse)
      ...(isCorporateInvoice && {
        companyName: formData.companyName,
        taxNumber: formData.taxNumber,
        taxOffice: formData.taxOffice,
      }),

      // Adres bilgileri
      deliveryAddressId: selectedAddressId,
      billingAddressId: billingSameAsDelivery
        ? selectedAddressId
        : selectedBillingAddressId,
      billingSameAsDelivery,
      isCorporateInvoice,
    };

    console.log("Sipariş verisi:", orderData);
    // Burada backend API çağrısı yapılacak
  };

  // Sepet verisi
  const { cartProducts = [] } = useCart();
  const total = cartProducts.reduce(
    (sum: number, item: any) =>
      sum + (item.discountedPrice || item.price) * item.quantity,
    0
  );

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
              {/* Sipariş Bilgileri Section */}
              <h5 className="fw-5 mb_20">Sipariş Bilgileri</h5>

              <div className="mb-4">
                <button
                  type="button"
                  className="btn btn-outline-primary mb-3"
                  onClick={handleUseProfileInfo}
                >
                  Profil Bilgilerimi Kullan
                </button>
              </div>

              <form className="form-checkout" onSubmit={handleSubmit}>
                <div className="box grid-2">
                  <fieldset className="fieldset">
                    <label htmlFor="first-name">Adınız *</label>
                    <input
                      type="text"
                      id="first-name"
                      name="recipientName"
                      value={formData.recipientName}
                      onChange={handleInputChange}
                      required
                    />
                  </fieldset>
                  <fieldset className="fieldset">
                    <label htmlFor="last-name">Soyadınız *</label>
                    <input
                      type="text"
                      id="last-name"
                      name="recipientSurname"
                      value={formData.recipientSurname}
                      onChange={handleInputChange}
                      required
                    />
                  </fieldset>
                </div>

                <fieldset className="box fieldset">
                  <label htmlFor="phone">Telefon Numaranız *</label>
                  <div className="input-group">
                    <input
                      type="tel"
                      id="phone"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      placeholder="5XX XXX XX XX"
                      required
                      className="form-control"
                    />
                    <span className="input-group-text">
                      <i className="icon-phone"></i>
                    </span>
                  </div>
                </fieldset>

                <fieldset className="box fieldset">
                  <label htmlFor="tcId">TC Kimlik Numaranız *</label>
                  <div className="input-group">
                    <input
                      type="text"
                      id="tcId"
                      name="tcId"
                      value={formData.tcId}
                      onChange={handleInputChange}
                      placeholder="11 haneli TC Kimlik Numarası"
                      maxLength={11}
                      required
                      className="form-control"
                    />
                    <span className="input-group-text">
                      <i className="icon-id-card"></i>
                    </span>
                  </div>
                  {formData.tcId.length > 0 && formData.tcId.length !== 11 && (
                    <small className="text-danger">
                      TC Kimlik Numarası 11 haneli olmalıdır.
                    </small>
                  )}
                </fieldset>

                <fieldset className="box fieldset">
                  <label htmlFor="email">Email adresi *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </fieldset>
              </form>

              {/* Teslimat Adresi Section */}
              <h5 className="fw-5 mb_20 mt-4">Teslimat Adresi</h5>

              {/* Address Selection */}
              {addresses.length > 0 && (
                <div className="row mb-3">
                  {addresses.map((address) => (
                    <div className="col-md-6 mb-2" key={address.id}>
                      <div
                        className={`border rounded p-3 cursor-pointer ${
                          selectedAddressId === address.id
                            ? "border-primary bg-light"
                            : "border-light"
                        }`}
                        onClick={() => handleAddressSelection(address.id)}
                        style={{ cursor: "pointer" }}
                      >
                        <div className="fw-medium mb-1">{address.title}</div>
                        <div className="small text-muted">
                          {address.firstName} {address.lastName}
                        </div>
                        <div className="small text-muted">
                          {address.city} / {address.district}
                        </div>
                        <div className="small text-muted">
                          {address.fullAddress}
                        </div>
                        <div className="small text-muted">Türkiye</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mb-3">
                <button
                  type="button"
                  className="btn btn-outline-primary"
                  onClick={() => $("#addAddressModal").modal("show")}
                >
                  Adres Ekle →
                </button>
              </div>

              {/* Checkboxes */}
              <div className="mt-4">
                <div className="form-check mb-2">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="billingSameAsDelivery"
                    checked={billingSameAsDelivery}
                    onChange={(e) => setBillingSameAsDelivery(e.target.checked)}
                  />
                  <label
                    className="form-check-label"
                    htmlFor="billingSameAsDelivery"
                  >
                    Fatura adresim teslimat adresimle aynı
                  </label>
                </div>

                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="isCorporateInvoice"
                    checked={isCorporateInvoice}
                    onChange={(e) => setIsCorporateInvoice(e.target.checked)}
                  />
                  <label
                    className="form-check-label"
                    htmlFor="isCorporateInvoice"
                  >
                    Kurumsal Fatura
                  </label>
                </div>
              </div>

              {/* Kurumsal Fatura Bilgileri */}
              {isCorporateInvoice && (
                <div className="mt-4">
                  <h6 className="fw-5 mb-3">Kurumsal Fatura Bilgileri</h6>
                  <div className="box grid-2">
                    <fieldset className="fieldset mb-3">
                      <label htmlFor="companyName">Firma Adı *</label>
                      <input
                        type="text"
                        id="companyName"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleInputChange}
                        required
                      />
                    </fieldset>
                    <fieldset className="fieldset ">
                      <label htmlFor="taxNumber">Vergi Numarası *</label>
                      <input
                        type="text"
                        id="taxNumber"
                        name="taxNumber"
                        value={formData.taxNumber}
                        onChange={handleInputChange}
                        placeholder="Vergi numarası"
                        required
                      />
                    </fieldset>
                  </div>
                  <fieldset className="box fieldset">
                    <label htmlFor="taxOffice">Vergi Dairesi *</label>
                    <input
                      type="text"
                      id="taxOffice"
                      name="taxOffice"
                      value={formData.taxOffice}
                      onChange={handleInputChange}
                      required
                    />
                  </fieldset>
                </div>
              )}

              {/* Fatura Adresi Section - Sadece farklıysa göster */}
              {!billingSameAsDelivery && (
                <div className="mt-4">
                  <h6 className="fw-5 mb-3">Fatura Adresi</h6>
                  {addresses.length > 0 && (
                    <div className="row mb-3">
                      {addresses.map((address) => (
                        <div className="col-md-6 mb-2" key={address.id}>
                          <div
                            className={`border rounded p-3 cursor-pointer ${
                              selectedBillingAddressId === address.id
                                ? "border-primary bg-light"
                                : "border-light"
                            }`}
                            onClick={() =>
                              handleBillingAddressSelection(address.id)
                            }
                            style={{ cursor: "pointer" }}
                          >
                            <div className="fw-medium mb-1">
                              {address.title}
                            </div>
                            <div className="small text-muted">
                              {address.firstName} {address.lastName}
                            </div>
                            <div className="small text-muted">
                              {address.city} / {address.district}
                            </div>
                            <div className="small text-muted">
                              {address.fullAddress}
                            </div>
                            <div className="small text-muted">Türkiye</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="mb-3">
                    <button
                      type="button"
                      className="btn btn-outline-primary"
                      onClick={() => $("#addAddressModal").modal("show")}
                    >
                      Adres Ekle →
                    </button>
                  </div>
                </div>
              )}
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
                            <p className="name text-center">
                              Sepetinizde ürün yok.
                            </p>
                          </div>
                        </div>
                      </li>
                    ) : (
                      cartProducts.map((item: any) => (
                        <li key={item.id} className="checkout-product-item">
                          <figure className="img-product">
                            <img
                              src={
                                item.baseImageUrl ||
                                item.imageUrl ||
                                "/assets/images/products/no-image.jpg"
                              }
                              alt={item.title}
                            />
                            <span className="quantity">{item.quantity}</span>
                          </figure>
                          <div className="content">
                            <div className="info">
                              <p className="name">{item.title}</p>
                              {item.variant && (
                                <span className="variant">{item.variant}</span>
                              )}
                            </div>
                            <span className="price">
                              {(item.discountedPrice || item.price).toFixed(2)}₺
                            </span>
                          </div>
                        </li>
                      ))
                    )}
                  </ul>
                  <div className="coupon-box">
                    <input type="text" placeholder="İndirim Kodu" />
                    <a
                      href="#"
                      className="tf-btn btn-sm radius-3 btn-fill btn-icon animate-hover-btn"
                    >
                      Uygula
                    </a>
                  </div>
                  <div className="d-flex justify-content-between line pb_20">
                    <h6 className="fw-5">Toplam</h6>
                    <h6 className="total fw-5">{total.toFixed(2)}₺</h6>
                  </div>
                  <div className="wd-check-payment">
                    <div className="fieldset-radio mb_20">
                      <input
                        type="radio"
                        name="payment"
                        id="bank"
                        className="tf-check"
                        defaultChecked
                      />
                      <label htmlFor="bank">Online Ödeme</label>
                    </div>
                    <div className="fieldset-radio mb_20">
                      <input
                        type="radio"
                        name="payment"
                        id="delivery"
                        className="tf-check"
                      />
                      <label htmlFor="delivery">Kapıda Ödeme</label>
                    </div>
                    <p className="text_black-2 mb_20">
                      Kişisel bilgileriniz, hizmet kalitemizi iyileştirmek ve{" "}
                      <a
                        href="/privacy-policy"
                        className="text-decoration-underline"
                      >
                        gizlilik politikamız
                      </a>
                      da belirtilen amaçlar için kullanılacaktır.
                    </p>
                  </div>
                  <button
                    type="submit"
                    className="tf-btn radius-3 btn-fill btn-icon animate-hover-btn justify-content-center"
                    onClick={handleSubmit}
                  >
                    Sipariş Ver
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Address Modal */}
      <GeneralModal
        id="addAddressModal"
        title="Adres Ekle"
        showFooter
        approveButtonText="Kaydet"
        approveButtonStyle={{
          backgroundColor: "#000",
          color: "#fff",
          border: "1px solid #000",
        }}
        isLoading={isAddingAddress}
        formId="addAddressForm"
      >
        <form id="addAddressForm" onSubmit={handleAddAddress}>
          <input
            type="text"
            className="form-control mb-3 shadow-none"
            placeholder="Adınız"
            value={newAddress.firstName}
            onChange={(e) =>
              setNewAddress({ ...newAddress, firstName: e.target.value })
            }
          />
          <input
            type="text"
            className="form-control mb-3 shadow-none"
            placeholder="Soyadınız"
            value={newAddress.lastName}
            onChange={(e) =>
              setNewAddress({ ...newAddress, lastName: e.target.value })
            }
          />
          <input
            type="text"
            className="form-control mb-3 shadow-none"
            placeholder="Adres Başlığı"
            value={newAddress.title}
            onChange={(e) =>
              setNewAddress({ ...newAddress, title: e.target.value })
            }
          />
          <input
            type="text"
            className="form-control mb-3 shadow-none"
            placeholder="Ülke"
            value="Türkiye"
            readOnly
          />

          <Select
            className="mb-3"
            options={
              provinces?.map((c: Province) => ({
                value: c.id,
                label: c.name,
              })) || []
            }
            value={provinces
              ?.map((c: Province) => ({
                value: c.id,
                label: c.name,
              }))
              .find(
                (option: { value: string; label: string }) =>
                  option.value === selectedProvinceId
              )}
            onChange={(selectedOption) => {
              setSelectedProvinceId(selectedOption?.value || "");
              setSelectedDistrictId("");
            }}
            placeholder={isProvincesLoading ? "Yükleniyor..." : "İl Seçiniz"}
            isClearable
            isDisabled={isProvincesLoading}
            styles={{
              option: (provided) => ({
                ...provided,
                color: "#333",
                backgroundColor: "#fff",
                "&:hover": {
                  backgroundColor: "#f5f5f5",
                },
              }),
              menu: (provided) => ({
                ...provided,
                backgroundColor: "#f8f8f8",
              }),
              control: (provided, state) => ({
                ...provided,
                backgroundColor: "#f8f8f8",
                outline: "none",
                boxShadow: "none",
                borderColor: state.isFocused ? "#ced4da" : provided.borderColor,
                "&:hover": {
                  borderColor: "#ced4da",
                  boxShadow: "none",
                },
              }),
            }}
          />
          <Select
            className="mb-3"
            options={
              districts?.map((d: District) => ({
                value: d.id,
                label: d.name,
              })) || []
            }
            value={districts
              ?.map((d: District) => ({
                value: d.id,
                label: d.name,
              }))
              .find(
                (option: { value: string; label: string }) =>
                  option.value === selectedDistrictId
              )}
            onChange={(selectedOption) =>
              setSelectedDistrictId(selectedOption?.value || "")
            }
            placeholder={isDistrictsLoading ? "Yükleniyor..." : "İlçe Seçiniz"}
            isClearable
            isDisabled={!selectedProvinceId || isDistrictsLoading}
            styles={{
              option: (provided) => ({
                ...provided,
                color: "#333",
                backgroundColor: "#fff",
                "&:hover": {
                  backgroundColor: "#f5f5f5",
                },
              }),
              menu: (provided) => ({
                ...provided,
                backgroundColor: "#f8f8f8",
              }),
              control: (provided, state) => ({
                ...provided,
                backgroundColor: "#f8f8f8",
                outline: "none",
                boxShadow: "none",
                borderColor: state.isFocused ? "#ced4da" : provided.borderColor,
                "&:hover": {
                  borderColor: "#ced4da",
                  boxShadow: "none",
                },
              }),
            }}
          />
          <input
            type="text"
            className="form-control mb-3 shadow-none"
            placeholder="Mahalle"
            value={newAddress.neighbourhood}
            onChange={(e) =>
              setNewAddress({ ...newAddress, neighbourhood: e.target.value })
            }
          />
          <input
            type="text"
            className="form-control mb-3 shadow-none"
            placeholder="Cadde"
            value={newAddress.street}
            onChange={(e) =>
              setNewAddress({ ...newAddress, street: e.target.value })
            }
          />

          <input
            type="text"
            className="form-control mb-3 shadow-none"
            placeholder="Açık Adres"
            value={newAddress.fullAddress}
            onChange={(e) =>
              setNewAddress({ ...newAddress, fullAddress: e.target.value })
            }
          />
        </form>
      </GeneralModal>
    </main>
  );
}

export default CheckoutPage;
