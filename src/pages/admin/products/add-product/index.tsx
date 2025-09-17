"use client";
import type { DtoProduct } from "@/constants/models/DtoProduct";
import {
  SpecificationOption,
  SubCategorySpecification,
} from "@/constants/models/SubCategorySpecification";
import { useCategories } from "@/hooks/services/categories/useCategories";
import { useAddProduct } from "@/hooks/services/products/useAddProduct";
import { useSubCategorySpecifications } from "@/hooks/services/sub-category-specifications/useSubCategorySpecifications";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import BackButton from "@/components/shared/BackButton";

const AddProductPage: React.FC = () => {
  const { addProduct, isPending } = useAddProduct();
  const { categories, isLoading: categoriesLoading } = useCategories();
  const router = useRouter();
  const [selectedMainCategoryId, setSelectedMainCategoryId] =
    useState<string>("");
  const [selectedSubCategoryId, setSelectedSubCategoryId] =
    useState<string>("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedContentImages, setSelectedContentImages] = useState<File[]>(
    []
  );
  const [selectedBannerImages, setSelectedBannerImages] = useState<File[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const { subCategorySpecifications, isLoading: specificationsLoading } =
    useSubCategorySpecifications(selectedSubCategoryId || null);

  // DtoProduct tipini genişlet
  interface ExtendedDtoProduct extends DtoProduct {
    specificationOptionIds?: string[];
    banner?: string[];
  }

  const [product, setProduct] = useState<ExtendedDtoProduct>({
    title: "",
    description: "",
    price: 0,
    stockCode: "",
    sellableQuantity: 0,
    barcodeNumber: "",
    baseImageUrl: "",
    subCategoryId: "",
    contentImageUrls: [],
    banner: [],
    videoUrl: "",
    isAvailable: true,
    isOutlet: false,
    createSEORequest: {
      Slug: "",
      Title: "",
      Description: "",
      MetaTitle: "",
      MetaDescription: "",
      Keywords: "",
      Canonical: "",
      RobotsMetaTag: "index,follow",
      Author: "Nors",
      Publisher: "Nors",
      Language: "tr",
      OgTitle: "",
      OgDescription: "",
      OgImageUrl: "",
      StructuredDataJson: "",
      IsIndexed: true,
      IsFollowed: true,
      ProductId: "",
      MainCategoryId: "",
      SubCategoryId: "",
    },
    refundable: true,
  });

  // Seçili özellikleri tutmak için state
  const [selectedSpecifications, setSelectedSpecifications] = useState<
    Record<string, string>
  >({});
  const [selectedSpecificationOptionIds, setSelectedSpecificationOptionIds] =
    useState<string[]>([]);

  // Add barcode validation state
  const [barcodeError, setBarcodeError] = useState<string | null>(null);

  // Slug oluşturma fonksiyonu
  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[\s\W-]+/g, "-") // Boşluk ve özel karakterleri tire ile değiştir
      .replace(/^-+|-+$/g, "") // Başındaki ve sonundaki tireleri kaldır
      .substring(0, 50); // Max 50 karakter
  };

  // Title değiştiğinde slug'ı otomatik güncelle
  const handleTitleChange = (newTitle: string) => {
    setProduct((prev) => ({
      ...prev,
      title: newTitle,
      createSEORequest: {
        ...prev.createSEORequest,
        Slug: `/products/${generateSlug(newTitle)}`,
        Title: newTitle,
        Description: newTitle
          ? `${newTitle} ürün detayları, özellikleri ve fiyat bilgileri.`
          : "",
        MetaTitle: newTitle ? `${newTitle} - Nors` : "",
        MetaDescription: newTitle
          ? `${newTitle} ürününü Nors'tan satın alın. Kaliteli ürün, uygun fiyat ve hızlı teslimat.`
          : "",
        Keywords: newTitle
          ? `${newTitle}, ürün satın al, online alışveriş, nors`
          : "",
        OgTitle: newTitle ? `${newTitle} - Nors` : "",
        OgDescription: newTitle
          ? `${newTitle} ürününü Nors'tan satın alın. Kaliteli ürün, uygun fiyat ve hızlı teslimat.`
          : "",
        Canonical: `/products/${generateSlug(newTitle)}`,
        RobotsMetaTag: prev.createSEORequest?.RobotsMetaTag || "index,follow",
        Author: "Nors",
        Publisher: "Nors",
        Language: "tr",
        IsIndexed: true,
        IsFollowed: true,
        ProductId: "",
        MainCategoryId: selectedMainCategoryId,
        SubCategoryId: selectedSubCategoryId,
      },
    }));
  };

  // Validate barcode number
  const validateBarcode = (value: string) => {
    // Remove any non-numeric characters
    const numericValue = value.replace(/\D/g, "");

    if (numericValue.length !== 13) {
      setBarcodeError("13 rakam gerekli");
      return numericValue;
    }

    setBarcodeError(null);
    return numericValue;
  };

  // Handle barcode input change
  const handleBarcodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numericValue = validateBarcode(e.target.value);
    setProduct({
      ...product,
      barcodeNumber: numericValue,
    });
  };

  // Seçili main kategoriyi bul
  const selectedMainCategory = useMemo(() => {
    if (!categories?.items) return null;
    return Object.values(categories.items).find(
      (cat) => cat.id === selectedMainCategoryId
    );
  }, [categories, selectedMainCategoryId]);

  // Alt kategorileri bul
  const subCategories = useMemo(() => {
    if (!selectedMainCategory?.subCategories) return [];
    return Object.values(selectedMainCategory.subCategories);
  }, [selectedMainCategory]);

  // Alt kategori seçildiğinde product state'ini güncelle
  useEffect(() => {
    setProduct((prev) => ({
      ...prev,
      subCategoryId: selectedSubCategoryId,
    }));
  }, [selectedSubCategoryId]);

  // Main kategori değiştiğinde sub kategori seçimini sıfırla
  useEffect(() => {
    setSelectedSubCategoryId("");
  }, [selectedMainCategoryId]);

  // Alt kategori değiştiğinde seçili özellikleri sıfırla
  useEffect(() => {
    setSelectedSpecifications({});
    setSelectedSpecificationOptionIds([]);
  }, [selectedSubCategoryId]);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      try {
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
        const imageUrl = URL.createObjectURL(file);
        setProduct((prev) => ({ ...prev, baseImageUrl: imageUrl }));
      } catch (error) {}
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
        const imageUrls = files.map((file) => URL.createObjectURL(file));
        setProduct((prev) => ({
          ...prev,
          contentImageUrls: [...prev.contentImageUrls, ...imageUrls],
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
        const imageUrls = files.map((file) => URL.createObjectURL(file));
        setProduct((prev) => ({
          ...prev,
          banner: [...(prev.banner || []), ...imageUrls],
        }));
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        }
      }
    }
  };
  const handleVideoSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    let uploadedVideoUrl = "";

    if (selectedVideo) {
      const videoFormData = new FormData();
      videoFormData.append("file", selectedVideo);
      videoFormData.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_NAME || ""
      );

      const videoResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload`,
        { method: "POST", body: videoFormData }
      );

      if (!videoResponse.ok) throw new Error("Video yüklenemedi");
      const videoData = await videoResponse.json();
      uploadedVideoUrl = videoData.secure_url;

      // OPTIONAL: preview için güncelle
      setProduct((prev) => ({ ...prev, videoUrl: uploadedVideoUrl }));
    }
  };
  const removeContentImage = (index: number) => {
    setSelectedContentImages((prev) => prev.filter((_, i) => i !== index));
    setProduct((prev) => ({
      ...prev,
      contentImageUrls: prev.contentImageUrls.filter((_, i) => i !== index),
    }));
  };

  const removeBannerImage = (index: number) => {
    setSelectedBannerImages((prev) => prev.filter((_, i) => i !== index));
    setProduct((prev) => ({
      ...prev,
      banner: prev.banner?.filter((_, i) => i !== index),
    }));
  };

  // Spesifikasyon seçildiğinde option ID'sini de kaydet
  const handleSpecificationChange = (
    specId: string,
    optionValue: string,
    optionId: string
  ) => {
    setSelectedSpecifications({
      ...selectedSpecifications,
      [specId]: optionValue,
    });

    // Eğer bu spesifikasyon için daha önce bir seçim yapıldıysa, onu kaldır
    const updatedOptionIds = selectedSpecificationOptionIds.filter((id) => {
      if (!subCategorySpecifications) return true;

      return !subCategorySpecifications.some(
        (spec: SubCategorySpecification) =>
          spec.id === specId &&
          spec.specificationOptions.some(
            (opt: SpecificationOption) => opt.id === id
          )
      );
    });

    // Yeni seçilen option ID'sini ekle
    setSelectedSpecificationOptionIds([...updatedOptionIds, optionId]);
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (isSubmitting) return; // Çift tıklamayı engelle
    setIsSubmitting(true);

    if (!selectedImage) {
      toast.error("Lütfen bir ana resim seçin");
      setIsSubmitting(false);
      return;
    }

    // Validate barcode before submission
    if (
      product.barcodeNumber.length !== 13 ||
      !/^\d{13}$/.test(product.barcodeNumber)
    ) {
      setBarcodeError("13 rakam gerekli");
      toast.error("Geçerli bir barkod giriniz (13 rakam)");
      return;
    }

    try {
      // Ana resmi yükle
      const formData = new FormData();
      formData.append("file", selectedImage);
      formData.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_NAME || ""
      );

      const mainImageResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!mainImageResponse.ok) {
        throw new Error("Ana resim yüklenemedi");
      }

      const mainImageData = await mainImageResponse.json();

      // İçerik resimlerini yükle
      const contentImageUrls = await Promise.all(
        selectedContentImages.map(async (file) => {
          const contentFormData = new FormData();
          contentFormData.append("file", file);
          contentFormData.append(
            "upload_preset",
            process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_NAME || ""
          );

          const response = await fetch(
            `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
            {
              method: "POST",
              body: contentFormData,
            }
          );

          if (!response.ok) {
            throw new Error("İçerik resmi yüklenemedi");
          }

          const data = await response.json();
          return data.secure_url;
        })
      );
      const bannerImageUrls = await Promise.all(
        selectedBannerImages.map(async (file) => {
          const bannerFormData = new FormData();
          bannerFormData.append("file", file);
          bannerFormData.append(
            "upload_preset",
            process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_NAME || ""
          );

          const response = await fetch(
            `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
            {
              method: "POST",
              body: bannerFormData,
            }
          );

          if (!response.ok) {
            throw new Error("Banner resmi yüklenemedi");
          }

          const data = await response.json();
          return data.secure_url;
        })
      );
      let uploadedVideoUrl = "";
      if (selectedVideo) {
        const videoFormData = new FormData();
        videoFormData.append("file", selectedVideo);
        videoFormData.append(
          "upload_preset",
          process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_NAME || ""
        );

        const videoResponse = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload`,
          { method: "POST", body: videoFormData }
        );

        if (!videoResponse.ok) throw new Error("Video yüklenemedi");
        const videoData = await videoResponse.json();
        uploadedVideoUrl = videoData.secure_url;
      }

      // SEO verilerini tamamla
      const completeCreateSEORequest = {
        ...product.createSEORequest,
        Slug:
          product.createSEORequest?.Slug ||
          `/products/${generateSlug(product.title)}`,
        Title: product.createSEORequest?.Title || product.title,
        Description:
          product.createSEORequest?.Description ||
          `${product.title} ürün detayları, özellikleri ve fiyat bilgileri.`,
        MetaTitle:
          product.createSEORequest?.MetaTitle || `${product.title} - Nors`,
        MetaDescription:
          product.createSEORequest?.MetaDescription ||
          `${product.title} ürününü Nors'tan satın alın. Kaliteli ürün, uygun fiyat ve hızlı teslimat.`,
        Keywords:
          product.createSEORequest?.Keywords ||
          `${product.title}, ürün satın al, online alışveriş, nors`,
        Canonical:
          product.createSEORequest?.Canonical ||
          `https://nors.com/products/${generateSlug(product.title)}`,
        RobotsMetaTag:
          product.createSEORequest?.RobotsMetaTag || "index,follow",
        Author: product.createSEORequest?.Author || "Nors",
        Publisher: product.createSEORequest?.Publisher || "Nors",
        Language: product.createSEORequest?.Language || "tr",
        OgTitle: product.createSEORequest?.OgTitle || `${product.title} - Nors`,
        OgDescription:
          product.createSEORequest?.OgDescription ||
          `${product.title} ürününü Nors'tan satın alın. Kaliteli ürün, uygun fiyat ve hızlı teslimat.`,
        OgImageUrl:
          product.createSEORequest?.OgImageUrl || mainImageData.secure_url,
        StructuredDataJson: product.createSEORequest?.StructuredDataJson || "",
        IsIndexed: product.createSEORequest?.IsIndexed ?? true,
        IsFollowed: product.createSEORequest?.IsFollowed ?? true,
        ProductId: "", // Bu backend tarafında doldurulacak
        MainCategoryId: selectedMainCategoryId,
        SubCategoryId: selectedSubCategoryId,
      };

      // Ürünü ekle
      await addProduct({
        ...product,
        baseImageUrl: mainImageData.secure_url,
        contentImageUrls: contentImageUrls,
        banner: bannerImageUrls,
        videoUrl: uploadedVideoUrl,
        createSEORequest: completeCreateSEORequest,
        createProductOnlySpecificationRequests: Object.entries(
          selectedSpecifications
        ).map(([specId, optionValue]) => ({
          name: specId,
          value: optionValue,
        })),
        specificationOptionIds: selectedSpecificationOptionIds,
      });
      router.push("/admin/products");
    } catch (error) {
      toast.error("Resimler yüklenirken bir hata oluştu");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="">
      <BackButton className="mb-3 mt-3 col-1" href="/admin/products" />

      <div className="row">
        <div className="col-12">
          <div className="card shadow-sm p-3">
            <div className="card-header py-2">
              <h5
                className="card-title mb-0"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.1rem",
                }}
              >
                Yeni Ürün Ekle
              </h5>
            </div>
            <div className="card-body p-3">
              <form onSubmit={handleSubmit}>
                <div className="row g-2">
                  {/* Kategoriler */}
                  <div className="col-md-6 mb-2">
                    <div className="form-group">
                      <label className="form-label small">Ana Kategori</label>
                      <select
                        className="form-select form-select-sm"
                        value={selectedMainCategoryId}
                        onChange={(e) =>
                          setSelectedMainCategoryId(e.target.value)
                        }
                        disabled={categoriesLoading}
                        required
                      >
                        <option value="">Ana Kategori Seçin</option>
                        {categories?.items &&
                          categories.items.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>

                  <div className="col-md-6 mb-2">
                    <div className="form-group">
                      <label className="form-label small">Alt Kategori</label>
                      <select
                        className="form-select form-select-sm"
                        value={selectedSubCategoryId}
                        onChange={(e) =>
                          setSelectedSubCategoryId(e.target.value)
                        }
                        disabled={!selectedMainCategoryId}
                        required
                      >
                        <option value="">Alt Kategori Seçin</option>
                        {subCategories.map((subCategory) => (
                          <option key={subCategory.id} value={subCategory.id}>
                            {subCategory.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Temel Bilgiler */}
                  <div className="col-md-6 mb-2">
                    <div className="form-group">
                      <label className="form-label small">Başlık</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        value={product.title}
                        onChange={(e) => handleTitleChange(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="col-md-6 mb-2">
                    <div className="form-group">
                      <label className="form-label small">
                        Barkod Numarası
                      </label>
                      <input
                        type="text"
                        className={`form-control form-control-sm ${
                          barcodeError ? "is-invalid" : ""
                        }`}
                        value={product.barcodeNumber}
                        onChange={handleBarcodeChange}
                        maxLength={13}
                        pattern="[0-9]{13}"
                        inputMode="numeric"
                        placeholder="13 haneli barkod numarası"
                        required
                      />
                      {barcodeError && (
                        <div className="invalid-feedback">{barcodeError}</div>
                      )}
                      <small className="form-text text-muted">
                        13 haneli rakam olmalıdır
                      </small>
                    </div>
                  </div>

                  <div className="col-md-6 mb-2">
                    <div className="form-group">
                      <label className="form-label small">Fiyat</label>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        value={product.price}
                        onChange={(e) =>
                          setProduct({
                            ...product,
                            price: Number(e.target.value),
                          })
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="col-md-6 mb-2">
                    <div className="form-group">
                      <label className="form-label small">Stok Miktarı</label>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        value={product.sellableQuantity}
                        onChange={(e) =>
                          setProduct({
                            ...product,
                            sellableQuantity: Number(e.target.value),
                          })
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="col-12 mb-2">
                    <div className="form-group">
                      <label className="form-label small">Açıklama</label>
                      <textarea
                        className="form-control form-control-sm"
                        rows={3}
                        value={product.description}
                        onChange={(e) =>
                          setProduct({
                            ...product,
                            description: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>

                  {/* Alt Kategori Özellikleri */}
                  {selectedSubCategoryId &&
                    subCategorySpecifications &&
                    subCategorySpecifications.length > 0 && (
                      <div className="col-12 mb-3">
                        <div className="card border p-4">
                          <div className="card-header bg-light">
                            <h6 className="mb-0">Ürün Özellikleri</h6>
                          </div>
                          <div className="card-body">
                            {specificationsLoading ? (
                              <div className="text-center py-3">
                                <div
                                  className="spinner-border spinner-border-sm text-primary"
                                  role="status"
                                >
                                  <span className="visually-hidden">
                                    Yükleniyor...
                                  </span>
                                </div>
                                <p className="mt-2 small">
                                  Özellikler yükleniyor...
                                </p>
                              </div>
                            ) : (
                              <div className="row g-2">
                                {subCategorySpecifications.map(
                                  (spec: SubCategorySpecification) => (
                                    <div
                                      key={spec.id}
                                      className="col-md-6 mb-2"
                                    >
                                      <label className="form-label small fw-bold">
                                        {spec.name}
                                      </label>
                                      <div className="d-flex flex-wrap gap-1 mt-1">
                                        {spec.specificationOptions.map(
                                          (option: SpecificationOption) => (
                                            <button
                                              key={option.id}
                                              type="button"
                                              className={`btn btn-sm ${
                                                selectedSpecifications[
                                                  spec.id
                                                ] === option.value
                                                  ? "btn-secondary"
                                                  : "btn-outline-secondary"
                                              }`}
                                              onClick={() =>
                                                handleSpecificationChange(
                                                  spec.id,
                                                  option.value,
                                                  option.id
                                                )
                                              }
                                            >
                                              {option.value}
                                            </button>
                                          )
                                        )}
                                      </div>
                                    </div>
                                  )
                                )}
                                <div className="col-12 mt-2">
                                  <div className="alert alert-warning fs-6 py-2 d-flex align-items-center">
                                    <i className="bx bx-info-circle me-1"></i>
                                    Özellik seçilmediği takdirde ürününüz, o
                                    özelliğin filtrelemesinde
                                    görüntülenmeyecektir.
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                  {/* Resimler */}
                  <div className="col-12">
                    <div className="row g-2">
                      <div className="col-md-4 mb-2">
                        <div className="form-group">
                          <label className="form-label small">Ana Resim</label>
                          <input
                            type="file"
                            className="form-control form-control-sm"
                            accept="image/png,image/jpeg,image/jpg"
                            onChange={handleImageSelect}
                          />
                          {product.baseImageUrl && (
                            <div className="image-preview mt-1">
                              <div className="position-relative d-inline-block">
                                <Image
                                  width={80}
                                  height={80}
                                  src={product.baseImageUrl}
                                  alt="Product"
                                  style={{ objectFit: "cover" }}
                                  className="rounded"
                                />
                                <button
                                  type="button"
                                  className="btn btn-sm btn-danger position-absolute top-0 end-0 p-0"
                                  style={{
                                    width: "20px",
                                    height: "20px",
                                    fontSize: "10px",
                                  }}
                                  onClick={() => {
                                    setSelectedImage(null);
                                    setProduct((prev) => ({
                                      ...prev,
                                      baseImageUrl: "",
                                    }));
                                  }}
                                >
                                  <i className="bx bx-x"></i>
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="col-md-4 mb-2">
                        <div className="form-group">
                          <label className="form-label small">
                            İçerik Resimleri
                          </label>
                          <input
                            type="file"
                            className="form-control form-control-sm"
                            accept="image/png,image/jpeg,image/jpg"
                            onChange={handleContentImagesSelect}
                            multiple
                          />
                          <div className="d-flex gap-1 flex-wrap mt-1">
                            {product.contentImageUrls.map((url, index) => (
                              <div
                                key={index}
                                className="position-relative d-inline-block"
                              >
                                <Image
                                  width={80}
                                  height={80}
                                  src={url}
                                  alt={`Content ${index + 1}`}
                                  style={{ objectFit: "cover" }}
                                  className="rounded"
                                />
                                <button
                                  type="button"
                                  className="btn btn-sm btn-danger position-absolute top-0 end-0 p-0"
                                  style={{
                                    width: "20px",
                                    height: "20px",
                                    fontSize: "10px",
                                  }}
                                  onClick={() => removeContentImage(index)}
                                >
                                  <i className="bx bx-x"></i>
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="col-md-4 mb-2">
                        <div className="form-group">
                          <label className="form-label small">
                            Banner Resimleri
                          </label>
                          <input
                            type="file"
                            className="form-control form-control-sm"
                            accept="image/png,image/jpeg,image/jpg"
                            onChange={handleBannerImagesSelect}
                            multiple
                          />
                          <div className="d-flex gap-1 flex-wrap mt-1">
                            {product.banner?.map((url, index) => (
                              <div
                                key={index}
                                className="position-relative d-inline-block"
                              >
                                <Image
                                  width={80}
                                  height={80}
                                  src={url}
                                  alt={`Banner ${index + 1}`}
                                  style={{ objectFit: "cover" }}
                                  className="rounded"
                                />
                                <button
                                  type="button"
                                  className="btn btn-sm btn-danger position-absolute top-0 end-0 p-0"
                                  style={{
                                    width: "20px",
                                    height: "20px",
                                    fontSize: "10px",
                                  }}
                                  onClick={() => removeBannerImage(index)}
                                >
                                  <i className="bx bx-x"></i>
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="col-4 mb-2 ">
                        <div className="form-group">
                          <label className="form-label small">
                            Ürün Videosu
                          </label>
                          <input
                            type="file"
                            className="form-control form-control-sm"
                            accept="video/mp4,video/webm,video/ogg"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              if (file.size > 100_000_000) {
                                toast.error(
                                  "Video dosyası çok büyük (max 100MB)"
                                );
                                return;
                              }
                              setSelectedVideo(file);
                            }}
                          />
                          <small className="form-text text-muted">
                            MP4, WebM veya OGG formatında
                          </small>
                        </div>

                        {/* Video önizleme */}
                        {product.videoUrl && (
                          <div className="mt-2">
                            <label className="form-label small mb-1">
                              Video Önizleme
                            </label>
                            <div className="border rounded p-2">
                              <video
                                src={product.videoUrl}
                                controls
                                className="w-100"
                                style={{
                                  maxHeight: "200px",
                                  borderRadius: "4px",
                                }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                      {/* İade Edilebilir Seçeneği */}
                      <div
                        className="col-md-3 mb-2 small "
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <div className="form-group">
                          <div className="form-check">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              id="refundable"
                              checked={product.refundable}
                              onChange={(e) =>
                                setProduct({
                                  ...product,
                                  refundable: e.target.checked,
                                })
                              }
                            />
                            <label
                              className="form-check-label small"
                              htmlFor="refundable"
                            >
                              İade Edilebilir
                            </label>
                          </div>
                          <small className="form-text text-muted">
                            Bu ürünün iade edilebilir olup olmadığını belirler
                          </small>
                        </div>
                      </div>

                      {/* Mevcut Durumu */}
                      <div
                        className="col-md-3 mb-2 small"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <div className="form-group">
                          <div className="form-check">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              id="isAvailable"
                              checked={product.isAvailable}
                              onChange={(e) =>
                                setProduct({
                                  ...product,
                                  isAvailable: e.target.checked,
                                })
                              }
                            />
                            <label
                              className="form-check-label small"
                              htmlFor="isAvailable"
                            >
                              Satışa Uygun
                            </label>
                          </div>
                          <small className="form-text text-muted">
                            Ürünün satışa uygun olup olmadığını belirler
                          </small>
                        </div>
                      </div>

                      {/* Outlet Seçeneği */}
                      <div
                        className="col-md-2 mb-2 small"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <div className="form-group">
                          <div className="form-check">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              id="isOutlet"
                              checked={product.isOutlet}
                              onChange={(e) =>
                                setProduct({
                                  ...product,
                                  isOutlet: e.target.checked,
                                })
                              }
                            />
                            <label
                              className="form-check-label small"
                              htmlFor="isOutlet"
                            >
                              Outlet Ürün
                            </label>
                          </div>
                          <small className="form-text text-muted">
                            Ürünün outlet olup olmadığını belirler
                          </small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-end mt-3">
                  <button
                    type="submit"
                    className="btn btn-primary btn-sm"
                    disabled={isPending || isSubmitting}
                  >
                    {isPending || isSubmitting ? "Ekleniyor..." : "Ürün Ekle"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .form-label {
          margin-bottom: 0.25rem;
          font-weight: 500;
        }
        .image-preview {
          margin-top: 0.25rem;
        }
        .form-control,
        .form-select {
          font-size: 0.875rem;
          padding: 0.375rem 0.75rem;
        }
        .form-text {
          font-size: 0.7rem;
        }
        .invalid-feedback {
          font-size: 0.7rem;
          margin-top: 0.1rem;
        }
      `}</style>
    </div>
  );
};

export default AddProductPage;
