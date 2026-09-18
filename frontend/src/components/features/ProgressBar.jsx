import React from 'react';

/**
 * FOMO progress bar showing entries sold percentage
 */
const ProgressBar = ({
  current,
  max,
  label = '',
  showPercentage = true,
  className = '',
}) => {
  const percentage = Math.min((current / max) * 100, 100);

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {(label || showPercentage) && (
        <div className="flex justify-between text-xs uppercase font-bold text-gray-400">
          {label && <span>{label}</span>}
          {showPercentage && (
            <span className="text-primary">{percentage.toFixed(0)}%</span>
          )}
        </div>
      )}
      <div className="h-2 bg-black rounded-full overflow-hidden border border-white/10">
        <div
          className="h-full bg-primary shadow-[0_0_10px_#6af425] transition-all duration-1000 ease-out rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
