import React from 'react';

interface ScanlinesProps {
  intensity?: 'normal' | 'glitch';
}

export const Scanlines: React.FC<ScanlinesProps> = ({ intensity = 'normal' }) => {
  return (
    <>
      {/* Primary Scanlines */}
      <div className="scanlines" />
      {/* CRT Corner Vignette */}
      <div className="crt-vignette" />
      {/* Subtle CRT Flicker */}
      {intensity === 'glitch' && (
        <div className="fixed inset-0 pointer-events-none z-50 bg-[#ff00fe]/5 mix-blend-overlay animate-pulse" />
      )}
    </>
  );
};
