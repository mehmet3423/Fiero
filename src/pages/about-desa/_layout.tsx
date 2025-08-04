import Link from "next/link";
import { useRouter } from "next/router";
import { ReactNode } from "react";

interface AboutDesaLayoutProps {
  children: ReactNode;
}

function AboutDesaLayout({ children }: AboutDesaLayoutProps) {
  const router = useRouter();

  const navItemStyle = {
    userSelect: "none" as const,
    cursor: "pointer",
  };

  // Custom styles for About Desa navigation
  const aboutDesaNavStyles = {
    gap: '10px', // Yarı yarıya azaltılmış boşluk (20px'den 10px'e)
  };

  const aboutDesaNavItemStyles = {
    padding: '10px 20px', // Padding azaltıldı (15px 30px'den 10px 20px'e)
    fontSize: '18px', // Font boyutu eski haline getirildi
    lineHeight: '1.4', // Line height biraz artırıldı
    height: '50px', // Sabit yükseklik (font boyutu için biraz artırıldı)
    display: 'flex',
    alignItems: 'center',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const,
    fontWeight: '500',
  };

  const navLinks = [
    { href: "/about-desa/investors", label: "INVESTORS" },
    { href: "/about-desa/about", label: "ABOUT DESA" },
    { href: "/about-desa/corporate-governance", label: "CORPORATE GOVERNANCE" },
    { href: "/about-desa/investor-presentations", label: "INVESTOR PRESENTATIONS" },
    { href: "/about-desa/financials", label: "FINANCIALS" },
    { href: "/about-desa/analyst-reports", label: "ANALYST REPORTS" },
    { href: "/about-desa/annual-reports", label: "ANNUAL REPORTS" },
    { href: "/about-desa/other-reports", label: "OTHER REPORTS" },
    { href: "/about-desa/press-releases", label: "PRESS RELEASES" },
    { href: "/about-desa/investor-relations-contact", label: "INVESTOR RELATIONS CONTACT" },
    { href: "/about-desa-tr", label: "TR-YATIRIMCI İLİŞKİLERİ" },
  ];

  return (
    <main className="main">
      {/* Custom CSS for About Desa Navigation */}
      <style jsx>{`
        .about-desa-nav-item {
          transition: all 0.3s ease !important;
        }
        
        .about-desa-nav-item:hover {
          transform: translateX(2px);
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        
        @media (max-width: 768px) {
          .about-desa-nav-item {
            font-size: 16px !important;
            padding: 8px 15px !important;
            height: 45px !important;
          }
        }
        
        @media (max-width: 576px) {
          .about-desa-nav-item {
            font-size: 14px !important;
            padding: 6px 12px !important;
            height: 40px !important;
          }
        }
      `}</style>

      {/* Page Title */}
      <div className="tf-page-title">
        <div className="container-full">
          <div className="heading text-center">INVESTOR RELATIONS</div>
        </div>
      </div>

      {/* Page Content */}
      <section className="flat-spacing-11">
        <div className="container">
          <div className="row">
            {/* Sidebar Navigation */}
            <div className="col-lg-3">
              <ul className="my-account-nav" style={aboutDesaNavStyles}>
                {navLinks.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`my-account-nav-item about-desa-nav-item ${
                        router.pathname === item.href ? "active" : ""
                      }`}
                      style={aboutDesaNavItemStyles}
                      title={item.label} // Tooltip for long text
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Main Content */}
            <div className="col-lg-9">
              <div className="my-account-content account-dashboard">
                {children}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export function withAboutDesaLayout<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  return function WithAboutDesaLayout(props: P) {
    return (
      <AboutDesaLayout>
        <WrappedComponent {...props} />
      </AboutDesaLayout>
    );
  };
}

export default AboutDesaLayout;
