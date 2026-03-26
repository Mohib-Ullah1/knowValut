import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import { AnimationVariants } from '@/utils/animations';

interface CardProps {
  variant?: 'default' | 'outlined' | 'elevated' | 'filled';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  clickable?: boolean;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  padding = 'md',
  hover = false,
  clickable = false,
  className,
  children,
  onClick
}) => {
  const variantClasses = {
    default: 'bg-white border border-secondary-200 shadow-sm',
    outlined: 'bg-white border-2 border-secondary-300',
    elevated: 'bg-white shadow-lg border-0',
    filled: 'bg-secondary-50 border border-secondary-200'
  };

  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  return (
    <motion.div
      className={cn(
        'rounded-xl transition-all duration-200',
        variantClasses[variant],
        paddingClasses[padding],
        clickable && 'cursor-pointer',
        className
      )}
      onClick={onClick}
      {...(hover ? AnimationVariants.cardHover : {})}
      whileTap={clickable ? { scale: 0.98 } : undefined}
    >
      {children}
    </motion.div>
  );
};