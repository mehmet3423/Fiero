"use client";
import GeneralModal from "@/components/shared/GeneralModal";
import { Category } from "@/constants/models/Category";
import { useCategories } from "@/hooks/services/categories/useCategories";
import { useCreateMainCategory } from "@/hooks/services/categories/useCreateMainCategory";
import { useCreateSubCategory } from "@/hooks/services/categories/useCreateSubCategory";
import { useDeleteMainCategory } from "@/hooks/services/categories/useDeleteMainCategory";
import { useDeleteSubCategory } from "@/hooks/services/categories/useDeleteSubCategory";
import { useUpdateMainCategory } from "@/hooks/services/categories/useUpdateMainCategory";
import { useUpdateSubCategory } from "@/hooks/services/categories/useUpdateSubCategory";
import { useEffect, useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faFolder } from "@fortawesome/free-solid-svg-icons";

function CategoryManagementPage() {
  const { categories, isLoading: categoriesLoading } = useCategories();
  console.log(categories);
  const { createMainCategory, isPending: isCreatingMain } =
    useCreateMainCategory();
  const { createSubCategory, isPending: isCreatingSub } =
    useCreateSubCategory();
  const { updateMainCategory, isPending: isUpdatingMain } =
    useUpdateMainCategory();
  const { updateSubCategory, isPending: isUpdatingSub } =
    useUpdateSubCategory();
  const { deleteMainCategory, isPending: isDeletingMain } =
    useDeleteMainCategory();
  const { deleteSubCategory, isPending: isDeletingSub } =
    useDeleteSubCategory();
  const [mainCategories, setMainCategories] = useState<Category[]>([]);

  const [newMainCategoryName, setNewMainCategoryName] = useState("");
  const [newSubCategoryName, setNewSubCategoryName] = useState("");
  const [mainCategoryError, setMainCategoryError] = useState<string | null>(
    null
  );
  const [subCategoryError, setSubCategoryError] = useState<string | null>(null);
  const [selectedMainCategory, setSelectedMainCategory] =
    useState<Category | null>(null);
  const [editingMainCategory, setEditingMainCategory] =
    useState<Category | null>(null);
  const [editingSubCategory, setEditingSubCategory] = useState<{
    id: string;
    name: string;
    mainCategoryId: string;
    displayIndex: number;
  } | null>(null);
  const [deletingMainCategory, setDeletingMainCategory] = useState<
    string | null
  >(null);
  const [deletingSubCategory, setDeletingSubCategory] = useState<string | null>(
    null
  );
  useEffect(() => {
    if (categories?.items) {
      setMainCategories([...categories.items]);
    }
  }, [categories]);

  useEffect(() => {
    if (selectedMainCategory && categories?.items) {
      const updatedCategory = categories.items.find(
        (c) => c.id === selectedMainCategory.id
      );
      setSelectedMainCategory(updatedCategory || null);
    }
  }, [categories]);

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;
    if (
      source.index === destination.index &&
      source.droppableId === destination.droppableId
    )
      return;

    // Ana kategoriler
    if (source.droppableId === "mainCategories") {
      const reordered = Array.from(mainCategories);
      const [moved] = reordered.splice(source.index, 1);
      reordered.splice(destination.index, 0, moved);

      const updated = reordered.map((cat, index) => ({ ...cat, index }));
      setMainCategories(updated);

      updated.forEach((cat) => {
        updateMainCategory(cat.id, cat.name, cat.index);
      });
    }
    if (source.droppableId === "subCategories" && selectedMainCategory) {
      const reordered = [...selectedMainCategory.subCategories];
      const [moved] = reordered.splice(source.index, 1);
      reordered.splice(destination.index, 0, moved);

      const updated = reordered.map((sub, index) => ({ ...sub, index }));
      setSelectedMainCategory({
        ...selectedMainCategory,
        subCategories: updated,
      });

      updated.forEach((sub) => {
        updateSubCategory(sub.id, sub.name, sub.index);
      });
    }
  };

  // Ana kategori adı değiştiğinde kontrol et
  const checkMainCategoryName = (name: string) => {
    if (
      categories?.items.some(
        (cat) => cat.name.toLowerCase() === name.toLowerCase()
      )
    ) {
      setMainCategoryError("Bu isimde bir ana kategori zaten mevcut");
    } else {
      setMainCategoryError(null);
    }
  };

  // Alt kategori adı değiştiğinde kontrol et
  const checkSubCategoryName = (name: string) => {
    if (
      selectedMainCategory?.subCategories.some(
        (cat) => cat.name.toLowerCase() === name.toLowerCase()
      )
    ) {
      setSubCategoryError("Bu isimde bir alt kategori zaten mevcut");
    } else {
      setSubCategoryError(null);
    }
  };

  // Ana kategori input değişikliği
  const handleMainCategoryNameChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const name = e.target.value;
    setNewMainCategoryName(name);
    if (name.trim()) {
      checkMainCategoryName(name);
    } else {
      setMainCategoryError(null);
    }
  };

  // Alt kategori input değişikliği
  const handleSubCategoryNameChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const name = e.target.value;
    setNewSubCategoryName(name);
    if (name.trim()) {
      checkSubCategoryName(name);
    } else {
      setSubCategoryError(null);
    }
  };

  const handleCreateMainCategory = async () => {
    if (!newMainCategoryName.trim() || mainCategoryError) return;
    const index = mainCategories.length;
    await createMainCategory(newMainCategoryName, index);
    setNewMainCategoryName("");
    setMainCategoryError(null);
    $("#newMainCategoryModal").modal("hide");
  };

  const handleCreateSubCategory = async () => {
    if (!newSubCategoryName.trim() || !selectedMainCategory || subCategoryError)
      return;
    const index = selectedMainCategory.subCategories.length;
    await createSubCategory(newSubCategoryName, selectedMainCategory.id);
    setNewSubCategoryName("");
    setSubCategoryError(null);
    $("#newSubCategoryModal").modal("hide");

    const updatedCategory = categories?.items.find(
      (c) => c.id === selectedMainCategory.id
    );
    setSelectedMainCategory(updatedCategory || null);
  };

  const handleUpdateMainCategory = async () => {
    if (!editingMainCategory) return;
    await updateMainCategory(
      editingMainCategory.id,
      editingMainCategory.name,
      editingMainCategory.displayIndex
    );
    setEditingMainCategory(null);
    $("#editMainCategoryModal").modal("hide");
  };

  const handleUpdateSubCategory = async () => {
    if (!editingSubCategory) return;
    await updateSubCategory(
      editingSubCategory.id,
      editingSubCategory.name,
      editingSubCategory.displayIndex
    );
    setEditingSubCategory(null);
    $("#editSubCategoryModal").modal("hide");

    const updatedCategory = categories?.items.find(
      (c) => c.id === selectedMainCategory?.id
    );
    setSelectedMainCategory(updatedCategory || null);
  };

  const handleDeleteMainCategory = async () => {
    if (!deletingMainCategory) return;
    await deleteMainCategory(deletingMainCategory);
    setDeletingMainCategory(null);
    $("#deleteMainCategoryModal").modal("hide");
  };

  const handleDeleteSubCategory = async () => {
    if (!deletingSubCategory) return;
    await deleteSubCategory(deletingSubCategory);
    setDeletingSubCategory(null);
    $("#deleteSubCategoryModal").modal("hide");

    const updatedCategory = categories?.items.find(
      (c) => c.id === selectedMainCategory?.id
    );
    setSelectedMainCategory(updatedCategory || null);
  };

  if (categoriesLoading) {
    return (
      <div className="card" >
        <h5
          className="card-header"
          style={{ fontSize: "1.2rem", fontWeight: "bold", padding: "20px" }}
        >
          Kategoriler
        </h5>
        <div className="d-flex justify-content-center align-items-center p-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Yükleniyor...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content ">
      <div className="row g-3">
        {/* Ana Kategoriler */}
        <div className="col-lg-6">
          <div
            className="card-header bg-transparent border-0 d-flex justify-content-between align-items-center"
            style={{ padding: "20px" }}
          >
            <h6
              className="mb-0"
              style={{ fontSize: "1.2rem", fontWeight: "bold" }}
            >
              Kategoriler
            </h6>
          </div>
          <div className="card">
            <div
              className="card-header bg-transparent border-0 d-flex justify-content-between align-items-center"
              style={{ padding: "20px" }}
            >
              <button
                className="btn btn-sm btn-primary"
                onClick={() => $("#newMainCategoryModal").modal("show")}
              >
                <i className="bx bx-plus me-1"></i>
                Yeni Ekle
              </button>
              <span className="text-muted" style={{ fontSize: "0.813rem" }}>
                Bir kategori seçiniz.
              </span>
            </div>
            <div className="card-body p-0" style={{
              height: 'auto',
              minHeight: '200px',
              maxHeight: '444px'
            }}>
              {categories?.items?.length === 0 ? (
                <div className="text-center p-4">
                  <i className="bx bx-category fs-1 text-muted mb-3"></i>
                  <p className="text-muted">Henüz kategori bulunmuyor</p>
                </div>
              ) : (
                <DragDropContext onDragEnd={onDragEnd}>
                  <Droppable droppableId="mainCategories">
                    {(provided) => (
                      <div
                        className="table-responsive"
                        style={{
                          maxHeight: '444px',
                          overflowY: 'auto',
                          overflowX: 'hidden'
                        }}
                      >
                        <table className="table table-bordered" style={{ marginBottom: '0' }}>
                          <tbody
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                          >
                            {mainCategories
                              .sort((a, b) => a.displayIndex - b.displayIndex)
                              .map((category, index) => (
                                <Draggable
                                  key={category.id}
                                  draggableId={category.id}
                                  index={index}
                                >
                                  {(provided, snapshot) => (
                                    <tr
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      onClick={() =>
                                        setSelectedMainCategory(category)
                                      }
                                      style={{
                                        cursor: "pointer",
                                        backgroundColor:
                                          selectedMainCategory?.id ===
                                            category.id
                                            ? "#f5f7fb"
                                            : "transparent",
                                        transform: snapshot.isDragging
                                          ? "rotate(5deg)"
                                          : "none",
                                        boxShadow: snapshot.isDragging
                                          ? "0 8px 16px rgba(0,0,0,0.15)"
                                          : "none",
                                        zIndex: snapshot.isDragging ? 1000 : 1,
                                        ...provided.draggableProps.style,
                                      }}
                                    >
                                      <td style={{ fontSize: "0.813rem", width: "70%" }}>
                                        <div
                                          style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "0.5rem",
                                          }}
                                        >
                                          <FontAwesomeIcon
                                            icon={faBars}
                                            style={{
                                              paddingRight: "1rem",
                                              paddingLeft: "0.5rem",
                                              color: snapshot.isDragging ? "#007bff" : "#6c757d"
                                            }}
                                          />
                                          <span>{category.name}</span>
                                        </div>
                                      </td>

                                      <td className="text-end" style={{ width: "30%" }}>
                                        <button
                                          className="btn btn-link btn-sm text-muted"
                                          style={{ fontSize: "0.75rem" }}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setEditingMainCategory(category);
                                            $("#editMainCategoryModal").modal("show");
                                          }}
                                        >
                                          <i className="bx bx-edit-alt me-1"></i>
                                          Düzenle
                                        </button>
                                        <button
                                          className="btn btn-link btn-sm text-danger"
                                          style={{ fontSize: "0.75rem" }}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setDeletingMainCategory(category.id);
                                            $("#deleteMainCategoryModal").modal("show");
                                          }}
                                        >
                                          <i className="bx bx-trash me-1"></i>
                                          Sil
                                        </button>
                                      </td>
                                    </tr>
                                  )}
                                </Draggable>
                              ))}
                            {provided.placeholder}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card" style={{ marginTop: "70px", marginLeft: "auto" }}>
            <div
              className="card-header bg-transparent border-0 d-flex justify-content-between align-items-center"
              style={{ padding: "20px" }}
            >
              <h6
                className="mb-0"
                style={{ fontSize: "1.2rem", fontWeight: "bold" }}
              >
                {selectedMainCategory
                  ? `${selectedMainCategory.name} - Alt Kategoriler`
                  : "Alt Kategoriler"}
              </h6>
              {selectedMainCategory && (
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => $("#newSubCategoryModal").modal("show")}
                >
                  <i className="bx bx-plus me-1"></i>
                  Alt Kategori Ekle
                </button>
              )}
            </div>
            <div className="card-body p-0" style={{
              height: 'auto',
              minHeight: '200px',
              maxHeight: '444px'
            }}>
              {selectedMainCategory ? (
                <DragDropContext onDragEnd={onDragEnd}>
                  <Droppable droppableId="subCategories">
                    {(provided) => (
                      <div
                        className="table-responsive"
                        style={{
                          maxHeight: '444px',
                          overflowY: 'auto',
                          overflowX: 'hidden'
                        }}
                      >
                        <table className="table table-bordered" style={{ marginBottom: '0' }}>
                          <tbody
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                          >
                            {selectedMainCategory?.subCategories
                              .sort((a, b) => a.displayIndex - b.displayIndex)
                              .map((subCategory, index) => (
                                <Draggable
                                  key={subCategory.id}
                                  draggableId={subCategory.id}
                                  index={index}
                                >
                                  {(provided, snapshot) => (
                                    <tr
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      style={{
                                        cursor: "grab",
                                        transform: snapshot.isDragging
                                          ? "rotate(5deg)"
                                          : "none",
                                        boxShadow: snapshot.isDragging
                                          ? "0 8px 16px rgba(0,0,0,0.15)"
                                          : "none",
                                        zIndex: snapshot.isDragging ? 1000 : 1,
                                        ...provided.draggableProps.style,
                                      }}
                                    >
                                      <td style={{ fontSize: "0.813rem", width: "70%" }}>
                                        <div
                                          style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "0.5rem",
                                          }}
                                        >
                                          <FontAwesomeIcon
                                            icon={faBars}
                                            style={{
                                              paddingRight: "1rem",
                                              paddingLeft: "0.5rem",
                                              color: snapshot.isDragging ? "#007bff" : "#6c757d"
                                            }}
                                          />
                                          <span>{subCategory.name}</span>
                                        </div>
                                      </td>
                                      <td className="text-end" style={{ width: "30%" }}>
                                        <button
                                          className="btn btn-link btn-sm text-muted"
                                          style={{ fontSize: "0.75rem" }}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setEditingSubCategory({
                                              id: subCategory.id,
                                              name: subCategory.name,
                                              mainCategoryId: selectedMainCategory.id,
                                              displayIndex: subCategory.displayIndex,
                                            });
                                            $("#editSubCategoryModal").modal("show");
                                          }}
                                        >
                                          <i className="bx bx-edit-alt me-1"></i>
                                          Düzenle
                                        </button>

                                        <button
                                          className="btn btn-link btn-sm text-danger"
                                          style={{ fontSize: "0.75rem" }}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setDeletingSubCategory(subCategory.id);
                                            $("#deleteSubCategoryModal").modal("show");
                                          }}
                                        >
                                          <i className="bx bx-trash me-1"></i>
                                          Sil
                                        </button>
                                      </td>
                                    </tr>
                                  )}
                                </Draggable>
                              ))}
                            {provided.placeholder}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              ) : (
                <div className="text-center p-4 text-muted">
                  <i className="bx bx-list fs-1 mb-3"></i>
                  <p style={{ fontSize: "0.813rem" }}>
                    Lütfen sol taraftan bir ana kategori seçin
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modallar */}
      <GeneralModal
        id="newMainCategoryModal"
        title="Yeni Ana Kategori"
        onClose={() => {
          setNewMainCategoryName("");
          setMainCategoryError(null);
        }}
        onApprove={handleCreateMainCategory}
        approveButtonText="Ekle"
        showFooter
        isLoading={isCreatingMain}
      >
        <div>
          <label htmlFor="defaultFormControlInput" className="form-label">
            Kategori Adı
          </label>
          <input
            type="text"
            className={`form-control ${mainCategoryError ? "is-invalid" : ""}`}
            id="defaultFormControlInput"
            placeholder="Kategori Adı"
            aria-describedby="defaultFormControlHelp"
            value={newMainCategoryName}
            onChange={handleMainCategoryNameChange}
            required
          />
          {mainCategoryError && (
            <div className="invalid-feedback">{mainCategoryError}</div>
          )}
        </div>
      </GeneralModal>

      {/* Edit Ana Kategori Modal */}
      <GeneralModal
        id="editMainCategoryModal"
        title="Ana Kategori Düzenle"
        onClose={() => setEditingMainCategory(null)}
        onApprove={handleUpdateMainCategory}
        approveButtonText="Güncelle"
        isLoading={isUpdatingMain}
        showFooter
      >
        <div>
          <label htmlFor="editMainCategoryInput" className="form-label">
            Kategori Adı
          </label>
          <input
            type="text"
            className="form-control"
            id="editMainCategoryInput"
            placeholder="Kategori Adı"
            aria-describedby="editMainCategoryHelp"
            value={editingMainCategory?.name || ""}
            onChange={(e) =>
              setEditingMainCategory((prev) =>
                prev ? { ...prev, name: e.target.value } : null
              )
            }
            required
          />
        </div>
      </GeneralModal>

      {/* Yeni Alt Kategori Modal */}
      <GeneralModal
        id="newSubCategoryModal"
        title="Yeni Alt Kategori"
        onClose={() => {
          setNewSubCategoryName("");
          setSubCategoryError(null);
        }}
        onApprove={handleCreateSubCategory}
        approveButtonText="Ekle"
        isLoading={isCreatingSub}
        showFooter
      >
        <div>
          <label htmlFor="newSubCategoryInput" className="form-label">
            Alt Kategori Adı
          </label>
          <input
            type="text"
            className={`form-control ${subCategoryError ? "is-invalid" : ""}`}
            id="newSubCategoryInput"
            placeholder="Alt Kategori Adı"
            aria-describedby="newSubCategoryHelp"
            value={newSubCategoryName}
            onChange={handleSubCategoryNameChange}
            required
          />
          {subCategoryError && (
            <div className="invalid-feedback">{subCategoryError}</div>
          )}
        </div>
      </GeneralModal>

      {/* Edit Alt Kategori Modal */}
      <GeneralModal
        id="editSubCategoryModal"
        title="Alt Kategori Düzenle"
        onClose={() => setEditingSubCategory(null)}
        onApprove={handleUpdateSubCategory}
        approveButtonText="Güncelle"
        isLoading={isUpdatingSub}
        showFooter
      >
        <div>
          <label htmlFor="editSubCategoryInput" className="form-label">
            Alt Kategori Adı
          </label>
          <input
            type="text"
            className="form-control"
            id="editSubCategoryInput"
            placeholder="Alt Kategori Adı"
            aria-describedby="editSubCategoryHelp"
            value={editingSubCategory?.name || ""}
            onChange={(e) =>
              setEditingSubCategory((prev) =>
                prev ? { ...prev, name: e.target.value } : null
              )
            }
            required
          />
        </div>
      </GeneralModal>

      {/* Delete Ana Kategori Modal */}
      <GeneralModal
        id="deleteMainCategoryModal"
        title="Ana Kategori Sil"
        size="sm"
        onClose={() => setDeletingMainCategory(null)}
        onApprove={handleDeleteMainCategory}
        approveButtonText="Evet, Sil"
        isLoading={isDeletingMain}
        showFooter={true}
      >
        <div className="text-center">
          <i
            className="icon-exclamation"
            style={{ fontSize: "3rem", color: "#dc3545" }}
          ></i>
          <h4 className="mt-3">Emin misiniz?</h4>
          <p className="text-muted">
            Bu ana kategoriyi silmek istediğinizden emin misiniz? Bu işlem geri
            alınamaz ve tüm alt kategoriler de silinecektir.
          </p>
        </div>
      </GeneralModal>

      {/* Delete Alt Kategori Modal */}
      <GeneralModal
        id="deleteSubCategoryModal"
        title="Alt Kategori Sil"
        size="sm"
        onClose={() => setDeletingSubCategory(null)}
        onApprove={handleDeleteSubCategory}
        approveButtonText="Evet, Sil"
        isLoading={isDeletingSub}
        showFooter={true}
      >
        <div className="text-center">
          <i
            className="icon-exclamation"
            style={{ fontSize: "3rem", color: "#dc3545" }}
          ></i>
          <h4 className="mt-3">Emin misiniz?</h4>
          <p className="text-muted">
            Bu alt kategoriyi silmek istediğinizden emin misiniz? Bu işlem geri
            alınamaz.
          </p>
        </div>
      </GeneralModal>

      <style jsx>{`
        .card {
          border: 1px solid #e0e0e0;
          border-radius: 0.5rem;
        }

        .card-header {
          padding: 0.75rem;
          background-color: #fafafa;
          border-bottom: 1px solid #e0e0e0;
        }

        .card-header h6 {
          font-size: 0.875rem;
          font-weight: 500;
        }

        .list-group-item {
          padding: 0.5rem 0.75rem;
          font-size: 0.813rem;
          border-bottom: 1px solid #e0e0e0;
        }

        .table-bordered {
          border: 1px solid #dee2e6 !important;
        }

        .table-bordered td,
        .table-bordered th {
          border-left: none !important;
          border-right: none !important;
          border-top: none !important;
          border-bottom: 1px solid #dee2e6 !important;
        }

        .table tbody tr {
          border-bottom: 1px solid #dee2e6 !important;
        }

        .table tbody tr td {
          border-right: none !important;
          border-left: none !important;
          padding: 12px 8px;
        }

        .table tbody tr:last-child {
          border-bottom: 1px solid #dee2e6 !important;
        }

        .btn {
          font-size: 0.75rem;
        }

        .btn-sm {
          padding: 0.25rem 0.5rem;
        }

        .btn-outline-secondary {
          border: 1px solid #d0d0d0;
          background-color: white;
          color: #444;
        }

        .btn-outline-secondary:hover {
          background-color: #f5f5f5;
          border-color: #c0c0c0;
          color: #333;
        }

        .btn-link {
          border: 1px solid #e0e0e0;
          padding: 0.25rem 0.5rem;
          margin-left: 0.25rem;
        }

        .btn-link:hover {
          background-color: #f5f5f5;
        }

        .form-select {
          font-size: 0.813rem;
          padding: 0.375rem 0.5rem;
          border: 1px solid #d0d0d0;
        }

        .form-select:focus {
          border-color: #a0a0a0;
          box-shadow: none;
        }

        .text-muted {
          font-size: 0.75rem;
        }

        .spinner-border {
          width: 1rem;
          height: 1rem;
          border-width: 0.15em;
        }

        .container {
          padding-left: 0.5rem;
          padding-right: 0.5rem;
        }

        .page-content {
          padding: 0.5rem 0;
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

          .col-lg-6 {
            padding-left: 0.5rem;
            padding-right: 0.5rem;
          }
        }
      `}</style>
    </div >
  );
}

export default CategoryManagementPage;
