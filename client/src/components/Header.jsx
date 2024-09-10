//importamos los hooks
import useUser from '../hooks/useUser';

//importamos los componentes
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

//importamos la navegación
import { NavLink } from 'react-router-dom';

const Header = () => {
    const { user } = useUser();
    const { authLogout } = useContext(AuthContext);

    return (
        <header>
            <h1>Pedidos pendientes</h1>
            {user && <p>@user.username</p>}

            {/* botones de navegación */}
            <nav>
                <ul>
                    {/* dependiendo de si estamos logueados o no mostraremos unos botones u otros */}
                    {user ? (
                        /* estamos logueados. Posibles opciones (en cabecera)
                                            - ver perfil
                                            - Logout
                                            - (más adelante: dependiendo del rol: Gestión)*/
                        <>
                            <li>
                                <NavLink to="/users/profile">
                                    Ver perfil
                                </NavLink>
                            </li>
                            <li>
                                <button
                                    onClick={() => {
                                        authLogout();
                                    }}
                                ></button>
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
