# KnowVault AI - Enterprise Knowledge Management Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.0-38B2AC?logo=tailwind-css)](https://tailwindcss.com)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

> **AI-Powered Private Knowledge Platform** with Retrieval Augmented Generation (RAG) Architecture

KnowVault AI is an enterprise-grade knowledge management platform that enables organizations to interact with their internal documents through natural language queries. Built with pure Tailwind CSS, HTML, and JavaScript - delivering exceptional performance without framework overhead.

---

## 🌟 Features

### ✅ Complete Application (16 Pages)

#### Authentication (4 pages)
- 🔐 **Login** - Secure authentication with email/password
- 📝 **Register** - User registration with organization setup
- 🔑 **Forgot Password** - Password recovery workflow
- �️ **MFA Setup** - Multi-factor authentication with QR codes

#### Dashboard (3 pages)
- 📊 **Dashboard** - Overview with key metrics and recent activity
- 📈 **Analytics** - Detailed usage analytics and insights
- 📄 **Reports** - Comprehensive reporting system

#### Document Management (3 pages)
- 📁 **Documents** - Document library with search and filters
- ⬆️ **Upload** - Drag-and-drop document upload
- 👁️ **Viewer** - Document preview and metadata display

#### Query Interface (3 pages)
- 💬 **Chat** - AI-powered conversational interface
- 🔍 **Search** - Advanced search with filters
- 📜 **History** - Query history with re-run capability

#### Settings (3 pages)
- ⚙️ **User Settings** - Profile and preferences
- 🏢 **Organization** - Company settings and user management
- 🔒 **Security** - Security policies and audit logs

### 🎨 Design System

- **Perfect 10/10 Consistency** - Zero design inconsistencies across all pages
- **Responsive Design** - Mobile-first approach with seamless tablet/desktop experience
- **Accessibility** - WCAG 2.1 AA compliant with screen reader support
- **Animations** - Smooth CSS animations with JavaScript enhancements
- **Dark Mode Ready** - Architecture supports easy dark mode implementation

---

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have the following installed:

