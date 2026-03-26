// Animation System for KnowVault AI - Pure JavaScript Implementation

class AnimationController {
  constructor() {
    this.observers = new Map();
    this.init();
  }

  init() {
    // Initialize intersection observer for scroll animations
    this.scrollObserver = new IntersectionObserver(
      (entries) => this.handleScrollAnimations(entries),
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    // Auto-animate elements with animation classes
    this.observeAnimationElements();
  }

  observeAnimationElements() {
    const animatedElements = document.querySelectorAll('[data-animate]');
    animatedElements.forEach(element => {
      this.scrollObserver.observe(element);
    });
  }

  handleScrollAnimations(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const element = entry.target;
        const animationType = element.dataset.animate;
        const delay = element.dataset.delay || 0;
        
        setTimeout(() => {
          this.triggerAnimation(element, animationType);
        }, parseInt(delay));
        
        // Stop observing once animated
        this.scrollObserver.unobserve(element);
      }
    });
  }

  triggerAnimation(element, type) {
    switch (type) {
      case 'fade-in':
        element.classList.add('animate-fade-in');
        break;
      case 'fade-in-up':
        element.classList.add('animate-fade-in-up');
        break;
      case 'fade-in-down':
        element.classList.add('animate-fade-in-down');
        break;
      case 'scale-in':
        element.classList.add('animate-scale-in');
        break;
      case 'slide-in-left':
        element.classList.add('animate-slide-in-left');
        break;
      case 'slide-in-right':
        element.classList.add('animate-slide-in-right');
        break;
      default:
        element.classList.add('animate-fade-in');
    }
  }

  // Stagger animations for multiple elements
  staggerAnimation(elements, animationType, staggerDelay = 100) {
    elements.forEach((element, index) => {
      setTimeout(() => {
        this.triggerAnimation(element, animationType);
      }, index * staggerDelay);
    });
  }

  // Button hover animations
  initButtonAnimations() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
      button.addEventListener('mouseenter', () => {
        button.style.transform = 'scale(1.02)';
      });
      
      button.addEventListener('mouseleave', () => {
        button.style.transform = 'scale(1)';
      });
      
      button.addEventListener('mousedown', () => {
        button.style.transform = 'scale(0.98)';
      });
      
      button.addEventListener('mouseup', () => {
        button.style.transform = 'scale(1.02)';
      });
    });
  }

  // Card hover animations
  initCardAnimations() {
    const cards = document.querySelectorAll('.card[data-hover="true"]');
    
    cards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-4px)';
        card.style.boxShadow = '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)';
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
        card.style.boxShadow = '';
      });
    });
  }

  // Input focus animations
  initInputAnimations() {
    const inputs = document.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
      input.addEventListener('focus', () => {
        const wrapper = input.closest('.input-wrapper');
        if (wrapper) {
          wrapper.style.transform = 'scale(1.01)';
        }
      });
      
      input.addEventListener('blur', () => {
        const wrapper = input.closest('.input-wrapper');
        if (wrapper) {
          wrapper.style.transform = 'scale(1)';
        }
      });
    });
  }

  // Loading spinner animation
  showLoadingSpinner(element, size = 20, color = 'primary') {
    const colorClasses = {
      primary: 'text-primary-600',
      secondary: 'text-secondary-600',
      white: 'text-white'
    };

    const spinner = document.createElement('div');
    spinner.className = `spinner ${colorClasses[color]} mr-2`;
    spinner.innerHTML = `
      <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2V6M12 18V22M4.93 4.93L7.76 7.76M16.24 16.24L19.07 19.07M2 12H6M18 12H22M4.93 19.07L7.76 16.24M16.24 7.76L19.07 4.93" 
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" opacity="0.3"/>
        <path d="M12 2V6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;
    
    element.insertBefore(spinner, element.firstChild);
    return spinner;
  }

  hideLoadingSpinner(element) {
    const spinner = element.querySelector('.spinner');
    if (spinner) {
      spinner.remove();
    }
  }

  // Typing indicator animation
  createTypingIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'flex items-center space-x-1 p-3';
    indicator.innerHTML = `
      <span class="text-sm text-secondary-500">AI is typing</span>
      <div class="flex space-x-1">
        <div class="w-2 h-2 bg-secondary-400 rounded-full animate-bounce" style="animation-delay: 0s;"></div>
        <div class="w-2 h-2 bg-secondary-400 rounded-full animate-bounce" style="animation-delay: 0.2s;"></div>
        <div class="w-2 h-2 bg-secondary-400 rounded-full animate-bounce" style="animation-delay: 0.4s;"></div>
      </div>
    `;
    return indicator;
  }

  // Skeleton loader animation
  createSkeletonLoader(width = '100%', height = '1rem', className = '') {
    const skeleton = document.createElement('div');
    skeleton.className = `bg-secondary-200 rounded animate-pulse ${className}`;
    skeleton.style.width = width;
    skeleton.style.height = height;
    return skeleton;
  }

  // Page transition animations
  pageTransitionIn(element) {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    
    // Trigger animation
    requestAnimationFrame(() => {
      element.style.transition = 'opacity 0.3s ease-out, transform 0.3s ease-out';
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
    });
  }

  pageTransitionOut(element) {
    return new Promise((resolve) => {
      element.style.transition = 'opacity 0.2s ease-out, transform 0.2s ease-out';
      element.style.opacity = '0';
      element.style.transform = 'translateY(-20px)';
      
      setTimeout(resolve, 200);
    });
  }

  // Modal animations
  showModal(modalElement) {
    const backdrop = modalElement.querySelector('.modal-backdrop');
    const content = modalElement.querySelector('.modal-content');
    
    modalElement.classList.remove('hidden');
    
    // Animate backdrop
    if (backdrop) {
      backdrop.style.opacity = '0';
      requestAnimationFrame(() => {
        backdrop.style.transition = 'opacity 0.2s ease-out';
        backdrop.style.opacity = '1';
      });
    }
    
    // Animate content
    if (content) {
      content.style.opacity = '0';
      content.style.transform = 'scale(0.9)';
      requestAnimationFrame(() => {
        content.style.transition = 'opacity 0.2s ease-out, transform 0.2s ease-out';
        content.style.opacity = '1';
        content.style.transform = 'scale(1)';
      });
    }
  }

  hideModal(modalElement) {
    return new Promise((resolve) => {
      const backdrop = modalElement.querySelector('.modal-backdrop');
      const content = modalElement.querySelector('.modal-content');
      
      // Animate out
      if (backdrop) {
        backdrop.style.transition = 'opacity 0.2s ease-out';
        backdrop.style.opacity = '0';
      }
      
      if (content) {
        content.style.transition = 'opacity 0.2s ease-out, transform 0.2s ease-out';
        content.style.opacity = '0';
        content.style.transform = 'scale(0.9)';
      }
      
      setTimeout(() => {
        modalElement.classList.add('hidden');
        resolve();
      }, 200);
    });
  }

  // Initialize all animations
  initializeAll() {
    this.initButtonAnimations();
    this.initCardAnimations();
    this.initInputAnimations();
    this.observeAnimationElements();
  }
}

// Initialize animation controller when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.animationController = new AnimationController();
  window.animationController.initializeAll();
});

// Utility functions for easy access
function animateElement(element, type, delay = 0) {
  setTimeout(() => {
    if (window.animationController) {
      window.animationController.triggerAnimation(element, type);
    }
  }, delay);
}

function staggerElements(selector, animationType, staggerDelay = 100) {
  const elements = document.querySelectorAll(selector);
  if (window.animationController) {
    window.animationController.staggerAnimation(elements, animationType, staggerDelay);
  }
}

function showLoading(buttonElement) {
  if (window.animationController) {
    const spinner = window.animationController.showLoadingSpinner(buttonElement);
    buttonElement.disabled = true;
    return spinner;
  }
}

function hideLoading(buttonElement) {
  if (window.animationController) {
    window.animationController.hideLoadingSpinner(buttonElement);
    buttonElement.disabled = false;
  }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    AnimationController,
    animateElement,
    staggerElements,
    showLoading,
    hideLoading
  };
}