/* ========================================
   IRS TAX RELIEF SAAS - STYLE GUIDE
   Based on Origin Design System
   ======================================== */

/* ========================================
   1. COLOR PALETTE
   ======================================== */
:root {
  /* Primary Blues */
  --primary-50: #EFF6FF;
  --primary-100: #DBEAFE;
  --primary-200: #BFDBFE;
  --primary-300: #93C5FD;
  --primary-400: #60A5FA;
  --primary-500: #3B82F6; /* Main Blue */
  --primary-600: #2563EB;
  --primary-700: #1D4ED8;
  --primary-800: #1E40AF;
  --primary-900: #1E3A8A;
  
  /* Secondary - Indigo */
  --secondary-50: #EEF2FF;
  --secondary-100: #E0E7FF;
  --secondary-200: #C7D2FE;
  --secondary-300: #A5B4FC;
  --secondary-400: #818CF8;
  --secondary-500: #6366F1;
  --secondary-600: #4F46E5;
  --secondary-700: #4338CA;
  --secondary-800: #3730A3;
  --secondary-900: #312E81;
  
  /* Neutral Grays */
  --gray-50: #F9FAFB;
  --gray-100: #F3F4F6;
  --gray-200: #E5E7EB;
  --gray-300: #D1D5DB;
  --gray-400: #9CA3AF;
  --gray-500: #6B7280;
  --gray-600: #4B5563;
  --gray-700: #374151;
  --gray-800: #1F2937;
  --gray-900: #111827;
  
  /* Success */
  --success-50: #F0FDF4;
  --success-500: #22C55E;
  --success-600: #16A34A;
  --success-700: #15803D;
  
  /* Warning */
  --warning-50: #FFFBEB;
  --warning-500: #F59E0B;
  --warning-600: #D97706;
  
  /* Error */
  --error-50: #FEF2F2;
  --error-500: #EF4444;
  --error-600: #DC2626;
  
  /* Background Colors */
  --bg-primary: #FFFFFF;
  --bg-secondary: #F9FAFB;
  --bg-tertiary: #F3F4F6;
  
  /* Text Colors */
  --text-primary: #111827;
  --text-secondary: #4B5563;
  --text-tertiary: #6B7280;
  --text-inverse: #FFFFFF;
}

/* ========================================
   2. TYPOGRAPHY
   ======================================== */
:root {
  --font-primary: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  --font-mono: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', monospace;
  
  /* Font Sizes */
  --text-xs: 0.75rem;     /* 12px */
  --text-sm: 0.875rem;    /* 14px */
  --text-base: 1rem;      /* 16px */
  --text-lg: 1.125rem;    /* 18px */
  --text-xl: 1.25rem;     /* 20px */
  --text-2xl: 1.5rem;     /* 24px */
  --text-3xl: 1.875rem;   /* 30px */
  --text-4xl: 2.25rem;    /* 36px */
  
  /* Line Heights */
  --leading-tight: 1.25;
  --leading-normal: 1.5;
  --leading-relaxed: 1.75;
  
  /* Font Weights */
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
}

/* Typography Classes */
.heading-xl {
  font-size: var(--text-4xl);
  font-weight: var(--font-bold);
  line-height: var(--leading-tight);
  color: var(--text-primary);
  letter-spacing: -0.02em;
}

.heading-lg {
  font-size: var(--text-3xl);
  font-weight: var(--font-bold);
  line-height: var(--leading-tight);
  color: var(--text-primary);
  letter-spacing: -0.01em;
}

.heading-md {
  font-size: var(--text-2xl);
  font-weight: var(--font-semibold);
  line-height: var(--leading-tight);
  color: var(--text-primary);
}

.heading-sm {
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  line-height: var(--leading-normal);
  color: var(--text-primary);
}

.body-lg {
  font-size: var(--text-lg);
  font-weight: var(--font-normal);
  line-height: var(--leading-relaxed);
  color: var(--text-secondary);
}

.body-base {
  font-size: var(--text-base);
  font-weight: var(--font-normal);
  line-height: var(--leading-normal);
  color: var(--text-secondary);
}

.body-sm {
  font-size: var(--text-sm);
  font-weight: var(--font-normal);
  line-height: var(--leading-normal);
  color: var(--text-tertiary);
}

