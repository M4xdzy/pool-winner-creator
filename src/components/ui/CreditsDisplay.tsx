
import React from 'react';
import { cn } from '@/lib/utils';

interface CreditsDisplayProps {
  credits: number;
  className?: string;
}

export function CreditsDisplay({ credits, className }: CreditsDisplayProps) {
  return (
    <div 
      className={cn(
        "relative overflow-hidden rounded-full px-3 py-1 border border-border bg-secondary/70 backdrop-blur", 
        className
      )}
    >
      <div className="flex items-center space-x-1.5">
        <div className="relative w-4 h-4">
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-yellow-300 to-yellow-500 animate-pulse-slow"></div>
        </div>
        <span className="text-sm font-medium">{credits.toLocaleString()}</span>
      </div>
    </div>
  );
}
