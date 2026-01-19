"use client";
import React, { useState, useEffect } from "react";
import { useActiveCategories } from "@/hooks/services/categories/useActiveCategories";
import { useSubCategoriesLookUp } from "@/hooks/services/categories/useSubCategoriesLookUp";
import { useLanguage } from "@/context/LanguageContext";
import { GET_SUB_CATEGORY_LOOKUP_LIST } from "@/constants/links";

declare global {
  interface Window {
    noUiSlider: any;
    wNumb: any;
  }
}

interface SpecificationOption {
  id: string;
  value: string;
}

interface Specification {
  id: string;
  name: string;
  specificationOptions: SpecificationOption[];
}

interface ProductFilterSidebarProps {
  categories?: {
    displayIndex: any;
    id: string;
    name: string;
  }[]; // Prop olarak gelen kategoriler
  selectedFilters: Record<string, string[]>;
  show: boolean;
  onClose: () => void;
  onFilterChange: (filters: Record<string, string[]>) => void;
  // Backend ile entegrasyon için yeni props
  subCategorySpecifications?: Specification[];
  selectedSpecificationIds: string[];
  onSpecificationChange: (ids: string[]) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  // Kategori seçimi için yeni props - çoklu seçim
  selectedMainCategoryIds?: string[];
  selectedSubCategoryIds?: string[];
  onMainCategoryChange: (categoryId: string) => void;
  onSubCategoryChange: (subCategoryId: string) => void;
}

