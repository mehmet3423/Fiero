import CirclePagination from "@/components/shared/CirclePagination";
import GeneralModal from "@/components/shared/GeneralModal";
import { DiscountType } from "@/constants/enums/DiscountType";
import { useDeleteDiscount } from "@/hooks/services/discounts/useDeleteDiscount";
import { useGetDiscountList } from "@/hooks/services/discounts/useGetDiscountList";
import { faEdit, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import BackButton from "@/components/shared/BackButton";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "react-hot-toast";
const ProductDiscountPage = () => {
  const router = useRouter();
  const [page, setPage] = useState(0);
  const [pageSize] = useState(10);
  const [searchName, setSearchName] = useState("");
  const [isActive, setIsActive] = useState<boolean | undefined>(undefined);
  const result = useGetDiscountList({
    discountType: DiscountType.Product,
  });
  const { discounts, isLoading, totalCount } = useGetDiscountList({
    page,
    pageSize,
    name: searchName || undefined,
    isActive,
    discountType: DiscountType.Product,
  });
  const { deleteDiscount, isPending: isDeleting } = useDeleteDiscount();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleCreate = () => {
    router.push("/admin/campaigns/product-discount/create");
  };

  const handleEdit = (id: string) => {
    router.push(`/admin/campaigns/product-discount/edit/${id}`);
  };

  const handleDelete = async () => {
    if (!deletingId) return;

    try {
      await deleteDiscount(deletingId);
      setDeletingId(null);
      $("#deleteDiscountModal").modal("hide");
      toast.success("İndirim başarıyla silindi");
    } catch (error) {
      toast.error("İndirim silinirken bir hata oluştu");
    }
  };
  const confirmDelete = (id: string) => {
    setDeletingId(id);
    $("#deleteDiscountModal").modal("show");
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

  return (
    <div>
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
            Ürün İndirimleri
          </h4>
        </div>
      </div>
      <div className="d-flex justify-content-between mb-4">
        <BackButton href="/admin/campaigns" />
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
                <th>İndirim Adı</th>
                <th>İndirim Değeri</th>
                <th>Açıklama</th>
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
              ) : discounts?.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center">
                    Henüz indirim bulunmuyor
                  </td>
                </tr>
              ) : (
                discounts?.map((discount) => (
                  <tr key={discount.id}>
                    <td>
                      <strong>{discount.name}</strong>
                    </td>
                    <td>
                      {discount.discountValueType === 0
                        ? discount.discountValue
                        : discount.discountValueType === 1
                        ? `%${discount.discountValue}`
                        : `${discount.discountValue} ₺`}
                    </td>
                    <td>{discount.description}</td>
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
        title="Alt Kategori İndirimi Sil"
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
            Bu indirimi silmek istediğinizden emin misiniz? Bu işlem geri
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

export default ProductDiscountPage;
