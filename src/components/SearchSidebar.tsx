import { PathEnums } from "@/constants/enums/PathEnums";
import { useSearch } from "@/context/SearchContext";
import { useMainCategoriesLookUp } from "@/hooks/services/categories/useMainCategoriesLookUp";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import { toast } from "react-hot-toast";

interface SearchSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    showResults: boolean;
    setShowResults: (show: boolean) => void;
}

export default function SearchSidebar({
    isOpen,
    onClose,
    searchTerm,
    setSearchTerm,
    showResults,
    setShowResults
}: SearchSidebarProps) {
    const router = useRouter();
    const { searchResults, isSearching } = useSearch();
    const { categories } = useMainCategoriesLookUp();
    const searchRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowResults(false);
                if (!searchTerm) {
                    onClose();
                }
            }
        }

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            return () => document.removeEventListener("mousedown", handleClickOutside);
        }
    }, [searchTerm, isOpen, onClose, setShowResults]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);
        if (value.length >= 3) {
            setShowResults(true);
        } else if (value.length === 0) {
            setShowResults(false);
        }
    };

    const handleResultClick = (productId: string) => {
        router.push(`/products/${productId}`);
        onClose();
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchTerm.length >= 3) {
            router.push(`/products?search=${encodeURIComponent(searchTerm)}`);
            setShowResults(false);
            onClose();
        } else {
            toast.error("En az 3 karakter girmelisiniz");
        }
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop - Gri Arka Plan */}
            <div
                className="search-backdrop "
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    zIndex: 1040,
                    opacity: isOpen ? 1 : 0,
                    visibility: isOpen ? 'visible' : 'hidden',
                    transition: 'opacity 0.3s ease, visibility 0.3s ease',
                    cursor: 'pointer'
                }}
                onClick={onClose}
            ></div>

            {/* SearchSidebar */}
            <div className={`offcanvas offcanvas-end canvas-search ${isOpen ? 'show' : ''}`}
                id="canvasSearch"
                style={{ zIndex: 1050 }}>
                <div ref={searchRef} className="canvas-wrapper">
                    <header className="tf-search-head">
                        <div className="title fw-5">
                            Sitemizde Ara
                            <div className="close">
                                <span
                                    className="icon-close icon-close-popup"
                                    onClick={onClose}
                                    aria-label="Close"
                                    style={{ cursor: 'pointer' }}
                                ></span>
                            </div>
                        </div>
                        <div className="tf-search-sticky">
                            <form className="tf-mini-search-frm" onSubmit={handleSearchSubmit}>
                                <fieldset className="text">
                                    <input
                                        type="text"
                                        placeholder="Ürün ara..."
                                        className=""
                                        name="text"
                                        tabIndex={0}
                                        value={searchTerm}
                                        onChange={handleSearchChange}
                                        aria-required="true"
                                        required
                                        autoFocus
                                    />
                                </fieldset>
                                <button className="" type="submit">
                                    <i className="icon-search"></i>
                                </button>
                            </form>
                        </div>
                    </header>

                    <div className="canvas-body p-0">
                        <div className="tf-search-content">
                            {/* Arama sonuçları varsa göster */}
                            {showResults && (
                                <div className="tf-cart-has-results">
                                    <div className="tf-search-content-title fw-5">Arama Sonuçları</div>

                                    {isSearching ? (
                                        <div className="tf-search-loading">
                                            <i className="icon icon-refresh"></i>
                                            <span>Aranıyor...</span>
                                        </div>
                                    ) : searchResults.length > 0 ? (
                                        <div className="tf-search-hidden-inner">
                                            {searchResults.map((product) => (
                                                <div
                                                    key={product.id}
                                                    className="tf-loop-item"
                                                    onClick={() => handleResultClick(product.id)}
                                                    style={{ cursor: 'pointer' }}
                                                >
                                                    <div className="image">
                                                        <img
                                                            src={product.baseImageUrl || "/assets/site/images/no-image.jpg"}
                                                            alt={product.title}
                                                            onError={(e) => {
                                                                e.currentTarget.src = "/assets/site/images/no-image.jpg";
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="content">
                                                        <div className="product-title">{product.title}</div>
                                                        <div className="tf-product-info-price">
                                                            {product.discountedPrice !== product.price ? (
                                                                <>
                                                                    <div className="compare-at-price">
                                                                        {product.price.toLocaleString("tr-TR", {
                                                                            style: "currency",
                                                                            currency: "TRY",
                                                                        })}
                                                                    </div>
                                                                    <div className="price-on-sale fw-6">
                                                                        {product.discountedPrice.toLocaleString("tr-TR", {
                                                                            style: "currency",
                                                                            currency: "TRY",
                                                                        })}
                                                                    </div>
                                                                </>
                                                            ) : (
                                                                <div className="price fw-6">
                                                                    {product.price.toLocaleString("tr-TR", {
                                                                        style: "currency",
                                                                        currency: "TRY",
                                                                    })}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : searchTerm.length >= 3 ? (
                                        <div className="tf-search-no-results">
                                            <i className="icon icon-search"></i>
                                            <span>Ürün bulunamadı</span>
                                        </div>
                                    ) : searchTerm.length > 0 ? (
                                        <div className="tf-search-no-results">
                                            <i className="icon icon-info"></i>
                                            <span>En az 3 karakter girmelisiniz</span>
                                        </div>
                                    ) : null}
                                </div>
                            )}

                            {/* Arama sonucu yoksa quick links göster */}
                            {!showResults && (
                                <div className="tf-cart-hide-has-results">
                                    <div className="tf-col-quicklink">
                                        <div className="tf-search-content-title fw-5">Hızlı Bağlantılar</div>
                                        <ul className="tf-quicklink-list">
                                            
                                            {categories?.items?.slice(0, 4).map((category) => (
                                                <li key={category.id} className="tf-quicklink-item">
                                                    <Link href={`/products?categoryId=${category.id}`} className="" onClick={onClose}>
                                                        {category.name}
                                                    </Link>
                                                </li>
                                            )) || (
                                                    <li className="tf-quicklink-item">
                                                        <span>Kategoriler yükleniyor...</span>
                                                    </li>
                                                )}
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}