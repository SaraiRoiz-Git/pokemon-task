import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import './index.css';
import { CACHE_STALE_TIME, CACHE_GC_TIME, QUERY_RETRY_COUNT } from './config/constants';

const queryClient = new QueryClient({//create a query client to manage the data fetching and caching
  defaultOptions: {
    queries: {
      staleTime: CACHE_STALE_TIME,
      gcTime: CACHE_GC_TIME,
      retry: QUERY_RETRY_COUNT,
      refetchOnWindowFocus: false,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);
