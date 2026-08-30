import React from 'react';

export type MascotMood = 'smug' | 'suspicious' | 'worried' | 'glitched';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  isCorrupted?: boolean;
  mood?: MascotMood;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  animated = true,
  isCorrupted = false,
  mood,
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-24 h-24',
    md: 'w-52 h-52 sm:w-60 sm:h-60 md:w-68 md:h-68',
    lg: 'w-64 h-64 sm:w-76 sm:h-76 md:w-88 md:h-88',
  };

  const resolvedMood: MascotMood = isCorrupted ? 'glitched' : mood || 'smug';

  return (
    <div className={`relative inline-flex items-center justify-center select-none ${sizeClasses[size]} ${className}`}>
      {/* Pixelated Glitch Offset - Red/Magenta */}
      {animated && (
        <div className="absolute inset-0 translate-x-[3px] translate-y-[-2px] opacity-75 mix-blend-screen pointer-events-none filter">
          <PixelELZZUPMascot isCorrupted={isCorrupted} mood={resolvedMood} fillPrimary="#ff4444" fillSecondary="#ffdd00" />
        </div>
      )}

      {/* Pixelated Glitch Offset - Cyan/Yellow */}
      {animated && (
        <div className="absolute inset-0 translate-x-[-3px] translate-y-[2px] opacity-70 mix-blend-screen pointer-events-none filter">
          <PixelELZZUPMascot isCorrupted={isCorrupted} mood={resolvedMood} fillPrimary="#00f0ff" fillSecondary="#ff4444" />
        </div>
      )}

      {/* Main Crisp Pixel Art Mascot Logo */}
      <div className={`relative z-10 w-full h-full ${animated ? 'hover:scale-105 transition-transform duration-200' : ''}`}>
        <PixelELZZUPMascot
          isCorrupted={isCorrupted}
          mood={resolvedMood}
          fillPrimary={isCorrupted ? '#ff2244' : '#ffdd00'}
          fillSecondary={isCorrupted ? '#770022' : '#ff4444'}
          fillBody={isCorrupted ? '#1a0514' : '#1a1a3a'}
        />
      </div>
    </div>
  );
};

interface MascotProps {
  isCorrupted?: boolean;
  mood?: MascotMood;
  fillPrimary?: string;
  fillSecondary?: string;
  fillBody?: string;
}

