"use client";
import { useState, useEffect } from "react";
import {
  useGetSystemSettings,
  useUpdateSystemSettings,
  useGetSystemSettingTypes,
  useCreateSystemSetting,
  useDeleteSystemSetting,
} from "@/hooks/services/settings";
import {
  CreateSettingsRequest,
  Settings,
  SystemSettingType,
} from "@/constants/models/settings";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSave,
  faCog,
  faSpinner,
  faPlus,
  faTrash,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";
import GeneralModal from "@/components/shared/GeneralModal";

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
  const [selectedSettingType, setSelectedSettingType] = useState<number | null>(
    null
  );
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
          setSelectedSettingType(null);
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

          console.log(
            `Updating setting: ${currentSetting.key}, id: ${settingId}`,
            updateRequest
          );
          await updateSystemSettings(updateRequest);
        }
      }

      setChanges({});
      await refetch();
      toast.success("Ayarlar başarıyla güncellendi!");
    } catch (error) {
      console.error("Settings update error:", error);
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
        (type) => type.value === selectedSettingType
      );

      const createRequest = {
        key: selectedSettingType, // Bu zaten integer enum value (0, 1, 2, 3...)
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
      setSelectedSettingType(null);
      setNewSettingValue("");
      setNewSettingDescription("");
      setShowCreateModal(false);

      // Refresh data
      await refetch();
      toast.success("Yeni ayar başarıyla oluşturuldu!");
    } catch (error) {
      console.error("Create setting error:", error);
      toast.error("Ayar oluşturulurken bir hata oluştu!");
    }
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
      console.error("Delete setting error:", error);
      toast.error("Ayar silinirken bir hata oluştu!");
    }
  };

  const getDisplayName = (key: string): string => {
    const settingType = settingTypes.find(
      (type) => type.key === key || type.value === Number(key)
    );
    return settingType?.displayName || key;
  };

  const getInputType = (key: string): string => {
    if (!key || typeof key !== "string") return "text";

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
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="fw-bold text-dark mb-1">
                <FontAwesomeIcon icon={faCog} className="me-3 text-primary" />
                Sistem Ayarları
              </h2>
              <p className="text-muted mb-0">
                Sistem genelinde kullanılan temel ayarları buradan
                yönetebilirsiniz
              </p>
            </div>
            <div className="d-flex gap-2">
              <button
                className="btn btn-success btn-sm px-3"
                onClick={() => setShowCreateModal(true)}
                disabled={isPending || isCreating}
              >
                <FontAwesomeIcon icon={faPlus} className="me-1" />
                Yeni Ayar Ekle
              </button>

              {hasChanges && (
                <button
                  className="btn btn-outline-secondary btn-sm px-3"
                  onClick={handleDiscardChanges}
                  disabled={isPending || isCreating}
                >
                  <i className="fas fa-times me-1"></i>
                  İptal Et
                </button>
              )}

              <button
                className={`btn btn-sm px-3 ${
                  hasChanges ? "btn-primary" : "btn-outline-primary"
                }`}
                onClick={handleSaveChanges}
                disabled={!hasChanges || isPending || isCreating}
              >
                {isPending ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} spin className="me-1" />
                    Kaydediliyor...
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faSave} className="me-1" />
                    {hasChanges ? "Kaydet" : "Kaydedildi"}
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
                        className={`card h-100 shadow-sm border-0 ${
                          changes[`${setting.id}_value`] ||
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
                                className={`form-control ${
                                  changes[`${setting.id}_value`]
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
                              className={`form-control ${
                                changes[`${setting.id}_description`]
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
          setSelectedSettingType(null);
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
              value={selectedSettingType || ""}
              onChange={(e) =>
                setSelectedSettingType(Number(e.target.value) || null)
              }
            >
              <option value="">Ayar türü seçiniz...</option>
              {settingTypes
                .filter(
                  (type) =>
                    !settings.some((setting) => setting.key === type.key)
                )
                .map((type) => (
                  <option key={type.value} value={type.value}>
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
              type="text"
              className="form-control"
              value={newSettingValue}
              onChange={(e) => setNewSettingValue(e.target.value)}
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
