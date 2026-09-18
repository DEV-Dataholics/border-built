import React, { useEffect, useState, useRef } from 'react';

/**
 * Slot machine / odometer effect counter for entries
 */
const EntryCounter = ({ value, className = '', duration = 1500 }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const prevValue = useRef(0);

  useEffect(() => {
    const start = prevValue.current;
    const end = value;
    prevValue.current = value;

    if (start === end) {
      setDisplayValue(end);
      return;
    }

    const range = end - start;
    let startTime = null;

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      // easeOutExpo easing
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setDisplayValue(Math.floor(start + range * ease));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration]);

  return (
    <span className={`font-mono tabular-nums ${className}`}>
      {displayValue.toLocaleString()}
    </span>
  );
};

export default EntryCounter;
