import { useEffect } from "react";

function AdminHomePage() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      import("apexcharts").then((ApexCharts) => {
        const totalRevenueChart = new ApexCharts.default(
          document.querySelector("#totalRevenueChart"),
          {
            series: [
              {
                name: "Gelir",
                data: [18, 7, 15, 29, 18, 12, 9],
              },
            ],
            chart: {
              height: 300,
              type: "bar",
              toolbar: { show: false },
            },
            plotOptions: {
              bar: {
                borderRadius: 4,
                horizontal: false,
              },
            },
            colors: ["#696cff"],
            xaxis: {
              categories: ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"],
            },
          }
        );
        const growthChart = new ApexCharts.default(
          document.querySelector("#growthChart"),
          {
            series: [78],
            chart: {
              height: 240,
              type: "radialBar",
            },
            plotOptions: {
              radialBar: {
                hollow: {
                  size: "70%",
                },
                track: {
                  background: "#f3f3f3",
                },
                dataLabels: {
                  show: true,
                  name: {
                    show: false,
                  },
                  value: {
                    formatter: function (val: number) {
                      return val + "%";
                    },
                    fontSize: "1.5rem",
                  },
                },
              },
            },
            colors: ["#696cff"],
            stroke: {
              lineCap: "round",
            },
          }
        );
        const incomeChart = new ApexCharts.default(
          document.querySelector("#incomeChart"),
          {
            series: [
              {
                data: [24, 21, 30, 22, 42, 26, 35],
              },
            ],
            chart: {
              height: 200,
              type: "line",
              toolbar: { show: false },
              zoom: { enabled: false },
            },
            markers: {
              size: 4,
              colors: ["#696cff"],
              strokeColors: "#fff",
              strokeWidth: 2,
              hover: { size: 6 },
            },
            colors: ["#696cff"],
            stroke: {
              curve: "smooth",
              width: 3,
            },
            grid: {
              borderColor: "#f1f1f1",
            },
            xaxis: {
              categories: ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"],
            },
          }
        );

        totalRevenueChart.render();
        growthChart.render();
        incomeChart.render();

        return () => {
          totalRevenueChart.destroy();
          growthChart.destroy();
          incomeChart.destroy();
        };
      });
    }
  }, []);

  return (
    <div className="content-wrapper">
      <div className="container-l flex-grow-1 container-p-y">
        {/* Hoşgeldiniz Kartı */}
        <div className="row">
          <div className="col-lg-8 mb-4 order-0">
            <div className="card h-100 p-2">
              <div className="d-flex align-items-end row">
                <div className="col-asm-7">
                  <div className="card-body p-3">
                    <h5
                      className="card-title text-primary mb-2"
                      style={{ fontSize: "0.9rem" }}
                    >
                      Hoş Geldiniz! 🎉
                    </h5>
                    <p className="mb-3" style={{ fontSize: "0.8rem" }}>
                      Fiero Admin Paneline hoş geldiniz. Sol menüden yönetim
                      işlemlerine erişebilirsiniz.
                    </p>
                    <a
                      href="/admin/categories"
                      className="btn btn-sm btn-outline-primary"
                    >
                      Kategori Yönetimi
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* İstatistik Kartları */}
          <div className="col-lg-4 col-md-4 order-1">
            <div className="row">
              <div className="col-lg-6 col-md-12 col-6 mb-4">
                <div className="card h-100 p-2">
                  <div className="card-body p-3">
                    <div className="card-title d-flex align-items-start justify-content-between mb-2">
                      <div className="avatar flex-shrink-0">
                        <span className="avatar-initial rounded bg-label-primary">
                          <i className="bx bx-category"></i>
                        </span>
                      </div>
                    </div>
                    <span
                      className="fw-semibold d-block mb-1"
                      style={{ fontSize: "0.75rem" }}
                    >
                      Kategoriler
                    </span>
                    <h3
                      className="card-title mb-2"
                      style={{ fontSize: "1rem" }}
                    >
                      4
                    </h3>
                    <small
                      className="text-muted fw-semibold"
                      style={{ fontSize: "0.7rem" }}
                    >
                      Ana Kategori
                    </small>
                  </div>
                </div>
              </div>
              <div className="col-lg-6 col-md-12 col-6 mb-4">
                <div className="card h-100">
                  <div className="card-body p-3">
                    <div className="card-title d-flex align-items-start justify-content-between mb-2">
                      <div className="avatar flex-shrink-0">
                        <span className="avatar-initial rounded bg-label-success">
                          <i className="bx bx-support"></i>
                        </span>
                      </div>
                    </div>
                    <span
                      className="fw-semibold d-block mb-1"
                      style={{ fontSize: "0.75rem" }}
                    >
                      Destek Talepleri
                    </span>
                    <h3
                      className="card-title text-nowrap mb-1"
                      style={{ fontSize: "1rem" }}
                    >
                      5
                    </h3>
                    <small
                      className="text-warning fw-semibold"
                      style={{ fontSize: "0.7rem" }}
                    >
                      Bekleyen Talepler
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Yönetim Kartları */}
        <div className="row">
          {/* Destek Talepleri - Yeni pozisyon */}
          <div className="col-8 mb-4 ">
            <div className="card">
              <div className="row row-bordered g-0">
                <div className="col-md-8 ">
                  <h5 className="card-header p-4 fs-4"> Toplam Gelir</h5>
                  <div id="totalRevenueChart" className="px-2"></div>
                </div>
                <div className="col-md-4">
                  <div className="card-body">
                    <div className="text-center">
                      <div className="dropdown">
                        <button
                          className="btn btn-sm btn-outline-primary dropdown-toggle"
                          type="button"
                          id="growthReportId"
                          data-bs-toggle="dropdown"
                          aria-haspopup="true"
                          aria-expanded="false"
                        >
                          2023
                        </button>
                        <div className="dropdown-menu dropdown-menu-end">
                          <a className="dropdown-item" href="#">
                            2022
                          </a>
                          <a className="dropdown-item" href="#">
                            2021
                          </a>
                          <a className="dropdown-item" href="#">
                            2020
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div id="growthChart"></div>
                  <div className="text-center fw-semibold pt-3 mb-2">
                    62% Şirket Büyümesi
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Total Balance - Yeni tasarım */}
          <div className="col-md-6 col-lg-4 mb-4 pb-2">
            <div className="card h-100">
              <div className="card-body px-0">
                <div className="tab-content p-0">
                  <div
                    className="tab-pane fade show active"
                    id="navs-tabs-line-card-income"
                    role="tabpanel"
                  >
                    <div className="d-flex p-4 pt-3">
                      <div className="avatar flex-shrink-0 me-3">
                        <img
                          src="../assets/admin/img/icons/unicons/wallet.png"
                          alt="User"
                        />
                      </div>
                      <div>
                        <small className="text-muted d-block">
                          Toplam Bakiye
                        </small>
                        <div className="d-flex align-items-center">
                          <h6 className="mb-0 me-1">$459.10</h6>
                          <small className="text-success fw-semibold">
                            <i className="bx bx-chevron-up"></i>
                            42.9%
                          </small>
                        </div>
                      </div>
                    </div>
                    <div id="incomeChart"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Kategori Yönetimi */}
          <div className="col-md-6 col-lg-4 mb-4">
            <div className="card h-100 p-4">
              <div className="card-header d-flex align-items-center justify-content-between py-3">
                <h5
                  className="card-title m-0 me-2"
                  style={{ fontSize: "0.85rem" }}
                >
                  <i className="bx bx-category me-2 text-primary"></i>
                  Kategori Yönetimi
                </h5>
              </div>
              <div className="card-body p-3">
                <p className="card-text" style={{ fontSize: "0.8rem" }}>
                  Ürün kategorilerini ve alt kategorilerini yönetin. Yeni
                  kategoriler ekleyin, düzenleyin veya silin.
                </p>
                <div className="d-flex flex-column gap-2 mt-3">
                  <div
                    className="d-flex justify-content-between align-items-center"
                    style={{ fontSize: "0.75rem" }}
                  >
                    <span>Ana Kategoriler</span>
                    <span className="badge bg-primary">4</span>
                  </div>
                  <div
                    className="d-flex justify-content-between align-items-center"
                    style={{ fontSize: "0.75rem" }}
                  >
                    <span>Alt Kategoriler</span>
                    <span className="badge bg-info">12</span>
                  </div>
                  <div
                    className="d-flex justify-content-between align-items-center"
                    style={{ fontSize: "0.75rem" }}
                  >
                    <span>Toplam Ürün</span>
                    <span className="badge bg-success">120</span>
                  </div>
                </div>
                <div className="mt-4">
                  <a
                    href="/admin/categories"
                    className="btn btn-primary btn-sm w-100"
                  >
                    <i className="bx bx-right-arrow-alt me-1 "></i>
                    Kategorileri Yönet
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* İçerik Yönetimi */}
          <div className="col-md-6 col-lg-4 mb-4">
            <div className="card h-100 p-4">
              <div className="card-header d-flex align-items-center justify-content-between py-3">
                <h5
                  className="card-title m-0 me-2"
                  style={{ fontSize: "0.85rem" }}
                >
                  <i className="bx bx-edit me-2 text-success"></i>
                  İçerik Yönetimi
                </h5>
              </div>
              <div className="card-body p-3">
                <p className="card-text" style={{ fontSize: "0.8rem" }}>
                  Site içeriklerini düzenleyin. Ana sayfa, hakkımızda, iletişim
                  gibi sayfaların içeriklerini yönetin.
                </p>
                <div className="d-flex flex-column gap-2 mt-3">
                  <div
                    className="d-flex justify-content-between align-items-center"
                    style={{ fontSize: "0.75rem" }}
                  >
                    <span>Statik Sayfalar</span>
                    <span className="badge bg-primary">5</span>
                  </div>
                  <div
                    className="d-flex justify-content-between align-items-center"
                    style={{ fontSize: "0.75rem" }}
                  >
                    <span>Slider Görselleri</span>
                    <span className="badge bg-info">3</span>
                  </div>
                  <div
                    className="d-flex justify-content-between align-items-center"
                    style={{ fontSize: "0.75rem" }}
                  >
                    <span>Banner Görselleri</span>
                    <span className="badge bg-success">4</span>
                  </div>
                </div>
                <div className="mt-4">
                  <a
                    href="/admin/general-content"
                    className="btn btn-primary btn-sm w-100"
                  >
                    <i className="bx bx-right-arrow-alt me-1"></i>
                    İçerikleri Yönet
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Alt Kategori Özellikleri */}
          <div className="col-md-6 col-lg-4 mb-4">
            <div className="card h-100 p-4">
              <div className="card-header d-flex align-items-center justify-content-between py-3">
                <h5
                  className="card-title m-0 me-2"
                  style={{ fontSize: "0.85rem" }}
                >
                  <i className="bx bx-list-ul me-2 text-info"></i>
                  Alt Kategori Özellikleri
                </h5>
              </div>
              <div className="card-body p-3">
                <p className="card-text" style={{ fontSize: "0.8rem" }}>
                  Alt kategorilere özel ürün özelliklerini tanımlayın. Renk,
                  beden, malzeme gibi özellikleri yönetin.
                </p>
                <div className="d-flex flex-column gap-2 mt-3">
                  <div
                    className="d-flex justify-content-between align-items-center"
                    style={{ fontSize: "0.75rem" }}
                  >
                    <span>Tanımlı Özellikler</span>
                    <span className="badge bg-primary">8</span>
                  </div>
                  <div
                    className="d-flex justify-content-between align-items-center"
                    style={{ fontSize: "0.75rem" }}
                  >
                    <span>Özellik Seçenekleri</span>
                    <span className="badge bg-info">24</span>
                  </div>
                  <div
                    className="d-flex justify-content-between align-items-center"
                    style={{ fontSize: "0.75rem" }}
                  >
                    <span>Kullanılan Alt Kategoriler</span>
                    <span className="badge bg-success">6</span>
                  </div>
                </div>
                <div className="mt-4">
                  <a
                    href="/admin/sub-category-specifications"
                    className="btn btn-primary btn-sm w-100"
                  >
                    <i className="bx bx-right-arrow-alt me-1"></i>
                    Özellikleri Yönet
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Destek Talepleri */}
          <div className="col-md-6 col-lg-4 mb-4">
            <div className="card h-100 p-4">
              <div className="card-header d-flex align-items-center justify-content-between py-3">
                <h5
                  className="card-title m-0 me-2"
                  style={{ fontSize: "0.85rem" }}
                >
                  <i className="bx bx-support me-2 text-warning"></i>
                  Destek Talepleri
                </h5>
              </div>
              <div className="card-body p-3">
                <p className="card-text" style={{ fontSize: "0.8rem" }}>
                  Müşterilerden gelen destek taleplerini görüntüleyin ve
                  yanıtlayın. Talepleri kategorilere göre filtreleyebilirsiniz.
                </p>
                <div className="d-flex flex-column gap-2 mt-4">
                  <div
                    className="d-flex justify-content-between align-items-center"
                    style={{ fontSize: "0.75rem" }}
                  >
                    <span>Toplam Talepler</span>
                    <span className="badge bg-primary">15</span>
                  </div>
                  <div
                    className="d-flex justify-content-between align-items-center"
                    style={{ fontSize: "0.75rem" }}
                  >
                    <span>Bekleyen Talepler</span>
                    <span className="badge bg-warning">5</span>
                  </div>
                  <div
                    className="d-flex justify-content-between align-items-center"
                    style={{ fontSize: "0.75rem" }}
                  >
                    <span>Yanıtlanan Talepler</span>
                    <span className="badge bg-success">10</span>
                  </div>
                </div>
                <div className="mt-4">
                  <a
                    href="/admin/support-tickets"
                    className="btn btn-primary btn-sm w-100"
                  >
                    <i className="bx bx-right-arrow-alt me-1"></i>
                    Talepleri Görüntüle
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Hızlı Erişim */}
          <div className="col-md-6 col-lg-4 mb-4">
            <div className="card h-100 p-4">
              <div className="card-header d-flex align-items-center justify-content-between py-3">
                <h5
                  className="card-title m-0 me-2"
                  style={{ fontSize: "0.85rem" }}
                >
                  <i className="bx bx-rocket me-2 text-danger"></i>
                  Hızlı Erişim
                </h5>
              </div>
              <div className="card-body p-3">
                <p className="card-text" style={{ fontSize: "0.8rem" }}>
                  Sık kullanılan işlemlere hızlıca erişin. Aşağıdaki butonları
                  kullanarak ilgili sayfalara gidebilirsiniz.
                </p>
                <div className="d-flex flex-column gap-2 mt-3">
                  <a
                    href="/admin/categories"
                    className="btn btn-outline-primary btn-sm"
                  >
                    <i className="bx bx-category me-1"></i>
                    Kategori Yönetimi
                  </a>
                  <a
                    href="/admin/general-content"
                    className="btn btn-outline-primary btn-sm"
                  >
                    <i className="bx bx-edit me-1"></i>
                    İçerik Yönetimi
                  </a>
                  <a
                    href="/admin/sub-category-specifications"
                    className="btn btn-outline-primary btn-sm"
                  >
                    <i className="bx bx-list-ul me-1"></i>
                    Alt Kategori Özellikleri
                  </a>
                  <a
                    href="/admin/support-tickets"
                    className="btn btn-outline-primary btn-sm"
                  >
                    <i className="bx bx-support me-1"></i>
                    Destek Talepleri
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Yardım ve Destek */}
          <div className="col-md-6 col-lg-4 mb-4">
            <div className="card h-100 p-4">
              <div className="card-header d-flex align-items-center justify-content-between py-3">
                <h5
                  className="card-title m-0 me-2"
                  style={{ fontSize: "0.85rem" }}
                >
                  <i className="bx bx-help-circle me-2 text-secondary"></i>
                  Yardım ve Destek
                </h5>
              </div>
              <div className="card-body p-3">
                <p className="card-text" style={{ fontSize: "0.8rem" }}>
                  Admin paneli kullanımı hakkında yardıma mı ihtiyacınız var?
                  Aşağıdaki kaynaklara göz atabilirsiniz.
                </p>
                <div className="d-flex flex-column gap-2 mt-3">
                  <div className="card bg-light p-3">
                    <h6 className="mb-2" style={{ fontSize: "0.8rem" }}>
                      Kullanım Kılavuzu
                    </h6>
                    <p className="mb-0 small" style={{ fontSize: "0.7rem" }}>
                      Admin panelinin tüm özelliklerini detaylı olarak açıklayan
                      kullanım kılavuzuna erişin.
                    </p>
                    <a
                      href="#"
                      className="mt-2 small"
                      style={{ fontSize: "0.7rem" }}
                    >
                      Kılavuzu Görüntüle{" "}
                      <i className="bx bx-right-arrow-alt"></i>
                    </a>
                  </div>
                  <div className="card bg-light p-3">
                    <h6 className="mb-2" style={{ fontSize: "0.8rem" }}>
                      Sık Sorulan Sorular
                    </h6>
                    <p className="mb-0 small" style={{ fontSize: "0.7rem" }}>
                      Admin paneli kullanımı hakkında sık sorulan soruların
                      cevaplarını bulun.
                    </p>
                    <a
                      href="#"
                      className="mt-2 small"
                      style={{ fontSize: "0.7rem" }}
                    >
                      SSS'leri Görüntüle{" "}
                      <i className="bx bx-right-arrow-alt"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="content-backdrop fade"></div>
    </div>
  );
}

export default AdminHomePage;
