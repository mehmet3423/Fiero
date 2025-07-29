import React from "react";
import Image from "next/image";

interface VideoThumbnailProps {
  videoUrl: string;
  alt: string;
  width?: number;
  height?: number;
  showPlayIcon?: boolean;
  onClick?: () => void;
  className?: string;
}

const VideoThumbnail: React.FC<VideoThumbnailProps> = ({
  videoUrl,
  alt,
  width = 80,
  height = 80,
  showPlayIcon = true,
  onClick,
  className = "",
}) => {
  // Helper function to generate video thumbnail
  const getVideoThumbnail = (url: string) => {
    if (url.includes("cloudinary.com")) {
      try {
        const urlParts = url.split("/");
        const uploadIndex = urlParts.findIndex((part) => part === "upload");
        if (uploadIndex !== -1) {
          urlParts.splice(uploadIndex + 1, 0, "c_thumb,w_400,h_300,f_jpg,so_5");
          const thumbnailUrl = urlParts
            .join("/")
            .replace(/\.(mp4|webm|mov|avi)$/i, ".jpg");
          return thumbnailUrl;
        }
      } catch (error) {
        console.warn("Error generating Cloudinary thumbnail:", error);
      }
    }
    return null;
  };

  const thumbnailUrl = getVideoThumbnail(videoUrl);

  return (
    <div
      className={`video-thumbnail-container ${className}`}
      onClick={onClick}
      style={{
        background: thumbnailUrl
          ? `url(${thumbnailUrl}) center/cover`
          : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        marginLeft: "10px",
        borderRadius: "8px",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: onClick ? "pointer" : "default",
      }}
    >
      {thumbnailUrl && (
        <Image
          src={thumbnailUrl}
          alt={alt}
          width={width}
          height={height}
          style={{
            objectFit: "cover",
            borderRadius: "8px",
            width: "100%",
            height: "100%",
          }}
          className="img-fluid"
          unoptimized
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
      )}

      {showPlayIcon && (
        <div
          className="play-icon"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "rgba(255, 255, 255, 0.9)",
            color: "#333",
            borderRadius: "50%",
            width: width > 80 ? "80px" : "28px",
            height: width > 80 ? "80px" : "28px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: width > 80 ? "32px" : "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            if (width > 80) {
              e.currentTarget.style.transform =
                "translate(-50%, -50%) scale(1.1)";
            }
          }}
          onMouseLeave={(e) => {
            if (width > 80) {
              e.currentTarget.style.transform =
                "translate(-50%, -50%) scale(1)";
            }
          }}
        >
          ▶
        </div>
      )}
    </div>
  );
};

export default VideoThumbnail;
