//importamos los hooks
import { useContext, useEffect, useState } from 'react';

//importamos el contexto
import { AuthContext } from '../contexts/AuthContext';

//importamos toast para mostrar unos mensajes más visuales
import toast from 'react-hot-toast';

//importamos la dirección del servidor
const { VITE_API_URL } = import.meta.env;

/**
 * Hook personalizado para gestionar la información del usuario.
 * @description - Este Hook personalizado se ha creado para gestionar todo lo relativo al usuario. Retorna un objeto con el usuario, funciones para actualizar el usuario y el estado de carga.
 * @returns {Object} user - Variable de estado que representa al usuario.
 * @returns {number} user.id - Id del usuario.
 * @returns {string} user.username - Nombre de usuario del usuario.
 * @returns {string} user.email - Email del usuario.
 * @returns {string} user.role - Rol del usuario.
 * @returns {Function} setUser - Función para cambiar la variable de estado que representa al usuario.
 * @returns {boolean} userLoading - Variable para controlar si el usuario se encuentra en proceso de carga desde el servidor.
 */
const useUser = () => {
    //variable que representará al usuario, guardará los datos del usuario en el state
    const [user, setUser] = useState(null);

    //variable para saber si estamos cargando el usuario
    const [userLoading, setUserLoading] = useState(false);

    // contexto de autenticación, si el token es inválido lo borramos
    const { authToken, authLogout } = useContext(AuthContext);

    //Queremos que de forma automática, cada vez que cambie el token (o al iniciar, si existe) se cargue toda la información del usuario. Como lo necesitamos cada vez que cambie el token, usamo useEffect
    useEffect(() => {
        /**
         * Función que obtiene los datos del usuario.
         * @description - Realiza una petición al servidor, para que valide el token de autenticación. En caso de que la validación sea positiva, guarda en la variable de estado user los datos de usuario que devuelve el servidor
         * @async
         */
        const fetchUser = async () => {
            try {
                setUserLoading(true);

                //hacemos una llamada al servidor para que nos dé los datos del usuario
                const res = await fetch(`${VITE_API_URL}/api/users`, {
                    headers: { Authorization: authToken },
                });

                const body = await res.json();

                if (body.status === 'error') throw new Error(body.message);
                //en este punto hemos autenticado, y tenemos la información en body.data.user - la metemos en el state
                setUser(body.data.user);
            } catch (err) {
                //si el token es inválido, lo eliminamos
                if (err.message === 'token inválido') authLogout();

                //si hay un error eliminamos el usuario
                setUser(null);
                toast.error(err.message, { id: 'userInfo' });
            } finally {
                setUserLoading(false);
            }
        };
        //hasta aqui no se ha ejecutado nada, solo hemos definido la función fetch.
        //si existe token, hacemos fetch, sino, vaciamos usuario, y dejamos de cargar
        if (authToken) fetchUser();
        else {
            //ponemos a null al usuario
            setUser(null);
            //dejamos de indicar quee estamos esperando el fetch: loading = false
            setUserLoading(false);
        }
    }, [authToken, authLogout]);

    return { user, setUser, userLoading };
};

export default useUser;
