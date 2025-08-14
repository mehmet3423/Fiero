import { useState, useEffect } from "react";
import { AffiliateUser } from "@/constants/models/Affiliate";
import { useGetAffiliatePayouts } from "@/hooks/services/affiliate/useGetAffiliatePayouts";
import { useCreatePayoutRequest } from "@/hooks/services/affiliate/useCreatePayoutRequest";
import { useTransferEligibleCommissions } from "@/hooks/services/affiliate/useTransferEligibleCommissions";
import { toast } from "react-hot-toast";
import { useLanguage } from "@/context/LanguageContext";

interface AffiliatePaymentPageProps {
  affiliateUser: AffiliateUser;
}


export default function AffiliatePaymentPage({
  affiliateUser,
}: AffiliatePaymentPageProps) {
  const { t } = useLanguage();
  const [page, setPage] = useState(1);
  const [requestAmount, setRequestAmount] = useState<string>("");
  const [showPayoutForm, setShowPayoutForm] = useState(false);


  const getPayoutStatusText = (status: number): string => {
    switch (status) {
      case 0:
        return t("affiliatePayment.payoutStatusPending");
      case 1:
        return t("affiliatePayment.payoutStatusApproved");
      case 2:
        return t("affiliatePayment.payoutStatusRejected");
      case 3:
        return t("affiliatePayment.payoutStatusPaid");
      default:
        return t("unknown");
    }
  };

  const getPayoutStatusColor = (status: number): string => {
    switch (status) {
      case 0:
        return "warning";
      case 1:
        return "success";
      case 2:
        return "danger";
      case 3:
        return "primary";
      default:
        return "secondary";
    }
  };

  const {
    payouts,
    totalCount,
    isLoading: payoutsLoading,
    refetch,
  } = useGetAffiliatePayouts(page, 10);
  const { createPayoutRequest, isPending: isCreatingPayout } =
    useCreatePayoutRequest();
  const { transferEligibleCommissions, isPending: isTransferring } =
    useTransferEligibleCommissions();

  // Calculate transferable amount
  const transferableAmount = affiliateUser.transferableEarnings || 0;
  const pendingAmount = affiliateUser.pendingApprovalEarnings || 0;
  const transferredAmount = affiliateUser.transferredEarnings || 0;
  const totalSales = affiliateUser.totalSales || 0;

  // Auto-calculate eligible commissions on component mount
  useEffect(() => {
    const calculateEligibleCommissions = async () => {
      try {
        await transferEligibleCommissions({});
      } catch (error) {
        console.error("Failed to calculate eligible commissions:", error);
      }
    };

    calculateEligibleCommissions();
  }, []);

  const handleCreatePayoutRequest = async () => {
    if (!requestAmount || parseFloat(requestAmount) <= 0) {
      alert(t("affiliatePayment.invalidAmount"));
      return;
    }

    const amount = parseFloat(requestAmount);
    if (amount > transferableAmount) {
      toast.error(
        t("affiliatePayment.amountExceedsTransferable")
      );
      return;
    }

    try {
      await createPayoutRequest({
        affiliateUserId: affiliateUser.id || "",
        requestedAmount: amount,
      });
      setRequestAmount("");
      setShowPayoutForm(false);
      refetch();
    } catch (error) {
      console.error("Failed to create payout request:", error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="affiliate-payment-page">
      {/* Statistics Cards */}
      <div className="row mb-4">
        <div className="col-3">
          <div className="card h-100 text-center shadow-sm border-0 rounded-4 transition-all">
            <div className="card-body py-3 px-2">
              <div className="card-icon mb-2">
                <i className="bx bx-shopping-bag text-muted" style={{ fontSize: "2.5rem" }}></i>
              </div>
              <h6 className="card-title text-uppercase text-muted mb-1 fw-bold" style={{ fontSize: "0.7rem", letterSpacing: "0.5px" }}>
                {t("affiliatePayment.totalSales")}
              </h6>
              <h4 className="text-dark mb-0 fw-bold" style={{ fontSize: "1.5rem" }}>
                {totalSales.toFixed(2)} ₺
              </h4>
            </div>
          </div>
        </div>

        <div className="col-3">
          <div className="card h-100 text-center shadow-sm border-0 rounded-4 transition-all">
            <div className="card-body py-3 px-2">
              <div className="card-icon mb-2">
                <i className="bx bx-money text-info" style={{ fontSize: "2.5rem" }}></i>
              </div>
              <h6 className="card-title text-uppercase text-muted mb-1 fw-bold" style={{ fontSize: "0.7rem", letterSpacing: "0.5px" }}>
                {t("affiliatePayment.transferable")}
              </h6>
              <h4 className="text-info mb-0 fw-bold" style={{ fontSize: "1.5rem" }}>
                {transferableAmount.toFixed(2)} ₺
              </h4>
            </div>
          </div>
        </div>

        <div className="col-3">
          <div className="card h-100 text-center shadow-sm border-0 rounded-4 transition-all">
            <div className="card-body py-3 px-2">
              <div className="card-icon mb-2">
                <i className="bx bx-time-five text-warning" style={{ fontSize: "2.5rem" }}></i>
              </div>
              <h6 className="card-title text-uppercase text-muted mb-1 fw-bold" style={{ fontSize: "0.7rem", letterSpacing: "0.5px" }}>
                {t("affiliatePayment.pendingApproval")}
              </h6>
              <h4 className="text-warning mb-0 fw-bold" style={{ fontSize: "1.5rem" }}>
                {pendingAmount.toFixed(2)} ₺
              </h4>
            </div>
          </div>
        </div>

        <div className="col-3">
          <div className="card h-100 text-center shadow-sm border-0 rounded-4 transition-all">
            <div className="card-body py-3 px-2">
              <div className="card-icon mb-2">
                <i className="bx bx-check-circle text-success" style={{ fontSize: "2.5rem" }}></i>
              </div>
              <h6 className="card-title text-uppercase text-muted mb-1 fw-bold" style={{ fontSize: "0.7rem", letterSpacing: "0.5px" }}>
                {t("affiliatePayment.transferred")}
              </h6>
              <h4 className="text-success mb-0 fw-bold" style={{ fontSize: "1.5rem" }}>
                {transferredAmount.toFixed(2)} ₺
              </h4>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {affiliateUser.status === 5 ? (
        <div className="row">
          <div className="col-12">
            <div className="card shadow-sm border-0 rounded-4">
              <div className="card-body text-center py-4">
                <div className="card-icon mb-3">
                  <i className="bx bx-block text-danger" style={{ fontSize: "3rem" }}></i>
                </div>
                <h6 className="text-danger mb-2 fw-bold">{t("affiliatePayment.accountSuspended")}</h6>
                <small className="text-muted">
                  {t("affiliatePayment.affiliateSuspendedMessage")}
                </small>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="row">
          <div className="col-12">
            <div className="card shadow-sm border-0 rounded-4">
              <div className="card-body p-3">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="mb-1 fw-bold text-dark">{t("affiliatePayment.createPayoutRequestTitle")}</h6>
                    <small className="text-muted">
                      {t("affiliatePayment.createPayoutRequestMessage")}
                    </small>
                  </div>
                  <button
                    className="btn btn-dark rounded-pill px-3 py-2"
                    onClick={() => setShowPayoutForm(!showPayoutForm)}
                    disabled={false}
                  >
                    <i className="bx bx-plus me-2"></i>
                    {t("affiliatePayment.newRequestButton")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payout Request Form */}
      {showPayoutForm && affiliateUser.status !== 5 && (
        <div className="row mb-4">
          <div className="col-12">
            <div className="card shadow-sm border-0 rounded-4">
              <div className="card-body p-3">
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label fw-semibold text-dark">
                        {t("affiliatePayment.requestAmountLabel")}
                      </label>
                      <input
                        type="number"
                        className="form-control shadow-none border rounded-pill px-3"
                        value={requestAmount}
                        onChange={(e) => setRequestAmount(e.target.value)}
                        min="0"
                        max={transferableAmount}
                        step="0.01"
                        placeholder="0.00"
                      />
                      <small className="text-muted">
                        {t("affiliatePayment.maxAmount")}: {transferableAmount.toFixed(2)} ₺
                      </small>
                    </div>
                  </div>
                </div>
                <div className="d-flex gap-3">
                  <button
                    className="btn btn-dark rounded-pill px-3 py-2"
                    onClick={handleCreatePayoutRequest}
                    disabled={isCreatingPayout || !requestAmount}
                  >
                    {isCreatingPayout ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                        ></span>
                        {t("affiliatePayment.creatingRequest")}
                      </>
                    ) : (
                      <>
                        <i className="bx bx-check me-2"></i>
                        {t("affiliatePayment.createRequestButton")}
                      </>
                    )}
                  </button>
                  <button
                    className="btn btn-outline-secondary rounded-pill px-3 py-2"
                    onClick={() => {
                      setShowPayoutForm(false);
                      setRequestAmount("");
                    }}
                  >
                    {t("affiliatePayment.cancelButton")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payout Requests Table */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="card shadow-sm border-0 rounded-4">
            <div className="card-header bg-white border-bottom d-flex justify-content-between align-items-center py-2">
              <h6 className="mb-0 fw-bold text-dark">
                <i className="bx bx-receipt me-2"></i>
                {t("affiliatePayment.payoutRequestsTitle")}
              </h6>
              <span className="badge bg-light text-dark border rounded-pill px-2 py-1">
                <i className="bx bx-list-ul me-1"></i>
                {payouts.length} {t("affiliatePayment.payoutRequestsCount")}
              </span>
            </div>
            <div className="card-body p-0">
              {payoutsLoading ? (
                <div className="text-center py-3">
                  <div className="spinner-border text-dark" role="status">
                    
                  </div>
                  <span className="sr-only">{t("affiliatePayment.loading")}</span>
                  <p className="text-muted mt-2 mb-0">{t("affiliatePayment.loadingPayoutRequests")}</p>
                </div>
              ) : payouts.length === 0 ? (
                <div className="text-center py-3">
                  <div className="empty-state">
                    <i className="bx bx-receipt text-muted mb-2" style={{ fontSize: "3rem" }}></i>
                    <h6 className="mt-2 text-muted fw-bold">
                      {t("affiliatePayment.noPayoutRequests")}
                    </h6>
                    <small className="text-muted">
                      {t("affiliatePayment.createFirstPayoutRequest")}
                    </small>
                  </div>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover mb-0 table-sm">
                    <thead className="table-light">
                      <tr>
                        <th className="border-0 fw-bold text-uppercase py-2" style={{ fontSize: "0.75rem", letterSpacing: "0.5px" }}>
                          {t("affiliatePayment.requestDate")}
                        </th>
                        <th className="border-0 fw-bold text-uppercase py-2" style={{ fontSize: "0.75rem", letterSpacing: "0.5px" }}>
                          {t("affiliatePayment.amount")}
                        </th>
                        <th className="border-0 fw-bold text-uppercase py-2" style={{ fontSize: "0.75rem", letterSpacing: "0.5px" }}>
                          {t("affiliatePayment.status")}
                        </th>
                        <th className="border-0 fw-bold text-uppercase py-2" style={{ fontSize: "0.75rem", letterSpacing: "0.5px" }}>
                          {t("affiliatePayment.processedDate")}
                        </th>
                        <th className="border-0 fw-bold text-uppercase py-2" style={{ fontSize: "0.75rem", letterSpacing: "0.5px" }}>
                          {t("affiliatePayment.description")}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {payouts.map((payout) => (
                        <tr key={payout.id}>
                          <td className="align-middle py-2">{formatDate(payout.requestDate)}</td>
                          <td className="align-middle py-2">
                            <strong className="text-dark">
                              {payout.requestedAmount.toFixed(2)} ₺
                            </strong>
                          </td>
                          <td className="align-middle py-2">
                            <span
                              className={`badge bg-${getPayoutStatusColor(
                                payout.status
                              )} rounded-pill px-2 py-1`}
                              style={{ fontSize: "0.7rem" }}
                            >
                              {getPayoutStatusText(payout.status)}
                            </span>
                          </td>
                          <td className="align-middle py-2">
                            {payout.processedDate
                              ? formatDate(payout.processedDate)
                              : "-"}
                          </td>
                          <td className="align-middle text-muted py-2">{payout.description || "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .affiliate-payment-page {
          padding: 1.5rem 0;
        }

        /* Card hover effects */
        .card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1) !important;
        }

        /* Statistics card titles */
        .card h6.card-title {
          font-size: 0.7rem;
          color: #8c9196;
          letter-spacing: 1px;
        }

        .card h4 {
          font-size: 1.6rem;
          line-height: 1.2;
        }

        /* Button hover effects */
        .btn:hover {
          transform: translateY(-2px);
        }

        /* Form control focus - remove shadow */
        .form-control:focus {
          box-shadow: none;
          outline: none;
        }

        /* Table hover effects */
        .table tbody tr {
          transition: all 0.2s ease;
        }

        .table tbody tr:hover {
          background: #f8f9fa;
          transform: translateX(2px);
        }

        /* Empty state */
        .empty-state {
          padding: 1.5rem 1rem;
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .affiliate-payment-page {
            padding: 0.75rem 0;
          }

          .card h4 {
            font-size: 1.25rem;
          }

          .card h6.card-title {
            font-size: 0.6rem;
          }

          .table-responsive {
            font-size: 0.85rem;
          }

          .empty-state {
            padding: 1rem 0.5rem;
          }
        }

        @media (max-width: 576px) {
          .row .col-3 {
            flex: 0 0 50%;
            max-width: 50%;
            margin-bottom: 1rem;
          }

          .card h4 {
            font-size: 1.1rem;
          }

          .card h6.card-title {
            font-size: 0.55rem;
          }

          .table-responsive {
            font-size: 0.8rem;
          }
        }
      `}</style>
    </div>
  );
}
