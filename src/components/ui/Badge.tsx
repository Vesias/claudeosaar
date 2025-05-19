import React, { forwardRef, HTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

const badgeVariants = cva(
  'inline-flex items-center rounded-full text-xs font-medium transition-all duration-200',
  {
    variants: {
      variant: {
        default: 'bg-neutral-800 text-neutral-200 border border-neutral-700',
        primary: 'bg-primary-500/20 text-primary-300 border border-primary-500/30',
        secondary: 'bg-secondary/50 text-secondary-foreground border border-secondary/30',
        success: 'bg-success-500/20 text-success-300 border border-success-500/30',
        warning: 'bg-warning-500/20 text-warning-300 border border-warning-500/30',
        error: 'bg-error-500/20 text-error-300 border border-error-500/30',
        outline: 'border-2 border-current',
        glass: 'bg-white/5 backdrop-blur-lg border border-white/10',
      },
      size: {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-3 py-1',
        lg: 'px-4 py-1.5 text-sm',
      },
      removable: {
        true: 'pr-1',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export interface BadgeProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  onRemove?: () => void;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, size, removable, onRemove, leftIcon, rightIcon, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(badgeVariants({ variant, size, removable: !!onRemove || removable, className }))}
        {...props}
      >
        {leftIcon && <span className="mr-1 -ml-0.5">{leftIcon}</span>}
        {children}
        {rightIcon && <span className="ml-1 -mr-0.5">{rightIcon}</span>}
        {(onRemove || removable) && (
          <button
            type="button"
            onClick={onRemove}
            className="ml-1 -mr-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full hover:bg-white/20 transition-colors"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>
    );
  }
);

Badge.displayName = 'Badge';

export { Badge, badgeVariants };