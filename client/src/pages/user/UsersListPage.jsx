//importamos los componentes
import { useNavigate } from 'react-router-dom';

//importamos los hooks
import useUsers from '../../hooks/useUsers';

//importamos los contextos
import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';

//importamos los formularios
import AddUserForm from '../../forms/AddUserForm';
import DeleteUserForm from '../../forms/DeleteUserForm';

const { VITE_DEFAULT_PROFILE_PIC } = import.meta.env;

const UsersListPage = () => {
    const { users, usersLoading, addUser, deleteUser } = useUsers();
    const { authUser } = useContext(AuthContext);
    const navigate = useNavigate();

    if (usersLoading) return <h2>Loading...</h2>;
    else if (!authUser) navigate('/'); //evito que se pueda dar el caso de no tener un usuario, pero por que se esté cargando
    if (authUser?.role !== 'administrador' && authUser?.role === 'empleado')
        navigate('/');

    return (
        <main>
            <h2>Usuarios Registrados:</h2>
            <article id="userList">
                <table>
                    <tr>
                        <th>Avatar</th>
                        <th>ID</th>
                        <th>Nombre de usuario</th>
                        <th>Correo Electrónico</th>
                        <th>Código</th>
                        <th>Tipo</th>
                        <th>Modificado en</th>
                    </tr>
                    {users?.map((user) => (
                        <tr key={user.id}>
                            <td>
                                <img
                                    src={
                                        user.avatar
                                            ? user.avatar
                                            : VITE_DEFAULT_PROFILE_PIC
                                    }
                                    alt="User Avatar"
                                    width={75}
                                />
                            </td>
                            <td>{user.id}</td>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td>{user.code ? user.code : '-'}</td>
                            <td>{user.role}</td>
                            <td>{user.modifiedAt}</td>
                        </tr>
                    ))}
                </table>
            </article>
            {authUser.role === 'administrador' && (
                <AddUserForm addUser={addUser} />
            )}
            {authUser.role === 'administrador' && (
                <DeleteUserForm users={users} deleteUser={deleteUser} />
            )}
        </main>
    );
};

export default UsersListPage;

/* return con lista, por comodidad por ahora lo dejaré como tabla
    return (
        <main>
            <h2>Usuarios Registrados:</h2>
            <article id="userList">
                <ul>
                    <td>
                        <ul>
                            <td>ID</td>
                            <td>Nombre de usuario</td>
                            <td>Correo Electrónico</td>
                            <td>Código</td>
                            <td>Tipo</td>
                            <td>Modificado en</td>
                        </ul>
                    </td>
                    {users?.map((user) => (
                        <li key={user.id}>
                            <ul>
                                <td>
                                    <img
                                        src={
                                            user.avatar
                                                ? user.avatar
                                                : VITE_DEFAULT_PROFILE_PIC
                                        }
                                        alt="User Avatar"
                                        width={100}
                                    />
                                </td>
                                <td>{user.id}</td>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td>{user.code ? user.code : '-'}</td>
                                <td>{user.role}</td>
                                <td>{user.modifiedAt}</td>
                            </ul>
                        </td>
                    ))}
                </ul>
            </article>
        </main>
    );

 */
