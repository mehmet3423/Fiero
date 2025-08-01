import {
  faBoxes,
  faChartBar,
  faChartLine,
  faClose,
  faComments,
  faExclamationTriangle,
  faHeart,
  faImage,
  faShoppingCart,
  faStar,
  faUndo,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";

interface ReportCardProps {
  title: string;
  description: string;
  icon: any;
  path: string;
}

function ReportCard({ title, description, icon, path }: ReportCardProps) {
  const router = useRouter();

  return (
    <div
      className="card h-100 cursor-pointer"
      onClick={() => router.push(path)}
      style={{ transition: "transform 0.2s", cursor: "pointer" }}
      onMouseOver={(e) =>
        (e.currentTarget.style.transform = "translateY(-3px)")
      }
      onMouseOut={(e) => (e.currentTarget.style.transform = "translateY(0)")}
    >
      <div className="card-body p-3">
        <div className="d-flex align-items-center mb-2">
          <div className="avatar flex-shrink-0 me-2">
            <span
              className="avatar-initial rounded bg-label-primary"
              style={{ width: "32px", height: "32px" }}
            >
              <FontAwesomeIcon
                icon={icon}
                className="bx-sm"
                style={{ fontSize: "0.875rem" }}
              />
            </span>
          </div>
          <h5
            className="card-title mb-0"
            style={{ color: "#566a7f", fontSize: "0.875rem" }}
          >
            {title}
          </h5>
        </div>
        <p
          className="card-text mb-0"
          style={{ color: "#697a8d", fontSize: "0.75rem" }}
        >
          {description}
        </p>
      </div>
    </div>
  );
}

function ReportsPage() {
  const reports = [
    {
      title: "Stok Raporu",
      description: "Ürün stok durumlarını görüntüleyin",
      icon: faBoxes,
      path: "/admin/reports/stock-report",
    },
    {
      title: "Pasif Ürünler Raporu",
      description: "Satışta olmayan ürünlerin listesi",
      icon: faExclamationTriangle,
      path: "/admin/reports/passive-products-report",
    },
    {
      title: "Medya Eksik Ürünler Raporu",
      description: "Görseli olmayan ürünlerin raporu",
      icon: faImage,
      path: "/admin/reports/media-missing-products-report",
    },
    {
      title: "En Çok Puanlanan Ürünler Raporu",
      description: "Yüksek puan alan ürünlerin listesi",
      icon: faStar,
      path: "/admin/reports/most-rated-products-report",
    },
    {
      title: "En Çok Beğenilen Ürünler Raporu",
      description: "Favori listesine en çok eklenen ürünler",
      icon: faHeart,
      path: "/admin/reports/most-liked-products-report",
    },
    {
      title: "En Çok Yorumlanan Ürünler Raporu",
      description: "Çok yorumlanan ürünlerin analizi",
      icon: faComments,
      path: "/admin/reports/most-commented-products-report",
    },
    {
      title: "Favori Ürünler Raporu",
      description: "Kullanıcıların favori ürünleri",
      icon: faHeart,
      path: "/admin/reports/favorite-products-report",
    },
    {
      title: "Ürün İade Raporu",
      description: "İade edilen ürünlerin detaylı raporu",
      icon: faUndo,
      path: "/admin/reports/product-return-report",
    },
    {
      title: "İade Nedeni Raporu",
      description: "İade nedenlerinin analizi",
      icon: faChartBar,
      path: "/admin/reports/return-reason-report",
    },
    {
      title: "Ürün Sepet Raporu",
      description: "Sepete eklenen ürünlerin analizi",
      icon: faShoppingCart,
      path: "/admin/reports/product-cart-report",
    },
    {
      title: "Satılmayan Ürünler Raporu",
      description: "Satılmayan ürünlerin raporu",
      icon: faClose,
      path: "/admin/reports/unsold-products-report",
    },
    {
      title: "Ürün Satış Raporu",
      description: "Ürün satışlarının raporu",
      icon: faChartLine,
      path: "/admin/reports/product-sales-report",
    },
  ];

  return (
    <div>
      <h5 className="fw-medium py-3" style={{ marginLeft: "30px" }}>
        Ürün Raporları
      </h5>

      <div className="row g-3 m-2">
        {reports.map((report, index) => (
          <div className="col-xl-3 col-lg-4 col-md-4 col-sm-6" key={index}>
            <ReportCard {...report} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ReportsPage;
