import CirclePagination from "@/components/shared/CirclePagination";
import GeneralModal from "@/components/shared/GeneralModal";
import {
  getAffiliateStatusText,
  getUpdateableAffiliateStatusText,
  UpdateableAffiliateStatus,
} from "@/constants/enums/affiliate/AffiliateApplicationStatus";
import { useChangeAffiliateUserStatus } from "@/hooks/services/admin-affiliate/useChangeAffiliateUserStatus";
import { useGetAffiliateUserList } from "@/hooks/services/admin-affiliate/useGetAffiliateUserList";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "react-hot-toast";

function AffiliatesPage() {
  const router = useRouter();
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [editForm, setEditForm] = useState({
    status: 0,
  });

  const { affiliateUserList, isLoading, error, totalCount } =
    useGetAffiliateUserList(pageIndex, pageSize);

  const { changeAffiliateUserStatus, isPending } =
    useChangeAffiliateUserStatus();

  const handlePageChange = (newPageIndex: number) => {
    setPageIndex(newPageIndex);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
  };

  const handleEditClick = (e: React.MouseEvent, user: any) => {
    e.stopPropagation();
    setEditingUser(user);
    setEditForm({
      status: user.status,
    });
    $("#editAffiliateModal").modal("show");
  };

  const handleRowClick = (userId: string) => {
    router.push(`/admin/affiliates/${userId}`);
  };

  const handleSaveEdit = () => {
    if (editingUser) {
      if (editForm.status === undefined || editForm.status === null) {
        toast.error("Lütfen geçerli bir durum seçiniz");
        return;
      }
      changeAffiliateUserStatus(editingUser.id, editForm.status);
      setEditingUser(null);
    }
    $("#editAffiliateModal").modal("hide");
  };

  if (isLoading) {
    return <div>Yükleniyor...</div>;
  }

  if (error) {
    return <div>Bir hata oluştu: {error.message}</div>;
  }

  return (
    <div className="page-content py-4">
      {/* İstatistik Kutuları */}
      <div
        className="card-header pt-2 bg-transparent border-0 d-flex justify-content-between align-items-center"
        style={{ padding: "20px" }}
      >
        <h5 className="mb-0" style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
          Affiliate Kullanıcıları
        </h5>
      </div>

      <div className="card">
        <div className=""></div>

        <div className="card-body">
          <div className="table-responsive">
            <table
              className="table table-hover"
              style={{ fontSize: "0.813rem" }}
            >
              <thead>
                <tr>
                  <th style={{ fontSize: "0.813rem" }}>Sıra</th>
                  <th style={{ fontSize: "0.813rem" }}>ID</th>
                  <th style={{ fontSize: "0.813rem" }}>Kullanıcı Adı</th>
                  <th style={{ fontSize: "0.813rem" }}>Email</th>
                  <th style={{ fontSize: "0.813rem" }}>Durum</th>
                  <th style={{ fontSize: "0.813rem" }}>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {affiliateUserList?.map((user, index) => (
                  <tr
                    key={user.id}
                    onClick={() => handleRowClick(user.id)}
                    style={{ cursor: "pointer" }}
                    className="hover-effect"
                  >
                    <td>{pageIndex * pageSize + index + 1}</td>
                    <td>{user.applicationUser.id}</td>
                    <td>{user.applicationUser.name}</td>
                    <td>{user.applicationUser.email}</td>
                    <td>{getAffiliateStatusText(user.status)}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-primary me-2"
                        onClick={(e) => handleEditClick(e, user)}
                      >
                        Düzenle
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <style jsx>{`
            .hover-effect:hover {
              background-color: #f8f9fa;
              transition: background-color 0.2s ease;
            }
          `}</style>

          <CirclePagination
            totalCount={totalCount}
            currentPage={pageIndex}
            pageSize={pageSize}
            onPageChange={handlePageChange}
          />

          {/* Düzenleme Modalı */}
          <GeneralModal
            id="editAffiliateModal"
            title="Affiliate Kullanıcısını Düzenle"
            size="md"
            onClose={() => setEditingUser(null)}
            approveButtonText="Güncelle"
            onApprove={handleSaveEdit}
            showFooter
          >
            {editingUser && (
              <>
                <div className=" mb-4 border-0 shadow-sm">
                  <div className="card-body p-4" style={{ fontSize: "1rem" }}>
                    <h6 className="card-title mb-4 text-primary fw-semibold">
                      Kullanıcı Bilgileri
                    </h6>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <div className="d-flex align-items-center mb-2">
                          <i className="fas fa-id-card me-2 text-muted"></i>
                          <div>
                            <small className="text-muted d-block">
                              Ad Soyad
                            </small>
                            <span className="small">
                              {editingUser.applicationUser.name}
                            </span>
                          </div>
                        </div>
                        <div className="d-flex align-items-center">
                          <i className="fas fa-envelope me-2 text-muted"></i>
                          <div>
                            <small className="text-muted d-block">Email</small>
                            <span className="small">
                              {editingUser.applicationUser.email}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="d-flex align-items-center mb-2">
                          <i className="fas fa-info-circle me-2 text-muted"></i>
                          <div>
                            <small className="text-muted d-block">
                              Mevcut Durum
                            </small>
                            <span className="small">
                              {getAffiliateStatusText(editingUser.status)}
                            </span>
                          </div>
                        </div>
                        <div className="d-flex align-items-center">
                          <i className="fas fa-percentage me-2 text-muted"></i>
                          <div>
                            <small className="text-muted d-block">
                              Mevcut Komisyon
                            </small>
                            <span className="small">
                              {editingUser.salesCommission || 0}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="form-group mb-3" style={{ fontSize: "1rem" }}>
                  <label className="form-label">Durum</label>
                  <div className="mb-2">
                    <small className="text-muted">
                      Mevcut Durum: {getAffiliateStatusText(editingUser.status)}
                    </small>
                  </div>
                  <select
                    style={{ fontSize: "0.8rem" }}
                    className="form-select"
                    value={
                      Object.values(UpdateableAffiliateStatus).includes(
                        editingUser.status
                      )
                        ? editForm.status
                        : ""
                    }
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        status: parseInt(e.target.value),
                      }))
                    }
                  >
                    <option value="">Durum Seçiniz</option>
                    {Object.values(UpdateableAffiliateStatus)
                      .filter((value) => typeof value === "number")
                      .map((status) => (
                        <option key={status} value={status}>
                          {getUpdateableAffiliateStatusText(status)}
                        </option>
                      ))}
                  </select>
                </div>
              </>
            )}
          </GeneralModal>
        </div>
      </div>
    </div>
  );
}

export default AffiliatesPage;
