import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { EnvelopeIcon, ArrowLeftIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Card } from '@/components/common/Card';
import { AnimationVariants } from '@/utils/animations';
import { ValidationRules, validateForm } from '@/utils/validation';
import { ForgotPasswordFormData } from '@/types/auth';
import { cn } from '@/utils/cn';

export const ForgotPasswordPage: React.FC = () => {
  const [formData, setFormData] = useState<ForgotPasswordFormData>({
    email: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Validation schema following documentation specs
  const validationSchema = {
    email: [
      ValidationRules.required('Email is required'),
      ValidationRules.email('Please enter a valid email address')
    ]
  };

  const handleInputChange = (field: keyof ForgotPasswordFormData) => (value: string) => {
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
      
      // Handle successful password reset request
      console.log('Password reset email sent:', formData);
      setIsSubmitted(true);
      
    } catch (error) {
      console.error('Password reset failed:', error);
      setErrors({ general: 'Failed to send reset email. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendEmail = async () => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Reset email resent:', formData.email);
      
    } catch (error) {
      console.error('Resend failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center p-4">
        <motion.div
          className="w-full max-w-md"
          {...AnimationVariants.fadeInUp}
        >
          <Card variant="elevated" padding="lg" className="backdrop-blur-sm text-center">
            {/* Success Icon */}
            <motion.div 
              className="flex justify-center mb-6"
              {...AnimationVariants.scaleIn}
            >
              <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center">
                <CheckCircleIcon className="w-8 h-8 text-success-600" />
              </div>
            </motion.div>

            {/* Header */}
            <motion.div 
              className="mb-8"
              {...AnimationVariants.fadeInDown}
            >
              <h1 className="text-2xl font-bold text-secondary-900 mb-2">
                Check Your Email
              </h1>
              <p className="text-secondary-600">
                We've sent a password reset link to
              </p>
              <p className="text-primary-600 font-medium mt-1">
                {formData.email}
              </p>
            </motion.div>

            {/* Instructions */}
            <motion.div 
              className="mb-8 p-4 bg-primary-50 border border-primary-200 rounded-lg"
              {...AnimationVariants.fadeInUp}
            >
              <p className="text-sm text-primary-800">
                Click the link in the email to reset your password. 
                If you don't see it, check your spam folder.
              </p>
            </motion.div>

            {/* Actions */}
            <motion.div 
              className="space-y-4"
              {...AnimationVariants.staggerContainer}
            >
              <motion.div {...AnimationVariants.staggerItem}>
                <Button
                  variant="outline"
                  size="lg"
                  fullWidth
                  loading={isLoading}
                  onClick={handleResendEmail}
                >
                  {isLoading ? 'Resending...' : 'Resend Email'}
                </Button>
              </motion.div>

              <motion.div {...AnimationVariants.staggerItem}>
                <Link to="/auth/login">
                  <Button
                    variant="ghost"
                    size="lg"
                    fullWidth
                    icon={<ArrowLeftIcon className="w-4 h-4" />}
                  >
                    Back to Sign In
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
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
  }

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
              Forgot Password?
            </h1>
            <p className="text-secondary-600">
              No worries! Enter your email and we'll send you reset instructions.
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
                placeholder="Enter your email address"
                value={formData.email}
                onChange={handleInputChange('email')}
                error={errors.email}
                leftIcon={<EnvelopeIcon className="w-5 h-5" />}
                required
                autoComplete="email"
                validation={validationSchema.email}
                helperText="We'll send password reset instructions to this email"
              />
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
                {isLoading ? 'Sending Reset Link...' : 'Send Reset Link'}
              </Button>
            </motion.div>

            {/* Back to Login */}
            <motion.div 
              className="text-center"
              {...AnimationVariants.staggerItem}
            >
              <Link
                to="/auth/login"
                className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200"
              >
                <ArrowLeftIcon className="w-4 h-4 mr-2" />
                Back to Sign In
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