import React from 'react';
import { TrendyolProductAttribute } from '@/constants/models/trendyol/TrendyolProductAttribute';

interface TrendyolProductAttributesProps {
  attributes: TrendyolProductAttribute[];
  categoryAttributes: any;
  attributesLoading: boolean;
  selectedSubCategory: any;
  selectedSubSubCategory: any;
  selectedMainCategory: any;
  onUpdateAttribute: (index: number, field: keyof TrendyolProductAttribute, value: any) => void;
  onRemoveAttribute: (index: number) => void;
  onAddAttribute: () => void;
}

const TrendyolProductAttributes: React.FC<TrendyolProductAttributesProps> = ({
  attributes,
  categoryAttributes,
  attributesLoading,
  selectedSubCategory,
  selectedSubSubCategory,
  selectedMainCategory,
  onUpdateAttribute,
  onRemoveAttribute,
  onAddAttribute
}) => {
  // Check if main category is selected but no sub category
  const showMainCategoryInfo = selectedMainCategory && !selectedSubCategory;

  // Check if category is selected but not lowest level
  const showCategorySelectionInfo = selectedSubCategory &&
    selectedSubCategory.subCategories &&
    selectedSubCategory.subCategories.length > 0 &&
    !selectedSubSubCategory;

  // Check if we should show attributes section (only when we have the lowest level category)
  const shouldShowAttributes = selectedSubSubCategory ||
    (selectedSubCategory && (!selectedSubCategory.subCategories || selectedSubCategory.subCategories.length === 0));

  // Priority order: Main category info > Sub category info > Attributes
  if (showMainCategoryInfo) {
    return (
      <div className="col-12">
        <div className="card border-0 shadow-sm" style={{ backgroundColor: "#f8f9fc", border: "1px solid #e3e6f0" }}>
          <div className="card-body p-4">
            <div className="d-flex align-items-center mb-3">
              <i className="bx bx-list-ul text-primary me-2" style={{ fontSize: "1.2rem" }}></i>
              <h6 className="mb-0 fw-bold text-primary">Ürün Nitelikleri</h6>
            </div>
            <div className="col-12">
              <div className="card border-0 shadow-sm" style={{ backgroundColor: "#f8f9fc", border: "1px solid #e3e6f0" }}>
                <div className="card-body p-3">
                  <div className="d-flex align-items-center">
                    <i className="bx bx-info-circle text-danger me-2" style={{ fontSize: "1rem" }}></i>
                    <small className="text-danger" style={{ fontStyle: "italic", fontSize: "0.875rem" }}>
                      <strong>Alt kategori seçimi gerekli!</strong> <strong>{selectedMainCategory.name}</strong> ana kategorisini seçtiniz. Nitelikleri görebilmek için <strong>alt kategoriyi</strong> seçmeniz gerekmektedir.
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showCategorySelectionInfo) {
    return (
      <div className="col-12">
        <div className="card border-0 shadow-sm" style={{ backgroundColor: "#f8f9fc", border: "1px solid #e3e6f0" }}>
          <div className="card-body p-4">
            <div className="d-flex align-items-center mb-3">
              <i className="bx bx-list-ul text-primary me-2" style={{ fontSize: "1.2rem" }}></i>
              <h6 className="mb-0 fw-bold text-primary">Ürün Nitelikleri</h6>
            </div>
            <div className="col-12">
              <div className="card border-0 shadow-sm" style={{ backgroundColor: "#f8f9fc", border: "1px solid #e3e6f0" }}>
                <div className="card-body p-3">
                  <div className="d-flex align-items-center">
                    <i className="bx bx-info-circle text-danger me-2" style={{ fontSize: "1rem" }}></i>
                    <small className="text-danger" style={{ fontStyle: "italic", fontSize: "0.875rem" }}>
                      <strong>Nitelikleri görmek için en alt kategoriyi seçin!</strong> Şu anda <strong>{selectedSubCategory.name}</strong> kategorisini seçtiniz. Bu kategorinin alt kategorileri var. Nitelikleri görebilmek için <strong>en alt seviyedeki kategoriyi</strong> seçmeniz gerekmektedir.
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!shouldShowAttributes) {
    return null;
  }

  return (
    <div className="col-12">
      <div className="card border-0 shadow-sm" style={{ backgroundColor: "#f8f9fc", border: "1px solid #e3e6f0" }}>
        <div className="card-body p-4">
          <div className="d-flex align-items-center mb-3">
            <i className="bx bx-list-ul text-primary me-2" style={{ fontSize: "1.2rem" }}></i>
            <h6 className="mb-0 fw-bold text-primary">Ürün Nitelikleri</h6>
          </div>

          {attributesLoading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Yükleniyor...</span>
              </div>
              <p className="mt-2 text-muted">Kategori nitelikleri yükleniyor...</p>
            </div>
          ) : (categoryAttributes as any)?.data?.categoryAttributes && (categoryAttributes as any).data.categoryAttributes.length > 0 ? (
            <>
              <div className="mb-3">
                <small className="text-muted" style={{ fontStyle: "italic", fontSize: "0.75rem" }}>
                  <i className="bx bx-info-circle me-1"></i>
                  Özel değer alanını isterseniz doldurabilir, isterseniz boş bırakabilirsiniz
                </small>
              </div>

              {attributes.map((attribute, index) => (
                <div key={index} className="row g-3 mb-4 p-3 border rounded position-relative" style={{ backgroundColor: "#fff" }}>
                  <div className="col-md-4">
                    <label className="form-label">NİTELİK</label>
                    <select
                      className="form-select"
                      value={attribute.attributeId}
                      onChange={(e) => onUpdateAttribute(index, 'attributeId', parseInt(e.target.value))}
                    >
                      <option value={0}>Nitelik seçin</option>
                      {(categoryAttributes as any)?.data?.categoryAttributes
                        ?.filter((attr: any) => {
                          // Mevcut seçili nitelik ID'lerini al
                          const selectedAttributeIds = attributes
                            .map(attr => attr.attributeId)
                            .filter(id => id !== 0);

                          // Bu nitelik henüz seçilmemişse veya bu satırda seçiliyse göster
                          return !selectedAttributeIds.includes(attr.attribute.id) ||
                            attr.attribute.id === attribute.attributeId;
                        })
                        ?.map((attr: any) => (
                          <option key={attr.attribute.id} value={attr.attribute.id}>{attr.attribute.name}</option>
                        ))}
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">DEĞER</label>
                    {(() => {
                      const selectedCategoryAttribute = (categoryAttributes as any)?.data?.categoryAttributes?.find((attr: any) => attr.attribute.id === attribute.attributeId);
                      const availableValues = selectedCategoryAttribute?.attributeValues || [];

                      return (
                        <>
                          <select
                            className="form-select"
                            value={attribute.attributeValueId || ""}
                            onChange={(e) => onUpdateAttribute(index, 'attributeValueId', e.target.value ? parseInt(e.target.value) : undefined)}
                            disabled={!attribute.attributeId || attribute.attributeId === 0}
                          >
                            <option value="">Değer seçin</option>
                            {availableValues.map((value: any) => (
                              <option key={value.id} value={value.id}>{value.name}</option>
                            ))}
                          </select>
                          {!attribute.attributeId || attribute.attributeId === 0 ? (
                            <small className="text-muted" style={{ fontStyle: "italic", fontSize: "0.75rem" }}>
                              <i className="bx bx-info-circle me-1"></i>
                              Önce nitelik seçin
                            </small>
                          ) : availableValues.length === 0 ? (
                            <small className="text-warning" style={{ fontStyle: "italic", fontSize: "0.75rem" }}>
                              <i className="bx bx-exclamation-triangle me-1"></i>
                              Bu nitelik için değer bulunamadı
                            </small>
                          ) : (
                            <small className="text-muted" style={{ fontStyle: "italic", fontSize: "0.75rem" }}>
                              <i className="bx bx-info-circle me-1"></i>
                              {availableValues.length} değer mevcut
                            </small>
                          )}
                        </>
                      );
                    })()}
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">ÖZEL DEĞER</label>
                    <input
                      type="text"
                      className="form-control"
                      value={attribute.customAttributeValue || ""}
                      onChange={(e) => onUpdateAttribute(index, 'customAttributeValue', e.target.value)}
                      placeholder="Özel değer (opsiyonel)"
                    />
                  </div>
                  <button
                    type="button"
                    className="btn btn-outline-danger btn-sm position-absolute"
                    style={{
                      top: "-16px",
                      right: "0px",
                      zIndex: 10,
                      borderRadius: "4px",
                      width: "24px",
                      height: "24px",
                      padding: "0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#fff",
                      border: "1px solid #dc3545",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                      fontSize: "14px",
                      fontWeight: "bold",
                      transition: "all 0.2s ease"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#dc3545";
                      e.currentTarget.style.color = "#fff";
                      e.currentTarget.style.borderColor = "#dc3545";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#fff";
                      e.currentTarget.style.color = "#dc3545";
                      e.currentTarget.style.borderColor = "#dc3545";
                    }}
                    onClick={() => onRemoveAttribute(index)}
                  >
                    <i className="bx bx-x" style={{ fontSize: "16px" }}></i>
                  </button>
                </div>
              ))}

              <button
                type="button"
                className="btn btn-outline-primary btn-sm"
                onClick={onAddAttribute}
              >
                <i className="bx bx-plus me-1"></i>
                Nitelik Ekle
              </button>
            </>
          ) : (
            <div className="col-12">
              <div className="card border-0 shadow-sm" style={{ backgroundColor: "#f8f9fc", border: "1px solid #e3e6f0" }}>
                <div className="card-body p-3">
                  <div className="d-flex align-items-center">
                    <i className="bx bx-info-circle text-warning me-2" style={{ fontSize: "1rem" }}></i>
                    <small className="text-warning" style={{ fontStyle: "italic", fontSize: "0.875rem" }}>
                      <strong>Seçilen kategori için nitelik bulunamadı.</strong> Bu durumda ürün niteliklerini atlayarak diğer işlemlere devam edebilirsiniz.
                    </small>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrendyolProductAttributes; 