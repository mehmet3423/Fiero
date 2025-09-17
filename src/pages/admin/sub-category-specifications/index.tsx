"use client";
import GeneralModal from "@/components/shared/GeneralModal";
import { Category } from "@/constants/models/Category";
import { SpecificationOption } from "@/constants/models/SubCategorySpecification";
import { useCategories } from "@/hooks/services/categories/useCategories";
import { useAddSubCategorySpecification } from "@/hooks/services/sub-category-specifications/useAddSubCategorySpecification";
import { useDeleteSubCategorySpecification } from "@/hooks/services/sub-category-specifications/useDeleteSubCategorySpecification";
import { useSubCategorySpecifications } from "@/hooks/services/sub-category-specifications/useSubCategorySpecifications";
import { useUpdateSubCategorySpecification } from "@/hooks/services/sub-category-specifications/useUpdateSubCategorySpecification";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

// Benzersiz ID oluşturmak için yardımcı fonksiyon
const generateUniqueId = () => {
  return `id-${Math.random()
    .toString(36)
    .substring(2, 15)}-${Date.now().toString(36)}`;
};

function SubCategorySpecifications() {
  const { categories, isLoading: categoriesLoading } = useCategories();
  const [selectedMainCategory, setSelectedMainCategory] =
    useState<Category | null>(null);
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<
    string | null
  >(null);
  const {
    subCategorySpecifications,
    isLoading: subCategorySpecificationsLoading,
    refetchSubCategorySpecifications,
  } = useSubCategorySpecifications(selectedSubCategoryId);

  // Yerel özellikleri tutmak için state ekle
  const [localSpecifications, setLocalSpecifications] = useState<any[] | null>(
    null
  );

  // subCategorySpecifications değiştiğinde localSpecifications'ı güncelle
  useEffect(() => {
    if (subCategorySpecifications) {
      setLocalSpecifications(subCategorySpecifications);
    }
  }, [subCategorySpecifications]);

  // Görüntülenecek özellikleri belirle
  const displaySpecifications =
    localSpecifications || subCategorySpecifications;

  const { addSubCategorySpecification, isPending: isAddingSpecification } =
    useAddSubCategorySpecification();
  const { updateSubCategorySpecification, isPending: isUpdatingSpecification } =
    useUpdateSubCategorySpecification();
  const { deleteSubCategorySpecification, isPending: isDeletingSpecification } =
    useDeleteSubCategorySpecification();

  const [deletingSpecificationId, setDeletingSpecificationId] = useState<
    string | null
  >(null);

  // Modal state
  const [newSpecName, setNewSpecName] = useState("");
  const [newSpecOptions, setNewSpecOptions] = useState<string[]>([""]);

  // Edit Modal state
  const [editingSpec, setEditingSpec] = useState<any>(null);
  const [editSpecName, setEditSpecName] = useState("");
  const [editSpecOptions, setEditSpecOptions] = useState<string[]>([""]);

  useEffect(() => {
    if (selectedMainCategory && categories?.items) {
      const updatedCategory = categories.items.find(
        (c) => c.id === selectedMainCategory.id
      );
      setSelectedMainCategory(updatedCategory || null);
    }
  }, [categories]);

  const handleSubCategorySelect = (subCategoryId: string) => {
    setSelectedSubCategoryId(subCategoryId);
    setLocalSpecifications(null); // Alt kategori değiştiğinde yerel özellikleri sıfırla
  };

  const handleAddOption = () => {
    setNewSpecOptions([...newSpecOptions, ""]);
  };

  const handleOptionChange = (index: number, value: string) => {
    const updatedOptions = [...newSpecOptions];
    updatedOptions[index] = value;
    setNewSpecOptions(updatedOptions);
  };

  const handleRemoveOption = (index: number) => {
    const updatedOptions = newSpecOptions.filter((_, i) => i !== index);
    setNewSpecOptions(updatedOptions);
  };

  const handleAddSpecification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubCategoryId || !newSpecName || newSpecOptions.length === 0)
      return;

    try {
      await addSubCategorySpecification(
        selectedSubCategoryId,
        newSpecName,
        newSpecOptions.filter((opt) => opt.trim() !== "")
      );
      $("#addSpecificationModal").modal("hide");
      setNewSpecName("");
      setNewSpecOptions([""]);
      toast.success("Özellik başarıyla eklendi");
    } catch (error) {
      toast.error("Farklı isimde bir özellik eklemeyi deneyin");
    }
  };

  const handleEditClick = (spec: any) => {
    setEditingSpec(spec);
    setEditSpecName(spec.name);
    setEditSpecOptions(spec.specificationOptions.map((opt: any) => opt.value));
    $("#editSpecificationModal").modal("show");
  };

  const handleEditOption = () => {
    setEditSpecOptions([...editSpecOptions, ""]);
  };

  const handleEditOptionChange = (index: number, value: string) => {
    const updatedOptions = [...editSpecOptions];
    updatedOptions[index] = value;
    setEditSpecOptions(updatedOptions);
  };

  const handleEditRemoveOption = (index: number) => {
    const updatedOptions = editSpecOptions.filter((_, i) => i !== index);
    setEditSpecOptions(updatedOptions);
  };

  const handleEditSpecification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !editingSpec ||
      !editSpecName ||
      editSpecOptions.length === 0 ||
      !selectedSubCategoryId
    )
      return;

    try {
      // Mevcut seçenekleri ve yeni seçenekleri ayır
      const existingOptions = editingSpec.specificationOptions.map(
        (opt: any) => ({
          id: opt.id,
          value: opt.value,
        })
      );

      // Düzenlenen seçenekleri güncelle
      const updatedOptions = editSpecOptions
        .map((opt, index) => {
          if (index < existingOptions.length) {
            // Mevcut seçenekleri güncelle
            return {
              $id: existingOptions[index].$id || "",
              id: existingOptions[index].id,
              value: opt,
              subCategorySpecificationId: editingSpec.id,
            };
          }
          return null;
        })
        .filter(Boolean) as SpecificationOption[];

      // Yeni eklenen seçenekleri ayır
      const newOptions = editSpecOptions.slice(existingOptions.length);

      await updateSubCategorySpecification(
        editingSpec.id,
        {
          $id: editingSpec.$id,
          id: editingSpec.id,
          name: editSpecName,
          specificationOptions: updatedOptions,
          newOptions: newOptions,
          subCategoryId: editingSpec.subCategoryId,
        },
        selectedSubCategoryId
      );

      $("#editSpecificationModal").modal("hide");
      setEditingSpec(null);
      setEditSpecName("");
      setEditSpecOptions([""]);
      toast.success("Özellik başarıyla güncellendi");
    } catch (error) {
      toast.error("Özellik güncellenirken bir hata oluştu");
    }
  };

  const handleDeleteSpecification = async () => {
    if (!selectedSubCategoryId) return;
    if (!deletingSpecificationId) return;

    try {
      // Son özellik mi kontrol et
      const isLastSpecification =
        displaySpecifications && displaySpecifications.length === 1;

      await deleteSubCategorySpecification(
        deletingSpecificationId,
        selectedSubCategoryId
      );

      // Eğer son özellik silindiyse, yerel özellikleri boş dizi olarak ayarla
      if (isLastSpecification) {
        setLocalSpecifications([]);

        // Gecikme ile refetch dene, hata olursa yerel state zaten boş dizi olarak ayarlandı
        setTimeout(() => {
          refetchSubCategorySpecifications().catch(() => {
          });
        }, 300);
      }

      setDeletingSpecificationId(null);
      $("#deleteSpecificationModal").modal("hide");
      toast.success("Özellik başarıyla silindi");
    } catch (error) {
      toast.error("Özellik silinirken bir hata oluştu");
      setDeletingSpecificationId(null);
      $("#deleteSpecificationModal").modal("hide");
    }
  };

  return (
    <main className="main">
      <div className="page-content py-5">
        <div className="">
          <div className="row ">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h6
                className="mb-0"
                style={{
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                  marginLeft: "10px",
                }}
              >
                Alt Kategori Özellikleri
              </h6>
            </div>
            <div className="col-lg-12">
              <div className="card border-0 shadow-sm">
                <div className="card-body p-4">
                  <div className="mb-4">
                    <select
                      className="form-select mb-3"
                      value={selectedMainCategory?.id || ""}
                      onChange={(e) => {
                        const category = categories?.items.find(
                          (c) => c.id === e.target.value
                        );
                        setSelectedMainCategory(category || null);
                        setSelectedSubCategoryId(null);
                      }}
                    >
                      <option value="">Ana Kategori Seçin</option>
                      {categories?.items?.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {selectedMainCategory && (
                    <div className="subcategory-list mb-4">
                      {selectedMainCategory.subCategories.map((subCategory) => (
                        <div
                          key={subCategory.id}
                          className={`category-item ${
                            selectedSubCategoryId === subCategory.id
                              ? "active"
                              : ""
                          }`}
                          onClick={() =>
                            handleSubCategorySelect(subCategory.id)
                          }
                          style={{ cursor: "pointer" }}
                        >
                          <span className="category-name">
                            {subCategory.name}
                          </span>
                          <i className="icon-arrow-right"></i>
                        </div>
                      ))}
                    </div>
                  )}

                  {selectedSubCategoryId &&
                    !subCategorySpecificationsLoading && (
                      <div className="specifications-list">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <h6 className="mb-0">Özellikler</h6>
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() =>
                              $("#addSpecificationModal").modal("show")
                            }
                          >
                            <i className="icon-plus"></i> Yeni Özellik Ekle
                          </button>
                        </div>
                        {displaySpecifications?.map(
                          (spec: {
                            id: string;
                            name: string;
                            specificationOptions: SpecificationOption[];
                          }) => (
                            <div
                              key={spec.id}
                              className="specification-item card mb-3 shadow-sm"
                            >
                              <div className="card-body p-3">
                                <div className="d-flex justify-content-between align-items-center">
                                  <h6 className="mb-2 fw-bold text-primary">
                                    {spec.name}
                                  </h6>
                                  <div className="specification-actions">
                                    <button
                                      className="btn btn-sm btn-outline-primary me-2"
                                      onClick={() => handleEditClick(spec)}
                                      title="Düzenle"
                                    >
                                      <i className="bx bxs-edit"></i> Düzenle
                                    </button>
                                    <button
                                      className="btn btn-sm btn-outline-danger"
                                      onClick={() => {
                                        setDeletingSpecificationId(spec.id);
                                        $("#deleteSpecificationModal").modal(
                                          "show"
                                        );
                                      }}
                                      title="Sil"
                                    >
                                      <i className="bx bxs-trash"></i> Sil
                                    </button>
                                  </div>
                                </div>
                                <div className="options-list mt-2">
                                  {spec.specificationOptions.length > 0 ? (
                                    <div className="d-flex flex-wrap gap-2">
                                      {spec.specificationOptions.map(
                                        (option: any, index: number) => (
                                          <span
                                            key={index}
                                            className="option-badge badge bg-light text-dark border"
                                          >
                                            {option.value}
                                          </span>
                                        )
                                      )}
                                    </div>
                                  ) : (
                                    <p className="text-muted small mb-0">
                                      Henüz seçenek eklenmemiş
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          )
                        )}
                        {displaySpecifications?.length === 0 && (
                          <div className="text-center py-4 text-muted">
                            <i
                              className="icon-info-circle mb-2"
                              style={{ fontSize: "2rem" }}
                            ></i>
                            <p>Bu alt kategori için henüz özellik eklenmemiş</p>
                          </div>
                        )}
                      </div>
                    )}

                  {!selectedMainCategory && (
                    <div className="text-center py-5 text-muted">
                      <i
                        className="bx bx-info-circle mb-3"
                        style={{ fontSize: "2.5rem" }}
                      ></i>
                      <p>Özellikleri görmek için önce bir ana kategori seçin</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Specification Modal */}
      <GeneralModal
        id="addSpecificationModal"
        title="Yeni Özellik Ekle"
        showFooter={true}
        approveButtonText="Ekle"
        isLoading={isAddingSpecification}
        formId="addSpecificationForm"
        onClose={() => {
          setNewSpecName("");
          setNewSpecOptions([""]);
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
            <label className="form-label d-flex justify-content-between align-items-center">
              <span>Seçenekler</span>
              <button
                type="button"
                className="btn btn-sm btn-outline-primary"
                onClick={handleAddOption}
              >
                <i className="bx bx-plus"></i> Yeni Seçenek
              </button>
            </label>
            {newSpecOptions.map((option, index) => (
              <div key={index} className="input-group mb-2">
                <input
                  type="text"
                  className="form-control"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  placeholder={`Seçenek ${index + 1}`}
                  required
                />
                {newSpecOptions.length > 1 && (
                  <button
                    type="button"
                    className="btn btn-outline-danger"
                    onClick={() => handleRemoveOption(index)}
                  >
                    <i className="bx bxs-trash"></i>
                  </button>
                )}
              </div>
            ))}
          </div>
        </form>
      </GeneralModal>

      {/* Edit Specification Modal */}
      <GeneralModal
        id="editSpecificationModal"
        title="Özellik Düzenle"
        showFooter={true}
        approveButtonText="Güncelle"
        isLoading={isUpdatingSpecification}
        formId="editSpecificationForm"
        onClose={() => {
          setEditingSpec(null);
          setEditSpecName("");
          setEditSpecOptions([""]);
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
            <label className="form-label d-flex justify-content-between align-items-center">
              <span>Seçenekler</span>
              <button
                type="button"
                className="btn btn-sm btn-outline-primary"
                onClick={handleEditOption}
              >
                <i className="icon-plus"></i> Yeni Seçenek
              </button>
            </label>
            {editSpecOptions.map((option, index) => (
              <div key={index} className="input-group mb-2">
                <input
                  type="text"
                  className="form-control"
                  value={option}
                  onChange={(e) =>
                    handleEditOptionChange(index, e.target.value)
                  }
                  placeholder={`Seçenek ${index + 1}`}
                  required
                />
                {editSpecOptions.length > 1 && (
                  <button
                    type="button"
                    className="btn btn-outline-danger"
                    onClick={() => handleEditRemoveOption(index)}
                  >
                    <i className="bx bxs-trash" style={{ fontSize: 20 }}></i>
                  </button>
                )}
              </div>
            ))}
          </div>
        </form>
      </GeneralModal>

      <GeneralModal
        id="deleteSpecificationModal"
        title="Özellik Sil"
        size="sm"
        onClose={() => setDeletingSpecificationId(null)}
        onApprove={handleDeleteSpecification}
        approveButtonText="Evet, Sil"
        isLoading={isDeletingSpecification}
        showFooter={true}
      >
        <div className="text-center">
          <i
            className="icon-exclamation"
            style={{ fontSize: "3rem", color: "#dc3545" }}
          ></i>
          <h4 className="mt-3">Emin misiniz?</h4>
          <p className="text-muted">
            Bu özellik silinecektir. Bu işlem geri alınamaz.
          </p>
        </div>
      </GeneralModal>

      <style jsx>{`
        .container {
          padding-left: 0.5rem;
          padding-right: 0.5rem;
        }

        .page-content {
          padding: 0.5rem 0;
        }

        .card {
          border: 1px solid #e0e0e0;
          border-radius: 0.5rem;
        }

        .card-header {
          padding: 0.75rem;
          background-color: #fafafa;
          border-bottom: 1px solid #e0e0e0;
        }

        .card-body {
          padding: 0.75rem;
        }

        .card-title {
          font-size: 0.875rem;
          font-weight: 500;
        }

        .form-select {
          font-size: 0.813rem;
          padding: 0.375rem 0.5rem;
          border: 1px solid #d0d0d0;
          border-radius: 3px;
        }

        .form-select:focus {
          border-color: #a0a0a0;
          box-shadow: none;
        }

        .category-item {
          padding: 0.5rem 0.75rem;
          background: #fff;
          border: 1px solid #e0e0e0;
          border-radius: 3px;
          margin-bottom: 0.25rem;
          font-size: 0.813rem;
        }

        .category-item.active {
          background: #fafafa;
          border-color: #d0d0d0;
        }

        .category-item:hover {
          background: #f5f5f5;
          transform: none;
          box-shadow: none;
        }

        .specification-item {
          padding: 0.5rem 0.75rem;
          border: 1px solid #e0e0e0;
          border-radius: 3px;
          margin-bottom: 0.25rem;
          font-size: 0.813rem;
        }

        .option-badge {
          background: #f5f5f5;
          padding: 0.25rem 0.5rem;
          border-radius: 3px;
          font-size: 0.75rem;
          color: #444;
          border: 1px solid #e0e0e0;
        }

        .btn {
          font-size: 0.75rem;
          padding: 0.25rem 0.5rem;
        }

        .btn-link {
          border: 1px solid #e0e0e0;
          padding: 0.25rem 0.5rem;
          margin-left: 0.25rem;
        }

        .btn-link:hover {
          background-color: #f5f5f5;
        }

        .text-muted {
          font-size: 0.75rem;
        }

        @media (max-width: 768px) {
          .container {
            padding-left: 0.25rem;
            padding-right: 0.25rem;
          }

          .row {
            margin-left: -0.25rem;
            margin-right: -0.25rem;
          }

          .col-lg-12 {
            padding-left: 0.25rem;
            padding-right: 0.25rem;
          }
        }
      `}</style>
    </main>
  );
}

export default SubCategorySpecifications;
