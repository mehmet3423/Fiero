import { useState } from "react";
import AffiliateApplicationModal from "@/components/affiliate/AffiliateApplicationModal";

interface AffiliateApplicationPageProps {
  hasExistingRecord?: boolean;
}

export default function AffiliateApplicationPage({
  hasExistingRecord,
}: AffiliateApplicationPageProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (hasExistingRecord) {
    return (
      <div className="affiliate-status-page">
        <div className="card">
          <div className="card-body p-5">
            <div className="text-center mb-4">
              <div className="affiliate-icon mb-4">
                <i className="bx bx-user-check"></i>
              </div>
              <h3
                style={{
                  fontSize: "2rem",
                  color: "#566a7f",
                  marginBottom: "1.5rem",
                  fontWeight: "600",
                }}
              >
                Affiliate Kaydınız Mevcut
              </h3>
            </div>

            <div className="row justify-content-center">
              <div className="col-md-8">
                <div className="text-center mt-4">
                  <button
                    className="btn btn-primary me-3"
                    onClick={() => window.location.reload()}
                  >
                    <i className="bx bx-refresh me-2"></i>
                    Sayfayı Yenile
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          .affiliate-status-page {
            padding: 2rem 0;
          }

          .card {
            border-radius: 0.75rem;
            border: 1px solid #eee;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
          }

          .affiliate-icon {
            width: 120px;
            height: 120px;
            border-radius: 50%;
            background: #e7e7ff;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto;
          }

          .affiliate-icon i {
            font-size: 4rem;
            color: #040404;
          }

          @media (max-width: 768px) {
            .affiliate-status-page {
              padding: 1rem 0;
            }

            .affiliate-icon {
              width: 100px;
              height: 100px;
            }

            .affiliate-icon i {
              font-size: 3rem;
            }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="construction-page" style={{ marginTop: "-100px" }}>
      <div className="card">
        <div className="card-body text-center p-5">
          <div className="construction-icon mb-4">
            <i className="bx bx-user-plus"></i>
          </div>
          <h3
            style={{
              fontSize: "2rem",
              color: "#566a7f",
              marginBottom: "1.5rem",
              fontWeight: "600",
            }}
          >
            Affiliate Programına Katılın!
          </h3>
          <p
            className="text-muted"
            style={{
              fontSize: "1.5rem",
              maxWidth: "700px",
              margin: "0 auto 2rem",
              lineHeight: "1.6",
            }}
          >
            Ürünlerimizi tanıtarak komisyon kazanın. Affiliate programımıza
            katılmak için aşağıdaki butona tıklayın.
          </p>

          <button
            className="btn btn-primary btn-lg"
            onClick={() => setIsModalOpen(true)}
            style={{
              padding: "1rem 2rem",
              fontSize: "1.2rem",
              borderRadius: "0.5rem",
            }}
          >
            <i className="bx bx-user-check me-2"></i>
            Affiliate Onayı Al
          </button>
        </div>
      </div>

      <AffiliateApplicationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <style jsx>{`
        .construction-page {
          padding: 3rem;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 600px;
        }

        .card {
          border-radius: 0.75rem;
          border: 1px solid #eee;
          width: 100%;
          max-width: 800px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
        }

        .construction-icon {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: #e7e7ff;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
          margin-bottom: 2rem;
        }

        .construction-icon i {
          font-size: 4rem;
          color: #040404;
        }

        @media (max-width: 768px) {
          .construction-page {
            padding: 1.5rem;
            min-height: 400px;
          }

          .construction-icon {
            width: 100px;
            height: 100px;
          }

          .construction-icon i {
            font-size: 3rem;
          }
        }
      `}</style>
    </div>
  );
}
