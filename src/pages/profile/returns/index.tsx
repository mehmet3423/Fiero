import { withProfileLayout } from "../_layout";

function ReturnsPage() {
  return (
    <div className="construction-page" style={{ marginTop: "-100px" }}>
      <div className="card">
        <div className="card-body text-center p-5">
          <div className="construction-icon mb-4">
            <i className="bx bx-time-five"></i>
          </div>
          <h3
            style={{
              fontSize: "2rem",
              color: "#566a7f",
              marginBottom: "1.5rem",
              fontWeight: "600",
            }}
          >
            Çok Yakında Burada!
          </h3>
          <p
            className="text-muted"
            style={{
              fontSize: "1.5rem",
              maxWidth: "700px",
              margin: "0 auto",
              lineHeight: "1.6",
            }}
          >
            İade taleplerimiz üzerinde çalışıyoruz. Daha iyi bir deneyim için
            kısa süre içinde hizmetinizde olacak.
          </p>
        </div>
      </div>

      <style jsx>{`
        .construction-page {
          padding: 3rem;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 600px;
        }

        .card {
          border-radius: 0.75rem;
          border: 1px solid #eee;
          width: 100%;
          max-width: 800px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
        }

        .construction-icon {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: #e7e7ff;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
          margin-bottom: 2rem;
        }

        .construction-icon i {
          font-size: 4rem;
          color: #696cff;
        }

        @media (max-width: 768px) {
          .construction-page {
            padding: 1.5rem;
            min-height: 400px;
          }

          .construction-icon {
            width: 100px;
            height: 100px;
          }

          .construction-icon i {
            font-size: 3rem;
          }
        }
      `}</style>
    </div>
  );
}

export default withProfileLayout(ReturnsPage);
