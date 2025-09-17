"use client";
import ContentForm from "@/components/admin/general-content/ContentForm";
import GeneralContentEditGrid from "@/components/admin/general-content/GeneralContentEditGrid";
import GeneralModal from "@/components/shared/GeneralModal";
import {
  GeneralContentModel,
  GeneralContentType,
  getGeneralContentTypeName,
  isContentTypeCustomizable,
} from "@/constants/models/GeneralContent";
import { useAddContent } from "@/hooks/services/general-content/useAddContent";
import { useDeleteContent } from "@/hooks/services/general-content/useDeleteContent";
import { useGeneralContents } from "@/hooks/services/general-content/useGeneralContents";
import { useUpdateContent } from "@/hooks/services/general-content/useUpdateContent";
import styles from "@/styles/GeneralContent.module.css";
import Image from "next/image";
import { ReactNode, useEffect, useState } from "react";
import toast from "react-hot-toast";

function GeneralContentPage() {
  const [selectedContentType, setSelectedContentType] =
    useState<GeneralContentType | null>(null);
  const [editingContent, setEditingContent] = useState<any>(null);
  const [deletingContent, setDeletingContent] = useState<{
    id: string;
    title: string;
  } | null>(null);

  const { contents, isLoading, refetchContents } =
    useGeneralContents(selectedContentType);
  const { addContent, isPending: isAdding } = useAddContent();
  const { updateContent, isPending: isUpdating } = useUpdateContent();
  const { deleteContent, isPending: isDeleting } = useDeleteContent();

  const handleEdit = (content: GeneralContentModel) => {
    setEditingContent(content);
    $("#editContentModal").modal("show");
  };

  useEffect(() => {
    refetchContents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedContentType]);

  const handleAdd = async (formData: FormData) => {
    if (!selectedContentType) return;

    try {
      await addContent(
        formData.get("title") as string,
        formData.get("content") as string,
        formData.get("contentUrl") as string,
        formData.get("imageUrl") as string,
        contents?.items?.length || 0, // yeni içerik için order
        selectedContentType
      );
      $("#addContentModal").modal("hide");
      refetchContents();
      toast.success("İçerik başarıyla eklendi");
    } catch (error) {
      toast.error("İçerik eklenirken bir hata oluştu");
    }
  };

  const handleUpdate = async (formData: FormData) => {
    if (!editingContent) return;

    try {
      const updatedContent = {
        $id: editingContent.$id,
        id: editingContent.id,
        order: editingContent.order, // order korunuyor
        title: formData.get("title") as string,
        content: formData.get("content") as string,
        contentUrl: formData.get("contentUrl") as string,
        imageUrl: formData.get("imageUrl") as string,
        willRender: editingContent.willRender,
        generalContentType: editingContent.generalContentType,
      };

      await updateContent(editingContent.id, updatedContent);
      $("#editContentModal").modal("hide");
      setEditingContent(null);
      refetchContents();
      toast.success("İçerik başarıyla güncellendi");
    } catch (error) {
      toast.error("İçerik güncellenirken bir hata oluştu");
    }
  };

  const handleDeleteClick = (contentId: string, contentTitle?: string) => {
    setDeletingContent({ id: contentId, title: contentTitle || "" });
    $("#deleteContentModal").modal("show");
  };

  const handleDelete = async () => {
    if (!deletingContent) return;

    try {
      await deleteContent(deletingContent.id, selectedContentType);
      $("#deleteContentModal").modal("hide");
      setDeletingContent(null);
      refetchContents();
      toast.success("İçerik başarıyla silindi");
    } catch (error) {
      toast.error("İçerik silinirken bir hata oluştu");
    }
  };

  const noGeneralContentView = (): ReactNode => {
    if (isLoading) {
      return (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only">Yükleniyor...</span>
          </div>
        </div>
      );
    }

    if (selectedContentType === null) {
      return (
        <div className="text-center py-5">
          <i
            className="fas fa-hand-point-up mb-3"
            style={{ fontSize: "2rem", color: "#ccc" }}
          ></i>
          <p className="text-muted">Yukarıdan bir kategori seçin</p>
        </div>
      );
    }

    return (
      <GeneralContentEditGrid
        contents={(contents?.items as GeneralContentModel[])
          ?.slice()
          ?.sort((a, b) => (a.order ?? 0) - (b.order ?? 0))}
        updateContent={updateContent}
        refetchContent={refetchContents}
        deleteContent={handleDeleteClick}
        handleEdit={handleEdit}
      />
    );
  };

  return (
    <div className={styles.container}>
      {/* Sekmeler */}
      <ul className={styles.tabNav}>
        {Object.entries(GeneralContentType)
          .filter(([key]) => isNaN(Number(key)))
          .map(([key, value]) => (
            <li key={key} className={styles.tabItem}>
              <button
                type="button"
                className={`btn btn-outline-primary ${
                  selectedContentType === value ? "active" : ""
                }`}
                onClick={() =>
                  setSelectedContentType(value as GeneralContentType)
                }
              >
                {getGeneralContentTypeName(value as GeneralContentType)}
              </button>
            </li>
          ))}
      </ul>

      {/* İçerik Listesi */}
      <div className="content-area">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="mb-0"></h4>
          <button
            type="button"
            className="btn btn-success"
            onClick={() => $("#addContentModal").modal("show")}
          >
            <i className="fas fa-plus mr-1"></i> Yeni İçerik Ekle
          </button>
        </div>

        {selectedContentType &&
        isContentTypeCustomizable(selectedContentType) ? (
          <>{noGeneralContentView()}</>
        ) : (
          <div className={styles.contentList}>
            {isLoading ? (
              <div className="text-center py-5">
                <div
                  className="spinner-border text-primary"
                  role="status"
                ></div>
              </div>
            ) : selectedContentType === null ? (
              <div className="text-center py-5">
                <i
                  className="fas fa-hand-point-up mb-3"
                  style={{ fontSize: "2rem", color: "#ccc" }}
                ></i>
                <p className="text-muted">
                  Yukarıda bulunan içerik seçenekleri sizin websitenizi dinamik
                  olarak yönetmenizi sağlar. Başlamak için bir içerik seçiniz.
                </p>
              </div>
            ) : contents?.items?.length === 0 ? (
              <div className="text-center py-5">
                <i
                  className="fas fa-inbox mb-3"
                  style={{ fontSize: "2rem", color: "#ccc" }}
                ></i>
                <p className="text-muted">
                  Bu kategoride henüz içerik bulunmuyor
                </p>
              </div>
            ) : (
              contents?.items
                ?.slice()
                ?.sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0))
                .map((content: any) => (
                  <div
                    key={content.id}
                    className={`${styles.contentCard} p-4 mb-3 border rounded`}
                  >
                    <div className={styles.contentInfo}>
                      <h5 className="mb-3">{content.title}</h5>
                      <p className="text-muted mb-3">{content.content}</p>
                      {content.imageUrl && (
                        <Image
                          width={0}
                          height={0}
                          sizes="100vw"
                          src={content.imageUrl}
                          alt={content.title}
                          className={`${styles.contentImage} rounded`}
                        />
                      )}
                    </div>
                    <div className={`d-flex justify-content-between mt-3`}>
                      <button
                        type="button"
                        className={`btn btn-primary mx-2`}
                        onClick={() => handleEdit(content)}
                      >
                        <i className="fas fa-edit mr-1"></i>
                        Düzenle
                      </button>

                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() =>
                          handleDeleteClick(content.id, content.title)
                        }
                        disabled={isDeleting}
                      >
                        <i className="bx bx-trash me-1"></i>
                        Sil
                      </button>
                    </div>
                  </div>
                ))
            )}
          </div>
        )}
      </div>

      {selectedContentType && (
        <>
          {/* Ekleme Modalı */}
          <GeneralModal id="addContentModal" title="Yeni İçerik Ekle" size="lg">
            <ContentForm
              key={`add-${selectedContentType}`} // kategori değişiminde sıfırla
              onSubmit={handleAdd}
              isLoading={isAdding}
              selectedContentType={selectedContentType}
            />
          </GeneralModal>

          {/* Düzenleme Modalı */}
          <GeneralModal id="editContentModal" title="İçerik Düzenle" size="lg">
            {editingContent && (
              <ContentForm
                key={editingContent.id}
                editingContent={editingContent}
                onSubmit={handleUpdate}
                isLoading={isUpdating}
                onCancel={() => {
                  setEditingContent(null);
                  $("#editContentModal").modal("hide");
                }}
                selectedContentType={selectedContentType}
              />
            )}
          </GeneralModal>

          {/* Silme Modalı */}
          <GeneralModal
            id="deleteContentModal"
            title="İçerik Sil"
            size="sm"
            showFooter={true}
            approveButtonText="Evet, Sil"
            onApprove={handleDelete}
            onClose={() => setDeletingContent(null)}
            isLoading={isDeleting}
          >
            <div className="text-center">
              <i
                className="fas fa-exclamation-triangle"
                style={{ fontSize: "3rem", color: "#dc3545" }}
              ></i>
              <h4 className="mt-3">Emin misiniz?</h4>
              <p className="text-muted">
                "{deletingContent?.title}" başlıklı içeriği silmek
                istediğinizden emin misiniz? Bu işlem geri alınamaz.
              </p>
            </div>
          </GeneralModal>
        </>
      )}
    </div>
  );
}

export default GeneralContentPage;