1. **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
2. **npm** (comes with Node.js) or **yarn**
3. **Git** - [Download here](https://git-scm.com/)

### Installation

```bash
# Clone the repository
git clone https://github.com/Mohib-Ullah1/knowValut.git
cd knowValut

# Install dependencies
npm install

# Build Tailwind CSS
npm run build-css

# Start development server
npm run dev
```

The application will open at `http://localhost:3000`

### Development Workflow

```bash
# Watch for CSS changes (run in separate terminal)
npm run watch

# Build for production
npm run build

# Serve the application
npm run serve
```

---

## 📦 Technology Stack

### Frontend
- **HTML5** - Semantic markup with accessibility features
- **Tailwind CSS 3.4.0** - Utility-first CSS framework with custom design system
- **Vanilla JavaScript (ES6+)** - Modern JavaScript without framework overhead
- **Alpine.js 3.13** - Lightweight reactive components
- **Heroicons** - Beautiful hand-crafted SVG icons

### Development Tools
- **PostCSS** - CSS processing and optimization
- **Autoprefixer** - Automatic vendor prefixing
- **Live Server** - Development server with live reload
- **Tailwind Forms** - Beautiful form styling plugin
- **Tailwind Typography** - Prose styling for content

### Build System
- **Tailwind CLI** - Fast CSS compilation
- **npm scripts** - Simple build automation
- **CSS Purging** - Removes unused styles for production

---

## 🎨 Design System

### Color Palette

```css
/* Primary Colors */
--primary-50:  #f0f9ff;
--primary-500: #0ea5e9;  /* Main brand color */
--primary-600: #0284c7;
--primary-700: #0369a1;
--primary-900: #0c4a6e;

/* Secondary Colors */
--secondary-50:  #f8fafc;
--secondary-500: #64748b;
--secondary-600: #475569;
--secondary-900: #0f172a;

/* Status Colors */
--success-500: #22c55e;
--warning-500: #f59e0b;
--error-500:   #ef4444;
```

### Component Classes

#### Buttons
```html
<!-- Variants -->
<button class="btn btn-primary btn-md">Primary</button>
<button class="btn btn-secondary btn-md">Secondary</button>
<button class="btn btn-outline btn-md">Outline</button>
<button class="btn btn-ghost btn-md">Ghost</button>

<!-- Sizes -->
<button class="btn btn-primary btn-xs">Extra Small</button>
<button class="btn btn-primary btn-sm">Small</button>
<button class="btn btn-primary btn-md">Medium (Default)</button>
<button class="btn btn-primary btn-lg">Large</button>
<button class="btn btn-primary btn-xl">Extra Large</button>
```

#### Cards
```html
<div class="card card-default card-padding-md">
  <!-- Content -->
</div>

<!-- Variants: card-default, card-elevated, card-outlined, card-filled -->
<!-- Padding: card-padding-sm, card-padding-md, card-padding-lg -->
```

#### Inputs
```html
<div class="input-group">
  <label class="input-label">Email</label>
  <div class="input-wrapper input-wrapper-default">
    <input type="email" class="input-field input-md" />
  </div>
  <div class="input-helper">Helper text</div>
</div>
```

### Typography

```css
/* Font Family */
font-family: 'Inter', system-ui, sans-serif;
font-family: 'JetBrains Mono', monospace; /* For code */

/* Font Sizes */
text-xs:   0.75rem  (12px)
text-sm:   0.875rem (14px)
text-base: 1rem     (16px)
text-lg:   1.125rem (18px)
text-xl:   1.25rem  (20px)
text-2xl:  1.5rem   (24px)
text-3xl:  1.875rem (30px)
```

### Spacing Scale

```css
/* 8px Grid System */
1: 0.25rem  (4px)
2: 0.5rem   (8px)
3: 0.75rem  (12px)
4: 1rem     (16px)
6: 1.5rem   (24px)
8: 2rem     (32px)
```

---

## 📁 Project Structure

```
knowValut/
├── pages/                          # HTML pages
│   ├── auth/                       # Authentication pages
│   │   ├── login.html
│   │   ├── register.html
│   │   ├── forgot-password.html
│   │   └── mfa-setup.html
│   ├── dashboard/                  # Dashboard pages
│   │   ├── dashboard.html
│   │   ├── analytics.html
│   │   └── reports.html
│   ├── documents/                  # Document management
│   │   ├── documents.html
│   │   ├── upload.html
│   │   └── viewer.html
│   ├── query/                      # Query interface
│   │   ├── chat.html
│   │   ├── search.html
│   │   └── history.html
│   └── settings/                   # Settings pages
│       ├── settings.html
│       ├── organization.html
│       └── security.html
├── src/
│   ├── styles/
│   │   ├── input.css              # Tailwind source
│   │   ├── output.css             # Compiled CSS
│   │   └── globals.css            # Global styles
│   ├── js/
│   │   ├── validation.js          # Form validation
│   │   └── animations.js          # Animation controllers
│   ├── components/                # React components (future)
│   ├── pages/                     # React pages (future)
│   ├── types/                     # TypeScript types (future)
│   └── utils/                     # Utility functions (future)
├── index.html                     # Landing page
├── tailwind.config.js             # Tailwind configuration
├── postcss.config.js              # PostCSS configuration
├── package.json                   # Dependencies
├── README.md                      # This file
├── KnowVault_AI_Technical_Design_Document.md
├── KnowVault_AI_Frontend_Development_Plan.md
└── KnowVault_AI_Backend_Development_Plan.md
```

---

## 🔐 Authentication Features

### Login Page
- Email and password validation
- Remember me functionality
- Show/hide password toggle
- Forgot password link
- Loading states with spinner
- Real-time validation feedback

### Register Page
- Multi-field form validation
- Password strength requirements
- Terms acceptance
- Organization setup
- Password confirmation
- Real-time feedback

### Forgot Password
- Email validation
- Success state with instructions
- Resend email functionality
- Animated transitions

### MFA Setup
- 4-step wizard (Setup → Verify → Backup → Complete)
- QR code for authenticator apps
- Manual secret key entry
- 6-digit code verification
- Backup codes generation
- Download backup codes

---

## 🎯 Form Validation System

### Validation Rules

```javascript
// Available validation rules
ValidationRules.required('Field is required')
ValidationRules.email('Invalid email')
ValidationRules.password('Weak password')
ValidationRules.minLength(8, 'Min 8 characters')
ValidationRules.maxLength(100, 'Max 100 characters')
ValidationRules.confirmPassword('fieldName', 'Passwords must match')
ValidationRules.mfaCode('Invalid MFA code')
```

### Usage Example

```javascript
const validationSchema = {
  email: [
    ValidationRules.required('Email is required'),
    ValidationRules.email('Please enter a valid email')
  ],
  password: [
    ValidationRules.required('Password is required'),
    ValidationRules.password('Password must be strong')
  ]
};

const formHandler = new FormHandler(form, validationSchema);
```

---

## 🎬 Animation System

### Available Animations

```css
/* Fade Animations */
data-animate="fade-in"          /* 200ms fade in */
data-animate="fade-in-up"       /* 300ms fade + slide up */
data-animate="fade-in-down"     /* 300ms fade + slide down */

/* Scale Animations */
data-animate="scale-in"         /* 200ms scale from 0.9 to 1 */

/* Slide Animations */
data-animate="slide-in-left"    /* 300ms slide from left */
data-animate="slide-in-right"   /* 300ms slide from right */

/* Delays */
data-delay="100"                /* 100ms delay */
data-delay="200"                /* 200ms delay */
data-delay="300"                /* 300ms delay */
```

### Usage Example

```html
<div data-animate="fade-in-up" data-delay="200">
  Content will fade in from bottom after 200ms
</div>
```

---

## 📱 Responsive Design

### Breakpoints

```css
sm:  640px   /* Small devices (tablets) */
md:  768px   /* Medium devices (tablets landscape) */
lg:  1024px  /* Large devices (desktops) */
xl:  1280px  /* Extra large devices */
2xl: 1536px  /* 2X large devices */
```

### Mobile-First Approach

```html
<!-- Mobile: full width, Desktop: half width -->
<div class="w-full lg:w-1/2">Content</div>

<!-- Mobile: stacked, Desktop: side-by-side -->
<div class="flex flex-col lg:flex-row">
  <div>Left</div>
  <div>Right</div>
</div>
```

---

## 🔧 Customization

### Adding New Colors

1. Update `tailwind.config.js`:
```javascript
theme: {
  extend: {
    colors: {
      brand: {
        500: '#your-color',
      }
    }
  }
}
```

2. Rebuild CSS:
```bash
npm run build-css
```

### Creating New Components

1. Add to `src/styles/input.css`:
```css
@layer components {
  .my-component {
    @apply bg-white rounded-lg shadow-sm p-4;
  }
}
```

2. Rebuild and use:
```html
<div class="my-component">Content</div>
```

---

## 🚀 Deployment

### Build for Production

```bash
# Build optimized CSS
npm run build

# The output will be in dist/styles.css
# Deploy all HTML files and the dist folder
```

### Deployment Platforms

- **Netlify** - Drag and drop deployment
- **Vercel** - Git-based deployment
- **GitHub Pages** - Free static hosting
- **AWS S3** - Scalable cloud hosting
- **Cloudflare Pages** - Fast global CDN

---

## 📊 Performance

- ⚡ **Fast Loading** - No framework overhead
- 🎯 **Small Bundle** - Purged CSS removes unused styles
- 🚀 **Optimized** - Minimal JavaScript for essential functionality
- 📦 **Efficient** - CSS animations with minimal JS
- 🔄 **Quick Builds** - Tailwind CLI for fast compilation

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👥 Team

**KnowVault AI Development Team**

- Frontend Architecture: Pure Tailwind CSS Implementation
- Design System: Enterprise-grade consistency
- Performance: Optimized for speed and efficiency

---

## 📚 Documentation

- [Technical Design Document](./KnowVault_AI_Technical_Design_Document.md) - Complete system architecture
- [Frontend Development Plan](./KnowVault_AI_Frontend_Development_Plan.md) - Frontend specifications
- [Backend Development Plan](./KnowVault_AI_Backend_Development_Plan.md) - Backend architecture

---

## 🔮 Roadmap

### Phase 1: Frontend Foundation ✅
- [x] Authentication pages (4/4)
- [x] Dashboard pages (3/3)
- [x] Document management (3/3)
- [x] Query interface (3/3)
- [x] Settings pages (3/3)
- [x] Design system consistency (10/10)

### Phase 2: Backend Integration (In Progress)
- [ ] Django REST API
- [ ] PostgreSQL with pgvector
- [ ] Document processing pipeline
- [ ] AI/RAG implementation
- [ ] WebSocket for real-time chat

### Phase 3: Advanced Features
- [ ] Progressive Web App (PWA)
- [ ] Dark mode
- [ ] Internationalization (i18n)
- [ ] Advanced analytics
- [ ] Mobile apps (iOS/Android)

---

## 💡 Support

For support, email support@knowvault.ai or open an issue on GitHub.

---

## ⭐ Star History

If you find this project useful, please consider giving it a star on GitHub!

---

**Built with ❤️ using Pure Tailwind CSS, HTML, and JavaScript**

© 2024 KnowVault AI. All rights reserved.
