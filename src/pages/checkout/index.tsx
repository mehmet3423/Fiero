import GeneralModal from "@/components/shared/GeneralModal";
import {
  Address,
  District,
  Province,
  GuestAddressFormData,
} from "@/constants/models/Address";
import { useAuth } from "@/hooks/context/useAuth";
import { useCart } from "@/hooks/context/useCart";
import { useGetProvinces } from "@/hooks/services/address/useGetProvinces";
import { useGetDistricts } from "@/hooks/services/address/useGetDistricts";
import { useGetAddresses } from "@/hooks/services/address/useGetAddresses";
import { useCreateAddress } from "@/hooks/services/address/useCreateAddress";
import {
  useCreateOrderGuest,
  CreateOrderGuestRequest,
} from "@/hooks/services/order/useCreateOrderGuest";
import { useLanguage } from "@/context/LanguageContext";
import { useRouter } from "next/router";

import Select from "react-select";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

function CheckoutPage() {
  const { t } = useLanguage();
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
  const { addresses } = useGetAddresses();
  const { createAddress, isPending: isAddingAddress } = useCreateAddress();

  // Get provinces and districts
  const { provinces, isLoading: isProvincesLoading } = useGetProvinces();
  const { districts, isLoading: isDistrictsLoading } =
    useGetDistricts(selectedProvinceId);

  const router = useRouter();
  const { createGuestOrder, isCreatingOrder } = useCreateOrderGuest();
  const isGuest = !userProfile;

  const emptyGuestAddress: GuestAddressFormData = {
    firstName: "",
    lastName: "",
    phoneNumber: "",
    title: "",
    country: "Türkiye",
    city: "",
    district: "",
    neighbourhood: "",
    street: "",
    fullAddress: "",
    postalCode: "",
  };

  const [guestShippingAddress, setGuestShippingAddress] =
    useState<GuestAddressFormData>({ ...emptyGuestAddress });
  const [guestBillingAddress, setGuestBillingAddress] =
    useState<GuestAddressFormData>({ ...emptyGuestAddress });
  const [guestShippingProvinceId, setGuestShippingProvinceId] =
    useState<string>("");
  const [guestShippingDistrictId, setGuestShippingDistrictId] =
    useState<string>("");
  const [guestBillingProvinceId, setGuestBillingProvinceId] =
    useState<string>("");
  const [guestBillingDistrictId, setGuestBillingDistrictId] =
    useState<string>("");

  const {
    districts: guestShippingDistricts,
    isLoading: isGuestShippingDistrictsLoading,
  } = useGetDistricts(guestShippingProvinceId);
  const {
    districts: guestBillingDistricts,
    isLoading: isGuestBillingDistrictsLoading,
  } = useGetDistricts(guestBillingProvinceId);

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

  useEffect(() => {
    if (!isGuest) return;
    setGuestShippingAddress((prev) => ({
      ...prev,
      firstName: formData.recipientName,
      lastName: formData.recipientSurname,
      phoneNumber: formData.phoneNumber,
      country: "Türkiye",
    }));
  }, [
    isGuest,
    formData.recipientName,
    formData.recipientSurname,
    formData.phoneNumber,
  ]);

  useEffect(() => {
    if (!isGuest) return;
    if (billingSameAsDelivery) {
      setGuestBillingAddress((prev) => ({
        ...guestShippingAddress,
        firstName: formData.recipientName,
        lastName: formData.recipientSurname,
        phoneNumber: formData.phoneNumber,
        country: "Türkiye",
      }));
      setGuestBillingProvinceId(guestShippingProvinceId);
      setGuestBillingDistrictId(guestShippingDistrictId);
    } else {
      setGuestBillingAddress((prev) => ({
        ...prev,
        firstName: formData.recipientName,
        lastName: formData.recipientSurname,
        phoneNumber: formData.phoneNumber,
        country: "Türkiye",
      }));
    }
  }, [
    isGuest,
    billingSameAsDelivery,
    guestShippingAddress,
    guestShippingProvinceId,
    guestShippingDistrictId,
    formData.recipientName,
    formData.recipientSurname,
    formData.phoneNumber,
  ]);

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

  const handleBillingSameAsDeliveryChange = (checked: boolean) => {
    setBillingSameAsDelivery(checked);
    if (isGuest && checked) {
      setGuestBillingAddress({
        ...guestShippingAddress,
        firstName: formData.recipientName,
        lastName: formData.recipientSurname,
        phoneNumber: formData.phoneNumber,
        country: "Türkiye",
      });
      setGuestBillingProvinceId(guestShippingProvinceId);
      setGuestBillingDistrictId(guestShippingDistrictId);
    } else if (isGuest && !checked) {
      setGuestBillingAddress({
        ...emptyGuestAddress,
        firstName: formData.recipientName,
        lastName: formData.recipientSurname,
        phoneNumber: formData.phoneNumber,
      });
      setGuestBillingProvinceId("");
      setGuestBillingDistrictId("");
    }
  };

  const handleGuestAddressChange = (
    type: "shipping" | "billing",
    field: keyof GuestAddressFormData,
    value: string
  ) => {
    if (type === "shipping") {
      setGuestShippingAddress((prev) => ({ ...prev, [field]: value }));
    } else {
      setGuestBillingAddress((prev) => ({ ...prev, [field]: value }));
    }
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
      toast.success(t("checkoutPage.errors.addAddressSuccess"));
    } catch {
      toast.error(t("checkoutPage.errors.addAddressError"));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Form validation
    if (
      !formData.recipientName ||
      !formData.recipientSurname ||
      !formData.phoneNumber ||
      !formData.tcId ||
      !formData.email
    ) {
      toast.error(t("checkoutPage.errors.requiredFields"));
      return;
    }

    if (formData.tcId.length !== 11) {
      toast.error(t("checkoutPage.errors.tcIdLength"));
      return;
    }

    if (!selectedAddressId) {
      toast.error(t("checkoutPage.errors.selectDeliveryAddress"));
      return;
    }

    if (!billingSameAsDelivery && !selectedBillingAddressId) {
      toast.error(t("checkoutPage.errors.selectBillingAddress"));
      return;
    }

    if (
      isCorporateInvoice &&
      (!formData.companyName || !formData.taxNumber || !formData.taxOffice)
    ) {
      toast.error(t("checkoutPage.errors.corporateInvoiceFields"));
      return;
    }

    if (isGuest) {
      if (cartProducts.length === 0) {
        toast.error(t("checkoutPage.errors.emptyCart"));
        return;
      }

      if (!guestShippingProvinceId) {
        toast.error(t("checkoutPage.errors.selectProvince"));
        return;
      }

      const shippingProvince = provinces.find(
        (p) => p.id === guestShippingProvinceId
      );
      const shippingDistrict = guestShippingDistricts.find(
        (d) => d.id === guestShippingDistrictId
      );

      if (!shippingProvince) {
        toast.error(t("checkoutPage.errors.selectProvince"));
        return;
      }

      if (!shippingDistrict) {
        toast.error(t("checkoutPage.errors.selectDistrict"));
        return;
      }

      if (
        !guestShippingAddress.neighbourhood ||
        !guestShippingAddress.street ||
        !guestShippingAddress.fullAddress
      ) {
        toast.error(t("checkoutPage.errors.shippingAddressFields"));
        return;
      }

      let billingAddressPayload: GuestAddressFormData = {
        ...guestShippingAddress,
        firstName: formData.recipientName,
        lastName: formData.recipientSurname,
        phoneNumber: formData.phoneNumber,
        country: "Türkiye",
        city: shippingProvince.name,
        district: shippingDistrict.name,
      };

      if (!billingSameAsDelivery) {
        if (!guestBillingProvinceId) {
          toast.error(t("checkoutPage.errors.selectProvince"));
          return;
        }

        const billingProvince = provinces.find(
          (p) => p.id === guestBillingProvinceId
        );
        const billingDistrict = guestBillingDistricts.find(
          (d) => d.id === guestBillingDistrictId
        );

        if (!billingProvince) {
          toast.error(t("checkoutPage.errors.selectProvince"));
          return;
        }

        if (!billingDistrict) {
          toast.error(t("checkoutPage.errors.selectDistrict"));
          return;
        }

        if (
          !guestBillingAddress.neighbourhood ||
          !guestBillingAddress.street ||
          !guestBillingAddress.fullAddress
        ) {
          toast.error(t("checkoutPage.errors.billingAddressFields"));
          return;
        }

        billingAddressPayload = {
          ...guestBillingAddress,
          firstName: formData.recipientName,
          lastName: formData.recipientSurname,
          phoneNumber: formData.phoneNumber,
          country: "Türkiye",
          city: billingProvince.name,
          district: billingDistrict.name,
        };
      }

      const items = cartProducts
        .map((item: any) => ({
          itemId: item.id,
          quantity: item.quantity,
        }))
        .filter((item) => item.quantity > 0);

      if (!items.length) {
        toast.error(t("checkoutPage.errors.emptyCart"));
        return;
      }

      const orderRequest: CreateOrderGuestRequest = {
        createCartRequest: { items },
        recipientName: formData.recipientName,
        recipientSurname: formData.recipientSurname,
        recipientPhoneNumber: formData.phoneNumber,
        recipientIdentityNumber: formData.tcId,
        email: formData.email,
        createShippingAddress: {
          ...guestShippingAddress,
          firstName: formData.recipientName,
          lastName: formData.recipientSurname,
          phoneNumber: formData.phoneNumber,
          country: "Türkiye",
          city: shippingProvince.name,
          district: shippingDistrict.name,
        },
        createBillingAddress: billingAddressPayload,
        billingType: isCorporateInvoice ? 1 : 0,
        corporateCompanyName: isCorporateInvoice
          ? formData.companyName
          : undefined,
        corporateTaxNumber: isCorporateInvoice ? formData.taxNumber : undefined,
        corporateTaxOffice: isCorporateInvoice ? formData.taxOffice : undefined,
        cargoPrice: cargoPrice || 0,
        couponCode: appliedCoupon ? couponCode || undefined : undefined,
        isGiftWrap: isGiftWrap || undefined,
        giftWrapMessage: giftWrapMessage || undefined,
      };

      const result = await createGuestOrder(orderRequest);

      if (!result) {
        toast.error(t("checkoutPage.errors.orderFailed"));
        return;
      }

      toast.success(t("checkoutPage.orderSuccess"));

      if (result.paymentUrl) {
        window.location.href = result.paymentUrl;
        return;
      }

      router.push("/");
      return;
    }

    if (!selectedAddressId) {
      toast.error(t("checkoutPage.errors.selectDeliveryAddress"));
      return;
    }

    if (!billingSameAsDelivery && !selectedBillingAddressId) {
      toast.error(t("checkoutPage.errors.selectBillingAddress"));
      return;
    }

    // Backend'e gönderilecek veri (müşteri kullanıcıları için)
    const orderData = {
      recipientName: formData.recipientName,
      recipientSurname: formData.recipientSurname,
      phoneNumber: formData.phoneNumber,
      tcId: formData.tcId,
      email: formData.email,
      ...(isCorporateInvoice && {
        companyName: formData.companyName,
        taxNumber: formData.taxNumber,
        taxOffice: formData.taxOffice,
      }),
      deliveryAddressId: selectedAddressId,
      billingAddressId: billingSameAsDelivery
        ? selectedAddressId
        : selectedBillingAddressId,
      billingSameAsDelivery,
      isCorporateInvoice,
    };

    // TODO: Authenticated order creation will be handled separately.
  };

  // Sepet verisi
  const {
    cartProducts = [],
    cargoPrice = 0,
    couponCode,
    appliedCoupon,
    isGiftWrap,
    giftWrapMessage,
  } = useCart();
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
          <div className="heading text-center">
            {t("checkoutPage.pageTitle")}
          </div>
        </div>
      </div>

      {/* Page Cart Section */}
      <section className="flat-spacing-11">
        <div className="container">
          <div className="tf-page-cart-wrap layout-2">
            <div className="tf-page-cart-item">
              {/* Sipariş Bilgileri Section */}
              <h5 className="fw-5 mb_20">{t("checkoutPage.orderInfoTitle")}</h5>

              <form className="form-checkout" onSubmit={handleSubmit}>
                <div className="box grid-2">
                  <fieldset className="box fieldset">
                    <label htmlFor="email">{t("checkoutPage.email")} </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="form-control"
                    />
                  </fieldset>
                  <fieldset className="box fieldset">
                    <label htmlFor="tcId">{t("checkoutPage.tcId")} </label>
                    <div className="input-group">
                      <input
                        type="text"
                        id="tcId"
                        name="tcId"
                        value={formData.tcId}
                        onChange={handleInputChange}
                        placeholder={t("checkoutPage.tcIdPlaceholder")}
                        maxLength={11}
                        required
                        className="form-control"
                      />
                      <span className="input-group-text">
                        <i className="icon-id-card"></i>
                      </span>
                    </div>
                    {formData.tcId.length > 0 &&
                      formData.tcId.length !== 11 && (
                        <small className="text-danger">
                          {t("checkoutPage.errors.tcIdLength")}
                        </small>
                      )}
                  </fieldset>
                </div>
              </form>

              {/* Teslimat Adresi Section */}
              <h5 className="fw-5 mb_20 mt-4">
                {t("checkoutPage.deliveryAddressTitle")}
              </h5>

              {/* Address Selection */}
              {isGuest ? (
                <>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <input
                        type="text"
                        className="form-control mb-3 shadow-none"
                        placeholder={t("checkoutPage.firstNamePlaceholder")}
                        value={guestShippingAddress.firstName}
                        onChange={(e) =>
                          handleGuestAddressChange(
                            "shipping",
                            "firstName",
                            e.target.value
                          )
                        }
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <input
                        type="text"
                        className="form-control mb-3 shadow-none"
                        placeholder={t("checkoutPage.lastNamePlaceholder")}
                        value={guestShippingAddress.lastName}
                        onChange={(e) =>
                          handleGuestAddressChange(
                            "shipping",
                            "lastName",
                            e.target.value
                          )
                        }
                        required
                      />
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <input
                        type="text"
                        className="form-control mb-3 shadow-none"
                        placeholder={t("checkoutPage.phoneNumberPlaceholder")}
                        value={guestShippingAddress.phoneNumber}
                        onChange={(e) => {
                          const numericValue = e.target.value.replace(
                            /\D/g,
                            ""
                          );
                          if (numericValue.length <= 10) {
                            handleGuestAddressChange(
                              "shipping",
                              "phoneNumber",
                              numericValue
                            );
                          }
                        }}
                        maxLength={10}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <input
                        type="text"
                        className="form-control mb-3 shadow-none"
                        placeholder={t("checkoutPage.addressTitlePlaceholder")}
                        value={guestShippingAddress.title || ""}
                        onChange={(e) =>
                          handleGuestAddressChange(
                            "shipping",
                            "title",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <Select
                        className="mb-3"
                        options={
                          provinces?.map((c: Province) => ({
                            value: c.id,
                            label: c.name,
                          })) || []
                        }
                        value={
                          guestShippingProvinceId
                            ? {
                                value: guestShippingProvinceId,
                                label:
                                  provinces?.find(
                                    (option) =>
                                      option.id === guestShippingProvinceId
                                  )?.name || "",
                              }
                            : null
                        }
                        onChange={(selectedOption) => {
                          setGuestShippingProvinceId(
                            selectedOption?.value || ""
                          );
                          setGuestShippingDistrictId("");
                        }}
                        placeholder={
                          isProvincesLoading
                            ? t("checkoutPage.loading")
                            : t("checkoutPage.provincePlaceholder")
                        }
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
                            borderColor: state.isFocused
                              ? "#ced4da"
                              : provided.borderColor,
                            "&:hover": {
                              borderColor: "#ced4da",
                              boxShadow: "none",
                            },
                          }),
                        }}
                      />
                    </div>
                    <div className="col-md-6">
                      <Select
                        className="mb-3"
                        options={
                          guestShippingDistricts?.map((d: District) => ({
                            value: d.id,
                            label: d.name,
                          })) || []
                        }
                        value={
                          guestShippingDistrictId
                            ? {
                                value: guestShippingDistrictId,
                                label:
                                  guestShippingDistricts?.find(
                                    (option) =>
                                      option.id === guestShippingDistrictId
                                  )?.name || "",
                              }
                            : null
                        }
                        onChange={(selectedOption) =>
                          setGuestShippingDistrictId(
                            selectedOption?.value || ""
                          )
                        }
                        placeholder={
                          guestShippingProvinceId
                            ? isGuestShippingDistrictsLoading
                              ? t("checkoutPage.loading")
                              : t("checkoutPage.districtPlaceholder")
                            : t("checkoutPage.districtPlaceholder")
                        }
                        isClearable
                        isDisabled={
                          !guestShippingProvinceId ||
                          isGuestShippingDistrictsLoading
                        }
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
                            borderColor: state.isFocused
                              ? "#ced4da"
                              : provided.borderColor,
                            "&:hover": {
                              borderColor: "#ced4da",
                              boxShadow: "none",
                            },
                          }),
                        }}
                      />
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <input
                        type="text"
                        className="form-control mb-3 shadow-none"
                        placeholder={t("checkoutPage.neighbourhoodPlaceholder")}
                        value={guestShippingAddress.neighbourhood}
                        onChange={(e) =>
                          handleGuestAddressChange(
                            "shipping",
                            "neighbourhood",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div className="col-md-6">
                      <input
                        type="text"
                        className="form-control mb-3 shadow-none"
                        placeholder={t("checkoutPage.streetPlaceholder")}
                        value={guestShippingAddress.street}
                        onChange={(e) =>
                          handleGuestAddressChange(
                            "shipping",
                            "street",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-8">
                      <input
                        type="text"
                        className="form-control mb-3 shadow-none"
                        placeholder={t("checkoutPage.fullAddressPlaceholder")}
                        value={guestShippingAddress.fullAddress}
                        onChange={(e) =>
                          handleGuestAddressChange(
                            "shipping",
                            "fullAddress",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div className="col-md-4">
                      <input
                        type="text"
                        className="form-control mb-3 shadow-none"
                        placeholder={t("checkoutPage.postalCodePlaceholder")}
                        value={guestShippingAddress.postalCode || ""}
                        onChange={(e) => {
                          const numericValue = e.target.value.replace(
                            /\D/g,
                            ""
                          );
                          if (numericValue.length <= 5) {
                            handleGuestAddressChange(
                              "shipping",
                              "postalCode",
                              numericValue
                            );
                          }
                        }}
                        maxLength={5}
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
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
                      {t("checkoutPage.addAddressButton")}
                    </button>
                  </div>
                </>
              )}

              {/* Checkboxes */}
              <div className="mt-4">
                <div className="form-check mb-2">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="billingSameAsDelivery"
                    checked={billingSameAsDelivery}
                    onChange={(e) =>
                      handleBillingSameAsDeliveryChange(e.target.checked)
                    }
                  />
                  <label
                    className="form-check-label"
                    htmlFor="billingSameAsDelivery"
                  >
                    {t("checkoutPage.billingSameAsDelivery")}
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
                    {t("checkoutPage.isCorporateInvoice")}
                  </label>
                </div>
              </div>

              {/* Kurumsal Fatura Bilgileri */}
              {isCorporateInvoice && (
                <div className="mt-4">
                  <h6 className="fw-5 mb-3">
                    {t("checkoutPage.corporateInvoiceTitle")}
                  </h6>
                  <div className="box grid-2">
                    <fieldset className="fieldset mb-3">
                      <label htmlFor="companyName">
                        {t("checkoutPage.companyName")}{" "}
                      </label>
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
                      <label htmlFor="taxNumber">
                        {t("checkoutPage.taxNumber")}*
                      </label>
                      <input
                        type="text"
                        id="taxNumber"
                        name="taxNumber"
                        value={formData.taxNumber}
                        onChange={handleInputChange}
                        placeholder={t("checkoutPage.taxNumber")}
                        required
                      />
                    </fieldset>
                  </div>
                  <fieldset className="box fieldset">
                    <label htmlFor="taxOffice">
                      {t("checkoutPage.taxOffice")}*
                    </label>
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
                  <h6 className="fw-5 mb-3">
                    {t("checkoutPage.billingAddressTitle")}
                  </h6>
                  {isGuest ? (
                    <>
                      <div className="row mb-3">
                        <div className="col-md-6">
                          <input
                            type="text"
                            className="form-control mb-3 shadow-none"
                            placeholder={t("checkoutPage.firstNamePlaceholder")}
                            value={guestBillingAddress.firstName}
                            onChange={(e) =>
                              handleGuestAddressChange(
                                "billing",
                                "firstName",
                                e.target.value
                              )
                            }
                            required
                          />
                        </div>
                        <div className="col-md-6">
                          <input
                            type="text"
                            className="form-control mb-3 shadow-none"
                            placeholder={t("checkoutPage.lastNamePlaceholder")}
                            value={guestBillingAddress.lastName}
                            onChange={(e) =>
                              handleGuestAddressChange(
                                "billing",
                                "lastName",
                                e.target.value
                              )
                            }
                            required
                          />
                        </div>
                      </div>
                      <div className="row mb-3">
                        <div className="col-md-6">
                          <input
                            type="text"
                            className="form-control mb-3 shadow-none"
                            placeholder={t(
                              "checkoutPage.phoneNumberPlaceholder"
                            )}
                            value={guestBillingAddress.phoneNumber}
                            onChange={(e) => {
                              const numericValue = e.target.value.replace(
                                /\D/g,
                                ""
                              );
                              if (numericValue.length <= 10) {
                                handleGuestAddressChange(
                                  "billing",
                                  "phoneNumber",
                                  numericValue
                                );
                              }
                            }}
                            maxLength={10}
                            required
                          />
                        </div>
                        <div className="col-md-6">
                          <input
                            type="text"
                            className="form-control mb-3 shadow-none"
                            placeholder={t(
                              "checkoutPage.addressTitlePlaceholder"
                            )}
                            value={guestBillingAddress.title || ""}
                            onChange={(e) =>
                              handleGuestAddressChange(
                                "billing",
                                "title",
                                e.target.value
                              )
                            }
                          />
                        </div>
                      </div>
                      <div className="row mb-3">
                        <div className="col-md-6">
                          <Select
                            className="mb-3"
                            options={
                              provinces?.map((c: Province) => ({
                                value: c.id,
                                label: c.name,
                              })) || []
                            }
                            value={
                              guestBillingProvinceId
                                ? {
                                    value: guestBillingProvinceId,
                                    label:
                                      provinces?.find(
                                        (option) =>
                                          option.id === guestBillingProvinceId
                                      )?.name || "",
                                  }
                                : null
                            }
                            onChange={(selectedOption) => {
                              setGuestBillingProvinceId(
                                selectedOption?.value || ""
                              );
                              setGuestBillingDistrictId("");
                            }}
                            placeholder={
                              isProvincesLoading
                                ? t("checkoutPage.loading")
                                : t("checkoutPage.provincePlaceholder")
                            }
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
                                borderColor: state.isFocused
                                  ? "#ced4da"
                                  : provided.borderColor,
                                "&:hover": {
                                  borderColor: "#ced4da",
                                  boxShadow: "none",
                                },
                              }),
                            }}
                          />
                        </div>
                        <div className="col-md-6">
                          <Select
                            className="mb-3"
                            options={
                              guestBillingDistricts?.map((d: District) => ({
                                value: d.id,
                                label: d.name,
                              })) || []
                            }
                            value={
                              guestBillingDistrictId
                                ? {
                                    value: guestBillingDistrictId,
                                    label:
                                      guestBillingDistricts?.find(
                                        (option) =>
                                          option.id === guestBillingDistrictId
                                      )?.name || "",
                                  }
                                : null
                            }
                            onChange={(selectedOption) =>
                              setGuestBillingDistrictId(
                                selectedOption?.value || ""
                              )
                            }
                            placeholder={
                              guestBillingProvinceId
                                ? isGuestBillingDistrictsLoading
                                  ? t("checkoutPage.loading")
                                  : t("checkoutPage.districtPlaceholder")
                                : t("checkoutPage.districtPlaceholder")
                            }
                            isClearable
                            isDisabled={
                              !guestBillingProvinceId ||
                              isGuestBillingDistrictsLoading
                            }
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
                                borderColor: state.isFocused
                                  ? "#ced4da"
                                  : provided.borderColor,
                                "&:hover": {
                                  borderColor: "#ced4da",
                                  boxShadow: "none",
                                },
                              }),
                            }}
                          />
                        </div>
                      </div>
                      <div className="row mb-3">
                        <div className="col-md-6">
                          <input
                            type="text"
                            className="form-control mb-3 shadow-none"
                            placeholder={t(
                              "checkoutPage.neighbourhoodPlaceholder"
                            )}
                            value={guestBillingAddress.neighbourhood}
                            onChange={(e) =>
                              handleGuestAddressChange(
                                "billing",
                                "neighbourhood",
                                e.target.value
                              )
                            }
                          />
                        </div>
                        <div className="col-md-6">
                          <input
                            type="text"
                            className="form-control mb-3 shadow-none"
                            placeholder={t("checkoutPage.streetPlaceholder")}
                            value={guestBillingAddress.street}
                            onChange={(e) =>
                              handleGuestAddressChange(
                                "billing",
                                "street",
                                e.target.value
                              )
                            }
                          />
                        </div>
                      </div>
                      <div className="row mb-3">
                        <div className="col-md-8">
                          <input
                            type="text"
                            className="form-control mb-3 shadow-none"
                            placeholder={t(
                              "checkoutPage.fullAddressPlaceholder"
                            )}
                            value={guestBillingAddress.fullAddress}
                            onChange={(e) =>
                              handleGuestAddressChange(
                                "billing",
                                "fullAddress",
                                e.target.value
                              )
                            }
                          />
                        </div>
                        <div className="col-md-4">
                          <input
                            type="text"
                            className="form-control mb-3 shadow-none"
                            placeholder={t(
                              "checkoutPage.postalCodePlaceholder"
                            )}
                            value={guestBillingAddress.postalCode || ""}
                            onChange={(e) => {
                              const numericValue = e.target.value.replace(
                                /\D/g,
                                ""
                              );
                              if (numericValue.length <= 5) {
                                handleGuestAddressChange(
                                  "billing",
                                  "postalCode",
                                  numericValue
                                );
                              }
                            }}
                            maxLength={5}
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
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
                          {t("checkoutPage.addAddressButton")}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            <div className="tf-page-cart-footer">
              <div className="tf-cart-footer-inner">
                <h5 className="fw-5 mb_20">
                  {t("checkoutPage.orderSummaryTitle")}
                </h5>
                <form className="tf-page-cart-checkout widget-wrap-checkout">
                  <ul className="wrap-checkout-product">
                    {cartProducts.length === 0 ? (
                      <li className="checkout-product-item">
                        <div className="content">
                          <div className="info">
                            <p className="name text-center">
                              {t("checkoutPage.noProductsInCart")}
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

                  <div className="d-flex justify-content-between line pb_20">
                    <h6 className="fw-5">{t("checkoutPage.total")}</h6>
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
                      <label htmlFor="bank">
                        {t("checkoutPage.onlinePayment")}
                      </label>
                    </div>
                    <div className="fieldset-radio mb_20">
                      <input
                        type="radio"
                        name="payment"
                        id="delivery"
                        className="tf-check"
                      />
                      <label htmlFor="delivery">
                        {t("checkoutPage.cashOnDelivery")}
                      </label>
                    </div>
                    <p className="text_black-2 mb_20">
                      {t("checkoutPage.privacyPolicyMessage1")}
                      <a
                        href="/privacy-policy"
                        className="text-decoration-underline"
                      >
                        {t("checkoutPage.privacyPolicyMessage2")}
                      </a>
                      {t("checkoutPage.privacyPolicyMessage3")}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="tf-btn radius-3 btn-fill btn-icon animate-hover-btn justify-content-center"
                    onClick={() => router.push("/payment")}
                  >
                    {t("checkoutPage.placeOrderButton")}
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
        title={t("checkoutPage.addAddressModalTitle")}
        showFooter
        approveButtonText={t("checkoutPage.saveButton")}
        isLoading={isAddingAddress}
        formId="addAddressForm"
      >
        <form id="addAddressForm" onSubmit={handleAddAddress}>
          <input
            type="text"
            className="form-control mb-3 shadow-none"
            placeholder={t("checkoutPage.firstNamePlaceholder")}
            value={newAddress.firstName}
            onChange={(e) =>
              setNewAddress({ ...newAddress, firstName: e.target.value })
            }
          />
          <input
            type="text"
            className="form-control mb-3 shadow-none"
            placeholder={t("checkoutPage.lastNamePlaceholder")}
            value={newAddress.lastName}
            onChange={(e) =>
              setNewAddress({ ...newAddress, lastName: e.target.value })
            }
          />
          <input
            type="text"
            className="form-control mb-3 shadow-none"
            placeholder={t("checkoutPage.addressTitlePlaceholder")}
            value={newAddress.title}
            onChange={(e) =>
              setNewAddress({ ...newAddress, title: e.target.value })
            }
          />
          <input
            type="text"
            className="form-control mb-3 shadow-none"
            placeholder={t("checkoutPage.countryPlaceholder")}
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
            placeholder={
              isProvincesLoading
                ? t("checkoutPage.loading")
                : t("checkoutPage.provincePlaceholder")
            }
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
            placeholder={
              isDistrictsLoading
                ? t("checkoutPage.loading")
                : t("checkoutPage.districtPlaceholder")
            }
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
            placeholder={t("checkoutPage.neighbourhoodPlaceholder")}
            value={newAddress.neighbourhood}
            onChange={(e) =>
              setNewAddress({ ...newAddress, neighbourhood: e.target.value })
            }
          />
          <input
            type="text"
            className="form-control mb-3 shadow-none"
            placeholder={t("checkoutPage.streetPlaceholder")}
            value={newAddress.street}
            onChange={(e) =>
              setNewAddress({ ...newAddress, street: e.target.value })
            }
          />

          <input
            type="text"
            className="form-control mb-3 shadow-none"
            placeholder={t("checkoutPage.fullAddressPlaceholder")}
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
