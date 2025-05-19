import React, { forwardRef, HTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const cardVariants = cva(
  'rounded-2xl overflow-hidden transition-all duration-300',
  {
    variants: {
      variant: {
        default: 'bg-card text-card-foreground shadow-xl border border-border',
        glass: 'bg-white/5 backdrop-blur-lg border border-white/10 hover:bg-white/[0.07] hover:border-white/20',
        gradient: 'bg-gradient-to-br from-neutral-900 to-neutral-950 border border-neutral-800',
        glow: 'bg-card text-card-foreground shadow-xl border border-primary-500/20 hover:shadow-glow',
      },
      hover: {
        none: '',
        lift: 'hover:-translate-y-1',
        scale: 'hover:scale-[1.02]',
        glow: 'hover:shadow-glow-lg',
      },
      padding: {
        none: '',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
        xl: 'p-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      hover: 'lift',
      padding: 'md',
    },
  }
);

export interface CardProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  gradient?: string; // Added optional gradient prop
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, hover, padding, header, footer, children, gradient, ...props }, ref) => { // Added gradient to destructuring
    return (
      <div
        ref={ref}
        className={cn(cardVariants({ variant, hover, padding, className }), gradient && variant === 'gradient' ? gradient : '')} // Apply gradient if variant is 'gradient'
        {...props}
      >
        {header && (
          <div className="border-b border-border pb-4 mb-4">
            {header}
          </div>
        )}
        {children}
        {footer && (
          <div className="border-t border-border pt-4 mt-4">
            {footer}
          </div>
        )}
      </div>
    );
  }
);

Card.displayName = 'Card';

const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('mb-4 pb-4 border-b border-border', className)}
      {...props}
    />
  )
);

CardHeader.displayName = 'CardHeader';

const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn('text-2xl font-semibold', className)}
      {...props}
    />
  )
);

CardTitle.displayName = 'CardTitle';

const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('', className)} {...props} />
  )
);

CardContent.displayName = 'CardContent';

const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('mt-4 pt-4 border-t border-border', className)}
      {...props}
    />
  )
);

CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardTitle, CardContent, CardFooter, cardVariants };
