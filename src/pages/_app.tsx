import RootLayout from "@/components/layouts/RootLayout";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { FavoritesProvider } from "@/context/FavoritesContext";
import { SearchProvider } from "@/context/SearchContext";
import AdminGuard from "@/guards/AdminGuard";
import AuthGuard from "@/guards/AuthGuard";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    const loadSiteScripts = async () => {
      // Ana site için gerekli scriptleri sadece admin sayfalarında değilse ve henüz yüklenmemişse yükle
      if (
        !window.location.pathname.startsWith("/admin") &&
        !window.siteScriptsLoaded
      ) {
        window.siteScriptsLoaded = true;
        window.adminScriptsLoaded = false;

        await new Promise((resolve) => {
          const script = document.createElement("script");
          script.src = "https://code.jquery.com/jquery-3.6.0.min.js";
          script.onload = resolve;
          script.setAttribute("data-type", "site-asset");
          document.body.appendChild(script);
        });

        const scripts = [
          "https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/js/bootstrap.bundle.min.js",
          "/assets/site/js/jquery.hoverIntent.min.js",
          "/assets/site/js/jquery.waypoints.min.js",
          "/assets/site/js/superfish.min.js",
          "/assets/site/js/owl.carousel.min.js",
          "/assets/site/js/bootstrap-input-spinner.js",
          "/assets/site/js/jquery.magnific-popup.min.js",
          "/assets/site/js/jquery.plugin.min.js",
          "/assets/site/js/jquery.countdown.min.js",
          "/assets/site/js/main.js",
          "/assets/site/js/demos/demo-9.js",
        ];

        for (const src of scripts) {
          await new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = src;
            script.onload = resolve;
            script.setAttribute("data-type", "site-asset");
            document.body.appendChild(script);
          });
        }
      }
    };

    const loadAdminScripts = async () => {
      // Admin scriptlerini sadece admin sayfalarında ve henüz yüklenmemişse yükle
      if (
        window.location.pathname.startsWith("/admin") &&
        !window.adminScriptsLoaded
      ) {
        window.adminScriptsLoaded = true;
        window.siteScriptsLoaded = false;

        // Admin için özel scriptler burada yüklenebilir
        const scripts = [
          "/assets/admin/vendor/libs/perfect-scrollbar/perfect-scrollbar.js",
          "/assets/admin/vendor/js/menu.js",
          "/assets/admin/js/main.js",
          "/assets/admin/js/dashboards-analytics.js",
          "/assets/admin/js/config.js",
        ];

        for (const src of scripts) {
          await new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = src;
            script.onload = resolve;
            script.setAttribute("data-type", "admin-asset");
            document.body.appendChild(script);
          });
        }
      }
    };

    // İlk yükleme ve sayfa geçişleri için script yükleme
    const handleRouteChange = () => {
      if (window.location.pathname.startsWith("/admin")) {
        loadAdminScripts();
      } else {
        loadSiteScripts();
      }
    };

    // İlk yükleme
    handleRouteChange();

    // Sayfa değişikliklerini dinle
    router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router]);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SearchProvider>
          <Toaster
            position="top-right"
            reverseOrder={false}
            toastOptions={{
              error: {
                duration: 3000,
                style: {
                  background: "#f44336",
                  color: "#fff",
                },
              },
              success: {
                duration: 3000,
                style: {
                  background: "#4CAF50",
                  color: "#fff",
                },
              },
            }}
          />
          <AuthGuard>
            <AdminGuard>
              <FavoritesProvider>
                <CartProvider>
                  <RootLayout>
                    <Component {...pageProps} />
                  </RootLayout>
                </CartProvider>
              </FavoritesProvider>
            </AdminGuard>
          </AuthGuard>
        </SearchProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
