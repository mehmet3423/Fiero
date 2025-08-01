"use client";
import React, { useState, useEffect } from "react";
import { useMainCategoriesLookUp } from "@/hooks/services/categories/useMainCategoriesLookUp";

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
        displayIndex: any; id: string; name: string 
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
}) => {
    // Lookup hook'u kullanarak kategorileri çekiyoruz
    const { categories: lookupCategories } = useMainCategoriesLookUp();

    // Kategorileri belirliyoruz: önce lookup'tan gelen, yoksa prop'tan gelen
    const categories = lookupCategories?.items || propCategories || [];

    console.log('Lookup categories:', lookupCategories);
    console.log('Final categories:', categories);

    const handleFilter = (group: string, value: string) => {
        console.log('Filter triggered:', group, value);
        console.log('Current filters before:', selectedFilters);

        const groupFilters = selectedFilters[group] || [];
        let newFilters: Record<string, string[]> = { ...selectedFilters };
        if (groupFilters.includes(value)) {
            newFilters[group] = groupFilters.filter((v) => v !== value);
        } else {
            newFilters[group] = [...groupFilters, value];
        }

        console.log('New filters after:', newFilters);
        onFilterChange(newFilters);
    };

    // Backend ile entegre specification handler
    const handleSpecificationOptionClick = (optionId: string) => {
        const isCurrentlySelected = selectedSpecificationIds.includes(optionId);
        if (!isCurrentlySelected) {
            onSpecificationChange([...selectedSpecificationIds, optionId]);
        } else {
            onSpecificationChange(selectedSpecificationIds.filter((id) => id !== optionId));
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
        }, {} as Record<string, boolean>)
    });

    const toggleSection = (section: string) => {
        setOpenSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    useEffect(() => {
        if (show && typeof window !== 'undefined') {
            const timer = setTimeout(() => {
                const rangeSlider = document.getElementById("slider-range");

                if (rangeSlider && window.noUiSlider && window.wNumb) {
                    if ((rangeSlider as any).noUiSlider) {
                        (rangeSlider as any).noUiSlider.set([priceRange[0], priceRange[1]]);
                        return;
                    }

                    window.noUiSlider.create(rangeSlider, {
                        start: [priceRange[0], priceRange[1]],
                        step: 100,
                        range: {
                            min: [0],
                            max: [5000],
                        },
                        connect: true,
                    });

                    // Debounce için timer
                    let updateTimer: NodeJS.Timeout;

                    (rangeSlider as any).noUiSlider.on("update", function (values: string[]) {
                        const value1 = document.getElementById("slider-range-value1");
                        const value2 = document.getElementById("slider-range-value2");

                        if (value1) value1.innerHTML = Math.round(parseFloat(values[0])).toString();
                        if (value2) value2.innerHTML = Math.round(parseFloat(values[1])).toString();
                    });

                    (rangeSlider as any).noUiSlider.on("change", function (values: string[]) {
                        clearTimeout(updateTimer);
                        updateTimer = setTimeout(() => {
                            const newRange: [number, number] = [
                                Math.round(parseFloat(values[0])),
                                Math.round(parseFloat(values[1]))
                            ];
                            onPriceRangeChange(newRange);
                        }, 100);
                    });
                }
            }, 100);

            return () => clearTimeout(timer);
        }
    }, [show]);

    useEffect(() => {
        if (show && typeof window !== 'undefined') {
            const rangeSlider = document.getElementById("slider-range");
            if (rangeSlider && (rangeSlider as any).noUiSlider) {
                (rangeSlider as any).noUiSlider.set([priceRange[0], priceRange[1]]);
            }
        }
    }, [priceRange, show]);

    return (
        <div className={`offcanvas offcanvas-start canvas-filter${show ? " show" : ""}`} id="filterShop">
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
                            onClick={() => toggleSection('categories')}
                            aria-expanded={openSections.categories}
                            aria-controls="categories"
                            style={{ cursor: 'pointer' }}
                        >
                            <span>Product categories</span>
                            <span className={`icon ${openSections.categories ? 'icon-arrow-down' : 'icon-arrow-up'}`}></span>
                        </div>
                        <div id="categories" className={`collapse${openSections.categories ? " show" : ""}`}>
                            <ul className="list-categoris current-scrollbar mb_36">
                                {categories.length === 0 ? (
                                    <li className="cate-item">
                                        <span>kategori yok</span>
                                    </li>
                                ) : (
                                    categories
                                        .slice()
                                        .sort((a, b) => a.displayIndex - b.displayIndex) 
                                        .map((cat) => (
                                            <li
                                                className={`cate-item${selectedFilters.category?.includes(cat.id) ? " current" : ""}`}
                                                key={cat.id}
                                            >
                                                <a
                                                    href="#"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        handleFilter("category", cat.id);
                                                    }}
                                                >
                                                    <span>{cat.name && cat.name.trim() !== "" ? cat.name : "kategori"}</span>
                                                </a>
                                            </li>
                                        ))
                                )}
                            </ul>
                        </div>
                    </div>

                    <form action="#" id="facet-filter-form" className="facet-filter-form">
                        {/* Dinamik Backend Specifications */}
                        {subCategorySpecifications.map((spec) => (
                            <div className="widget-facet" key={spec.id}>
                                <div
                                    className="facet-title"
                                    onClick={() => toggleSection(spec.id)}
                                    aria-expanded={openSections[spec.id]}
                                    aria-controls={spec.id}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <span>{spec.name}</span>
                                    <span className={`icon ${openSections[spec.id] ? 'icon-arrow-down' : 'icon-arrow-up'}`}></span>
                                </div>
                                <div id={spec.id} className={`collapse${openSections[spec.id] ? " show" : ""}`}>
                                    <ul className="tf-filter-group current-scrollbar mb_36">
                                        {spec.specificationOptions.map((option) => (
                                            <li className="list-item d-flex gap-12 align-items-center" key={option.id}>
                                                <input
                                                    type="checkbox"
                                                    name={spec.name}
                                                    className="tf-check"
                                                    id={option.id}
                                                    checked={selectedSpecificationIds.includes(option.id)}
                                                    onChange={() => handleSpecificationOptionClick(option.id)}
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
                                onClick={() => toggleSection('price')}
                                aria-expanded={openSections.price}
                                aria-controls="price"
                                style={{ cursor: 'pointer' }}
                            >
                                <span>Price</span>
                                <span className={`icon ${openSections.price ? 'icon-arrow-down' : 'icon-arrow-up'}`}></span>
                            </div>
                            <div id="price" className={`collapse${openSections.price ? " show" : ""}`}>
                                <div className="widget-price">
                                    <div id="slider-range"></div>
                                    <div className="box-title-price">
                                        <span className="title-price">Price :</span>
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
                                onClick={() => toggleSection('availability')}
                                aria-expanded={openSections.availability}
                                aria-controls="availability"
                                style={{ cursor: 'pointer' }}
                            >
                                <span>Availability</span>
                                <span className={`icon ${openSections.availability ? 'icon-arrow-down' : 'icon-arrow-up'}`}></span>
                            </div>
                            <div id="availability" className={`collapse${openSections.availability ? " show" : ""}`}>
                                <ul className="tf-filter-group current-scrollbar mb_36">
                                    <li className="list-item d-flex gap-12 align-items-center">
                                        <input
                                            type="radio"
                                            name="availability"
                                            className="tf-check"
                                            id="availability-1"
                                            onChange={() => handleFilter('availability', 'in-stock')}
                                        />
                                        <label htmlFor="availability-1" className="label">
                                            <span>In stock</span>&nbsp;<span>(14)</span>
                                        </label>
                                    </li>
                                    <li className="list-item d-flex gap-12 align-items-center">
                                        <input
                                            type="radio"
                                            name="availability"
                                            className="tf-check"
                                            id="availability-2"
                                            onChange={() => handleFilter('availability', 'out-of-stock')}
                                        />
                                        <label htmlFor="availability-2" className="label">
                                            <span>Out of stock</span>&nbsp;<span>(2)</span>
                                        </label>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Statik Filtreler - Brand */}
                        <div className="widget-facet">
                            <div
                                className="facet-title"
                                onClick={() => toggleSection('brand')}
                                aria-expanded={openSections.brand}
                                aria-controls="brand"
                                style={{ cursor: 'pointer' }}
                            >
                                <span>Brand</span>
                                <span className={`icon ${openSections.brand ? 'icon-arrow-down' : 'icon-arrow-up'}`}></span>
                            </div>
                            <div id="brand" className={`collapse${openSections.brand ? " show" : ""}`}>
                                <ul className="tf-filter-group current-scrollbar mb_36">
                                    <li className="list-item d-flex gap-12 align-items-center">
                                        <input
                                            type="radio"
                                            name="brand"
                                            className="tf-check"
                                            id="brand-1"
                                            onChange={() => handleFilter('brand', 'ecomus')}
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
                                            onChange={() => handleFilter('brand', 'mh')}
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
    );
};

export default ProductFilterSidebar;