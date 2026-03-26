// Validation System for KnowVault AI - Pure JavaScript Implementation

class ValidationRules {
  static required(message = 'This field is required') {
    return {
      validator: (value) => ({
        isValid: value && value.trim().length > 0,
        message: value && value.trim().length > 0 ? '' : message
      })
    };
  }

  static email(message = 'Please enter a valid email address') {
    return {
      validator: (value) => {
        if (!value) return { isValid: true, message: '' };
        const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        return {
          isValid,
          message: isValid ? '' : message
        };
      }
    };
  }

  static minLength(min, message) {
    return {
      validator: (value) => {
        if (!value) return { isValid: true, message: '' };
        const isValid = value.length >= min;
        return {
          isValid,
          message: isValid ? '' : (message || `Must be at least ${min} characters`)
        };
      }
    };
  }

  static maxLength(max, message) {
    return {
      validator: (value) => {
        if (!value) return { isValid: true, message: '' };
        const isValid = value.length <= max;
        return {
          isValid,
          message: isValid ? '' : (message || `Must be no more than ${max} characters`)
        };
      }
    };
  }

  static password(message = 'Password must contain at least 8 characters, including uppercase, lowercase, and number') {
    return {
      validator: (value) => {
        if (!value) return { isValid: true, message: '' };
        const isValid = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/.test(value);
        return {
          isValid,
          message: isValid ? '' : message
        };
      }
    };
  }

  static confirmPassword(passwordField = 'password', message = 'Passwords do not match') {
    return {
      validator: (value, formValues) => {
        if (!value || !formValues) return { isValid: true, message: '' };
        const isValid = value === formValues[passwordField];
        return {
          isValid,
          message: isValid ? '' : message
        };
      }
    };
  }

  static mfaCode(message = 'Please enter a valid 6-digit code') {
    return {
      validator: (value) => {
        if (!value) return { isValid: true, message: '' };
        const isValid = /^\d{6}$/.test(value);
        return {
          isValid,
          message: isValid ? '' : message
        };
      }
    };
  }

  static phone(message = 'Please enter a valid phone number') {
    return {
      validator: (value) => {
        if (!value) return { isValid: true, message: '' };
        const isValid = /^\+?[\d\s\-\(\)]{10,}$/.test(value);
        return {
          isValid,
          message: isValid ? '' : message
        };
      }
    };
  }

  static custom(validatorFn, message) {
    return {
      validator: (value) => ({
        isValid: validatorFn(value),
        message: validatorFn(value) ? '' : message
      })
    };
  }
}

// Form Validation Helper Functions
function validateField(value, rules, formValues = {}) {
  for (const rule of rules) {
    const result = rule.validator(value, formValues);
    if (!result.isValid) {
      return result;
    }
  }
  return { isValid: true, message: '' };
}

function validateForm(values, schema) {
  const errors = {};
  
  Object.keys(schema).forEach(field => {
    const result = validateField(values[field], schema[field], values);
    if (!result.isValid) {
      errors[field] = result.message;
    }
  });
  
  return errors;
}

// Form Handler Class
class FormHandler {
  constructor(formElement, validationSchema) {
    this.form = formElement;
    this.schema = validationSchema;
    this.values = {};
    this.errors = {};
    this.isSubmitting = false;
    
    this.init();
  }

