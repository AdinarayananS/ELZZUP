import React from 'react';
import { sound } from '../audio';

export interface PixelButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'neutral' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  soundEnabled?: boolean;
  icon?: React.ReactNode;
  activeGlitch?: boolean;
}

export const PixelButton: React.FC<PixelButtonProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  fullWidth = false,
  soundEnabled = true,
  icon,
  activeGlitch = false,
  className = '',
  onClick,
  onMouseEnter,
  disabled,
  ...props
}) => {
  const variantStyles = {
    primary: 'bg-[#ffdd00] text-black border-black shadow-[4px_4px_0_0_#000] hover:bg-[#fff380] active:translate-x-1 active:translate-y-1 active:shadow-none',
    secondary: 'bg-[#ff4444] text-white border-black shadow-[4px_4px_0_0_#000] hover:bg-[#ff6666] active:translate-x-1 active:translate-y-1 active:shadow-none',
    tertiary: 'bg-[#44ff44] text-black border-black shadow-[4px_4px_0_0_#000] hover:bg-[#88ff88] active:translate-x-1 active:translate-y-1 active:shadow-none',
    neutral: 'bg-[#2a2a4a] text-[#f0f0ff] border-black shadow-[4px_4px_0_0_#000] hover:bg-[#3a3a6a] hover:text-[#ffdd00] active:translate-x-1 active:translate-y-1 active:shadow-none',
    danger: 'bg-[#ff4444] text-white border-black shadow-[4px_4px_0_0_#000] hover:bg-[#ff6666] active:translate-x-1 active:translate-y-1 active:shadow-none',
    ghost: 'bg-transparent text-[#a0a0d0] border-2 border-dashed border-black/40 shadow-none hover:bg-[#1a1a3a] hover:text-[#ffdd00] active:translate-y-0',
  };

  const sizeStyles = {
    sm: 'py-2 px-3 text-[10px] sm:text-xs font-bold tracking-wider',
    md: 'py-3 px-5 text-xs sm:text-sm font-bold tracking-wider',
    lg: 'py-4 px-6 text-sm sm:text-base font-extrabold tracking-wider',
  };

  const disabledStyles = disabled
    ? 'opacity-40 cursor-not-allowed filter grayscale hover:translate-y-0 hover:shadow-[4px_4px_0_0_#000]'
    : 'cursor-pointer';

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    if (soundEnabled) sound.playClick(soundEnabled);
    if (onClick) onClick(e);
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled && soundEnabled) {
      sound.playClick(soundEnabled, 0.3);
    }
    if (onMouseEnter) onMouseEnter(e);
  };

  return (
    <button
      {...props}
      disabled={disabled}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      className={`
        relative select-none uppercase font-heading
        border-4 transition-all duration-100 ease-out
        inline-flex items-center justify-center gap-3
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${disabledStyles}
        ${fullWidth ? 'w-full' : ''}
        ${activeGlitch ? 'animate-pulse' : ''}
        ${className}
      `}
    >
      {icon && <span className="flex items-center justify-center">{icon}</span>}
      <span className="relative z-10 whitespace-nowrap">{children}</span>
    </button>
  );
};
