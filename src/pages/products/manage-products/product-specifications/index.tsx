"use client";
import ConfirmModal from "@/components/shared/ConfirmModal";
import GeneralModal from "@/components/shared/GeneralModal";
import { Product } from "@/constants/models/Product";
import { ProductSpecification } from "@/constants/models/ProductSpecification";
import { useAddProductSpecification } from "@/hooks/services/product-specifications/useAddProductSpecification";
import { useDeleteProductSpecification } from "@/hooks/services/product-specifications/useDeleteProductSpecification";
import { useGetProductSpecifications } from "@/hooks/services/product-specifications/useGetProductSpecifications";
import { useUpdateProductSpecification } from "@/hooks/services/product-specifications/useUpdateProductSpecification";
import { useGetAllProducts } from "@/hooks/services/products/useGetAllProducts";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

function ProductSpecifications() {
  const { data: products, isLoading: productsLoading } = useGetAllProducts();
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null
  );
  const {
    productSpecifications,
    isLoading: specificationsLoading,
    refetchProductSpecifications,
  } = useGetProductSpecifications(selectedProductId);
  const [localSpecifications, setLocalSpecifications] = useState<any[] | null>(
    null
  );

  useEffect(() => {
    if (productSpecifications) {
      setLocalSpecifications(productSpecifications);
    }
  }, [productSpecifications]);

  const displaySpecifications = localSpecifications || productSpecifications;

  const { addProductSpecification, isPending: addProductSpecificationLoading } =
    useAddProductSpecification();
  const {
    updateProductSpecification,
    isPending: updateProductSpecificationLoading,
  } = useUpdateProductSpecification();
  const {
    deleteProductSpecification,
    isPending: deleteProductSpecificationLoading,
  } = useDeleteProductSpecification();

  // Add Specification Modal state
  const [newSpecName, setNewSpecName] = useState("");
  const [newSpecValue, setNewSpecValue] = useState("");

  // Edit Specification Modal state
  const [editingSpec, setEditingSpec] = useState<ProductSpecification | null>(
    null
  );
  const [editSpecName, setEditSpecName] = useState("");
  const [editSpecValue, setEditSpecValue] = useState("");

  // Delete Specification Modal state
  const [deletingSpecificationId, setDeletingSpecificationId] = useState<
    string | null
  >(null);

  const handleProductClick = (productId: string) => {
    setSelectedProductId(productId);
    setLocalSpecifications(null);
    $("#productSpecificationsModal").modal("show");
  };

  const handleAddSpecification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId || !newSpecName || !newSpecValue) return;

    try {
      await addProductSpecification(
        selectedProductId,
        newSpecName,
        newSpecValue
      );
      $("#addSpecificationModal").modal("hide");
      setNewSpecName("");
      setNewSpecValue("");
      toast.success("Özellik başarıyla eklendi");
    } catch (error) {
      console.error("Error adding specification:", error);
      toast.error("Özellik eklenirken bir hata oluştu");
    }
  };

  const handleEditClick = (spec: ProductSpecification) => {
    setEditingSpec(spec);
    setEditSpecName(spec.name);
    setEditSpecValue(spec.value);
    $("#editSpecificationModal").modal("show");
  };

  const handleEditSpecification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSpec || !editSpecName || !editSpecValue || !selectedProductId)
      return;

    try {
      await updateProductSpecification(
        editingSpec.id,
        editSpecName,
        editSpecValue,
        selectedProductId
      );
      $("#editSpecificationModal").modal("hide");
      setEditingSpec(null);
      setEditSpecName("");
      setEditSpecValue("");
      toast.success("Özellik başarıyla güncellendi");
    } catch (error) {
      console.error("Error updating specification:", error);
      toast.error("Özellik güncellenirken bir hata oluştu");
    }
  };

  const handleDeleteClick = (specId: string) => {
    setDeletingSpecificationId(specId);
    $("#deleteSpecificationModal").modal("show");
  };

  const handleDeleteSpecification = async () => {
    if (!deletingSpecificationId || !selectedProductId) return;

    try {
      // Check if this is the last specification for this product
      const isLastSpecification =
        displaySpecifications && displaySpecifications.length === 1;

      await deleteProductSpecification(
        deletingSpecificationId,
        selectedProductId
      );
      $("#deleteSpecificationModal").modal("hide");
      setDeletingSpecificationId(null);

      // If it was the last specification and the backend might return 400,
      // manually update the local state to show an empty list
      if (isLastSpecification) {
        setLocalSpecifications([]);

        // Try to refetch after a delay, but if it fails, we'll still have an empty array in the UI
        setTimeout(() => {
          refetchProductSpecifications().catch(() => {
            // If refetch fails, we already have an empty array in the UI
            console.log("Refetch failed, but UI is already updated");
          });
        }, 300);
      }

      toast.success("Özellik başarıyla silindi");
    } catch (error) {
      console.error("Error deleting specification:", error);
      toast.error("Özellik silinirken bir hata oluştu");
    }
  };

  return (
    <main className="main">
      <div
        className="page-header text-center"
        style={{
          backgroundImage: 'url("/assets/images/page-header-bg.jpg")',
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
        <div className="container">
          <h1 className="page-title">
            Ürün Özellikleri<span>Admin</span>
          </h1>
        </div>
      </div>

      <div
        className="page-content py-5"
        style={{
          background: "linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%)",
        }}
      >
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="card border-0 shadow-sm">
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="card-title mb-0 d-flex align-items-center">
                      <i
                        className="icon-list me-2"
                        style={{ color: "#2c6", fontSize: "1.5rem" }}
                      ></i>
                      Ürünler
                    </h5>
                  </div>

                  {productsLoading ? (
                    <div className="text-center py-4">
                      <div
                        className="spinner-border text-primary"
                        role="status"
                      >
                        <span className="visually-hidden">Yükleniyor...</span>
                      </div>
                    </div>
                  ) : (
                    <div className="products-list">
                      {products?.items.map((product: Product) => (
                        <div
                          key={product.id}
                          className="product-item"
                          onClick={() => handleProductClick(product.id)}
                        >
                          <div className="d-flex align-items-center">
                            <div className="product-image me-3">
                              <Image
                                src={
                                  product.baseImageUrl ||
                                  "/assets/images/no-image.jpg"
                                }
                                alt={product.title}
                                width={60}
                                height={60}
                                style={{
                                  objectFit: "contain",
                                  borderRadius: "8px",
                                  marginRight: "10px",
                                }}
                              />
                            </div>
                            <div>
                              <h6 className="mb-1">{product.title}</h6>
                            </div>
                          </div>
                          <i className="icon-arrow-right"></i>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Specifications Modal */}
      <GeneralModal
        id="productSpecificationsModal"
        title="Ürün Özellikleri"
        showFooter={false}
        size="lg"
        onClose={() => setSelectedProductId(null)}
      >
        <div className="d-flex justify-content-end mb-3">
          <button
            className="btn btn-primary btn-sm"
            onClick={() => $("#addSpecificationModal").modal("show")}
          >
            <i className="icon-plus me-1"></i>
            Yeni Özellik Ekle
          </button>
        </div>

        {specificationsLoading ? (
          <div className="text-center py-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Yükleniyor...</span>
            </div>
          </div>
        ) : (
          <div className="specifications-container">
            {displaySpecifications && displaySpecifications.length === 0 ? (
              <div className="text-center py-4 text-muted">
                <i
                  className="icon-info-circle mb-2"
                  style={{ fontSize: "2rem" }}
                ></i>
                <p>Bu ürün için henüz özellik eklenmemiş</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead>
                    <tr>
                      <th style={{ width: "45%" }}>Özellik</th>
                      <th style={{ width: "45%" }}>Değer</th>
                      <th style={{ width: "10%" }} className="text-end">
                        İşlemler
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {displaySpecifications &&
                      displaySpecifications.map(
                        (spec: ProductSpecification) => (
                          <tr key={spec.$id}>
                            <td className="spec-name">
                              <div className="fw-medium text-dark">
                                {spec.name}
                              </div>
                            </td>
                            <td className="spec-value">
                              <div className="text-secondary">{spec.value}</div>
                            </td>
                            <td className="text-end" style={{ width: "10%" }}>
                              <div className="d-flex justify-content-end gap-1">
                                <button
                                  className="btn btn-sm btn-outline-primary p-0"
                                  title="Düzenle"
                                  onClick={() => handleEditClick(spec)}
                                  style={{
                                    width: "24px",
                                    height: "24px",
                                    minWidth: "unset",
                                  }}
                                >
                                  <i
                                    className="icon-edit"
                                    style={{ fontSize: "12px" }}
                                  ></i>
                                </button>
                                <button
                                  className="btn btn-sm p-0"
                                  title="Sil"
                                  onClick={() => handleDeleteClick(spec.id)}
                                  style={{
                                    width: "24px",
                                    height: "24px",
                                    minWidth: "unset",
                                  }}
                                >
                                  <i
                                    className="bx bxs-trash"
                                    style={{ fontSize: "12px" }}
                                  ></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        )
                      )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </GeneralModal>

      {/* Add Specification Modal */}
      <GeneralModal
        id="addSpecificationModal"
        title="Yeni Özellik Ekle"
        showFooter={true}
        approveButtonText="Ekle"
        isLoading={addProductSpecificationLoading}
        formId="addSpecificationForm"
        onClose={() => {
          setNewSpecName("");
          setNewSpecValue("");
        }}
      >
        <form id="addSpecificationForm" onSubmit={handleAddSpecification}>
          <div className="mb-3">
            <label className="form-label">Özellik Adı</label>
            <input
              type="text"
              className="form-control"
              value={newSpecName}
              onChange={(e) => setNewSpecName(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Özellik Değeri</label>
            <input
              type="text"
              className="form-control"
              value={newSpecValue}
              onChange={(e) => setNewSpecValue(e.target.value)}
              required
            />
          </div>
        </form>
      </GeneralModal>

      {/* Edit Specification Modal */}
      <GeneralModal
        id="editSpecificationModal"
        title="Özellik Düzenle"
        showFooter={true}
        approveButtonText="Güncelle"
        isLoading={updateProductSpecificationLoading}
        formId="editSpecificationForm"
        onClose={() => {
          setEditingSpec(null);
          setEditSpecName("");
          setEditSpecValue("");
        }}
      >
        <form id="editSpecificationForm" onSubmit={handleEditSpecification}>
          <div className="mb-3">
            <label className="form-label">Özellik Adı</label>
            <input
              type="text"
              className="form-control"
              value={editSpecName}
              onChange={(e) => setEditSpecName(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Özellik Değeri</label>
            <input
              type="text"
              className="form-control"
              value={editSpecValue}
              onChange={(e) => setEditSpecValue(e.target.value)}
              required
            />
          </div>
        </form>
      </GeneralModal>

      {/* Delete Specification Modal */}
      <div
        className="modal fade"
        id="deleteSpecificationModal"
        tabIndex={-1}
        aria-hidden="true"
      >
        <div
          className="modal-dialog modal-sm modal-dialog-centered"
          role="document"
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Özellik Sil</h5>
              <i
                data-bs-dismiss="modal"
                aria-label="Close"
                className="icon-close"
                onClick={() => setDeletingSpecificationId(null)}
                style={{ cursor: "pointer", color: "red" }}
              ></i>
            </div>
            <div className="modal-body p-5">
              <ConfirmModal
                onConfirm={handleDeleteSpecification}
                isLoading={deleteProductSpecificationLoading}
                title="Emin misiniz?"
                message="Bu özellik silinecektir. Bu işlem geri alınamaz."
                confirmButtonText="Evet, Sil"
                cancelButtonText="İptal"
              />
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .products-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .product-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          background: #fff;
          border-radius: 8px;
          border: 1px solid #e9ecef;
          transition: all 0.2s ease;
          cursor: pointer;
        }

        .product-item:hover {
          background: #f8f9fa;
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .specifications-container {
          max-height: 60vh;
          overflow-y: auto;
          border-radius: 8px;
        }

        .table {
          margin-bottom: 0;
          border-collapse: separate;
          border-spacing: 0;
        }

        .table th {
          background: #f8f9fa;
          font-weight: 600;
          padding: 1rem;
          border-bottom: 2px solid #e9ecef;
          white-space: nowrap;
        }

        .table td {
          padding: 1rem;
          vertical-align: middle;
          border-bottom: 1px solid #e9ecef;
        }

        .table tbody tr:hover {
          background-color: #f8f9fa;
        }

        .spec-name,
        .spec-value {
          max-width: 250px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .btn-group {
          gap: 0.5rem;
        }

        .btn-group .btn {
          padding: 0.4rem 0.6rem;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .btn-group .btn i {
          font-size: 1rem;
        }

        .btn-group .btn:hover {
          transform: translateY(-1px);
        }

        @media (max-width: 768px) {
          .spec-name,
          .spec-value {
            max-width: 150px;
          }

          .table td,
          .table th {
            padding: 0.75rem;
          }

          .btn-group .btn {
            padding: 0.3rem 0.5rem;
          }
        }
      `}</style>
    </main>
  );
}

export default ProductSpecifications;
