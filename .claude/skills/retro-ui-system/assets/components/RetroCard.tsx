import React from 'react';

interface RetroCardProps {
  children: React.ReactNode;
  className?: string;
  glow?: 'pink' | 'cyan' | 'purple' | 'none';
  dots?: boolean;
}

const glowStyles = {
  pink: 'border-retro-primary/50 shadow-[0_4px_20px_rgba(0,0,0,0.5),0_0_30px_-10px_rgba(255,45,149,0.4)]',
  cyan: 'border-retro-cyan/50 shadow-[0_4px_20px_rgba(0,0,0,0.5),0_0_30px_-10px_rgba(0,245,255,0.4)]',
  purple: 'border-retro-purple/50 shadow-[0_4px_20px_rgba(0,0,0,0.5),0_0_30px_-10px_rgba(157,78,221,0.4)]',
  none: 'border-white/15 shadow-[0_4px_20px_rgba(0,0,0,0.5)]',
};

const hoverGlowStyles = {
  pink: 'hover:border-[#ff2d95] hover:shadow-[0_8px_30px_rgba(0,0,0,0.6),0_0_50px_-10px_rgba(255,45,149,0.5)]',
  cyan: 'hover:border-[#00f5ff] hover:shadow-[0_8px_30px_rgba(0,0,0,0.6),0_0_50px_-10px_rgba(0,245,255,0.5)]',
  purple: 'hover:border-[#9d4edd] hover:shadow-[0_8px_30px_rgba(0,0,0,0.6),0_0_50px_-10px_rgba(157,78,221,0.5)]',
  none: 'hover:border-white/25 hover:shadow-[0_8px_30px_rgba(0,0,0,0.6)]',
};

export function RetroCard({
  children,
  className = '',
  glow = 'pink',
  dots = true,
}: RetroCardProps) {
  return (
    <div className={`
      relative
      bg-[#161620]
      border-2 ${glowStyles[glow]}
      rounded-[8px]
      ${hoverGlowStyles[glow]}
      transition-all duration-200
      overflow-hidden
      ${className}
    `}>
      {/* Dot pattern background */}
      {dots && (
        <div
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255, 255, 255, 0.15) 1px, transparent 1px)',
            backgroundSize: '16px 16px',
          }}
        />
      )}

      {/* Neon top edge */}
      <div className={`
        absolute top-0 left-0 right-0 h-0.5
        ${glow === 'pink' ? 'bg-gradient-to-r from-[#ff2d95] to-[#9d4edd]' : ''}
        ${glow === 'cyan' ? 'bg-gradient-to-r from-[#00f5ff] to-[#9d4edd]' : ''}
        ${glow === 'purple' ? 'bg-gradient-to-r from-[#9d4edd] to-[#ff2d95]' : ''}
        ${glow === 'none' ? 'bg-white/20' : ''}
      `} />

      <div className="relative">{children}</div>
    </div>
  );
}

export default RetroCard;
