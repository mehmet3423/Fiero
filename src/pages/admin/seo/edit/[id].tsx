import { useGetSeoById } from "@/hooks/services/admin-seo/useGetSeoById";
import { useUpdateSeo } from "@/hooks/services/admin-seo/useUpdateSeo";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useMainCategoriesWithSubCategories } from "@/hooks/services/categories/useMainCategoriesWithSubCategories";
import { useBasicProductList } from "@/hooks/services/products/useBasicProductList";
import { validRobotsMetaTags, staticPages } from "@/constants/seo";
import { uploadImageToCloudinary, validateImage } from "@/helpers/imageUpload";

interface SeoFormData {
  id: string;
  isHomePage: boolean;
  title: string;
  description: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  canonical: string;
  robotsMetaTag: string;
  author: string;
  publisher: string;
  language: string;
  ogTitle: string;
  ogDescription: string;
  ogImageUrl: string;
  structuredDataJson: string;
  productId: string;
  mainCategoryId: string;
  subCategoryId: string;
}

function OnicalCanAutocomplete({
  value,
  onChange,
  baseUrl,
  allowedRegex,
  invalidCharsFn,
  required
}: {
  value: string;
  onChange: (v: string) => void;
  baseUrl: string;
  allowedRegex: RegExp;
  invalidCharsFn: (v: string) => string;
  required?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  const [suggestions, setSuggestions] = useState(staticPages);
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (!value) setSuggestions(staticPages);
    else setSuggestions(staticPages.filter(page => page.value && page.value.toLowerCase().includes(value.toLowerCase())));
  }, [value]);
  return (
    <div className="mb-3" style={{ position: 'relative' }}>
      <label className="form-label">Canonical URL</label>
      <div className="input-group">
        <span className="input-group-text" style={{ background: '#f8f9fa', fontSize: '0.9em' }}>{baseUrl}/</span>
        <input
          ref={inputRef}
          type="text"
          className={`form-control ${!value || !allowedRegex.test(value) ? 'is-invalid' : ''}`}
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          placeholder="örnek: about-us veya kendi yolunuzu yazın"
          autoComplete="off"
          required={required}
        />
      </div>
      {focused && suggestions.length > 0 && (
        <ul style={{
          position: 'absolute',
          zIndex: 10,
          left: 0,
          right: 0,
          marginTop: 2,
          background: '#fff',
          border: '1px solid #ddd',
          borderRadius: 4,
          maxHeight: 180,
          overflowY: 'auto',
          listStyle: 'none',
          padding: 0
        }}>
          {suggestions.map(page => (
            <li
              key={page.value}
              style={{ padding: '8px 12px', cursor: 'pointer' }}
              onMouseDown={() => {
                onChange(page.value);
                setFocused(false);
                if (inputRef.current) inputRef.current.blur();
              }}
            >
              <span style={{ color: '#555' }}>{page.label}</span>
              <span style={{ float: 'right', color: '#888', fontSize: 12 }}>{page.value}</span>
            </li>
          ))}
        </ul>
      )}
      <small className={
        value && !allowedRegex.test(value)
          ? 'text-danger'
          : ''
      } style={{
        display: 'block',
        fontSize: value && !allowedRegex.test(value) ? undefined : '0.85em',
        fontStyle: value && !allowedRegex.test(value) ? undefined : 'italic',
        color: value && !allowedRegex.test(value) ? undefined : '#6c757d',
        marginTop: 4,
        marginLeft: 2,
        minHeight: 20
      }}>
        {(value && !allowedRegex.test(value)) ? (
          <>
            Sadece harf, rakam, tire, alt tire, slash ve nokta kullanabilirsiniz. Örnek: <b>about-us</b>
            {value && invalidCharsFn(value) && (
              <>
                <br />
                Geçersiz karakter(ler): <b>{invalidCharsFn(value)}</b>
              </>
            )}
          </>
        ) : (
          <>
            <span style={{ fontSize: '0.75em', marginRight: 4, verticalAlign: 'middle' }}>ℹ️</span>
            <span style={{ fontSize: '0.75em', fontStyle: 'italic', color: '#6c757d' }}>
              Sadece harf, rakam, tire, alt tire, slash ve nokta kullanabilirsiniz. Örnek: <b>about-us</b>
            </span>
          </>
        )}
      </small>
    </div>
  );
}