.label {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  line-height: var(--leading-tight);
  color: var(--text-primary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* ========================================
   3. SPACING SYSTEM
   ======================================== */
:root {
  --space-0: 0;
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-5: 1.25rem;   /* 20px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px */
  --space-10: 2.5rem;   /* 40px */
  --space-12: 3rem;     /* 48px */
  --space-16: 4rem;     /* 64px */
  --space-20: 5rem;     /* 80px */
}

/* ========================================
   4. SHADOWS & BORDERS
   ======================================== */
:root {
  /* Shadows */
  --shadow-xs: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  --shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  
  /* Border Radius */
  --radius-sm: 0.25rem;   /* 4px */
  --radius-md: 0.375rem;  /* 6px */
  --radius-lg: 0.5rem;    /* 8px */
  --radius-xl: 0.75rem;   /* 12px */
  --radius-2xl: 1rem;     /* 16px */
  --radius-3xl: 1.5rem;   /* 24px */
  --radius-full: 9999px;
  
  /* Borders */
  --border-width: 1px;
  --border-color: var(--gray-200);
}

/* ========================================
   5. BUTTONS
   ======================================== */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-6);
  font-family: var(--font-primary);
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  line-height: var(--leading-tight);
  text-decoration: none;
  border: none;
  border-radius: var(--radius-xl);
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  position: relative;
  overflow: hidden;
}

/* Button Sizes */
.btn-sm {
  padding: var(--space-2) var(--space-4);
  font-size: var(--text-sm);
}

.btn-lg {
  padding: var(--space-4) var(--space-8);
  font-size: var(--text-lg);
}

/* Primary Button */
.btn-primary {
  background: linear-gradient(135deg, var(--primary-600) 0%, var(--secondary-600) 100%);
  color: var(--text-inverse);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(37, 99, 235, 0.4);
}

.btn-primary:active {
  transform: translateY(0);
}

/* Secondary Button */
.btn-secondary {
  background: var(--bg-tertiary);
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
}

.btn-secondary:hover {
  background: var(--gray-200);
  color: var(--text-primary);
}

/* Outline Button */
.btn-outline {
  background: transparent;
  color: var(--primary-600);
  border: 2px solid var(--primary-600);
}

.btn-outline:hover {
  background: var(--primary-50);
}

/* Ghost Button */
.btn-ghost {
  background: transparent;
  color: var(--text-secondary);
  padding: var(--space-2) var(--space-3);
}

.btn-ghost:hover {
  background: var(--gray-100);
  color: var(--text-primary);
}

/* Button States */
.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
}

/* ========================================
   6. FORM ELEMENTS
   ======================================== */
.form-group {
  margin-bottom: var(--space-6);
}

.form-label {
  display: block;
  margin-bottom: var(--space-2);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--text-primary);
}

.form-input {
  width: 100%;
  padding: var(--space-3) var(--space-4);
  font-family: var(--font-primary);
  font-size: var(--text-base);
  color: var(--text-primary);
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  transition: all 0.2s ease;
}

.form-input:focus {
  outline: none;
  border-color: var(--primary-500);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-input-error {
  border-color: var(--error-500);
}

.form-input-error:focus {
  border-color: var(--error-500);
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.form-helper {
  margin-top: var(--space-1);
  font-size: var(--text-sm);
  color: var(--text-tertiary);
}

.form-error {
  margin-top: var(--space-1);
  font-size: var(--text-sm);
  color: var(--error-600);
  display: flex;
  align-items: center;
  gap: var(--space-1);
}

/* Select */
.form-select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L6 6L11 1' stroke='%236B7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right var(--space-3) center;
  padding-right: var(--space-10);
}

/* Checkbox & Radio */
.form-checkbox,
.form-radio {
  appearance: none;
  width: 20px;
  height: 20px;
  border: 2px solid var(--border-color);
  background: var(--bg-primary);
  cursor: pointer;
  position: relative;
  transition: all 0.2s ease;
}

.form-checkbox {
  border-radius: var(--radius-md);
}

.form-radio {
  border-radius: var(--radius-full);
}

.form-checkbox:checked,
.form-radio:checked {
  background: var(--primary-600);
  border-color: var(--primary-600);
}

.form-checkbox:checked::after {
  content: '';
  position: absolute;
  left: 5px;
  top: 2px;
  width: 6px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.form-radio:checked::after {
  content: '';
  position: absolute;
  left: 5px;
  top: 5px;
  width: 8px;
  height: 8px;
  border-radius: var(--radius-full);
  background: white;
}

/* ========================================
   7. CARDS
   ======================================== */
.card {
  background: var(--bg-primary);
  border-radius: var(--radius-2xl);
  box-shadow: var(--shadow-lg);
  overflow: hidden;
  transition: all 0.3s ease;
}

.card:hover {
  box-shadow: var(--shadow-xl);
  transform: translateY(-2px);
}

.card-header {
  padding: var(--space-6);
  border-bottom: 1px solid var(--border-color);
}

.card-body {
  padding: var(--space-6);
}

.card-footer {
  padding: var(--space-6);
  background: var(--bg-secondary);
  border-top: 1px solid var(--border-color);
}

/* Card Variants */
.card-bordered {
  box-shadow: none;
  border: 1px solid var(--border-color);
}

.card-flat {
  box-shadow: none;
  background: var(--bg-secondary);
}

.card-interactive {
  cursor: pointer;
}

.card-interactive:active {
  transform: scale(0.98);
}

/* ========================================
   8. MODALS
   ======================================== */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-4);
}

