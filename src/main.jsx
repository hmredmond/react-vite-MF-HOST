import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './assets/autogenerated.css';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './components/Routes';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
     <BrowserRouter>
    <AppRoutes/>
    </BrowserRouter>
  </React.StrictMode>
);
