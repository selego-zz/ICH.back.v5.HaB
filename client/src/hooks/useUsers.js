//importamos los hook
import { useContext, useEffect, useState } from 'react';

//importamos toast
import toast from 'react-hot-toast';
import { AuthContext } from '../contexts/AuthContext';

//importamos la ruta del servidor
const { VITE_API_URL } = import.meta.env;

const useUsers = () => {
    const [usersLoading, setUsersLoading] = useState(false);
    /**
     * La variable de estado `users` tendrá los siguientes campos:
     * @type {Array<{
     *   id: number,
     *   username: string,
     *   password: string,
     *   email: string,
     *   code: string,
     *   role: 'administrador' | 'empleado' | 'cliente' | 'comercial',
     *   avatar: string,
     *   createdAt: string,
     *   modifiedAt: string
     * }>}
     */
    const [users, setUsers] = useState(null);

    const { authToken } = useContext(AuthContext);

    useEffect(() => {
        /**
         * Función solicita a la API la la información de todos los usuarios.
         * @description - Solicita a la API la información de todos los usuarios, y la almacena en la variable de estado users .
         */
        const getUsers = async () => {
            try {
                setUsersLoading(true);
                //tomamos la información de cabecera
                const res = await fetch(`${VITE_API_URL}/api/users/all`, {
                    headers: {
                        Authorization: authToken,
                    },
                });
                //la convertimos en json
                const body = await res.json();

                //comprobamos la respuesta
                if (body.status === 'error') throw new Error(body.error);

                //en este punto sabemos que es correcta: la grabamos en users
                setUsers(body.data);
            } catch (err) {
                toast.error(err.message);
            } finally {
                setUsersLoading(false);
            }
        };
        getUsers();
    }, [authToken]);

    /**
     * Función solicita a la API la inserión de un usuario.
     * @param {Object} newUser - Json con los datos del nuevo usuario
     * @param {string} newUser.username - Nombre del usuario
     * @param {string} newUser.password - Password del usuario en texto plano
     * @param {string} newUser.email - Correo electrónico del usuario
     * @param {string} [newUser.code] - Código del cliente/comercial/empleado. (Opcional)
     * @param {string} [newUser.role] - El rol del usuario. (Opcional). Valores posibles: 'administrador', 'empleado', 'cliente', 'comercial'. Valor por defecto: 'cliente'.
     * @description - Función solicita a la API la inserción de un usuario, y guarda la respuestaen users
     */
    const addUser = async (newUser) => {
        //no pongo try para que se capture en quien lo llama
        const res = await fetch(`${VITE_API_URL}/api/users/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: authToken,
            },
            body: JSON.stringify(newUser),
        });
        //la convertimos en json
        const body = await res.json();

        //comprobamos la respuesta
        if (body.status === 'error') throw new Error(body.message);

        //en este punto sabemos que es correcta. Añadimos el usuario de body (que está más completo) a users
        setUsers([...users, body.data]);
    };

    /**
     * Función elimina de la API la la información de un usuario.
     * @param {number} id - id del registro a eliminar
     * @description - Elimina de la API y de las variables de estado la información del usuairo con la id suministrada.
     */
    const deleteUser = async (id) => {
        try {
            const res = await fetch(`${VITE_API_URL}/api/users/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: authToken,
                },
            });
            //la convertimos en json
            const body = await res.json();

            //comprobamos la respuesta
            if (body.status === 'error') throw new Error(body.error);

            //en este punto sabemos que es no hay error, pero puede que no se haya borrado nada. comprobamos la respuesta:
            setUsers(users.filter((user) => user.id != id));
        } catch (err) {
            toast.error(err.message);
        }
    };

    return { users, usersLoading, addUser, deleteUser };
};

export default useUsers;
