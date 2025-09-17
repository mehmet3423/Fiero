import { ReactNode } from "react";

interface GeneralModalProps {
  id: string;
  title: string;
  children: ReactNode;
  onClose?: () => void;
  onApprove?: () => void;
  size?: "sm" | "md" | "lg" | "xl" | "xxl" | "fullscreen";
  showFooter?: boolean;
  approveButtonText?: string;
  isLoading?: boolean;
  formId?: string;
}

function GeneralModal({
  id,
  title,
  children,
  onClose,
  onApprove,
  size = "md",
  showFooter = false,
  approveButtonText = "Onayla",
  isLoading = false,
  formId,
}: GeneralModalProps) {
  return (
    <div className="modal fade" id={id} tabIndex={-1} aria-hidden="true">
      <div
        className={`modal-dialog modal-${size} modal-dialog-centered`}
        role="document"
      >
        <div className="modal-content ">
          <div className="modal-header">
            <h5 className="modal-title" id={`${id}Title`}>
              {title}
            </h5>

            <i
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={onClose}
              className="icon-close"
              style={{ cursor: "pointer", color: "red" }}
            ></i>
          </div>

          <div className="modal-body p-5">{children}</div>

          {showFooter && (
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-outline-secondary"
                data-bs-dismiss="modal"
                onClick={onClose}
              >
                İptal
              </button>
              <button
                type={formId ? "submit" : "button"}
                form={formId}
                className="btn btn-primary"
                onClick={!formId ? onApprove : undefined}
                disabled={isLoading}
              >
                {isLoading ? "İşleniyor..." : approveButtonText}
              </button>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        :global(.modal-xxl) {
          max-width: 95vw !important;
          width: 95vw !important;
        }

        :global(.modal-fullscreen) {
          max-width: 100vw !important;
          width: 100vw !important;
          height: 100vh !important;
          margin: 0 !important;
        }

        :global(.modal-fullscreen .modal-content) {
          height: 100vh !important;
        }
      `}</style>
    </div>
  );
}

export default GeneralModal;
