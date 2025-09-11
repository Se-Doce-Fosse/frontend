import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { Footer, NavBar } from '@components';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <NavBar />
    <App />
    <Footer />
  </StrictMode>
);
