import React from 'react';

const Input = ({
  label,
  type = 'text',
  error,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || `input-${label?.toLowerCase().replace(/\s/g, '-')}`;

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs text-gray-400 uppercase tracking-wider font-bold"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        className={`
          w-full h-12 px-4 rounded-lg
          bg-white/5 border text-white text-sm font-mono
          placeholder:text-gray-600
          focus:outline-none focus:ring-1
          transition-all duration-300
          ${
            error
              ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/30'
              : 'border-white/10 focus:border-primary/50 focus:ring-primary/30'
          }
        `}
        {...props}
      />
      {error && (
        <span className="text-red-400 text-[10px] font-mono uppercase">
          {error}
        </span>
      )}
    </div>
  );
};

export default Input;
