import React, { forwardRef, ButtonHTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] focus-visible:ring-primary-500',
        secondary: 'bg-secondary hover:bg-neutral-700 text-neutral-200 focus-visible:ring-neutral-500',
        accent: 'bg-gradient-to-r from-accent-600 to-accent-700 hover:from-accent-700 hover:to-accent-800 text-white shadow-lg hover:shadow-xl focus-visible:ring-accent-500',
        glass: 'bg-white/5 backdrop-blur-lg border border-white/10 hover:bg-white/10 hover:border-white/20 text-white focus-visible:ring-white/50',
        ghost: 'hover:bg-neutral-800/50 text-neutral-200 focus-visible:ring-neutral-500',
        destructive: 'bg-error-500 hover:bg-error-600 text-white focus-visible:ring-error-500',
        success: 'bg-success-500 hover:bg-success-600 text-white focus-visible:ring-success-500',
        warning: 'bg-warning-500 hover:bg-warning-600 text-black focus-visible:ring-warning-500',
        outline: 'border-2 border-primary-500 text-primary-400 hover:bg-primary-500/10 focus-visible:ring-primary-500',
      },
      size: {
        sm: 'h-9 px-3 text-sm',
        md: 'h-10 px-6',
        lg: 'h-12 px-8 text-lg',
        xl: 'h-14 px-10 text-xl',
        icon: 'h-10 w-10',
      },
      fullWidth: {
        true: 'w-full',
      },
      loading: {
        true: 'cursor-wait',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, fullWidth, loading, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, fullWidth, loading, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Loading...</span>
          </>
        ) : (
          <>
            {leftIcon && <span className="-ml-1">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="-mr-1">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };