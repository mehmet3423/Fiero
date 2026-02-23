"use client";

import GeneralModal from "@/components/shared/GeneralModal";
import { UpdateBaseProductRequest } from "@/constants/models/Product";
import { useCreateBaseProduct } from "@/hooks/services/base-product/useCreateBaseProduct";
import { useDeleteBaseProduct } from "@/hooks/services/base-product/useDeleteBaseProduct";
import { useGetBaseProductById } from "@/hooks/services/base-product/useGetBaseProductById";
import { useGetBaseProductList } from "@/hooks/services/base-product/useGetBaseProductList";
import { useGetBaseProductVariants } from "@/hooks/services/base-product/useGetBaseProductVariants";
import { useUpdateBaseProduct } from "@/hooks/services/base-product/useUpdateBaseProduct";
import {
  ProductResponse,
  useBasicProductList,
} from "@/hooks/services/products/useBasicProductList";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

const MAX_LIST_ITEMS = 60;

const BaseProductManagementPage = () => {
  const { products } = useBasicProductList();

  const [baseProductSearch, setBaseProductSearch] = useState("");
  const [baseProductSearchInput, setBaseProductSearchInput] = useState("");
  const [baseProductPage, setBaseProductPage] = useState(0);
  const [selectedBaseProductId, setSelectedBaseProductId] =
    useState<string>("");
  const [createSearch, setCreateSearch] = useState("");
  const [updateSearch, setUpdateSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [createForm, setCreateForm] = useState<{
    name: string;
    nameEn: string;
    productIds: string[];
    subCategoryId: string;
  }>({
    name: "",
    nameEn: "",
    productIds: [],
    subCategoryId: "",
  });

  const [updateForm, setUpdateForm] = useState<UpdateBaseProductRequest>({
    id: "",
    name: "",
    nameEn: "",
    productIds: [],
    subCategoryId: "",
  });

  const { createBaseProduct, isPending: createLoading } =
    useCreateBaseProduct();
  const { updateBaseProduct, isPending: updateLoading } =
    useUpdateBaseProduct();
  const { deleteBaseProduct, isPending: deleteLoading } =
    useDeleteBaseProduct();

  const {
    data: baseProductListData,
    baseProducts,
    isLoading: baseProductListLoading,
    isFetchingData: isBaseProductListFetching,
  } = useGetBaseProductList({
    page: baseProductPage,
    pageSize: 20,
    search: baseProductSearch || undefined,
  });
  const isBaseProductListLoading =
    baseProductListLoading || isBaseProductListFetching;
  const totalBaseProductCount =
    baseProductListData?.count ?? baseProducts.length;

  const { baseProduct: selectedBaseProduct, isLoading: baseProductLoading } =
    useGetBaseProductById({
      id: selectedBaseProductId,
      enabled: !!selectedBaseProductId,
    });

  const {
    variants: variantProducts = [],
    isLoading: variantsLoading,
    refetch: refetchVariants,
  } = useGetBaseProductVariants({
    id: selectedBaseProductId,
    enabled: !!selectedBaseProductId,
  });

  const assignedProducts = useMemo(
    () =>
      products.filter(
        (product) => product.baseProductId === selectedBaseProductId
      ),
    [products, selectedBaseProductId]
  );

  useEffect(() => {
    if (!selectedBaseProductId) {
      return;
    }
    setUpdateForm((prev) => ({
      ...prev,
      id: selectedBaseProductId,
    }));
  }, [selectedBaseProductId]);

  useEffect(() => {
    if (!selectedBaseProductId) {
      setUpdateForm((prev) => {
        if (!prev.id && !prev.name && prev.productIds.length === 0) {
          return prev;
        }
        return {
          id: "",
          name: "",
          productIds: [],
          subCategoryId: "",
        };
      });
      return;
    }
    if (selectedBaseProduct || selectedBaseProductId) {
      const fallbackName =
        (selectedBaseProduct as { name?: string })?.name ||
        baseProducts.find((bp) => bp.id === selectedBaseProductId)?.name ||
        "";

      const fallbackNameEn =
        (selectedBaseProduct as { nameEn?: string | null })?.nameEn ||
        (baseProducts as any[]).find((bp) => bp.id === selectedBaseProductId)
          ?.nameEn ||
        "";

      // API'den gelen varyantların ID'lerini al (öncelikli)
      const variantProductIds =
        variantProducts?.length > 0
          ? variantProducts.map((product) => product.id)
          : [];

      // Eğer API'den varyant gelmediyse, products listesinden atanmış ürünleri kullan
      const fallbackProductIds =
        variantProductIds.length > 0
          ? variantProductIds
          : assignedProducts.map((product) => product.id);

      // Kullanılacak product ID'leri
      const productIdsToUse =
        variantProductIds.length > 0 ? variantProductIds : fallbackProductIds;

      if (productIdsToUse.length === 0) {
        setUpdateForm((prev) => ({
          ...prev,
          id: selectedBaseProductId,
          name: fallbackName,
          productIds: [],
          subCategoryId: prev.subCategoryId || "",
        }));
        return;
      }

      // İlk ürünün alt kategori bilgisini al (subCategoryId için)
      const firstProductId = productIdsToUse[0];
      const baseProductSubCategoryId = (
        selectedBaseProduct as { subCategoryId?: string }
      )?.subCategoryId;

      // İlk varyantın alt kategori bilgisini al
      const firstVariant = variantProducts?.find(
        (v) => v.id === firstProductId
      );
      const firstVariantSubCategoryId = firstVariant
        ? products.find((p) => p.id === firstProductId)?.subCategoryId || ""
        : "";

      const firstProductSubCategoryId =
        products.find((product) => product.id === firstProductId)
          ?.subCategoryId || "";

      const inferredSubCategoryId =
        baseProductSubCategoryId ||
        firstVariantSubCategoryId ||
        firstProductSubCategoryId ||
        "";

      const nextForm = {
        id: selectedBaseProductId,
        name: fallbackName,
        nameEn: fallbackNameEn,
        productIds: productIdsToUse, // API'den gelen varyant ID'leri
        subCategoryId: inferredSubCategoryId,
      };

      setUpdateForm((prev) => {
        const hasSameIds =
          prev.productIds.length === nextForm.productIds.length &&
          prev.productIds.every((id) => nextForm.productIds.includes(id));

        if (
          prev.id === nextForm.id &&
          prev.name === nextForm.name &&
          hasSameIds &&
          prev.subCategoryId === nextForm.subCategoryId
        ) {
          return prev;
        }

        return nextForm;
      });
    }
  }, [
    selectedBaseProductId,
    selectedBaseProduct,
    baseProducts,
    variantProducts,
    assignedProducts,
    products,
  ]);

  useEffect(() => {
    if (!selectedBaseProductId) {
      setUpdateSearch("");
    }
  }, [selectedBaseProductId]);

  useEffect(() => {
    setBaseProductPage(0);
  }, [baseProductSearch]);

  const handleBaseProductSearch = () => {
    setBaseProductSearch(baseProductSearchInput.trim());
  };

  const handleClearBaseProductSearch = () => {
    setBaseProductSearch("");
    setBaseProductSearchInput("");
  };

  const ungroupedProducts = useMemo(
    () => products.filter((product) => !product.baseProductId),
    [products]
  );

  const subCategoryOptions = useMemo(() => {
    const map = new Map<string, string>();
    ungroupedProducts.forEach((product) => {
      if (!product.subCategoryId) return;
      const label =
        product.subCategoryName || product.subCategoryId || "Alt Kategori";
      if (!map.has(product.subCategoryId)) {
        map.set(product.subCategoryId, label);
      }
    });
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [ungroupedProducts]);

  const updateSubCategoryOptions = useMemo(() => {
    const map = new Map<string, string>();
    products.forEach((product) => {
      if (!product.subCategoryId) return;
      const label =
        product.subCategoryName || product.subCategoryId || "Alt Kategori";
      if (!map.has(product.subCategoryId)) {
        map.set(product.subCategoryId, label);
      }
    });
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [products]);

  const filteredCreateProducts = useMemo(() => {
    const term = createSearch.toLowerCase();
    const list = createForm.subCategoryId
      ? ungroupedProducts.filter(
          (product) => product.subCategoryId === createForm.subCategoryId
        )
      : ungroupedProducts;

    const filtered = term
      ? list.filter(
          (product) =>
            product.title.toLowerCase().includes(term) ||
            product.barcodeNumber?.toLowerCase().includes(term)
        )
      : list;

    return filtered.slice(0, MAX_LIST_ITEMS);
  }, [createSearch, ungroupedProducts, createForm.subCategoryId]);

  const selectableUpdateProducts = useMemo(() => {
    if (!selectedBaseProductId) return [];

    // API'den gelen varyantların ID'lerini al
    const variantIds = new Set(variantProducts.map((v) => v.id));

    // API'den gelen varyantlar (products listesinde olmayabilir)
    const variantProductsFromAPI = variantProducts.map((variant) => {
      // Önce products listesinde var mı kontrol et
      const existingProduct = products.find((p) => p.id === variant.id);
      if (existingProduct) {
        return existingProduct;
      }
      // Yoksa variant'ı ProductResponse formatına çevir
      const variantTitle = (variant as any).title ?? variant.name ?? variant.id;

      return {
        id: variant.id,
        title: variantTitle,
        barcodeNumber: variant.barcodeNumber || "",
        subCategoryId:
          (
            selectedBaseProduct as {
              subCategoryId?: string;
            }
          )?.subCategoryId ||
          updateForm.subCategoryId ||
          "",
        baseProductId: selectedBaseProductId,
        baseImageUrl: variant.baseImageUrl || "",
        price: variant.price || 0,
        discountedPrice: variant.discountedPrice || 0,
        sellableQuantity: variant.sellableQuantity || 0,
        isAvailable: variant.isAvailable ?? true,
        isOutlet: variant.isOutlet ?? false,
        refundable: variant.refundable ?? false,
        averageRating: variant.averageRating || 0,
        ratingCount: variant.ratingCount || 0,
        contentImageUrls: variant.contentImageUrls || [],
        currencyType:
          typeof variant.currencyType === "number"
            ? variant.currencyType
            : Number(variant.currencyType) || 0,
        subCategoryName: "",
        externalId: 0,
        description: "",
        banner: [],
        createdOnValue: "",
        updatedOnValue: "",
      } as ProductResponse;
    });

    // Base product'a atanmış ürünler (products listesinden)
    const assignedProducts = products.filter(
      (product) => product.baseProductId === selectedBaseProductId
    );

    // Atanmamış ürünler
    const unassignedProducts = products.filter(
      (product) => !product.baseProductId
    );

    // Tüm seçilebilir ürünleri birleştir (varyantlar + atanmamış ürünler)
    // Önce API'den gelen varyantları ekle, sonra products listesindeki atanmamış ürünleri ekle
    const allSelectable = [
      ...variantProductsFromAPI,
      ...unassignedProducts.filter((p) => !variantIds.has(p.id)),
    ];

    return allSelectable;
  }, [
    products,
    selectedBaseProductId,
    variantProducts,
    selectedBaseProduct,
    updateForm.subCategoryId,
  ]);

  const filteredUpdateProducts = useMemo(() => {
    const term = updateSearch.toLowerCase();
    const baseList = updateForm.subCategoryId
      ? selectableUpdateProducts.filter(
          (product) => product.subCategoryId === updateForm.subCategoryId
        )
      : selectableUpdateProducts;

    const list = term
      ? baseList.filter(
          (product) =>
            product.title.toLowerCase().includes(term) ||
            product.barcodeNumber?.toLowerCase().includes(term)
        )
      : baseList;

    return list.slice(0, MAX_LIST_ITEMS);
  }, [selectableUpdateProducts, updateSearch, updateForm.subCategoryId]);

  const toggleProductSelection = (
    target: "create" | "update",
    productId: string
  ) => {
    if (target === "create") {
      const product = ungroupedProducts.find((p) => p.id === productId);
      if (!product) {
        toast.error("Ürün bilgisi yüklenemedi.");
        return;
      }

      setCreateForm((prev) => {
        const currentSubCategoryId =
          prev.subCategoryId || product.subCategoryId || "";

        if (
          prev.subCategoryId &&
          product.subCategoryId &&
          prev.subCategoryId !== product.subCategoryId
        ) {
          toast.error(
            "Seçtiğiniz ürün farklı bir alt kategoriye ait. Lütfen aynı kategoriye ait ürünleri seçin."
          );
          return prev;
        }

        if (!currentSubCategoryId) {
          toast.error("Bu ürün için alt kategori bilgisi bulunamadı.");
          return prev;
        }

        const exists = prev.productIds.includes(productId);
        return {
          ...prev,
          subCategoryId: currentSubCategoryId,
          productIds: exists
            ? prev.productIds.filter((id) => id !== productId)
            : [...prev.productIds, productId],
        };
      });
    } else {
      const product = products.find((p) => p.id === productId);
      if (!product) {
        toast.error("Ürün bilgisi yüklenemedi.");
        return;
      }

      setUpdateForm((prev) => {
        if (
          prev.subCategoryId &&
          product.subCategoryId &&
          prev.subCategoryId !== product.subCategoryId
        ) {
          toast.error(
            "Varyant eklerken aynı alt kategoriye ait ürünleri seçmelisiniz."
          );
          return prev;
        }

        const targetSubCategoryId =
          prev.subCategoryId || product.subCategoryId || "";
        if (!targetSubCategoryId) {
          toast.error("Bu ürün için alt kategori bilgisi bulunamadı.");
          return prev;
        }

        const exists = prev.productIds.includes(productId);
        return {
          ...prev,
          subCategoryId: targetSubCategoryId,
          productIds: exists
            ? prev.productIds.filter((id) => id !== productId)
            : [...prev.productIds, productId],
        };
      });
    }
  };

  const handleCreateSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const trimmedName = createForm.name.trim();
    if (!trimmedName) {
      toast.error("Lütfen base product için bir ad girin.");
      return;
    }

    const trimmedNameEn = createForm.nameEn.trim();
    if (!trimmedNameEn) {
      toast.error("Lütfen base product için İngilizce ad girin.");
      return;
    }

    if (!createForm.subCategoryId) {
      toast.error("Lütfen bir alt kategori seçin.");
      return;
    }

    if (createForm.productIds.length === 0) {
      toast.error("En az bir ürün seçmelisiniz.");
      return;
    }

    await createBaseProduct({
      name: trimmedName,
      nameEn: trimmedNameEn,
      productIds: createForm.productIds,
      subCategoryId: createForm.subCategoryId,
    });

    setCreateForm({
      name: "",
      nameEn: "",
      productIds: [],
      subCategoryId: "",
    });
    setCreateSearch("");
    setShowCreateModal(false);
    $("#createBaseProductModal").modal("hide");
  };

  const handleCreateSubCategoryChange = (value: string) => {
    setCreateForm((prev) => ({
      ...prev,
      subCategoryId: value,
      productIds: [],
    }));
  };

  const resetCreateForm = () => {
    setCreateForm({
      name: "",
      nameEn: "",
      productIds: [],
      subCategoryId: "",
    });
    setCreateSearch("");
  };

  const openCreateModal = () => {
    setShowCreateModal(true);
    $("#createBaseProductModal").modal("show");
  };

  const closeCreateModal = () => {
    setShowCreateModal(false);
    resetCreateForm();
    $("#createBaseProductModal").modal("hide");
  };

  const handleUpdateSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    if (!updateForm.id) {
      toast.error("Lütfen yönetmek için bir base product seçin.");
      return;
    }

    const trimmedName = updateForm.name.trim();
    if (!trimmedName) {
      toast.error("Base product adı boş olamaz.");
      return;
    }

    const trimmedNameEn = updateForm.nameEn?.trim() || "";
    if (!trimmedNameEn) {
      toast.error("Base product İngilizce adı boş olamaz.");
      return;
    }

    if (updateForm.productIds.length === 0) {
      toast.error("Base product en az bir varyanta sahip olmalıdır.");
      return;
    }

    if (!updateForm.subCategoryId) {
      toast.error(
        "Alt kategori bilgisi bulunamadı. Lütfen varyantları yeniden seçin."
      );
      return;
    }

    await updateBaseProduct({
      ...updateForm,
      name: trimmedName,
      nameEn: trimmedNameEn,
    });
    refetchVariants();
  };

  const handleUpdateSubCategoryChange = (value: string) => {
    setUpdateForm((prev) => {
      const filteredProductIds = prev.productIds.filter((productId) => {
        if (!value) return true;
        const product = products.find((p) => p.id === productId);
        return product?.subCategoryId === value;
      });
      return {
        ...prev,
        subCategoryId: value,
        productIds: filteredProductIds,
      };
    });
  };

  const openDeleteModal = (target: { id: string; name: string }) => {
    setDeleteTarget(target);
    $("#baseProductDeleteModal").modal("show");
  };

  const closeDeleteModal = () => {
    $("#baseProductDeleteModal").modal("hide");
    setDeleteTarget(null);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    await deleteBaseProduct(deleteTarget.id);
    if (selectedBaseProductId === deleteTarget.id) {
      setSelectedBaseProductId("");
    }
    closeDeleteModal();
  };

  const getProductBadge = (productId: string) => {
    const product = products.find((item) => item.id === productId);
    if (!product) return productId;
    return product.title;
  };

  return (
    <div className="content-wrapper">
      <div className="flex-grow-1 container-p-y">
        <div className="card bg-transparent border-0 mb-3">
          <div className="card-body py-3 d-flex flex-column flex-md-row justify-content-between align-items-md-center">
            <div>
              <h4 className="mb-1 fw-bold">Base Product Yönetimi</h4>
              <p className="mb-0 text-muted" style={{ fontSize: "0.875rem" }}>
                Ürün varyantlarını gruplandırın, yeni base product&apos;lar
                oluşturun ve mevcut grupları güncelleyin.
              </p>
            </div>
            <div className="mt-3 mt-md-0">
              <button
                type="button"
                className="btn btn-primary"
                onClick={openCreateModal}
              >
                <i className="bx bx-plus me-1"></i>
                Yeni Base Product Oluştur
              </button>
            </div>
          </div>
        </div>

        <div className="row g-4">
          <div className="col-12 col-lg-6">
            <div className="card h-100">
              <div className="card-header border-0 pb-0">
                <div className="d-flex justify-content-between align-items-center flex-wrap m-3 ">
                  <h6 className="mb-0 fw-semibold">Base Product Listesi</h6>
                  <div
                    className="input-group input-group-sm mt-2 mt-lg-0 mb-0"
                    style={{ maxWidth: 350 }}
                  >
                    <span className="input-group-text">
                      <i className="bx bx-search"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Base product veya ürün ara..."
                      value={baseProductSearchInput}
                      onChange={(e) =>
                        setBaseProductSearchInput(e.target.value)
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleBaseProductSearch();
                        }
                      }}
                    />
                    {baseProductSearchInput && (
                      <button
                        className="btn btn-outline-secondary"
                        onClick={handleClearBaseProductSearch}
                        type="button"
                      >
                        Temizle
                      </button>
                    )}
                    <button
                      className="btn btn-primary"
                      type="button"
                      onClick={handleBaseProductSearch}
                    >
                      Ara
                    </button>
                  </div>
                </div>
                <hr />
              </div>

              <div className="card-body">
                {isBaseProductListLoading ? (
                  <div className="text-center py-4">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Yükleniyor...</span>
                    </div>
                  </div>
                ) : baseProducts.length > 0 ? (
                  <div className="base-product-list">
                    {baseProducts.map((baseProduct) => (
                      <div
                        key={baseProduct.id}
                        className={`base-product-item ${
                          baseProduct.id === selectedBaseProductId
                            ? "active"
                            : ""
                        }`}
                      >
                        <div className="d-flex justify-content-between align-items-start gap-2">
                          <div>
                            <h6 className="mb-1">
                              {baseProduct.name || "İsimsiz Base Product"}
                            </h6>
                            <small
                              className="text-muted"
                              style={{ fontSize: "0.6em" }}
                            >
                              ID: {baseProduct.id}
                            </small>
                          </div>
                          <div className="d-flex gap-2">
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-primary"
                              onClick={() =>
                                setSelectedBaseProductId((prev) =>
                                  prev === baseProduct.id ? "" : baseProduct.id
                                )
                              }
                            >
                              {selectedBaseProductId === baseProduct.id
                                ? "Seçili"
                                : "Yönet"}
                            </button>
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger"
                              onClick={() =>
                                openDeleteModal({
                                  id: baseProduct.id,
                                  name:
                                    baseProduct.name || "İsimsiz Base Product",
                                })
                              }
                            >
                              <i className="bx bx-trash"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <i
                      className="bx bx-package mb-2"
                      style={{ fontSize: "3rem", color: "#d9dee3" }}
                    ></i>
                    <p className="mb-0">Henüz base product bulunmuyor.</p>
                    <small className="text-muted">
                      Yeni bir base product oluşturmak için yukarıdaki butona
                      tıklayın.
                    </small>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-6">
            <div className="card">
              <div className="card-header border-0 pb-0 d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center m-3 gap-2">
                  <h6 className="mb-0 fw-semibold">Seçili Base Product</h6>
                </div>
              </div>
              <div className="card-body">
                {!selectedBaseProductId ? (
                  <div className="text-center py-4">
                    <i
                      className="bx bx-hand-pointer mb-2"
                      style={{ fontSize: "3rem", color: "#d9dee3" }}
                    ></i>
                    <p className="mb-0">Bir base product seçmediniz.</p>
                    <small
                      className="text-muted"
                      style={{ fontSize: "0.75rem" }}
                    >
                      Soldaki listeden bir base product seçerek düzenleme
                      yapabilirsiniz.
                    </small>
                  </div>
                ) : baseProductLoading ? (
                  <div className="text-center py-4">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Yükleniyor...</span>
                    </div>
                  </div>
                ) : (
                  <>
                    <form onSubmit={handleUpdateSubmit}>
                      <div className="row g-3">
                        <div className="col-12 col-md-6">
                          <label className="form-label">Base Product Adı</label>
                          <input
                            type="text"
                            className="form-control"
                            value={updateForm.name}
                            onChange={(e) =>
                              setUpdateForm((prev) => ({
                                ...prev,
                                name: e.target.value,
                              }))
                            }
                          />
                        </div>
                        <div className="col-12 col-md-6">
                          <label className="form-label">
                            Base Product Adı (EN)
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            value={updateForm.nameEn || ""}
                            onChange={(e) =>
                              setUpdateForm((prev) => ({
                                ...prev,
                                nameEn: e.target.value,
                              }))
                            }
                          />
                        </div>
                        <div className="col-12 col-md-6">
                          <label className="form-label">Alt Kategori</label>
                          <select
                            className="form-select"
                            value={updateForm.subCategoryId}
                            onChange={(e) =>
                              handleUpdateSubCategoryChange(e.target.value)
                            }
                          >
                            <option value="">Alt kategori seçin</option>
                            {updateSubCategoryOptions.map((option) => (
                              <option key={option.id} value={option.id}>
                                {option.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="mb-2 d-flex justify-content-between align-items-center">
                        <label className="form-label mb-0 mt-3">
                          Varyantlar ({updateForm.productIds.length})
                        </label>
                      </div>

                      {/* <div className="input-group input-group-sm mb-3">
                        <span className="input-group-text">
                          <i className="bx bx-search"></i>
                        </span>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Ürün ara..."
                          value={updateSearch}
                          onChange={(e) => setUpdateSearch(e.target.value)}
                        />
                        {updateSearch && (
                          <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={() => setUpdateSearch("")}
                          >
                            Temizle
                          </button>
                        )}
                      </div> */}

                      <div className="product-list">
                        {filteredUpdateProducts.length > 0 ? (
                          filteredUpdateProducts.map((product) => (
                            <label
                              key={`update-${product.id}`}
                              className="product-option"
                            >
                              <input
                                type="checkbox"
                                className="form-check-input"
                                checked={updateForm.productIds.includes(
                                  product.id
                                )}
                                onChange={() =>
                                  toggleProductSelection("update", product.id)
                                }
                              />
                              <div className="product-info">
                                <span className="title text-dark">
                                  {product.title}
                                </span>
                                <small
                                  className="text-muted"
                                  style={{ fontSize: "0.75rem" }}
                                >
                                  Barkod: {product.barcodeNumber || "-"}
                                </small>
                              </div>
                            </label>
                          ))
                        ) : (
                          <div className="text-center text-muted py-3">
                            {updateForm.subCategoryId
                              ? "Bu alt kategoriye uygun ürün bulunamadı."
                              : "Uygun ürün bulunamadı."}
                          </div>
                        )}
                      </div>

                      <div className="d-flex justify-content-end gap-2 mt-4">
                        <button
                          type="button"
                          className="btn btn-outline-danger"
                          onClick={() =>
                            selectedBaseProductId &&
                            openDeleteModal({
                              id: selectedBaseProductId,
                              name:
                                selectedBaseProduct?.name ||
                                "İsimsiz Base Product",
                            })
                          }
                        >
                          Base Product&apos;ı Sil
                        </button>
                        <button
                          type="submit"
                          className="btn btn-primary"
                          disabled={updateLoading}
                        >
                          {updateLoading ? "Güncelleniyor..." : "Kaydet"}
                        </button>
                      </div>
                    </form>

                    <div className="divider my-4"></div>

                    <div>
                      <h6 className="fw-semibold mb-3">Varyant Önizleme</h6>
                      {variantsLoading ? (
                        <div className="text-center py-4">
                          <div
                            className="spinner-border text-primary"
                            role="status"
                          >
                            <span className="visually-hidden">
                              Yükleniyor...
                            </span>
                          </div>
                        </div>
                      ) : variantProducts.length > 0 ? (
                        <div className="variant-grid">
                          {variantProducts.map((variant) => (
                            <div key={variant.id} className="variant-card">
                              <div className="variant-thumb">
                                <Image
                                  src={
                                    variant.baseImageUrl ||
                                    "/assets/site/images/no-image.svg"
                                  }
                                  alt={
                                    (variant as any).title ||
                                    variant.name ||
                                    "Varyant"
                                  }
                                  width={64}
                                  height={64}
                                />
                              </div>
                              <div className="variant-details">
                                <span className="variant-title text-dark">
                                  {(variant as any).title ||
                                    variant.name ||
                                    "İsimsiz Varyant"}
                                </span>
                                <small
                                  className="text-muted d-block"
                                  style={{ fontSize: "0.75rem" }}
                                >
                                  Barkod: {variant.barcodeNumber || "-"}
                                </small>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center text-muted py-4">
                          Bu base product için varyant bulunamadı.
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Base Product Modal */}
      <GeneralModal
        id="createBaseProductModal"
        title="Yeni Base Product Oluştur"
        size="lg"
        onClose={closeCreateModal}
        showFooter={false}
      >
        <form id="createBaseProductForm" onSubmit={handleCreateSubmit}>
          <div className="mb-3">
            <label className="form-label">Base Product Adı</label>
            <input
              type="text"
              className="form-control"
              placeholder="Örn. Oversize T-Shirt Siyah"
              value={createForm.name}
              onChange={(e) =>
                setCreateForm((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Base Product Adı (EN)</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Oversize T-Shirt Black"
              value={createForm.nameEn}
              onChange={(e) =>
                setCreateForm((prev) => ({
                  ...prev,
                  nameEn: e.target.value,
                }))
              }
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Alt Kategori</label>
            <select
              className="form-select"
              value={createForm.subCategoryId}
              onChange={(e) => handleCreateSubCategoryChange(e.target.value)}
            >
              <option value="">Alt kategori seçin</option>
              {subCategoryOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
            <small className="text-muted">
              Seçeceğiniz ürünler bu alt kategoriye ait olmalıdır.
            </small>
          </div>

          <div className="mb-2 d-flex justify-content-between align-items-center">
            <label className="form-label mb-0">
              Ürünler ({createForm.productIds.length})
            </label>
          </div>
          <div className="input-group input-group-sm mb-3">
            <span className="input-group-text">
              <i className="bx bx-search"></i>
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Ürün adı veya barkod ara..."
              value={createSearch}
              onChange={(e) => setCreateSearch(e.target.value)}
            />
            {createSearch && (
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setCreateSearch("")}
              >
                Temizle
              </button>
            )}
          </div>

          <div
            className="product-list"
            style={{ maxHeight: "300px", overflowY: "auto" }}
          >
            {filteredCreateProducts.length > 0 ? (
              filteredCreateProducts.map((product) => (
                <label key={`create-${product.id}`} className="product-option">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={createForm.productIds.includes(product.id)}
                    onChange={() =>
                      toggleProductSelection("create", product.id)
                    }
                  />
                  <div className="product-info">
                    <span className="title text-dark">{product.title}</span>
                    <small className="text-muted">
                      Barkod: {product.barcodeNumber || "-"}
                    </small>
                  </div>
                </label>
              ))
            ) : (
              <div className="text-center text-muted py-3">
                {createForm.subCategoryId
                  ? "Bu alt kategoride uygun ürün bulunamadı."
                  : "Uygun ürün bulunamadı."}
              </div>
            )}
          </div>

          {createForm.productIds.length > 0 && (
            <div className="selected-badges mt-3">
              {createForm.productIds.map((productId) => (
                <span key={productId} className="badge bg-label-primary">
                  {getProductBadge(productId)}
                  <button
                    type="button"
                    onClick={() => toggleProductSelection("create", productId)}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}

          <div className="d-flex justify-content-end gap-2 mt-4">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={closeCreateModal}
              disabled={createLoading}
            >
              İptal
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={createLoading}
            >
              {createLoading ? "Oluşturuluyor..." : "Base Product Oluştur"}
            </button>
          </div>
        </form>
      </GeneralModal>

      <GeneralModal
        id="baseProductDeleteModal"
        title="Base Product Sil"
        onClose={closeDeleteModal}
        onApprove={handleConfirmDelete}
        approveButtonText="Evet, Sil"
        showFooter
        isLoading={deleteLoading}
      >
        <div className="text-center">
          <i
            className="bx bx-error-circle mb-3"
            style={{ fontSize: "3rem", color: "#ff3e1d" }}
          ></i>
          {deleteTarget ? (
            <>
              <p className="fw-semibold mb-1 text-dark">{deleteTarget.name}</p>
              <p className="text-muted mb-0">
                Bu base product ve tüm varyant ilişkileri silinecek. Devam etmek
                istediğinize emin misiniz?
              </p>
            </>
          ) : (
            <p className="text-muted mb-0">
              Silmek istediğiniz base product seçilemedi.
            </p>
          )}
        </div>
      </GeneralModal>

      <style jsx>{`
        .base-product-list {
          max-height: 75vh;
          overflow-y: auto;
          padding-right: 0.5rem;
        }

        .base-product-item {
          border: 1px solid #eef0f4;
          border-radius: 10px;
          padding: 0.75rem;
          margin-bottom: 0.75rem;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .base-product-item.active {
          border-color: #696cff;
          box-shadow: 0 0 0 2px rgba(105, 108, 255, 0.1);
        }

        .variant-chip-container {
          margin-top: 0.5rem;
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
        }

        .variant-chip {
          background-color: #eef0f4;
          border-radius: 999px;
          padding: 0.15rem 0.65rem;
          font-size: 0.72rem;
          color: #5f6b7b;
          max-width: 100%;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .variant-chip.muted {
          background-color: #f4f5f7;
          color: #98a2b3;
        }

        .product-list {
          border: 1px solid #eef0f4;
          border-radius: 8px;
          max-height: 320px;
          overflow-y: auto;
        }

        .product-option {
          display: flex;
          gap: 0.75rem;
          align-items: flex-start;
          padding: 0.65rem 0.85rem;
          border-bottom: 1px solid #f1f2f6;
          margin: 0;
          cursor: pointer;
        }

        .product-option:last-child {
          border-bottom: none;
        }

        .product-option input {
          margin-top: 0.3rem;
        }

        .product-option .product-info {
          flex: 1;
        }

        .product-option .product-info .title {
          display: block;
          font-weight: 600;
          font-size: 0.875rem;
        }

        .selected-badges {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .selected-badges .badge {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.4rem 0.65rem;
          font-weight: 500;
        }

        .selected-badges .badge button {
          border: none;
          background: transparent;
          color: inherit;
          cursor: pointer;
          padding: 0;
          font-size: 1rem;
          line-height: 1;
        }

        .divider {
          height: 1px;
          background: linear-gradient(
            to right,
            transparent,
            #e0e4ea,
            transparent
          );
        }

        .variant-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
          gap: 0.75rem;
        }

        .variant-card {
          border: 1px solid #eef0f4;
          border-radius: 10px;
          padding: 0.65rem;
          display: flex;
          gap: 0.75rem;
          align-items: center;
        }

        .variant-thumb {
          width: 64px;
          height: 64px;
          border-radius: 8px;
          border: 1px solid #f1f2f6;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          background-color: #fff;
        }

        .variant-details {
          flex: 1;
        }

        .variant-title {
          font-weight: 600;
          font-size: 0.9rem;
          display: inline-block;
        }

        @media (max-width: 991px) {
          .base-product-list {
            max-height: none;
          }
        }
      `}</style>
    </div>
  );
};

export default BaseProductManagementPage;
