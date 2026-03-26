import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { EnvelopeIcon, LockClosedIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Checkbox } from '@/components/common/Checkbox';
import { Card } from '@/components/common/Card';
import { AnimationVariants } from '@/utils/animations';
import { ValidationRules, validateForm } from '@/utils/validation';
import { LoginFormData } from '@/types/auth';
import { cn } from '@/utils/cn';

export const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Validation schema following documentation specs
  const validationSchema = {
    email: [
      ValidationRules.required('Email is required'),
      ValidationRules.email('Please enter a valid email address')
    ],
    password: [
      ValidationRules.required('Password is required'),
      ValidationRules.minLength(8, 'Password must be at least 8 characters')
    ]
  };

  const handleInputChange = (field: keyof LoginFormData) => (value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const formErrors = validateForm(formData, validationSchema);
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Handle successful login
      console.log('Login successful:', formData);
      
    } catch (error) {
      console.error('Login failed:', error);
      setErrors({ general: 'Invalid email or password. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center p-4">
      <motion.div
        className="w-full max-w-md"
        {...AnimationVariants.fadeInUp}
      >
        <Card variant="elevated" padding="lg" className="backdrop-blur-sm">
          {/* Header */}
          <motion.div 
            className="text-center mb-8"
            {...AnimationVariants.fadeInDown}
          >
            <h1 className="text-3xl font-bold text-secondary-900 mb-2">
              Welcome Back
            </h1>
            <p className="text-secondary-600">
              Sign in to your KnowVault AI account
            </p>
          </motion.div>

          {/* Form */}
          <motion.form 
            onSubmit={handleSubmit}
            className="space-y-6"
            {...AnimationVariants.staggerContainer}
          >
            {/* General Error */}
            {errors.general && (
              <motion.div 
                className="p-4 bg-error-50 border border-error-200 rounded-lg text-error-700 text-sm"
                {...AnimationVariants.fadeInUp}
              >
                {errors.general}
              </motion.div>
            )}

            {/* Email Field */}
            <motion.div {...AnimationVariants.staggerItem}>
              <Input
                type="email"
                label="Email Address"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange('email')}
                error={errors.email}
                leftIcon={<EnvelopeIcon className="w-5 h-5" />}
                required
                autoComplete="email"
                validation={validationSchema.email}
              />
            </motion.div>

            {/* Password Field */}
            <motion.div {...AnimationVariants.staggerItem}>
              <Input
                type={showPassword ? 'text' : 'password'}
                label="Password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange('password')}
                error={errors.password}
                leftIcon={<LockClosedIcon className="w-5 h-5" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-secondary-400 hover:text-secondary-600 transition-colors duration-200"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="w-5 h-5" />
                    ) : (
                      <EyeIcon className="w-5 h-5" />
                    )}
                  </button>
                }
                required
                autoComplete="current-password"
                validation={validationSchema.password}
              />
            </motion.div>

            {/* Remember Me & Forgot Password */}
            <motion.div 
              className="flex items-center justify-between"
              {...AnimationVariants.staggerItem}
            >
              <Checkbox
                checked={formData.rememberMe}
                onChange={handleInputChange('rememberMe')}
                label="Remember me"
                size="sm"
              />
              
              <Link
                to="/auth/forgot-password"
                className="text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200"
              >
                Forgot password?
              </Link>
            </motion.div>

            {/* Submit Button */}
            <motion.div {...AnimationVariants.staggerItem}>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={isLoading}
                disabled={isLoading}
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>
            </motion.div>

            {/* Divider */}
            <motion.div 
              className="relative my-6"
              {...AnimationVariants.staggerItem}
            >
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-secondary-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-secondary-500">
                  Don't have an account?
                </span>
              </div>
            </motion.div>

            {/* Register Link */}
            <motion.div 
              className="text-center"
              {...AnimationVariants.staggerItem}
            >
              <Link
                to="/auth/register"
                className="text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200"
              >
                Create a new account
              </Link>
            </motion.div>
          </motion.form>
        </Card>

        {/* Footer */}
        <motion.div 
          className="text-center mt-8 text-sm text-secondary-500"
          {...AnimationVariants.fadeIn}
        >
          © 2024 KnowVault AI. All rights reserved.
        </motion.div>
      </motion.div>
    </div>
  );
};