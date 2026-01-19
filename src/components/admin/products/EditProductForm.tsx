import { UpdateDtoProduct } from "@/constants/models/DtoProduct";
import { Product } from "@/constants/models/Product";
import { uploadImageToCloudinary } from "@/helpers/imageUpload";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useGetMainCategories } from "@/hooks/services/categories/useGetMainCategories";
import { useSubCategoriesByMainCategoryId } from "@/hooks/services/categories/useSubCategoriesByMainCategoryId";
import { useMainCategoriesWithSubCategories } from "@/hooks/services/categories/useMainCategoriesWithSubCategories";

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
    titleEn: product.titleEn || "",
    description: product.description,
    descriptionEn: product.descriptionEn || "",
    price: product.price,
    stockCode: product.stockCode,
    sellableQuantity: product.sellableQuantity,
    barcodeNumber: product.barcodeNumber,
    baseImageUrl: product.baseImageUrl,
    baseImageUrlEn: product.baseImageUrlEn || "",
    contentImageUrls: product.contentImageUrls,
    contentImageUrlsEn: product.contentImageUrlsEn || [],
    banner: product.banner,
    bannerEn: product.bannerEn || [],
    videoUrl: product.videoUrl,
    videoUrlEn: product.videoUrlEn || "",
    subCategoryId: product.subCategoryId,
    isAvailable: product.isAvailable,
    refundable: product.refundable,
    isOutlet: product.isOutlet,
    currencyType: (product as any).currencyType ? Number((product as any).currencyType) : undefined,
    likeCount: (product as any).likeCount || undefined,
    saleCount: (product as any).saleCount || undefined,
    taxRate: (product as any).taxRate || undefined,
  });

  const [selectedMainCategoryId, setSelectedMainCategoryId] = useState<string>("");
  
  // Category hooks
  const { data: mainCategories, isLoading: isMainCategoriesLoading } = useGetMainCategories();
  const { data: subCategories, isLoading: isSubCategoriesLoading } = useSubCategoriesByMainCategoryId(
    selectedMainCategoryId || null
  );
  const { data: mainCategoriesWithSubs } = useMainCategoriesWithSubCategories();

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedContentImages, setSelectedContentImages] = useState<File[]>(
    []
  );
  const [selectedBannerImages, setSelectedBannerImages] = useState<File[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string>(product.baseImageUrl);
  const [contentPreviewUrls, setContentPreviewUrls] = useState<string[]>([]);
  const [bannerPreviewUrls, setBannerPreviewUrls] = useState<string[]>([]);

  // Product info state
  const [productInfos, setProductInfos] = useState<
    Array<{
      id?: string;
      title: string;
      titleEn?: string;
      description: string;
      descriptionEn?: string;
      icon: string;
    }>
  >([]);

  // Product yüklendiğinde mevcut kategoriyi bul
  useEffect(() => {
    if (mainCategoriesWithSubs && mainCategoriesWithSubs.length > 0 && product.subCategoryId) {
      for (const mainCategory of mainCategoriesWithSubs) {
        const foundSubCategory = mainCategory.subCategories.find(
          (sub) => sub.id === product.subCategoryId
        );
        if (foundSubCategory) {
          setSelectedMainCategoryId(mainCategory.id);
          break;
        }
      }
    }
  }, [mainCategoriesWithSubs, product.subCategoryId]);

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

      // Handle productInfos
      let productInfosData: Array<{
        id?: string;
        title: string;
        titleEn?: string;
        description: string;
        descriptionEn?: string;
        icon: string;
      }> = [];

      if (product.productInfos && Array.isArray(product.productInfos)) {
        productInfosData = product.productInfos.map((info: any) => ({
          ...info,
          titleEn: info.titleEn ?? undefined,
          descriptionEn: info.descriptionEn ?? undefined,
        }));
      } else if (
        product.productInfos &&
        typeof product.productInfos === "object" &&
        "$values" in (product.productInfos as any)
      ) {
        const values = (product.productInfos as any).$values;
        if (Array.isArray(values)) {
          productInfosData = values.map((info: any) => ({
            ...info,
            titleEn: info.titleEn ?? undefined,
            descriptionEn: info.descriptionEn ?? undefined,
          }));
        }
      }

      setProductInfos(productInfosData);

      setFormData({
        title: product.title,
        titleEn: product.titleEn || "",
        description: product.description,
        descriptionEn: product.descriptionEn || "",
        price: product.price,
        stockCode: product.stockCode,
        sellableQuantity: product.sellableQuantity,
        barcodeNumber: product.barcodeNumber,
        baseImageUrl: product.baseImageUrl,
        baseImageUrlEn: product.baseImageUrlEn || "",
        contentImageUrls: contentUrls,
        contentImageUrlsEn: product.contentImageUrlsEn || [],
        banner: bannerUrls,
        bannerEn: product.bannerEn || [],
        videoUrl: product.videoUrl,
        videoUrlEn: product.videoUrlEn || "",
        subCategoryId: product.subCategoryId,
        isAvailable: product.isAvailable,
        refundable: product.refundable,
        isOutlet: product.isOutlet,
        currencyType: (product as any).currencyType ? Number((product as any).currencyType) : undefined,
        likeCount: (product as any).likeCount || undefined,
        saleCount: (product as any).saleCount || undefined,
        taxRate: (product as any).taxRate || undefined,
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
      if (
        !["image/jpeg", "image/png", "image/jpg", "image/webp"].includes(
          file.type
        )
      ) {
        toast.error("Sadece JPG, JPEG, PNG ve WebP formatları desteklenir");
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
          if (
            !["image/jpeg", "image/png", "image/jpg", "image/webp"].includes(
              file.type
            )
          ) {
            throw new Error(
              "Sadece JPG, JPEG, PNG ve WebP formatları desteklenir"
            );
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
          if (
            !["image/jpeg", "image/png", "image/jpg", "image/webp"].includes(
              file.type
            )
          ) {
            throw new Error(
              "Sadece JPG, JPEG, PNG ve WebP formatları desteklenir"
            );
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

  // Product info handlers
  const addProductInfo = () => {
    const newInfo = { title: "", titleEn: "", description: "", descriptionEn: "", icon: "" };
    setProductInfos([...productInfos, newInfo]);
  };

  const removeProductInfo = (index: number) => {
    const updatedInfos = productInfos.filter((_, i) => i !== index);
    setProductInfos(updatedInfos);
  };

  const updateProductInfo = (
    index: number,
    field: "title" | "titleEn" | "description" | "descriptionEn" | "icon",
    value: string
  ) => {
    const updatedInfos = [...productInfos];
    updatedInfos[index] = { ...updatedInfos[index], [field]: value };
    setProductInfos(updatedInfos);
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

          // productInfos'u update ve create olarak ayır
          const updateProductInfos = productInfos.filter(
            (info) => info.id
          ) as Array<{
            id: string;
            title: string;
            titleEn?: string;
            description: string;
            descriptionEn?: string;
            icon: string;
          }>;
          const createProductInfos = productInfos
            .filter((info) => !info.id)
            .map(({ id, ...rest }) => rest);

          await onSubmit(product.id, {
            ...formData,
            baseImageUrl,
            contentImageUrls,
            banner: bannerUrls,
            updateProductInfos,
            createProductInfos,
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
            <label>
              Başlık (İngilizce) <span className="text-muted">(Opsiyonel)</span>
            </label>
            <input
              type="text"
              className="form-control"
              value={formData.titleEn || ""}
              onChange={(e) =>
                setFormData({ ...formData, titleEn: e.target.value })
              }
            />
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6">
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
        </div>
        <div className="col-md-6">
          <div className="form-group">
            <label>
              Açıklama (İngilizce) <span className="text-muted">(Opsiyonel)</span>
            </label>
            <textarea
              className="form-control"
              value={formData.descriptionEn || ""}
              onChange={(e) =>
                setFormData({ ...formData, descriptionEn: e.target.value })
              }
              rows={3}
            />
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6">
          <div className="form-group">
            <label>Ana Kategori:</label>
            <select
              className="form-control"
              value={selectedMainCategoryId}
              onChange={(e) => {
                const mainCategoryId = e.target.value;
                setSelectedMainCategoryId(mainCategoryId);
                // Reset subcategory when main category changes
                if (mainCategoryId !== selectedMainCategoryId) {
                  setFormData({ ...formData, subCategoryId: "" });
                }
              }}
              disabled={isMainCategoriesLoading}
              required
            >
              <option value="">Kategori Seçin</option>
              {mainCategories?.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="col-md-6">
          <div className="form-group">
            <label>Alt Kategori:</label>
            <select
              className="form-control"
              value={formData.subCategoryId}
              onChange={(e) =>
                setFormData({ ...formData, subCategoryId: e.target.value })
              }
              disabled={!selectedMainCategoryId || isSubCategoriesLoading}
              required
            >
              <option value="">Alt Kategori Seçin</option>
              {subCategories?.map((subCategory) => (
                <option key={subCategory.id} value={subCategory.id}>
                  {subCategory.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-3">
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
        <div className="col-md-3">
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
        <div className="col-md-3">
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
        <div className="col-md-3">
          <div className="form-group">
            <label>KDV Oranı (%):</label>
            <input
              type="number"
              className="form-control"
              value={formData.taxRate || 0}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  taxRate: Number(e.target.value),
                })
              }
              min={0}
              max={100}
            />
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
                style={{ cursor: "pointer" }}
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
                style={{ cursor: "pointer" }}
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
                style={{ cursor: "pointer" }}
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

      {/* Product Info Section */}
      <div className="form-group">
        <label className="mt-3">Ürün Bilgileri:</label>
        <div className="card border p-3">
          {productInfos.map((info, index) => (
            <div key={index} className="row g-2 mb-3 p-3 border rounded">
              <div className="col-md-3">
                <label className="form-label small">Başlık</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  value={info.title}
                  onChange={(e) =>
                    updateProductInfo(index, "title", e.target.value)
                  }
                  placeholder="Örn: Garanti"
                />
              </div>
              <div className="col-md-3">
                <label className="form-label small">
                  Başlık (EN) <span className="text-muted">(Opsiyonel)</span>
                </label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  value={info.titleEn || ""}
                  onChange={(e) =>
                    updateProductInfo(index, "titleEn", e.target.value)
                  }
                  placeholder="e.g. Warranty"
                />
              </div>
              <div className="col-md-3">
                <label className="form-label small">Açıklama</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  value={info.description}
                  onChange={(e) =>
                    updateProductInfo(index, "description", e.target.value)
                  }
                  placeholder="Örn: 2 yıl garanti"
                />
              </div>
              <div className="col-md-3">
                <label className="form-label small">
                  Açıklama (EN) <span className="text-muted">(Opsiyonel)</span>
                </label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  value={info.descriptionEn || ""}
                  onChange={(e) =>
                    updateProductInfo(index, "descriptionEn", e.target.value)
                  }
                  placeholder="e.g. 2 years warranty"
                />
              </div>
              <div className="col-md-1 d-flex align-items-end">
                <button
                  type="button"
                  className="btn btn-sm btn-danger"
                  onClick={() => removeProductInfo(index)}
                >
                  <i className="bx bx-trash"></i>
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            className="btn btn-outline-primary btn-sm"
            onClick={addProductInfo}
          >
            <i className="bx bx-plus me-1"></i>
            Bilgi Ekle
          </button>
        </div>
      </div>

      <div className="form-group">
        <label className="mt-3">Ana Resim:</label>
        <div className="d-flex align-items-center gap-3">
          <input
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/webp"
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
            accept="image/png,image/jpeg,image/jpg,image/webp"
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
            accept="image/png,image/jpeg,image/jpg,image/webp"
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
