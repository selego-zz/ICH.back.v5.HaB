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
import AddUserPage from './pages/user/AddUserPage';
import LoginPage from './pages/user/LoginPage';
import RemoveUserPage from './pages/user/RemoveUserPage';
import UserProfilePage from './pages/user/UserProfilePage';
import UsersListPage from './pages/user/UsersListPage';

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

                {/* Páginas de usuario */}
                <Route path="/addUser" element={<AddUserPage />} />
                <Route path="/allUsers" element={<UsersListPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/removeUser" element={<RemoveUserPage />} />
                <Route path="/user" element={<UserProfilePage />} />

                {/* Not Found */}
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
            <Footer />
        </>
    );
}

export default App;
