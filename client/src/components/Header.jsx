//importamos los componentes
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

//importamos la navegación
import { NavLink } from 'react-router-dom';

// importamos estilo
import '../index.css';

const { VITE_API_URL, VITE_DEFAULT_PROFILE_PIC } = import.meta.env;

const Header = () => {
    const { authLogout, authUser } = useContext(AuthContext);

    return (
        <header>
            <h1>
                <NavLink to="/">Pedidos pendientes</NavLink>
            </h1>
            {authUser && (
                <article>
                    <p>@{authUser.username}</p>
                    <img
                        src={
                            authUser?.avatar
                                ? `${VITE_API_URL}/${authUser?.avatar}`
                                : VITE_DEFAULT_PROFILE_PIC
                        }
                        alt="Avatar del usuario"
                        width="50px"
                    />
                </article>
            )}

            {/* botones de navegación */}
            <nav>
                <ul>
                    {/* dependiendo de si estamos logueados o no mostraremos unos botones u otros */}
                    {authUser ? (
                        /* estamos logueados. Posibles opciones (en cabecera)
                                            - ver perfil
                                            - Logout
                                            - (más adelante: dependiendo del rol: Gestión)*/
                        <>
                            {authUser.role === 'administrador' && (
                                <>
                                    <li>
                                        <NavLink to="/addUser">
                                            Añadir usuario
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/DeleteUser">
                                            Eliminar usuario
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/allUsers">
                                            Ver todos Los Usuarios
                                        </NavLink>
                                    </li>
                                </>
                            )}
                            {authUser.role === 'empleado' && (
                                <li>
                                    <NavLink to="/allUsers">
                                        Ver todos Los Usuarios
                                    </NavLink>
                                </li>
                            )}
                            <li>
                                <NavLink to="/user">Ver perfil</NavLink>
                            </li>
                            <li>
                                <button
                                    onClick={() => {
                                        authLogout();
                                    }}
                                >
                                    Desconexion
                                </button>
                            </li>
                        </>
                    ) : (
                        <li>
                            <NavLink to="/login">Login</NavLink>
                        </li>
                    )}
                </ul>
            </nav>
        </header>
    );
};

export default Header;
