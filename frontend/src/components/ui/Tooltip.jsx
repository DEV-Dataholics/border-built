import React from 'react';

const Tooltip = ({ children, content, position = 'top' }) => {
  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2'
  };

  return (
    <div className="relative group inline-block">
      {children}
      <div className={`absolute ${positionClasses[position]} z-[100] w-max max-w-[200px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200`}>
        <div className="bg-[#1A1A1A] border border-primary text-white text-[10px] font-mono uppercase p-2 rounded shadow-[0_0_10px_rgba(106,244,37,0.2)] whitespace-normal break-words text-center">
          {content}
        </div>
      </div>
    </div>
  );
};

export default Tooltip;
