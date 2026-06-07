import React from 'react';
import ReactDOM from 'react-dom/client';
import { InvoiceProvider } from './context/InvoiceContext';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <InvoiceProvider>
      <App />
    </InvoiceProvider>
  </React.StrictMode>
);
