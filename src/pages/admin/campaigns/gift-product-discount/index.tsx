import CirclePagination from "@/components/shared/CirclePagination";
import GeneralModal from "@/components/shared/GeneralModal";
import { DiscountType } from "@/constants/enums/DiscountType";
import { GiftProductDiscount } from "@/constants/models/Discount";
import { useDeleteDiscount } from "@/hooks/services/discounts/useDeleteDiscount";
import { useGetDiscountList } from "@/hooks/services/discounts/useGetDiscountList";
import { faEdit, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "react-hot-toast";

const FreeProductDiscountPage = () => {
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
    discountType: DiscountType.GiftProductDiscount,
  });
  const { deleteDiscount, isPending: isDeleting } = useDeleteDiscount();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleCreate = () => {
    router.push("/admin/campaigns/gift-product-discount/create");
  };

  const handleEdit = (id: string) => {
    router.push(`/admin/campaigns/gift-product-discount/edit/${id}`);
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
      console.error("Error deleting discount:", error);
    }
  };

  const confirmDelete = (id: string) => {
    setDeletingId(id);
    $("#deleteDiscountModal").modal("show");
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchName(e.target.value);
    setPage(1);
  };

  const handleStatusFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setIsActive(value === "" ? undefined : value === "true");
    setPage(1);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("tr-TR");
  };

  const freeProductDiscounts =
    (discounts as unknown as GiftProductDiscount[]) || [];

  const getProductIds = (discount: GiftProductDiscount): string[] => {
    if (!discount.productIds) return [];
    if (Array.isArray(discount.productIds)) return discount.productIds;
    if (typeof discount.productIds === "string") {
      return (discount.productIds as string)
        .split(",")
        .filter((id: string) => id.trim() !== "");
    }
    return [];
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
            Hediye Ürün İndirimleri
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
                <th>İNDİRİM ADI</th>
                <th>HEDİYE ÜRÜN SEÇİMİ</th>
                <th>BAŞLANGIÇ TARİHİ</th>
                <th>BİTİŞ TARİHİ</th>
                <th>DURUM</th>
                <th>İŞLEMLER</th>
              </tr>
            </thead>
            <tbody className="table-border-bottom-0">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="text-center">
                    Yükleniyor...
                  </td>
                </tr>
              ) : freeProductDiscounts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center">
                    Henüz hediye ürün indirimi bulunmamaktadır.
                  </td>
                </tr>
              ) : (
                freeProductDiscounts.map(
                  (discount) => (
                    console.log(discount),
                    (
                      <tr key={discount.id}>
                        <td>
                          <div className="fw-semibold">{discount.name}</div>
                          <small className="text-muted">
                            {discount.description}
                          </small>
                        </td>
                        <td>
                          <span className="badge bg-info">
                            {discount.freeProductDiscount?.minimumQuantity} Adet
                            ürün seçildi
                          </span>
                          {discount.productIds &&
                            discount.productIds.length > 0 && (
                              <div className="mt-1">
                                <small className="text-muted">
                                  {getProductIds(discount).length} ürün seçili
                                </small>
                              </div>
                            )}
                        </td>
                        <td>{formatDate(discount.startDate)}</td>
                        <td>{formatDate(discount.endDate)}</td>
                        <td>
                          <span
                            className={`badge bg-${
                              discount.isActive &&
                              discount.isWithinActiveDateRange
                                ? "success"
                                : "danger"
                            }`}
                          >
                            {discount.isActive &&
                            discount.isWithinActiveDateRange
                              ? "Aktif"
                              : "Pasif"}
                          </span>
                        </td>
                        <td>
                          <div className="d-flex gap-2">
                            <button
                              type="button"
                              className="btn btn-sm btn-primary"
                              onClick={() => handleEdit(discount.id)}
                            >
                              <FontAwesomeIcon icon={faEdit} />
                            </button>
                            <button
                              type="button"
                              className="btn btn-sm btn-danger"
                              onClick={() => confirmDelete(discount.id)}
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  )
                )
              )}
            </tbody>
          </table>
        </div>

        {totalCount > pageSize && (
          <div className="d-flex justify-content-center mt-4">
            <CirclePagination
              totalCount={totalCount}
              currentPage={page + 1}
              pageSize={pageSize}
              onPageChange={(newPage) => setPage(newPage - 1)}
            />
          </div>
        )}
      </div>

      {/* Delete Modal */}
      <div
        className="modal fade"
        id="deleteDiscountModal"
        tabIndex={-1}
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">İndirimi Sil</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              Bu indirimi silmek istediğinizden emin misiniz? Bu işlem geri
              alınamaz.
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                İptal
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Siliniyor..." : "Sil"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreeProductDiscountPage;
