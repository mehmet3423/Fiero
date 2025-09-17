import { UpdateDtoProduct } from "@/constants/models/DtoProduct";
import { Product } from "@/constants/models/Product";
import { ProductSpecification } from "@/constants/models/ProductSpecification";
import { uploadImageToCloudinary } from "@/helpers/imageUpload";
import { useGetProductSpecifications } from "@/hooks/services/product-specifications/useGetProductSpecifications";
import { useAddProductSpecification } from "@/hooks/services/product-specifications/useAddProductSpecification";
import { useUpdateProductSpecification } from "@/hooks/services/product-specifications/useUpdateProductSpecification";
import { useDeleteProductSpecification } from "@/hooks/services/product-specifications/useDeleteProductSpecification";
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

  // Product specifications state
  const {
    productSpecifications: apiSpecifications,
    isLoading: specificationsLoading,
  } = useGetProductSpecifications(product.id);

  // Local state for managing specifications
  const [localProductSpecifications, setLocalProductSpecifications] = useState<
    ProductSpecification[]
  >([]);

  // Initialize local specifications when data is available
  useEffect(() => {
    // Check if product has productOnlySpecifications property
    const productSpecs = (product as any).productOnlySpecifications;
    if (
      productSpecs &&
      Array.isArray(productSpecs) &&
      productSpecs.length > 0
    ) {
      // Use data from product prop
      const convertedSpecs = productSpecs.map((spec: any) => ({
        $id: spec.$id,
        id: spec.id,
        name: spec.name,
        value: spec.value,
      }));
      setLocalProductSpecifications(convertedSpecs);
    } else if (
      apiSpecifications &&
      Array.isArray(apiSpecifications) &&
      apiSpecifications.length > 0
    ) {
      // Use data from API call
      setLocalProductSpecifications(apiSpecifications);
    }
  }, [(product as any).productOnlySpecifications, apiSpecifications]);

  const { addProductSpecification, isPending: addingSpecification } =
    useAddProductSpecification();
  const { updateProductSpecification, isPending: updatingSpecification } =
    useUpdateProductSpecification();
  const { deleteProductSpecification, isPending: deletingSpecification } =
    useDeleteProductSpecification();

  // Modal states for specifications
  const [showAddSpecModal, setShowAddSpecModal] = useState(false);
  const [showEditSpecModal, setShowEditSpecModal] = useState(false);
  const [showDeleteSpecModal, setShowDeleteSpecModal] = useState(false);
  const [newSpecName, setNewSpecName] = useState("");
  const [newSpecValue, setNewSpecValue] = useState("");
  const [editingSpec, setEditingSpec] = useState<ProductSpecification | null>(
    null
  );
  const [editSpecName, setEditSpecName] = useState("");
  const [editSpecValue, setEditSpecValue] = useState("");
  const [deletingSpecId, setDeletingSpecId] = useState<string | null>(null);

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
    } catch (error) {}
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

  // Product specification handlers
  const handleAddSpecification = async () => {
    if (!newSpecName.trim() || !newSpecValue.trim()) {
      toast.error("Lütfen özellik adı ve değerini giriniz");
      return;
    }

    try {
      await addProductSpecification(
        product.id,
        newSpecName.trim(),
        newSpecValue.trim()
      );

      // Add to local state immediately for UI update
      const newSpec: ProductSpecification = {
        $id: `temp_${Date.now()}`,
        id: `temp_${Date.now()}`,
        name: newSpecName.trim(),
        value: newSpecValue.trim(),
      };
      setLocalProductSpecifications((prev) => [...prev, newSpec]);

      setNewSpecName("");
      setNewSpecValue("");
      setShowAddSpecModal(false);
      toast.success("Özellik başarıyla eklendi");
    } catch (error) {
      toast.error("Özellik eklenirken bir hata oluştu");
    }
  };

  const handleEditSpecification = async () => {
    if (!editingSpec || !editSpecName.trim() || !editSpecValue.trim()) {
      toast.error("Lütfen özellik adı ve değerini giriniz");
      return;
    }

    try {
      await updateProductSpecification(
        editingSpec.id,
        editSpecName.trim(),
        editSpecValue.trim(),
        product.id
      );

      // Update local state immediately for UI update
      setLocalProductSpecifications((prev) =>
        prev.map((spec) =>
          spec.id === editingSpec.id
            ? {
                ...spec,
                name: editSpecName.trim(),
                value: editSpecValue.trim(),
              }
            : spec
        )
      );

      setEditingSpec(null);
      setEditSpecName("");
      setEditSpecValue("");
      setShowEditSpecModal(false);
      toast.success("Özellik başarıyla güncellendi");
    } catch (error) {
      toast.error("Özellik güncellenirken bir hata oluştu");
    }
  };

  const handleDeleteSpecification = async () => {
    if (!deletingSpecId) return;

    try {
      await deleteProductSpecification(deletingSpecId, product.id);

      // Remove from local state immediately for UI update
      setLocalProductSpecifications((prev) =>
        prev.filter((spec) => spec.id !== deletingSpecId)
      );

      setDeletingSpecId(null);
      setShowDeleteSpecModal(false);
      toast.success("Özellik başarıyla silindi");
    } catch (error) {
      toast.error("Özellik silinirken bir hata oluştu");
    }
  };

  const openEditSpecModal = (spec: ProductSpecification) => {
    setEditingSpec(spec);
    setEditSpecName(spec.name);
    setEditSpecValue(spec.value);
    setShowEditSpecModal(true);
  };

  const openDeleteSpecModal = (specId: string) => {
    setDeletingSpecId(specId);
    setShowDeleteSpecModal(true);
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
        <div className="col-md-4 mb-3 small">
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="isAvailableCheckbox"
              style={{ cursor: "pointer", width: "1em", height: "1em" }}
              checked={formData.isAvailable}
              onChange={(e) =>
                setFormData({ ...formData, isAvailable: e.target.checked })
              }
            />
            <label
              className="form-check-label fw-bold ml-3"
              htmlFor="isAvailableCheckbox"
            >
              Ürün Mevcut
            </label>
          </div>
          <small className="text-muted">
            Ürünün satışa açık olup olmadığını belirler
          </small>
        </div>

        <div className="col-md-4 mb-3 small">
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="isOutletCheckbox"
              style={{ cursor: "pointer", width: "1em", height: "1em" }}
              checked={formData.isOutlet}
              onChange={(e) =>
                setFormData({ ...formData, isOutlet: e.target.checked })
              }
            />
            <label
              className="form-check-label fw-bold ml-3"
              htmlFor="isOutletCheckbox"
            >
              Outlet Ürünü
            </label>
          </div>
          <small className="text-muted">
            Ürünün outlet kategorisinde gösterilip gösterilmeyeceğini belirler
          </small>
        </div>

        <div className="col-md-4 mb-3 small">
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="refundableCheckbox"
              style={{ cursor: "pointer", width: "1em", height: "1em" }}
              checked={formData.refundable}
              onChange={(e) =>
                setFormData({ ...formData, refundable: e.target.checked })
              }
            />
            <label
              className="form-check-label fw-bold ml-3"
              htmlFor="refundableCheckbox"
            >
              İade Edilebilir
            </label>
          </div>
          <small className="text-muted">
            Ürünün iade edilip edilemeyeceğini belirler
          </small>
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

      {/* Product Specifications Section */}
      <div className="form-group">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <label className="mb-0">Ürün Özellikleri:</label>
          <button
            type="button"
            className="btn btn-outline-primary btn-sm"
            onClick={() => setShowAddSpecModal(true)}
            disabled={addingSpecification}
          >
            <i className="bx bx-plus me-1"></i>
            Özellik Ekle
          </button>
        </div>

        {specificationsLoading ? (
          <div className="text-center py-3">
            <div className="spinner-border spinner-border-sm" role="status">
              <span className="visually-hidden">Yükleniyor...</span>
            </div>
          </div>
        ) : localProductSpecifications &&
          localProductSpecifications.length > 0 ? (
          <div className="table-responsive">
            <table className="table table-sm table-bordered">
              <thead>
                <tr style={{ textAlign: "center" }}>
                  <th>Özellik Adı</th>
                  <th>Değer</th>
                  <th style={{ width: "100px" }}>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {localProductSpecifications.map((spec: any) => (
                  <tr key={spec.id} style={{ textAlign: "center" }}>
                    <td style={{ fontSize: "0.85rem" }}>{spec.name}</td>
                    <td style={{ fontSize: "0.85rem" }}>{spec.value}</td>
                    <td>
                      <div className="d-flex">
                        <button
                          type="button"
                          className="ml-3 bg-dark text-white"
                          style={{
                            width: "40px",
                            height: "40px",
                            border: "none",
                          }}
                          onClick={() => openEditSpecModal(spec)}
                          disabled={updatingSpecification}
                          title="Düzenle"
                        >
                          <i className="bx bx-edit"></i>
                        </button>
                        <button
                          type="button"
                          className="ml-1 bg-danger text-white"
                          style={{
                            width: "40px",
                            height: "40px",
                            border: "none",
                          }}
                          onClick={() => openDeleteSpecModal(spec.id)}
                          disabled={deletingSpecification}
                          title="Sil"
                        >
                          <i className="bx bx-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-3 text-muted">
            <i className="bx bx-info-circle me-1"></i>
            Bu ürün için henüz özellik eklenmemiş
          </div>
        )}
      </div>

      {/* Add Specification Modal */}
      {showAddSpecModal && (
        <div
          className="modal show d-block"
          tabIndex={-1}
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Yeni Özellik Ekle</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowAddSpecModal(false);
                    setNewSpecName("");
                    setNewSpecValue("");
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Özellik Adı</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newSpecName}
                    onChange={(e) => setNewSpecName(e.target.value)}
                    placeholder="Örn: Renk, Boyut, Materyal"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Değer</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newSpecValue}
                    onChange={(e) => setNewSpecValue(e.target.value)}
                    placeholder="Örn: Kırmızı, Large, Pamuk"
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowAddSpecModal(false);
                    setNewSpecName("");
                    setNewSpecValue("");
                  }}
                >
                  İptal
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  disabled={addingSpecification}
                  onClick={handleAddSpecification}
                >
                  {addingSpecification ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-1"
                        role="status"
                      ></span>
                      Ekleniyor...
                    </>
                  ) : (
                    "Ekle"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Specification Modal */}
      {showEditSpecModal && editingSpec && (
        <div
          className="modal show d-block"
          tabIndex={-1}
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Özellik Düzenle</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowEditSpecModal(false);
                    setEditingSpec(null);
                    setEditSpecName("");
                    setEditSpecValue("");
                  }}
                ></button>
              </div>
              <div className="modal-body">
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
                  <label className="form-label">Değer</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editSpecValue}
                    onChange={(e) => setEditSpecValue(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowEditSpecModal(false);
                    setEditingSpec(null);
                    setEditSpecName("");
                    setEditSpecValue("");
                  }}
                >
                  İptal
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  disabled={updatingSpecification}
                  onClick={handleEditSpecification}
                >
                  {updatingSpecification ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-1"
                        role="status"
                      ></span>
                      Güncelleniyor...
                    </>
                  ) : (
                    "Güncelle"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Specification Modal */}
      {showDeleteSpecModal && (
        <div
          className="modal show d-block"
          tabIndex={-1}
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Özellik Sil</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowDeleteSpecModal(false);
                    setDeletingSpecId(null);
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  Bu özelliği silmek istediğinizden emin misiniz? Bu işlem geri
                  alınamaz.
                </p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowDeleteSpecModal(false);
                    setDeletingSpecId(null);
                  }}
                >
                  İptal
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleDeleteSpecification}
                  disabled={deletingSpecification}
                >
                  {deletingSpecification ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-1"
                        role="status"
                      ></span>
                      Siliniyor...
                    </>
                  ) : (
                    "Sil"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
