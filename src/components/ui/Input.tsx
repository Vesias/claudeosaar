import React, { forwardRef, InputHTMLAttributes, useState } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';

const inputVariants = cva(
  'w-full rounded-xl bg-input border text-foreground placeholder:text-muted-foreground transition-all duration-200 focus:outline-none',
  {
    variants: {
      variant: {
        default: 'border-border focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20',
        glass: 'bg-white/5 backdrop-blur-lg border-white/10 focus:border-white/30 focus:ring-2 focus:ring-white/20',
        error: 'border-error-500 focus:border-error-600 focus:ring-2 focus:ring-error-500/20',
        success: 'border-success-500 focus:border-success-600 focus:ring-2 focus:ring-success-500/20',
        warning: 'border-warning-500 focus:border-warning-600 focus:ring-2 focus:ring-warning-500/20',
      },
      size: {
        sm: 'h-9 px-3 text-sm',
        md: 'h-10 px-4',
        lg: 'h-12 px-6 text-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  label?: string;
  error?: string;
  success?: string;
  warning?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, size, type, label, error, success, warning, hint, leftIcon, rightIcon, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const [focused, setFocused] = useState(false);
    const [hasValue, setHasValue] = useState(false);

    const handleFocus = () => setFocused(true);
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setFocused(false);
      setHasValue(!!e.target.value);
    };

    // Determine variant based on state
    const currentVariant = error ? 'error' : success ? 'success' : warning ? 'warning' : variant;

    const isPassword = type === 'password';
    const inputType = isPassword && showPassword ? 'text' : type;

    return (
      <div className="relative">
        {label && (
          <label
            className={cn(
              'absolute left-4 transition-all duration-200 pointer-events-none z-10',
              focused || hasValue
                ? '-top-2 text-xs bg-background px-1'
                : 'top-1/2 -translate-y-1/2 text-sm',
              focused ? 'text-primary-400' : 'text-muted-foreground'
            )}
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            type={inputType}
            className={cn(
              inputVariants({ variant: currentVariant, size, className }),
              leftIcon && 'pl-12',
              rightIcon && 'pr-12',
              isPassword && 'pr-12'
            )}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...props}
          />
          {(rightIcon || isPassword) && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              {isPassword ? (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              ) : (
                rightIcon
              )}
            </div>
          )}
        </div>
        {(error || success || warning || hint) && (
          <div className="mt-1 text-sm flex items-center gap-1">
            {error && (
              <>
                <AlertCircle className="h-4 w-4 text-error-500" />
                <span className="text-error-500">{error}</span>
              </>
            )}
            {success && (
              <>
                <CheckCircle className="h-4 w-4 text-success-500" />
                <span className="text-success-500">{success}</span>
              </>
            )}
            {warning && (
              <>
                <AlertCircle className="h-4 w-4 text-warning-500" />
                <span className="text-warning-500">{warning}</span>
              </>
            )}
            {hint && !error && !success && !warning && (
              <span className="text-muted-foreground">{hint}</span>
            )}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input, inputVariants };