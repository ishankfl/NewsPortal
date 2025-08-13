import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { CategoriesProvider } from './providers/CategoriesProvider';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <CategoriesProvider>

        <BrowserRouter>
          <App />
        </BrowserRouter>
      </CategoriesProvider>

    </QueryClientProvider>
  </React.StrictMode>
);
