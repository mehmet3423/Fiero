import { useRouter } from "next/router";
import { ReactNode, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import Layout from "./Layout";

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const router = useRouter();
  const isAdminRoute = router.pathname.startsWith("/admin");

  // Sayfa geçişlerinde assetleri yönet
  useEffect(() => {
    const handleAssets = () => {
      const isAdmin = window.location.pathname.startsWith("/admin");
      const assets = document.querySelectorAll("[data-type]");

      assets.forEach((asset) => {
        const assetElement = asset as HTMLElement;
        const assetType = assetElement.getAttribute("data-type");

        if (isAdmin && assetType === "site-asset") {
          assetElement.setAttribute("disabled", "true");
          assetElement.setAttribute("media", "none");
        } else if (!isAdmin && assetType === "admin-asset") {
          assetElement.setAttribute("disabled", "true");
          assetElement.setAttribute("media", "none");
        } else {
          assetElement.removeAttribute("disabled");
          assetElement.removeAttribute("media");
        }
      });

      // Admin sayfasına geçildiğinde admin scriptlerini yükle
      if (isAdmin) {
        loadAdminScripts();
      } else {
        loadSiteScripts();
      }
    };

    // Admin scriptlerini yükle
    const loadAdminScripts = () => {
      // Admin sayfasına geçildiğinde gerekli scriptleri yükle
      if (!window.adminScriptsLoaded) {
        // Admin scriptleri zaten yüklenmişse tekrar yükleme
        window.adminScriptsLoaded = true;
        window.siteScriptsLoaded = false;
      }
    };

    // Site scriptlerini yükle
    const loadSiteScripts = () => {
      // Ana siteye geçildiğinde gerekli scriptleri yükle
      if (!window.siteScriptsLoaded) {
        // Site scriptleri zaten yüklenmişse tekrar yükleme
        window.siteScriptsLoaded = true;
        window.adminScriptsLoaded = false;
      }
    };

    // İlk yükleme
    handleAssets();

    // Sayfa değişikliklerini dinle
    router.events.on("routeChangeComplete", handleAssets);

    return () => {
      router.events.off("routeChangeComplete", handleAssets);
    };
  }, [router]);

  if (
    typeof window !== "undefined" &&
    window.location.pathname.startsWith("/admin/login")
  ) {
    return <>{children}</>;
  }

  // Admin sayfaları için AdminLayout, diğer sayfalar için MainLayout kullan
  if (isAdminRoute) {
    return <AdminLayout>{children}</AdminLayout>;
  }

  return <Layout>{children}</Layout>;
}
