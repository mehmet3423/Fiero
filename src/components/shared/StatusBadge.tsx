interface StatusBadgeProps {
  status: number | string;
  type: "order" | "ticket" | "comment" | "custom";
  customConfig?: {
    [key: string | number]: {
      label: string;
      variant: string;
    };
  };
}

// Default configurations for different status types
const ORDER_STATUS_CONFIG = {
  0: { label: "Bilinmiyor", variant: "secondary" },
  1: { label: "Hazırlanıyor", variant: "warning" },
  2: { label: "Çıkış Şubesinde", variant: "info" },
  3: { label: "Kargoya Verildi", variant: "primary" },
  4: { label: "Yolda", variant: "primary" },
  5: { label: "Teslimat Şubesinde", variant: "info" },
  6: { label: "Dağıtıma Çıktı", variant: "warning" },
  7: { label: "Teslim Edildi", variant: "success" },
  8: { label: "Teslim Edilemedi", variant: "danger" },
  9: { label: "İade Süreci Başlatıldı", variant: "warning" },
  10: { label: "İade Edildi", variant: "danger" },
  11: { label: "İade Reddedildi", variant: "danger" },
  12: { label: "İptal Edildi", variant: "secondary" },
};

const TICKET_STATUS_CONFIG = {
  0: { label: "Beklemede", variant: "warning" },
  1: { label: "İşlemde", variant: "info" },
  2: { label: "Çözüldü", variant: "success" },
  3: { label: "Kapandı", variant: "secondary" },
  4: { label: "İptal Edildi", variant: "danger" },
};

const COMMENT_STATUS_CONFIG = {
  0: { label: "Beklemede", variant: "warning" },
  1: { label: "Onaylandı", variant: "success" },
  2: { label: "Reddedildi", variant: "danger" },
};

export default function StatusBadge({
  status,
  type,
  customConfig,
}: StatusBadgeProps) {
  const getConfig = () => {
    if (customConfig) {
      return customConfig;
    }

    switch (type) {
      case "order":
        return ORDER_STATUS_CONFIG;
      case "ticket":
        return TICKET_STATUS_CONFIG;
      case "comment":
        return COMMENT_STATUS_CONFIG;
      default:
        return {};
    }
  };

  const config = getConfig();
  const statusInfo = config[status as keyof typeof config] || {
    label: "Bilinmeyen",
    variant: "secondary",
  };

  return (
    <span className={`badge text-${statusInfo.variant}`}>
      {statusInfo.label}
    </span>
  );
}
