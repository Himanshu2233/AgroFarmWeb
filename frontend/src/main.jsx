import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { AuthProvider, ToastProvider } from './contexts';
import { ConfirmProvider } from './components';

ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <ToastProvider>
      <ConfirmProvider>
        <App />
      </ConfirmProvider>
    </ToastProvider>
  </AuthProvider>
);
