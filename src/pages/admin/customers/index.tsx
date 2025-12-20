import React, { useState, useEffect } from "react";
import {
  useGetCustomersList,
  useUpdateCustomer,
} from "@/hooks/services/customers";
import {
  CustomerListItem,
  UpdateCustomerRequest,
} from "@/constants/models/customers";
import CirclePagination from "@/components/shared/CirclePagination";
import { useDeleteCustomer } from "@/hooks/services/customers/useDeleteCustomer";
import ConfirmModal from "@/components/shared/ConfirmModal";

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const [registerDateInput, setRegisterDateInput] = useState("");
  const [registerDateToInput, setRegisterDateToInput] = useState("");

  const [registerDate, setRegisterDate] = useState("");
  const [registerDateTo, setRegisterDateTo] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingCustomer, setEditingCustomer] =
    useState<CustomerListItem | null>(null);
  const [deletingCustomer, setDeletingCustomer] =
    useState<CustomerListItem | null>(null);

  const {
    data: customersData,
    isLoading,
    refetch,
  } = useGetCustomersList({
    search: searchTerm,
    registerDate: registerDate || undefined,
    registerDateTo: registerDateTo || undefined,
    page: currentPage,
    pageSize: 20,
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearchTerm(searchInput);
      setCurrentPage(1);
    }, 1500);

    return () => clearTimeout(timeout);
  }, [searchInput]);

  // Eğer mevcut sayfada hiç item yoksa ve sayfa 1'den büyükse, önceki sayfaya git
  useEffect(() => {
    if (customersData?.data && currentPage > 1) {
      const hasItems =
        customersData.data.items && customersData.data.items.length > 0;
      if (!hasItems) {
        setCurrentPage(currentPage - 1);
      }
    }
  }, [customersData, currentPage]);

  const { updateCustomer, isPending: isUpdating } = useUpdateCustomer();
  const { deleteCustomer, isPending: isDeleting } = useDeleteCustomer();
  
  const handleUpdateCustomer = async (updateData: UpdateCustomerRequest) => {
    try {
      await updateCustomer(updateData);
      setEditingCustomer(null);
      refetch();
    } catch (error) {
      console.error("Error updating customer:", error);
    }
  };

  const handleDeleteCustomer = async (customer: CustomerListItem) => {
    try {
      await deleteCustomer(customer.id);
      setDeletingCustomer(null);
      refetch();
    } catch (error) {
      console.error("Error deleting customer:", error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("tr-TR");
  };
const normalizeString = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

    const filteredCustomers = React.useMemo(() => {
  if (!customersData?.data?.items) return [];

  return customersData.data.items.filter((customer) => {
    const user = customer.applicationUser;

    const fullText = normalizeString(
      `${user?.firstName ?? ""} ${user?.lastName ?? ""} ${user?.email ?? ""} ${user?.phoneNumber ?? ""}`
    );

    const searchMatch = searchTerm
      ? fullText.includes(normalizeString(searchTerm))
      : true;

    const registerDateValue =
      customer.createdOnValue || customer.registerDate;

    const date = registerDateValue
      ? new Date(registerDateValue)
      : null;

    const startMatch = registerDate
      ? date && date >= new Date(registerDate)
      : true;

    const endMatch = registerDateTo
      ? date && date <= new Date(registerDateTo + "T23:59:59.999")
      : true;

    return searchMatch && startMatch && endMatch;
  });
}, [
  customersData,
  searchTerm,
  registerDate,
  registerDateTo,
]);

  const getGenderText = (gender: number) => {
    switch (gender) {
      case 0:
        return "Erkek";
      case 1:
        return "Kadın";
      default:
        return "Belirtilmemiş";
    }
  };

  const handleClearFilters = () => {
    setSearchInput("");
    setSearchTerm("");
    setRegisterDateInput("");
    setRegisterDateToInput("");
    setRegisterDate("");
    setRegisterDateTo("");
    setCurrentPage(1);
  };

  if (isLoading) {
    return (
      <div className="content-wrapper">
        <div className="container-l flex-grow-1 container-p-y">
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ height: "400px" }}
          >
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Yükleniyor...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="content-wrapper">
      <div className="container-l flex-grow-1 container-p-y">
        <h4 className="fw-bold py-3 mb-4">
          <span className="text-muted fw-light">Admin /</span> Müşteriler
        </h4>

        {/* Search and Filter Section */}
        <div className="card mb-4">
          <div className="card-body">
            <div className="row">
              <div className="col-md-4 mb-3">
                <label className="form-label">Ara</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="İsim, email veya telefon ile ara..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
              </div>
              <div className="col-md-3 mb-3">
                <label className="form-label">Kayıt Tarihi (Başlangıç)</label>
                <input
  type="date"
  className="form-control"
  value={registerDateInput}
  onChange={(e) => {
    setRegisterDateInput(e.target.value);
  }}
  onBlur={() => {
    setRegisterDate(registerDateInput);
    setCurrentPage(1);
  }}
/>

              </div>
              <div className="col-md-3 mb-3">
                <label className="form-label">Kayıt Tarihi (Bitiş)</label>
                <input
                  type="date"
                  className="form-control"
                  value={registerDateToInput}
                   onChange={(e) => {
              setRegisterDateToInput(e.target.value);
            }}
            onBlur={() => {
              setRegisterDateTo(registerDateInput);
              setCurrentPage(1);
            }}
                          />
              </div>
              <div className="col-md-2 mb-3 d-flex align-items-end">
                <button
                  className="btn btn-outline-secondary w-100"
                  onClick={handleClearFilters}
                >
                  <i className="bx bx-refresh me-1"></i>
                  Temizle
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Active Filters */}
        {(searchTerm || registerDate || registerDateTo) && (
          <div className="card mb-3">
            <div className="card-body py-2">
              <div className="d-flex align-items-center">
                <small className="text-muted me-2">Aktif Filtreler:</small>
                {searchTerm && (
                  <span className="badge bg-primary me-2">
                    Arama: {searchTerm}
                    <button
                      type="button"
                      className="btn-close btn-close-white ms-1"
                      onClick={() => {
                        setSearchInput("");
                        setSearchTerm("");
                      }}
                      style={{ fontSize: "0.5rem" }}
                    ></button>
                  </span>
                )}
                {registerDate && (
                  <span className="badge bg-info me-2">
                    Başlangıç:{" "}
                    {new Date(registerDate).toLocaleDateString("tr-TR")}
                    <button
                      type="button"
                      className="btn-close btn-close-white ms-1"
                      onClick={() => {
                        setRegisterDateInput("");
                        setRegisterDate("");
                      }}
                      style={{ fontSize: "0.5rem" }}
                    ></button>
                  </span>
                )}
                {registerDateTo && (
                  <span className="badge bg-info me-2">
                    Bitiş:{" "}
                    {new Date(registerDateTo).toLocaleDateString("tr-TR")}
                    <button
                      type="button"
                      className="btn-close btn-close-white ms-1"
                      onClick={() => {
                        setRegisterDateToInput("");
                        setRegisterDateTo("");
                      }}
                      style={{ fontSize: "0.5rem" }}
                    ></button>
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Customers Table */}
        <div className="card">
          <div
            className="card-header d-flex justify-content-between align-items-center"
            style={{ margin: "20px" }}
          >
            <h5 className="mb-0">Müşteri Listesi</h5>
            <span className="badge text-muted" style={{ fontSize: "16px" }}>
             Toplam: {filteredCustomers.length || 0}
            </span>
          </div>
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Ad Soyad</th>
                  <th>Email</th>
                  <th>Telefon</th>
                  <th>Cinsiyet</th>
                  <th>Doğum Tarihi</th>
                  <th>Kayıt Tarihi</th>
                  <th>Bildirimler</th>
                  <th>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id}>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="avatar avatar-sm me-3">
                          <span className="avatar-initial rounded-circle bg-label-primary">
                            {customer.applicationUser?.firstName?.charAt(0) ||
                              "M"}
                            {customer.applicationUser?.lastName?.charAt(0) ||
                              "Ü"}
                          </span>
                        </div>
                        <div>
                          <h6 className="mb-0">
                            {customer.applicationUser?.firstName || ""}{" "}
                            {customer.applicationUser?.lastName || ""}
                          </h6>
                          <small className="text-muted">
                            ID: {customer.id.substring(0, 8)}...
                          </small>
                        </div>
                      </div>
                    </td>
                    <td>{customer.applicationUser?.email || "-"}</td>
                    <td>{customer.applicationUser?.phoneNumber || "-"}</td>
                    <td>
                      {getGenderText(customer.applicationUser?.gender || 0)}
                    </td>
                    <td>
                      {customer.applicationUser?.birthDate
                        ? formatDate(customer.applicationUser.birthDate)
                        : "-"}
                    </td>
                    <td>
                      {customer.createdOnValue
                        ? formatDate(customer.createdOnValue)
                        : customer.registerDate
                        ? formatDate(customer.registerDate)
                        : "-"}
                    </td>
                    <td>
                      <div className="d-flex gap-1">
                        <span
                          className={`badge ${
                            customer.isEmailNotificationEnabled
                              ? "bg-success"
                              : "bg-secondary"
                          }`}
                        >
                          Email
                        </span>
                        <span
                          className={`badge ${
                            customer.isSMSNotificationEnabled
                              ? "bg-success"
                              : "bg-secondary"
                          }`}
                        >
                          SMS
                        </span>
                      </div>
                    </td>
                    <td>
                      <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => setEditingCustomer(customer)}
                      >
                        <i className="bx bx-edit"></i> Düzenle
                      </button>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => setDeletingCustomer(customer)}
                        title="Sil"
                      >
                        <i className="bx bx-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {customersData &&
            customersData.data &&
            Math.ceil(customersData.data.count / 20) > 1 && (
              <div className="card-footer">
                <CirclePagination
                  totalCount={customersData.data.count}
                  currentPage={currentPage}
                  pageSize={20}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
        </div>

        {/* Edit Customer Modal */}
        {editingCustomer && (
          <div
            className="modal show d-block"
            tabIndex={-1}
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Müşteri Düzenle</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setEditingCustomer(null)}
                  ></button>
                </div>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const updateData: UpdateCustomerRequest = {
                      id: editingCustomer.id,
                      firstName: formData.get("firstName") as string,
                      lastName: formData.get("lastName") as string,
                      email: formData.get("email") as string,
                      phoneNumber: formData.get("phoneNumber") as string,
                      birthDate: formData.get("birthDate") as string,
                      gender: parseInt(formData.get("gender") as string),
                      isEmailNotificationEnabled:
                        formData.get("isEmailNotificationEnabled") === "on",
                      isSMSNotificationEnabled:
                        formData.get("isSMSNotificationEnabled") === "on",
                    };
                    handleUpdateCustomer(updateData);
                  }}
                >
                  <div className="modal-body">
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Ad</label>
                        <input
                          type="text"
                          className="form-control"
                          name="firstName"
                          defaultValue={
                            editingCustomer.applicationUser?.firstName || ""
                          }
                          required
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Soyad</label>
                        <input
                          type="text"
                          className="form-control"
                          name="lastName"
                          defaultValue={
                            editingCustomer.applicationUser?.lastName || ""
                          }
                          required
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Email</label>
                        <input
                          type="email"
                          className="form-control"
                          name="email"
                          defaultValue={
                            editingCustomer.applicationUser?.email || ""
                          }
                          required
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Telefon</label>
                        <input
                          type="tel"
                          className="form-control"
                          name="phoneNumber"
                          defaultValue={
                            editingCustomer.applicationUser?.phoneNumber || ""
                          }
                          required
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Doğum Tarihi</label>
                         <input
                          type="date"
                          className="form-control"
                          name="birthDate"
                          defaultValue={
                            editingCustomer.applicationUser?.birthDate
                              ? editingCustomer.applicationUser.birthDate.split(
                                  "T"
                                )[0]
                              : ""
                          }
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Cinsiyet</label>
                        <select
                          className="form-select"
                          name="gender"
                          defaultValue={
                            editingCustomer.applicationUser?.gender || 0
                          }
                        >
                          <option value={0}>Erkek</option>
                          <option value={1}>Kadın</option>
                        </select>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            name="isEmailNotificationEnabled"
                            defaultChecked={
                              editingCustomer.isEmailNotificationEnabled
                            }
                          />
                          <label className="form-check-label text-muted">
                            Email Bildirimleri
                          </label>
                        </div>
                      </div>
                      <div className="col-md-6 mb-3">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            name="isSMSNotificationEnabled"
                            defaultChecked={
                              editingCustomer.isSMSNotificationEnabled
                            }
                          />
                          <label className="form-check-label text-muted">
                            SMS Bildirimleri
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setEditingCustomer(null)}
                    >
                      İptal
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={isUpdating}
                    >
                      {isUpdating ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-1"
                            role="status"
                          ></span>
                          Güncelleniyor...
                        </>
                      ) : (
                        "Güncelle"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deletingCustomer && (
          <div
            className="modal show d-block"
            tabIndex={-1}
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Müşteri Sil</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setDeletingCustomer(null)}
                  ></button>
                </div>
                <div className="modal-body">
                  <ConfirmModal
                    title="Müşteri Sil"
                    message={`"${deletingCustomer?.applicationUser?.firstName} ${deletingCustomer?.applicationUser?.lastName}" adlı müşteriyi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`}
                    confirmButtonText="Sil"
                    cancelButtonText="İptal"
                    onConfirm={() => handleDeleteCustomer(deletingCustomer)}
                    isLoading={isDeleting}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}