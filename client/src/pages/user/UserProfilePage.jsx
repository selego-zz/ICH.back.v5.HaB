//importamos hooks y contexto
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../contexts/AuthContext';

// importamos componentes
import { useNavigate } from 'react-router-dom';

// importamos función para adornar mensajes
import toast from 'react-hot-toast';

// importamos la ruta del servidor
const { VITE_API_URL, VITE_PASS_ELIMINAR_USUARIO } = import.meta.env;
const UserProfilePage = () => {
    // Variable de contexto que contiene los datos del usuario
    const { authUser, setAuthUser, authToken, authLogout, authUserLoading } =
        useContext(AuthContext);

    const navigate = useNavigate();

    // Variable de entorno para saber si queremos actualizar los datos del usuario
    const [actualizar, setActualizar] = useState(false);

    //variables de entorno para cambiar los valores del perfil
    const [username, setUsername] = useState(authUser?.username || '');
    const [email, setEmail] = useState(authUser?.email || '');
    const [password, setPassword] = useState('');
    const [repeatedPassword, setRepeatedPassword] = useState('');

    useEffect(() => {
        if (authUser) {
            setUsername(authUser.username);
            setEmail(authUser.email);
        }
    }, [authUser]);

    const handleUserDataChange = async (e) => {
        try {
            e.preventDefault();
            const user = {
                username,
                email,
            };
            if (password) {
                if (password !== repeatedPassword) {
                    throw new Error(
                        'Las contraseñas no coinciden. Operación cancelada'
                    );
                }
                if (password.length > 0) user.password = password;
            }
            if (!confirm('¿Estás seguro que deseas cambiar los datos?')) return;
            const res = await fetch(
                `${VITE_API_URL}/api/users/${authUser.id}`,
                {
                    method: 'put',
                    headers: {
                        Authorization: authToken,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(user),
                }
            );

            // obtenemos la respuesta
            const body = await res.json();

            if (body.status === 'error') throw new Error(body.message);
            // en este punto sabemos que no ha habido un error

            const newUser = { ...authUser };
            newUser.username = username;
            newUser.email = email;
            setAuthUser(newUser);
            toast.success(body.message, { id: 'userProfile' });
        } catch (err) {
            toast.error(err.message, { id: 'userProfile' });
        }
    };
    const handleDeleteUser = async (e) => {
        try {
            e.preventDefault();
            if (!confirm('¿Estás seguro que deseas borrar el usuario?')) return;
            const user = {
                password: VITE_PASS_ELIMINAR_USUARIO,
            };
            const res = await fetch(
                `${VITE_API_URL}/api/users/${authUser.id}`,
                {
                    method: 'put',
                    headers: {
                        Authorization: authToken,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(user),
                }
            );

            // obtenemos la respuesta
            const body = await res.json();

            if (body.status === 'error') throw new Error(body.message);
            // en este punto sabemos que no ha habido un error

            authLogout();
            toast.success('Usuario Eliminado', { id: 'userProfile' });
        } catch (err) {
            toast.error(err.message, { id: 'userProfile' });
        }
    };

    ////////////////////////////////////////////////////////////////
    //////////////// A partir de aquí el return/////////////////////
    ////////////////////////////////////////////////////////////////
    if (authUserLoading) return <h2>Loading...</h2>;
    if (!authUser) navigate('/');
    return (
        <main>
            <h2>Perfil</h2>
            <dl>
                <dt>Nombre Fiscal:</dt> <dd>{authUser?.username}</dd>
                <dt>Correo electrónico:</dt> <dd>{authUser?.email}</dd>
            </dl>
            {!actualizar && (
                <button
                    onClick={() => {
                        setActualizar(true);
                    }}
                >
                    Actualizar datos
                </button>
            )}
            {actualizar && (
                <button
                    onClick={() => {
                        setActualizar(false);
                    }}
                >
                    Cancelar
                </button>
            )}
            {actualizar && (
                <form onSubmit={handleUserDataChange}>
                    <label htmlFor="username">Nombre Fiscal</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => {
                            setUsername(e.target.value);
                        }}
                    />
                    <label htmlFor="email">Correo electrónico</label>
                    <input
                        type="text"
                        id="email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                        }}
                    />
                    <label htmlFor="password">Contraseña</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                        }}
                    />
                    <label htmlFor="repeatedPassword">
                        Repite la contraseña
                    </label>
                    <input
                        type="password"
                        id="repeatedPassword"
                        value={repeatedPassword}
                        onChange={(e) => {
                            setRepeatedPassword(e.target.value);
                        }}
                    />
                    <button>Aceptar</button>
                </form>
            )}
            <aside>
                <button onClick={handleDeleteUser}>Borrar usuario</button>
            </aside>
        </main>
    );
};
export default UserProfilePage;
