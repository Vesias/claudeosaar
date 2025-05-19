/**
 * Accessible button component with various styles and states
 */

import React, { ButtonHTMLAttributes, forwardRef } from 'react';
import { LoadingSpinner } from './LoadingSpinner';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    loading = false,
    disabled = false,
    leftIcon,
    rightIcon,
    children,
    className = '',
    ...props
  }, ref) => {
    // Base styles
    const baseStyles = `
      inline-flex items-center justify-center font-medium rounded-lg
      transition-all duration-200 disabled:cursor-not-allowed
      focus:outline-none focus:ring-2 focus:ring-offset-2
    `;
    
    // Variant styles
    const variantStyles = {
      primary: `
        bg-blue-600 text-white hover:bg-blue-700
        focus:ring-blue-500 disabled:bg-blue-300
      `,
      secondary: `
        bg-gray-100 text-gray-900 hover:bg-gray-200
        focus:ring-gray-500 disabled:bg-gray-50 disabled:text-gray-400
      `,
      danger: `
        bg-red-600 text-white hover:bg-red-700
        focus:ring-red-500 disabled:bg-red-300
      `,
      ghost: `
        bg-transparent text-gray-700 hover:bg-gray-100
        focus:ring-gray-500 disabled:text-gray-400
      `,
      link: `
        bg-transparent text-blue-600 hover:text-blue-700 underline
        focus:ring-blue-500 disabled:text-blue-300
      `
    };
    
    // Size styles
    const sizeStyles = {
      sm: 'px-3 py-1.5 text-sm gap-1.5',
      md: 'px-4 py-2 text-base gap-2',
      lg: 'px-6 py-3 text-lg gap-2.5'
    };
    
    // Icon sizes
    const iconSizes = {
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-6 w-6'
    };
    
    const isDisabled = disabled || loading;
    
    const classes = `
      ${baseStyles}
      ${variantStyles[variant]}
      ${sizeStyles[size]}
      ${fullWidth ? 'w-full' : ''}
      ${className}
    `.trim();
    
    // Render icon with proper size
    const renderIcon = (icon: React.ReactNode, position: 'left' | 'right') => {
      if (!icon) return null;
      
      if (React.isValidElement(icon)) {
        return React.cloneElement(icon as React.ReactElement, {
          className: `${iconSizes[size]} ${
            position === 'left' ? '-ml-0.5' : '-mr-0.5'
          }`
        });
      }
      
      return icon;
    };
    
    return (
      <button
        ref={ref}
        className={classes}
        disabled={isDisabled}
        aria-busy={loading}
        aria-disabled={isDisabled}
        {...props}
      >
        {loading ? (
          <>
            <LoadingSpinner size="sm" color={variant === 'primary' ? 'white' : 'gray'} />
            <span className="ml-2">Loading...</span>
          </>
        ) : (
          <>
            {renderIcon(leftIcon, 'left')}
            {children}
            {renderIcon(rightIcon, 'right')}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

// Button Group component
interface ButtonGroupProps {
  children: React.ReactNode;
  className?: string;
  vertical?: boolean;
}

export const ButtonGroup: React.FC<ButtonGroupProps> = ({
  children,
  className = '',
  vertical = false
}) => {
  return (
    <div
      className={`
        inline-flex ${vertical ? 'flex-col' : 'flex-row'}
        ${vertical ? 'divide-y' : 'divide-x'} divide-gray-300
        overflow-hidden rounded-lg border border-gray-300
        ${className}
      `}
      role="group"
    >
      {React.Children.map(children, (child, index) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<ButtonProps>, {
            className: `
              ${child.props.className || ''}
              rounded-none border-0
              ${!vertical && index === 0 ? 'rounded-l-lg' : ''}
              ${!vertical && index === React.Children.count(children) - 1 ? 'rounded-r-lg' : ''}
              ${vertical && index === 0 ? 'rounded-t-lg' : ''}
              ${vertical && index === React.Children.count(children) - 1 ? 'rounded-b-lg' : ''}
            `.trim()
          });
        }
        return child;
      })}
    </div>
  );
};