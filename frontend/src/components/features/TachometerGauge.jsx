import React, { useEffect, useState } from 'react';

/**
 * Animated SVG tachometer gauge for the My Garage dashboard
 * Shows user's total entries as a percentage of max possible
 */
const TachometerGauge = ({
  value = 0,
  max = 10000,
  label = 'Entries',
  className = '',
}) => {
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    // Animate from 0 to value
    let startTime = null;
    const duration = 2000;

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setAnimatedValue(Math.floor(value * ease));
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [value]);

  const percentage = Math.min((animatedValue / max) * 100, 100);
  // SVG arc: 240 degree sweep (from -120 to +120)
  const radius = 80;
  const circumference = radius * Math.PI * (240 / 180);
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      <svg viewBox="0 0 200 140" className="w-48 h-auto">
        {/* Background arc */}
        <path
          d="M 20 120 A 80 80 0 1 1 180 120"
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="12"
          strokeLinecap="round"
        />
        {/* Colored arc */}
        <path
          d="M 20 120 A 80 80 0 1 1 180 120"
          fill="none"
          stroke="url(#neonGradient)"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-500 ease-out"
          style={{
            filter: 'drop-shadow(0 0 6px rgba(106, 244, 37, 0.6))',
          }}
        />
        {/* Gradient definition */}
        <defs>
          <linearGradient id="neonGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4db31b" />
            <stop offset="50%" stopColor="#6af425" />
            <stop offset="100%" stopColor="#39FF14" />
          </linearGradient>
        </defs>
        {/* Center text */}
        <text
          x="100"
          y="95"
          textAnchor="middle"
          className="fill-white text-3xl font-black font-mono"
          style={{ fontSize: '28px' }}
        >
          {animatedValue.toLocaleString()}
        </text>
        <text
          x="100"
          y="115"
          textAnchor="middle"
          className="fill-gray-400 uppercase tracking-widest"
          style={{ fontSize: '8px', fontWeight: 'bold' }}
        >
          {label}
        </text>
      </svg>
    </div>
  );
};

export default TachometerGauge;