.modal {
  background: var(--bg-primary);
  border-radius: var(--radius-2xl);
  box-shadow: var(--shadow-2xl);
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  animation: modalSlideIn 0.3s ease;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  padding: var(--space-6);
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-body {
  padding: var(--space-6);
}

.modal-footer {
  padding: var(--space-6);
  border-top: 1px solid var(--border-color);
  display: flex;
  gap: var(--space-3);
  justify-content: flex-end;
}

/* ========================================
   9. ALERTS & NOTIFICATIONS
   ======================================== */
.alert {
  padding: var(--space-4);
  border-radius: var(--radius-xl);
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  margin-bottom: var(--space-4);
}

.alert-icon {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
}

.alert-content {
  flex: 1;
}

.alert-title {
  font-weight: var(--font-semibold);
  margin-bottom: var(--space-1);
}

/* Alert Variants */
.alert-info {
  background: var(--primary-50);
  border: 1px solid var(--primary-200);
  color: var(--primary-800);
}

.alert-success {
  background: var(--success-50);
  border: 1px solid #BBF7D0;
  color: var(--success-700);
}

.alert-warning {
  background: var(--warning-50);
  border: 1px solid #FED7AA;
  color: #92400E;
}

.alert-error {
  background: var(--error-50);
  border: 1px solid #FECACA;
  color: #991B1B;
}

/* Toast Notifications */
.toast {
  position: fixed;
  bottom: var(--space-4);
  right: var(--space-4);
  background: var(--gray-900);
  color: var(--text-inverse);
  padding: var(--space-4);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl);
  display: flex;
  align-items: center;
  gap: var(--space-3);
  animation: toastSlideIn 0.3s ease;
  z-index: 1100;
}

@keyframes toastSlideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* ========================================
   10. NAVIGATION
   ======================================== */
.nav {
  background: var(--bg-primary);
  border-bottom: 1px solid var(--border-color);
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 var(--space-6);
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
}

.nav-logo {
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.nav-menu {
  display: flex;
  align-items: center;
  gap: var(--space-8);
}

.nav-link {
  color: var(--text-secondary);
  text-decoration: none;
  font-weight: var(--font-medium);
  transition: color 0.2s ease;
  position: relative;
}

.nav-link:hover {
  color: var(--primary-600);
}

.nav-link.active {
  color: var(--primary-600);
}

.nav-link.active::after {
  content: '';
  position: absolute;
  bottom: -20px;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--primary-600);
}

/* ========================================
   11. SIDEBAR
   ======================================== */
.sidebar {
  width: 240px;
  height: 100vh;
  background: var(--bg-secondary);
  border-right: 1px solid var(--border-color);
  padding: var(--space-6) 0;
  overflow-y: auto;
}

.sidebar-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-6);
  color: var(--text-secondary);
  text-decoration: none;
  font-weight: var(--font-medium);
  transition: all 0.2s ease;
}

.sidebar-item:hover {
  background: var(--gray-100);
  color: var(--text-primary);
}

