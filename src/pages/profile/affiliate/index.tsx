import { withProfileLayout } from "../_layout";
import { useState } from "react";
import { useGetMyAffiliateUser } from "@/hooks/services/affiliate/useGetMyAffiliateUser";
import { AffiliateStatus } from "@/constants/models/Affiliate";
import AffiliateStatusPage from "./status";
import AffiliateCollectionsPage from "./collections";
import AffiliateApplicationPage from "./application";
import AffiliatePaymentsPage from "./payment";
import { useLanguage } from "@/context/LanguageContext";

function AffiliatePage() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<
    "status" | "collections" | "payment"
  >("status");

  const {
    affiliateUser,
    isLoading,
    error,
    hasExistingRecord,
    refetchAffiliateUser,
  } = useGetMyAffiliateUser();

  if (isLoading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border" role="status">
          
        </div>
        <span className="sr-only">{t("loading")}</span>
      </div>
    );
  }

  // Show existing record message
  if (hasExistingRecord) {
    return <AffiliateApplicationPage hasExistingRecord={true} />;
  }

  // Show application form if no affiliate user
  if (!affiliateUser) {
    return <AffiliateApplicationPage hasExistingRecord={false} />;
  }

  // Show affiliate dashboard with tabs
  return (
    <div className="affiliate-page">
      <div className="card mb-4">
        <div className="card-body p-0">
          <nav className="nav nav-tabs" style={{ borderBottom: "none" }}>
            <button
              className={`nav-link ${activeTab === "status" ? "active" : ""}`}
              onClick={() => setActiveTab("status")}
              data-tab="status"
              style={{
                border: "none",
                borderRadius: "0",
                padding: "1rem 2rem",
                fontSize: "1.5rem",
                fontWeight: "500",
              }}
            >
              <i className="bx bx-user-check me-2"></i>
              {t("affiliatePage.statusTab")}
            </button>
            {affiliateUser.status === AffiliateStatus.Approved && (
              <button
                className={`nav-link ${activeTab === "collections" ? "active" : ""
                  }`}
                onClick={() => setActiveTab("collections")}
                style={{
                  border: "none",
                  borderRadius: "0",
                  padding: "1rem 2rem",
                  fontSize: "1.5rem",
                  fontWeight: "500",
                }}
              >
                <i className="bx bx-collection me-2"></i>
                {t("affiliatePage.collectionsTab")}
              </button>
            )}
            <button
              className={`nav-link ${activeTab === "payment" ? "active" : ""}`}
              onClick={() => setActiveTab("payment")}
              data-tab="payment"
              style={{
                border: "none",
                borderRadius: "0",
                padding: "1rem 2rem",
                fontSize: "1.5rem",
                fontWeight: "500",
              }}
            >
              <i className="bx bx-credit-card me-2"></i>
              {t("affiliatePage.paymentTab")}
            </button>
          </nav>
        </div>
      </div>

      {activeTab === "status" && (
        <AffiliateStatusPage
          affiliateUser={affiliateUser}
          refetchAffiliateUser={refetchAffiliateUser}
        />
      )}

      {activeTab === "payment" && (
        <AffiliatePaymentsPage affiliateUser={affiliateUser} />
      )}

      {activeTab === "collections" &&
        affiliateUser.status === AffiliateStatus.Approved && (
          <AffiliateCollectionsPage affiliateUserId={affiliateUser.id || ""} />
        )}

      <style jsx>{`
        .affiliate-page {
          padding: 1rem 0;
        }

        .nav-tabs .nav-link {
          color: #566a7f;
          background: transparent;
        }

        .nav-tabs .nav-link.active {
          color: #040404;
          background: #fff;
          border-bottom: 2px solid #040404;
        }

        .nav-tabs .nav-link:hover {
          color: #040404;
          border-color: transparent;
        }

        .card {
          border-radius: 0.75rem;
          border: 1px solid #eee;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
        }

        @media (max-width: 768px) {
          .affiliate-page {
            padding: 0.5rem 0;
          }

          .nav-tabs .nav-link {
            padding: 0.75rem 1rem;
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
}

export default withProfileLayout(AffiliatePage);
