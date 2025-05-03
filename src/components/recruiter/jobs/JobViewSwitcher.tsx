
import React from 'react';
import { Button } from '@/components/ui/button';
import { LayoutGrid, LayoutList } from 'lucide-react';

interface JobViewSwitcherProps {
  view: 'table' | 'card';
  onViewChange: (view: 'table' | 'card') => void;
}

const JobViewSwitcher: React.FC<JobViewSwitcherProps> = ({ view, onViewChange }) => {
  return (
    <div className="flex items-center gap-1">
      <Button
        size="sm"
        variant={view === 'table' ? 'default' : 'outline'}
        onClick={() => onViewChange('table')}
        className="h-8 w-8 p-0"
      >
        <LayoutList className="h-4 w-4" />
        <span className="sr-only">Table view</span>
      </Button>
      <Button
        size="sm"
        variant={view === 'card' ? 'default' : 'outline'}
        onClick={() => onViewChange('card')}
        className="h-8 w-8 p-0"
      >
        <LayoutGrid className="h-4 w-4" />
        <span className="sr-only">Card view</span>
      </Button>
    </div>
  );
};

export default JobViewSwitcher;
