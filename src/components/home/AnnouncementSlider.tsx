"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";



const AnnouncementSlider: React.FC = () => {
  const { t } = useLanguage();
  const announcements = [
    t("announcementSlider.announcements.0"),
    t("announcementSlider.announcements.1"),
    t("announcementSlider.announcements.2"),
  ];
  const [isVisible, setIsVisible] = useState(true);

  const closeAnnouncement = () => {
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <>
      <style jsx>{`
        .announcement-bar {
        position: sticky !important;
        top: 0;
          height: 30px !important;
          padding: 0 65px 0 0 !important;
          z-index: 1003 !important;
        }
        .announcement-bar-item p {
          padding: 5px 0px !important;
          font-size: 11px !important;
          line-height: 20px !important;
        }
        .box-sw-announcement-bar {
          -webkit-animation: slide-har 25s linear infinite !important;
          animation: slide-har 45s linear infinite !important;
        }
        .announcement-bar .close-announcement-bar {
          height: 30px !important;
        }
      `}</style>
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
        <span
          className="icon-close close-announcement-bar"
          onClick={closeAnnouncement}
        ></span>
      </div>
    </>
  );
};

export default AnnouncementSlider;
