import { ReactNode } from 'react';

interface GradientButtonProps {
  children: ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  className?: string;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
}

export default function GradientButton({
  children,
  onClick,
  type = 'button',
  disabled = false,
  className = '',
  variant = 'primary',
  size = 'md'
}: GradientButtonProps) {
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  const variantClasses = {
    primary: 'brand-button',
    secondary: 'glass-card-subtle text-foreground border-2 border-primary/30 hover:border-primary/50'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        font-semibold rounded-xl cursor-pointer
        ${variant === 'secondary' ? 'hover:shadow-lg hover:scale-[1.02] transition-all duration-300' : ''}
        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
        ${className}
      `}
    >
      {children}
    </button>
  );
}