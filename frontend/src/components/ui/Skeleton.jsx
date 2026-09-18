import React from 'react';

/**
 * Blueprint-style skeleton loader
 * Looks like technical drawings loading, not generic grey blocks
 */
const Skeleton = ({ className = '', variant = 'line', count = 1 }) => {
  const baseClasses =
    'animate-pulse bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border border-primary/10 rounded';

  const variants = {
    line: 'h-4 w-full',
    title: 'h-6 w-3/4',
    image: 'aspect-square w-full rounded-lg',
    card: 'h-48 w-full rounded-xl',
    circle: 'h-12 w-12 rounded-full',
    button: 'h-12 w-full rounded-lg',
  };

  if (count > 1) {
    return (
      <div className={`flex flex-col gap-3 ${className}`}>
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className={`${baseClasses} ${variants[variant]}`}
            style={{ width: variant === 'line' ? `${100 - i * 15}%` : undefined }}
          />
        ))}
      </div>
    );
  }

  return (
    <div className={`${baseClasses} ${variants[variant]} ${className}`} />
  );
};

export default Skeleton;