export const PixelELZZUPMascot: React.FC<MascotProps> = ({
  isCorrupted = false,
  mood = 'smug',
  fillPrimary = '#ffdd00',
  fillSecondary = '#ff4444',
  fillBody = '#1a1a3a',
}) => {
  const actualCorrupted = isCorrupted || mood === 'glitched';

  return (
    <svg
      viewBox="0 0 160 160"
      className="w-full h-full drop-shadow-[0_8px_0_#000]"
      xmlns="http://www.w3.org/2000/svg"
      shapeRendering="crispEdges"
    >
      {/* 16-Bit Pixel Container / Shadow */}
      <rect x="12" y="12" width="136" height="136" fill="#000000" />
      <rect x="16" y="16" width="128" height="128" fill={fillBody} />

      {/* Inner Stepped Pixel Border Highlights */}
      <rect x="20" y="20" width="120" height="4" fill={actualCorrupted ? '#ff4444' : '#ffdd00'} opacity="0.3" />
      <rect x="20" y="20" width="4" height="120" fill={actualCorrupted ? '#ff4444' : '#ffdd00'} opacity="0.3" />
      <rect x="20" y="136" width="120" height="4" fill="#000000" opacity="0.6" />
      <rect x="136" y="20" width="4" height="120" fill="#000000" opacity="0.6" />

      {/* Pixel Character Head Antenna / Gem */}
      <rect x="74" y="6" width="12" height="10" fill="#000000" />
      <rect x="76" y="8" width="8" height="8" fill={fillPrimary} />
      <rect x="78" y="10" width="4" height="4" fill="#ffffff" />

      {/* Row 1: E L Z */}
      {/* Letter 'E' */}
      <g>
        <rect x="28" y="28" width="28" height="32" fill="#000000" />
        <rect x="30" y="30" width="24" height="28" fill={fillSecondary} />
        <rect x="30" y="30" width="22" height="24" fill={fillPrimary} />
        {/* Cutouts */}
        <rect x="38" y="36" width="16" height="6" fill={fillBody} />
        <rect x="38" y="46" width="16" height="6" fill={fillBody} />
        {/* Pixel Highlight */}
        <rect x="32" y="32" width="18" height="2" fill="#ffffff" />
      </g>

      {/* Letter 'L' */}
      <g>
        <rect x="64" y="28" width="28" height="32" fill="#000000" />
        <rect x="66" y="30" width="24" height="28" fill={fillSecondary} />
        <rect x="66" y="30" width="22" height="24" fill={fillPrimary} />
        {/* Cutout */}
        <rect x="74" y="30" width="16" height="18" fill={fillBody} />
        {/* Pixel Highlight */}
        <rect x="68" y="32" width="6" height="20" fill="#ffffff" />
      </g>

      {/* Letter 'Z' (1) */}
      <g>
        <rect x="100" y="28" width="28" height="32" fill="#000000" />
        <rect x="102" y="30" width="24" height="28" fill={fillSecondary} />
        <rect x="102" y="30" width="22" height="24" fill={fillPrimary} />
        {/* Z Stepped Cutouts */}
        <rect x="102" y="36" width="12" height="8" fill={fillBody} />
        <rect x="112" y="44" width="12" height="8" fill={fillBody} />
        {/* Highlight */}
        <rect x="104" y="32" width="18" height="2" fill="#ffffff" />
      </g>

      {/* Center Face / Expressive Eyes by Mood */}
      {actualCorrupted ? (
        /* Sinister / Corrupted Evil ELZZUP Eyes */
        <g>
          {/* Left Slanted Sinister Eye */}
          <rect x="40" y="68" width="22" height="14" fill="#000000" />
          <polygon points="42,70 60,76 60,80 42,76" fill="#ff2244" />
          <rect x="48" y="72" width="4" height="4" fill="#ffffff" />

          {/* Right Slanted Sinister Eye */}
          <rect x="94" y="68" width="22" height="14" fill="#000000" />
          <polygon points="114,70 96,76 96,80 114,76" fill="#ff2244" />
          <rect x="104" y="72" width="4" height="4" fill="#ffffff" />

          {/* Sharp Pixel Jagged Grin */}
          <rect x="64" y="78" width="28" height="4" fill="#000000" />
          <rect x="66" y="76" width="4" height="4" fill="#ff2244" />
          <rect x="74" y="80" width="4" height="4" fill="#ff2244" />
          <rect x="82" y="76" width="4" height="4" fill="#ff2244" />
          <rect x="90" y="80" width="4" height="4" fill="#ff2244" />
        </g>
      ) : mood === 'worried' ? (
        /* Worried / Concerned ELZZUP Eyes */
        <g className="animate-mascot-eye">
          {/* Left Eye - Slightly Wide & Concerned */}
          <rect x="44" y="68" width="16" height="14" fill="#000000" />
          <rect x="46" y="70" width="12" height="10" fill="#ffffff" />
          <rect x="50" y="72" width="6" height="6" fill="#000000" />
          <rect x="52" y="72" width="2" height="3" fill="#ff4444" />

          {/* Right Eye - Concerned */}
          <rect x="96" y="68" width="16" height="14" fill="#000000" />
          <rect x="98" y="70" width="12" height="10" fill="#ffffff" />
          <rect x="100" y="72" width="6" height="6" fill="#000000" />
          <rect x="102" y="72" width="2" height="3" fill="#ff4444" />

          {/* Small Wavy / Concerned Mouth */}
          <rect x="72" y="80" width="16" height="3" fill="#000000" />
          <rect x="74" y="79" width="12" height="2" fill="#ffdd00" />
        </g>
      ) : mood === 'suspicious' ? (
        /* Narrowed / Suspicious ELZZUP Eyes */
        <g className="animate-mascot-eye">
          {/* Left Eye - Narrowed Slit */}
          <rect x="44" y="72" width="16" height="9" fill="#000000" />
          <rect x="46" y="73" width="12" height="6" fill="#ffffff" />
          <rect x="52" y="73" width="5" height="6" fill="#000000" />
          <rect x="54" y="74" width="2" height="3" fill="#00f0ff" />

          {/* Right Eye - Narrowed Looking Left */}
          <rect x="96" y="72" width="16" height="9" fill="#000000" />
          <rect x="98" y="73" width="12" height="6" fill="#ffffff" />
          <rect x="100" y="73" width="5" height="6" fill="#000000" />
          <rect x="102" y="74" width="2" height="3" fill="#00f0ff" />

          {/* Flat Horizontal Smirk */}
          <rect x="70" y="80" width="16" height="3" fill="#000000" />
          <rect x="72" y="80" width="12" height="2" fill="#ffdd00" />
        </g>
      ) : (
        /* Playful / Mischievous ELZZUP Eyes (Default) */
        <g className="animate-mascot-eye">
          {/* Left Eye */}
          <rect x="44" y="70" width="16" height="12" fill="#000000" />
          <rect x="46" y="72" width="12" height="8" fill="#ffffff" />
          <rect x="52" y="72" width="6" height="8" fill="#000000" />
          <rect x="54" y="72" width="2" height="4" fill="#00f0ff" />

          {/* Right Eye - Mischievous Wink or Gaze */}
          <rect x="96" y="70" width="16" height="12" fill="#000000" />
          <rect x="98" y="72" width="12" height="8" fill="#ffffff" />
          <rect x="98" y="72" width="6" height="8" fill="#000000" />
          <rect x="100" y="72" width="2" height="4" fill="#00f0ff" />

          {/* Smug / Playful Pixel Mouth */}
          <rect x="70" y="78" width="16" height="4" fill="#000000" />
          <rect x="82" y="74" width="4" height="4" fill="#000000" />
          <rect x="72" y="78" width="12" height="2" fill="#ff4444" />
        </g>
      )}

      {/* Row 2: Z U P */}
      {/* Letter 'Z' (2) */}
      <g>
        <rect x="28" y="96" width="28" height="32" fill="#000000" />
        <rect x="30" y="98" width="24" height="28" fill={fillSecondary} />
        <rect x="30" y="98" width="22" height="24" fill={fillPrimary} />
        {/* Cutouts */}
        <rect x="30" y="104" width="12" height="8" fill={fillBody} />
        <rect x="40" y="112" width="12" height="8" fill={fillBody} />
        <rect x="32" y="100" width="18" height="2" fill="#ffffff" />
      </g>

      {/* Letter 'U' */}
      <g>
        <rect x="64" y="96" width="28" height="32" fill="#000000" />
        <rect x="66" y="98" width="24" height="28" fill={fillSecondary} />
        <rect x="66" y="98" width="22" height="24" fill={fillPrimary} />
        {/* U Center Cutout */}
        <rect x="74" y="98" width="8" height="16" fill={fillBody} />
        <rect x="68" y="100" width="6" height="18" fill="#ffffff" />
      </g>

      {/* Letter 'P' */}
      <g>
        <rect x="100" y="96" width="28" height="32" fill="#000000" />
        <rect x="102" y="98" width="24" height="28" fill={fillSecondary} />
        <rect x="102" y="98" width="22" height="24" fill={fillPrimary} />
        {/* P Cutouts */}
        <rect x="108" y="104" width="8" height="6" fill={fillBody} />
        <rect x="108" y="116" width="16" height="10" fill={fillBody} />
        <rect x="104" y="100" width="18" height="2" fill="#ffffff" />
      </g>

      {/* Decorative Pixel Glitch Blocks */}
      <rect x="22" y="76" width="4" height="4" fill={fillPrimary} />
      <rect x="130" y="76" width="4" height="4" fill={fillSecondary} />
      <rect x="76" y="132" width="8" height="4" fill={fillPrimary} />
    </svg>
  );
};


