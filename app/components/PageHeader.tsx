import SugaryLogo from './SugaryLogo';

interface PageHeaderProps {
  children?: React.ReactNode;
  className?: string;
  showBorder?: boolean;
}

export default function PageHeader({ 
  children, 
  className = '', 
  showBorder = true 
}: PageHeaderProps) {
  return (
    <header className={`glass sticky top-0 z-50 ${showBorder ? 'border-b border-primary/10' : ''} bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm shadow-sm ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <SugaryLogo />
          {children}
        </div>
      </div>
    </header>
  );
}