.sidebar-item.active {
  background: var(--primary-50);
  color: var(--primary-600);
  border-left: 3px solid var(--primary-600);
}

.sidebar-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.sidebar-divider {
  height: 1px;
  background: var(--border-color);
  margin: var(--space-4) var(--space-6);
}

/* ========================================
   12. PROGRESS INDICATORS
   ======================================== */
.progress-bar {
  width: 100%;
  height: 8px;
  background: var(--gray-200);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--primary-600) 0%, var(--secondary-600) 100%);
  border-radius: var(--radius-full);
  transition: width 0.3s ease;
}

/* Step Progress */
.steps {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
}

.steps::before {
  content: '';
  position: absolute;
  top: 20px;
  left: 40px;
  right: 40px;
  height: 2px;
  background: var(--gray-300);
  z-index: 0;
}

.step {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
}

.step-circle {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-full);
  background: var(--bg-primary);
  border: 2px solid var(--gray-300);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: var(--font-semibold);
  color: var(--text-tertiary);
  transition: all 0.3s ease;
}

.step.active .step-circle {
  background: var(--primary-600);
  border-color: var(--primary-600);
  color: var(--text-inverse);
}

.step.completed .step-circle {
  background: var(--success-500);
  border-color: var(--success-500);
  color: var(--text-inverse);
}

.step-label {
  font-size: var(--text-sm);
  color: var(--text-tertiary);
  text-align: center;
  max-width: 100px;
}

.step.active .step-label {
  color: var(--text-primary);
  font-weight: var(--font-medium);
}

/* ========================================
   13. BADGES
   ======================================== */
.badge {
  display: inline-flex;
  align-items: center;
  padding: var(--space-1) var(--space-3);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  border-radius: var(--radius-full);
  white-space: nowrap;
}

.badge-primary {
  background: var(--primary-100);
  color: var(--primary-700);
}

.badge-secondary {
  background: var(--secondary-100);
  color: var(--secondary-700);
}

.badge-success {
  background: var(--success-50);
  color: var(--success-700);
}

.badge-warning {
  background: var(--warning-50);
  color: #92400E;
}

.badge-error {
  background: var(--error-50);
  color: var(--error-700);
}

.badge-neutral {
  background: var(--gray-100);
  color: var(--gray-700);
}

/* ========================================
   14. TOOLTIPS
   ======================================== */
.tooltip {
  position: relative;
  display: inline-block;
}

.tooltip-content {
  position: absolute;
  bottom: calc(100% + var(--space-2));
  left: 50%;
  transform: translateX(-50%);
  background: var(--gray-900);
  color: var(--text-inverse);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-lg);
  font-size: var(--text-sm);
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s ease;
  z-index: 1000;
}

.tooltip-content::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 6px solid transparent;
  border-top-color: var(--gray-900);
}

.tooltip:hover .tooltip-content {
  opacity: 1;
  visibility: visible;
}

/* ========================================
   15. UTILITY CLASSES
   ======================================== */
/* Display */
.d-none { display: none; }
.d-block { display: block; }
.d-inline-block { display: inline-block; }
.d-flex { display: flex; }
.d-inline-flex { display: inline-flex; }
.d-grid { display: grid; }

/* Flexbox */
.flex-row { flex-direction: row; }
.flex-column { flex-direction: column; }
.flex-wrap { flex-wrap: wrap; }
.justify-start { justify-content: flex-start; }
.justify-center { justify-content: center; }
.justify-end { justify-content: flex-end; }
.justify-between { justify-content: space-between; }
.align-start { align-items: flex-start; }
.align-center { align-items: center; }
.align-end { align-items: flex-end; }
.gap-1 { gap: var(--space-1); }
.gap-2 { gap: var(--space-2); }
.gap-3 { gap: var(--space-3); }
.gap-4 { gap: var(--space-4); }

/* Spacing */
.m-0 { margin: 0; }
.m-1 { margin: var(--space-1); }
.m-2 { margin: var(--space-2); }
.m-3 { margin: var(--space-3); }
.m-4 { margin: var(--space-4); }
.mt-1 { margin-top: var(--space-1); }
.mt-2 { margin-top: var(--space-2); }
.mt-3 { margin-top: var(--space-3); }
.mt-4 { margin-top: var(--space-4); }
.mb-1 { margin-bottom: var(--space-1); }
.mb-2 { margin-bottom: var(--space-2); }
.mb-3 { margin-bottom: var(--space-3); }
.mb-4 { margin-bottom: var(--space-4); }

