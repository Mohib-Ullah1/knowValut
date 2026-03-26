import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ShieldCheckIcon, 
  QrCodeIcon, 
  DocumentDuplicateIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Card } from '@/components/common/Card';
import { AnimationVariants } from '@/utils/animations';
import { ValidationRules, validateForm } from '@/utils/validation';
import { MFASetupFormData } from '@/types/auth';
import { cn } from '@/utils/cn';

export const MFASetupPage: React.FC = () => {
  const [formData, setFormData] = useState<MFASetupFormData>({
    verificationCode: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [step, setStep] = useState<'setup' | 'verify' | 'backup' | 'complete'>('setup');
  const [copiedSecret, setCopiedSecret] = useState(false);
  const [copiedBackupCode, setCopiedBackupCode] = useState<number | null>(null);

  // Mock MFA data - in real app, this would come from API
  const [mfaData] = useState({
    secret: 'JBSWY3DPEHPK3PXP',
    qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
    backupCodes: [
      '123456789',
      '987654321',
      '456789123',
      '789123456',
      '321654987',
      '654987321',
      '147258369',
      '963852741'
    ]
  });

  // Validation schema
  const validationSchema = {
    verificationCode: [
      ValidationRules.required('Verification code is required'),
      ValidationRules.mfaCode('Please enter a valid 6-digit code')
    ]
  };

  const handleInputChange = (field: keyof MFASetupFormData) => (value: string) => {
    // Auto-format MFA code (remove spaces, limit to 6 digits)
    if (field === 'verificationCode') {
      value = value.replace(/\D/g, '').slice(0, 6);
    }
    
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleCopySecret = async () => {
    try {
      await navigator.clipboard.writeText(mfaData.secret);
      setCopiedSecret(true);
      setTimeout(() => setCopiedSecret(false), 2000);
    } catch (error) {
      console.error('Failed to copy secret:', error);
    }
  };

  const handleCopyBackupCode = async (code: string, index: number) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedBackupCode(index);
      setTimeout(() => setCopiedBackupCode(null), 2000);
    } catch (error) {
      console.error('Failed to copy backup code:', error);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
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
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock verification (in real app, verify with backend)
      if (formData.verificationCode === '123456') {
        setIsVerified(true);
        setStep('backup');
      } else {
        setErrors({ verificationCode: 'Invalid verification code. Please try again.' });
      }
      
    } catch (error) {
      console.error('MFA verification failed:', error);
      setErrors({ general: 'Verification failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteSetup = () => {
    setStep('complete');
  };

  const renderSetupStep = () => (
    <motion.div {...AnimationVariants.fadeInUp}>
      <Card variant="elevated" padding="lg" className="backdrop-blur-sm">
        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          {...AnimationVariants.fadeInDown}
        >
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
              <ShieldCheckIcon className="w-8 h-8 text-primary-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-secondary-900 mb-2">
            Set Up Two-Factor Authentication
          </h1>
          <p className="text-secondary-600">
            Secure your account with an additional layer of protection
          </p>
        </motion.div>

        {/* Instructions */}
        <motion.div 
          className="space-y-6"
          {...AnimationVariants.staggerContainer}
        >
          <motion.div 
            className="p-4 bg-primary-50 border border-primary-200 rounded-lg"
            {...AnimationVariants.staggerItem}
          >
            <h3 className="font-semibold text-primary-900 mb-2">Step 1: Install an Authenticator App</h3>
            <p className="text-sm text-primary-800 mb-3">
              Download and install one of these authenticator apps on your mobile device:
            </p>
            <ul className="text-sm text-primary-800 space-y-1">
              <li>• Google Authenticator</li>
              <li>• Microsoft Authenticator</li>
              <li>• Authy</li>
              <li>• 1Password</li>
            </ul>
          </motion.div>

          <motion.div 
            className="p-4 bg-secondary-50 border border-secondary-200 rounded-lg"
            {...AnimationVariants.staggerItem}
          >
            <h3 className="font-semibold text-secondary-900 mb-2">Step 2: Scan QR Code or Enter Secret</h3>
            <p className="text-sm text-secondary-700 mb-4">
              Use your authenticator app to scan this QR code or manually enter the secret key:
            </p>
            
            {/* QR Code */}
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-white border-2 border-secondary-200 rounded-lg">
                <img 
                  src={mfaData.qrCode} 
                  alt="MFA QR Code"
                  className="w-32 h-32 bg-secondary-100"
                />
              </div>
            </div>

            {/* Secret Key */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-secondary-700">
                Manual Entry Key:
              </label>
              <div className="flex items-center space-x-2">
                <code className="flex-1 px-3 py-2 bg-white border border-secondary-300 rounded text-sm font-mono">
                  {mfaData.secret}
                </code>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopySecret}
                  icon={<DocumentDuplicateIcon className="w-4 h-4" />}
                >
                  {copiedSecret ? 'Copied!' : 'Copy'}
                </Button>
              </div>
            </div>
          </motion.div>

          <motion.div {...AnimationVariants.staggerItem}>
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={() => setStep('verify')}
            >
              Continue to Verification
            </Button>
          </motion.div>
        </motion.div>
      </Card>
    </motion.div>
  );

  const renderVerifyStep = () => (
    <motion.div {...AnimationVariants.fadeInUp}>
      <Card variant="elevated" padding="lg" className="backdrop-blur-sm">
        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          {...AnimationVariants.fadeInDown}
        >
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
              <QrCodeIcon className="w-8 h-8 text-primary-600" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-secondary-900 mb-2">
            Verify Your Setup
          </h1>
          <p className="text-secondary-600">
            Enter the 6-digit code from your authenticator app
          </p>
        </motion.div>

        {/* Form */}
        <motion.form 
          onSubmit={handleVerifyCode}
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

          {/* Verification Code */}
          <motion.div {...AnimationVariants.staggerItem}>
            <Input
              type="text"
              label="Verification Code"
              placeholder="000000"
              value={formData.verificationCode}
              onChange={handleInputChange('verificationCode')}
              error={errors.verificationCode}
              required
              maxLength={6}
              className="text-center text-2xl tracking-widest"
              validation={validationSchema.verificationCode}
              helperText="Enter the 6-digit code from your authenticator app"
            />
          </motion.div>

          {/* Buttons */}
          <motion.div 
            className="space-y-4"
            {...AnimationVariants.staggerItem}
          >
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={isLoading}
              disabled={isLoading || formData.verificationCode.length !== 6}
            >
              {isLoading ? 'Verifying...' : 'Verify Code'}
            </Button>
            
            <Button
              variant="ghost"
              size="lg"
              fullWidth
              onClick={() => setStep('setup')}
            >
              Back to Setup
            </Button>
          </motion.div>
        </motion.form>
      </Card>
    </motion.div>
  );

  const renderBackupStep = () => (
    <motion.div {...AnimationVariants.fadeInUp}>
      <Card variant="elevated" padding="lg" className="backdrop-blur-sm">
        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          {...AnimationVariants.fadeInDown}
        >
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-warning-100 rounded-full flex items-center justify-center">
              <ExclamationTriangleIcon className="w-8 h-8 text-warning-600" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-secondary-900 mb-2">
            Save Your Backup Codes
          </h1>
          <p className="text-secondary-600">
            Store these codes safely. You can use them to access your account if you lose your device.
          </p>
        </motion.div>

        {/* Warning */}
        <motion.div 
          className="p-4 bg-warning-50 border border-warning-200 rounded-lg mb-6"
          {...AnimationVariants.fadeInUp}
        >
          <div className="flex items-start space-x-3">
            <ExclamationTriangleIcon className="w-5 h-5 text-warning-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-warning-900 mb-1">Important:</h3>
              <ul className="text-sm text-warning-800 space-y-1">
                <li>• Each code can only be used once</li>
                <li>• Store them in a secure location</li>
                <li>• Don't share them with anyone</li>
                <li>• You won't be able to see them again</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Backup Codes */}
        <motion.div 
          className="space-y-4 mb-8"
          {...AnimationVariants.staggerContainer}
        >
          <h3 className="font-semibold text-secondary-900">Your Backup Codes:</h3>
          <div className="grid grid-cols-2 gap-3">
            {mfaData.backupCodes.map((code, index) => (
              <motion.div
                key={index}
                className="flex items-center justify-between p-3 bg-secondary-50 border border-secondary-200 rounded-lg"
                {...AnimationVariants.staggerItem}
              >
                <code className="text-sm font-mono text-secondary-900">{code}</code>
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={() => handleCopyBackupCode(code, index)}
                  icon={<DocumentDuplicateIcon className="w-3 h-3" />}
                >
                  {copiedBackupCode === index ? 'Copied!' : 'Copy'}
                </Button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div 
          className="space-y-4"
          {...AnimationVariants.staggerItem}
        >
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={handleCompleteSetup}
          >
            I've Saved My Backup Codes
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            fullWidth
            onClick={() => {
              // Download backup codes as text file
              const element = document.createElement('a');
              const file = new Blob([mfaData.backupCodes.join('\n')], { type: 'text/plain' });
              element.href = URL.createObjectURL(file);
              element.download = 'knowvault-backup-codes.txt';
              document.body.appendChild(element);
              element.click();
              document.body.removeChild(element);
            }}
          >
            Download as Text File
          </Button>
        </motion.div>
      </Card>
    </motion.div>
  );

  const renderCompleteStep = () => (
    <motion.div {...AnimationVariants.fadeInUp}>
      <Card variant="elevated" padding="lg" className="backdrop-blur-sm text-center">
        {/* Success Icon */}
        <motion.div 
          className="flex justify-center mb-6"
          {...AnimationVariants.scaleIn}
        >
          <div className="w-20 h-20 bg-success-100 rounded-full flex items-center justify-center">
            <CheckCircleIcon className="w-10 h-10 text-success-600" />
          </div>
        </motion.div>

        {/* Header */}
        <motion.div 
          className="mb-8"
          {...AnimationVariants.fadeInDown}
        >
          <h1 className="text-3xl font-bold text-secondary-900 mb-2">
            Setup Complete!
          </h1>
          <p className="text-secondary-600">
            Two-factor authentication has been successfully enabled for your account.
          </p>
        </motion.div>

        {/* Success Message */}
        <motion.div 
          className="mb-8 p-4 bg-success-50 border border-success-200 rounded-lg"
          {...AnimationVariants.fadeInUp}
        >
          <p className="text-sm text-success-800">
            Your account is now more secure. You'll need to enter a code from your 
            authenticator app each time you sign in.
          </p>
        </motion.div>

        {/* Actions */}
        <motion.div 
          className="space-y-4"
          {...AnimationVariants.staggerContainer}
        >
          <motion.div {...AnimationVariants.staggerItem}>
            <Link to="/dashboard">
              <Button
                variant="primary"
                size="lg"
                fullWidth
              >
                Continue to Dashboard
              </Button>
            </Link>
          </motion.div>

          <motion.div {...AnimationVariants.staggerItem}>
            <Link to="/settings/security">
              <Button
                variant="outline"
                size="lg"
                fullWidth
              >
                Manage Security Settings
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </Card>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {step === 'setup' && renderSetupStep()}
        {step === 'verify' && renderVerifyStep()}
        {step === 'backup' && renderBackupStep()}
        {step === 'complete' && renderCompleteStep()}

        {/* Footer */}
        <motion.div 
          className="text-center mt-8 text-sm text-secondary-500"
          {...AnimationVariants.fadeIn}
        >
          © 2024 KnowVault AI. All rights reserved.
        </motion.div>
      </div>
    </div>
  );
};