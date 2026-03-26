import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  UserIcon, 
  EnvelopeIcon, 
  LockClosedIcon, 
  EyeIcon, 
  EyeSlashIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Checkbox } from '@/components/common/Checkbox';
import { Card } from '@/components/common/Card';
import { AnimationVariants } from '@/utils/animations';
import { ValidationRules, validateForm } from '@/utils/validation';
import { RegisterFormData } from '@/types/auth';
import { cn } from '@/utils/cn';

export const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState<RegisterFormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    organizationName: '',
    acceptTerms: false
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Validation schema following documentation specs
  const validationSchema = {
    firstName: [
      ValidationRules.required('First name is required'),
      ValidationRules.minLength(2, 'First name must be at least 2 characters'),
      ValidationRules.maxLength(50, 'First name must be less than 50 characters')
    ],
    lastName: [
      ValidationRules.required('Last name is required'),
      ValidationRules.minLength(2, 'Last name must be at least 2 characters'),
      ValidationRules.maxLength(50, 'Last name must be less than 50 characters')
    ],
    email: [
      ValidationRules.required('Email is required'),
      ValidationRules.email('Please enter a valid email address')
    ],
    password: [
      ValidationRules.required('Password is required'),
      ValidationRules.password('Password must contain at least 8 characters, including uppercase, lowercase, and number')
    ],
    confirmPassword: [
      ValidationRules.required('Please confirm your password'),
      ValidationRules.confirmPassword('password', 'Passwords do not match')
    ],
    organizationName: [
      ValidationRules.required('Organization name is required'),
      ValidationRules.minLength(2, 'Organization name must be at least 2 characters'),
      ValidationRules.maxLength(100, 'Organization name must be less than 100 characters')
    ],
    acceptTerms: [
      ValidationRules.custom(
        (value: boolean) => value === true,
        'You must accept the terms and conditions'
      )
    ]
  };

  const handleInputChange = (field: keyof RegisterFormData) => (value: string | boolean) => {
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
      
      // Handle successful registration
      console.log('Registration successful:', formData);
      
    } catch (error) {
      console.error('Registration failed:', error);
      setErrors({ general: 'Registration failed. Please try again.' });
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
              Create Account
            </h1>
            <p className="text-secondary-600">
              Join KnowVault AI and transform your knowledge management
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

            {/* Name Fields */}
            <motion.div 
              className="grid grid-cols-2 gap-4"
              {...AnimationVariants.staggerItem}
            >
              <Input
                type="text"
                label="First Name"
                placeholder="John"
                value={formData.firstName}
                onChange={handleInputChange('firstName')}
                error={errors.firstName}
                leftIcon={<UserIcon className="w-5 h-5" />}
                required
                autoComplete="given-name"
                validation={validationSchema.firstName}
              />
              
              <Input
                type="text"
                label="Last Name"
                placeholder="Doe"
                value={formData.lastName}
                onChange={handleInputChange('lastName')}
                error={errors.lastName}
                leftIcon={<UserIcon className="w-5 h-5" />}
                required
                autoComplete="family-name"
                validation={validationSchema.lastName}
              />
            </motion.div>

            {/* Email Field */}
            <motion.div {...AnimationVariants.staggerItem}>
              <Input
                type="email"
                label="Email Address"
                placeholder="john@company.com"
                value={formData.email}
                onChange={handleInputChange('email')}
                error={errors.email}
                leftIcon={<EnvelopeIcon className="w-5 h-5" />}
                required
                autoComplete="email"
                validation={validationSchema.email}
              />
            </motion.div>

            {/* Organization Field */}
            <motion.div {...AnimationVariants.staggerItem}>
              <Input
                type="text"
                label="Organization Name"
                placeholder="Your Company Inc."
                value={formData.organizationName}
                onChange={handleInputChange('organizationName')}
                error={errors.organizationName}
                leftIcon={<BuildingOfficeIcon className="w-5 h-5" />}
                required
                autoComplete="organization"
                validation={validationSchema.organizationName}
              />
            </motion.div>

            {/* Password Field */}
            <motion.div {...AnimationVariants.staggerItem}>
              <Input
                type={showPassword ? 'text' : 'password'}
                label="Password"
                placeholder="Create a strong password"
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
                autoComplete="new-password"
                validation={validationSchema.password}
                helperText="Must contain uppercase, lowercase, number, and be 8+ characters"
              />
            </motion.div>

            {/* Confirm Password Field */}
            <motion.div {...AnimationVariants.staggerItem}>
              <Input
                type={showConfirmPassword ? 'text' : 'password'}
                label="Confirm Password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleInputChange('confirmPassword')}
                error={errors.confirmPassword}
                leftIcon={<LockClosedIcon className="w-5 h-5" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-secondary-400 hover:text-secondary-600 transition-colors duration-200"
                  >
                    {showConfirmPassword ? (
                      <EyeSlashIcon className="w-5 h-5" />
                    ) : (
                      <EyeIcon className="w-5 h-5" />
                    )}
                  </button>
                }
                required
                autoComplete="new-password"
                validation={validationSchema.confirmPassword}
              />
            </motion.div>

            {/* Terms and Conditions */}
            <motion.div {...AnimationVariants.staggerItem}>
              <Checkbox
                checked={formData.acceptTerms}
                onChange={handleInputChange('acceptTerms')}
                error={errors.acceptTerms}
                size="sm"
              >
                <span className="text-sm text-secondary-700">
                  I agree to the{' '}
                  <Link 
                    to="/terms" 
                    className="text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Terms of Service
                  </Link>
                  {' '}and{' '}
                  <Link 
                    to="/privacy" 
                    className="text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Privacy Policy
                  </Link>
                </span>
              </Checkbox>
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
                {isLoading ? 'Creating Account...' : 'Create Account'}
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
                  Already have an account?
                </span>
              </div>
            </motion.div>

            {/* Login Link */}
            <motion.div 
              className="text-center"
              {...AnimationVariants.staggerItem}
            >
              <Link
                to="/auth/login"
                className="text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200"
              >
                Sign in to your account
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