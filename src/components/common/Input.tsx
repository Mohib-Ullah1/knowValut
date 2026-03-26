import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { cn } from '@/utils/cn';
import { AnimationVariants } from '@/utils/animations';
import { ValidationRule, validateField } from '@/utils/validation';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'onChange'> {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'filled' | 'flushed';
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  validation?: ValidationRule[];
  onChange?: (value: string) => void;
  onValidationChange?: (isValid: boolean, error: string) => void;
}

export const Input: React.FC<InputProps> = ({
  type = 'text',
  size = 'md',
  variant = 'default',
  label,
  placeholder,
  helperText,
  error,
  required = false,
  disabled = false,
  readOnly = false,
  value,
  defaultValue,
  onChange,
  onValidationChange,
  onBlur,
  onFocus,
  leftIcon,
  rightIcon,
  validation = [],
  className,
  ...props
}) => {
  const [internalValue, setInternalValue] = useState(defaultValue || '');
  const [isFocused, setIsFocused] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  
  const inputValue = value !== undefined ? value : internalValue;
  const hasError = error || validationErrors.length > 0;
  const displayError = error || validationErrors[0];

  const inputStyles = {
    container: 'relative w-full',
    
    label: `
      block text-sm font-medium text-secondary-700 mb-1
      ${required ? "after:content-['*'] after:text-error-500 after:ml-1" : ''}
    `,
    
    inputWrapper: `
      relative flex items-center
      ${variant === 'default' ? 'border rounded-lg' : ''}
      ${variant === 'filled' ? 'bg-secondary-50 border border-transparent rounded-lg' : ''}
      ${variant === 'flushed' ? 'border-0 border-b-2 rounded-none' : ''}
      ${hasError ? 'border-error-500' : 'border-secondary-300'}
      ${isFocused && !hasError ? 'border-primary-500 ring-1 ring-primary-500' : ''}
      ${disabled ? 'bg-secondary-100 cursor-not-allowed' : ''}
      transition-all duration-200 ease-in-out
    `,
    
    input: `
      flex-1 bg-transparent border-0 outline-none
      ${size === 'sm' ? 'px-3 py-2 text-sm min-h-[32px]' : ''}
      ${size === 'md' ? 'px-4 py-2.5 text-base min-h-[40px]' : ''}
      ${size === 'lg' ? 'px-4 py-3 text-lg min-h-[44px]' : ''}
      ${leftIcon ? 'pl-10' : ''}
      ${rightIcon ? 'pr-10' : ''}
      ${disabled ? 'cursor-not-allowed text-secondary-500' : 'text-secondary-900'}
      placeholder:text-secondary-400
    `,
    
    icon: `
      absolute top-1/2 transform -translate-y-1/2 text-secondary-400
      ${size === 'sm' ? 'w-4 h-4' : ''}
      ${size === 'md' ? 'w-5 h-5' : ''}
      ${size === 'lg' ? 'w-6 h-6' : ''}
    `,
    
    leftIcon: 'left-3',
    rightIcon: 'right-3',
    
    helperText: `
      mt-1 text-sm
      ${hasError ? 'text-error-600' : 'text-secondary-500'}
    `,
    
    errorMessage: 'mt-1 text-sm text-error-600 flex items-center',
  };

  // Validation on change
  const validateInput = (inputValue: string) => {
    if (validation.length === 0) return true;
    
    const errors: string[] = [];
    
    validation.forEach(rule => {
      const result = rule.validator(inputValue);
      if (!result.isValid) {
        errors.push(result.message);
      }
    });
    
    setValidationErrors(errors);
    const isValid = errors.length === 0;
    onValidationChange?.(isValid, errors[0] || '');
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    
    if (value === undefined) {
      setInternalValue(newValue);
    }
    
    // Real-time validation
    if (validation.length > 0) {
      validateInput(newValue);
    }
    
    onChange?.(newValue);
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    
    // Validate on blur
    if (validation.length > 0) {
      validateInput(inputValue);
    }
    
    onBlur?.(e);
  };

  return (
    <div className={cn(inputStyles.container, className)}>
      {label && (
        <label className={inputStyles.label}>
          {label}
        </label>
      )}
      
      <motion.div 
        className={inputStyles.inputWrapper}
        {...AnimationVariants.inputFocus}
      >
        {leftIcon && (
          <div className={cn(inputStyles.icon, inputStyles.leftIcon)}>
            {leftIcon}
          </div>
        )}
        
        <input
          type={type}
          value={inputValue}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={inputStyles.input}
          {...props}
        />
        
        {rightIcon && (
          <div className={cn(inputStyles.icon, inputStyles.rightIcon)}>
            {rightIcon}
          </div>
        )}
      </motion.div>
      
      {displayError && (
        <motion.div 
          className={inputStyles.errorMessage}
          {...AnimationVariants.fadeInUp}
        >
          <ExclamationCircleIcon className="w-4 h-4 mr-1" />
          {displayError}
        </motion.div>
      )}
      
      {helperText && !hasError && (
        <div className={inputStyles.helperText}>
          {helperText}
        </div>
      )}
    </div>
  );
};