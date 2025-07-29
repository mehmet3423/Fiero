import { useState } from "react";
import { useSendEmailConfirmation } from "@/hooks/services/useSendEmailConfirmation";
import { useAuth } from "@/hooks/context/useAuth";

interface EmailConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string;
}

function EmailConfirmationModal({
  isOpen,
  onClose,
  userEmail,
}: EmailConfirmationModalProps) {
  const { handleSendEmailConfirmation, isPending } = useSendEmailConfirmation();
  const { handleLogout } = useAuth();
  const [emailSent, setEmailSent] = useState(false);

  const handleSendEmail = async () => {
    await handleSendEmailConfirmation(userEmail, () => {
      setEmailSent(true);
    });
  };

  const handleClose = () => {
    setEmailSent(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="modal fade show"
      style={{ display: "block", backgroundColor: "rgba(0,0,0,0.8)" }}
      tabIndex={-1}
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              <i
                className="icon-exclamation-triangle me-2"
                style={{ color: "#dc3545" }}
              ></i>
              E-posta Onayı
            </h5>
            {/* Close button removed - modal is mandatory */}
          </div>

          <div className="modal-body text-center p-4">
            {!emailSent ? (
              <>
                <div className="mb-4">
                  <i
                    className="icon-exclamation-triangle"
                    style={{ fontSize: "3rem", color: "#ffc107" }}
                  ></i>
                </div>
                <h4 className="mb-3">Hesabınızı onayladınız mı?</h4>
                <p className="text-muted mb-4">
                  <strong>
                    Siteyi kullanmaya devam etmek için e-posta adresinizi
                    onaylamanız gerekmektedir.
                  </strong>
                  <br />
                  <br />
                  Henüz onay maili almadınız mı?
                </p>
                <div className="d-grid gap-2">
                  <button
                    type="button"
                    className="btn btn-warning mr-3"
                    onClick={handleSendEmail}
                    disabled={isPending}
                  >
                    {isPending ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Gönderiliyor...
                      </>
                    ) : (
                      <>Onay Maili Gönder</>
                    )}
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-danger"
                    onClick={handleLogout}
                  >
                    Çıkış Yap
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="mb-4">
                  <i
                    className="icon-check-circle"
                    style={{ fontSize: "3rem", color: "#28a745" }}
                  ></i>
                </div>
                <h4 className="mb-3 text-success">E-posta Gönderildi!</h4>
                <p className="text-muted mb-4">
                  Onay e-postası başarıyla gönderildi. Lütfen e-posta kutunuzu
                  kontrol edin ve onay linkine tıklayarak hesabınızı
                  aktifleştirin.
                </p>
                <div className="alert alert-primary mb-4">
                  <i className="icon-exclamation-triangle me-2"></i>
                  <small>
                    <strong>
                      E-posta onayı tamamlanana kadar bu pencere açık
                      kalacaktır.
                    </strong>
                    <br />
                    E-postanızı kontrol edip onay linkine tıklayın.
                  </small>
                </div>
                <div className="d-grid gap-2">
                  <button
                    type="button"
                    className="btn btn-warning"
                    onClick={handleSendEmail}
                    disabled={isPending}
                  >
                    <i className="icon-refresh me-2"></i>
                    Tekrar Gönder
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-danger "
                    onClick={handleLogout}
                  >
                    <i className="icon-sign-out me-2"></i>
                    Çıkış Yap
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmailConfirmationModal;
