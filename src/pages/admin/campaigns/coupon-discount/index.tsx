import CirclePagination from "@/components/shared/CirclePagination";
import GeneralModal from "@/components/shared/GeneralModal";
import { DiscountType } from "@/constants/enums/DiscountType";
import { CouponDiscount } from "@/constants/models/Discount";
import { useDeleteDiscount } from "@/hooks/services/discounts/useDeleteDiscount";
import { useGetDiscountList } from "@/hooks/services/discounts/useGetDiscountList";
import { faEdit, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "react-hot-toast";

const CouponDiscountPage = () => {
  const router = useRouter();
  const [page, setPage] = useState(0);
  const [pageSize] = useState(10);
  const [searchName, setSearchName] = useState("");
  const [isActive, setIsActive] = useState<boolean | undefined>(undefined);

  const { discounts, totalCount, isLoading } = useGetDiscountList({
    page,
    pageSize,
    name: searchName || undefined,
    isActive,
    discountType: DiscountType.Coupon,
  });

  // Cast the discounts to CouponDiscount[]
  const couponDiscounts = discounts as CouponDiscount[];

  const { deleteDiscount, isPending: isDeleting } = useDeleteDiscount();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const confirmDelete = (id: string) => {
    setDeletingId(id);
    $("#deleteDiscountModal").modal("show");
  };

  const handleCreate = () => {
    router.push("/admin/campaigns/coupon-discount/create");
  };

  const handleEdit = (id: string) => {
    router.push(`/admin/campaigns/coupon-discount/edit/${id}`);
  };

  const handleDelete = async () => {
    if (!deletingId) return;

    try {
      await deleteDiscount(deletingId);
      setDeletingId(null);
      $("#deleteDiscountModal").modal("hide");
      toast.success("Kupon indirimi başarıyla silindi");
    } catch (error) {
      toast.error("Kupon indirimi silinirken bir hata oluştu");
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchName(e.target.value);
    setPage(0);
  };

  const handleStatusFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setIsActive(value === "" ? undefined : value === "true");
    setPage(0);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("tr-TR");
  };

  const formatDiscountValue = (discount: CouponDiscount) => {
    return discount.discountValueType === 0
      ? `%${discount.discountValue}`
      : `${discount.discountValue} ₺`;
  };

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <h4 className="fw-bold py-3">
            <span className="text-muted fw-light">
              <Link
                href="/admin/campaigns"
                className="text-muted fw-light hover:text-primary"
              >
                Kampanyalar
              </Link>{" "}
              /{" "}
            </span>
            Kupon İndirimleri
          </h4>
        </div>
      </div>
      <div className="d-flex justify-content-between mb-4">
        <Link
          href="/admin/campaigns"
          className="btn btn-outline-secondary"
          style={{
            backgroundColor: "#e9e9e9",
            color: "#000",
            borderColor: "#d9d9d9",
          }}
        >
          <i className="bx bx-arrow-back me-1"></i>
          Geri
        </Link>
        <button className="btn btn-primary" onClick={handleCreate}>
          <FontAwesomeIcon icon={faPlus} className="me-1" />
          Yeni İndirim
        </button>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="row mb-3">
            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                placeholder="İndirim adı ile ara..."
                value={searchName}
                onChange={handleSearch}
              />
            </div>
            <div className="col-md-4">
              <select
                className="form-select"
                value={isActive === undefined ? "" : isActive.toString()}
                onChange={handleStatusFilter}
              >
                <option value="">Tüm Durumlar</option>
                <option value="true">Aktif</option>
                <option value="false">Pasif</option>
              </select>
            </div>
          </div>
        </div>

        <div className="table-responsive text-nowrap">
          <table className="table">
            <thead>
              <tr>
                <th>Kupon Kodu</th>
                <th>İndirim Adı</th>
                <th>İndirim Değeri</th>
                <th>Başlangıç</th>
                <th>Bitiş</th>
                <th>Durum</th>
                <th>İşlemler</th>
              </tr>
            </thead>
            <tbody className="table-border-bottom-0">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="text-center">
                    Yükleniyor...
                  </td>
                </tr>
              ) : couponDiscounts?.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center">
                    Henüz kupon indirimi bulunmuyor
                  </td>
                </tr>
              ) : (
                couponDiscounts?.map((discount: CouponDiscount) => (
                  <tr key={discount.id}>
                    <td>
                      <strong>{discount.couponDiscount?.couponCode}</strong>
                    </td>
                    <td>
                      <strong>{discount.name}</strong>
                      {discount.description && (
                        <small className="d-block text-muted">
                          {discount.description}
                        </small>
                      )}
                    </td>
                    <td>{formatDiscountValue(discount)}</td>
                    <td>{formatDate(discount.startDate)}</td>
                    <td>{formatDate(discount.endDate)}</td>
                    <td>
                      <span
                        className={`badge bg-${
                          discount.isActive &&
                          (discount.isWithinActiveDateRange === undefined ||
                            discount.isWithinActiveDateRange)
                            ? "success"
                            : "danger"
                        }`}
                      >
                        {discount.isActive
                          ? discount.isWithinActiveDateRange === undefined
                            ? "Aktif (Deaktif Tarih)"
                            : discount.isWithinActiveDateRange
                            ? "Aktif"
                            : "Aktif (Deaktif Tarih)"
                          : "Pasif"}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <button
                          type="button"
                          className="btn btn-sm btn-icon btn-outline-primary"
                          onClick={() => handleEdit(discount.id)}
                          title="Düzenle"
                          disabled={isDeleting}
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button>

                        <button
                          type="button"
                          className="btn btn-sm btn-icon btn-outline-danger"
                          onClick={() => confirmDelete(discount.id)}
                          title="Sil"
                          disabled={isDeleting}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <GeneralModal
        id="deleteDiscountModal"
        title="Kupon İndirimi Sil"
        size="sm"
        onClose={() => setDeletingId(null)}
        onApprove={handleDelete}
        approveButtonText="Evet, Sil"
        isLoading={isDeleting}
        showFooter={true}
      >
        <div className="text-center">
          <i
            className="icon-exclamation"
            style={{ fontSize: "3rem", color: "#dc3545" }}
          ></i>
          <h4 className="mt-3">Emin misiniz?</h4>
          <p className="text-muted">
            Bu kupon indirimi silmek istediğinizden emin misiniz? Bu işlem geri
            alınamaz.
          </p>
        </div>
      </GeneralModal>

      <CirclePagination
        currentPage={page + 1}
        totalCount={totalCount}
        pageSize={pageSize}
        onPageChange={setPage}
      />
    </div>
  );
};

export default CouponDiscountPage;
