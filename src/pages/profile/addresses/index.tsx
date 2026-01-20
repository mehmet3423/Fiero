import ConfirmModal from "@/components/shared/ConfirmModal";
import GeneralModal from "@/components/shared/GeneralModal";
import AddressForm from "@/components/shared/AddressForm";
import { Address } from "@/constants/models/Address";
import { useCreateAddress } from "@/hooks/services/address/useCreateAddress";
import { useDeleteAddress } from "@/hooks/services/address/useDeleteAddress";
import { useGetAddresses } from "@/hooks/services/address/useGetAddresses";
import { useUpdateAddress } from "@/hooks/services/address/useUpdateAddress";
import { useGetProvinces } from "@/hooks/services/address/useGetProvinces";
import { useGetCountries } from "@/hooks/services/address/useGetCountries";
import { useGetDistricts } from "@/hooks/services/address/useGetDistricts";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { withProfileLayout } from "../_layout";
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
    
    // Validation
    if (!selectedProvinceId || !selectedDistrictId) {
      toast.error(t("myAddresses.fillAllFields"));
      return;
    }

    if (!newAddress.firstName || !newAddress.lastName || !newAddress.fullAddress) {
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

      if (!selectedProvince || !selectedDistrict) {
        toast.error(t("myAddresses.fillAllFields"));
        return;
      }

      await createAddress(
        newAddress as Address,
        "Türkiye",
        selectedProvince?.name,
        selectedDistrict?.name,
        selectedDistrictId || undefined,
        selectedProvinceId || undefined,
        newAddress.phoneNumber
      );

      closeAddModal();
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

      closeEditModal();
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
      closeDeleteModal();
      toast.success(t("myAddresses.deleteSuccess"));
    } catch {
      toast.error(t("myAddresses.deleteError"));
    }
  };

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const openModal = (id: string, address?: Address) => {
    if (id === "add") {
      setIsAddModalOpen(true);
    }
    if (id === "edit" && address) {
      setEditAddress(address);
      setIsEditModalOpen(true);
    }
    if (id === "delete" && address) {
      setAddressToDelete(address);
      setIsDeleteModalOpen(true);
    }
  };

  // Edit modal açıldığında province ve district ID'lerini bul
  useEffect(() => {
    if (isEditModalOpen && editAddress && provinces.length > 0) {
      if (editAddress.city && editAddress.district) {
        const province = provinces.find((p) => p.name === editAddress.city);
        if (province) {
          setSelectedProvinceId(province.id);
          // District'leri yüklemek için province ID'si gerekiyor
          // Districts zaten selectedProvinceId'ye bağlı olarak yükleniyor
        }
      }
    }
  }, [isEditModalOpen, editAddress, provinces]);

  // District'ler yüklendiğinde district ID'sini bul
  useEffect(() => {
    if (
      isEditModalOpen &&
      editAddress &&
      districts.length > 0 &&
      selectedProvinceId
    ) {
      if (editAddress.district) {
        const district = districts.find((d) => d.name === editAddress.district);
        if (district) {
          setSelectedDistrictId(district.id);
        }
      }
    }
  }, [isEditModalOpen, editAddress, districts, selectedProvinceId]);

  // Modal'ları Bootstrap ile kontrol et
  useEffect(() => {
    if (!isAddModalOpen) return;

    const modalElement = document.getElementById("addAddressModal");
    if (!modalElement) return;

    const bootstrap = (window as any).bootstrap;
    if (!bootstrap || !bootstrap.Modal) return;

    let modalInstance = bootstrap.Modal.getInstance(modalElement);
    if (!modalInstance) {
      modalInstance = new bootstrap.Modal(modalElement);
    }

    modalInstance.show();

    const handleHidden = () => {
      setIsAddModalOpen(false);
    };

    modalElement.addEventListener("hidden.bs.modal", handleHidden);

    return () => {
      modalElement.removeEventListener("hidden.bs.modal", handleHidden);
    };
  }, [isAddModalOpen]);

  useEffect(() => {
    if (!isEditModalOpen) return;

    const modalElement = document.getElementById("editAddressModal");
    if (!modalElement) return;

    const bootstrap = (window as any).bootstrap;
    if (!bootstrap || !bootstrap.Modal) return;

    let modalInstance = bootstrap.Modal.getInstance(modalElement);
    if (!modalInstance) {
      modalInstance = new bootstrap.Modal(modalElement);
    }

    modalInstance.show();

    const handleHidden = () => {
      setIsEditModalOpen(false);
    };

    modalElement.addEventListener("hidden.bs.modal", handleHidden);

    return () => {
      modalElement.removeEventListener("hidden.bs.modal", handleHidden);
    };
  }, [isEditModalOpen]);

  useEffect(() => {
    if (!isDeleteModalOpen) return;

    const modalElement = document.getElementById("deleteAddressModal");
    if (!modalElement) return;

    const bootstrap = (window as any).bootstrap;
    if (!bootstrap || !bootstrap.Modal) return;

    let modalInstance = bootstrap.Modal.getInstance(modalElement);
    if (!modalInstance) {
      modalInstance = new bootstrap.Modal(modalElement);
    }

    modalInstance.show();

    const handleHidden = () => {
      setIsDeleteModalOpen(false);
    };

    modalElement.addEventListener("hidden.bs.modal", handleHidden);

    return () => {
      modalElement.removeEventListener("hidden.bs.modal", handleHidden);
    };
  }, [isDeleteModalOpen]);

  const closeAddModal = () => {
    setIsAddModalOpen(false);
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
      phoneNumber: "",
    });
    setSelectedProvinceId("");
    setSelectedDistrictId("");
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditAddress(null);
    setSelectedProvinceId("");
    setSelectedDistrictId("");
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setAddressToDelete(null);
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
        onClose={closeAddModal}
      >
        <form id="addAddressForm" onSubmit={handleAddAddress}>
          <AddressForm
            address={newAddress}
            onAddressChange={setNewAddress}
            selectedProvinceId={selectedProvinceId}
            selectedDistrictId={selectedDistrictId}
            onProvinceChange={setSelectedProvinceId}
            onDistrictChange={setSelectedDistrictId}
            provinces={provinces || []}
            districts={districts || []}
            isProvincesLoading={isProvincesLoading}
            isDistrictsLoading={isDistrictsLoading}
            showPostalCode={true}
            showPhoneNumber={true}
            translationPrefix="myAddresses"
          />
        </form>
      </GeneralModal>

      {editAddress && (
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
          onClose={closeEditModal}
        >
          <form id="editAddressForm" onSubmit={handleUpdateAddress}>
            <AddressForm
              address={editAddress}
              onAddressChange={(updated) => setEditAddress(updated as Address)}
              selectedProvinceId={selectedProvinceId}
              selectedDistrictId={selectedDistrictId}
              onProvinceChange={setSelectedProvinceId}
              onDistrictChange={setSelectedDistrictId}
              provinces={provinces || []}
              districts={districts || []}
              isProvincesLoading={isProvincesLoading}
              isDistrictsLoading={isDistrictsLoading}
              showPostalCode={true}
              showPhoneNumber={true}
              translationPrefix="myAddresses"
            />
          </form>
        </GeneralModal>
      )}

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
