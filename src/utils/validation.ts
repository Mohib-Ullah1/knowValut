// Validation Types
export interface ValidationResult {
  isValid: boolean;
  message: string;
}

export interface ValidationRule {
  validator: (value: any, formValues?: any) => ValidationResult;
}

export interface ValidationSchema {
  [key: string]: ValidationRule[];
}

// Complete Validation Rules System - Following Documentation Specs
export const ValidationRules = {
  required: (message = 'This field is required'): ValidationRule => ({
    validator: (value: string) => ({
      isValid: value?.trim().length > 0,
      message: value?.trim().length > 0 ? '' : message
    })
  }),
  
  email: (message = 'Please enter a valid email address'): ValidationRule => ({
    validator: (value: string) => {
      if (!value) return { isValid: true, message: '' };
      const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      return {
        isValid,
        message: isValid ? '' : message
      };
    }
  }),
  
  minLength: (min: number, message?: string): ValidationRule => ({
    validator: (value: string) => {
      if (!value) return { isValid: true, message: '' };
      const isValid = value.length >= min;
      return {
        isValid,
        message: isValid ? '' : (message || `Must be at least ${min} characters`)
      };
    }
  }),
  
  maxLength: (max: number, message?: string): ValidationRule => ({
    validator: (value: string) => {
      if (!value) return { isValid: true, message: '' };
      const isValid = value.length <= max;
      return {
        isValid,
        message: isValid ? '' : (message || `Must be no more than ${max} characters`)
      };
    }
  }),
  
  password: (message = 'Password must contain at least 8 characters, including uppercase, lowercase, and number'): ValidationRule => ({
    validator: (value: string) => {
      if (!value) return { isValid: true, message: '' };
      const isValid = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/.test(value);
      return {
        isValid,
        message: isValid ? '' : message
      };
    }
  }),
  
  confirmPassword: (passwordField = 'password', message = 'Passwords do not match'): ValidationRule => ({
    validator: (value: string, formValues?: any) => {
      if (!value || !formValues) return { isValid: true, message: '' };
      const isValid = value === formValues[passwordField];
      return {
        isValid,
        message: isValid ? '' : message
      };
    }
  }),
  
  phone: (message = 'Please enter a valid phone number'): ValidationRule => ({
    validator: (value: string) => {
      if (!value) return { isValid: true, message: '' };
      const isValid = /^\+?[\d\s\-\(\)]{10,}$/.test(value);
      return {
        isValid,
        message: isValid ? '' : message
      };
    }
  }),
  
  url: (message = 'Please enter a valid URL'): ValidationRule => ({
    validator: (value: string) => {
      if (!value) return { isValid: true, message: '' };
      const isValid = /^https?:\/\/.+\..+/.test(value);
      return {
        isValid,
        message: isValid ? '' : message
      };
    }
  }),
  
  // MFA Code validation
  mfaCode: (message = 'Please enter a valid 6-digit code'): ValidationRule => ({
    validator: (value: string) => {
      if (!value) return { isValid: true, message: '' };
      const isValid = /^\d{6}$/.test(value);
      return {
        isValid,
        message: isValid ? '' : message
      };
    }
  }),
  
  // Custom validation
  custom: (validatorFn: (value: any) => boolean, message: string): ValidationRule => ({
    validator: (value: any) => ({
      isValid: validatorFn(value),
      message: validatorFn(value) ? '' : message
    })
  })
};

// Form validation helper
export const validateField = (value: any, rules: ValidationRule[], formValues?: any): ValidationResult => {
  for (const rule of rules) {
    const result = rule.validator(value, formValues);
    if (!result.isValid) {
      return result;
    }
  }
  return { isValid: true, message: '' };
};

// Validate entire form
export const validateForm = (values: any, schema: ValidationSchema): { [key: string]: string } => {
  const errors: { [key: string]: string } = {};
  
  Object.keys(schema).forEach(field => {
    const result = validateField(values[field], schema[field], values);
    if (!result.isValid) {
      errors[field] = result.message;
    }
  });
  
  return errors;
};