import { useState, useEffect } from "react";
import { AffiliateUser } from "@/constants/models/Affiliate";
import { useGetAffiliatePayouts } from "@/hooks/services/affiliate/useGetAffiliatePayouts";
import { useCreatePayoutRequest } from "@/hooks/services/affiliate/useCreatePayoutRequest";
import { useTransferEligibleCommissions } from "@/hooks/services/affiliate/useTransferEligibleCommissions";
import { toast } from "react-hot-toast";

interface AffiliatePaymentPageProps {
  affiliateUser: AffiliateUser;
}

const getPayoutStatusText = (status: number): string => {
  switch (status) {
    case 0:
      return "Beklemede";
    case 1:
      return "Onaylandı";
    case 2:
      return "Reddedildi";
    case 3:
      return "Ödendi";
    default:
      return "Bilinmiyor";
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

export default function AffiliatePaymentPage({
  affiliateUser,
}: AffiliatePaymentPageProps) {
  const [page, setPage] = useState(1);
  const [requestAmount, setRequestAmount] = useState<string>("");
  const [showPayoutForm, setShowPayoutForm] = useState(false);

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
      alert("Lütfen geçerli bir tutar girin");
      return;
    }

    const amount = parseFloat(requestAmount);
    if (amount > transferableAmount) {
      toast.error(
        "Talep edilen tutar transfer edilebilir tutardan fazla olamaz"
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
          <div className="card h-100 text-center">
            <div className="card-body">
              <div className="card-icon mt-2">
                <i
                  className="bx bx-shopping-bag mb-1"
                  style={{ fontSize: "3rem", color: "#6c757d" }}
                ></i>
              </div>
              <h5 className="card-title text-muted mb-1">TOPLAM SATIŞ</h5>
              <h3 className="text-dark" style={{ fontSize: "2rem" }}>
                {totalSales.toFixed(2)} ₺
              </h3>
            </div>
          </div>
        </div>

        <div className="col-3">
          <div className="card h-100 text-center">
            <div className="card-body">
              <div className="card-icon mt-2">
                <i
                  className="bx bx-money mb-1"
                  style={{ fontSize: "3rem", color: "#17a2b8" }}
                ></i>
              </div>
              <h5 className="card-title text-muted mb-1">AKTARILABİLİR</h5>
              <h3 className="text-info" style={{ fontSize: "2rem" }}>
                {transferableAmount.toFixed(2)} ₺
              </h3>
            </div>
          </div>
        </div>

        <div className="col-3">
          <div className="card h-100 text-center">
            <div className="card-body">
              <div className="card-icon mt-2">
                <i
                  className="bx bx-time-five mb-1"
                  style={{ fontSize: "3rem", color: "#ffc107" }}
                ></i>
              </div>
              <h5 className="card-title text-muted mb-1">ONAY BEKLEYEN</h5>
              <h3 className="text-warning" style={{ fontSize: "2rem" }}>
                {pendingAmount.toFixed(2)} ₺
              </h3>
            </div>
          </div>
        </div>

        <div className="col-3">
          <div className="card h-100 text-center">
            <div className="card-body">
              <div className="card-icon mt-2">
                <i
                  className="bx bx-check-circle mb-1"
                  style={{ fontSize: "3rem", color: "#28a745" }}
                ></i>
              </div>
              <h5 className="card-title text-muted mb-1">TRANSFER EDİLEN</h5>
              <h3 className="text-success" style={{ fontSize: "2rem" }}>
                {transferredAmount.toFixed(2)} ₺
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {affiliateUser.status === 5 ? (
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-body text-center">
                <div className="card-icon mt-2">
                  <i
                    className="bx bx-block mb-3"
                    style={{ fontSize: "3rem", color: "#dc3545" }}
                  ></i>
                </div>
                <h5 className="text-danger mb-2">Hesap Askıya Alındı</h5>
                <p className="text-muted mb-0">
                  Affiliate hesabınız askıya alındığından dolayı çekim talebi
                  oluşturamazsınız
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-body d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="mb-1 mt-1">Ödeme Talebi Oluştur</h5>
                  <p className="text-muted mb-0">
                    Transfer edilebilir kazancınızdan ödeme talebinde
                    bulunabilirsiniz.
                  </p>
                </div>
                <button
                  className="btn btn-primary"
                  onClick={() => setShowPayoutForm(!showPayoutForm)}
                  disabled={false}
                >
                  <i className="bx bx-plus me-2"></i>
                  Yeni Talep
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payout Request Form */}
      {showPayoutForm && affiliateUser.status !== 5 && (
        <div className="row mb-4">
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">
                        Talep Edilecek Tutar (₺)
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        value={requestAmount}
                        onChange={(e) => setRequestAmount(e.target.value)}
                        min="0"
                        max={transferableAmount}
                        step="0.01"
                        placeholder="0.00"
                      />
                      <small className="text-muted">
                        Maksimum: {transferableAmount.toFixed(2)} ₺
                      </small>
                    </div>
                  </div>
                </div>
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-primary"
                    onClick={handleCreatePayoutRequest}
                    disabled={isCreatingPayout || !requestAmount}
                  >
                    {isCreatingPayout ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                        ></span>
                        Oluşturuluyor...
                      </>
                    ) : (
                      <>
                        <i className="bx bx-check me-2"></i>
                        Talep Oluştur
                      </>
                    )}
                  </button>
                  <button
                    className="btn btn-secondary ml-2"
                    onClick={() => {
                      setShowPayoutForm(false);
                      setRequestAmount("");
                    }}
                  >
                    İptal
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
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0 m-4 ml-4">Ödeme Talepleri</h5>
            </div>
            <div className="card-body p-0">
              {payoutsLoading ? (
                <div className="text-center py-5">
                  <div className="spinner-border" role="status">
                    <span className="sr-only">Yükleniyor...</span>
                  </div>
                </div>
              ) : payouts.length === 0 ? (
                <div className="text-center py-5">
                  <i
                    className="bx bx-receipt"
                    style={{ fontSize: "4rem", color: "#ccc" }}
                  ></i>
                  <h5 className="mt-3 text-muted">
                    Henüz ödeme talebiniz bulunmuyor
                  </h5>
                  <p className="text-muted">
                    İlk ödeme talebinizi oluşturmak için yukarıdaki butonu
                    kullanın
                  </p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Talep Tarihi</th>
                        <th>Tutar</th>
                        <th>Durum</th>
                        <th>İşlenme Tarihi</th>
                        <th>Açıklama</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payouts.map((payout) => (
                        <tr key={payout.id}>
                          <td>{formatDate(payout.requestDate)}</td>
                          <td>
                            <strong>
                              {payout.requestedAmount.toFixed(2)} ₺
                            </strong>
                          </td>
                          <td>
                            <span
                              className={`badge bg-${getPayoutStatusColor(
                                payout.status
                              )}`}
                            >
                              {getPayoutStatusText(payout.status)}
                            </span>
                          </td>
                          <td>
                            {payout.processedDate
                              ? formatDate(payout.processedDate)
                              : "-"}
                          </td>
                          <td>{payout.description || "-"}</td>
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
          padding: 1rem 0;
        }

        .card {
          border-radius: 0.75rem;
          border: 1px solid #eee;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
        }

        .card-icon i {
          opacity: 0.8;
        }

        .table th {
          border-top: none;
          font-weight: 600;
          text-transform: uppercase;
          font-size: 0.8rem;
          letter-spacing: 0.5px;
        }

        .table td {
          vertical-align: middle;
        }

        @media (max-width: 768px) {
          .affiliate-payment-page {
            padding: 0.5rem 0;
          }

          .card {
            margin-bottom: 1rem;
          }

          .table-responsive {
            font-size: 0.9rem;
          }
        }
      `}</style>
    </div>
  );
}
