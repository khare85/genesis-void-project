import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import React from 'react';
interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
  actions?: React.ReactNode;
  icon?: React.ReactNode;
}
const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  children,
  className,
  actions,
  icon
}) => {
  return <div className={cn('mb-8', className)}>
      <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          {icon && <div className="text-muted-foreground">{icon}</div>}
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
            {description && <p className="text-muted-foreground">{description}</p>}
          </div>
        </div>
        {actions && <div className="flex items-center gap-2 mt-4 md:mt-0 rounded-full bg-blue-950">{actions}</div>}
      </div>
      {children}
    </div>;
};
export default PageHeader;