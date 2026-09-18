import React from 'react';

const variants = {
  primary:
    'bg-primary text-background-dark font-bold shadow-[0_0_20px_rgba(106,244,37,0.4)] hover:shadow-[0_0_30px_rgba(106,244,37,0.6)]',
  secondary:
    'bg-white/10 text-white border border-white/10 hover:border-primary/50 hover:text-primary',
  ghost:
    'bg-transparent text-white border border-white/10 hover:border-primary/50 hover:text-primary',
  danger:
    'bg-red-600/20 text-red-400 border border-red-600/30 hover:bg-red-600/30',
};

const sizes = {
  sm: 'h-9 px-3 text-xs',
  md: 'h-12 px-5 text-sm',
  lg: 'h-14 px-6 text-lg',
};

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  icon,
  disabled = false,
  ...props
}) => {
  return (
    <button
      className={`
        group relative flex items-center justify-center gap-2 overflow-hidden
        rounded-lg font-bold uppercase tracking-wider
        transition-all duration-300 active:scale-[0.98]
        disabled:opacity-40 disabled:pointer-events-none
        ${variants[variant]} ${sizes[size]} ${className}
      `}
      disabled={disabled}
      {...props}
    >
      {variant === 'primary' && (
        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 skew-y-12" />
      )}
      {icon && <span className="relative z-10">{icon}</span>}
      <span className="relative z-10">{children}</span>
    </button>
  );
};

export default Button;
