import Head from "next/head";
import Link from "next/link";
import Footer from "../components/Footer";
import Header from "../components/Header";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="page-wrapper">
      <Head>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <title>Desa</title>
      </Head>

      <Header />

      <main className="main">{children}</main>

      <Footer />

      {/* Mobile Menu */}
      <div className="mobile-menu-overlay"></div>
      <div className="mobile-menu-container">
        <div className="mobile-menu-wrapper">
          <span className="mobile-menu-close">
            <i className="icon-close"></i>
          </span>

          <form action="#" method="get" className="mobile-search">
            <label htmlFor="mobile-search" className="sr-only">
              Search
            </label>
            <input
              type="search"
              className="form-control"
              name="mobile-search"
              id="mobile-search"
              placeholder="Search in..."
              required
            />
            <button className="btn btn-primary" type="submit">
              <i className="icon-search"></i>
            </button>
          </form>

          <nav className="mobile-nav">
            <ul className="mobile-menu">
              <li className="active">
                <Link href="index.html">Home</Link>
              </li>
              <li>
                <Link href="category.html">Shop</Link>
              </li>
              <li>
                <Link href="product.html">Product</Link>
              </li>
              <li>
                <Link href="#">Pages</Link>
              </li>
              <li>
                <Link href="blog.html">Blog</Link>
              </li>
            </ul>
          </nav>

          <div className="social-icons">
            <Link
              href="#"
              className="social-icon"
              target="_blank"
              title="Facebook"
            >
              <i className="icon-facebook-f"></i>
            </Link>
            <Link
              href="#"
              className="social-icon"
              target="_blank"
              title="Twitter"
            >
              <i className="icon-twitter"></i>
            </Link>
            <Link
              href="#"
              className="social-icon"
              target="_blank"
              title="Instagram"
            >
              <i className="icon-instagram"></i>
            </Link>
            <Link
              href="#"
              className="social-icon"
              target="_blank"
              title="Youtube"
            >
              <i className="icon-youtube"></i>
            </Link>
          </div>
        </div>
      </div>

      <button id="scroll-top" title="Back to Top">
        <i className="icon-arrow-up"></i>
      </button>
    </div>
  );
}
