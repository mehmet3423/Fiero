import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="tr">
      <Head>
        <meta charSet="UTF-8" />

        {/* Ortak Favicon */}
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/favicon/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon/favicon-16x16.png"
        />
        <link rel="manifest" href="/favicon/site.webmanifest" />
        <link
          rel="mask-icon"
          href="/favicon/safari-pinned-tab.svg"
          color="#666666"
        />
        <link
          rel="shortcut icon"
          href="/assets/site/images/nors-sub-logo.png"
        />
        <link
          rel="icon"
          type="image/x-icon"
          href="/assets/site/images/nors-sub-logo.png"
        />

        <meta name="apple-mobile-web-app-title" content="Nors" />
        <meta name="application-name" content="Nors" />
        <meta name="msapplication-TileColor" content="#cc9966" />
        <meta
          name="msapplication-config"
          content="/favicon/browserconfig.xml"
        />
        <meta name="theme-color" content="#ffffff" />

        {/* Admin Panel Assets */}
        {/* Admin Fonts */}
        <link
          href="https://fonts.googleapis.com/css2?family=Public+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&display=swap"
          rel="stylesheet"
          data-type="admin-asset"
        />

        {/* Admin Icons */}
        <link
          href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css"
          rel="stylesheet"
          data-type="admin-asset"
        />
        <link
          href="/assets/admin/vendor/fonts/boxicons.css"
          rel="stylesheet"
          data-type="admin-asset"
        />

        {/* Admin Core CSS */}
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
          rel="stylesheet"
          data-type="admin-asset"
        />
        <link
          href="/assets/admin/vendor/css/core.css"
          rel="stylesheet"
          className="template-customizer-core-css"
          data-type="admin-asset"
        />
        <link
          href="/assets/admin/vendor/css/theme-default.css"
          rel="stylesheet"
          className="template-customizer-theme-css"
          data-type="admin-asset"
        />
        <link
          href="/assets/admin/css/demo.css"
          rel="stylesheet"
          data-type="admin-asset"
        />

        <link rel="stylesheet" href="/assets/site/fonts/fonts.css" />
        <link rel="stylesheet" href="/assets/site/fonts/font-icons.css" />
        <link rel="stylesheet" href="/assets/site/css/bootstrap.min.css" />
        <link rel="stylesheet" href="/assets/site/css/swiper-bundle.min.css" />
        <link rel="stylesheet" href="/assets/site/css/animate.css" />
        <link
          rel="stylesheet"
          type="text/css"
          href="/assets/site/css/styles.css"
        />

        <link rel="shortcut icon" href="/assets/site/images/logo/favicon.png" />
        <link
          rel="apple-touch-icon-precomposed"
          href="/assets/site/images/logo/favicon.png"
        />

        {/* Admin Vendors CSS */}
        <link
          href="/assets/admin/vendor/libs/perfect-scrollbar/perfect-scrollbar.css"
          rel="stylesheet"
          data-type="admin-asset"
        />

        {/* jQuery (Ortak) */}
        <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>

        {/* Admin Panel Scripts */}
        <script
          src="/assets/admin/vendor/js/helpers.js"
          data-type="admin-asset"
        ></script>
        <script
          src="/assets/admin/js/config.js"
          data-type="admin-asset"
        ></script>
        <script
          src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.8/dist/umd/popper.min.js"
          data-type="admin-asset"
        ></script>
        <script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"
          data-type="admin-asset"
        ></script>

        <script
          type="text/javascript"
          src="/assets/site/js/bootstrap.min.js"
        ></script>
        <script
          type="text/javascript"
          src="/assets/site/js/jquery.min.js"
        ></script>
        <script
          type="text/javascript"
          src="/assets/site/js/swiper-bundle.min.js"
        ></script>
        <script
          type="text/javascript"
          src="/assets/site/js/carousel.js"
        ></script>

        <script
          type="text/javascript"
          src="/assets/site/js/bootstrap-select.min.js"
        ></script>
        <script
          type="text/javascript"
          src="/assets/site/js/lazysize.min.js"
        ></script>
        <script
          type="text/javascript"
          src="/assets/site/js/count-down.js"
        ></script>
        <script
          type="text/javascript"
          src="/assets/site/js/wow.min.js"
        ></script>
        {/* rangle-slider.js sadece ürün filtreleme sayfalarında yüklenir */}
        <script
          type="text/javascript"
          src="/assets/site/js/wow.min.js"
        ></script>
        <script
          type="text/javascript"
          src="/assets/site/js/multiple-modal.js"
        ></script>
        <script type="text/javascript" src="/assets/site/js/main.js"></script>

        {/* Script to initialize asset tracking */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
            // Global değişkenleri tanımla
            window.adminScriptsLoaded = false;
            window.siteScriptsLoaded = false;

            // İlk yükleme için asset kontrolü
            (function() {
              var isAdmin = window.location.pathname.startsWith('/admin');
              
              // İlk yükleme için doğru script setini işaretle
              if (isAdmin) {
                window.adminScriptsLoaded = true;
              } else {
                window.siteScriptsLoaded = true;
              }

              // İlk yükleme için gereksiz assetleri devre dışı bırak
              var assets = document.querySelectorAll('[data-type]');
              assets.forEach(function(asset) {
                if (isAdmin && asset.getAttribute('data-type') === 'site-asset') {
                  asset.setAttribute('disabled', 'true');
                  asset.setAttribute('media', 'none');
                } else if (!isAdmin && asset.getAttribute('data-type') === 'admin-asset') {
                  asset.setAttribute('disabled', 'true');
                  asset.setAttribute('media', 'none');
                }
              });
            })();
          `,
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
