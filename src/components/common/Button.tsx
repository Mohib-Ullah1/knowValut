import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import { AnimationVariants } from '@/utils/animations';
import { LoadingSpinner } from './LoadingSpinner';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link' | 'destructive';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  children,
  className,
  ...props
}) => {
  const buttonStyles = {
    // Base styles - CONSISTENT across ALL buttons
    base: `
      inline-flex items-center justify-center font-medium rounded-lg
      transition-all duration-200 ease-in-out
      focus:outline-none focus:ring-2 focus:ring-offset-2
      disabled:opacity-50 disabled:cursor-not-allowed
      ${fullWidth ? 'w-full' : ''}
    `,
    
    // Variant styles - EXACT color matching with design system
    variants: {
      primary: `
        bg-primary-600 text-white border border-primary-600
        hover:bg-primary-700 hover:border-primary-700
        focus:ring-primary-500
        active:bg-primary-800 active:scale-95
        shadow-sm hover:shadow-md
      `,
      secondary: `
        bg-secondary-100 text-secondary-900 border border-secondary-200
        hover:bg-secondary-200 hover:border-secondary-300
        focus:ring-secondary-500
        active:bg-secondary-300 active:scale-95
      `,
      outline: `
        bg-transparent text-primary-600 border border-primary-600
        hover:bg-primary-50 hover:text-primary-700
        focus:ring-primary-500
        active:bg-primary-100 active:scale-95
      `,
      ghost: `
        bg-transparent text-secondary-700 border border-transparent
        hover:bg-secondary-100 hover:text-secondary-900
        focus:ring-secondary-500
        active:bg-secondary-200 active:scale-95
      `,
      link: `
        bg-transparent text-primary-600 border border-transparent
        hover:text-primary-700 hover:underline
        focus:ring-primary-500
        active:text-primary-800
      `,
      destructive: `
        bg-error-600 text-white border border-error-600
        hover:bg-error-700 hover:border-error-700
        focus:ring-error-500
        active:bg-error-800 active:scale-95
        shadow-sm hover:shadow-md
      `
    },
    
    // Size styles - CONSISTENT sizing across ALL components
    sizes: {
      xs: 'px-2.5 py-1.5 text-xs min-h-[28px]',
      sm: 'px-3 py-2 text-sm min-h-[32px]',
      md: 'px-4 py-2.5 text-sm min-h-[40px]',
      lg: 'px-6 py-3 text-base min-h-[44px]',
      xl: 'px-8 py-4 text-lg min-h-[52px]'
    }
  };

  const getSpinnerSize = () => {
    switch (size) {
      case 'xs': return 12;
      case 'sm': return 14;
      case 'md': return 16;
      case 'lg': return 18;
      case 'xl': return 20;
      default: return 16;
    }
  };

  return (
    <motion.button
      type="button"
      disabled={disabled || loading}
      className={cn(
        buttonStyles.base,
        buttonStyles.variants[variant],
        buttonStyles.sizes[size],
        className
      )}
      {...AnimationVariants.buttonHover}
      {...props}
    >
      {loading && (
        <LoadingSpinner 
          size={getSpinnerSize()}
          color={variant === 'primary' || variant === 'destructive' ? 'white' : 'primary'}
          className="mr-2"
        />
      )}
      {icon && iconPosition === 'left' && !loading && (
        <span className="mr-2">{icon}</span>
      )}
      {children}
      {icon && iconPosition === 'right' && !loading && (
        <span className="ml-2">{icon}</span>
      )}
    </motion.button>
  );
};