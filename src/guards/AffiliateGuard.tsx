import PageLoadingAnimation from "@/components/shared/PageLoadingAnimation";
import { AffiliateStatus } from "@/constants/enums/AffiliateStatus";
import { useGetMyAffiliateUser } from "@/hooks/services/affiliate/useGetMyAffiliateUser";
import { useRouter } from "next/router";
import { ReactNode, useEffect, useState } from "react";

interface AffiliateGuardProps {
  children: ReactNode;
}

export default function AffiliateGuard({ children }: AffiliateGuardProps) {
  const { affiliateUser, isLoading, hasNoRecord, hasExistingRecord } =
    useGetMyAffiliateUser();
  const router = useRouter();
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    if (isLoading) return;

    // Affiliate kaydı yoksa veya onaylanmamışsa loading'i durdur
    // Yönlendirme yapmayacağız çünkü zaten aynı sayfadayız
    setIsInitialLoading(false);
  }, [affiliateUser, isLoading, hasNoRecord, hasExistingRecord, router]);

  // Yükleme durumunda loading göster
  if (isLoading || isInitialLoading) {
    return <PageLoadingAnimation />;
  }

  // Affiliate kaydı yoksa veya onaylanmamışsa erişim engelleme mesajı
  if (
    hasNoRecord ||
    !affiliateUser ||
    affiliateUser.status !== AffiliateStatus.Approved
  ) {
    return (
      <div className="page-content">
        <div className="container text-center py-5">
          <i
            className="bx bx-shield-x"
            style={{ fontSize: "4rem", color: "#dc3545" }}
          ></i>
          <h3 className="mt-3">Koleksiyon İşlemleri</h3>
          <p className="text-muted mb-4">
            Koleksiyon oluşturmak ve yönetmek için onaylanmış bir affiliate
            hesabına sahip olmanız gerekmektedir.
          </p>

          {hasNoRecord && (
            <div className="alert alert-info d-inline-block">
              <i className="bx bx-info-circle me-2"></i>
              Henüz affiliate başvurunuz bulunmamaktadır.
            </div>
          )}

          {affiliateUser &&
            affiliateUser.status === AffiliateStatus.InProgress && (
              <div className="alert alert-warning d-inline-block">
                <i className="bx bx-clock me-2"></i>
                Affiliate başvurunuz henüz inceleniyor.
              </div>
            )}

          {affiliateUser &&
            affiliateUser.status === AffiliateStatus.Rejected && (
              <div className="alert alert-danger d-inline-block">
                <i className="bx bx-x-circle me-2"></i>
                Affiliate başvurunuz reddedilmiştir.
              </div>
            )}

          {affiliateUser &&
            affiliateUser.status === AffiliateStatus.Cancelled && (
              <div className="alert alert-secondary d-inline-block">
                <i className="bx bx-pause-circle me-2"></i>
                Affiliate hesabınız iptal edilmiştir.
              </div>
            )}

          {affiliateUser &&
            affiliateUser.status === AffiliateStatus.Suspended && (
              <div className="alert alert-secondary d-inline-block">
                <i className="bx bx-pause-circle me-2"></i>
                Affiliate hesabınız askıya alınmıştır. Affiliate Durumum
                kısmından bilgi alabilirsiniz.
              </div>
            )}
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
