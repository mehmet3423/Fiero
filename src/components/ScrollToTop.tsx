import React, { useState, useEffect } from 'react';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const toggleVisibility = () => {
      const scrolled = window.pageYOffset || document.documentElement.scrollTop || 0;
      const maxHeight = Math.max(
        document.body.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.clientHeight,
        document.documentElement.scrollHeight,
        document.documentElement.offsetHeight
      ) - window.innerHeight;

      const progress = maxHeight > 0 ? (scrolled / maxHeight) * 100 : 0;
      setScrollProgress(Math.min(progress, 100));
      setIsVisible(scrolled > 300);
    };

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (!isVisible) return null;

  // Circle progress için değerler
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

  return (
    <div
      onClick={scrollToTop}
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        width: '50px',
        height: '50px',
        cursor: 'pointer',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0.5,
      }}
    >
      {/* Progress Circle SVG */}
      <svg
        width="50"
        height="50"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          transform: 'rotate(-90deg)',

        }}
      >
        {/* Background Circle */}
        <circle
          cx="25"
          cy="25"
          r={radius}
          fill="none"
          stroke="rgba(213, 213, 213, 0.75)"
          strokeWidth="2"
        />
        {/* Progress Circle */}
        <circle
          cx="25"
          cy="25"
          r={radius}
          fill="none"
          stroke="rgba(90, 90, 90, 0.75)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{
            transition: 'stroke-dashoffset 0.1s ease-in-out'
          }}
        />
      </svg>
      
      {/* Button */}
      <button
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: 'rgba(128, 128, 128, 0.8)', // Yarı saydam gri
          backdropFilter: 'blur(5px)', // Blur efekti
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          fontSize: '18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s ease',
          zIndex: 1
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(128, 128, 128, 0.95)';
          e.currentTarget.style.transform = 'scale(1.05)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(128, 128, 128, 0.8)';
          e.currentTarget.style.transform = 'scale(1)';
        }}
        title="Yukarı Git"
      >
        ↑
      </button>
    </div>
  );
};

export default ScrollToTop;