function EditSeoPage() {
  const router = useRouter();
  const { id } = router.query;
  const { seoData, isLoading } = useGetSeoById(id as string, !!id);
  const { updateSeo, isPending } = useUpdateSeo();

  const [formData, setFormData] = useState<SeoFormData>({
    id: "",
    isHomePage: false,
    title: "",
    description: "",
    metaTitle: "",
    metaDescription: "",
    keywords: "",
    canonical: "",
    robotsMetaTag: "index, follow",
    author: "",
    publisher: "Nors",
    language: "tr",
    ogTitle: "",
    ogDescription: "",
    ogImageUrl: "",
    structuredDataJson: "",
    productId: "",
    mainCategoryId: "",
    subCategoryId: "",
  });

  const [seoType, setSeoType] = useState<"homepage" | "general" | "product" | "category">(
    "general"
  );
  const { data: mainCategoriesWithSubs, isLoading: mainCategoriesLoading, error: mainCategoriesError } = useMainCategoriesWithSubCategories();
  const selectedMainCategory = mainCategoriesWithSubs.find(cat => cat.id === formData.mainCategoryId);
  const subCategories = selectedMainCategory ? selectedMainCategory.subCategories : [];
  const { products: productList, loading: productsLoading } = useBasicProductList();
  const [categoryError, setCategoryError] = useState<string | null>(null);
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const canonicalAllowedRegex = /^[a-zA-Z0-9\-_/\.]+$/;
  const invalidCanonicalChars = (value: string) => {
    const match = value.match(/[^a-zA-Z0-9\-_/\.]/g);
    return match ? Array.from(new Set(match)).join(", ") : "";
  };
  const [canonicalInputFocused, setCanonicalInputFocused] = useState(false);
  const [canonicalSuggestions, setCanonicalSuggestions] = useState(staticPages);
  const canonicalInputRef = useRef<HTMLInputElement>(null);
  const [ogImageUploading, setOgImageUploading] = useState(false);
  const [ogImageUploadError, setOgImageUploadError] = useState<string | null>(null);
  const ogImageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!formData.canonical) {
      setCanonicalSuggestions(staticPages);
    } else {
      setCanonicalSuggestions(
        staticPages.filter(page =>
          page.value && page.value.toLowerCase().includes(formData.canonical.toLowerCase())
        )
      );
    }
  }, [formData.canonical]);

  useEffect(() => {
    if (seoData) {
      setFormData({
        id: seoData.id || "",
        isHomePage: ('isHomePage' in seoData) ? Boolean(seoData.isHomePage) : false,
        title: seoData.title || "",
        description: seoData.description || "",
        metaTitle: seoData.metaTitle || "",
        metaDescription: seoData.metaDescription || "",
        keywords: seoData.keywords || "",
        canonical: seoData.canonical || "",
        robotsMetaTag: seoData.robotsMetaTag || "index, follow",
        author: seoData.author || "",
        publisher: seoData.publisher || "Nors",
        language: seoData.language || "tr",
        ogTitle: seoData.ogTitle || "",
        ogDescription: seoData.ogDescription || "",
        ogImageUrl: seoData.ogImageUrl || "",
        structuredDataJson: seoData.structuredDataJson || "",
        productId: seoData.productId || "",
        mainCategoryId: seoData.mainCategoryId || "",
        subCategoryId: seoData.subCategoryId || "",
      });
      if ((seoData.mainCategoryId && seoData.mainCategoryId !== "") || (seoData.subCategoryId && seoData.subCategoryId !== "")) {
        setSeoType("category");
      } else if (seoData.productId) {
        setSeoType("product");
      } else if (("isHomePage" in seoData && Boolean(seoData.isHomePage)) || (!seoData.canonical || seoData.canonical === "")) {
        setSeoType("homepage");
      } else {
        setSeoType("general");
      }
    }
  }, [seoData]);

  const handleInputChange = (
    field: keyof SeoFormData,
    value: string | boolean
  ) => {
    if (field === "canonical" && typeof value === "string") {
      let cleaned = value.trim().replace(/^\//, "").toLowerCase();
      setFormData((prev) => ({ ...prev, [field]: cleaned }));
      return;
    }
    if (field === "robotsMetaTag" && typeof value === "string") {
      const normalized = value.trim().toLowerCase();
      setFormData((prev) => ({ ...prev, [field]: normalized }));
      return;
    }
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSeoTypeChange = (type: "homepage" | "general" | "product" | "category") => {
    setSeoType(type);
    if (type === "homepage") {
      const baseUrl = typeof window !== "undefined" ? window.location.origin + "/" : "";
      setFormData((prev) => ({
        ...prev,
        isHomePage: true,
        canonical: baseUrl,
        productId: "",
        mainCategoryId: "",
        subCategoryId: "",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        isHomePage: false,
        canonical: "",
        productId: "",
        mainCategoryId: "",
        subCategoryId: "",
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Canonical kontrolü
    if (
      seoType === "general" &&
      (!formData.canonical || !canonicalAllowedRegex.test(formData.canonical))
    ) {
      alert("Canonical yolu geçersiz. Sadece harf, rakam, tire, alt tire, slash ve nokta karakterleri kullanılabilir.");
      return;
    }

    // Kategori SEO'su için ana veya alt kategori zorunlu
    if (seoType === "category" && !formData.mainCategoryId && !formData.subCategoryId) {
      setCategoryError("Lütfen en az bir ana kategori veya alt kategori seçiniz.");
      return;
    } else {
      setCategoryError(null);
    }

    // Alanları PascalCase'e çevir ve boş string/null/undefined olanları null yap
    const mapToBackendModel = (data: SeoFormData, type: typeof seoType) => {
      const mapped: any = {
        Id: data.id,
        IsHomePage: data.isHomePage,
        Title: data.title,
        Description: data.description,
        MetaTitle: data.metaTitle || null,
        MetaDescription: data.metaDescription || null,
        Keywords: data.keywords || null,
        Canonical: null,
        RobotsMetaTag: data.robotsMetaTag || null,
        Author: data.author || null,
        Publisher: data.publisher || null,
        Language: data.language || "tr",
        OgTitle: data.ogTitle || null,
        OgDescription: data.ogDescription || null,
        OgImageUrl: data.ogImageUrl || null,
        StructuredDataJson: data.structuredDataJson || null,
        ProductId: null,
        MainCategoryId: null,
        SubCategoryId: null,
        BaseUrl: baseUrl,
      };
      if (type === "homepage") {
        mapped.Canonical = null;
      } else if (type === "general") {
        mapped.Canonical = data.canonical ? data.canonical.replace(/^\//, "") : null;
      }
      if (type === "product") {
        mapped.ProductId = data.productId && data.productId !== "" ? data.productId : null;
      }
      if (type === "category") {
        mapped.MainCategoryId = data.mainCategoryId && data.mainCategoryId !== "" ? data.mainCategoryId : null;
        mapped.SubCategoryId = data.subCategoryId && data.subCategoryId !== "" ? data.subCategoryId : null;
      }
      return mapped;
    };

    const submitData = mapToBackendModel(formData, seoType);

    try {
      await updateSeo(submitData);
      router.push("/admin/seo");
    } catch (error) {
      alert("SEO güncelleme başarısız.");
    }
  };

  // Drag & drop event handler
  const handleOgImageDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setOgImageUploadError(null);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    await handleOgImageUpload(file);
  };

  // Dosya seçme event handler
  const handleOgImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setOgImageUploadError(null);
    const file = e.target.files?.[0];
    if (!file) return;
    await handleOgImageUpload(file);
  };

  // Yükleme işlemi
  const handleOgImageUpload = async (file: File) => {
    setOgImageUploading(true);
    setOgImageUploadError(null);
    try {
      validateImage(file, { allowedTypes: ["image/jpeg", "image/png", "image/jpg"] });
      const res = await uploadImageToCloudinary(file);
      handleInputChange("ogImageUrl", res.secure_url);
    } catch (err: any) {
      setOgImageUploadError(err.message || "Görsel yüklenemedi.");
    } finally {
      setOgImageUploading(false);
    }
  };

  // Drag & drop görsel yükleme alanı için eventler
  const handleOgImageDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  if (isLoading) {
    return (
      <div className="page-content">
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Yükleniyor...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!seoData) {
    return (
      <div className="page-content">
        <div className="alert alert-danger">SEO kaydı bulunamadı.</div>
      </div>
    );
  }

  return (
    <div className="page-content">
      <div className="row g-3">
        <div className="col-12">
          {/* Header */}
          <div
            className="card-header bg-transparent border-0 d-flex justify-content-between align-items-center"
            style={{ padding: "20px" }}
          >
            <h6
              className="mb-0"
              style={{ fontSize: "1.2rem", fontWeight: "bold" }}
            >
              SEO Kaydını Düzenle
            </h6>
            <Link
              href="/admin/seo"
              className="btn btn-outline-secondary btn-sm"
            >
              Geri Dön
            </Link>
          </div>

          <div className="card">
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                {/* SEO Type Selection */}
                <div className="mb-4">
                  <label className="form-label fw-bold">SEO Tipi</label>
                  <div className="d-flex gap-3">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="seoType"
                        id="homepage"
                        checked={seoType === "homepage"}
                        onChange={() => handleSeoTypeChange("homepage")}
                      />
                      <label className="form-check-label" htmlFor="homepage">
                        Ana Sayfa
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="seoType"
                        id="general"
                        checked={seoType === "general"}
                        onChange={() => handleSeoTypeChange("general")}
                      />
                      <label className="form-check-label" htmlFor="general">
                        Genel Sayfa
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="seoType"
                        id="product"
                        checked={seoType === "product"}
                        onChange={() => handleSeoTypeChange("product")}
                      />
                      <label className="form-check-label" htmlFor="product">
                        Ürün Sayfası
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="seoType"
                        id="category"
                        checked={seoType === "category"}
                        onChange={() => handleSeoTypeChange("category")}
                      />
                      <label className="form-check-label" htmlFor="category">
                        Kategori Sayfası
                      </label>
                    </div>
                  </div>
                </div>

                {/* Related IDs based on type */}
                {seoType === "product" && (
                  <div className="mb-3">
                    <label className="form-label">Ürün Seç</label>
                    <select
                      className="form-select"
                      value={formData.productId}
                      onChange={e => handleInputChange("productId", e.target.value)}
                      disabled={productsLoading}
                    >
                      <option value="">Ürün seçiniz</option>
                      {productList && productList.map(product => (
                        <option key={product.id} value={product.id}>{product.title}</option>
                      ))}
                    </select>
                  </div>
                )}

                {seoType === "category" && (
                  <>
                    <div className="mb-3">
                      <label className="form-label">Ana Kategori Seç</label>
                      <select
                        className="form-select"
                        value={formData.mainCategoryId}
                        onChange={e => {
                          handleInputChange("mainCategoryId", e.target.value);
                          handleInputChange("subCategoryId", "");
                        }}
                        disabled={mainCategoriesLoading}
                      >
                        <option value="">Ana kategori seçiniz</option>
                        {mainCategoriesWithSubs && mainCategoriesWithSubs.map((cat) => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                      {mainCategoriesLoading && <div className="text-info">Yükleniyor...</div>}
                      {mainCategoriesError && <div className="text-danger">{mainCategoriesError.toString()}</div>}
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Alt Kategori Seç (Opsiyonel)</label>
                      <select
                        className="form-select"
                        value={formData.subCategoryId}
                        onChange={e => handleInputChange("subCategoryId", e.target.value)}
                        disabled={!formData.mainCategoryId}
                      >
                        <option value="">Alt kategori seçiniz</option>
                        {subCategories && subCategories.map((sub) => (
                          <option key={sub.id} value={sub.id}>{sub.name}</option>
                        ))}
                      </select>
                    </div>
                  </>
                )}

                <div className="row">
                  {/* Basic SEO Fields */}
                  <div className="col-md-6">
                    <h6 className="fw-bold mb-3 text-primary">
                      Temel SEO Bilgileri
                    </h6>

                    <div className="mb-3">
                      <label className="form-label">Başlık</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.title}
                        onChange={(e) =>
                          handleInputChange("title", e.target.value)
                        }
                        placeholder="Sayfa başlığı"
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Açıklama</label>
                      <textarea
                        className="form-control"
                        value={formData.description}
                        onChange={(e) =>
                          handleInputChange("description", e.target.value)
                        }
                        placeholder="Sayfa açıklaması"
                        rows={3}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Meta Başlık</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.metaTitle}
                        onChange={(e) =>
                          handleInputChange("metaTitle", e.target.value)
                        }
                        placeholder="Meta title (50-60 karakter)"
                      />
                      <small className="text-muted">
                        {formData.metaTitle.length}/60 karakter
                      </small>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Meta Açıklama</label>
                      <textarea
                        className="form-control"
                        value={formData.metaDescription}
                        onChange={(e) =>
                          handleInputChange("metaDescription", e.target.value)
                        }
                        placeholder="Meta description (150-160 karakter)"
                        rows={3}
                      />
                      <small className="text-muted">
                        {formData.metaDescription.length}/160 karakter
                      </small>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Anahtar Kelimeler</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.keywords}
                        onChange={(e) =>
                          handleInputChange("keywords", e.target.value)
                        }
                        placeholder="kelime1, kelime2, kelime3"
                      />
                      <small className="text-muted">Virgülle ayırın</small>
                    </div>

                    {/* Canonical sadece genel sayfa için gösterilir ve autocomplete ile sayfa seçilebilir */}
                    {seoType === "general" && (
                      <OnicalCanAutocomplete
                        value={formData.canonical}
                        onChange={(v: string) => handleInputChange("canonical", v)}
                        baseUrl={baseUrl}
                        allowedRegex={canonicalAllowedRegex}
                        invalidCharsFn={invalidCanonicalChars}
                        required
                      />
                    )}
                  </div>

                  {/* Open Graph & Additional Fields */}
                  <div className="col-md-6">
                    <h6 className="fw-bold mb-3 text-success">
                      Open Graph (Sosyal Medya)
                    </h6>

                    <div className="mb-3">
                      <label className="form-label">OG Başlık</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.ogTitle}
                        onChange={(e) =>
                          handleInputChange("ogTitle", e.target.value)
                        }
                        placeholder="Sosyal medya başlığı"
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">OG Açıklama</label>
                      <textarea
                        className="form-control"
                        value={formData.ogDescription}
                        onChange={(e) =>
                          handleInputChange("ogDescription", e.target.value)
                        }
                        placeholder="Sosyal medya açıklaması"
                        rows={3}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">OG Görsel Yükle</label>
                      <div
                        className="og-image-upload-box"
                        onDrop={handleOgImageDrop}
                        onDragOver={handleOgImageDragOver}
                        onClick={() => ogImageInputRef.current?.click()}
                        style={{ position: 'relative', width: 180, height: 120, marginBottom: 8 }}
                      >
                        <input
                          ref={ogImageInputRef}
                          type="file"
                          accept="image/jpeg,image/png,image/jpg"
                          style={{ display: 'none' }}
                          onChange={handleOgImageFileChange}
                          disabled={ogImageUploading}
                        />
                        {formData.ogImageUrl ? (
                          <>
                            <img
                              src={formData.ogImageUrl}
                              alt="OG Görsel Önizleme"
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                borderRadius: 12,
                                border: '1.5px solid #eee',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                              }}
                            />
                            <div className="og-image-overlay">
                              <span>Değiştir</span>
                            </div>
                          </>
                        ) : (
                          <div className="og-image-upload-placeholder">
                            {ogImageUploading ? (
                              <span>Yükleniyor...</span>
                            ) : (
                              <>
                                <span style={{ color: '#888', fontSize: 15 }}>Görseli sürükleyin veya tıklayın</span>
                                <br />
                                <span style={{ fontSize: 11, color: '#aaa' }}>(JPG, JPEG, PNG. Maks 10MB)</span>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                      {ogImageUploadError && <div className="text-danger" style={{ fontSize: 13 }}>{ogImageUploadError}</div>}
                    </div>

                    <h6 className="fw-bold mb-3 text-warning">Ek Bilgiler</h6>

                    <div className="mb-3">
                      <label className="form-label">Yazar</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.author}
                        onChange={(e) =>
                          handleInputChange("author", e.target.value)
                        }
                        placeholder="İçerik yazarı"
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Yayıncı</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.publisher}
                        onChange={(e) =>
                          handleInputChange("publisher", e.target.value)
                        }
                        placeholder="Yayıncı adı"
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Dil</label>
                      <select
                        className="form-select"
                        value={formData.language}
                        onChange={(e) =>
                          handleInputChange("language", e.target.value)
                        }
                      >
                        <option value="tr">Türkçe</option>
                        <option value="en">English</option>
                        <option value="de">Deutsch</option>
                        <option value="fr">Français</option>
                      </select>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Robots Meta Tag</label>
                      <select
                        className="form-select"
                        value={formData.robotsMetaTag}
                        onChange={(e) => handleInputChange("robotsMetaTag", e.target.value)}
                        required
                      >
                        {validRobotsMetaTags.map((tag) => (
                          <option key={tag} value={tag}>{tag}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Structured Data */}
                <div className="mb-3">
                  <label className="form-label">
                    Yapılandırılmış Veri (JSON-LD)
                  </label>
                  <textarea
                    className="form-control"
                    value={formData.structuredDataJson}
                    onChange={(e) =>
                      handleInputChange("structuredDataJson", e.target.value)
                    }
                    placeholder='{"@context": "https://schema.org", "@type": "WebPage", "name": "Page Name"}'
                    rows={4}
                    style={{ fontFamily: "monospace" }}
                  />
                  <small className="text-muted">
                    Geçerli JSON formatında giriniz
                  </small>
                </div>

                {/* Submit Buttons */}
                <div className="d-flex gap-2 justify-content-end">
                  <Link href="/admin/seo" className="btn btn-outline-secondary">
                    İptal
                  </Link>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isPending}
                  >
                    {isPending ? "Güncelleniyor..." : "SEO Kaydını Güncelle"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

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

        .form-label {
          font-size: 0.875rem;
          font-weight: 500;
          color: #444;
        }

        .form-control,
        .form-select {
          font-size: 0.813rem;
          padding: 0.375rem 0.5rem;
          border: 1px solid #d0d0d0;
        }

        .form-control:focus,
        .form-select:focus {
          border-color: #0d6efd;
          box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
        }

        .btn {
          font-size: 0.875rem;
          padding: 0.5rem 1rem;
        }

        .btn-sm {
          font-size: 0.75rem;
          padding: 0.25rem 0.5rem;
        }

        .page-content {
          padding: 0.5rem 0;
        }

        h6.fw-bold {
          border-bottom: 2px solid currentColor;
          padding-bottom: 0.5rem;
        }

        @media (max-width: 768px) {
          .row .col-md-6 {
            margin-bottom: 1rem;
          }
        }

        .og-image-upload-box {
          border: 2px dashed #ccc;
          border-radius: 12px;
          background: #fafbfc;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: border-color 0.2s;
          overflow: hidden;
        }
        .og-image-upload-box:hover {
          border-color: #0d6efd;
        }
        .og-image-upload-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #888;
          font-size: 15px;
        }
        .og-image-overlay {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.18);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          font-size: 15px;
          font-weight: 500;
          border-radius: 12px;
          transition: opacity 0.2s;
          pointer-events: none;
        }
        .og-image-upload-box:hover .og-image-overlay {
          opacity: 1;
          pointer-events: auto;
        }
        @media (max-width: 600px) {
          .og-image-upload-box {
            width: 100%;
            min-width: 0;
            height: 110px;
          }
        }
      `}</style>
    </div>
  );
}

export default EditSeoPage;
