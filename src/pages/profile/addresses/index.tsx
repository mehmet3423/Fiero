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

function AddressesPage() {
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
      toast.success("Adres başarıyla eklendi");
    } catch {
      toast.error("Adres eklenirken bir hata oluştu");
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
      toast.error("Lütfen tüm alanları doldurun");
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
      toast.success("Adres başarıyla güncellendi");
    } catch (error) {
      console.error("Error updating address:", error);
      toast.error("Adres güncellenirken bir hata oluştu");
    }
  };

  const handleDeleteAddress = async () => {
    if (!addressToDelete) return;
    try {
      await deleteAddress(addressToDelete.id);
      $("#deleteAddressModal").modal("hide");
      setAddressToDelete(null);
      toast.success("Adres başarıyla silindi");
    } catch {
      toast.error("Adres silinirken bir hata oluştu");
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

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
          padding: "20px 24px",
          border: "1px solid #eee",
          borderRadius: "8px",
          backgroundColor: "#fff",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <p
          style={{
            margin: 0,
            color: "#666",
            fontSize: "14px",
            lineHeight: "1.5",
          }}
        >
          Aşağıdaki adresler, ödeme sayfasında varsayılan olarak
          kullanılacaktır.
        </p>
        <button
          style={{
            padding: "12px 24px",
            border: "1px solid #000",
            borderRadius: "4px",
            backgroundColor: "#000",
            color: "#fff",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "500",
            transition: "all 0.3s ease",
            whiteSpace: "nowrap",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = "#333";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = "#000";
          }}
          onClick={() => openModal("add")}
        >
          Adres Ekle
        </button>
      </div>

      <div className="row">
        {addresses.length > 0 ? (
          addresses.map((address) => (
            <div className="col-lg-6 mb-3" key={address.id}>
              <div
                style={{
                  border: "1px solid #eee",
                  borderRadius: "8px",
                  padding: "24px",
                  backgroundColor: "#fff",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  height: "100%",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "16px",
                  }}
                >
                  <h3
                    style={{
                      margin: 0,
                      fontSize: "18px",
                      fontWeight: "600",
                      color: "#333",
                    }}
                  >
                    {address.firstName} {address.lastName}
                  </h3>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <i
                      style={{
                        cursor: "pointer",
                        fontSize: "16px",
                        color: "#666",
                        padding: "4px",
                        borderRadius: "4px",
                        transition: "all 0.3s ease",
                      }}
                      className="icon-edit"
                      onClick={() => openModal("edit", address)}
                      onMouseOver={(e) => {
                        e.currentTarget.style.color = "#000";
                        e.currentTarget.style.backgroundColor = "#f8f9fa";
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.color = "#666";
                        e.currentTarget.style.backgroundColor = "transparent";
                      }}
                    ></i>
                    <i
                      style={{
                        cursor: "pointer",
                        fontSize: "16px",
                        color: "#dc3545",
                        padding: "4px",
                        borderRadius: "4px",
                        transition: "all 0.3s ease",
                      }}
                      className="bx bxs-trash"
                      onClick={() => openModal("delete", address)}
                      onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = "#f8f9fa";
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                      }}
                    ></i>
                  </div>
                </div>
                <div
                  style={{
                    fontSize: "14px",
                    lineHeight: "1.6",
                    color: "#555",
                  }}
                >
                  <div
                    style={{
                      fontWeight: "500",
                      marginBottom: "8px",
                      color: "#333",
                    }}
                  >
                    {address.title}
                  </div>
                  <div style={{ marginBottom: "4px" }}>
                    {address.city} / {address.district}
                  </div>
                  <div style={{ marginBottom: "8px" }}>Türkiye</div>
                  <div>{address.fullAddress}</div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-lg-6">
            <div
              style={{
                border: "1px solid #eee",
                borderRadius: "8px",
                padding: "24px",
                backgroundColor: "#fff",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                textAlign: "center",
              }}
            >
              <h3
                style={{
                  marginBottom: "16px",
                  fontSize: "18px",
                  fontWeight: "600",
                  color: "#333",
                }}
              >
                Adresim
              </h3>
              <p
                style={{
                  marginBottom: "16px",
                  color: "#666",
                  fontSize: "14px",
                  lineHeight: "1.5",
                }}
              >
                Henüz bir fatura adresi eklemediniz.
              </p>
              <button
                style={{
                  padding: "8px 16px",
                  border: "1px solid #000",
                  borderRadius: "4px",
                  backgroundColor: "transparent",
                  color: "#000",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "500",
                  transition: "all 0.3s ease",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = "#000";
                  e.currentTarget.style.color = "#fff";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "#000";
                }}
                onClick={() => openModal("add")}
              >
                Ekle <i className="icon-edit"></i>
              </button>
            </div>
          </div>
        )}
      </div>

      <GeneralModal
        id="addAddressModal"
        title="Adres Ekle"
        showFooter
        approveButtonText="Kaydet"
        approveButtonStyle={{
          backgroundColor: "#000",
          color: "#fff",
          border: "1px solid #000", // Added border style
        }}
        isLoading={isAddingAddress}
        formId="addAddressForm"
      >
        <form id="addAddressForm" onSubmit={handleAddAddress}>
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Adınız"
            value={newAddress.firstName}
            onChange={(e) =>
              setNewAddress({ ...newAddress, firstName: e.target.value })
            }
          />
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Soyadınız"
            value={newAddress.lastName}
            onChange={(e) =>
              setNewAddress({ ...newAddress, lastName: e.target.value })
            }
          />
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Adres Başlığı"
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
            className="form-control mb-3"
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
              control: (provided) => ({
                ...provided,
                backgroundColor: "#f8f8f8",
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
              control: (provided) => ({
                ...provided,
                backgroundColor: "#f8f8f8",
              }),
            }}
          />
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Mahalle"
            value={newAddress.neighbourhood}
            onChange={(e) =>
              setNewAddress({ ...newAddress, neighbourhood: e.target.value })
            }
          />
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Cadde"
            value={newAddress.street}
            onChange={(e) =>
              setNewAddress({ ...newAddress, street: e.target.value })
            }
          />
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Posta Kodu"
            value={newAddress.postalCode}
            onChange={(e) =>
              setNewAddress({ ...newAddress, postalCode: e.target.value })
            }
            pattern="\d{5}"
            maxLength={5}
            inputMode="numeric"
            required
            title="Lütfen 5 haneli posta kodunu giriniz"
          />
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Açık Adres"
            value={newAddress.fullAddress}
            onChange={(e) =>
              setNewAddress({ ...newAddress, fullAddress: e.target.value })
            }
          />
        </form>
      </GeneralModal>

      <GeneralModal
        id="editAddressModal"
        title="Adres Düzenle"
        showFooter
        approveButtonText="Güncelle"
        approveButtonStyle={{
          backgroundColor: "#000",
          color: "#fff",
          border: "1px solid #000", // Added border style
        }}
        isLoading={isUpdatingAddress}
        formId="editAddressForm"
      >
        <form id="editAddressForm" onSubmit={handleUpdateAddress}>
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Adınız"
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
            className="form-control mb-3"
            placeholder="Soyadınız"
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
            className="form-control mb-3"
            placeholder="Adres Başlığı"
            value={editAddress?.title || ""}
            onChange={(e) =>
              setEditAddress(
                editAddress ? { ...editAddress, title: e.target.value } : null
              )
            }
          />
          <input
            type="text"
            className="form-control mb-3"
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
              control: (provided) => ({
                ...provided,
                backgroundColor: "#f8f8f8",
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
              control: (provided) => ({
                ...provided,
                backgroundColor: "#f8f8f8",
              }),
            }}
          />
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Mahalle"
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
            className="form-control mb-3"
            placeholder="Cadde"
            value={editAddress?.street || ""}
            onChange={(e) =>
              setEditAddress(
                editAddress ? { ...editAddress, street: e.target.value } : null
              )
            }
          />
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Posta Kodu"
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
            className="form-control mb-3"
            placeholder="Açık Adres"
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
        title="Adres Sil"
        showFooter={false}
      >
        <ConfirmModal
          onConfirm={handleDeleteAddress}
          isLoading={isDeletingAddress}
          title="Adresi Silmek İstediğinize Emin misiniz?"
          message="Bu adresi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz."
          confirmButtonText="Evet, Adresi Sil"
        />
      </GeneralModal>
    </div>
  );
}

export default withProfileLayout(AddressesPage);
