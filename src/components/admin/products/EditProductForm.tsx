import { UpdateDtoProduct } from "@/constants/models/DtoProduct";
import { Product } from "@/constants/models/Product";
import { uploadImageToCloudinary } from "@/helpers/imageUpload";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

interface EditProductFormProps {
  product: Product;
  onSubmit: (productId: string, data: UpdateDtoProduct) => Promise<void>;
  isLoading: boolean;
}

export default function EditProductForm({
  product,
  onSubmit,
  isLoading,
}: EditProductFormProps) {
  const [formData, setFormData] = useState<UpdateDtoProduct>({
    title: product.title,
    description: product.description,
    price: product.price,
    stockCode: product.stockCode,
    sellableQuantity: product.sellableQuantity,
    barcodeNumber: product.barcodeNumber,
    baseImageUrl: product.baseImageUrl,
    contentImageUrls: product.contentImageUrls,
    banner: product.banner,
    subCategoryId: product.subCategoryId,
    isAvailable: product.isAvailable,
    refundable: product.refundable,
    isOutlet: product.isOutlet,
  });

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedContentImages, setSelectedContentImages] = useState<File[]>(
    []
  );
  const [selectedBannerImages, setSelectedBannerImages] = useState<File[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string>(product.baseImageUrl);
  const [contentPreviewUrls, setContentPreviewUrls] = useState<string[]>([]);
  const [bannerPreviewUrls, setBannerPreviewUrls] = useState<string[]>([]);

  useEffect(() => {
    try {
      let contentUrls: string[] = [];
      if (Array.isArray(product.contentImageUrls)) {
        contentUrls = product.contentImageUrls;
      } else if (
        typeof product.contentImageUrls === "object" &&
        product.contentImageUrls !== null
      ) {
        // Check if $values exists and is an array
        if ("$values" in (product.contentImageUrls as any)) {
          const values = (product.contentImageUrls as any).$values;
          if (Array.isArray(values)) {
            contentUrls = values;
          }
        }
      }

      let bannerUrls: string[] = [];
      if (Array.isArray(product.banner)) {
        bannerUrls = product.banner;
      } else if (
        typeof product.banner === "object" &&
        product.banner !== null
      ) {
        // Check if $values exists and is an array
        if ("$values" in (product.banner as any)) {
          const values = (product.banner as any).$values;
          if (Array.isArray(values)) {
            bannerUrls = values;
          }
        }
      }

      setContentPreviewUrls(contentUrls);
      setBannerPreviewUrls(bannerUrls);

      // Seçili dosyaları temizle (yeni product gelince)
      setSelectedImage(null);
      setSelectedContentImages([]);
      setSelectedBannerImages([]);

      // Ana resim URL'sini de güncelle
      if (product.baseImageUrl) {
        setPreviewUrl(product.baseImageUrl);
      }

      setFormData({
        title: product.title,
        description: product.description,
        price: product.price,
        stockCode: product.stockCode,
        sellableQuantity: product.sellableQuantity,
        barcodeNumber: product.barcodeNumber,
        baseImageUrl: product.baseImageUrl,
        contentImageUrls: contentUrls,
        banner: bannerUrls,
        subCategoryId: product.subCategoryId,
        isAvailable: product.isAvailable,
        refundable: product.refundable,
        isOutlet: product.isOutlet,
      });
    } catch (error) {
      console.error("Resim verilerini işlerken hata oluştu:", error);
    }
  }, [product]);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file.size > 10000000) {
        toast.error("Dosya boyutu çok büyük (max 10MB)");
        return;
      }
      if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
        toast.error("Sadece JPG, JPEG ve PNG formatları desteklenir");
        return;
      }
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleContentImagesSelect = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files) {
      try {
        const files = Array.from(event.target.files);
        files.forEach((file) => {
          if (file.size > 10000000) {
            throw new Error("Dosya boyutu çok büyük (max 10MB)");
          }
          if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
            throw new Error("Sadece JPG, JPEG ve PNG formatları desteklenir");
          }
        });

        setSelectedContentImages((prev) => [...prev, ...files]);
        const newPreviewUrls = files.map((file) => URL.createObjectURL(file));
        setContentPreviewUrls((prev) => [...prev, ...newPreviewUrls]);
        setFormData((prev) => ({
          ...prev,
          contentImageUrls: [...prev.contentImageUrls, ...newPreviewUrls],
        }));
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        }
      }
    }
  };

  const handleBannerImagesSelect = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files) {
      try {
        const files = Array.from(event.target.files);
        files.forEach((file) => {
          if (file.size > 10000000) {
            throw new Error("Dosya boyutu çok büyük (max 10MB)");
          }
          if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
            throw new Error("Sadece JPG, JPEG ve PNG formatları desteklenir");
          }
        });

        setSelectedBannerImages((prev) => [...prev, ...files]);
        const newPreviewUrls = files.map((file) => URL.createObjectURL(file));
        setBannerPreviewUrls((prev) => [...prev, ...newPreviewUrls]);
        setFormData((prev) => ({
          ...prev,
          banner: [...(prev.banner || []), ...newPreviewUrls],
        }));
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        }
      }
    }
  };

  const removeContentImage = (index: number) => {
    setSelectedContentImages((prev) => prev.filter((_, i) => i !== index));
    setContentPreviewUrls((prev) => prev.filter((_, i) => i !== index));
    setFormData((prev) => ({
      ...prev,
      contentImageUrls: prev.contentImageUrls.filter((_, i) => i !== index),
    }));
  };

  const removeBannerImage = (index: number) => {
    setSelectedBannerImages((prev) => prev.filter((_, i) => i !== index));
    setBannerPreviewUrls((prev) => prev.filter((_, i) => i !== index));
    setFormData((prev) => ({
      ...prev,
      banner: prev.banner?.filter((_, i) => i !== index) || [],
    }));
  };

  return (
    <form
      id="editProductForm"
      className="text-dark d-flex flex-column gap-3"
      onSubmit={async (e) => {
        e.preventDefault();
        try {
          let baseImageUrl = formData.baseImageUrl;
          let contentImageUrls = formData.contentImageUrls || [];
          let bannerUrls = formData.banner || [];

          if (selectedImage) {
            const result = await uploadImageToCloudinary(selectedImage);
            baseImageUrl = result.secure_url;
          }

          if (selectedContentImages.length > 0) {
            const uploadPromises = selectedContentImages.map((file) =>
              uploadImageToCloudinary(file)
            );
            const results = await Promise.all(uploadPromises);

            // Filtrele: blob: ile başlayan URL'ler yeni yüklenen resimler, onları çıkar
            const existingUrls = contentImageUrls.filter(
              (url) => !url.startsWith("blob:")
            );
            contentImageUrls = [
              ...existingUrls,
              ...results.map((r) => r.secure_url),
            ];
          }

          if (selectedBannerImages.length > 0) {
            const uploadPromises = selectedBannerImages.map((file) =>
              uploadImageToCloudinary(file)
            );
            const results = await Promise.all(uploadPromises);

            // Filtrele: blob: ile başlayan URL'ler yeni yüklenen resimler, onları çıkar
            const existingUrls = bannerUrls.filter(
              (url) => !url.startsWith("blob:")
            );
            bannerUrls = [...existingUrls, ...results.map((r) => r.secure_url)];
          }

          await onSubmit(product.id, {
            ...formData,
            baseImageUrl,
            contentImageUrls,
            banner: bannerUrls,
          });
        } catch (error) {
          if (error instanceof Error) {
            toast.error(error.message);
          } else {
            toast.error("Ürün güncellenirken bir hata oluştu");
          }
        }
      }}
    >
      <div className="row">
        <div className="col-md-6">
          <div className="form-group">
            <label>Başlık:</label>
            <input
              type="text"
              className="form-control"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="form-group">
            <label>Fiyat:</label>
            <input
              type="number"
              className="form-control"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: Number(e.target.value) })
              }
              required
            />
          </div>
        </div>
      </div>

      <div className="form-group">
        <label>Açıklama:</label>
        <textarea
          className="form-control"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          rows={3}
          required
        />
      </div>

      <div className="row">
        <div className="col-md-4">
          <div className="form-group">
            <label>Stok Miktarı:</label>
            <input
              type="number"
              className="form-control"
              value={formData.sellableQuantity}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  sellableQuantity: Number(e.target.value),
                })
              }
              required
            />
          </div>
        </div>
        <div className="col-md-4">
          <div className="form-group">
            <label>Barkod:</label>
            <input
              type="text"
              className="form-control"
              value={formData.barcodeNumber}
              maxLength={13}
              onKeyPress={(e) => {
                if (!/[0-9]/.test(e.key)) {
                  e.preventDefault();
                }
              }}
              onChange={(e) =>
                setFormData({ ...formData, barcodeNumber: e.target.value })
              }
              required
            />
            <small className="text-muted">Barkod 13 haneli olmalıdır</small>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-3">
          <div className="form-group">
            <label className="form-label">Ürün Durumu:</label>
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="refundableCheckbox"
                checked={formData.refundable}
                onChange={(e) =>
                  setFormData({ ...formData, refundable: e.target.checked })
                }
              />
              <label className="form-check-label" htmlFor="refundableCheckbox">
                İade Edilebilir
              </label>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="form-group">
            <label className="form-label">Ürün Durumu:</label>
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="isAvailableCheckbox"
                checked={formData.isAvailable}
                onChange={(e) =>
                  setFormData({ ...formData, isAvailable: e.target.checked })
                }
              />
              <label className="form-check-label" htmlFor="isAvailableCheckbox">
                Satışa Açık
              </label>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="form-group">
            <label className="form-label">Ürün Durumu:</label>
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="isOutletCheckbox"
                checked={formData.isOutlet}
                onChange={(e) =>
                  setFormData({ ...formData, isOutlet: e.target.checked })
                }
              />
              <label className="form-check-label" htmlFor="isOutletCheckbox">
                Outlet Ürün
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="form-group">
        <label className="mt-3">Ana Resim:</label>
        <div className="d-flex align-items-center gap-3">
          <input
            type="file"
            accept="image/png,image/jpeg,image/jpg"
            className="form-control"
            onChange={handleImageSelect}
            disabled={isLoading}
          />
          {previewUrl && (
            <div
              style={{
                position: "relative",
                display: "inline-block",
                border: "2px solid #ddd",
                borderRadius: "8px",
                padding: "4px",
                backgroundColor: "#f9f9f9",
              }}
            >
              <Image
                width={100}
                height={100}
                src={previewUrl}
                alt="Product"
                style={{
                  objectFit: "cover",
                  borderRadius: "4px",
                  display: "block",
                }}
              />
            </div>
          )}
        </div>
      </div>

      <div className="form-group">
        <label>İçerik Resimleri:</label>
        <div className="d-flex align-items-center gap-3 flex-wrap">
          <input
            type="file"
            accept="image/png,image/jpeg,image/jpg"
            className="form-control"
            onChange={handleContentImagesSelect}
            multiple
            disabled={isLoading || contentPreviewUrls.length >= 6}
          />

          <div className="d-flex gap-2 flex-wrap mt-2">
            {contentPreviewUrls.map((url, index) => (
              <div key={index} className="image-preview">
                <button
                  type="button"
                  onClick={() => removeContentImage(index)}
                  style={{
                    width: "20px",
                    height: "20px",
                    fontSize: "18px",
                    fontWeight: "bold",
                    lineHeight: "1",
                    backgroundColor: "red",
                    border: "none",
                    borderRadius: "15%",
                  }}
                >
                  ×
                </button>
                <Image
                  width={100}
                  height={100}
                  src={url}
                  alt={`Content ${index + 1}`}
                  style={{ objectFit: "cover" }}
                />
              </div>
            ))}
          </div>
        </div>
        <small className="text-muted">
          En fazla 6 içerik resmi ekleyebilirsiniz. ({contentPreviewUrls.length}
          /6)
        </small>
      </div>

      <div className="form-group">
        <label>Banner Resmi:</label>
        <div className="d-flex align-items-center gap-3 flex-wrap">
          <input
            type="file"
            accept="image/png,image/jpeg,image/jpg"
            className="form-control"
            onChange={handleBannerImagesSelect}
            disabled={isLoading || bannerPreviewUrls.length >= 1}
          />
          <div className="d-flex gap-2 flex-wrap mt-2">
            {bannerPreviewUrls.map((url, index) => (
              <div key={index} className="image-preview">
                <button
                  type="button"
                  onClick={() => removeBannerImage(index)}
                  style={{
                    width: "20px",
                    height: "20px",
                    fontSize: "18px",
                    fontWeight: "bold",
                    lineHeight: "1",
                    backgroundColor: "red",
                    border: "none",
                    borderRadius: "15%",
                  }}
                >
                  ×
                </button>
                <Image
                  width={100}
                  height={100}
                  src={url}
                  alt={`Banner ${index + 1}`}
                  style={{ objectFit: "cover" }}
                />
              </div>
            ))}
          </div>
        </div>
        <small className="text-muted">
          Sadece 1 banner resmi ekleyebilirsiniz. ({bannerPreviewUrls.length}/1)
        </small>
      </div>
    </form>
  );
}
