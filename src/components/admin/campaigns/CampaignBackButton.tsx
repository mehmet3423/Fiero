import Link from "next/link";

interface CampaignBackButtonProps {
  href: string;
}

export default function CampaignBackButton({ href }: CampaignBackButtonProps) {
  return (
    <Link
      href={href}
      className="btn btn-outline-secondary"
      style={{
        backgroundColor: "#e9e9e9",
        color: "#000",
        borderColor: "#d9d9d9",
      }}
    >
      <i className="bx bx-arrow-back me-1"></i>
      Geri
    </Link>
  );
}
