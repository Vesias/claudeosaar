import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface MetricsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color: 'blue' | 'green' | 'purple' | 'red' | 'yellow';
}

export function MetricsCard({ title, value, icon, trend, color }: MetricsCardProps) {
  const getColorClasses = () => {
    switch (color) {
      case 'blue':
        return {
          bg: 'bg-blue-900/20',
          border: 'border-blue-700',
          icon: 'text-blue-500',
          trend: trend?.isPositive ? 'text-green-400' : 'text-red-400'
        };
      case 'green':
        return {
          bg: 'bg-green-900/20',
          border: 'border-green-700',
          icon: 'text-green-500',
          trend: trend?.isPositive ? 'text-green-400' : 'text-red-400'
        };
      case 'purple':
        return {
          bg: 'bg-purple-900/20',
          border: 'border-purple-700',
          icon: 'text-purple-500',
          trend: trend?.isPositive ? 'text-green-400' : 'text-red-400'
        };
      case 'red':
        return {
          bg: 'bg-red-900/20',
          border: 'border-red-700',
          icon: 'text-red-500',
          trend: trend?.isPositive ? 'text-green-400' : 'text-red-400'
        };
      case 'yellow':
        return {
          bg: 'bg-yellow-900/20',
          border: 'border-yellow-700',
          icon: 'text-yellow-500',
          trend: trend?.isPositive ? 'text-green-400' : 'text-red-400'
        };
    }
  };

  const colors = getColorClasses();

  return (
    <div className={`${colors.bg} border ${colors.border} rounded-lg p-6`}>
      <div className="flex justify-between items-start mb-4">
        <div className={`${colors.icon}`}>
          {icon}
        </div>
        {trend && (
          <div className={`flex items-center gap-1 ${colors.trend}`}>
            {trend.isPositive ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )}
            <span className="text-sm font-medium">{trend.value}%</span>
          </div>
        )}
      </div>
      <h3 className="text-sm text-gray-400 mb-1">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}