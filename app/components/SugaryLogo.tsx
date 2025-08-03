import Link from 'next/link';

interface SugaryLogoProps {
  href?: string;
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function SugaryLogo({ 
  href = '/', 
  className = '', 
  showText = true, 
  size = 'md' 
}: SugaryLogoProps) {
  const logoSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8', 
    lg: 'w-10 h-10'
  };
  
  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  const content = (
    <div className={`flex items-center space-x-3 ${className}`}>
      <div
        className={`${logoSizes[size]} rounded-full`}
        style={{ background: 'var(--gradient-primary)' }}
      />
      {showText && (
        <span className={`${textSizes[size]} font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent`}>
          Sugary
        </span>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex">
        {content}
      </Link>
    );
  }

  return content;
}