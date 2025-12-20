import Link from "next/link";

interface CampaignBreadcrumbProps {
  campaignType: string;
  campaignTypeLabel: string;
  action: "create" | "edit";
}

export default function CampaignBreadcrumb({
  campaignType,
  campaignTypeLabel,
  action,
}: CampaignBreadcrumbProps) {
  return (
    <h4 className="fw-bold py-3 mb-4">
      <span className="text-muted fw-light">
        <Link
          href="/admin/campaigns"
          className="text-muted fw-light hover:text-primary"
        >
          Kampanyalar
        </Link>{" "}
        /{" "}
        <Link
          href={`/admin/campaigns/${campaignType}`}
          className="text-muted fw-light hover:text-primary"
        >
          {campaignTypeLabel}
        </Link>{" "}
        /
      </span>{" "}
      {action === "create" ? "Yeni İndirim" : "İndirim Düzenle"}
    </h4>
  );
}
