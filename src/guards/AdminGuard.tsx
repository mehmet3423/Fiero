import { useIsAdmin } from "@/hooks/useIsAdmin";
import { useRouter } from "next/router";
import { ReactNode, useEffect, useState } from "react";

interface AdminGuardProps {
  children: ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const { isAdmin, userProfileLoading, userProfile } = useIsAdmin();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (userProfileLoading) return;

    if (!userProfile) {
      return;
    }

    if (
      router.pathname.startsWith("/admin") &&
      !isAdmin &&
      router.pathname !== "/admin/login"
    ) {
      router.replace("/admin/login");
      setIsLoading(false);
      return;
    }
  }, [router.pathname, isAdmin, userProfileLoading, userProfile]);

  // UserProfile yüklenene kadar loading göster
  // if (userProfileLoading || isLoading) {
  //     return <PageLoadingAnimation />;
  // }

  if (
    router.pathname.startsWith("/admin") &&
    !isAdmin &&
    router.pathname !== "/admin/login"
  ) {
    return (
      <div className="page-content">
        <div className="container text-center py-5">
          <i
            className="icon-lock"
            style={{ fontSize: "3rem", color: "#dc3545" }}
          ></i>
          <h3 className="mt-3">Yetkisiz Erişim</h3>
          <p className="text-muted">
            Bu sayfaya erişmek için admin yetkisine sahip olmanız gerekmektedir.
          </p>
          <button
            className="btn btn-primary mt-3"
            onClick={() => router.replace("/admin/login")}
          >
            Giriş Yap
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
