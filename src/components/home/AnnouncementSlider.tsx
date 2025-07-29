"use client";

import type React from "react";
import { useState, useEffect } from "react";

const announcements = [
  "Tüm ürünlerde %30 indirim!",
  "5000TL alışverişe Çanta hediye!",
  "Kargo ücretsiz!",
];

const AnnouncementSlider: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!isHovered) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) =>
          prevIndex === announcements.length - 1 ? 0 : prevIndex + 1
        );
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [isHovered]);

  return (
    <div
      className="py-2 w-100"
      style={{ height: "30px", backgroundColor: "#000000", overflow: "hidden" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="container">
        <div className="d-flex align-items-center h-100">
          <div className="ticker-wrapper">
            <div className={`ticker  `}>
              {announcements
                .concat(announcements)
                .map((announcement, index) => (
                  <span
                    key={index}
                    className={`ticker-item text-white fw-bold ${
                      currentIndex === index % announcements.length
                        ? "active"
                        : ""
                    }`}
                  >
                    {announcement}
                  </span>
                ))}
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .ticker-wrapper {
          width: 100%;
          overflow: hidden;
          position: relative;
        }
        .ticker {
          display: flex;
          white-space: nowrap;
          animation: ticker 15s linear infinite;
          animation-play-state: running;
        }
        .ticker.paused {
          animation-play-state: paused;
        }
        .ticker-item {
          display: inline-block;
          margin-right: 250px;
          font-size: 16px;
          color: white;
          opacity: 0.8;
          transition: all 0.3s ease;
          transform: translateY(0);
        }
        .ticker-item.active {
          opacity: 1;
          transform: translateY(-2px);
          text-shadow: 0 0 8px rgba(255, 255, 255, 0.5);
        }
        .ticker-item:hover {
          opacity: 1;
          transform: translateY(-2px);
          text-shadow: 0 0 8px rgba(255, 255, 255, 0.5);
        }
        @keyframes ticker {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
};

export default AnnouncementSlider;
