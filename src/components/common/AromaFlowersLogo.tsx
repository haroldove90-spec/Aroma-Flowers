import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'custom';
  withText?: boolean;
  unencapsulated?: boolean;
}

export const AromaFlowersLogo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  withText = false,
  unencapsulated = false,
}) => {
  const sizeMap = {
    sm: 'w-7 h-7',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
    custom: '',
  };

  const currentSize = sizeMap[size];

  // Pure SVG Emblem of Aroma Flowers
  const logoSvg = (
    <svg
      viewBox="0 0 120 120"
      className={`${currentSize} ${className} shrink-0`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="afGreenGrad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#047857" />
          <stop offset="60%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#34d399" />
        </linearGradient>
        <linearGradient id="afRoseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e11d48" />
          <stop offset="100%" stopColor="#fb7185" />
        </linearGradient>
        <linearGradient id="afRoofGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#059669" />
          <stop offset="100%" stopColor="#064e3b" />
        </linearGradient>
      </defs>

      {/* Greenhouse Arch Structure */}
      <path
        d="M 16,92 L 16,56 C 16,22 104,22 104,56 L 104,92"
        stroke="url(#afRoofGrad)"
        strokeWidth="4"
        strokeLinecap="round"
      />
      
      {/* Gothic Gable Ribs (Invernadero) */}
      <path
        d="M 34,92 L 34,50 C 34,28 86,28 86,50 L 86,92"
        stroke="#10b981"
        strokeWidth="1.8"
        strokeDasharray="3 2"
        strokeOpacity="0.7"
      />
      <line x1="60" y1="23" x2="60" y2="92" stroke="#047857" strokeWidth="1.5" strokeOpacity="0.4" />
      <line x1="16" y1="56" x2="104" y2="56" stroke="#059669" strokeWidth="1.5" strokeOpacity="0.4" />

      {/* Greenhouse Ground Base Line */}
      <path d="M 10,95 Q 60,99 110,95" stroke="#065f46" strokeWidth="3.5" strokeLinecap="round" />

      {/* Botanical Aroma Leaves */}
      {/* Left Leaf */}
      <path
        d="M 60,86 C 42,82 30,64 42,48 C 50,58 56,72 60,86 Z"
        fill="url(#afGreenGrad)"
        opacity="0.95"
      />
      {/* Right Leaf */}
      <path
        d="M 60,86 C 78,82 90,64 78,48 C 70,58 64,72 60,86 Z"
        fill="url(#afGreenGrad)"
        opacity="0.95"
      />

      {/* Blooming Center Rose Petals */}
      <path
        d="M 60,78 C 48,64 50,46 60,34 C 70,46 72,64 60,78 Z"
        fill="url(#afRoseGrad)"
      />
      {/* Inner Highlight Petal */}
      <path
        d="M 60,70 C 53,59 55,48 60,40 C 65,48 67,59 60,70 Z"
        fill="#ffffff"
        opacity="0.85"
      />

      {/* Fragrance Aroma Waves Floating Up */}
      <path d="M 52,22 Q 56,15 52,8" fill="none" stroke="#10b981" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M 60,18 Q 63,12 60,6" fill="none" stroke="#e11d48" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M 68,22 Q 64,15 68,8" fill="none" stroke="#10b981" strokeWidth="1.7" strokeLinecap="round" />

      {/* Central Stem */}
      <line x1="60" y1="92" x2="60" y2="78" stroke="#047857" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );

  if (unencapsulated || !withText) {
    return logoSvg;
  }

  return (
    <div className="flex items-center gap-2.5">
      {logoSvg}
      <div className="flex flex-col">
        <span className="font-bold tracking-tight text-slate-900 text-lg sm:text-xl leading-none">
          Aroma <span className="text-emerald-600">Flowers</span>
        </span>
        <span className="text-[10px] tracking-wider font-semibold text-emerald-800 uppercase mt-0.5">
          Invernadero Florícola
        </span>
      </div>
    </div>
  );
};
