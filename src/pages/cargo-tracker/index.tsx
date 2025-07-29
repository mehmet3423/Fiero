import Link from "next/link";
import { useState } from "react";

function CargoTrackerPage() {
  const [trackingNumber, setTrackingNumber] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // API entegrasyonu için hazır
  };

  return (
    <main className="main" style={{ backgroundColor: "#fff" }}>
      <div
        className="page-header text-center"
        style={{ backgroundImage: 'url("/assets/images/page-header-bg.jpg")' }}
      >
        <div className="container">
          <h1 className="page-title">
            Kargo Takip<span>Nors</span>
          </h1>
        </div>
      </div>

      <nav aria-label="breadcrumb" className="breadcrumb-nav mb-3">
        <div className="container">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link href="/">Anasayfa</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Kargo Takip
            </li>
            ""
          </ol>
        </div>
      </nav>

      <div className="page-content" style={{ backgroundColor: "#fff" }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-6">
              <div
                className="card"
                style={{ backgroundColor: "#fff", border: "1px solid #ebebeb" }}
              >
                <div className="card-body">
                  <h2
                    className="card-title text-center mb-4"
                    style={{ color: "#333" }}
                  >
                    Kargo Takip Numaranızı Girin
                  </h2>
                  <form onSubmit={handleSubmit}>
                    <div className="form-group">
                      <label
                        htmlFor="tracking-number"
                        style={{ color: "#777" }}
                      >
                        Takip Numarası *
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="tracking-number"
                        placeholder="Kargo takip numaranızı girin"
                        value={trackingNumber}
                        onChange={(e) => setTrackingNumber(e.target.value)}
                        required
                        style={{
                          backgroundColor: "#fff",
                          border: "1px solid #ebebeb",
                        }}
                      />
                    </div>

                    <button
                      type="submit"
                      className="btn btn-outline-primary-2 btn-block"
                    >
                      <span>KARGO DURUMUNU SORGULA</span>
                      <i className="icon-long-arrow-right"></i>
                    </button>
                  </form>

                  <div className="text-center mt-4">
                    <p className="text-muted">
                      Kargo takip numaranızı girerek gönderinizin güncel
                      durumunu sorgulayabilirsiniz.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default CargoTrackerPage;
