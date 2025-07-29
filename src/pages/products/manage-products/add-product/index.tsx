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
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

const AddProductPage: React.FC = () => {
  const { addProduct, isPending } = useAddProduct();
  const { categories, isLoading: categoriesLoading } = useCategories();

  const [selectedMainCategoryId, setSelectedMainCategoryId] =
    useState<string>("");
  const [selectedSubCategoryId, setSelectedSubCategoryId] =
    useState<string>("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedContentImages, setSelectedContentImages] = useState<File[]>(
    []
  );
  const [selectedBannerImages, setSelectedBannerImages] = useState<File[]>([]);
  const { subCategorySpecifications, isLoading: specificationsLoading } =
    useSubCategorySpecifications(selectedSubCategoryId || null);

  // DtoProduct tipini genişlet
  interface ExtendedDtoProduct extends DtoProduct {
    specificationOptionIds?: string[];
    banner?: string[];
    priceStr: string;
    sellableQuantityStr: string;
    isAvailable: boolean;
    specifications?: Record<string, string>;
  }
  const router = useRouter();

  // Sayısal değerler için string tipinde state kullanıyoruz
  const [product, setProduct] = useState<ExtendedDtoProduct>({
    title: "",
    description: "",
    price: 0,
    priceStr: "", // String olarak fiyat
    stockCode: "",
    sellableQuantity: 0,
    sellableQuantityStr: "", // String olarak stok miktarı
    barcodeNumber: "",
    baseImageUrl: "",
    subCategoryId: "",
    contentImageUrls: [],
    banner: [], // Banner görselleri için boş dizi
    isAvailable: true,
  });

  const [selectedSpecifications, setSelectedSpecifications] = useState<
    Record<string, string>
  >({});
  const [selectedSpecificationOptionIds, setSelectedSpecificationOptionIds] =
    useState<string[]>([]);

  // Seçili main kategoriyi bul
  const selectedMainCategory = useMemo(() => {
    if (!categories?.items) return null;
    return categories.items.find((cat) => cat.id === selectedMainCategoryId);
  }, [categories, selectedMainCategoryId]);

  // Alt kategorileri bul
  const subCategories = useMemo(() => {
    if (!selectedMainCategory?.subCategories) return [];
    return selectedMainCategory.subCategories;
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
  }, [selectedSubCategoryId]);

  // Fiyat değişikliğini işle
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Boş değer veya sayısal değer kontrolü
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      // String olarak kaydet
      setProduct((prev) => ({
        ...prev,
        priceStr: value,
        // Sayısal değer olarak da kaydet (boşsa 0)
        price: value === "" ? 0 : parseFloat(value),
      }));
    }
  };

  // Stok miktarı değişikliğini işle
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Boş değer veya tam sayı kontrolü
    if (value === "" || /^\d*$/.test(value)) {
      // String olarak kaydet
      setProduct((prev) => ({
        ...prev,
        sellableQuantityStr: value,
        // Sayısal değer olarak da kaydet (boşsa 0)
        sellableQuantity: value === "" ? 0 : parseInt(value),
      }));
    }
  };

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
      } catch (error) {
        console.log(error);
      }
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

  const removeContentImage = (index: number) => {
    setSelectedContentImages((prev) => prev.filter((_, i) => i !== index));
    setProduct((prev) => ({
      ...prev,
      contentImageUrls: prev.contentImageUrls.filter((_, i) => i !== index),
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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!selectedImage) {
      toast.error("Lütfen bir ana resim seçin");
      return;
    }

    // Fiyat ve stok miktarı kontrolü
    if (product.price <= 0) {
      toast.error("Lütfen geçerli bir fiyat girin");
      return;
    }

    if (product.sellableQuantity <= 0) {
      toast.error("Lütfen geçerli bir stok miktarı girin");
      return;
    }

    // Alt kategori özelliklerinin seçilip seçilmediğini kontrol et
    // if (subCategorySpecifications && subCategorySpecifications.length > 0) {
    //   const missingSpecifications = subCategorySpecifications.filter(
    //     (spec) => !selectedSpecifications[spec.id]
    //   );

    //   if (missingSpecifications.length > 0) {
    //     const missingSpecNames = missingSpecifications
    //       .map((spec) => spec.name)
    //       .join(", ");
    //     toast.error(`Lütfen tüm özellikleri seçin: ${missingSpecNames}`);
    //     return;
    //   }
    // }

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

      // Banner resimlerini yükle
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

      // Ürünü ekle
      const productToAdd: ExtendedDtoProduct = {
        ...product,
        baseImageUrl: mainImageData.secure_url,
        contentImageUrls: contentImageUrls,
        banner: bannerImageUrls,
        specifications: selectedSpecifications,
        specificationOptionIds: selectedSpecificationOptionIds,
      };

      await addProduct(productToAdd);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Resimler yüklenirken bir hata oluştu");
    }
  };

  // Tüm gerekli spesifikasyonların seçilip seçilmediğini kontrol et
  const areAllSpecificationsSelected = useMemo(() => {
    if (!subCategorySpecifications || subCategorySpecifications.length === 0) {
      return true;
    }

    return subCategorySpecifications.every(
      (spec: SubCategorySpecification) => selectedSpecifications[spec.id]
    );
  }, [subCategorySpecifications, selectedSpecifications]);

  // Form geçerliliğini kontrol et
  const isFormValid = useMemo(() => {
    return (
      product.title &&
      product.description &&
      product.price > 0 &&
      product.sellableQuantity > 0 &&
      product.barcodeNumber &&
      selectedSubCategoryId &&
      selectedImage
    );
  }, [product, selectedSubCategoryId, selectedImage]);

  // Banner görselleri için handler fonksiyonu
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

  // Banner görseli silme fonksiyonu
  const removeBannerImage = (index: number) => {
    setSelectedBannerImages((prev) => prev.filter((_, i) => i !== index));
    setProduct((prev) => ({
      ...prev,
      banner: prev.banner?.filter((_, i) => i !== index) || [],
    }));
  };

  return (
    <main className="main" style={{ backgroundColor: "#f8f9fa" }}>
      <div
        className="page-header text-center"
        style={{ backgroundImage: "url(/assets/images/page-header-bg.jpg)" }}
      >
        <div className="container">
          <h1 className="page-title">
            Ürün Ekle<span>Mağaza</span>
          </h1>
        </div>
      </div>

      <div className="page-content">
        <div className="container">
          <form onSubmit={handleSubmit} className="mb-5">
            {/* Kategori Seçimi Kartı */}
            <div className="card shadow-sm border-0 mb-4">
              <div className="card-header bg-primary text-white">
                <h4 className="m-4 text-white">Kategori Bilgileri</h4>
              </div>
              <div className="card-body p-4">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold">Ana Kategori</label>
                    <select
                      className="form-select form-control"
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
                    {categoriesLoading && (
                      <div
                        className="spinner-border spinner-border-sm text-primary mt-2"
                        role="status"
                      >
                        <span className="visually-hidden">Yükleniyor...</span>
                      </div>
                    )}
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold">Alt Kategori</label>
                    <select
                      className="form-select form-control"
                      value={selectedSubCategoryId}
                      onChange={(e) => setSelectedSubCategoryId(e.target.value)}
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
                    {!selectedMainCategoryId && (
                      <small className="text-muted">
                        Önce ana kategori seçmelisiniz
                      </small>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Ürün Bilgileri Kartı */}
            <div className="card shadow-sm border-0 mb-4">
              <div className="card-header bg-primary text-white">
                <h4 className="m-4 text-white">Ürün Bilgileri</h4>
              </div>
              <div className="card-body p-4">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold">Ürün Adı</label>
                    <input
                      type="text"
                      className="form-control"
                      value={product.title}
                      onChange={(e) =>
                        setProduct({ ...product, title: e.target.value })
                      }
                      placeholder="Ürün adını girin"
                      required
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold">Fiyat (₺)</label>
                    <div className="input-group">
                      <span className="input-group-text">₺</span>
                      <input
                        type="text"
                        className="form-control"
                        value={product.priceStr}
                        onChange={handlePriceChange}
                        placeholder="0.00"
                        required
                      />
                    </div>
                    <small className="text-muted">Örnek: 149.99</small>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold">
                      Barkod Numarası
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={product.barcodeNumber}
                      onChange={(e) => {
                        const value = e.target.value;
                        // Sadece rakam girişine izin ver
                        if (!/^\d*$/.test(value)) return;
                        // Maksimum 13 karakter
                        if (value.length > 13) return;
                        setProduct({
                          ...product,
                          barcodeNumber: value,
                        });
                      }}
                      maxLength={13}
                      placeholder="Barkod numarasını girin"
                      required
                    />
                    {product.barcodeNumber.length > 0 &&
                      product.barcodeNumber.length < 13 && (
                        <small className="text-danger">
                          Barkod numarası 13 karakter olmalıdır.{" "}
                          {13 - product.barcodeNumber.length} karakter daha
                          giriniz.
                        </small>
                      )}
                    {product.barcodeNumber.length === 0 && (
                      <small className="text-muted">
                        Lütfen 13 haneli barkod numarası giriniz
                      </small>
                    )}
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold">Stok Miktarı</label>
                    <input
                      type="text"
                      className="form-control"
                      value={product.sellableQuantityStr}
                      onChange={handleQuantityChange}
                      placeholder="Stok miktarını girin"
                      required
                    />
                    <small className="text-muted">
                      Sadece tam sayı giriniz
                    </small>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold">Ürün Açıklaması</label>
                  <textarea
                    className="form-control"
                    value={product.description}
                    onChange={(e) =>
                      setProduct({ ...product, description: e.target.value })
                    }
                    rows={4}
                    placeholder="Ürün açıklamasını girin"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Ürün Görselleri Kartı */}
            <div className="card shadow-sm border-0 mb-4">
              <div className="card-header bg-primary text-white">
                <h4 className="m-4 text-white">Ürün Görselleri</h4>
              </div>
              <div className="card-body p-4">
                <div className="mb-4">
                  <label className="form-label fw-bold">Ana Görsel</label>
                  <div className="row">
                    <div className="col-md-12">
                      <div className="input-group">
                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/jpg"
                          className="form-control"
                          onChange={handleImageSelect}
                          id="mainImageInput"
                        />
                      </div>
                      <small className="text-muted">
                        Maksimum 10MB, JPG, JPEG veya PNG formatında
                      </small>
                    </div>
                  </div>

                  {product.baseImageUrl && (
                    <div className="row mt-3">
                      <div className="col-md-4">
                        <div
                          className="position-relative"
                          style={{ width: "120px", height: "120px" }}
                        >
                          <Image
                            width={120}
                            height={120}
                            src={product.baseImageUrl}
                            alt="Ana Görsel"
                            className="img-thumbnail"
                            style={{ objectFit: "cover" }}
                          />
                          <button
                            type="button"
                            className="btn-danger position-absolute"
                            style={{
                              top: "2px",
                              right: "2px",
                              width: "20px",
                              height: "20px",
                              padding: 0,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              borderRadius: "3px",
                              fontSize: "10px",
                              lineHeight: 1,
                              zIndex: 10,
                            }}
                            onClick={() => {
                              setSelectedImage(null);
                              setProduct((prev) => ({
                                ...prev,
                                baseImageUrl: "",
                              }));
                            }}
                          >
                            <i className="icon-close"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <label className="form-label fw-bold">
                    İçerik Görselleri
                  </label>
                  <div className="row">
                    <div className="col-md-12 ">
                      <div className="input-group">
                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/jpg"
                          className="form-control"
                          onChange={handleContentImagesSelect}
                          multiple
                          id="contentImagesInput"
                        />
                      </div>
                      <small className="text-muted d-block mb-3">
                        Birden fazla görsel seçebilirsiniz. Maksimum 10MB, JPG,
                        JPEG veya PNG formatında
                      </small>
                    </div>
                  </div>

                  {product.contentImageUrls.length > 0 && (
                    <div className="row g-2 mt-2">
                      {product.contentImageUrls.map((url, index) => (
                        <div
                          key={index}
                          className="col-6 col-sm-4 col-md-3 col-lg-2"
                        >
                          <div
                            className="position-relative"
                            style={{ height: "150px" }}
                          >
                            <Image
                              width={150}
                              height={150}
                              src={url}
                              alt={`İçerik ${index + 1}`}
                              className="img-thumbnail"
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                            />
                            <button
                              type="button"
                              className="btn-danger position-absolute"
                              style={{
                                top: "2px",
                                right: "2px",
                                width: "20px",
                                height: "20px",
                                padding: 0,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                borderRadius: "3px",
                                fontSize: "10px",
                                lineHeight: 1,
                                zIndex: 10,
                              }}
                              onClick={() => removeContentImage(index)}
                            >
                              <i className="icon-close"></i>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="form-label fw-bold">
                    Banner Görselleri
                  </label>
                  <div className="row">
                    <div className="col-md-12">
                      <div className="input-group">
                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/jpg"
                          className="form-control"
                          onChange={handleBannerImagesSelect}
                          multiple
                          id="bannerImagesInput"
                        />
                      </div>
                      <small className="text-muted d-block mb-3">
                        Banner görselleri ürün sayfasında slider olarak
                        gösterilir. Maksimum 10MB, JPG, JPEG veya PNG formatında
                      </small>
                    </div>
                  </div>

                  {product.banner && product.banner.length > 0 && (
                    <div className="row g-2 mt-2">
                      {product.banner.map((url, index) => (
                        <div
                          key={index}
                          className="col-6 col-sm-4 col-md-3 col-lg-2"
                        >
                          <div
                            className="position-relative"
                            style={{ height: "150px" }}
                          >
                            <Image
                              width={150}
                              height={150}
                              src={url}
                              alt={`Banner ${index + 1}`}
                              className="img-thumbnail"
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                            />
                            <button
                              type="button"
                              className="btn-danger position-absolute"
                              style={{
                                top: "2px",
                                right: "2px",
                                width: "20px",
                                height: "20px",
                                padding: 0,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                borderRadius: "3px",
                                fontSize: "10px",
                                lineHeight: 1,
                                zIndex: 10,
                              }}
                              onClick={() => removeBannerImage(index)}
                            >
                              <i className="icon-close"></i>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Alt Kategori Özellikleri Kartı */}
            {selectedSubCategoryId &&
              subCategorySpecifications &&
              subCategorySpecifications.length > 0 && (
                <div className="card shadow-sm border-0 mb-4">
                  <div className="card-header bg-primary text-white">
                    <h4 className="mb-0 p-4 text-white">Ürün Özellikleri</h4>
                  </div>
                  <div className="card-body p-4">
                    {specificationsLoading ? (
                      <div className="text-center py-4">
                        <div
                          className="spinner-border text-primary"
                          role="status"
                        >
                          <span className="visually-hidden">Yükleniyor...</span>
                        </div>
                        <p className="mt-2">Özellikler yükleniyor...</p>
                      </div>
                    ) : (
                      <div className="row">
                        {subCategorySpecifications.map((spec) => (
                          <div key={spec.id} className="col-md-6 mb-4">
                            <label className="form-label fw-bold">
                              {spec.name}
                            </label>
                            <div className="option-buttons mt-2">
                              {spec.specificationOptions.map(
                                (option, index) => (
                                  <button
                                    key={index}
                                    type="button"
                                    className={`btn ${
                                      selectedSpecifications[spec.id] ===
                                      option.value
                                        ? "btn-outline-secondary active"
                                        : "btn-outline-secondary"
                                    } me-2 mb-2`}
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
                        ))}
                        <div className="text-danger d-flex justify-content-center align-items-center w-100 large font-italic">
                          <i
                            style={{ fontSize: "2rem" }}
                            className="icon-exclamation-circle mr-2"
                          ></i>
                          Herhangi bir özellik seçilmediği taktirde ürününüz, o
                          özelliğin filtrelemesine tabi tutulamaz!
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

            {/* Gönder Butonu */}
            <div className="d-flex justify-content-end">
              <button
                type="submit"
                className="btn btn-primary btn-lg px-5"
                disabled={isPending || !isFormValid}
                onClick={async (e) => {
                  e.preventDefault();
                  try {
                    await handleSubmit(e);
                    router.push("/products/manage-products");
                  } catch (error) {
                    console.error("Ürün ekleme hatası:", error);
                    toast.error("Ürün eklenirken bir hata oluştu");
                  }
                }}
              >
                {isPending ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Ürün Ekleniyor...
                  </>
                ) : (
                  <>
                    <i className="icon-check me-2"></i>
                    Ürünü Ekle
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default AddProductPage;
