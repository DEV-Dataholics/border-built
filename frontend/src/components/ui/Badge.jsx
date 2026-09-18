import React from 'react';

const badgeVariants = {
  'BEST SELLER': 'bg-orange-500 text-white',
  'NEW DROP': 'bg-primary text-background-dark',
  'HIGH VALUE': 'bg-purple-600 text-white',
  'SOLD OUT': 'bg-red-600 text-white',
  'LIMITED': 'bg-yellow-500 text-black',
  default: 'bg-primary/20 text-primary border border-primary/30',
};

const Badge = ({ text, variant, className = '' }) => {
  const style =
    badgeVariants[variant || text] || badgeVariants.default;

  return (
    <span
      className={`
        inline-flex items-center px-2 py-0.5 rounded-sm
        text-[9px] font-black uppercase tracking-widest
        shadow-lg ${style} ${className}
      `}
    >
      {text}
    </span>
  );
};

export default Badge;
