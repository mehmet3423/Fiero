import {
  faBirthdayCake,
  faBoxes,
  faCalendarAlt,
  faCartArrowDown,
  faClock,
  faGift,
  faLayerGroup,
  faPercent,
  faTicket,
  faTruck,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";

interface CampaignCardProps {
  title: string;
  description: string;
  icon: any;
  path: string;
}

function CampaignCard({ title, description, icon, path }: CampaignCardProps) {
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

function CampaignPage() {
  const campaigns = [
    {
      title: "Ürün İndirimi",
      description: "Belirli ürünler için indirim kampanyaları oluşturun",
      icon: faPercent,
      path: "/admin/campaigns/product-discount",
    },
    {
      title: "Kategori İndirimi",
      description: "Ürün kategorilerine özel indirimler tanımlayın",
      icon: faLayerGroup,
      path: "/admin/campaigns/category-discount",
    },
    {
      title: "Bundle İndirimi",
      description: "Çoklu ürün alımlarında özel indirimler oluşturun",
      icon: faBoxes,
      path: "/admin/campaigns/bundle-discount",
    },

    {
      title: "Belirli Saat Aralığındaki İndirimler",
      description: "Belirli saat aralığındaki indirimler",
      icon: faClock,
      path: "/admin/campaigns/time-of-day-discount",
    },
    {
      title: "Haftanın Belirli Günleri İndirimleri",
      description: "Haftanın belirli günleri indirimleri",
      icon: faCalendarAlt,
      path: "/admin/campaigns/weekday-discount",
    },

    {
      title: "Özel Gün Kampanyası",
      description: "Özel gün kampanyaları oluşturun",
      icon: faGift,
      path: "/admin/campaigns/special-day-discount",
    },
    {
      title: "Doğum Günü",
      description: "Doğum günü özel kampanyaları yönetin",
      icon: faBirthdayCake,
      path: "/admin/campaigns/birthday-discount",
    },

    {
      title: "Sepette İndirim",
      description: "Sepet toplamına göre indirim kampanyaları",
      icon: faCartArrowDown,
      path: "/admin/campaigns/cart-discount",
    },
    {
      title: "Kargo İndirimi",
      description: "Sepet toplamına göre indirim kampanyaları",
      icon: faTruck,
      path: "/admin/campaigns/shipping-discount",
    },
    {
      title: "Kupon İndirimi",
      description: "Kupon indirimleri oluşturun",
      icon: faTicket,
      path: "/admin/campaigns/coupon-discount",
    },
    {
      title: "X Al Y Öde İndirimi",
      description: "X Al Y Öde indirimleri oluşturun",
      icon: faTicket,
      path: "/admin/campaigns/buyX-payY",
    },
    {
      title: "Hediye Ürün İndirimi",
      description: "Hediye ürün indirimleri oluşturun",
      icon: faGift,
      path: "/admin/campaigns/gift-product-discount",
    },
  ];

  return (
    <div>
      <h4 className="fw-bold py-3" style={{ marginLeft: "15px" }}>
        Kampanya Yönetimi
      </h4>

      <div className="row g-3 m-2">
        {campaigns.map((campaign, index) => (
          <div className="col-xl-3 col-lg-4 col-md-4 col-sm-6" key={index}>
            <CampaignCard {...campaign} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default CampaignPage;
