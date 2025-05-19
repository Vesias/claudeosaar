import React, { createContext, useContext, useState, forwardRef, HTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const TabsContext = createContext<{
  value: string;
  onValueChange: (value: string) => void;
}>({ value: '', onValueChange: () => {} });

const tabsVariants = cva('', {
  variants: {
    variant: {
      default: '',
      pills: '',
      underline: '',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const tabsListVariants = cva('inline-flex items-center justify-center', {
  variants: {
    variant: {
      default: 'h-10 rounded-xl bg-muted p-1',
      pills: 'gap-2',
      underline: 'border-b border-border',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const tabsTriggerVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm',
        pills: 'rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4 py-2',
        underline: 'rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary pb-3',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface TabsProps extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof tabsVariants> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}

const Tabs = forwardRef<HTMLDivElement, TabsProps>(
  ({ className, variant, value, defaultValue, onValueChange, children, ...props }, ref) => {
    const [internalValue, setInternalValue] = useState(defaultValue || '');
    const currentValue = value !== undefined ? value : internalValue;

    const handleValueChange = (newValue: string) => {
      if (value === undefined) {
        setInternalValue(newValue);
      }
      onValueChange?.(newValue);
    };

    return (
      <TabsContext.Provider value={{ value: currentValue, onValueChange: handleValueChange }}>
        <div ref={ref} className={cn(tabsVariants({ variant, className }))} {...props}>
          {children}
        </div>
      </TabsContext.Provider>
    );
  }
);

Tabs.displayName = 'Tabs';

const TabsList = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement> & VariantProps<typeof tabsListVariants>>(
  ({ className, variant, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn(tabsListVariants({ variant, className }))} {...props}>
        {children}
      </div>
    );
  }
);

TabsList.displayName = 'TabsList';

const TabsTrigger = forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof tabsTriggerVariants> & { value: string }
>(({ className, variant, value, children, ...props }, ref) => {
  const { value: contextValue, onValueChange } = useContext(TabsContext);
  const isActive = contextValue === value;

  return (
    <button
      ref={ref}
      type="button"
      role="tab"
      aria-selected={isActive}
      data-state={isActive ? 'active' : 'inactive'}
      className={cn(tabsTriggerVariants({ variant, className }))}
      onClick={() => onValueChange(value)}
      {...props}
    >
      {children}
      {variant === 'underline' && isActive && (
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
          layoutId="underline"
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      )}
    </button>
  );
});

TabsTrigger.displayName = 'TabsTrigger';

const TabsContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement> & { value: string }>(
  ({ className, value, children, ...props }, ref) => {
    const { value: contextValue } = useContext(TabsContext);
    const isActive = contextValue === value;

    if (!isActive) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.2 }}
        role="tabpanel"
        className={cn('mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2', className)}
      >
        {children}
      </motion.div>
    );
  }
);

TabsContent.displayName = 'TabsContent';

export { Tabs, TabsList, TabsTrigger, TabsContent };