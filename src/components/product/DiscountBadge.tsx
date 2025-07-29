import React from "react";

interface DiscountBadgeProps {
  percentage: number | null;
}

const DiscountBadge: React.FC<DiscountBadgeProps> = ({ percentage }) => {
  if (percentage === null) return null;

  return (
    <div
      style={{
        position: "absolute",
        top: "0",
        left: "0",
        width: "100px",
        height: "100px",
        overflow: "hidden",
        zIndex: 1200,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "10px",
          left: "-40px",
          width: "120px",
          padding: "3px 0",
          backgroundColor: "black",
          color: "white",
          textAlign: "center",
          fontSize: "1.2rem",
          fontWeight: 600,
          transform: "rotate(-45deg)",
          boxShadow: "0 3px 5px rgba(0,0,0,0.3)",
          lineHeight: "1.2",
        }}
      >
        %{percentage}
      </div>
    </div>
  );
};

export default DiscountBadge;
