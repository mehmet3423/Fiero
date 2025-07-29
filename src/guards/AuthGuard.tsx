import PageLoadingAnimation from "@/components/shared/PageLoadingAnimation";
import { UserRole } from "@/constants/enums/UserRole";
import { useAuth } from "@/hooks/context/useAuth";
import { useRouter } from "next/router";
import { ReactNode, useEffect, useState } from "react";

function AuthGuard({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { userProfile, userProfileLoading, userRole, setUserRole } = useAuth();

  useEffect(() => {
    if (userProfileLoading) return;

    if (!userProfile) {
      setUserRole(null);
      setLoading(false);
      return;
    }

    // Admin check: Sadece temel kullanıcı bilgileri içeren, göreceli olarak düz bir yapı
    if (
      !("cart" in userProfile) &&
      !("companyName" in userProfile) &&
      !("applicationUser" in userProfile) &&
      "username" in userProfile
    ) {
      setUserRole(UserRole.ADMIN);
      setLoading(false);
      return;
    }

    // Customer check: Cart property içeren ve applicationUser yapısı olan
    if ("cart" in userProfile) {
      setUserRole(UserRole.CUSTOMER);
      setLoading(false);
      return;
    }

    // Seller check: companyName ve companyAddress property'leri olan
    if ("companyName" in userProfile || "companyAddress" in userProfile) {
      setUserRole(UserRole.SELLER);
      setLoading(false);
      return;
    }

    // Eğer hiçbir şart tutmadıysa default olarak müşteri kabul ediyoruz
    setUserRole(UserRole.CUSTOMER);
    setLoading(false);
  }, [userProfile, userProfileLoading, router, setUserRole]);

  if (loading) return <PageLoadingAnimation />;

  return <>{children}</>;
}

export default AuthGuard;
