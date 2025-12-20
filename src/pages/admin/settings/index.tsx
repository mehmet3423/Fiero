"use client";
import GeneralModal from "@/components/shared/GeneralModal";
import {
  CreateSettingsRequest,
  Settings
} from "@/constants/models/settings";
import {
  useCreateSystemSetting,
  useDeleteSystemSetting,
  useGetSystemSettings,
  useGetSystemSettingTypes,
  useUpdateSystemSettings,
} from "@/hooks/services/settings";
import {
  faCog,
  faExclamationTriangle,
  faPlus,
  faSave,
  faSpinner,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

function SettingsPage() {
  const {
    settings,
    isLoading: settingsLoading,
    refetch,
  } = useGetSystemSettings();
  const { settingTypes, isLoading: typesLoading } = useGetSystemSettingTypes();
  const { updateSystemSettings, isPending } = useUpdateSystemSettings();
  const { createSystemSetting, isPending: isCreating } =
    useCreateSystemSetting();
  const { deleteSystemSetting, isPending: isDeleting } =
    useDeleteSystemSetting();

  const [settingsData, setSettingsData] = useState<Settings[]>([]);
  const [changes, setChanges] = useState<{ [key: string]: string }>({});
  const [hasChanges, setHasChanges] = useState(false);

  // Create modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedSettingType, setSelectedSettingType] = useState<string>("");
  const [newSettingValue, setNewSettingValue] = useState("");
  const [newSettingDescription, setNewSettingDescription] = useState("");

  // Delete modal states
  const [deletingSettingId, setDeletingSettingId] = useState<string | null>(
    null
  );
  const [deletingSettingName, setDeletingSettingName] = useState<string>("");

  useEffect(() => {
    if (settings) {
      // Sadece mevcut settings'leri göster
      setSettingsData(settings);
    }
  }, [settings]);

  useEffect(() => {
    const changesCount = Object.keys(changes).length;
    setHasChanges(changesCount > 0);
  }, [changes]);

  // Modal açma/kapama effect'i
  useEffect(() => {
    if (showCreateModal) {
      const modalElement = document.getElementById("createSettingModal");
      if (
        modalElement &&
        typeof window !== "undefined" &&
        (window as any).bootstrap
      ) {
        const modal = new (window as any).bootstrap.Modal(modalElement);
        modal.show();

        // Modal kapandığında state'i temizle (bir kez ekle)
        const handleHidden = () => {
          setShowCreateModal(false);
          setSelectedSettingType("");
          setNewSettingValue("");
          setNewSettingDescription("");
        };

        modalElement.addEventListener("hidden.bs.modal", handleHidden);

        // Cleanup function
        return () => {
          modalElement.removeEventListener("hidden.bs.modal", handleHidden);
        };
      }
    }
  }, [showCreateModal]);

  // Delete modal açma/kapama effect'i
  useEffect(() => {
    if (deletingSettingId) {
      const modalElement = document.getElementById("deleteSettingModal");
      if (
        modalElement &&
        typeof window !== "undefined" &&
        (window as any).bootstrap
      ) {
        const modal = new (window as any).bootstrap.Modal(modalElement);
        modal.show();

        // Modal kapandığında state'i temizle
        const handleHidden = () => {
          setDeletingSettingId(null);
          setDeletingSettingName("");
        };

        modalElement.addEventListener("hidden.bs.modal", handleHidden);

        // Cleanup function
        return () => {
          modalElement.removeEventListener("hidden.bs.modal", handleHidden);
        };
      }
    }
  }, [deletingSettingId]);

  const handleInputChange = (
    settingId: string,
    field: "value" | "description",
    newValue: string
  ) => {
    // Mevcut ayarlar için API'den gelen original değeri kullan
    const originalSetting = settings.find((s: Settings) => s.id === settingId);
    const originalValue =
      field === "value"
        ? originalSetting?.value || ""
        : originalSetting?.description || "";

    // Sayı validasyonu sadece value field'ı için ve numeric setting'ler için
    if (field === "value" && originalSetting?.key) {
      if (isNumericSetting(originalSetting.key)) {
        // Sadece rakamları ve ondalık noktayı kabul et
        const numericValue = newValue.replace(/[^0-9.]/g, "");

        // Negatif değer kontrolü
        if (numericValue.startsWith("-")) {
          return; // Negatif değer girilmesini engelle
        }

        // Eğer boş değilse ve geçerli bir sayı değilse, sadece geçerli kısmı al
        if (numericValue && isNaN(Number(numericValue))) {
          // Birden fazla ondalık nokta varsa sadece ilkini al
          const parts = numericValue.split(".");
          if (parts.length > 2) {
            newValue = parts[0] + "." + parts.slice(1).join("");
          } else {
            newValue = numericValue;
          }
        } else {
          newValue = numericValue;
        }
      }
    }

    // Eğer değer original'den farklıysa changes'e ekle
    const changeKey = `${settingId}_${field}`;
    if (newValue !== originalValue) {
      setChanges((prev) => ({ ...prev, [changeKey]: newValue }));
    } else {
      // Eğer aynıysa changes'den çıkar
      setChanges((prev) => {
        const newChanges = { ...prev };
        delete newChanges[changeKey];
        return newChanges;
      });
    }

    // UI'da değeri güncelle
    setSettingsData((prev) =>
      prev.map((setting) =>
        setting.id === settingId ? { ...setting, [field]: newValue } : setting
      )
    );
  };

  const handleSaveChanges = async () => {
    if (!hasChanges) return;

    try {
      // Değişiklikleri setting ID'ye göre grupla
      const settingChanges: Record<
        string,
        { value?: string; description?: string }
      > = {};

      Object.entries(changes).forEach(([changeKey, newValue]) => {
        const [settingId, field] = changeKey.split("_");
        if (!settingChanges[settingId]) {
          settingChanges[settingId] = {};
        }
        settingChanges[settingId][field as "value" | "description"] = newValue;
      });

      // Her setting için ayrı ayrı güncelleme yap
      for (const [settingId, updates] of Object.entries(settingChanges)) {
        const currentSetting = settingsData.find(
          (s: Settings) => s.id === settingId
        );

        if (currentSetting) {
          const updateRequest = {
            id: settingId,
            value:
              updates.value !== undefined
                ? updates.value
                : currentSetting.value || "",
            description:
              updates.description !== undefined
                ? updates.description
                : currentSetting.description || "",
          };
          await updateSystemSettings(updateRequest);
        }
      }

      setChanges({});
      await refetch();
      toast.success("Ayarlar başarıyla güncellendi!");
    } catch (error) {
      toast.error("Ayarlar güncellenirken bir hata oluştu!");
    }
  };

  const handleDiscardChanges = () => {
    setChanges({});
    setSettingsData(settings);
    toast.success("Değişiklikler iptal edildi");
  };

  const handleCreateSetting = async () => {
    if (!selectedSettingType || !newSettingValue.trim()) {
      toast.error("Lütfen tüm alanları doldurunuz");
      return;
    }

    try {
      // Seçilen setting type'ının key'ini bul
      const selectedType = settingTypes.find(
        (type) => String(type.value) === selectedSettingType
      );

      const createRequest = {
        key: Number(selectedSettingType), // enum integer
        value: newSettingValue,
        description: newSettingDescription || "",
      };

      await createSystemSetting(createRequest as CreateSettingsRequest);

      // Modal'ı manuel olarak kapat
      const modalElement = document.getElementById("createSettingModal");
      if (
        modalElement &&
        typeof window !== "undefined" &&
        (window as any).bootstrap
      ) {
        const modal = (window as any).bootstrap.Modal.getInstance(modalElement);
        if (modal) {
          modal.hide();
        }
      }

      // Reset form
      setSelectedSettingType("");
      setNewSettingValue("");
      setNewSettingDescription("");
      setShowCreateModal(false);

      // Refresh data
      await refetch();
      toast.success("Yeni ayar başarıyla oluşturuldu!");
    } catch (error) { }
  };

  const handleDeleteSetting = (settingId: string, settingName: string) => {
    setDeletingSettingId(settingId);
    setDeletingSettingName(settingName);
  };

  const handleConfirmDeleteSetting = async () => {
    if (!deletingSettingId) return;

    try {
      await deleteSystemSetting(deletingSettingId);

      // Modal'ı manuel olarak kapat
      const modalElement = document.getElementById("deleteSettingModal");
      if (
        modalElement &&
        typeof window !== "undefined" &&
        (window as any).bootstrap
      ) {
        const modal = (window as any).bootstrap.Modal.getInstance(modalElement);
        if (modal) {
          modal.hide();
        }
      }

      await refetch();
      toast.success("Ayar başarıyla silindi!");
      setDeletingSettingId(null);
      setDeletingSettingName("");
    } catch (error) {
      toast.error("Ayar silinirken bir hata oluştu!");
    }
  };

  const getDisplayName = (key: string): string => {
    const settingType = settingTypes.find(
      (type) => type.key === key || type.value === Number(key)
    );
    return settingType?.displayName || key;
  };

  // Enum value'larına göre sayı kontrolü yapan fonksiyon
  const isNumericSetting = (key: string): boolean => {
    if (!key) return false;

    const settingType = settingTypes.find(
      (type) => type.key === key || type.value === Number(key)
    );

    if (!settingType) return false;

    // 0, 1, 3, 4, 6, 7, 8 index'lerindeki enum'lar sayı olmalı
    const numericEnumValues = [0, 1, 3, 4, 6, 7, 8];
    return numericEnumValues.includes(settingType.value);
  };

  const getInputType = (key: string): string => {
    if (!key || typeof key !== "string") return "text";

    // Enum value'ya göre sayı kontrolü
    if (isNumericSetting(key)) return "number";

    const lowerKey = key.toLowerCase();
    if (lowerKey.includes("email")) return "email";
    if (lowerKey.includes("phone") || lowerKey.includes("tel")) return "tel";
    if (lowerKey.includes("url") || lowerKey.includes("link")) return "url";
    if (
      lowerKey.includes("rate") ||
      lowerKey.includes("percent") ||
      lowerKey.includes("tax")
    )
      return "number";
    if (
      lowerKey.includes("cost") ||
      lowerKey.includes("price") ||
      lowerKey.includes("amount")
    )
      return "number";
    return "text";
  };

  if (settingsLoading || typesLoading) {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-body text-center">
                <FontAwesomeIcon icon={faSpinner} spin className="me-2" />
                Ayarlar yükleniyor...
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      {/* Page Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center flex-column flex-md-row gap-3">
            <div>
              <h2
                className="fw-bold text-dark mb-1"
                style={{ fontSize: "1.5rem" }}
              >
                <FontAwesomeIcon
                  icon={faCog}
                  className="me-2 me-md-3 text-primary"
                />
                Sistem Ayarları
              </h2>
              <p className="text-muted mb-0 small">
                Sistem genelinde kullanılan temel ayarları buradan
                yönetebilirsiniz
              </p>
            </div>
            <div className="d-flex flex-wrap gap-2 justify-content-end">
              <button
                className="btn btn-success btn-sm px-2 px-md-3"
                style={{ fontSize: "0.75rem" }}
                onClick={() => setShowCreateModal(true)}
                disabled={isPending || isCreating}
              >
                <FontAwesomeIcon icon={faPlus} className="me-1" />
                <span className="d-none d-md-inline">Yeni Ayar Ekle</span>
                <span className="d-md-none">Yeni</span>
              </button>

              {hasChanges && (
                <button
                  className="btn btn-outline-secondary btn-sm px-2 px-md-3"
                  style={{ fontSize: "0.75rem" }}
                  onClick={handleDiscardChanges}
                  disabled={isPending || isCreating}
                >
                  <i className="fas fa-times me-1"></i>
                  <span className="d-none d-md-inline">İptal Et</span>
                  <span className="d-md-none">İptal</span>
                </button>
              )}

              <button
                className={`btn btn-sm px-2 px-md-3 ${hasChanges ? "btn-primary" : "btn-outline-primary"
                  }`}
                style={{ fontSize: "0.75rem" }}
                onClick={handleSaveChanges}
                disabled={!hasChanges || isPending || isCreating}
              >
                {isPending ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} spin className="me-1" />
                    <span className="d-none d-md-inline">Kaydediliyor...</span>
                    <span className="d-md-none">Kaydediliyor</span>
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faSave} className="me-1" />
                    {hasChanges ? (
                      <>
                        <span className="d-none d-md-inline">Kaydet</span>
                        <span className="d-md-none">Kaydet</span>
                      </>
                    ) : (
                      <>
                        <span className="d-none d-md-inline">Kaydedildi</span>
                        <span className="d-md-none">Kaydedildi</span>
                      </>
                    )}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Alert Section */}
      {hasChanges && (
        <div className="row mb-4">
          <div className="col-12">
            <div className="alert alert-warning border-0 shadow-sm">
              <div className="d-flex align-items-center">
                <i className="fas fa-exclamation-triangle text-warning me-3 fs-5"></i>
                <div>
                  <strong>Dikkat:</strong> Kaydedilmemiş{" "}
                  {Object.keys(changes).length} değişikliğiniz var.
                  <br />
                  <small className="text-muted">
                    Değişiklikleri kaydetmek için "Değişiklikleri Kaydet"
                    butonuna tıklayın.
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="row">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <div className="row g-4">
                {settingsData.map((setting) => {
                  const displayValue = setting.value || "";

                  return (
                    <div key={setting.id} className="col-md-6 col-xl-4">
                      <div
                        className={`card h-100 shadow-sm border-0 ${changes[`${setting.id}_value`] ||
                            changes[`${setting.id}_description`]
                            ? "border-start border-warning border-4"
                            : ""
                          }`}
                      >
                        <div className="card-body p-4">
                          <div className="d-flex justify-content-between align-items-start mb-3">
                            <h5 className="card-title mb-0 text-dark fw-semibold fs-5">
                              {getDisplayName(setting.key || "")}
                            </h5>
                            <button
                              className="btn btn-outline-danger btn-sm fs-9"
                              onClick={() =>
                                handleDeleteSetting(
                                  setting.id,
                                  getDisplayName(setting.key || "")
                                )
                              }
                              disabled={isPending || isCreating || isDeleting}
                              title="Ayarı Sil"
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </button>
                          </div>

                          <div className="mb-3">
                            <label className="form-label text-secondary small fw-medium mb-2">
                              Değer
                            </label>
                            <div className="input-group">
                              <input
                                type={getInputType(setting.key || "")}
                                inputMode={
                                  getInputType(setting.key || "") === "number"
                                    ? "numeric"
                                    : undefined
                                }
                                min={
                                  isNumericSetting(setting.key || "")
                                    ? "0"
                                    : undefined
                                }
                                step={
                                  isNumericSetting(setting.key || "")
                                    ? "any"
                                    : undefined
                                }
                                className={`form-control ${changes[`${setting.id}_value`]
                                    ? "border-warning"
                                    : ""
                                  }`}
                                value={displayValue}
                                onChange={(e) =>
                                  handleInputChange(
                                    setting.id,
                                    "value",
                                    e.target.value
                                  )
                                }
                                onKeyDown={(e) => {
                                  // Negatif değer girişini engelle (numeric setting'ler için)
                                  if (
                                    isNumericSetting(setting.key || "") &&
                                    (e.key === "-" ||
                                      e.key === "e" ||
                                      e.key === "E")
                                  ) {
                                    e.preventDefault();
                                  }
                                }}
                                placeholder={
                                  !displayValue
                                    ? "Henüz tanımlanmadı - değer giriniz"
                                    : `${getDisplayName(
                                      setting.key || ""
                                    )} değerini düzenleyin`
                                }
                                style={{
                                  borderRadius: "8px",
                                  border: changes[`${setting.id}_value`]
                                    ? "2px solid #ffc107"
                                    : "1px solid #e0e0e0",
                                }}
                              />
                              {getInputType(setting.key || "") === "number" && (
                                <span className="input-group-text bg-light border-start-0">
                                  {setting.key
                                    ?.toLowerCase()
                                    .includes("percent") ||
                                    setting.key?.toLowerCase().includes("rate")
                                    ? "%"
                                    : "₺"}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="mb-3">
                            <label className="form-label text-secondary small fw-medium mb-2">
                              Açıklama
                            </label>
                            <textarea
                              className={`form-control ${changes[`${setting.id}_description`]
                                  ? "border-warning"
                                  : ""
                                }`}
                              value={setting.description || ""}
                              onChange={(e) =>
                                handleInputChange(
                                  setting.id,
                                  "description",
                                  e.target.value
                                )
                              }
                              placeholder="Ayar açıklamasını giriniz..."
                              rows={2}
                              style={{
                                borderRadius: "8px",
                                border: changes[`${setting.id}_description`]
                                  ? "2px solid #ffc107"
                                  : "1px solid #e0e0e0",
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {settingsData.length === 0 && (
                <div className="text-center py-5">
                  <FontAwesomeIcon
                    icon={faCog}
                    size="3x"
                    className="text-muted mb-4"
                  />
                  <h5 className="text-muted mb-3">
                    Henüz sistem ayarı bulunmamaktadır
                  </h5>
                  <p className="text-muted">
                    Sistem ayarları otomatik olarak oluşturulacak ve burada
                    görüntülenecektir.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Create Setting Modal */}
      <GeneralModal
        id="createSettingModal"
        title="Yeni Sistem Ayarı Ekle"
        showFooter={true}
        approveButtonText={isCreating ? "Oluşturuluyor..." : "Oluştur"}
        isLoading={isCreating}
        onApprove={handleCreateSetting}
        onClose={() => {
          setShowCreateModal(false);
          setSelectedSettingType("");
          setNewSettingValue("");
          setNewSettingDescription("");
        }}
        size="md"
      >
        <div className="row">
          <div className="col-12 mb-3">
            <label className="form-label fw-medium">
              <i className="fas fa-cog me-2"></i>
              Ayar Türü *
            </label>
            <select
              className="form-select"
              value={selectedSettingType}
              onChange={(e) => setSelectedSettingType(e.target.value)}
            >
              <option value="">Ayar türü seçiniz...</option>
              {settingTypes
                .filter(
                  (type) =>
                    !settings.some(
                      (setting) => Number(setting.key) === type.value
                    )
                )
                .map((type) => (
                  <option key={type.value} value={String(type.value)}>
                    {type.displayName}
                  </option>
                ))}
            </select>
            <small className="text-muted">
              Sadece henüz oluşturulmamış ayar türleri gösterilmektedir.
            </small>
          </div>

          <div className="col-12 mb-3">
            <label className="form-label fw-medium">
              <i className="fas fa-edit me-2"></i>
              Değer *
            </label>
            <input
              type={
                selectedSettingType &&
                  isNumericSetting(
                    settingTypes.find(
                      (t) => String(t.value) === selectedSettingType
                    )?.key || ""
                  )
                  ? "number"
                  : "text"
              }
              inputMode={
                selectedSettingType &&
                  isNumericSetting(
                    settingTypes.find(
                      (t) => String(t.value) === selectedSettingType
                    )?.key || ""
                  )
                  ? "numeric"
                  : undefined
              }
              min={
                selectedSettingType &&
                  isNumericSetting(
                    settingTypes.find(
                      (t) => String(t.value) === selectedSettingType
                    )?.key || ""
                  )
                  ? "0"
                  : undefined
              }
              step={
                selectedSettingType &&
                  isNumericSetting(
                    settingTypes.find(
                      (t) => String(t.value) === selectedSettingType
                    )?.key || ""
                  )
                  ? "any"
                  : undefined
              }
              className="form-control"
              value={newSettingValue}
              onChange={(e) => {
                let value = e.target.value;

                // Sayı validasyonu (numeric setting'ler için)
                if (
                  selectedSettingType &&
                  isNumericSetting(
                    settingTypes.find(
                      (t) => String(t.value) === selectedSettingType
                    )?.key || ""
                  )
                ) {
                  // Sadece rakamları ve ondalık noktayı kabul et
                  value = value.replace(/[^0-9.]/g, "");

                  // Negatif değer kontrolü
                  if (value.startsWith("-")) {
                    return; // Negatif değer girilmesini engelle
                  }

                  // Birden fazla ondalık nokta varsa sadece ilkini al
                  const parts = value.split(".");
                  if (parts.length > 2) {
                    value = parts[0] + "." + parts.slice(1).join("");
                  }
                }

                setNewSettingValue(value);
              }}
              onKeyDown={(e) => {
                // Negatif değer girişini engelle (numeric setting'ler için)
                if (
                  selectedSettingType &&
                  isNumericSetting(
                    settingTypes.find(
                      (t) => String(t.value) === selectedSettingType
                    )?.key || ""
                  ) &&
                  (e.key === "-" || e.key === "e" || e.key === "E")
                ) {
                  e.preventDefault();
                }
              }}
              placeholder="Ayar değerini giriniz..."
            />
          </div>

          <div className="col-12 mb-3">
            <label className="form-label fw-medium">
              <i className="fas fa-info-circle me-2"></i>
              Açıklama
            </label>
            <textarea
              className="form-control"
              rows={3}
              value={newSettingDescription}
              onChange={(e) => setNewSettingDescription(e.target.value)}
              placeholder="İsteğe bağlı açıklama giriniz..."
            />
          </div>
        </div>
      </GeneralModal>

      {/* Delete Setting Modal */}
      <GeneralModal
        id="deleteSettingModal"
        title="Ayarı Sil"
        size="sm"
        onClose={() => {
          setDeletingSettingId(null);
          setDeletingSettingName("");
        }}
        onApprove={handleConfirmDeleteSetting}
        approveButtonText="Evet, Sil"
        isLoading={isDeleting}
        showFooter={true}
      >
        <div className="text-center">
          <FontAwesomeIcon
            icon={faExclamationTriangle}
            size="3x"
            className="text-danger mb-3"
          />
          <h4 className="mt-3">Emin misiniz?</h4>
          <p className="text-muted">
            <strong>"{deletingSettingName}"</strong> ayarını silmek
            istediğinizden emin misiniz?
          </p>
          <p className="text-muted">
            <small>Bu işlem geri alınamaz.</small>
          </p>
        </div>
      </GeneralModal>
    </div>
  );
}

export default SettingsPage;
