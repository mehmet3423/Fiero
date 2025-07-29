"use client";

interface UnderConstructionProps {
  title?: string;
  description?: string;
  progress?: number;
  estimatedTime?: string;
  returnPath?: string;
}

function UnderConstructionPage({
  title = "Yapım Aşamasında 🚧",
  description = "Bu sayfa şu anda geliştirme aşamasındadır. Çok yakında hizmetinizde olacaktır.",
  progress = 75,
  estimatedTime = "2 Hafta",
  returnPath = "/admin",
}: UnderConstructionProps) {
  return (
    <div className="content-wrapper">
      <div className="container-l flex-grow-1 container-p-y">
        <div className="card">
          <div className="card-body text-center py-5">
            <div className="mb-4">
              <i
                className="bx bx-alarm-exclamation"
                style={{ fontSize: "80px" }}
              ></i>
            </div>

            <h4
              className="mb-2"
              style={{ fontSize: "1.5rem", color: "#566a7f" }}
            >
              {title}
            </h4>

            <p
              className="mb-4"
              style={{ fontSize: "0.9rem", color: "#697a8d" }}
            >
              {description}
            </p>

            <div className="progress mb-4" style={{ height: "12px" }}>
              <div
                className="progress-bar progress-bar-striped progress-bar-animated bg-warning"
                role="progressbar"
                style={{ width: `${progress}%` }}
                aria-valuenow={progress}
                aria-valuemin={0}
                aria-valuemax={100}
              ></div>
            </div>

            <div className="row justify-content-center g-3 mt-2">
              <div className="col-md-4">
                <div className="card bg-warning bg-opacity-10 border-0">
                  <div className="card-body py-3">
                    <div className="d-flex align-items-center">
                      <div className="avatar flex-shrink-0 me-3">
                        <span className="avatar-initial rounded bg-label-warning">
                          <i className="bx bx-time-five"></i>
                        </span>
                      </div>
                      <div>
                        <h6 className="mb-0" style={{ fontSize: "1.3rem" }}>
                          Tahmini Tamamlanma
                        </h6>
                        <small
                          className="text-muted"
                          style={{ fontSize: "1rem" }}
                        >
                          {estimatedTime}
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="card bg-warning bg-opacity-10 border-0">
                  <div className="card-body py-3">
                    <div className="d-flex align-items-center">
                      <div className="avatar flex-shrink-0 me-3">
                        <span className="avatar-initial rounded bg-label-warning">
                          <i className="bx bx-code-alt"></i>
                        </span>
                      </div>
                      <div>
                        <h6 className="mb-0" style={{ fontSize: "1.3rem" }}>
                          Geliştirme Aşaması
                        </h6>
                        <small
                          className="text-muted"
                          style={{ fontSize: "1rem" }}
                        >
                          {progress}% Tamamlandı
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <a
                href={returnPath}
                className="btn btn-outline-primary"
                style={{ fontSize: "0.8rem" }}
              >
                <i className="bx bx-home-alt me-1"></i>
                Anasayfaya Dön
              </a>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .card {
          border-radius: 3px;
          border: 1px solid #eee;
          box-shadow: none;
        }
        .btn {
          border-radius: 3px;
          padding: 0.5rem 1rem;
        }
        .progress {
          border-radius: 3px;
          background-color: #f9f9f9;
        }
        .avatar-initial {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
        }
        .bg-label-warning {
          background-color: #fff4d9;
          color: #ffab00;
        }
      `}</style>
    </div>
  );
}

export default UnderConstructionPage;