.p-0 { padding: 0; }
.p-1 { padding: var(--space-1); }
.p-2 { padding: var(--space-2); }
.p-3 { padding: var(--space-3); }
.p-4 { padding: var(--space-4); }

/* Text */
.text-left { text-align: left; }
.text-center { text-align: center; }
.text-right { text-align: right; }
.text-primary { color: var(--text-primary); }
.text-secondary { color: var(--text-secondary); }
.text-tertiary { color: var(--text-tertiary); }
.text-success { color: var(--success-600); }
.text-warning { color: var(--warning-600); }
.text-error { color: var(--error-600); }

/* Background */
.bg-primary { background-color: var(--bg-primary); }
.bg-secondary { background-color: var(--bg-secondary); }
.bg-tertiary { background-color: var(--bg-tertiary); }

/* Borders */
.border { border: 1px solid var(--border-color); }
.border-top { border-top: 1px solid var(--border-color); }
.border-bottom { border-bottom: 1px solid var(--border-color); }
.border-left { border-left: 1px solid var(--border-color); }
.border-right { border-right: 1px solid var(--border-color); }
.rounded { border-radius: var(--radius-lg); }
.rounded-lg { border-radius: var(--radius-xl); }
.rounded-full { border-radius: var(--radius-full); }

/* Width */
.w-full { width: 100%; }
.w-auto { width: auto; }

/* Height */
.h-full { height: 100%; }
.h-auto { height: auto; }

/* Animations */
.transition-all {
  transition: all 0.3s ease;
}

.hover-scale:hover {
  transform: scale(1.05);
}

.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

/* Loading Spinner */
@keyframes spin {
  to { transform: rotate(360deg); }
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--gray-200);
  border-top-color: var(--primary-600);
  border-radius: var(--radius-full);
  animation: spin 1s linear infinite;
}

/* ========================================
   16. RESPONSIVE UTILITIES
   ======================================== */
@media (max-width: 640px) {
  .sm-hide { display: none; }
  .sm-text-center { text-align: center; }
  .sm-full-width { width: 100%; }
}

@media (max-width: 768px) {
  .md-hide { display: none; }
  .md-text-center { text-align: center; }
  .md-full-width { width: 100%; }
}

@media (max-width: 1024px) {
  .lg-hide { display: none; }
  .lg-text-center { text-align: center; }
  .lg-full-width { width: 100%; }
}

/* ========================================
   17. CUSTOM IRS TAX RELIEF COMPONENTS
   ======================================== */

/* Assessment Progress Card */
.assessment-card {
  background: linear-gradient(135deg, var(--primary-50) 0%, var(--secondary-50) 100%);
  border: 1px solid var(--primary-200);
  border-radius: var(--radius-2xl);
  padding: var(--space-6);
  position: relative;
  overflow: hidden;
}

.assessment-card::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255,255,255,0.5) 0%, transparent 70%);
  transform: rotate(45deg);
}

/* Tax Savings Badge */
.savings-badge {
  background: linear-gradient(135deg, var(--success-500) 0%, var(--success-600) 100%);
  color: var(--text-inverse);
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-xl);
  font-weight: var(--font-bold);
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
}

/* Status Timeline */
.timeline-item {
  position: relative;
  padding-left: var(--space-10);
  padding-bottom: var(--space-8);
}

.timeline-item::before {
  content: '';
  position: absolute;
  left: 15px;
  top: 30px;
  bottom: 0;
  width: 2px;
  background: var(--gray-300);
}

.timeline-item:last-child::before {
  display: none;
}

.timeline-dot {
  position: absolute;
  left: 0;
  top: 0;
  width: 32px;
  height: 32px;
  border-radius: var(--radius-full);
  background: var(--bg-primary);
  border: 2px solid var(--gray-300);
  display: flex;
  align-items: center;
  justify-content: center;
}

.timeline-item.completed .timeline-dot {
  background: var(--success-500);
  border-color: var(--success-500);
  color: var(--text-inverse);
}

.timeline-item.active .timeline-dot {
  background: var(--primary-600);
  border-color: var(--primary-600);
  color: var(--text-inverse);
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.2);
}