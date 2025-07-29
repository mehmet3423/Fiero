import React from "react";

function Newsletter() {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Sayfanın yönlendirilmesini engeller
    $("#signin-modal").modal("show"); // Bootstrap modalını açar
  };
  return (
    <div
      className="cta cta-horizontal mb-5"
      style={{ border: "dashed 1px gray" }}
    >
      <div className="row justify-content-center">
        <div className="col-lg-5 col-xl-8">
          <div className="row align-items-center">
            <div className="col-12 col-lg-8 text-center text-lg-start">
              <h3 className="cta-title">
                {" "}
                E-posta ile Kaydolun ve %10 İndirim Kazanın!
              </h3>
              <p className="cta-desc">
                Ürün bilgileri ve kuponlar hakkında bilgi alın! <br />
                (ÖRNEKTİR!)
              </p>
            </div>
            <div className="col-12 col-lg-4 text-center mt-3 mt-lg-0">
              <div className="input-group justify-content-center">
                <div className="input-group-append">
                  <button
                    className="btn btn-primary"
                    // type="submit"
                    onClick={handleClick}
                  >
                    <span>KAYDOL</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Newsletter;
