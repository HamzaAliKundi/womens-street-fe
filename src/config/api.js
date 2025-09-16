// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://api.womenstreet.shop/api/v1',
  ENDPOINTS: {
    PRODUCTS: '/products',
    CART: '/cart',
    ORDER: '/order',
    AUTH: '/auth'
  },
  TIMEOUT: 10000, // 10 seconds
  RETRY_ATTEMPTS: 3
};

// Helper function to build full URL
export const buildApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Environment check
export const isDevelopment = import.meta.env.DEV;
export const isProduction = import.meta.env.PROD;

// App configuration
export const APP_CONFIG = {
  NAME: import.meta.env.VITE_APP_NAME || 'Women Street',
  VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  ENABLE_DEBUG: import.meta.env.VITE_ENABLE_DEBUG === 'true'
};

// Validation
if (!API_CONFIG.BASE_URL) {
  console.error('❌ VITE_API_BASE_URL is not defined in .env file');
}

// Debug logging in development
if (isDevelopment && APP_CONFIG.ENABLE_DEBUG) {
  console.log('🔧 API Configuration:', API_CONFIG);
  console.log('⚙️ App Configuration:', APP_CONFIG);
}
