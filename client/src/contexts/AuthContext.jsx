//importamos las prop-types
import PropTypes from 'prop-types';

// importamos la función que crea un contexto, y los hooks
import { createContext, useState, useEffect } from 'react';

import toast from 'react-hot-toast';

//importamos la dirección donde guardar el token en local storage, y la de la API para hacer fetch del usuario
const { VITE_AUTH_TOKEN, VITE_API_URL } = import.meta.env;

/**
 * Contexto de autenticación
 * @description - Este contexto se crea para guardar, recuperar y eliminar el token, y los datos del usuario
 * @type {React.Context}
 */
const AuthContext = createContext(null);

/**
 * Proveedor de autenticación (proveedor de token) que envuelve la aplicación y maneja el estado del token.
 * @param {Object} props - Las propiedades del componente.
 * @param {React.ReactNode} props.children - Los componentes hijos que serán envueltos por el proveedor.
 * @returns {JSX.Element} AuthContext.Provider - El proveedor de autenticación, que exportará las props authToken, authLogin, authLogout
 */
const AuthProvider = ({ children }) => {
    //declaramos la variable que manejará el token en el state.
    //intenamos cargar sus datos del Local Storage. Si no fuera posible, inicializamos a null
    const [authToken, setAuthToken] = useState(
        localStorage.getItem(VITE_AUTH_TOKEN) || null
    );

    /**
     * variable que representará al usuario.
     * @description - variable que representará al usuario, guardará los datos del usuario en el state
     * @returns {Object} user - Variable de estado que representa al usuario.
     * @returns {number} user.id - Id del usuario.
     * @returns {string} user.username - Nombre de usuario del usuario.
     * @returns {string} user.email - Email del usuario.
     * @returns {string} user.role - Rol del usuario.
     * @returns {Function} setUser - Función para cambiar la variable de estado que representa al usuario.
     * @returns {boolean} userLoading - Variable para controlar si el usuario se encuentra en proceso de carga desde el servidor.
     */
    const [authUser, setAuthUser] = useState(null);

    //variable para saber si estamos cargando el usuario
    const [authUserLoading, setAuthUserLoading] = useState(true);

    //Queremos que de forma automática, cada vez que cambie el token (o al iniciar, si existe) se cargue toda la información del usuario. Como lo necesitamos cada vez que cambie el token, usamo useEffect
    useEffect(() => {
        /**
         * Función que obtiene los datos del usuario.
         * @description - Realiza una petición al servidor, para que valide el token de autenticación. En caso de que la validación sea positiva, guarda en la variable de estado user los datos de usuario que devuelve el servidor
         * @async
         */
        const fetchUser = async () => {
            try {
                setAuthUserLoading(true);

                //hacemos una llamada al servidor para que nos dé los datos del usuario
                const res = await fetch(`${VITE_API_URL}/api/users`, {
                    headers: { Authorization: authToken },
                });

                const body = await res.json();

                if (body.status === 'error') throw new Error(body.message);
                //en este punto hemos autenticado, y tenemos la información en body.data.user - la metemos en el state

                setAuthUser(body.data);
            } catch (err) {
                //si el token es inválido, lo eliminamos
                if (err.message === 'token inválido') authLogout;

                //si hay un error eliminamos el usuario
                setAuthUser(null);
                toast.error(err.message, { id: 'userInfo' });
            } finally {
                setAuthUserLoading(false);
            }
        };
        //hasta aqui no se ha ejecutado nada, solo hemos definido la función fetch.
        //si existe token, hacemos fetch, sino, vaciamos usuario, y dejamos de cargar
        if (authToken) fetchUser();
        else {
            //ponemos a null al usuario
            setAuthUser(null);
            //dejamos de indicar quee estamos esperando el fetch: loading = false
            setAuthUserLoading(false);
        }
    }, [authToken]);

    /**
     * Función que guarda el token.
     * @description - Guarda el token de autenticación en el State, y en el local Storage
     * @param {string} token - El token de autenticación.
     */
    const authLogin = (token) => {
        //guardamos el token en el state
        setAuthToken(token);
        //guardamos el token en el local storage
        localStorage.setItem(VITE_AUTH_TOKEN, token);
    };

    /**
     * Función que elimina el token.
     * @description - Elimina el token de autenticación en el State, y en el local Storage
     */
    const authLogout = () => {
        //eliminamos el token en el state
        setAuthToken(null);
        //eliminamos el token en el local storage
        localStorage.removeItem(VITE_AUTH_TOKEN);
    };

    // devolvemos el proveedor de autenticación, que tenemos que poner en main, todo lo que envuelva tendrá acceso a este contexto
    return (
        <AuthContext.Provider
            value={{
                authToken,
                authLogin,
                authLogout,
                authUser,
                setAuthUser,
                authUserLoading,
                setAuthUserLoading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

//validamos las props
AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export { AuthContext, AuthProvider };
