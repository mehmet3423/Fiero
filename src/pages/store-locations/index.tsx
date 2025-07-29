import React, { useState } from "react";
import storeData from "./storeData.json";

// Tip tanımı
type Store = {
    name: string;
    city: string;
    mapUrl?: string;
    mapQuery: string;
    address?: string;
    phone?: string;
    email?: string;
    map?: string;
    brand?: string;
};

type CountryStores = {
    country: string;
    stores: Store[];
};

// Map URL ekleme işlemi ve marka belirleme
const countries: CountryStores[] = storeData.map((countryData) => ({
    ...countryData,
    stores: countryData.stores.map((store) => ({
        ...store,
        brand: store.name.includes("SAMSONITE") ? "SAMSONITE" : "DESA", // Marka belirleme
        map:
            store.mapUrl ||
            `https://www.google.com/maps?q=${encodeURIComponent(store.mapQuery)}&output=embed`,
    })),
}));

const StoreLocationsPage: React.FC = () => {
    const [selectedCountry, setSelectedCountry] = useState<string>("Tümü");
    const [selectedCity, setSelectedCity] = useState<string>("Tümü");
    const [selectedBrand, setSelectedBrand] = useState<string>("Tümü");
    const [activeStoreIndex, setActiveStoreIndex] = useState<number>(0); // Aktif mağaza indeksi

    // Filtrelenmiş mağazalar
    const filteredCountries = selectedCountry === "Tümü"
        ? countries
        : countries.filter((country) => country.country === selectedCountry);

    const filteredStores = filteredCountries.flatMap((country) =>
        country.stores.filter((store) => {
            const cityMatch = selectedCity === "Tümü" || store.city === selectedCity;
            const brandMatch = selectedBrand === "Tümü" || store.brand === selectedBrand;
            return cityMatch && brandMatch;
        })
    );

    return (
        <>
            {/* Page Title */}
            <div className="tf-page-title style-2">
                <div className="container-full">
                    <div className="heading text-center">Mağazalarımız</div>
                </div>
            </div>

            {/* Store locations */}
            <section className="flat-spacing-16" style={{ paddingTop: "20px", marginTop: "20px" }}>
                <div className="container">
                    {/* Filter Form */}
                    <form
                        className="row g-3 justify-content-center align-items-center"
                        style={{
                            padding: "15px",
                            backgroundColor: "#fff",
                            borderRadius: "8px",
                            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                            marginBottom: "20px",
                        }}
                    >
                        {/* Ülke Seçimi */}
                        <div className="col-md-4">
                            <label htmlFor="country-select" className="form-label">
                                Ülke
                            </label>
                            <select
                                id="country-select"
                                className="form-select"
                                value={selectedCountry}
                                onChange={(e) => {
                                    setSelectedCountry(e.target.value);
                                    setSelectedCity("Tümü"); // Ülke değiştiğinde şehir sıfırlanır
                                    setActiveStoreIndex(0); // Aktif mağaza sıfırlanır
                                }}
                            >
                                <option value="Tümü">Tümü</option>
                                {countries.map((country) => (
                                    <option key={country.country} value={country.country}>
                                        {country.country}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Şehir Seçimi */}
                        <div className="col-md-4">
                            <label htmlFor="city-select" className="form-label">
                                Şehir
                            </label>
                            <select
                                id="city-select"
                                className="form-select"
                                value={selectedCity}
                                onChange={(e) => {
                                    setSelectedCity(e.target.value);
                                    setActiveStoreIndex(0); // Aktif mağaza sıfırlanır
                                }}
                                disabled={selectedCountry === "Tümü"}
                            >
                                <option value="Tümü">Tümü</option>
                                {selectedCountry !== "Tümü" &&
                                    countries
                                        .find((country) => country.country === selectedCountry)
                                        ?.stores.map((store) => store.city)
                                        .filter((city, index, self) => self.indexOf(city) === index) // Şehirleri benzersiz yapar
                                        .map((city) => (
                                            <option key={city} value={city}>
                                                {city}
                                            </option>
                                        ))}
                            </select>
                        </div>

                        {/* Marka Seçimi */}
                        <div className="col-md-4">
                            <label htmlFor="brand-select" className="form-label">
                                Marka
                            </label>
                            <select
                                id="brand-select"
                                className="form-select"
                                value={selectedBrand}
                                onChange={(e) => {
                                    setSelectedBrand(e.target.value);
                                    setActiveStoreIndex(0); // Aktif mağaza sıfırlanır
                                }}
                            >
                                <option value="Tümü">Tümü</option>
                                <option value="SAMSONITE">SAMSONITE</option>
                                <option value="DESA">DESA</option>
                            </select>
                        </div>
                    </form>

                    <div className="row">
                        {/* Middle Store List */}
                        <div className="col-xl-3 col-md-4 col-12">
                            <div
                                className="tf-store-list d-flex gap-10 flex-column widget-menu-tab"
                                style={{
                                    height: "450px",
                                    overflowY: "auto",
                                    paddingRight: "8px",
                                }}
                            >
                                {filteredStores.map((store, idx) => {
                                    const isActive = activeStoreIndex === idx;
                                    return (
                                        <div
                                            key={store.name + idx}
                                            className={`tf-store-item item-title default${isActive ? " active" : ""}`}
                                            style={{
                                                cursor: "pointer",
                                                userSelect: "none",
                                                border: isActive ? "2px solid #007bff" : "1px solid #ddd",
                                                borderRadius: "8px",
                                                backgroundColor: isActive ? "#e6f0ff" : "#fff",
                                                color: isActive ? "#000" : "#333",
                                                boxShadow: isActive ? "0 2px 8px rgba(0, 123, 255, 0.2)" : "none",
                                                transition: "all 0.3s ease",
                                                padding: "12px",
                                            }}
                                            onClick={() => setActiveStoreIndex(idx)}
                                        >
                                            <h6
                                                className="tf-store-title d-flex align-items-center gap-2"
                                                style={{ color: isActive ? "#000" : "#333", userSelect: "none" }}
                                            >
                                                <div className="icon">
                                                    <i className="icon-place"></i>
                                                </div>
                                                {store.name}
                                            </h6>

                                            <div className="tf-store-info">
                                                <span>City</span>
                                                <p>{store.city}</p>
                                            </div>

                                            {store.address && (
                                                <div className="tf-store-info">
                                                    <span>Address</span>
                                                    <p>{store.address}</p>
                                                </div>
                                            )}

                                            {store.phone && (
                                                <div className="tf-store-info">
                                                    <span>Phone</span>
                                                    <p>{store.phone}</p>
                                                </div>
                                            )}

                                            {store.email && (
                                                <div className="tf-store-info">
                                                    <span>Email</span>
                                                    <p>{store.email}</p>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Map Display */}
                        <div className="col-md-8">
                            <div
                                className="widget-content-tab"
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