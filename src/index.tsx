import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ErrorBoundary } from './components/ErrorBoundary';

// Global error handling for unhandled promise rejections and runtime errors
window.addEventListener('unhandledrejection', (event) => {
  const reason = event.reason?.toString() || '';

  // Filter out browser extension related errors
  const isExtensionError = reason.includes('Extension context invalidated') ||
                          reason.includes('message channel closed') ||
                          reason.includes('asynchronous response') ||
                          reason.includes('Extension receiver') ||
                          reason.includes('Could not establish connection');

  if (isExtensionError) {
    // Silently ignore extension-related errors - these are harmless
    event.preventDefault();
    return;
  }

  // Only log other errors in development
  if (process.env.NODE_ENV === 'development') {
    console.warn('Unhandled promise rejection:', event.reason);
  }
  event.preventDefault();
});

window.addEventListener('error', (event) => {
  const errorMessage = event.message || '';
  const errorStack = event.error?.stack || '';

  // Filter out common browser extension and browser API errors that don't affect our app
  const isExtensionError = errorMessage.includes('Extension context invalidated') ||
                          errorMessage.includes('message channel closed') ||
                          errorMessage.includes('asynchronous response') ||
                          errorMessage.includes('Extension receiver') ||
                          errorMessage.includes('Could not establish connection') ||
                          errorMessage.includes('runtime.lastError') ||
                          errorMessage.includes('chrome-extension://') ||
                          errorStack.includes('chrome-extension://');

  if (isExtensionError) {
    // Silently ignore extension-related errors - these are harmless
    event.preventDefault();
    return;
  }

  // Log other errors in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Global error:', event.error);
  }
});

// Override console methods to filter out extension noise in production
if (process.env.NODE_ENV === 'production') {
  const originalWarn = console.warn;
  const originalError = console.error;

  console.warn = (...args) => {
    const message = args.join(' ');
    if (!message.includes('runtime.lastError') &&
        !message.includes('message channel closed') &&
        !message.includes('asynchronous response') &&
        !message.includes('chrome-extension://')) {
      originalWarn.apply(console, args);
    }
  };

  console.error = (...args) => {
    const message = args.join(' ');
    if (!message.includes('runtime.lastError') &&
        !message.includes('message channel closed') &&
        !message.includes('asynchronous response') &&
        !message.includes('chrome-extension://')) {
      originalError.apply(console, args);
    }
  };
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);

// Hide the loading screen once React has mounted
const hideLoader = () => {
  const loader = document.getElementById('app-loader');
  if (loader) {
    loader.style.transition = 'opacity 0.5s ease-out';
    loader.style.opacity = '0';
    setTimeout(() => {
      loader.style.display = 'none';
    }, 500);
  }
};

// Hide loader immediately when DOM is ready, or wait for React to mount
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', hideLoader);
} else {
  // DOM already loaded, hide immediately
  setTimeout(hideLoader, 100);
}