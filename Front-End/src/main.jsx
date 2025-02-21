import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App.jsx';
import { ChatProvider } from './context/ChatContext';
import './index.css';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter>
            <ChatProvider>
                <Toaster position="top-center" />
                <App />
            </ChatProvider>
        </BrowserRouter>
    </StrictMode>
);
