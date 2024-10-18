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
import NotFoundPage from './pages/NotFoundPage';
// páginas de usuarios
import LoginPage from './pages/user/LoginPage';
import RecoverPassPage from './pages/user/RecoverPassPage';
import UserProfilePage from './pages/user/UserProfilePage';
import UsersListPage from './pages/user/UsersListPage';

// importamos estilo
import './index.css';
import ResetPassPage from './pages/user/ResetPassPage';

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
                {/* Páginas de usuario */}
                <Route path="/addUser" element={<UsersListPage />} />
                <Route path="/allUsers" element={<UsersListPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/recoverPass" element={<RecoverPassPage />} />
                <Route path="/recoverPass/:code" element={<ResetPassPage />} />
                <Route path="/DeleteUser" element={<UsersListPage />} />
                <Route path="/user" element={<UserProfilePage />} />
                {/* Not Found */}
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
            <Footer />
        </>
    );
}

export default App;
