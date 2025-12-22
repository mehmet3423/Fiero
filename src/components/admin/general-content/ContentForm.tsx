import ProductSelector from "@/components/ProductSelector";
import {
  ContentLanguage,
  GeneralContentType,
  getContentLanguageName,
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

  // EditingContent varsa imageUrl'i set et
  React.useEffect(() => {
    if (editingContent?.imageUrl && !imageUrl) {
      setImageUrl(editingContent.imageUrl);
    }
  }, [editingContent, imageUrl, setImageUrl]);

  // MainProductList özel form state'i
  const [selectedProductIds, setSelectedProductIds] = React.useState<string[]>(
    () => {
      console.log(editingContent);
      if (editingContent && editingContent.content) {
        try {
          const arr = JSON.parse(editingContent.content);
          console.log(arr);
          if (Array.isArray(arr)) return arr;
        } catch { }
      }
      return [];
    }
  );

  // Store özel form state'i - artık sadece adres metni
  const [storeAddress, setStoreAddress] = React.useState<string>(() => {
    if (editingContent && editingContent.content) {
      return editingContent.content;
    }
    return "";
  });

  // Dil seçimi state'i
  const [selectedLanguage, setSelectedLanguage] = React.useState<ContentLanguage>(
    () => {
      if (editingContent?.language !== undefined) {
        return editingContent.language;
      }
      return ContentLanguage.TR; // Varsayılan olarak Türkçe
    }
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    // Language'ı her form için ekle
    formData.set("language", selectedLanguage.toString());

    // Eğer yeni bir görsel seçildiyse ve henüz yüklenmediyse, önce yükle
    let finalImageUrl = imageUrl;
    if (selectedFile && !imageUrl) {
      const uploadedUrl = await uploadImage();
      if (!uploadedUrl) {
        toast.error("Görsel yüklenemedi");
        return;
      }
      finalImageUrl = uploadedUrl;
    }

    // MainProductList özel form
    if (selectedContentType === GeneralContentType.MainProductList) {
      formData.set("content", JSON.stringify(selectedProductIds));
      // MainProductList için imageUrl opsiyonel, eğer varsa ekle
      if (finalImageUrl) {
        formData.set("imageUrl", finalImageUrl);
      }
      onSubmit(formData);
      return;
    }

    // Store özel form
    if (selectedContentType === GeneralContentType.Store) {
      formData.set("content", storeAddress);
      if (finalImageUrl) {
        formData.set("imageUrl", finalImageUrl);
      }
      onSubmit(formData);
      return;
    }

    // Görsel opsiyonel, varsa ekle
    if (finalImageUrl) {
      formData.set("imageUrl", finalImageUrl);
    }
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
          />
        </div>
        <div className="form-group mb-3">
          <label className="form-label">Dil</label>
          <select
            name="language"
            className="form-control"
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(Number(e.target.value) as ContentLanguage)}
          >
            {Object.entries(ContentLanguage)
              .filter(([key]) => isNaN(Number(key)))
              .map(([key, value]) => (
                <option key={key} value={value}>
                  {getContentLanguageName(value as ContentLanguage)}
                </option>
              ))}
          </select>
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
          disabled={isLoading || isImageUploading}
        >
          {isLoading || isImageUploading ? (
            <>
              <span
                className="spinner-border spinner-border-sm mr-2"
                role="status"
                aria-hidden="true"
              ></span>
              {isImageUploading ? "Görsel Yükleniyor..." : "İşleniyor..."}
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

  // Store özel form
  if (selectedContentType === GeneralContentType.Store) {
    return (
      <form
        id={editingContent ? "editContentForm" : "addContentForm"}
        className="p-4"
        onSubmit={handleSubmit}
      >
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="mb-0">
            {editingContent ? "Mağaza Düzenle" : "Yeni Mağaza Ekle"}
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
          <label className="form-label">Mağaza Adı</label>
          <input
            type="text"
            name="title"
            className="form-control"
            defaultValue={editingContent?.title}
            placeholder="Örn: Aqua Florya AVM"
          />
        </div>

        <div className="form-group mb-3">
          <label className="form-label">Dil</label>
          <select
            name="language"
            className="form-control"
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(Number(e.target.value) as ContentLanguage)}
          >
            {Object.entries(ContentLanguage)
              .filter(([key]) => isNaN(Number(key)))
              .map(([key, value]) => (
                <option key={key} value={value}>
                  {getContentLanguageName(value as ContentLanguage)}
                </option>
              ))}
          </select>
        </div>

        <div className="form-group mb-3">
          <label className="form-label">Adres</label>
          <textarea
            name="storeAddress"
            className="form-control"
            rows={3}
            value={storeAddress}
            onChange={(e) => setStoreAddress(e.target.value)}
            placeholder="Örn: Aqua Florya Alışveriş Merkezi, Yeşilköy Halkalı Caddesi, No:93, Zemin Kat Mağaza No:60, Bakırköy, İstanbul"
          />
        </div>

        <div className="form-group mb-3">
          <label className="form-label">Google Maps Linki</label>
          <input
            type="url"
            name="contentUrl"
            className="form-control"
            defaultValue={editingContent?.contentUrl}
            placeholder="https://www.google.com/maps/place/..."
            pattern="https?://.*"
            title="Lütfen geçerli bir Google Maps URL'si giriniz"
          />
          <small className="form-text text-muted">
            Google Maps'te konumu bulup linkini kopyalayın
          </small>
        </div>

        <div className="form-group mb-4">
          <label className="form-label">Mağaza Görseli (Opsiyonel)</label>
          <input
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/webp"
            className="form-control"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setSelectedFile(e.target.files[0]);
                // Yeni dosya seçildiğinde eski imageUrl'i temizle
                setImageUrl("");
              }
            }}
          />
          <small className="form-text text-muted">
            Görsel seçildikten sonra "Ekle" veya "Güncelle" butonuna basın, görsel otomatik olarak yüklenecektir.
          </small>

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
          disabled={isLoading || isImageUploading}
        >
          {isLoading || isImageUploading ? (
            <>
              <span
                className="spinner-border spinner-border-sm mr-2"
                role="status"
                aria-hidden="true"
              ></span>
              {isImageUploading ? "Görsel Yükleniyor..." : "İşleniyor..."}
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
        />
      </div>

      <div className="form-group mb-3">
        <label className="form-label">Dil</label>
        <select
          name="language"
          className="form-control"
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(Number(e.target.value) as ContentLanguage)}
        >
          {Object.entries(ContentLanguage)
            .filter(([key]) => isNaN(Number(key)))
            .map(([key, value]) => (
              <option key={key} value={value}>
                {getContentLanguageName(value as ContentLanguage)}
              </option>
            ))}
        </select>
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
        <label className="form-label">Resim Yükle (Opsiyonel)</label>
        <input
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/webp"
          className="form-control"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              setSelectedFile(e.target.files[0]);
              // Yeni dosya seçildiğinde eski imageUrl'i temizle
              setImageUrl("");
            }
          }}
        />
        <small className="form-text text-muted">
          Görsel seçildikten sonra "Ekle" veya "Güncelle" butonuna basın, görsel otomatik olarak yüklenecektir.
        </small>

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
        disabled={isLoading || isImageUploading}
      >
        {isLoading || isImageUploading ? (
          <>
            <span
              className="spinner-border spinner-border-sm mr-2"
              role="status"
              aria-hidden="true"
            ></span>
            {isImageUploading ? "Görsel Yükleniyor..." : "İşleniyor..."}
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
