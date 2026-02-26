import * as Sentry from '@sentry/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import App from './App.jsx';
import AuthProvider from './context/AuthContext.jsx';
import './index.css';

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_URL,
  enabled: import.meta.env.MODE !== "development",
  environment: import.meta.env.MODE,
  // 'development' | 'staging' | 'production'

  sendDefaultPii: true,

  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],

  tracesSampleRate: 1.0,

  tracePropagationTargets: [
    'localhost',
    'dc-plaground-backend.onrender.com',
    'dc-central-api-v2.onrender.com',
  ],

  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,

  enableLogs: true,
});

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
);
