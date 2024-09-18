//importamos hooks y contexto
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../contexts/AuthContext';

// importamos componentes
import { Navigate } from 'react-router-dom';

// importamos función para adornar mensajes
import toast from 'react-hot-toast';

// importamos la ruta del servidor
const { VITE_API_URL, VITE_PASS_ELIMINAR_USUARIO, VITE_DEFAULT_PROFILE_PIC } =
    import.meta.env;
const UserProfilePage = () => {
    // Variable de contexto que contiene los datos del usuario
    const { authUser, updateUser, authLogout, authUserLoading } =
        useContext(AuthContext);

    // Variable de entorno para saber si queremos actualizar los datos del usuario
    const [actualizar, setActualizar] = useState(false);

    //variables de entorno para cambiar los valores del perfil
    const [username, setUsername] = useState(authUser?.username || '');
    const [email, setEmail] = useState(authUser?.email || '');
    const [password, setPassword] = useState('');
    const [repeatedPassword, setRepeatedPassword] = useState('');
    const [avatar, setAvatar] = useState(null);

    useEffect(() => {
        if (authUser) {
            setUsername(authUser.username);
            setEmail(authUser.email);
        }
    }, [authUser]);

    const handleUserDataChange = async (e) => {
        e.preventDefault();

        const user = { id: authUser.id };
        if (password) {
            if (password !== repeatedPassword) {
                throw new Error(
                    'Las contraseñas no coinciden. Operación cancelada'
                );
            }
            if (password.length) user.password = password;
        }
        if (!confirm('¿Estás seguro que deseas cambiar los datos?')) return;

        if (username.length) user.username = username;
        if (email.length) user.email = email;
        await updateUser(user, avatar);
    };
    const handleDeleteUser = async (e) => {
        e.preventDefault();
        if (!confirm('¿Estás seguro que deseas borrar el usuario?')) return;
        const user = {
            id: authUser.id,
            password: VITE_PASS_ELIMINAR_USUARIO,
        };
        await updateUser(user, avatar);
        authLogout();
        toast.success('Usuario Eliminado', { id: 'userProfile' });
    };

    ////////////////////////////////////////////////////////////////
    //////////////// A partir de aquí el return/////////////////////
    ////////////////////////////////////////////////////////////////
    if (authUserLoading) return <h2>Loading...</h2>;
    if (!authUser) return <Navigate to="/login" />;

    return (
        <main>
            <h2>Perfil</h2>
            <img
                src={
                    authUser?.avatar
                        ? `${VITE_API_URL}/${authUser?.avatar}`
                        : VITE_DEFAULT_PROFILE_PIC
                }
                alt="Avatar del usuario"
                width="150px"
            />
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
                    <label htmlFor="repeatedPassword">Avatar</label>
                    <input
                        type="File"
                        id="Avatar"
                        accept="image/jpeg, image/png"
                        onChange={(e) => {
                            setAvatar(e.target.files[0]);
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
