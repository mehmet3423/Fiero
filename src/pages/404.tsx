import Link from "next/link";

function NotFound() {
  return (
    <main className="">
      <nav aria-label="breadcrumb" className="breadcrumb-nav border-0 mb-0">
        <div className="container">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link href="/">Anasayfa</Link>
            </li>
            <li className="breadcrumb-item">
              <Link href="#">Sayfa</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              404
            </li>
          </ol>
        </div>
      </nav>

      <div
        className="error-content text-center"
        style={{
          backgroundImage: "url(assets/images/backgrounds/error-bg.jpg)",
        }}
      >
        <div className="container">
          <h1 className="error-title">Error 404</h1>
          <p>Üzgünüz, istenilen sayfa bulunamadı.</p>
          <Link href="/" className="btn btn-outline-primary-2 btn-minwidth-lg">
            <span>Geri Dön</span>
            <i className="icon-long-arrow-right"></i>
          </Link>
        </div>
      </div>
    </main>
  );
}

export default NotFound;
