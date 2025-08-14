import { useLanguage } from "@/context/LanguageContext";
interface ConfirmModalProps {
  onConfirm: () => void;
  isLoading?: boolean;
  title?: string;
  message?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
}

function ConfirmModal({
  onConfirm,
  isLoading,
  title,
  message,
  confirmButtonText,
  cancelButtonText,
}: ConfirmModalProps) {
  const { t } = useLanguage(); // useLanguage hook'u burada çağrıldı

  // Varsayılan değerleri burada tanımlıyoruz
  const defaultTitle = title || t("modalProps.confirmTitle");
  const defaultMessage = message || t("modalProps.confirmMessage");
  const defaultConfirmButtonText = confirmButtonText || t("modalProps.confirmButton");
  const defaultCancelButtonText = cancelButtonText || t("modalProps.cancel");
  return (
    <div className="text-center">
      <i
        className="icon-exclamation"
        style={{ fontSize: "3rem", color: "#dc3545" }}
      ></i>
      <h4 className="mt-3">{title}</h4>
      <p className="text-muted">{message}</p>
      <div className="mt-4">
        <button
          type="button"
          className="btn btn-outline-secondary mr-2"
          data-bs-dismiss="modal"
        >
          {defaultCancelButtonText}
        </button>
        <button
          type="button"
          className="btn btn-danger"
          onClick={onConfirm}
          disabled={isLoading}
          data-bs-dismiss="modal"
        >
          {isLoading ? t("confirmModal.deleting") : defaultConfirmButtonText}
        </button>
      </div>
    </div>
  );
}

export default ConfirmModal;
