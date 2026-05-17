import React from 'react';
import logoFull from '../assets/pennywise_logo_transparent.png';
import logoMascot from '../assets/pennywise_mascot.png';

export default function Logo({ variant = 'full', height = 'h-10', className = '' }) {
  const src = variant === 'mascot' ? logoMascot : logoFull;
  
  if (variant === 'full') {
    return (
      <div className={`inline-flex items-center justify-center bg-white/95 dark:bg-white/90 p-1.5 px-3 rounded-xl border border-white/20 shadow-sm ${className}`}>
        <img 
          src={logoFull} 
          alt="PennyWise" 
          className={`${height} w-auto object-contain transition-transform duration-300 hover:scale-[1.02]`}
          style={{ display: 'block' }}
        />
      </div>
    );
  }

  return (
    <img 
      src={logoMascot} 
      alt="PennyWise Mascot" 
      className={`${height} w-auto object-contain transition-transform duration-300 hover:scale-105 ${className}`}
      style={{ display: 'block' }}
    />
  );
}
