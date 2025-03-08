import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter  } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <HashRouter >
                <Toaster position="top-center" />
                <App />
        </HashRouter >
    </StrictMode>
);
