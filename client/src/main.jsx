import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

//importamos los estilos
import './index.css';

//importamos el proveedor del contexto para manejar el token de usuario
import { AuthProvider } from './contexts/AuthContext';

//importamos la paginación
import { BrowserRouter } from 'react-router-dom';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <AuthProvider>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </AuthProvider>
    </StrictMode>
);
