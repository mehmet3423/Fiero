"use client";

import type React from "react";
import { useState, useEffect } from "react";

const announcements = [
  "Tüm ürünlerde %30 indirim!",
  "5000TL alışverişe Çanta hediye!",
  "Kargo ücretsiz!",
];

const AnnouncementSlider: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  const closeAnnouncement = () => {
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="announcement-bar bg_dark">
      <div className="wrap-announcement-bar">
        <div className="box-sw-announcement-bar">
          {announcements.map((announcement, index) => (
            <div key={index} className="announcement-bar-item">
              <p>{announcement}</p>
            </div>
          ))}
          {/* Tekrar için aynı elemanları ekliyoruz */}
          {announcements.map((announcement, index) => (
            <div key={`repeat-${index}`} className="announcement-bar-item">
              <p>{announcement}</p>
            </div>
          ))}
          {/* Üçüncü tekrar */}
          {announcements.map((announcement, index) => (
            <div key={`repeat2-${index}`} className="announcement-bar-item">
              <p>{announcement}</p>
            </div>
          ))}
          {/* Dördüncü tekrar */}
          {announcements.map((announcement, index) => (
            <div key={`repeat3-${index}`} className="announcement-bar-item">
              <p>{announcement}</p>
            </div>
          ))}
          {/* Beşinci tekrar */}
          {announcements.map((announcement, index) => (
            <div key={`repeat4-${index}`} className="announcement-bar-item">
              <p>{announcement}</p>
            </div>
          ))}
        </div>
      </div>
      <span className="icon-close close-announcement-bar" onClick={closeAnnouncement}></span>
    </div>
  );
};

export default AnnouncementSlider;
