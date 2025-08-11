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
  title = "Emin misiniz?",
  message = "Bu öğeyi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.",
  confirmButtonText = "Evet, Sil",
  cancelButtonText = "İptal",
}: ConfirmModalProps) {
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
          {cancelButtonText}
        </button>
        <button
          type="button"
          className="btn btn-danger"
          onClick={onConfirm}
          disabled={isLoading}
          data-bs-dismiss="modal"
        >
          {isLoading ? "Siliniyor..." : confirmButtonText}
        </button>
      </div>
    </div>
  );
}

export default ConfirmModal;
