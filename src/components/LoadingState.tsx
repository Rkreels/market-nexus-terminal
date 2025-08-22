
import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  darkMode?: boolean;
  className?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({
  message = "Loading...",
  size = 'md',
  darkMode = false,
  className
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <div className={cn(
      "flex items-center justify-center p-4",
      darkMode ? "text-zinc-400" : "text-gray-600",
      className
    )}>
      <Loader2 className={cn("animate-spin mr-2", sizeClasses[size])} />
      <span className="text-sm">{message}</span>
    </div>
  );
};

export default LoadingState;
