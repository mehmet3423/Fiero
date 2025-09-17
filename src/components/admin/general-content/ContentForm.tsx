import ProductSelector from "@/components/ProductSelector";
import {
  GeneralContentType,
  isContentTypeCustomizable,
} from "@/constants/models/GeneralContent";
import { useCloudinaryImageUpload } from "@/hooks/useCloudinaryImageUpload";
import React from "react";
import { toast } from "react-hot-toast";

interface ContentFormProps {
  editingContent?: any;
  onSubmit: (formData: FormData) => void;
  isLoading: boolean;
  onCancel?: () => void;
  selectedContentType: GeneralContentType;
}

export default function ContentForm({
  editingContent,
  onSubmit,
  isLoading,
  onCancel,
  selectedContentType,
}: ContentFormProps) {
  const {
    selectedFile,
    setSelectedFile,
    imageUrl,
    setImageUrl,
    uploadImage,
    isUploading: isImageUploading,
  } = useCloudinaryImageUpload();

  // MainProductList özel form state'i
  const [selectedProductIds, setSelectedProductIds] = React.useState<string[]>(
    () => {
      if (editingContent && editingContent.content) {
        try {
          const arr = JSON.parse(editingContent.content);
          if (Array.isArray(arr)) return arr;
        } catch {}
      }
      return [];
    }
  );

  const validateUrl = (url: string): boolean => {
    if (!url) return true; // Boş URL'ye izin ver
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const contentUrl = formData.get("contentUrl") as string;
    // imageUrl artık inputtan değil, hook'tan gelecek

    // MainProductList özel form
    if (selectedContentType === GeneralContentType.MainProductList) {
      if (selectedProductIds.length === 0) {
        toast.error("Lütfen en az bir ürün seçin");
        return;
      }
      formData.set("content", JSON.stringify(selectedProductIds));
      onSubmit(formData);
      return;
    }

    if (contentUrl && !validateUrl(contentUrl)) {
      toast.error("Geçerli bir içerik URL'si giriniz");
      return;
    }

    // Görsel yüklü değilse veya yükleniyorsa engelle (MainProductList hariç)
    if (!imageUrl) {
      toast.error("Lütfen bir görsel yükleyin");
      return;
    }
    if (isImageUploading) {
      toast.error("Görsel yükleniyor, lütfen bekleyin");
      return;
    }

    formData.set("imageUrl", imageUrl);
    onSubmit(formData);
  };

  // Form render
  if (selectedContentType === GeneralContentType.MainProductList) {
    return (
      <form
        id={editingContent ? "editContentForm" : "addContentForm"}
        className="p-4"
        onSubmit={handleSubmit}
      >
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="mb-0">
            {editingContent ? "İçerik Düzenle" : "Yeni İçerik Ekle"}
          </h4>
          {onCancel && (
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={onCancel}
            >
              <i className="fas fa-times mr-1"></i>
              İptal
            </button>
          )}
        </div>
        <div className="form-group mb-3">
          <label className="form-label">Başlık</label>
          <input
            type="text"
            name="title"
            className="form-control"
            defaultValue={editingContent?.title}
            required
          />
        </div>
        <div className="form-group mb-4">
          <ProductSelector
            selectedProductIds={selectedProductIds}
            onProductSelect={(productId) => {
              setSelectedProductIds((prev) => {
                if (prev.includes(productId)) {
                  return prev.filter((id) => id !== productId);
                } else {
                  return [...prev, productId];
                }
              });
            }}
            multiSelect={true}
            title="Ürün Seçimi"
            height="300px"
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary w-100"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span
                className="spinner-border spinner-border-sm mr-2"
                role="status"
                aria-hidden="true"
              ></span>
              İşleniyor...
            </>
          ) : (
            <>
              <i
                className={`fas fa-${editingContent ? "save" : "plus"} mr-2`}
              ></i>
              {editingContent ? "Güncelle" : "Ekle"}
            </>
          )}
        </button>
      </form>
    );
  }

  return (
    <form
      id={editingContent ? "editContentForm" : "addContentForm"}
      className="p-4"
      onSubmit={handleSubmit}
    >
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0">
          {editingContent ? "İçerik Düzenle" : "Yeni İçerik Ekle"}
        </h4>
        {onCancel && (
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={onCancel}
          >
            <i className="fas fa-times mr-1"></i>
            İptal
          </button>
        )}
      </div>

      <div className="form-group mb-3">
        <label className="form-label">Başlık</label>
        <input
          type="text"
          name="title"
          className="form-control"
          defaultValue={editingContent?.title}
          required
        />
      </div>

      {isContentTypeCustomizable(selectedContentType) ? (
        <></>
      ) : (
        <div className="form-group mb-3">
          <label className="form-label">İçerik</label>
          <textarea
            name="content"
            className="form-control"
            rows={4}
            defaultValue={editingContent?.content}
            required
          />
        </div>
      )}

      <div className="form-group mb-3">
        <label className="form-label">İçerik URL</label>
        <input
          type="url"
          name="contentUrl"
          className="form-control"
          defaultValue={editingContent?.contentUrl}
          placeholder="https://example.com"
          pattern="https?://.*"
          title="Lütfen geçerli bir URL giriniz (http:// veya https:// ile başlamalı)"
        />
      </div>

      <div className="form-group mb-4">
        <label className="form-label">Resim Yükle</label>
        <input
          type="file"
          accept="image/png,image/jpeg,image/jpg"
          className="form-control"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              setSelectedFile(e.target.files[0]);
            }
          }}
        />
        <button
          type="button"
          className="btn btn-outline-primary mt-2"
          onClick={uploadImage}
          disabled={!selectedFile || isImageUploading}
        >
          {isImageUploading ? (
            <>
              <span
                className="spinner-border spinner-border-sm mr-2"
                role="status"
                aria-hidden="true"
              ></span>
              Yükleniyor...
            </>
          ) : (
            <>
              <i className="fas fa-upload mr-1"></i> Görseli Yükle
            </>
          )}
        </button>
        {!imageUrl && editingContent?.imageUrl && (
          <div className="mt-2">
            <img
              src={editingContent.imageUrl}
              alt="Mevcut görsel"
              style={{ maxWidth: 200, maxHeight: 120, borderRadius: 8 }}
            />
            <div className="text-muted" style={{ fontSize: 12 }}>
              Mevcut görsel
            </div>
          </div>
        )}
        {imageUrl && (
          <div className="mt-2">
            <img
              src={imageUrl}
              alt="Yüklenen görsel"
              style={{ maxWidth: 200, maxHeight: 120, borderRadius: 8 }}
            />
          </div>
        )}
      </div>

      <button
        type="submit"
        className="btn btn-primary w-100"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <span
              className="spinner-border spinner-border-sm mr-2"
              role="status"
              aria-hidden="true"
            ></span>
            İşleniyor...
          </>
        ) : (
          <>
            <i
              className={`fas fa-${editingContent ? "save" : "plus"} mr-2`}
            ></i>
            {editingContent ? "Güncelle" : "Ekle"}
          </>
        )}
      </button>
    </form>
  );
}
