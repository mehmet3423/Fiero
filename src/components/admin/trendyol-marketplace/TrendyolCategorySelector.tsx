import React, { useState } from 'react';

interface Category {
  id: number;
  name: string;
  subCategories?: Category[];
}

interface TrendyolCategorySelectorProps {
  categories: Category[];
  selectedMainCategory: Category | null;
  selectedSubCategory: Category | null;
  selectedSubSubCategory: Category | null;
  onSelectMainCategory: (category: Category) => void;
  onSelectSubCategory: (category: Category) => void;
  onSelectSubSubCategory: (category: Category) => void;
  onClearSelection: () => void;
  isLoading?: boolean;
  showDropdown: boolean;
  onToggleDropdown: () => void;
  getSelectedCategoryPath: () => string;
}

const TrendyolCategorySelector: React.FC<TrendyolCategorySelectorProps> = ({
  categories,
  selectedMainCategory,
  selectedSubCategory,
  selectedSubSubCategory,
  onSelectMainCategory,
  onSelectSubCategory,
  onSelectSubSubCategory,
  onClearSelection,
  isLoading = false,
  showDropdown,
  onToggleDropdown,
  getSelectedCategoryPath
}) => {
  const [mainCategorySearchTerm, setMainCategorySearchTerm] = useState("");
  const [subCategorySearchTerm, setSubCategorySearchTerm] = useState("");
  const [subSubCategorySearchTerm, setSubSubCategorySearchTerm] = useState("");

  return (
    <div className="position-relative">
      <div
        className="form-control d-flex align-items-center"
        style={{ minHeight: "38px", cursor: "pointer" }}
        onClick={onToggleDropdown}
      >
        {getSelectedCategoryPath() ? (
          <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {getSelectedCategoryPath()}
          </span>
        ) : (
          <span style={{ color: "#6c757d", flex: 1 }}>Kategori seçin...</span>
        )}
        {getSelectedCategoryPath() && (
          <button
            type="button"
            className="btn-close ms-2"
            style={{ fontSize: "0.7em" }}
            onClick={(e) => {
              e.stopPropagation();
              onClearSelection();
            }}
          />
        )}
        <i className="bx bx-chevron-down ms-2"></i>
      </div>

      {showDropdown && (
        <div className="dropdown-menu show w-100" style={{ zIndex: 1050, maxHeight: 400, overflowY: 'auto', minWidth: "600px" }}>
          <div className="p-0">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center p-2 border-bottom">
              <h6 className="mb-0">Kategori Seçiniz</h6>
              <button
                type="button"
                className="btn-close"
                onClick={onToggleDropdown}
              />
            </div>

            {/* Category Selection Area */}
            <div className="d-flex" style={{ minHeight: "300px" }}>
              {/* Main Categories Column */}
              <div className="flex-fill border-end" style={{ minWidth: "200px" }}>
                <div className="p-2 border-bottom">
                  <div className="input-group input-group-sm">
                    <span className="input-group-text">
                      <i className="bx bx-search"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Anahtar Kelime"
                      value={mainCategorySearchTerm}
                      onChange={(e) => setMainCategorySearchTerm(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                </div>
                <div style={{ maxHeight: "250px", overflowY: 'auto' }}>
                  {isLoading ? (
                    <div className="text-center py-3">
                      <div className="spinner-border spinner-border-sm text-primary" role="status">
                        <span className="visually-hidden">Yükleniyor...</span>
                      </div>
                      <small className="d-block mt-2 text-muted">Kategoriler yükleniyor...</small>
                    </div>
                  ) : categories
                    .filter((c: any) => c.name.toLowerCase().includes(mainCategorySearchTerm.toLowerCase()))
                    .map((category: any) => (
                      <div
                        key={category.id}
                        className={`p-2 border-bottom cursor-pointer ${selectedMainCategory?.id === category.id ? 'bg-primary text-white' : ''}`}
                        style={{ cursor: "pointer" }}
                      >
                        <div className="d-flex justify-content-between align-items-center">
                          <span
                            style={{
                              fontSize: "0.875rem",
                              flex: 1,
                              fontWeight: selectedMainCategory?.id === category.id ? "bold" : "normal",
                              color: selectedMainCategory?.id === category.id ? "white" : "inherit"
                            }}
                            onClick={() => onSelectMainCategory(category)}
                          >
                            {category.name}
                          </span>
                          <div className="d-flex align-items-center">
                            {category.subCategories && category.subCategories.length > 0 && (
                              <i
                                className={`bx bx-chevron-right me-2 ${selectedMainCategory?.id === category.id ? 'text-white' : 'text-muted'}`}
                                onClick={() => onSelectMainCategory(category)}
                                style={{ cursor: "pointer" }}
                              ></i>
                            )}
                            <button
                              type="button"
                              className={`btn btn-sm ${selectedMainCategory?.id === category.id ? 'btn-light' : 'btn-primary'}`}
                              onClick={() => onSelectMainCategory(category)}
                              style={{
                                fontSize: "0.7rem",
                                padding: "0.2rem 0.5rem",
                                fontWeight: "bold"
                              }}
                            >
                              Seç
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Sub Categories Column */}
              {selectedMainCategory && (
                <div className="flex-fill border-end" style={{ minWidth: "200px" }}>
                  <div className="p-2 border-bottom">
                    <div className="input-group input-group-sm">
                      <span className="input-group-text">
                        <i className="bx bx-search"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Anahtar Kelime"
                        value={subCategorySearchTerm}
                        onChange={(e) => setSubCategorySearchTerm(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </div>
                  <div style={{ maxHeight: "250px", overflowY: 'auto' }}>
                    {selectedMainCategory.subCategories
                      ?.filter((c: any) => c.name.toLowerCase().includes(subCategorySearchTerm.toLowerCase()))
                      .map((category: any) => (
                        <div
                          key={category.id}
                          className={`p-2 border-bottom cursor-pointer ${selectedSubCategory?.id === category.id ? 'bg-primary text-white' : ''}`}
                          style={{ cursor: "pointer" }}
                        >
                          <div className="d-flex justify-content-between align-items-center">
                            <span
                              style={{
                                fontSize: "0.875rem",
                                flex: 1,
                                fontWeight: selectedSubCategory?.id === category.id ? "bold" : "normal",
                                color: selectedSubCategory?.id === category.id ? "white" : "inherit"
                              }}
                              onClick={() => onSelectSubCategory(category)}
                            >
                              {category.name}
                            </span>
                            <div className="d-flex align-items-center">
                              {category.subCategories && category.subCategories.length > 0 && (
                                <i
                                  className={`bx bx-chevron-right me-2 ${selectedSubCategory?.id === category.id ? 'text-white' : 'text-muted'}`}
                                  onClick={() => onSelectSubCategory(category)}
                                  style={{ cursor: "pointer" }}
                                ></i>
                              )}
                              <button
                                type="button"
                                className={`btn btn-sm ${selectedSubCategory?.id === category.id ? 'btn-light' : 'btn-primary'}`}
                                onClick={() => onSelectSubCategory(category)}
                                style={{
                                  fontSize: "0.7rem",
                                  padding: "0.2rem 0.5rem",
                                  fontWeight: "bold"
                                }}
                              >
                                Seç
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Sub Sub Categories Column */}
              {selectedSubCategory && (
                <div className="flex-fill" style={{ minWidth: "200px" }}>
                  <div className="p-2 border-bottom">
                    <div className="input-group input-group-sm">
                      <span className="input-group-text">
                        <i className="bx bx-search"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Anahtar Kelime"
                        value={subSubCategorySearchTerm}
                        onChange={(e) => setSubSubCategorySearchTerm(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </div>
                  <div style={{ maxHeight: "250px", overflowY: 'auto' }}>
                    {selectedSubCategory.subCategories
                      ?.filter((c: any) => c.name.toLowerCase().includes(subSubCategorySearchTerm.toLowerCase()))
                      .map((category: any) => (
                        <div
                          key={category.id}
                          className={`p-2 border-bottom cursor-pointer ${selectedSubSubCategory?.id === category.id ? 'bg-primary text-white' : ''}`}
                          style={{ cursor: "pointer" }}
                        >
                          <div className="d-flex justify-content-between align-items-center">
                            <span
                              style={{
                                fontSize: "0.875rem",
                                flex: 1,
                                fontWeight: selectedSubSubCategory?.id === category.id ? "bold" : "normal",
                                color: selectedSubSubCategory?.id === category.id ? "white" : "inherit"
                              }}
                              onClick={() => onSelectSubSubCategory(category)}
                            >
                              {category.name}
                            </span>
                            <div className="d-flex align-items-center">
                              {category.subCategories && category.subCategories.length > 0 && (
                                <i
                                  className={`bx bx-chevron-right me-2 ${selectedSubSubCategory?.id === category.id ? 'text-white' : 'text-muted'}`}
                                  onClick={() => onSelectSubSubCategory(category)}
                                  style={{ cursor: "pointer" }}
                                ></i>
                              )}
                              <button
                                type="button"
                                className={`btn btn-sm ${selectedSubSubCategory?.id === category.id ? 'btn-light' : 'btn-primary'}`}
                                onClick={() => onSelectSubSubCategory(category)}
                                style={{
                                  fontSize: "0.7rem",
                                  padding: "0.2rem 0.5rem",
                                  fontWeight: "bold"
                                }}
                              >
                                Seç
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer - Selected Path */}
            {getSelectedCategoryPath() && (
              <div className="p-2 bg-primary text-white">
                <small>
                  <strong>Seçilen:</strong> {getSelectedCategoryPath()}
                </small>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TrendyolCategorySelector; 