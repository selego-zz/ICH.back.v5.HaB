//importamos los componentes

//para el enrutado
import { Routes, Route } from 'react-router-dom';
//para renderizar mensajes 'bonitos'
import { Toaster } from 'react-hot-toast';

// componentes personalizados
import Footer from './components/footer';
import Header from './components/header';

// importamos páginas
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';

// importamos estilo
import './index.css';

function App() {
    return (
        <>
            {/* Este componente se encarga de renderizar los mensajes que queramos mostrar con react-hot-toast */}
            <Toaster
                position="top-center"
                toastOptions={{
                    duration: 3000,
                }}
            />

            <Header />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
            <Footer />
        </>
    );
}

export default App;
