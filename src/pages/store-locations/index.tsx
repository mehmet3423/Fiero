import React, { useState, useEffect } from "react";
import storeData from "./storeData.json";

// Tip tanımı
type Store = {
    name: string;
    city: string;
    mapUrl?: string | null;
    mapQuery: string;
    address?: string;
    phone?: string;
    email?: string;
    map?: string;
    brand?: string;
    workingHours?: Record<string, string>;
};

type CountryStores = {
    country: string;
    stores: Store[];
};

// Verileri hazırlama
const countries: CountryStores[] = storeData.map((countryData) => ({
    ...countryData,
    stores: countryData.stores.map((store) => ({
        ...store,
        brand: store.name.includes("SAMSONITE") ? "SAMSONITE" : "DESA",
        mapUrl: store.mapUrl === null ? undefined : store.mapUrl,
        map:
            (store.mapUrl !== null && store.mapUrl !== undefined && store.mapUrl !== "")
                ? store.mapUrl
                : `https://www.google.com/maps?q=${encodeURIComponent(store.mapQuery)}&output=embed`,
    })),
}));

const StoreLocationsPage: React.FC = () => {
    const [selectedCountry, setSelectedCountry] = useState<string>("Tümü");
    const [selectedCity, setSelectedCity] = useState<string>("Tümü");
    const [selectedBrand, setSelectedBrand] = useState<string>("Tümü");
    const [activeStoreIndex, setActiveStoreIndex] = useState<number>(0);
    const [showDetails, setShowDetails] = useState<boolean>(false);
    const [filteredStores, setFilteredStores] = useState<Store[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");

    useEffect(() => {
        const filteredCountries = selectedCountry === "Tümü"
            ? countries
            : countries.filter((country) => country.country === selectedCountry);

        const filtered = filteredCountries.flatMap((country) =>
            country.stores.filter((store) => {
                const cityMatch = selectedCity === "Tümü" || store.city === selectedCity;
                const brandMatch = selectedBrand === "Tümü" || store.brand === selectedBrand;
                const nameMatch = store.name.toLowerCase().includes(searchTerm.toLowerCase());
                return cityMatch && brandMatch && nameMatch;
            })
        );

        setFilteredStores(filtered);
        setActiveStoreIndex(0);
    }, [selectedCountry, selectedCity, selectedBrand, searchTerm]);

    return (
        <>
            <div className="tf-page-title style-2">
                <div className="container-full">
                    <div className="heading text-center">Mağazalarımız</div>
                </div>
            </div>

            <section className="flat-spacing-16" style={{ paddingTop: "20px", marginTop: "20px" }}>
                <div className="container">
                    <form className="row g-3 justify-content-between align-items-center"
                        style={{
                            padding: "15px",
                            backgroundColor: "#fff",
                            borderRadius: "8px",
                            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                            marginBottom: "20px",
                        }}
                    >
                        {/* Ülke */}
                        <div className="col-md-3">
                            <label htmlFor="country-select" className="form-label" style={{ fontSize: "0.9rem" }}>Ülke</label>
                            <select
                                id="country-select"
                                className="form-select form-select-sm"
                                value={selectedCountry}
                                onChange={(e) => {
                                    setSelectedCountry(e.target.value);
                                    setSelectedCity("Tümü");
                                    setActiveStoreIndex(0);
                                }}
                                style={{ height: "38px", boxShadow: "none", outline: "none" }}
                            >
                                <option value="Tümü">Tümü</option>
                                {countries.map((country) => (
                                    <option key={country.country} value={country.country}>{country.country}</option>
                                ))}
                            </select>
                        </div>

                        {/* Şehir */}
                        <div className="col-md-3">
                            <label htmlFor="city-select" className="form-label" style={{ fontSize: "0.9rem" }}>Şehir</label>
                            <select
                                id="city-select"
                                className="form-select form-select-sm"
                                value={selectedCity}
                                onChange={(e) => {
                                    setSelectedCity(e.target.value);
                                    setActiveStoreIndex(0);
                                }}
                                disabled={selectedCountry === "Tümü"}
                                style={{ height: "38px", boxShadow: "none", outline: "none" }}
                            >
                                <option value="Tümü">Tümü</option>
                                {selectedCountry !== "Tümü" &&
                                    countries
                                        .find((country) => country.country === selectedCountry)
                                        ?.stores.map((store) => store.city)
                                        .filter((city, index, self) => self.indexOf(city) === index)
                                        .map((city) => (
                                            <option key={city} value={city}>{city}</option>
                                        ))}
                            </select>
                        </div>

                        {/* Marka */}
                        <div className="col-md-3">
                            <label htmlFor="brand-select" className="form-label" style={{ fontSize: "0.9rem" }}>Marka</label>
                            <select
                                id="brand-select"
                                className="form-select form-select-sm"
                                value={selectedBrand}
                                onChange={(e) => {
                                    setSelectedBrand(e.target.value);
                                    setActiveStoreIndex(0);
                                }}
                                style={{ height: "38px", boxShadow: "none", outline: "none" }}
                            >
                                <option value="Tümü">Tümü</option>
                                <option value="SAMSONITE">SAMSONITE</option>
                                <option value="DESA">DESA</option>
                            </select>
                        </div>

                        {/* Arama */}
                        <div className="col-md-3">
                            <label htmlFor="search-input" className="form-label" style={{ fontSize: "0.9rem" }}>Mağaza İsmi</label>
                            <input
                                id="search-input"
                                type="text"
                                className="form-control form-control-sm"
                                placeholder="Mağaza ismine göre ara"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{ height: "38px", boxShadow: "none", outline: "none" }}
                            />
                        </div>
                    </form>

                    <div className="row">
                        {!showDetails ? (
                            <div className="col-xl-3 col-md-4 col-12">
                                <div className="tf-store-list d-flex gap-10 flex-column widget-menu-tab"
                                    style={{
                                        height: "600px",
                                        overflowY: "auto",
                                        paddingRight: "8px",
                                    }}
                                >
                                    {filteredStores.map((store, idx) => (
                                        <div
                                            key={store.name + idx}
                                            className={`tf-store-item item-title default ${activeStoreIndex === idx ? 'border-dark' : 'border-secondary'} rounded bg-white shadow-sm`}
                                            style={{
                                                cursor: "pointer",
                                                userSelect: "none",
                                                borderWidth: "2px",
                                                transition: "all 0.3s ease",
                                                padding: "12px",
                                                height: "100px",
                                                display: "flex",
                                                flexDirection: "column",
                                                justifyContent: "center",
                                            }}
                                            onClick={() => {
                                                setActiveStoreIndex(idx);
                                                setShowDetails(true);
                                            }}
                                        >
                                            <h6 className="tf-store-title mb-1" style={{ fontSize: "1rem" }}>{store.name}</h6>
                                            <p className="mb-0 text-muted" style={{ fontSize: "0.9rem" }}>{store.city}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="col-xl-3 col-md-4 col-12">
                                <div className="store-details d-flex flex-column justify-content-between bg-white rounded shadow-sm border p-3"
                                    style={{ height: "600px", position: "relative" }}
                                >
                                    <div style={{ maxWidth: "80%" }}>
                                        <h6 className="text-dark mb-3" style={{ fontSize: "1.2rem" }}>{filteredStores[activeStoreIndex]?.name}</h6>
                                        <p className="text-secondary mb-3"><strong>Adres:</strong> {filteredStores[activeStoreIndex]?.address || "Bilgi yok"}</p>
                                        <p className="text-secondary mb-3"><strong>Telefon:</strong> {filteredStores[activeStoreIndex]?.phone || "Bilgi yok"}</p>
                                        <div style={{ marginBottom: "1rem" }}></div>
                                        <p className="text-secondary mb-3"><strong>Çalışma Saatleri:</strong></p>
                                        <ul className="list-unstyled">
                                            {filteredStores[activeStoreIndex]?.workingHours
                                                ? Object.entries(filteredStores[activeStoreIndex].workingHours).map(([day, hours]) => (
                                                    <li key={day} className="text-dark mb-2">
                                                        <strong>{day}:</strong> {hours}
                                                    </li>
                                                ))
                                                : <li className="text-muted">Bilgi yok</li>}
                                        </ul>
                                    </div>
                                    <button
                                        className="btn btn-light align-self-end mt-3 fw-bold shadow-sm"
                                        style={{ position: "absolute", top: "10px", right: "10px" }}
                                        onClick={() => setShowDetails(false)}
                                    >
                                        Geri
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Harita */}
                        <div className="col-md-8">
                            <div className="widget-content-tab"
                                style={{
                                    height: "600px",
                                    border: "1px solid #ddd",
                                    borderRadius: "8px",
                                    overflow: "hidden",
                                }}
                            >
                                {filteredStores.length > 0 ? (
                                    <iframe
                                        src={filteredStores[activeStoreIndex]?.map}
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0 }}
                                        allowFullScreen
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                        title={filteredStores[activeStoreIndex]?.name}
                                    ></iframe>
                                ) : (
                                    <p style={{ padding: "20px", textAlign: "center" }}>
                                        Mağaza bulunamadı.
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default StoreLocationsPage;