const ProductFilterSidebar: React.FC<ProductFilterSidebarProps> = ({
  categories: propCategories, // Prop'tan gelen kategorileri rename ediyoruz
  selectedFilters,
  onFilterChange,
  show,
  onClose,
  subCategorySpecifications = [],
  selectedSpecificationIds,
  onSpecificationChange,
  priceRange,
  onPriceRangeChange,
  selectedMainCategoryIds: propSelectedMainCategoryIds = [],
  selectedSubCategoryIds: propSelectedSubCategoryIds = [],
  onMainCategoryChange,
  onSubCategoryChange,
}) => {
  const { t } = useLanguage();
  // Active categories hook'u kullanarak kategorileri çekiyoruz
  const { categories: activeCategoriesData } = useActiveCategories();
  const activeCategories = activeCategoriesData?.items || [];

  // Kategorileri belirliyoruz: önce active categories'ten gelen, yoksa prop'tan gelen
  const categories =
    (Array.isArray(activeCategories) && activeCategories.length > 0
      ? activeCategories
      : propCategories) || [];

  // Seçili tüm ana kategoriler için alt kategorileri yükle
  const [allSubCategories, setAllSubCategories] = useState<any[]>([]);
  
  useEffect(() => {
    if (propSelectedMainCategoryIds.length === 0) {
      setAllSubCategories([]);
      return;
    }

    // Tüm seçili ana kategoriler için alt kategorileri topla
    const fetchSubCategories = async () => {
      const subCatMap = new Map<string, any>();
      
      for (const mainCatId of propSelectedMainCategoryIds) {
        try {
          const response = await fetch(
            `${GET_SUB_CATEGORY_LOOKUP_LIST}?MainCategoryId=${mainCatId}`
          );
          if (response.ok) {
            const data = await response.json();
            const subCats = data?.data || [];
            subCats.forEach((subCat: any) => {
              // Her alt kategoriye mainCategoryId ekle ve Map'e ekle
              // Aynı ID'ye sahip alt kategori varsa, mainCategoryId'yi array'e çevir veya mevcut olanı koru
              if (subCatMap.has(subCat.id)) {
                // Eğer bu alt kategori başka bir ana kategoriye de aitse, mevcut mainCategoryId'yi koru
                // (Bazı alt kategoriler birden fazla ana kategoriye ait olabilir)
              } else {
                subCatMap.set(subCat.id, {
                  ...subCat,
                  mainCategoryId: mainCatId, // Ana kategori ID'sini ekle
                });
              }
            });
          }
        } catch (error) {
          console.error(`Error fetching subcategories for ${mainCatId}:`, error);
        }
      }
      
      setAllSubCategories(Array.from(subCatMap.values()));
    };

    fetchSubCategories();
  }, [propSelectedMainCategoryIds]);

  const handleFilter = (group: string, value: string) => {
    const groupFilters = selectedFilters[group] || [];
    let newFilters: Record<string, string[]> = { ...selectedFilters };
    if (groupFilters.includes(value)) {
      newFilters[group] = groupFilters.filter((v) => v !== value);
    } else {
      newFilters[group] = [...groupFilters, value];
    }

    onFilterChange(newFilters);
  };

  // Ana kategori toggle - çoklu seçim
  const handleMainCategoryClick = (categoryId: string) => {
    onMainCategoryChange(categoryId);
  };

  // Backend ile entegre specification handler
  const handleSpecificationOptionClick = (optionId: string) => {
    const isCurrentlySelected = selectedSpecificationIds.includes(optionId);
    if (!isCurrentlySelected) {
      onSpecificationChange([...selectedSpecificationIds, optionId]);
    } else {
      onSpecificationChange(
        selectedSpecificationIds.filter((id) => id !== optionId)
      );
    }
  };

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    categories: true,
    availability: true,
    price: true,
    brand: true,
    color: true,
    size: true,
    // Dinamik specification sections
    ...subCategorySpecifications.reduce((acc, spec) => {
      acc[spec.id] = true;
      return acc;
    }, {} as Record<string, boolean>),
  });

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Body scroll kontrolü
  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [show]);

  useEffect(() => {
    if (show && typeof window !== "undefined") {
      // rangle-slider.js scriptini dinamik olarak yükle
      const loadRangeSliderScript = async () => {
        if (!window.noUiSlider || !window.wNumb) {
          try {
            // Script dosyasını dinamik olarak yükle
            const script = document.createElement("script");
            script.src = "/assets/site/js/rangle-slider.js";
            script.async = true;
            document.head.appendChild(script);

            // Script yüklenene kadar bekle
            await new Promise((resolve, reject) => {
              script.onload = resolve;
              script.onerror = reject;
            });
          } catch (error) {
            console.error("Range slider script yüklenemedi:", error);
          }
        }
      };

      const timer = setTimeout(async () => {
        await loadRangeSliderScript();

        const rangeSlider = document.getElementById("slider-range");

        if (rangeSlider && window.noUiSlider && window.wNumb) {
          // Eğer slider zaten varsa, önce yok et ve referansı temizle
          if ((rangeSlider as any).noUiSlider) {
            try {
              (rangeSlider as any).noUiSlider.destroy();
              (rangeSlider as any).noUiSlider = null;
            } catch (e) {
              // Slider zaten destroy edilmiş olabilir
            }
          }

          // Slider'ı tekrar oluşturmadan önce kısa bir bekleme
          setTimeout(() => {
            if (rangeSlider && window.noUiSlider && !(rangeSlider as any).noUiSlider) {
              try {
                window.noUiSlider.create(rangeSlider, {
                  start: [priceRange[0], priceRange[1]],
                  step: 100,
                  range: {
                    min: [0],
                    max: [99999],
                  },
                  connect: true,
                });

                // Debounce için timer
                let updateTimer: NodeJS.Timeout;

                (rangeSlider as any).noUiSlider.on(
                  "update",
                  function (values: string[]) {
                    const value1 = document.getElementById("slider-range-value1");
                    const value2 = document.getElementById("slider-range-value2");

                    if (value1)
                      value1.innerHTML = Math.round(parseFloat(values[0])).toString();
                    if (value2)
                      value2.innerHTML = Math.round(parseFloat(values[1])).toString();
                  }
                );

                (rangeSlider as any).noUiSlider.on(
                  "change",
                  function (values: string[]) {
                    clearTimeout(updateTimer);
                    updateTimer = setTimeout(() => {
                      const newRange: [number, number] = [
                        Math.round(parseFloat(values[0])),
                        Math.round(parseFloat(values[1])),
                      ];
                      onPriceRangeChange(newRange);
                    }, 100);
                  }
                );
              } catch (error) {
                console.error("Slider oluşturulurken hata:", error);
              }
            }
          }, 50);
        }
      }, 100);

      return () => {
        clearTimeout(timer);
        // Cleanup: slider'ı temizle
        const rangeSlider = document.getElementById("slider-range");
        if (rangeSlider && (rangeSlider as any).noUiSlider) {
          try {
            (rangeSlider as any).noUiSlider.destroy();
            (rangeSlider as any).noUiSlider = null;
          } catch (e) {
          }
        }
      };
    }
  }, [show]);

  useEffect(() => {
    if (show && typeof window !== "undefined") {
      const timer = setTimeout(() => {
        const rangeSlider = document.getElementById("slider-range");
        if (rangeSlider && (rangeSlider as any).noUiSlider) {
          try {
            (rangeSlider as any).noUiSlider.set([priceRange[0], priceRange[1]]);
          } catch (error) {
            // Slider henüz hazır değilse veya destroy edildiyse hata vermesin
          }
        }
      }, 150);

      return () => clearTimeout(timer);
    }
  }, [priceRange, show]);

  return (
    <>
      {show && (
        <div
          className="offcanvas-backdrop fade show"
          onClick={onClose}
          style={{ zIndex: 1040 }}
        />
      )}
      <div
        className={`offcanvas offcanvas-start canvas-filter${
          show ? " show" : ""
        }`}
        id="filterShop"
        style={{
          visibility: show ? "visible" : "hidden",
          zIndex: show ? 1045 : -1,
        }}
      >
        <div className="canvas-wrapper">
          <header className="canvas-header">
            <div className="filter-icon">
              <span className="icon icon-filter"></span>
              <span>Filter</span>
            </div>
            <span
              className="icon-close icon-close-popup"
              onClick={onClose}
              aria-label="Close"
            ></span>
          </header>
          <div className="canvas-body">
            {/* Kategoriler - Lookup ile Backend'den */}
            <div className="widget-facet wd-categories">
              <div
                className="facet-title"
                onClick={() => toggleSection("categories")}
                aria-expanded={openSections.categories}
                aria-controls="categories"
                style={{ cursor: "pointer" }}
              >
                <span>{t("productFilter.productCategories")}</span>
                <span
                  className={`icon ${
                    openSections.categories
                      ? "icon-arrow-down"
                      : "icon-arrow-up"
                  }`}
                ></span>
              </div>
              <div
                id="categories"
                className={`collapse${openSections.categories ? " show" : ""}`}
              >
                <ul 
                  className="list-categoris current-scrollbar mb_36"
                  style={{ maxHeight: "500px", overflowY: "auto" }}
                >
                  {categories.length === 0 ? (
                    <li className="cate-item">
                      <span>{t("productFilter.noCategories")}</span>
                    </li>
                  ) : (
                    categories
                      .slice()
                      .sort((a: any, b: any) => a.displayIndex - b.displayIndex)
                      .map((cat: any) => {
                        const isMainCategorySelected = propSelectedMainCategoryIds.includes(cat.id);
                        // Bu ana kategoriye ait alt kategorileri bul
                        const categorySubCategories = allSubCategories.filter(
                          (subCat: any) => subCat.mainCategoryId === cat.id
                        );
                        
                        return (
                          <li
                            className={`cate-item${
                              isMainCategorySelected ? " current" : ""
                            }`}
                            key={cat.id}
                          >
                            <div className="list-item d-flex gap-12 align-items-center">
                              <input
                                type="checkbox"
                                className="tf-check"
                                id={`main-cat-${cat.id}`}
                                checked={isMainCategorySelected}
                                onChange={() => handleMainCategoryClick(cat.id)}
                              />
                              <label
                                htmlFor={`main-cat-${cat.id}`}
                                className="label"
                                style={{ flex: 1, cursor: "pointer" }}
                              >
                                <span>
                                  {cat.name && cat.name.trim() !== ""
                                    ? cat.name
                                    : "kategori"}
                                </span>
                              </label>
                            </div>

                            {/* Alt kategoriler - sadece ana kategori seçiliyse göster */}
                            {isMainCategorySelected &&
                              categorySubCategories.length > 0 && (
                                <ul className="sub-categories mt-2 ms-3">
                                  {categorySubCategories.map((subCat: any) => {
                                    const isSubCategorySelected =
                                      propSelectedSubCategoryIds.includes(subCat.id);
                                    return (
                                      <li
                                        className={`sub-cate-item${
                                          isSubCategorySelected ? " current" : ""
                                        }`}
                                        key={subCat.id}
                                      >
                                        <div className="list-item d-flex gap-12 align-items-center">
                                          <input
                                            type="checkbox"
                                            className="tf-check"
                                            id={`sub-cat-${subCat.id}`}
                                            checked={isSubCategorySelected}
                                            onChange={() => {
                                              onSubCategoryChange(subCat.id);
                                            }}
                                          />
                                          <label
                                            htmlFor={`sub-cat-${subCat.id}`}
                                            className="label"
                                            style={{ cursor: "pointer" }}
                                          >
                                            <span>{subCat.name}</span>
                                          </label>
                                        </div>
                                      </li>
                                    );
                                  })}
                                </ul>
                              )}
                          </li>
                        );
                      })
                  )}
                </ul>
              </div>
            </div>

            <form
              action="#"
              id="facet-filter-form"
              className="facet-filter-form"
            >
              {/* Dinamik Backend Specifications */}
              {subCategorySpecifications.map((spec) => (
                <div className="widget-facet" key={spec.id}>
                  <div
                    className="facet-title"
                    onClick={() => toggleSection(spec.id)}
                    aria-expanded={openSections[spec.id]}
                    aria-controls={spec.id}
                    style={{ cursor: "pointer" }}
                  >
                    <span>{spec.name}</span>
                    <span
                      className={`icon ${
                        openSections[spec.id]
                          ? "icon-arrow-down"
                          : "icon-arrow-up"
                      }`}
                    ></span>
                  </div>
                  <div
                    id={spec.id}
                    className={`collapse${
                      openSections[spec.id] ? " show" : ""
                    }`}
                  >
                    <ul className="tf-filter-group current-scrollbar mb_36">
                      {spec.specificationOptions.map((option) => (
                        <li
                          className="list-item d-flex gap-12 align-items-center"
                          key={option.id}
                        >
                          <input
                            type="checkbox"
                            name={spec.name}
                            className="tf-check"
                            id={option.id}
                            checked={selectedSpecificationIds.includes(
                              option.id
                            )}
                            onChange={() =>
                              handleSpecificationOptionClick(option.id)
                            }
                          />
                          <label htmlFor={option.id} className="label">
                            <span>{option.value}</span>
                          </label>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}

              {/* Fiyat filtresi - Backend entegre */}
              <div className="widget-facet">
                <div
                  className="facet-title"
                  onClick={() => toggleSection("price")}
                  aria-expanded={openSections.price}
                  aria-controls="price"
                  style={{ cursor: "pointer" }}
                >
                  <span>{t("productFilter.price")}</span>
                  <span
                    className={`icon ${
                      openSections.price ? "icon-arrow-down" : "icon-arrow-up"
                    }`}
                  ></span>
                </div>
                <div
                  id="price"
                  className={`collapse${openSections.price ? " show" : ""}`}
                >
                  <div className="widget-price">
                    <div id="slider-range"></div>
                    <div className="box-title-price">
                      <span className="title-price">
                        {t("productFilter.price")} :
                      </span>
                      <div className="caption-price">
                        <div>
                          <span>₺</span>
                          <span id="slider-range-value1"></span>
                        </div>
                        <span>-</span>
                        <div>
                          <span>₺</span>
                          <span id="slider-range-value2"></span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Statik Filtreler - Availability */}
              <div className="widget-facet">
                <div
                  className="facet-title"
                  onClick={() => toggleSection("availability")}
                  aria-expanded={openSections.availability}
                  aria-controls="availability"
                  style={{ cursor: "pointer" }}
                >
                  <span>{t("productFilter.availability")}</span>
                  <span
                    className={`icon ${
                      openSections.availability
                        ? "icon-arrow-down"
                        : "icon-arrow-up"
                    }`}
                  ></span>
                </div>
                <div
                  id="availability"
                  className={`collapse${
                    openSections.availability ? " show" : ""
                  }`}
                >
                  <ul className="tf-filter-group current-scrollbar mb_36">
                    <li className="list-item d-flex gap-12 align-items-center">
                      <input
                        type="radio"
                        name="availability"
                        className="tf-check"
                        id="availability-1"
                        onChange={() =>
                          handleFilter("availability", "in-stock")
                        }
                      />
                      <label htmlFor="availability-1" className="label">
                        <span>{t("productFilter.inStock")}</span>&nbsp;
                        <span>(14)</span>
                      </label>
                    </li>
                    <li className="list-item d-flex gap-12 align-items-center">
                      <input
                        type="radio"
                        name="availability"
                        className="tf-check"
                        id="availability-2"
                        onChange={() =>
                          handleFilter("availability", "out-of-stock")
                        }
                      />
                      <label htmlFor="availability-2" className="label">
                        <span>{t("productFilter.outOfStock")}</span>&nbsp;
                        <span>(2)</span>
                      </label>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Statik Filtreler - Brand */}
              <div className="widget-facet">
                <div
                  className="facet-title"
                  onClick={() => toggleSection("brand")}
                  aria-expanded={openSections.brand}
                  aria-controls="brand"
                  style={{ cursor: "pointer" }}
                >
                  <span>{t("productFilter.brand")}</span>
                  <span
                    className={`icon ${
                      openSections.brand ? "icon-arrow-down" : "icon-arrow-up"
                    }`}
                  ></span>
                </div>
                <div
                  id="brand"
                  className={`collapse${openSections.brand ? " show" : ""}`}
                >
                  <ul className="tf-filter-group current-scrollbar mb_36">
                    <li className="list-item d-flex gap-12 align-items-center">
                      <input
                        type="radio"
                        name="brand"
                        className="tf-check"
                        id="brand-1"
                        onChange={() => handleFilter("brand", "ecomus")}
                      />
                      <label htmlFor="brand-1" className="label">
                        <span>Ecomus</span>&nbsp;<span>(8)</span>
                      </label>
                    </li>
                    <li className="list-item d-flex gap-12 align-items-center">
                      <input
                        type="radio"
                        name="brand"
                        className="tf-check"
                        id="brand-2"
                        onChange={() => handleFilter("brand", "mh")}
                      />
                      <label htmlFor="brand-2" className="label">
                        <span>M&H</span>&nbsp;<span>(8)</span>
                      </label>
                    </li>
                  </ul>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Alt kategori stilleri */}
      <style jsx>{`
        .sub-categories {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .sub-cate-item {
          margin-bottom: 4px;
        }

        .sub-cate-item a {
          color: #666;
          text-decoration: none;
          font-size: 14px;
          padding: 4px 8px;
          display: block;
          border-radius: 4px;
          transition: all 0.2s ease;
        }

        .sub-cate-item a:hover {
          background-color: #f5f5f5;
          color: #333;
        }

        .sub-cate-item.current a {
          background-color: #e3f2fd;
          color: #1976d2;
          font-weight: 500;
        }

        .cate-item.current > a {
          font-weight: 600;
          color: #1976d2;
        }
      `}</style>
    </>
  );
};

export default ProductFilterSidebar;
