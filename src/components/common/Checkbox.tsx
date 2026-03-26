import React from 'react';
import { motion } from 'framer-motion';
import { CheckIcon } from '@heroicons/react/24/outline';
import { cn } from '@/utils/cn';
import { AnimationVariants } from '@/utils/animations';

interface CheckboxProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  error?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children?: React.ReactNode;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked = false,
  onChange,
  label,
  disabled = false,
  error,
  size = 'md',
  className,
  children
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  const handleChange = () => {
    if (!disabled) {
      onChange?.(!checked);
    }
  };

  return (
    <div className={cn('flex items-start space-x-3', className)}>
      <motion.button
        type="button"
        onClick={handleChange}
        disabled={disabled}
        className={cn(
          'flex items-center justify-center rounded border-2 transition-all duration-200',
          sizeClasses[size],
          checked
            ? 'bg-primary-600 border-primary-600 text-white'
            : 'bg-white border-secondary-300 hover:border-secondary-400',
          disabled && 'opacity-50 cursor-not-allowed',
          error && 'border-error-500',
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2'
        )}
        {...AnimationVariants.buttonHover}
      >
        {checked && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <CheckIcon className={cn(
              size === 'sm' ? 'w-3 h-3' : size === 'md' ? 'w-4 h-4' : 'w-5 h-5'
            )} />
          </motion.div>
        )}
      </motion.button>
      
      {(label || children) && (
        <div className="flex-1">
          <label
            onClick={handleChange}
            className={cn(
              'cursor-pointer font-medium text-secondary-700',
              textSizeClasses[size],
              disabled && 'cursor-not-allowed opacity-50',
              error && 'text-error-600'
            )}
          >
            {label || children}
          </label>
          {error && (
            <motion.p 
              className="mt-1 text-sm text-error-600"
              {...AnimationVariants.fadeInUp}
            >
              {error}
            </motion.p>
          )}
        </div>
      )}
    </div>
  );
};