  init() {
    // Initialize form values
    const inputs = this.form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      this.values[input.name] = input.value || '';
      
      // Add event listeners
      input.addEventListener('input', (e) => this.handleInputChange(e));
      input.addEventListener('blur', (e) => this.handleInputBlur(e));
    });

    // Add form submit listener
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
  }

  handleInputChange(event) {
    const { name, value, type, checked } = event.target;
    
    // Update value
    this.values[name] = type === 'checkbox' ? checked : value;
    
    // Clear error if exists
    if (this.errors[name]) {
      this.clearFieldError(name);
    }
    
    // Real-time validation for certain fields
    if (this.schema[name]) {
      this.validateField(name);
    }
  }

  handleInputBlur(event) {
    const { name } = event.target;
    
    // Validate field on blur
    if (this.schema[name]) {
      this.validateField(name);
    }
  }

  validateField(fieldName) {
    const rules = this.schema[fieldName];
    if (!rules) return true;

    const result = validateField(this.values[fieldName], rules, this.values);
    
    if (!result.isValid) {
      this.showFieldError(fieldName, result.message);
      return false;
    } else {
      this.clearFieldError(fieldName);
      return true;
    }
  }

  showFieldError(fieldName, message) {
    this.errors[fieldName] = message;

    const input = this.form.querySelector(`[name="${fieldName}"]`);
    if (!input) return;

    // Find the closest wrapper — supports both old (.input-group) and new markup
    const wrapper = input.closest('.input-group') || input.closest('.input-wrap')?.parentElement || input.parentElement?.parentElement;
    const errorElement = wrapper?.querySelector('.input-error');

    // Add error styling to input wrapper if it exists
    const inputWrapper = wrapper?.querySelector('.input-wrapper');
    if (inputWrapper) {
      inputWrapper.classList.remove('input-wrapper-default');
      inputWrapper.classList.add('input-wrapper-error');
    }

    // Also style the input directly for new markup
    input.style.borderColor = 'rgb(239,68,68)';

    // Show error message
    if (errorElement) {
      const span = errorElement.querySelector('span');
      if (span) span.textContent = message;
      else errorElement.textContent = message;
      errorElement.classList.remove('hidden');
    }
  }

  clearFieldError(fieldName) {
    delete this.errors[fieldName];

    const input = this.form.querySelector(`[name="${fieldName}"]`);
    if (!input) return;

    const wrapper = input.closest('.input-group') || input.closest('.input-wrap')?.parentElement || input.parentElement?.parentElement;
    const errorElement = wrapper?.querySelector('.input-error');

    // Remove error styling from input wrapper if it exists
    const inputWrapper = wrapper?.querySelector('.input-wrapper');
    if (inputWrapper) {
      inputWrapper.classList.remove('input-wrapper-error');
      inputWrapper.classList.add('input-wrapper-default');
    }

    // Reset direct input styling
    input.style.borderColor = '';

    // Hide error message
    if (errorElement) {
      const span = errorElement.querySelector('span');
      if (span) span.textContent = '';
      else errorElement.textContent = '';
      errorElement.classList.add('hidden');
    }
  }

  async handleSubmit(event) {
    event.preventDefault();
    
    if (this.isSubmitting) return;
    
    // Validate all fields
    let isValid = true;
    Object.keys(this.schema).forEach(fieldName => {
      if (!this.validateField(fieldName)) {
        isValid = false;
      }
    });
    
    if (!isValid) return;
    
    // Show loading state
    this.setSubmitting(true);
    
    try {
      // Call submit handler if provided
      if (this.onSubmit) {
        await this.onSubmit(this.values);
      }
    } catch (error) {
      console.error('Form submission error:', error);
      this.showGeneralError('An error occurred. Please try again.');
    } finally {
      this.setSubmitting(false);
    }
  }

  setSubmitting(isSubmitting) {
    this.isSubmitting = isSubmitting;
    
    const submitButton = this.form.querySelector('button[type="submit"]');
    const spinner = submitButton.querySelector('.spinner');
    const buttonText = submitButton.querySelector('.button-text');
    
    if (isSubmitting) {
      submitButton.disabled = true;
      if (spinner) spinner.classList.remove('hidden');
      if (buttonText) buttonText.textContent = 'Loading...';
    } else {
      submitButton.disabled = false;
      if (spinner) spinner.classList.add('hidden');
      if (buttonText) buttonText.textContent = submitButton.dataset.originalText || 'Submit';
    }
  }

  showGeneralError(message) {
    const errorContainer = this.form.querySelector('.general-error');
    if (errorContainer) {
      errorContainer.textContent = message;
      errorContainer.classList.remove('hidden');
    }
  }

  clearGeneralError() {
    const errorContainer = this.form.querySelector('.general-error');
    if (errorContainer) {
      errorContainer.textContent = '';
      errorContainer.classList.add('hidden');
    }
  }
}

// Utility Functions
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type} animate-fade-in-up`;
  toast.innerHTML = `
    <div class="flex items-center justify-between">
      <span class="text-sm font-medium">${message}</span>
      <button onclick="this.parentElement.parentElement.remove()" class="ml-4 text-current opacity-70 hover:opacity-100 transition-opacity duration-200">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    </div>
  `;
  
  document.body.appendChild(toast);
  
  // Auto-remove after 5 seconds
  setTimeout(() => {
    if (toast.parentElement) {
      toast.remove();
    }
  }, 5000);
}

function togglePasswordVisibility(inputId, buttonElement) {
  const input = document.getElementById(inputId);
  const icon = buttonElement.querySelector('svg');
  
  if (input.type === 'password') {
    input.type = 'text';
    icon.innerHTML = `
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
    `;
  } else {
    input.type = 'password';
    icon.innerHTML = `
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
    `;
  }
}

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    ValidationRules,
    validateField,
    validateForm,
    FormHandler,
    showToast,
    togglePasswordVisibility,
    copyToClipboard
  };
}