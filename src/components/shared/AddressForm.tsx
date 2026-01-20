import React from "react";
import Select from "react-select";
import { Address } from "@/constants/models/Address";
import { Province, District } from "@/constants/models/Province";
import { useLanguage } from "@/context/LanguageContext";

interface AddressFormProps {
  address: Partial<Address>;
  onAddressChange: (address: Partial<Address>) => void;
  selectedProvinceId: string;
  selectedDistrictId: string;
  onProvinceChange: (provinceId: string) => void;
  onDistrictChange: (districtId: string) => void;
  provinces: Province[];
  districts: District[];
  isProvincesLoading: boolean;
  isDistrictsLoading: boolean;
  showPostalCode?: boolean;
  showPhoneNumber?: boolean;
  translationPrefix?: string; // "checkoutPage" veya "myAddresses"
}

function AddressForm({
  address,
  onAddressChange,
  selectedProvinceId,
  selectedDistrictId,
  onProvinceChange,
  onDistrictChange,
  provinces,
  districts,
  isProvincesLoading,
  isDistrictsLoading,
  showPostalCode = false,
  showPhoneNumber = false,
  translationPrefix = "checkoutPage",
}: AddressFormProps) {
  const { t } = useLanguage();

  const handleFieldChange = (field: keyof Address, value: string) => {
    onAddressChange({ ...address, [field]: value });
  };

  const selectStyles = {
    option: (provided: any) => ({
      ...provided,
      color: "#333",
      backgroundColor: "#fff",
      "&:hover": {
        backgroundColor: "#f5f5f5",
      },
    }),
    menu: (provided: any) => ({
      ...provided,
      backgroundColor: "#f8f8f8",
    }),
    control: (provided: any, state: any) => ({
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
  };

  return (
    <>
      <input
        type="text"
        className="form-control mb-3 shadow-none"
        placeholder={t(`${translationPrefix}.firstNamePlaceholder`)}
        value={address.firstName || ""}
        onChange={(e) => handleFieldChange("firstName", e.target.value)}
      />
      <input
        type="text"
        className="form-control mb-3 shadow-none"
        placeholder={t(`${translationPrefix}.lastNamePlaceholder`)}
        value={address.lastName || ""}
        onChange={(e) => handleFieldChange("lastName", e.target.value)}
      />
      <input
        type="text"
        className="form-control mb-3 shadow-none"
        placeholder={t(`${translationPrefix}.addressTitlePlaceholder`)}
        value={address.title || ""}
        onChange={(e) => handleFieldChange("title", e.target.value)}
      />
      {showPhoneNumber && (
        <input
          type="text"
          className="form-control mb-3 shadow-none"
          placeholder={t(`${translationPrefix}.phoneNumberPlaceholder`)}
          value={address.phoneNumber || ""}
          onChange={(e) => {
            const numericValue = e.target.value.replace(/\D/g, "");
            if (numericValue.length <= 10) {
              handleFieldChange("phoneNumber", numericValue);
            }
          }}
          maxLength={10}
          inputMode="numeric"
        />
      )}
      <input
        type="text"
        className="form-control mb-3 shadow-none"
        placeholder={t(`${translationPrefix}.countryPlaceholder`)}
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
        value={
          provinces
            ?.map((c: Province) => ({
              value: c.id,
              label: c.name,
            }))
            .find(
              (option: { value: string; label: string }) =>
                option.value === selectedProvinceId
            ) || null
        }
        onChange={(selectedOption) => {
          onProvinceChange(selectedOption?.value || "");
          onDistrictChange("");
        }}
        placeholder={
          isProvincesLoading
            ? t(`${translationPrefix}.loading`)
            : t(`${translationPrefix}.provincePlaceholder`)
        }
        isClearable
        isDisabled={isProvincesLoading}
        styles={selectStyles}
      />
      <Select
        className="mb-3"
        options={
          districts?.map((d: District) => ({
            value: d.id,
            label: d.name,
          })) || []
        }
        value={
          districts
            ?.map((d: District) => ({
              value: d.id,
              label: d.name,
            }))
            .find(
              (option: { value: string; label: string }) =>
                option.value === selectedDistrictId
            ) || null
        }
        onChange={(selectedOption) => onDistrictChange(selectedOption?.value || "")}
        placeholder={
          isDistrictsLoading
            ? t(`${translationPrefix}.loading`)
            : t(`${translationPrefix}.districtPlaceholder`)
        }
        isClearable
        isDisabled={!selectedProvinceId || isDistrictsLoading}
        styles={selectStyles}
      />
      <input
        type="text"
        className="form-control mb-3 shadow-none"
        placeholder={t(`${translationPrefix}.neighbourhoodPlaceholder`)}
        value={address.neighbourhood || ""}
        onChange={(e) => handleFieldChange("neighbourhood", e.target.value)}
      />
      <input
        type="text"
        className="form-control mb-3 shadow-none"
        placeholder={t(`${translationPrefix}.streetPlaceholder`)}
        value={address.street || ""}
        onChange={(e) => handleFieldChange("street", e.target.value)}
      />
      {showPostalCode && (
        <input
          type="text"
          className="form-control mb-3 shadow-none"
          placeholder={t(`${translationPrefix}.postalCodePlaceholder`)}
          value={address.postalCode || ""}
          onChange={(e) => {
            const numericValue = e.target.value.replace(/\D/g, "");
            if (numericValue.length <= 5) {
              handleFieldChange("postalCode", numericValue);
            }
          }}
          maxLength={5}
          pattern="\d{5}"
          inputMode="numeric"
        />
      )}
      <input
        type="text"
        className="form-control mb-3 shadow-none"
        placeholder={t(`${translationPrefix}.fullAddressPlaceholder`)}
        value={address.fullAddress || ""}
        onChange={(e) => handleFieldChange("fullAddress", e.target.value)}
      />
    </>
  );
}

export default AddressForm;
