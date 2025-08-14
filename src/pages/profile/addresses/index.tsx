import ConfirmModal from "@/components/shared/ConfirmModal";
import GeneralModal from "@/components/shared/GeneralModal";
import { Address } from "@/constants/models/Address";
import { useCreateAddress } from "@/hooks/services/address/useCreateAddress";
import { useDeleteAddress } from "@/hooks/services/address/useDeleteAddress";
import { useGetAddresses } from "@/hooks/services/address/useGetAddresses";
import { useUpdateAddress } from "@/hooks/services/address/useUpdateAddress";
import { useGetProvinces } from "@/hooks/services/address/useGetProvinces";
import { useGetCountries } from "@/hooks/services/address/useGetCountries";
import { useGetDistricts } from "@/hooks/services/address/useGetDistricts";
import { useState } from "react";
import toast from "react-hot-toast";
import { withProfileLayout } from "../_layout";
import Select from "react-select";
import { Province } from "@/constants/models/Province";
import { District } from "@/constants/models/Province";
import { useLanguage } from "@/context/LanguageContext";

function AddressesPage() {
  const { t } = useLanguage();
  const { addresses, isLoading } = useGetAddresses();
  const { createAddress, isPending: isAddingAddress } = useCreateAddress();
  const { updateAddress, isPending: isUpdatingAddress } = useUpdateAddress();
  const { deleteAddress, isPending: isDeletingAddress } = useDeleteAddress();

  const { countries = [] } = useGetCountries();
  const {
    provinces,
    isLoading: isProvincesLoading,
    error: provincesError,
  } = useGetProvinces();

  const [selectedCountryId, setSelectedCountryId] = useState<string>("");
  const [selectedProvinceId, setSelectedProvinceId] = useState<string>("");
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>("");

  const { districts, isLoading: isDistrictsLoading } =
    useGetDistricts(selectedProvinceId);

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

  const [editAddress, setEditAddress] = useState<Address | null>(null);
  const [addressToDelete, setAddressToDelete] = useState<Address | null>(null);

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
      setSelectedCountryId("");
      setSelectedProvinceId("");
      setSelectedDistrictId("");
      toast.success(t("myAddresses.addSuccess"));
    } catch {
      toast.error(t("myAddresses.addError"));
    }
  };

  const handleUpdateAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editAddress) return;

    if (
      !editAddress.title ||
      !editAddress.fullAddress ||
      !selectedProvinceId ||
      !selectedDistrictId ||
      !editAddress.neighbourhood ||
      !editAddress.street ||
      !editAddress.postalCode
    ) {
      toast.error(t("myAddresses.fillAllFields"));
      return;
    }

    try {
      const selectedProvince = provinces.find(
        (p) => p.id === selectedProvinceId
      );
      const selectedDistrict = districts.find(
        (d) => d.id === selectedDistrictId
      );

      await updateAddress({
        ...editAddress,
        country: "Türkiye",
        city: selectedProvince?.name || "",
        district: selectedDistrict?.name || "",
      });

      $("#editAddressModal").modal("hide");
      setEditAddress(null);
      setSelectedProvinceId("");
      setSelectedDistrictId("");
      toast.success(t("myAddresses.updateSuccess"));
    } catch (error) {
      console.error("Error updating address:", error);
      toast.error(t("myAddresses.updateError"));
    }
  };

  const handleDeleteAddress = async () => {
    if (!addressToDelete) return;
    try {
      await deleteAddress(addressToDelete.id);
      $("#deleteAddressModal").modal("hide");
      setAddressToDelete(null);
      toast.success(t("myAddresses.deleteSuccess"));
    } catch {
      toast.error(t("myAddresses.deleteError"));
    }
  };

  const openModal = (id: string, address?: Address) => {
    if (id === "add") $("#addAddressModal").modal("show");
    if (id === "edit" && address) {
      setEditAddress(address);
      $("#editAddressModal").modal("show");
    }
    if (id === "delete" && address) {
      setAddressToDelete(address);
      $("#deleteAddressModal").modal("show");
    }
  };

  if (isLoading) return <div>{t("myAddresses.loading")}</div>;

  return (
    <div>
      <style jsx>{`
        .cursor-pointer {
          cursor: pointer;
        }
        .cursor-pointer:hover {
          background-color: #f8f9fa !important;
        }
        .icon-edit:hover {
          color: #000 !important;
        }
        .text-danger:hover {
          color: #c82333 !important;
          background-color: #f8f9fa !important;
        }
        .shadow-none:focus {
          box-shadow: none !important;
          outline: none !important;
          border-color: #ced4da !important;
        }
      `}</style>
      
      <div className="d-flex justify-content-between align-items-center mb-4 p-3 border rounded bg-white shadow-sm">
        <p className="mb-0 text-muted small">
          {t("myAddresses.defaultInfo")}
        </p>
        <button
          className="btn btn-dark btn-sm text-nowrap"
          onClick={() => openModal("add")}
        >
          {t("myAddresses.addAddress")}
        </button>
      </div>

      <div className="row">
        {addresses.length > 0 ? (
          addresses.map((address) => (
            <div className="col-lg-6 mb-3" key={address.id}>
              <div className="border rounded p-4 bg-white shadow-sm h-100">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <h3 className="mb-0 h5 fw-semibold text-dark">
                    {address.firstName} {address.lastName}
                  </h3>
                  <div className="d-flex gap-2">
                    <i
                      className="icon-edit text-muted p-1 rounded cursor-pointer"
                      onClick={() => openModal("edit", address)}
                    ></i>
                    <span
                      className="text-danger p-1 rounded cursor-pointer fw-bold"
                      onClick={() => openModal("delete", address)}
                      style={{ fontSize: '16px', lineHeight: '1' }}
                    >
                      ×
                    </span>
                  </div>
                </div>
                <div className="small lh-base text-secondary">
                  <div className="fw-medium mb-2 text-dark">
                    {address.title}
                  </div>
                  <div className="mb-1">
                    {address.city} / {address.district}
                  </div>
                  <div className="mb-2">{t("myAddresses.country")}</div>
                  <div>{address.fullAddress}</div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-lg-6">
            <div className="border rounded p-4 bg-white shadow-sm text-center">
              <h3 className="mb-3 h5 fw-semibold text-dark">
                {t("myAddresses.noAddressTitle")}
              </h3>
              <p className="mb-3 text-muted small lh-base">
                {t("myAddresses.noAddressDescription")}
              </p>
              <button
                className="btn btn-outline-dark btn-sm d-inline-flex align-items-center gap-1"
                onClick={() => openModal("add")}
              >
                {t("myAddresses.add")} <i className="icon-edit"></i>
              </button>
            </div>
          </div>
        )}
      </div>

      <GeneralModal
        id="addAddressModal"
        title={t("myAddresses.addAddress")}
        showFooter
        approveButtonText={t("myAddresses.save")}
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
            placeholder={t("myAddresses.firstNamePlaceholder")}
            value={newAddress.firstName}
            onChange={(e) =>
              setNewAddress({ ...newAddress, firstName: e.target.value })
            }
          />
          <input
            type="text"
            className="form-control mb-3 shadow-none"
            placeholder={t("myAddresses.lastNamePlaceholder")}
            value={newAddress.lastName}
            onChange={(e) =>
              setNewAddress({ ...newAddress, lastName: e.target.value })
            }
          />
          <input
            type="text"
            className="form-control mb-3 shadow-none"
            placeholder={t("myAddresses.addressTitlePlaceholder")}
            value={newAddress.title}
            onChange={(e) =>
              setNewAddress({ ...newAddress, title: e.target.value })
            }
          />
          {/* <Select
            className="mb-3"
            options={countries.map((c: { id: string; commonName: string }) => ({
              value: c.id,
              label: c.commonName,
            }))}
            value={countries
              .map((c: { id: string; commonName: string }) => ({
                value: c.id,
                label: c.commonName,
              }))
              .find(
                (option: { value: string; label: string }) =>
                  option.value === selectedCountryId
              )}
            onChange={(selectedOption) =>
              setSelectedCountryId(selectedOption?.value || "")
            }
            placeholder="Ülke Seçiniz"
            isClearable
          /> */}
          <input
            type="text"
            className="form-control mb-3 shadow-none"
            placeholder={t("myAddresses.countryPlaceholder")}
            value={t("myAddresses.country")}
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
            placeholder={isProvincesLoading ? t("myAddresses.loading") : t("myAddresses.provincePlaceholder")}
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
            placeholder={isDistrictsLoading ? t("myAddresses.loading") : t("myAddresses.districtPlaceholder")}
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
            placeholder={t("myAddresses.neighbourhoodPlaceholder")}
            value={newAddress.neighbourhood}
            onChange={(e) =>
              setNewAddress({ ...newAddress, neighbourhood: e.target.value })
            }
          />
          <input
            type="text"
            className="form-control mb-3 shadow-none"
            placeholder={t("myAddresses.streetPlaceholder")}
            value={newAddress.street}
            onChange={(e) =>
              setNewAddress({ ...newAddress, street: e.target.value })
            }
          />
          <input
            type="text"
            className="form-control mb-3 shadow-none"
            placeholder={t("myAddresses.postalCodePlaceholder")}
            value={newAddress.postalCode}
            onChange={(e) =>
              setNewAddress({ ...newAddress, postalCode: e.target.value })
            }
            pattern="\d{5}"
            maxLength={5}
            inputMode="numeric"
            required
            title={t("myAddresses.postalCodeTitle")}
          />
          <input
            type="text"
            className="form-control mb-3 shadow-none"
            placeholder={t("myAddresses.fullAddressPlaceholder")}
            value={newAddress.fullAddress}
            onChange={(e) =>
              setNewAddress({ ...newAddress, fullAddress: e.target.value })
            }
          />
        </form>
      </GeneralModal>

      <GeneralModal
        id="editAddressModal"
        title={t("myAddresses.editAddressTitle")}
        showFooter
        approveButtonText={t("myAddresses.updateButton")}
        approveButtonStyle={{
          backgroundColor: "#000",
          color: "#fff",
          border: "1px solid #000",
        }}
        isLoading={isUpdatingAddress}
        formId="editAddressForm"
      >
        <form id="editAddressForm" onSubmit={handleUpdateAddress}>
          <input
            type="text"
            className="form-control mb-3 shadow-none"
            placeholder={t("myAddresses.firstNamePlaceholder")}
            value={editAddress?.firstName || ""}
            onChange={(e) =>
              setEditAddress(
                editAddress
                  ? { ...editAddress, firstName: e.target.value }
                  : null
              )
            }
          />
          <input
            type="text"
            className="form-control mb-3 shadow-none"
            placeholder={t("myAddresses.lastNamePlaceholder")}
            value={editAddress?.lastName || ""}
            onChange={(e) =>
              setEditAddress(
                editAddress
                  ? { ...editAddress, lastName: e.target.value }
                  : null
              )
            }
          />

          <input
            type="text"
            className="form-control mb-3 shadow-none"
            placeholder={t("myAddresses.addressTitlePlaceholder")}
            value={editAddress?.title || ""}
            onChange={(e) =>
              setEditAddress(
                editAddress ? { ...editAddress, title: e.target.value } : null
              )
            }
          />
          <input
            type="text"
            className="form-control mb-3 shadow-none"
            placeholder={t("myAddresses.countryPlaceholder")}
            value={t("myAddresses.country")}
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
            placeholder={isProvincesLoading ? t("myAddresses.loading") : t("myAddresses.provincePlaceholder")}
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
            className="mb-3 text-dark"
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
            placeholder={isDistrictsLoading ? t("myAddresses.loading") : t("myAddresses.districtPlaceholder")}
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
            placeholder={t("myAddresses.neighbourhoodPlaceholder")}
            value={editAddress?.neighbourhood || ""}
            onChange={(e) =>
              setEditAddress(
                editAddress
                  ? { ...editAddress, neighbourhood: e.target.value }
                  : null
              )
            }
          />
          <input
            type="text"
            className="form-control mb-3 shadow-none"
            placeholder={t("myAddresses.streetPlaceholder")}
            value={editAddress?.street || ""}
            onChange={(e) =>
              setEditAddress(
                editAddress ? { ...editAddress, street: e.target.value } : null
              )
            }
          />
          <input
            type="text"
            className="form-control mb-3 shadow-none"
            placeholder={t("myAddresses.postalCodePlaceholder")}
            value={editAddress?.postalCode || ""}
            onChange={(e) =>
              setEditAddress(
                editAddress
                  ? { ...editAddress, postalCode: e.target.value }
                  : null
              )
            }
          />
          <input
            type="text"
            className="form-control mb-3 shadow-none"
            placeholder={t("myAddresses.fullAddressPlaceholder")}
            value={editAddress?.fullAddress || ""}
            onChange={(e) =>
              setEditAddress(
                editAddress
                  ? { ...editAddress, fullAddress: e.target.value }
                  : null
              )
            }
          />
        </form>
      </GeneralModal>

      <GeneralModal
        id="deleteAddressModal"
        title={t("myAddresses.deleteAddressTitle")}
        showFooter={false}
      >
        <ConfirmModal
          onConfirm={handleDeleteAddress}
          isLoading={isDeletingAddress}
          title={t("myAddresses.deleteConfirmTitle")}
          message={t("myAddresses.deleteConfirmMessage")}
          confirmButtonText={t("myAddresses.deleteConfirmButton")}
        />
      </GeneralModal>
    </div>
  );
}

export default withProfileLayout(AddressesPage);
