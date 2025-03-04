
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  className?: string;
}

export function StatsCard({
  title,
  value,
  description,
  icon,
  trend,
  trendValue,
  className
}: StatsCardProps) {
  return (
    <Card className={cn("overflow-hidden transition-all hover:shadow-md", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
          <div className="h-8 w-8 rounded-full bg-muted/50 flex items-center justify-center">
            {icon}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold mb-1">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
        {trend && trendValue && (
          <div className="flex items-center mt-2">
            <div 
              className={cn(
                "text-xs px-1.5 py-0.5 rounded-sm flex items-center",
                trend === 'up' && "bg-green-100 text-green-700",
                trend === 'down' && "bg-red-100 text-red-700",
                trend === 'neutral' && "bg-muted text-muted-foreground"
              )}
            >
              {trend === 'up' && (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-0.5">
                  <path d="M12 3L20 11L17.6 13.4L13 8.8V21H11V8.8L6.4 13.4L4 11L12 3Z" fill="currentColor"/>
                </svg>
              )}
              {trend === 'down' && (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-0.5">
                  <path d="M12 21L4 13L6.4 10.6L11 15.2V3H13V15.2L17.6 10.6L20 13L12 21Z" fill="currentColor"/>
                </svg>
              )}
              {trendValue}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
