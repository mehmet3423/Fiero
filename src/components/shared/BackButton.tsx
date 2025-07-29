import Link from "next/link";
import { CSSProperties } from "react";

interface BackButtonProps {
  href: string;
  label?: string;
  /** Additional Tailwind/Bootstrap utility classes */
  className?: string;
  /** Inline style overrides */
  style?: CSSProperties;
  /** Custom icon classes for the back icon */
  iconClassName?: string;
}

export default function BackButton({
  href,
  label = "Geri",
  className,
  style,
  iconClassName,
}: BackButtonProps) {
  return (
    <Link
      href={href}
      className={`btn btn-outline-secondary ${className ?? ""}`}
      style={{
        marginBottom: "10px",
        backgroundColor: "#e9e9e9",
        color: "#000",
        borderColor: "#d9d9d9",
        ...style,
      }}
    >
      <i className={`bx bx-arrow-back me-1 ${iconClassName ?? ""}`}></i>
      {label}
    </Link>
  );
}
