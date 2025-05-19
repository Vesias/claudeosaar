import React, { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'circular' | 'rectangular';
  animation?: 'pulse' | 'wave' | 'none';
  width?: string | number;
  height?: string | number;
}

const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = 'default',
  animation = 'pulse',
  width,
  height,
  ...props
}) => {
  const variants = {
    default: 'rounded-lg',
    circular: 'rounded-full',
    rectangular: 'rounded-none',
  };

  const animations = {
    pulse: 'animate-pulse',
    wave: 'animate-shimmer',
    none: '',
  };

  return (
    <div
      className={cn(
        'bg-neutral-800 relative overflow-hidden',
        variants[variant],
        animations[animation],
        className
      )}
      style={{
        width: width,
        height: height,
      }}
      {...props}
    >
      {animation === 'wave' && (
        <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      )}
    </div>
  );
};

// Specific skeleton components for common use cases
const SkeletonText: React.FC<{ lines?: number; className?: string }> = ({ lines = 1, className }) => {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          height="1rem"
          width={i === lines - 1 ? '75%' : '100%'}
        />
      ))}
    </div>
  );
};

const SkeletonButton: React.FC<{ size?: 'sm' | 'md' | 'lg'; className?: string }> = ({ size = 'md', className }) => {
  const sizes = {
    sm: 'h-9 w-20',
    md: 'h-10 w-24',
    lg: 'h-12 w-32',
  };

  return <Skeleton className={cn(sizes[size], className)} />;
};

const SkeletonAvatar: React.FC<{ size?: 'sm' | 'md' | 'lg'; className?: string }> = ({ size = 'md', className }) => {
  const sizes = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
  };

  return <Skeleton variant="circular" className={cn(sizes[size], className)} />;
};

const SkeletonCard: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={cn('p-6 space-y-4', className)}>
      <div className="flex items-center gap-4">
        <SkeletonAvatar />
        <div className="flex-1 space-y-2">
          <Skeleton height="1rem" width="50%" />
          <Skeleton height="0.875rem" width="30%" />
        </div>
      </div>
      <SkeletonText lines={3} />
      <div className="flex gap-2">
        <SkeletonButton size="sm" />
        <SkeletonButton size="sm" />
      </div>
    </div>
  );
};

export { Skeleton, SkeletonText, SkeletonButton, SkeletonAvatar, SkeletonCard };